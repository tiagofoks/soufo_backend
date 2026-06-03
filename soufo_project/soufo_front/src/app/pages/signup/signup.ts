import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, AuthResponse } from '../../services/user';

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
      validators: passwordMatchValidator
    });
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  confirmCancel() {
    this.router.navigate(['/login']);
  }

  async save() {
    if (!this.signupForm.valid) {
      this.signupForm.markAllAsTouched();

      if (this.signupForm.errors?.['passwordMismatch']) {
        alert('As senhas digitadas não são iguais.');
      } else {
        alert('Por favor, preencha todos os campos corretamente.');
      }

      return;
    }

    const payload = this.signupForm.value;
    const response: AuthResponse | null = await this.userService.register(payload);

    if (!response) {
      alert('Não foi possível criar a conta. Verifique os dados e tente novamente.');
      return;
    }

    this.userService.setUserName(`${response.firstName} ${response.lastName}`);
    this.userService.setAuthToken(response.token);
    this.router.navigate(['/login']);
  }
}
