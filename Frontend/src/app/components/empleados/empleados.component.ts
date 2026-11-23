import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { empleado } from '../../Interfaces/user';
import { DataService } from '../../Services/data.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-empleados',
  standalone: false,
  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.css',
})
export class EmpleadosComponent implements OnInit {
  TUser: any = [];
  filterPost = '';
  user: empleado = {
    id_empleado: null,
    nombre: null,
    apellidos: null,
    dni: null,
    email: null,
    cargo: null,
    fecha_ingreso: null,
    fecha_nacimiento: null,
  };
  puedeEscribir = false;
  esAdmin = false;

  constructor(private Data: DataService, private auth: AuthService) {}

  ngOnInit(): void {
    this.puedeEscribir = this.auth.puedeEscribir('/empleados');
    this.esAdmin = this.auth.esAdmin;
    this.getUser();
  }

  getUser() {
    this.Data.getAll('/employees').subscribe({
      next: (res) => (this.TUser = res),
      error: (err) => console.error(err),
    });
  }

  AgregarValor(f: NgForm) {
    if (f.invalid) return;
    delete this.user.id_empleado;
    this.Data.save(this.user, '/employees').subscribe({
      next: () => {
        alert('Registro Almacenado');
        f.resetForm();
        this.getUser();
      },
      error: (err) => alert(err),
    });
  }

  EliminarData(id: number, nombre: string) {
    if (!confirm('¿Desea eliminar al empleado ' + nombre + '?')) return;
    this.Data.delete(id, '/employees').subscribe({
      next: () => {
        alert('Registro Eliminado');
        this.getUser();
      },
      error: (err) => alert(err),
    });
  }
}
