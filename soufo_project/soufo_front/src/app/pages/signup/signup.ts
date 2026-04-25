import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user';

// Validador de comparação de senhas
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const senha = control.get('senha');
  const confirmarSenha = control.get('confirmarSenha');

  return senha && confirmarSenha && senha.value !== confirmarSenha.value
    ? { passwordMismatch: true }
    : null;
};

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  showModal = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.signupForm = this.fb.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required]
    }, {
      // AQUI ESTÁ A MUDANÇA: Registramos o validador no grupo
      validators: passwordMatchValidator
    });
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  confirmCancel() {
    this.router.navigate(['/login']);
  }

  save() {
    // Agora o valid levará em conta se as senhas batem
    if (this.signupForm.valid) {
      const nomeCompleto = this.signupForm.value.nome;
      this.userService.setUserName(nomeCompleto);
      this.router.navigate(['/login']);
    } else {
      // Se o erro for especificamente das senhas, você pode customizar o aviso
      if (this.signupForm.errors?.['passwordMismatch']) {
        alert('As senhas digitadas não são iguais.');
      } else {
        alert('Por favor, preencha todos os campos corretamente.');
      }
    }
  }
}
