import { Injectable } from '@angular/core';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userName = '';
  private userEmail = '';
  private authToken = '';
  private readonly apiUrl = '/api';

  constructor() {
    this.authToken = localStorage.getItem('soufo-auth-token') || '';
    this.userEmail = localStorage.getItem('soufo-user-email') || '';
    this.userName = localStorage.getItem('soufo-user-name') || '';
  }

  setUserName(name: string) {
    this.userName = name;
    localStorage.setItem('soufo-user-name', name);
  }

  getUserName(): string {
    return this.userName || 'Usuário';
  }

  setUserEmail(email: string) {
    this.userEmail = email;
    localStorage.setItem('soufo-user-email', email);
  }

  getEmail(): string {
    return this.userEmail;
  }

  setAuthToken(token: string) {
    this.authToken = token;
    localStorage.setItem('soufo-auth-token', token);
  }

  getAuthToken(): string {
    return this.authToken || localStorage.getItem('soufo-auth-token') || '';
  }

  async login(email: string, password: string): Promise<AuthResponse | null> {
    const response = await fetch(`${this.apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  }

  async register(payload: RegisterPayload): Promise<AuthResponse | null> {
    const response = await fetch(`${this.apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: payload.email,
        password: payload.senha,
        firstName: payload.nome,
        lastName: payload.sobrenome
      })
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  }
}
