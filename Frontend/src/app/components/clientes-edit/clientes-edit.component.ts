import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { cliente } from '../../Interfaces/user';
import { DataService } from '../../Services/data.service';

@Component({
  selector: 'app-clientes-edit',
  standalone: false,
  templateUrl: './clientes-edit.component.html',
  styleUrl: './clientes-edit.component.css',
})
export class ClientesEditComponent implements OnInit {
  user: cliente = {
    dni_cliente: null,
    nombre: null,
    apellido: null,
    telefono: null,
    email: null,
    direccion: null,
    fecha_nacimiento: null,
  };

  constructor(private Data: DataService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    if (params['id']) {
      this.Data.getOne(params['id'], '/customers').subscribe({
        next: (res) => (this.user = res),
        error: (err) => {
          alert(err);
          this.router.navigate(['/clientes']);
        },
      });
    }
  }

  updateUser(f: NgForm) {
    if (f.invalid) return;
    this.Data.update(this.user.dni_cliente!, this.user, '/customers').subscribe({
      next: () => {
        alert('Registro Actualizado');
        this.router.navigate(['/clientes']);
      },
      error: (err) => alert(err),
    });
  }
}
