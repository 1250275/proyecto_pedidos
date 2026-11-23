import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { producto } from '../../Interfaces/user';
import { DataService } from '../../Services/data.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-productos',
  standalone: false,
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css',
})
export class ProductosComponent implements OnInit {
  TUser: any = [];
  filterPost = '';
  user: producto = {
    id_producto: null,
    nombre: null,
    marca: null,
    categoria: null,
    precio_compra: null,
    precio_venta: null,
    stock: null,
    stock_limite: null,
    descripcion: null,
  };
  puedeEscribir = false;
  esAdmin = false;

  constructor(private Data: DataService, private auth: AuthService) {}

  ngOnInit(): void {
    this.puedeEscribir = this.auth.puedeEscribir('/productos');
    this.esAdmin = this.auth.esAdmin;
    this.getUser();
  }

  getUser() {
    this.Data.getAll('/products').subscribe({
      next: (res) => (this.TUser = res),
      error: (err) => console.error(err),
    });
  }

  AgregarValor(f: NgForm) {
    if (f.invalid) return;
    if (Number(this.user.precio_venta) < Number(this.user.precio_compra)) {
      alert('El precio de venta no puede ser menor que el precio de compra');
      return;
    }
    delete this.user.id_producto;
    this.Data.save(this.user, '/products').subscribe({
      next: () => {
        alert('Registro Almacenado');
        f.resetForm();
        this.getUser();
      },
      error: (err) => alert(err),
    });
  }

  EliminarData(id: number, nombre: string) {
    if (!confirm('¿Desea eliminar el producto ' + nombre + '?')) return;
    this.Data.delete(id, '/products').subscribe({
      next: () => {
        alert('Registro Eliminado');
        this.getUser();
      },
      error: (err) => alert(err),
    });
  }
}
