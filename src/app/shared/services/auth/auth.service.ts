import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NativeBiometric } from 'capacitor-native-biometric';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';
  private server = 'my-notes-mobile';
  private sessionToken: string | null = null; // Cache local do token na sessão

  constructor(private http: HttpClient) {}

  // Método para login manual
  async login(email: string, password: string): Promise<string> {
    try {
      const hashedPassword = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);

      const response: any = await this.http
        .post(`${this.apiUrl}/login`, { email, password: hashedPassword })
        .toPromise();

        console.warn('fazendo o login, olha o response: ', response, 'aqui temos o response.access_token: ', response.data.access_token)

      const token = response.data.access_token;

      await this.clearCredentials();

      await NativeBiometric.verifyIdentity({
        reason: 'Autenticação necessária para salvar o token.',
        title: 'Confirmação Biométrica',
      });

      // Salva o token na biometria
      await this.saveToken(token);

      // Salva o token na sessão
      this.sessionToken = token;

      return token;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw new Error('Erro no login');
    }
  }

  // Método para salvar o token de forma segura
  private async saveToken(token: string): Promise<void> {
    console.log('Salvando credenciais:', {
      username: this.tokenKey,
      password: token,
      server: this.server,
    });

    try {
      await NativeBiometric.setCredentials({
        username: this.tokenKey, // Identificador único
        password: token,         // O token JWT
        server: this.server,     // Identificador da aplicação
      });

      console.log('salvou o token com sucesso: ', token);
    } catch (error) {
      console.error('Erro ao salvar o token:', error);
      throw new Error('Erro ao salvar o token');
    }
  }

  // Método para recuperar o token salvo na biometria
  async getToken(): Promise<string | null> {
    if (this.sessionToken) {
      console.log('Token encontrado na sessão:', this.sessionToken);
      return this.sessionToken;
    }
  
    try {
      const credentials = await NativeBiometric.getCredentials({
        server: this.server,
      });
      console.log('Credenciais recuperadas:', credentials);
      return credentials.password;
    } catch (error) {
      console.error('Erro ao recuperar token:', error);
      return null;
    }
  }
  

  // Método para autenticar com biometria
  async authenticateWithBiometrics(): Promise<string | null> {
    try {
      await NativeBiometric.verifyIdentity({
        reason: 'Use sua biometria para acessar o app',
        title: 'Autenticação Biométrica',
      });

      // Se autenticado, recupera o token
      return this.getToken();
    } catch (error) {
      console.error('Erro na autenticação biométrica:', error);
      return null;
    }
  }

  async clearCredentials(): Promise<void> {
    try {
      await NativeBiometric.deleteCredentials({ server: this.server });
      console.log('Credenciais antigas apagadas com sucesso.');
    } catch (error) {
      console.warn('Nenhuma credencial para apagar ou erro ao tentar limpar:', error);
    }
  }  
}
