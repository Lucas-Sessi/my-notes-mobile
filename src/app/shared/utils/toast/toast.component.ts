import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root', // Disponível globalmente
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  async showToast(message: string, color: 'success' | 'danger' | 'primary' = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 3000, // Duração em milissegundos
      position: 'top', // Posição do toast (top, middle, bottom)
      color,
    });

    await toast.present();
  }

  async success(message: string) {
    await this.showToast(message, 'success');
  }

  async error(message: string) {
    await this.showToast(message, 'danger');
  }

  async info(message: string) {
    await this.showToast(message, 'primary');
  }
}
