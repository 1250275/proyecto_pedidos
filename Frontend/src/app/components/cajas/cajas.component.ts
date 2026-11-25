import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { caja } from '../../Interfaces/user';
import { DataService } from '../../Services/data.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-cajas',
  standalone: false,
  templateUrl: './cajas.component.html',
  styleUrl: './cajas.component.css',
})
export class CajasComponent implements OnInit {
  TUser: any = [];
  filterPost = '';
  user: caja = {
    id_caja: null,
    monto_dinero: null,
  };
  puedeEscribir = false;
  esAdmin = false;

  constructor(private Data: DataService, private auth: AuthService) {}

  ngOnInit(): void {
    this.puedeEscribir = this.auth.puedeEscribir('/cajas');
    this.esAdmin = this.auth.esAdmin;
    this.getUser();
  }

  getUser() {
    this.Data.getAll('/drawers').subscribe({
      next: (res) => (this.TUser = res),
      error: (err) => console.error(err),
    });
  }

  AgregarValor(f: NgForm) {
    if (f.invalid) return;
    delete this.user.id_caja;
    this.Data.save(this.user, '/drawers').subscribe({
      next: () => {
        alert('Registro Almacenado');
        f.resetForm();
        this.getUser();
      },
      error: (err) => alert(err),
    });
  }

  EliminarData(id: number) {
    if (!confirm('¿Desea eliminar la caja ' + id + '?')) return;
    this.Data.delete(id, '/drawers').subscribe({
      next: () => {
        alert('Registro Eliminado');
        this.getUser();
      },
      error: (err) => alert(err),
    });
  }
}
