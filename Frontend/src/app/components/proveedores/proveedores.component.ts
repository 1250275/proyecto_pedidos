import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { proveedor } from '../../Interfaces/user';
import { DataService } from '../../Services/data.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-proveedores',
  standalone: false,
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.css',
})
export class ProveedoresComponent implements OnInit {
  TUser: any = [];
  filterPost = '';
  user: proveedor = {
    id_proveedor: null,
    nombre: null,
    telefono: null,
    n_cuenta: null,
    email: null,
  };
  puedeEscribir = false;
  esAdmin = false;

  constructor(private Data: DataService, private auth: AuthService) {}

  ngOnInit(): void {
    this.puedeEscribir = this.auth.puedeEscribir('/proveedores');
    this.esAdmin = this.auth.esAdmin;
    this.getUser();
  }

  getUser() {
    this.Data.getAll('/suppliers').subscribe({
      next: (res) => (this.TUser = res),
      error: (err) => console.error(err),
    });
  }

  AgregarValor(f: NgForm) {
    if (f.invalid) return;
    delete this.user.id_proveedor;
    this.Data.save(this.user, '/suppliers').subscribe({
      next: () => {
        alert('Registro Almacenado');
        f.resetForm();
        this.getUser();
      },
      error: (err) => alert(err),
    });
  }

  EliminarData(id: number, nombre: string) {
    if (!confirm('¿Desea eliminar al proveedor ' + nombre + '?')) return;
    this.Data.delete(id, '/suppliers').subscribe({
      next: () => {
        alert('Registro Eliminado');
        this.getUser();
      },
      error: (err) => alert(err),
    });
  }
}
