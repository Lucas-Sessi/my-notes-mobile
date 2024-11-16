import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonSpinner, IonCol, IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { AtivoUsuarioService } from 'src/app/shared/services/ativo_usuario/ativo_usuario.service';

@Component({
  selector: 'app-investimentos-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonSpinner, IonCol, IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow
  ],
})
export class HomePage implements OnInit {
  @ViewChild('barChart', { static: false }) barChart!: ElementRef;
  private chart: Chart<'pie'> | undefined;
  public investimentos: any[] = [];
  private idUser = 1;
  public isLoading = true;

  constructor(private readonly ativoUsuarioService: AtivoUsuarioService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.ativoUsuarioService.findAll(this.idUser).subscribe({
      next: (response) => {
        this.investimentos = response.data || [];
        this.isLoading = false;

        // Garante que o gráfico será criado após a renderização do DOM
        setTimeout(() => this.createChart(), 0);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erro ao listar investimentos:', error);
      },
    });
  }

  createChart() {
    if (!this.barChart || !this.barChart.nativeElement) {
      console.error('Elemento barChart não está disponível!');
      return;
    }

    const totalPrecoMedio = this.investimentos.reduce(
      (acc, item) => acc + item.preco_medio,
      0
    );
    const labels = this.investimentos.map((item) => item.desc_ativo);
    const data = this.investimentos.map(
      (item) => (item.preco_medio / totalPrecoMedio) * 100
    );

    const colors = this.investimentos.map(
      (_, index) => `hsl(${(index * 360) / this.investimentos.length}, 70%, 60%)`
    );

    const config: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Distribuição de Ativos (%)',
            data: data,
            backgroundColor: colors,
            borderColor: '#ffffff',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#ffffff',
            }
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                const value = tooltipItem.raw as number;
                return `${tooltipItem.label}: ${value.toFixed(2)}%`;
              },
            },
          },
          datalabels: {
            color: '#fff',
            formatter: (value: number) => `${value.toFixed(2)}%`,
            anchor: 'center',
            align: 'end',
            offset: 10,
            font: {
              size: 10,
              weight: 'bold',
            },
          },
        },
      },
      plugins: [DataLabelsPlugin as any],
    };

    this.chart = new Chart(this.barChart.nativeElement, config);
  }
}
