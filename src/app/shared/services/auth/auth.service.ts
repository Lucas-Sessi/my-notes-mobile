import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NativeBiometric } from 'capacitor-native-biometric';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';
  private server = 'my-notes-mobile';
  private sessionToken: string | null = null;

  constructor(
    private http: HttpClient,
    private sessionService: SessionService,
  ) {}

  async login(email: string, password: string): Promise<string> {
    try {
      const hashedPassword = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);

      const response: any = await this.http
        .post(`${this.apiUrl}/login`, { email, password: hashedPassword })
        .toPromise();

      const token = response.data.access_token;

      await this.clearCredentials();

      await NativeBiometric.verifyIdentity({
        reason: 'Autenticação necessária para salvar o token.',
        title: 'Confirmação Biométrica',
      });

      await this.saveToken(token);

      this.sessionToken = token;

      return token;
    } catch (error) {
      throw new Error('Erro no login');
    }
  }

  private async saveToken(token: string): Promise<void> {
    try {
      await NativeBiometric.setCredentials({
        username: this.tokenKey,
        password: token,
        server: this.server,
      });

      this.sessionService.setToken(token);
    } catch (error) {
      throw new Error('Erro ao salvar o token');
    }
  }

  async getToken(): Promise<string | null> {
    if (this.sessionToken) {
      return this.sessionToken;
    }
  
    try {
      const credentials = await NativeBiometric.getCredentials({
        server: this.server,
      });
      
      return credentials.password;
    } catch (error) {
      return null;
    }
  }
  

  async authenticateWithBiometrics(): Promise<string | null> {
    try {
      await NativeBiometric.verifyIdentity({
        reason: 'Use sua biometria para acessar o app',
        title: 'Autenticação Biométrica',
      });

      return this.getToken();
    } catch (error) {
      return null;
    }
  }

  async clearCredentials(): Promise<void> {
    try {
      await NativeBiometric.deleteCredentials({ server: this.server });
      
      this.sessionService.clearSession();
    } catch (error) {
      console.warn('Nenhuma credencial para apagar ou erro ao tentar limpar:', error);
    }
  }  
}