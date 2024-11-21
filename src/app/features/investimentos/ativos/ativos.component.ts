import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonRefresher, IonRefresherContent, IonRow, IonSpinner, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { AtivoUsuarioService } from 'src/app/shared/services/ativo_usuario/ativo_usuario.service';

@Component({
  selector: 'app-ativos',
  templateUrl: './ativos.component.html',
  styleUrls: ['./ativos.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    IonSpinner, 
    IonCol, 
    IonContent, 
    IonHeader,
    IonToolbar, 
    IonTitle, 
    IonGrid, 
    IonRow, 
    IonButton,
    IonRefresher, 
    IonRefresherContent,
  ],
})
export class AtivosComponent  implements OnInit {
  @ViewChild('barChart', { static: false }) barChart!: ElementRef;
  private chart: Chart<'pie'> | undefined;
  public investimentos: any[] = [];
  private idUser = 1;
  private categoriaId!: number;
  public isLoading = true;

  constructor(
    private readonly ativoUsuarioService: AtivoUsuarioService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id'); // Obtém o ID da rota
      if (id) {
        this.categoriaId = Number(id); // Converte o ID para número
        this.loadData(); // Carrega os dados usando o ID
      } else {
        console.error('ID da categoria não encontrado na rota!');
      }
    });
  }

  loadData() {
    this.ativoUsuarioService.findAll(this.idUser, this.categoriaId).subscribe({
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

  navigateToCadastrarAtivo() {
    this.router.navigate(['tabs/investimentos/ativos/cadastrar']);
  }

  editarInvestimento(idAtivo: number) {
    console.log('ID do ativo:', idAtivo);
    this.router.navigate(['tabs/investimentos/ativos/editar', idAtivo]);
  }

  createChart() {
    if (!this.barChart || !this.barChart.nativeElement) {
      console.error('Elemento barChart não está disponível!');
      return;
    }

    const totalPrecoMedio = this.investimentos.reduce(
      (acc, item) => acc + item.saldoAtual,
      0
    );
    const labels = this.investimentos.map((item) => item.sigla_ativo.toUpperCase());
    const data = this.investimentos.map(
      (item) => (item.saldoAtual / totalPrecoMedio) * 100
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

  public transformToUpperCase(value: string) {
    return value.toUpperCase();
  }

  getVariacaoClass(rentabilidade: number): string {
    return rentabilidade >= 0 ? 'positivo' : 'negativo';
  }

  getVariacaoIcon(rentabilidade: number): string {
    return rentabilidade >= 0 ? 'caret-up-outline' : 'caret-down-outline';
  }

  getCategoriaDescricao(): string {
    return this.investimentos.length > 0 ? this.investimentos[0].desc_categoria : '';
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
