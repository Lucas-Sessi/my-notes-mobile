import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSpinner,
  IonContent,
} from '@ionic/angular/standalone';
import { AuthService } from '../shared/services/auth.service';
import { SessionService } from '../shared/services/session.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSpinner,
    FormsModule,
    CommonModule,
  ],
})
export class LoginPage implements OnInit {
  email = '';
  password = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  // Verifica se o token existe ao inicializar
  async ngOnInit() {
    try {
      const token = await this.authService.getToken();
      if (token) {
        // Se o token existe, tenta login biométrico automaticamente
        await this.loginWithBiometrics();
      }
    } catch (error) {
      console.error('Erro ao verificar o token:', error);
    }
  }

  // Login Manual
  async login() {
    this.isLoading = true;
    try {
      const token = await this.authService.login(this.email, this.password);
      this.sessionService.setToken(token); // Salva o token na sessão
      this.router.navigate(['']); // Redireciona para a área autenticada
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Login Biométrico
  async loginWithBiometrics() {
    this.isLoading = true;
    try {
      const token = await this.authService.authenticateWithBiometrics();
      if (token) {
        this.sessionService.setToken(token); // Salva o token na sessão
        this.router.navigate(['']); // Redireciona para a área autenticada
      } else {
        console.error('Autenticação biométrica falhou ou token não encontrado.');
      }
    } catch (error) {
      console.error('Erro na autenticação biométrica:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
