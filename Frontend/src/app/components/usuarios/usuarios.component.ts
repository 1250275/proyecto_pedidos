import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { usuario } from '../../Interfaces/user';
import { DataService } from '../../Services/data.service';
import { AuthService } from '../../Services/auth.service';

export const ESTADOS_USUARIO = ['activo', 'inactivo', 'bloqueado'];

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent implements OnInit {
  TUser: any = [];
  filterPost = '';
  user: usuario = this.nuevoUsuario();
  Empleadolist: any = [];
  Rollist: string[] = [];
  estados = ESTADOS_USUARIO;
  idActual: number | null = null;

  constructor(private Data: DataService, private auth: AuthService) {}

  ngOnInit(): void {
    this.idActual = this.auth.usuario?.id_usuario ?? null;
    this.Data.getDropListEmpleados().subscribe((data: any) => (this.Empleadolist = data));
    this.Data.getDropListRoles().subscribe((data: any) => (this.Rollist = data));
    this.getUser();
  }

  nuevoUsuario(): usuario {
    return { id_empleado: null, nombre_usuario: null, contrasena: null, rol: null, estado: 'activo' };
  }

  getUser() {
    this.Data.getAll('/users').subscribe({
      next: (res) => (this.TUser = res),
      error: (err) => console.error(err),
    });
  }

  get empleadosSinUsuario() {
    return this.Empleadolist.filter((e: any) => !this.TUser.some((u: any) => u.id_empleado === e.id_empleado));
  }

  claseEstado(estado: string): string {
    if (estado === 'activo') return 'text-bg-success';
    if (estado === 'bloqueado') return 'text-bg-warning';
    return 'text-bg-secondary';
  }

  AgregarValor(f: NgForm) {
    if (f.invalid) return;
    this.Data.save(this.user, '/users').subscribe({
      next: () => {
        alert('Registro Almacenado');
        f.resetForm(this.nuevoUsuario());
        this.getUser();
      },
      error: (err) => alert(err),
    });
  }

  EliminarData(id: number, nombre: string) {
    if (!confirm('¿Desea eliminar el usuario ' + nombre + '?')) return;
    this.Data.delete(id, '/users').subscribe({
      next: () => {
        alert('Registro Eliminado');
        this.getUser();
      },
      error: (err) => alert(err),
    });
  }
}
