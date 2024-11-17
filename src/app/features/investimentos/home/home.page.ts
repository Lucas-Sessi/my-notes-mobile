import { CategoriaInvestimentoService } from './../../../shared/services/categoria_investimento/categoria-investimento.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonRefresher, IonRefresherContent, IonButton, IonSpinner, IonCol, IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { AtivoUsuarioService } from 'src/app/shared/services/ativo_usuario/ativo_usuario.service';
import { CategoriasComponent } from '../categorias/categorias.component';
import { Router } from '@angular/router';
import { CategoriaUsuarioService } from 'src/app/shared/services/categoria-usuario/categoria-usuario.service';

@Component({
  selector: 'app-investimentos-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonSpinner, IonCol, IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonButton,
    IonRefresher, IonRefresherContent,
    CategoriasComponent,
  ],
})
export class HomePage implements OnInit {
  @ViewChild('barChart', { static: false }) barChart!: ElementRef;
  private chart: Chart<'pie'> | undefined;
  public categorias: any[] = [];
  public isLoading = true;
  private idUser = 1

  constructor(
    private readonly categoriaUsuarioService: CategoriaUsuarioService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.categoriaUsuarioService.findAll(this.idUser).subscribe({
      next: (response) => {
        console.log('Investimentos:', response.data);
        this.categorias = response.data || [];
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

  navigateToCalcularAporte() {
    this.router.navigate(['tabs/investimentos/calcular-aporte']);
  }

  navigateToCategoria(id: number) {
    console.log('ID da categoria:', id);
    this.router.navigate(['tabs/investimentos/ativos', id]);
  }

  createChart() {
    if (!this.barChart || !this.barChart.nativeElement) {
      console.error('Elemento barChart não está disponível!');
      return;
    }

    const totalPrecoMedio = this.categorias.reduce(
      (acc, item) => acc + item.percentualReal,
      0
    );
    const labels = this.categorias.map((item) => item.desc_categoria);
    const data = this.categorias.map(
      (item) => (item.percentualReal / totalPrecoMedio) * 100
    );

    const colors = this.categorias.map(
      (_, index) => `hsl(${(index * 360) / this.categorias.length}, 70%, 60%)`
    );

    const config: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Distribuição das Categorias (%)',
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

  doRefresh(event: any) {
    // Atualiza os dados
    this.loadData();
  
    // Aguarda 1 segundo (simulação de carregamento) antes de concluir o refresh
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
