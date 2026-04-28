import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  userMenuOpen = false;
  eventModalOpen = false;
  eventForm: FormGroup;
  minDate: string = new Date().toISOString().split('T')[0];

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      nome: ['', Validators.required],
      empresa: ['', Validators.required],
      local: ['', Validators.required],
      dataInicio: ['', [Validators.required, this.futureDateValidator()]],
      horaInicio: ['', Validators.required],
      dataFim: ['', Validators.required],
      horaFim: ['', Validators.required],
      apoiadores: [''],
      email: ['', [Validators.required, Validators.email]],
      foto: [null]
    });
  }

    futureDateValidator(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null;

        // Pega apenas a data atual (ano, mês, dia) sem horas
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        // Converte a string do input (YYYY-MM-DD) para data
        const [ano, mes, dia] = control.value.split('-').map(Number);
        const dataInput = new Date(ano, mes - 1, dia);

        // Se a data for menor que hoje, retorna erro. Se for igual ou maior, retorna null (válido)
        return dataInput < hoje ? { pastDate: true } : null;
      };
    }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  toggleEventModal() {
    this.eventModalOpen = !this.eventModalOpen;
  }

  onFileChange(event: any) {
    // Simulação de carregamento de foto
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log('Foto selecionada:', file.name);
    }
  }

  saveEvent() {
    // Verificação de segurança: se o formulário estiver inválido, a função para aqui
    // mas NÃO trava a tela, apenas não executa o "save"
    if (this.eventForm.invalid) {
      // Marcar todos como tocados para exibir as mensagens de erro no HTML
      this.eventForm.markAllAsTouched();
      return;
    }

    // Se chegou aqui, a data é válida
    console.log('Evento salvo:', this.eventForm.value);
    this.toggleEventModal();
    this.eventForm.reset();
  }
}
