import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { cliente } from '../../Interfaces/user';
import { DataService } from '../../Services/data.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-clientes',
  standalone: false,
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css',
})
export class ClientesComponent implements OnInit {
  TUser: any = [];
  filterPost = '';
  user: cliente = {
    dni_cliente: null,
    nombre: null,
    apellido: null,
    telefono: null,
    email: null,
    direccion: null,
    fecha_nacimiento: null,
  };
  puedeEscribir = false;
  esAdmin = false;

  constructor(private Data: DataService, private auth: AuthService) {}

  ngOnInit(): void {
    this.puedeEscribir = this.auth.puedeEscribir('/clientes');
    this.esAdmin = this.auth.esAdmin;
    this.getUser();
  }

  getUser() {
    this.Data.getAll('/customers').subscribe({
      next: (res) => (this.TUser = res),
      error: (err) => console.error(err),
    });
  }

  AgregarValor(f: NgForm) {
    if (f.invalid) return;
    this.Data.save(this.user, '/customers').subscribe({
      next: () => {
        alert('Registro Almacenado');
        f.resetForm();
        this.getUser();
      },
      error: (err) => alert(err),
    });
  }

  EliminarData(id: string, nombre: string) {
    if (!confirm('¿Desea eliminar al cliente ' + nombre + '?')) return;
    this.Data.delete(id, '/customers').subscribe({
      next: () => {
        alert('Registro Eliminado');
        this.getUser();
      },
      error: (err) => alert(err),
    });
  }
}
