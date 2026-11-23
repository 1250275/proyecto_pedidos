import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { gaveta } from '../../Interfaces/user';
import { DataService } from '../../Services/data.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-gavetas',
  standalone: false,
  templateUrl: './gavetas.component.html',
  styleUrl: './gavetas.component.css',
})
export class GavetasComponent implements OnInit {
  TUser: any = [];
  filterPost = '';
  user: gaveta = {
    id_gaveta: null,
    monto_dinero: null,
  };
  puedeEscribir = false;
  esAdmin = false;

  constructor(private Data: DataService, private auth: AuthService) {}

  ngOnInit(): void {
    this.puedeEscribir = this.auth.puedeEscribir('/gavetas');
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
    delete this.user.id_gaveta;
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
    if (!confirm('¿Desea eliminar la gaveta ' + id + '?')) return;
    this.Data.delete(id, '/drawers').subscribe({
      next: () => {
        alert('Registro Eliminado');
        this.getUser();
      },
      error: (err) => alert(err),
    });
  }
}
