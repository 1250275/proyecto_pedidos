import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { detalle_proveedores } from '../../Interfaces/user';
import { DataService } from '../../Services/data.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-detalle-proveedores',
  standalone: false,
  templateUrl: './detalle-proveedores.component.html',
  styleUrl: './detalle-proveedores.component.css',
})
export class DetalleProveedoresComponent implements OnInit {
  TUser: any = [];
  filterPost = '';
  user: detalle_proveedores = {
    id_producto: null,
    id_proveedor: null,
    precio_proveedor: null,
  };
  Productolist: any = [];
  Proveedorlist: any = [];
  puedeEscribir = false;
  esAdmin = false;

  constructor(private Data: DataService, private auth: AuthService) {}

  ngOnInit(): void {
    this.puedeEscribir = this.auth.puedeEscribir('/detalle-proveedores');
    this.esAdmin = this.auth.esAdmin;
    this.Data.getDropListProductos().subscribe((data: any) => (this.Productolist = data));
    this.Data.getDropListProveedores().subscribe((data: any) => (this.Proveedorlist = data));
    this.getUser();
  }

  getUser() {
    this.Data.getAll('/product-suppliers').subscribe({
      next: (res) => (this.TUser = res),
      error: (err) => console.error(err),
    });
  }

  nombreProducto(id: number): string {
    return this.Productolist.find((p: any) => p.id_producto === id)?.nombre ?? String(id);
  }

  nombreProveedor(id: number): string {
    return this.Proveedorlist.find((p: any) => p.id_proveedor === id)?.nombre ?? String(id);
  }

  textoBusqueda = (d: any) =>
    [this.nombreProducto(d.id_producto), this.nombreProveedor(d.id_proveedor), d.precio_proveedor].join(' ');

  AgregarValor(f: NgForm) {
    if (f.invalid) return;
    this.Data.save(this.user, '/product-suppliers').subscribe({
      next: () => {
        alert('Registro Almacenado');
        f.resetForm();
        this.getUser();
      },
      error: (err) => alert(err),
    });
  }

  EliminarData(idProducto: number, idProveedor: number) {
    if (!confirm('¿Desea quitar a ' + this.nombreProveedor(idProveedor) + ' como proveedor de ' + this.nombreProducto(idProducto) + '?')) return;
    this.Data.delete(idProducto + '/' + idProveedor, '/product-suppliers').subscribe({
      next: () => {
        alert('Registro Eliminado');
        this.getUser();
      },
      error: (err) => alert(err),
    });
  }
}
