import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="container">
      <div class="card">
        <h2>Recuperar Senha</h2>
        <p>Digite seu e-mail para receber uma senha temporária.</p>
        <input type="email" [(ngModel)]="email" placeholder="seu@email.com">

        <div class="actions">
          <button (click)="sendEmail()">Enviar E-mail</button>
          <button class="link" (click)="back()">Voltar</button>
        </div>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor(private router: Router) {}

  sendEmail() {
    if (this.email.includes('@')) {
      // Simulação sem backend
      alert(`Um e-mail com a senha temporária 'TEMP123' foi enviado para ${this.email}`);
      this.router.navigate(['/login']);
    } else {
      alert('Por favor, insira um e-mail válido.');
    }
  }

  back() {
    this.router.navigate(['/login']);
  }
}
