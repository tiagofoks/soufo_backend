import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  userMenuOpen = false;
  eventModalOpen = false;
  eventForm: FormGroup;
  minDate: string = new Date().toISOString().split('T')[0];
  userName = '';
  hackathons: any[] = [];

  constructor(private fb: FormBuilder, private userService: UserService) {
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

  ngOnInit() {
    this.userName = this.userService.getUserName();
    this.fetchHackathons();
  }

  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const [ano, mes, dia] = control.value.split('-').map(Number);
      const dataInput = new Date(ano, mes - 1, dia);

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
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log('Foto selecionada:', file.name);
    }
  }

  async fetchHackathons() {
    try {
      const response = await fetch('http://localhost:8080/api/hackathons');
      if (!response.ok) {
        console.error('Não foi possível buscar hackathons');
        return;
      }

      this.hackathons = await response.json();
    } catch (error) {
      console.error('Erro ao buscar hackathons:', error);
    }
  }

  async saveEvent() {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    const eventData = this.eventForm.value;
    const payload = {
      title: eventData.nome,
      description: `Empresa: ${eventData.empresa}\nApoiadores: ${eventData.apoiadores}\nContato: ${eventData.email}`,
      location: eventData.local,
      startDateTime: `${eventData.dataInicio}T${eventData.horaInicio}`,
      endDateTime: `${eventData.dataFim}T${eventData.horaFim}`,
      organizerId: null
    };

    try {
      const response = await fetch('http://localhost:8080/api/hackathons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        alert('Não foi possível salvar o hackathon. Tente novamente.');
        return;
      }

      const savedHackathon = await response.json();
      this.hackathons = [savedHackathon, ...this.hackathons];
      this.toggleEventModal();
      this.eventForm.reset();
      this.eventForm.markAsUntouched();
    } catch (error) {
      console.error('Erro ao salvar hackathon:', error);
      alert('Erro de rede ao salvar o hackathon.');
    }
  }
}
