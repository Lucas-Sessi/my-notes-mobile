import { IonList, IonInput, IonItem, IonSpinner, IonCol, IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonButton, IonLabel } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AtivoUsuarioService } from 'src/app/shared/services/ativo_usuario/ativo_usuario.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calcular-aporte',
  templateUrl: './calcular-aporte.component.html',
  styleUrls: ['./calcular-aporte.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonList,
    IonSpinner, IonCol, IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonButton, FormsModule, IonLabel, IonItem, IonInput
  ],
})
export class CalcularAporteComponent {
  aporte = null;
  distribuicao: any[] = [];
  public valorResidual: number | undefined;
  idUser = 1;
  isLoading = false;

  constructor(private ativoUsuarioService: AtivoUsuarioService) {}

  calcularAporte() {
    this.isLoading = true;

    const data = {
      aporte: this.aporte,
      userId: this.idUser
    }

    this.ativoUsuarioService.calcularAporte(data).subscribe({
      next: (response) => {
        console.log('Distribuição:', response.data);
        this.distribuicao = response.data.distribuicao;
        this.valorResidual = response.data.valorResidual;

        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erro ao calcular distribuição:', error);
      }
    });
  }

  public transformToUpperCase(value: string) {
    return value.toUpperCase();
  }
}
