import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { reclamo } from '../../Interfaces/user';
import { DataService } from '../../Services/data.service';
import { AuthService } from '../../Services/auth.service';

export const TIPOS_RECLAMO = ['Producto en mal estado', 'Error de cobro', 'Atención al cliente', 'Devolución', 'Otro'];

@Component({
  selector: 'app-reclamos',
  standalone: false,
  templateUrl: './reclamos.component.html',
  styleUrl: './reclamos.component.css',
})
export class ReclamosComponent implements OnInit {
  TUser: any = [];
  filterPost = '';
  user: reclamo = {};
  Clientelist: any = [];
  Empleadolist: any = [];
  tipos = TIPOS_RECLAMO;
  puedeEscribir = false;
  esAdmin = false;

  constructor(private Data: DataService, private auth: AuthService) {}

  ngOnInit(): void {
    this.puedeEscribir = this.auth.puedeEscribir('/reclamos');
    this.esAdmin = this.auth.esAdmin;
    this.user = this.nuevoReclamo();
    this.Data.getDropListClientes().subscribe((data: any) => (this.Clientelist = data));
    this.Data.getDropListEmpleados().subscribe((data: any) => (this.Empleadolist = data));
    this.getUser();
  }

  nuevoReclamo(): reclamo {
    return {
      id_reclamo: null,
      observaciones: null,
      tipo_reclamo: null,
      dni_cliente: null,
      id_empleado: this.auth.usuario?.id_empleado ?? null,
    };
  }

  getUser() {
    this.Data.getAll('/complaints').subscribe({
      next: (res) => (this.TUser = res),
      error: (err) => console.error(err),
    });
  }

  nombreCliente(dni: string): string {
    const c = this.Clientelist.find((x: any) => x.dni_cliente === dni);
    return c ? c.nombre + ' ' + c.apellido : dni;
  }

  nombreEmpleado(id: number): string {
    const e = this.Empleadolist.find((x: any) => x.id_empleado === id);
    return e ? e.nombre + ' ' + e.apellidos : String(id);
  }

  textoBusqueda = (r: any) =>
    [r.id_reclamo, r.tipo_reclamo, r.observaciones, this.nombreCliente(r.dni_cliente), this.nombreEmpleado(r.id_empleado)].join(' ');

  AgregarValor(f: NgForm) {
    if (f.invalid) return;
    delete this.user.id_reclamo;
    this.Data.save(this.user, '/complaints').subscribe({
      next: () => {
        alert('Registro Almacenado');
        f.resetForm(this.nuevoReclamo());
        this.getUser();
      },
      error: (err) => alert(err),
    });
  }

  EliminarData(id: number) {
    if (!confirm('¿Desea eliminar el reclamo No. ' + id + '?')) return;
    this.Data.delete(id, '/complaints').subscribe({
      next: () => {
        alert('Registro Eliminado');
        this.getUser();
      },
      error: (err) => alert(err),
    });
  }
}
