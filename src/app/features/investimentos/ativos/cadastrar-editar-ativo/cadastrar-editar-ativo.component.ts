import {
  CommonModule,
} from '@angular/common';
import {
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonSpinner,
} from '@ionic/angular/standalone';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AtivoUsuarioService } from 'src/app/shared/services/ativo_usuario/ativo_usuario.service';
import { AtivoInvestimentoService } from 'src/app/shared/services/ativo_investimento/ativo_investimento.service';

@Component({
  selector: 'app-cadastrar-editar-ativo',
  templateUrl: './cadastrar-editar-ativo.component.html',
  styleUrls: ['./cadastrar-editar-ativo.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonSpinner,
  ],
})
export class CadastrarEditarAtivoComponent implements OnInit {
  isLoading = true;
  ativoForm!: FormGroup;
  isEditMode = false;
  ativoId: number | null = null;
  ativosInvestimentosSelect: any[] = [];

  constructor(
    private fb: FormBuilder,
    private ativoUsuarioSService: AtivoUsuarioService,
    private router: Router,
    private route: ActivatedRoute,
    private readonly ativoInvestimentoService: AtivoInvestimentoService
  ) {
    this.ativoForm = this.fb.group({
      id_usuario: [1],
      id_ativo: [null, [Validators.required]],
      nota_ativo: [null, [Validators.required, Validators.min(1), Validators.max(10)]],
      qtd_cateira: [null, [Validators.required, Validators.min(0)]],
      preco_medio: [null, [Validators.required, Validators.min(0)]],
    });    
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id) {
        this.isEditMode = true;
        this.ativoId = Number(id);

        this.loadAtivo(this.ativoId);
      } else {
        this.findAtivosInvestimentos();
      }
    });
  }

  loadAtivo(id: number) {
    this.ativoUsuarioSService.findOneById(id).subscribe((ativo) => {
      this.findAtivosInvestimentos();

      this.ativoForm.patchValue({
        id_usuario: ativo.data.id_usuario,
        id_ativo: ativo.data.id_ativo,
        nota_ativo: ativo.data.nota_ativo,
        qtd_cateira: ativo.data.qtd_cateira,
        preco_medio: ativo.data.preco_medio,
      });

      // this.isLoading = false;
    });
  }

  findAtivosInvestimentos() {
    this.ativoInvestimentoService.findAll().subscribe({
      next: (response) => {
        this.ativosInvestimentosSelect = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao listar investimentos:', error);
      },
    });
  }

  onSubmit() {
    if (this.ativoForm.valid) {
      const formData = this.ativoForm.value;

      if (this.isEditMode) {
        this.ativoUsuarioSService.update(this.ativoId as number, formData).subscribe(() => {
          this.router.navigate(['/ativos']);
        });
      } else {
        this.ativoUsuarioSService.create(formData).subscribe(() => {
          this.router.navigate(['/ativos']);
        });
      }
    }
  }
}
