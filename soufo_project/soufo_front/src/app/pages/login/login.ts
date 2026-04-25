// login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  constructor(private router: Router) {}

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }

  goToForgotPassword() {
  this.router.navigate(['/forgot-password']);
}
}
