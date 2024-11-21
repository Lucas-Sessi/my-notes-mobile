import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonList, IonRow, IonSpinner, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AtivoUsuarioService } from 'src/app/shared/services/ativo_usuario/ativo_usuario.service';
import { ToastService } from 'src/app/shared/utils/toast/toast.component';

@Component({
  selector: 'app-calcular-aporte',
  templateUrl: './calcular-aporte.component.html',
  styleUrls: ['./calcular-aporte.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonList,
    IonSpinner, 
    IonCol, 
    IonContent, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonGrid, 
    IonRow, 
    IonButton, 
    FormsModule, 
    IonLabel, 
    IonItem, 
    IonInput,
  ],
})
export class CalcularAporteComponent {
  aporte = null;
  distribuicao: any[] = [];
  public valorResidual: number | undefined;
  idUser = 1;
  isLoading = false;

  constructor(
    private ativoUsuarioService: AtivoUsuarioService,
    private readonly toastService: ToastService,
  ) {}

  public calcularAporte() {
    this.isLoading = true;

    const data = {
      aporte: this.aporte,
      userId: this.idUser
    }

    this.ativoUsuarioService.calcularAporte(data).subscribe({
      next: (response) => {
        this.distribuicao = response.data.distribuicao;
        this.valorResidual = response.data.valorResidual;

        this.isLoading = false;

        this.toastService.success('Distribuição calculada com sucesso!');
      },
      error: (error) => {
        this.isLoading = false;

        this.toastService.error('Erro ao calcular distribuição!');
      }
    });
  }

  public transformToUpperCase(value: string) {
    return value.toUpperCase();
  }
}
