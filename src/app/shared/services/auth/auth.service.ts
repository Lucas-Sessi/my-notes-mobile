import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NativeBiometric } from 'capacitor-native-biometric';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';
  private server = 'my-notes-mobile';

  constructor(private http: HttpClient) {}

  // Login manual e salvando na biometria
  async login(email: string, password: string): Promise<void> {
    try {
      const hashedPassword = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);

      const response: any = await this.http
        .post(`${this.apiUrl}/login`, { email, password: hashedPassword })
        .toPromise();

      const token = response.data.access_token;

      await this.clearCredentials();
      
      await this.saveToken(token);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw new Error('Erro no login.');
    }
  }

  // Recupera o token da biometria
  async getToken(): Promise<string | null> {
    try {
      const credentials = await NativeBiometric.getCredentials({
        server: this.server,
      });
      return credentials.password;
    } catch (error) {
      console.error('Erro ao recuperar token:', error);
      return null;
    }
  }

  // Salva o token na biometria
  private async saveToken(token: string): Promise<void> {
    try {
      await NativeBiometric.setCredentials({
        username: this.tokenKey,
        password: token,
        server: this.server,
      });
    } catch (error) {
      console.error('Erro ao salvar token na biometria:', error);
      throw new Error('Erro ao salvar token.');
    }
  }

  // Limpa credenciais salvas na biometria
  async clearCredentials(): Promise<void> {
    try {
      await NativeBiometric.deleteCredentials({ server: this.server });
      console.log('Credenciais apagadas da biometria.');
    } catch (error) {
      console.warn('Nenhuma credencial para apagar ou erro ao tentar limpar:', error);
    }
  }

   // Autenticação com biometria
   async authenticateWithBiometrics(): Promise<string | null> {
    try {
      // Verifica a identidade biométrica
      await NativeBiometric.verifyIdentity({
        reason: 'Use sua biometria para acessar o app',
        title: 'Autenticação Biométrica',
      });

      // Recupera o token da biometria
      const token = await this.getToken();

      if (!token) {
        console.warn('Token não encontrado.');
        return null;
      }
      
      return token;
    } catch (error) {
      console.error('Erro na autenticação biométrica:', error);
      return null;
    }
  }
}
