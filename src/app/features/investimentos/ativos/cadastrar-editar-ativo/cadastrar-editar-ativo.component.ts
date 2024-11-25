import {
  CommonModule,
} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AtivoInvestimentoService } from 'src/app/shared/services/ativo_investimento/ativo_investimento.service';
import { AtivoUsuarioService } from 'src/app/shared/services/ativo_usuario/ativo_usuario.service';
import { ToastService } from 'src/app/shared/utils/toast/toast.component';

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
    private readonly ativoInvestimentoService: AtivoInvestimentoService,
    private readonly toastService: ToastService,
  ) {
    this.ativoForm = this.fb.group({
      id_usuario: [1],
      id_ativo: [null, [Validators.required]],
      nota_ativo: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
      qtd_cateira: [null, [Validators.required, Validators.min(1)]],
      preco_medio: [null, [Validators.required, Validators.min(1)]],
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
    this.ativoUsuarioSService.findOneById(id).subscribe({
      next: (response) => {
          this.findAtivosInvestimentos();
    
          this.ativoForm.patchValue({
            id_usuario: response.data.id_usuario,
            id_ativo: response.data.id_ativo,
            nota_ativo: response.data.nota_ativo,
            qtd_cateira: response.data.qtd_cateira,
            preco_medio: response.data.preco_medio,
          });
    
          // this.isLoading = false;
      },
      error: (error) => {
        this.toastService.error('Erro ao carregar ativo!');
        console.error('Erro ao listar investimentos:', error);
      }
    });
  }

  private findAtivosInvestimentos() {
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

  private createAtivo(data: any) {
    this.ativoUsuarioSService.create(data).subscribe({
      next: () => {
        this.toastService.success('Ativo cadastrado com sucesso!');
        
        this.isLoading = false;

        this.router.navigate(['/tabs/investimentos']);
      },
      error: (error) => {
        this.isLoading = false;

        this.toastService.error('Erro ao criar ativo!');
      },
    });
  }

  private updateAtivo(data: any) {
    this.ativoUsuarioSService.update(this.ativoId as number, data).subscribe({
      next: () => {
        this.toastService.success('Ativo atualizado com sucesso!');

        this.isLoading = false;

        this.router.navigate(['/tabs/investimentos']);
      },
      error: (error) => {
        this.isLoading = false;

        this.toastService.error('Erro ao atualizar ativo!');
      },
    });
  }

  public onSubmit() {
    if (this.ativoForm.invalid) {
      this.toastService.error('Preencha todos os campos corretamente.');
      return;
    }

    if (this.ativoForm.valid) {
      this.isLoading = true;
      
      const formData = this.ativoForm.value;

      if (this.isEditMode) {
        return this.updateAtivo(formData);
      }

      return this.createAtivo(formData);
    }
  }
}
