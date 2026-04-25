// home.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `<h1>Seja bem-vindo, {{ nome }}!</h1>`
})
export class HomeComponent implements OnInit {
  nome: string = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.nome = this.userService.getUserName();
  }
}
