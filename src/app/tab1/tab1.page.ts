import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { AtivoUsuarioService } from './service/ativo_usuario.service';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ExploreContainerComponent,
  ]
})
export class Tab1Page implements OnInit {
  @ViewChild('barChart', { static: true }) barChart!: ElementRef;
  private chart: Chart<'pie'> | undefined;
  public investimentos: any[] = [];
  private idUser = 1;

  constructor(
    private readonly ativoUsuarioService: AtivoUsuarioService,
  ) {}

  ngOnInit() {
    this.ativoUsuarioService.findAll(this.idUser).subscribe({
      next: (response) => {
        console.log(response.data);
        this.investimentos = response.data || [];
        this.createChart(); // Cria o gráfico após carregar os dados
      },
      error: (error) => {
        console.log('deu erro ao listar: ', error);
      }
    });
  }

  createChart() {
    const totalPrecoMedio = this.investimentos.reduce((acc, item) => acc + item.preco_medio, 0);
    const labels = this.investimentos.map((item) => item.desc_ativo);
    const data = this.investimentos.map((item) => (item.preco_medio / totalPrecoMedio) * 100);

    const colors = this.investimentos.map((_, index) =>
      `hsl(${(index * 360) / this.investimentos.length}, 70%, 60%)`
    );

    const config: ChartConfiguration<'pie'> = {
      type: 'pie', // Tipo do gráfico (pizza)
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Distribuição de Ativos (%)',
            data: data,
            backgroundColor: colors, // Cores dinâmicas para cada segmento
            borderColor: '#ffffff', // Cor da borda dos segmentos
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom', // Coloca a legenda abaixo do gráfico
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
            color: '#fff', // Cor dos percentuais sobre o gráfico
            formatter: (value: number) => `${value.toFixed(2)}%`, // Formata o valor para exibir o percentual
            anchor: 'center',
            align: 'end',
            offset: 10,
            font: {
              size: 10,
              weight: 'bold'
            },
          }
        },
      },
      plugins: [DataLabelsPlugin as any] // Ativa o plugin de DataLabels para exibir os percentuais
    };

    this.chart = new Chart(this.barChart.nativeElement, config);
  }
}
