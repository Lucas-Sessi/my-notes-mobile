import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonSpinner,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ToastService } from 'src/app/shared/utils/toast/toast.component';

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
    private router: Router,
    private toastService: ToastService
  ) {}

  async ngOnInit() {
    try {
      await this.loginWithBiometrics();
    } catch (error) {
      console.error('Erro ao verificar o token:', error);
    }
  }

  async login() {
    this.isLoading = true;
    try {
      const token = await this.authService.login(this.email, this.password);
      
      this.router.navigate(['']);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      await this.toastService.error('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      this.isLoading = false;
    }
  }

  async loginWithBiometrics() {
    this.isLoading = true;
    try {
      const token = await this.authService.authenticateWithBiometrics();

      if (!token) {
        console.warn('Token não encontrado. Fazendo login manual.');
        return await this.toastService.error('Autenticação biométrica falhou. Faça o login.');;
      }

      return this.router.navigate(['']);
    } catch (error) {
      console.error('Erro na autenticação biométrica:', error);
      await this.toastService.error('Autenticação biométrica falhou. Faça o login.');
    } finally {
      this.isLoading = false;
    }
  }
}
