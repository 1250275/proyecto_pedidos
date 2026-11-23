import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { detalle_proveedores } from '../../Interfaces/user';
import { DataService } from '../../Services/data.service';

@Component({
  selector: 'app-detalle-proveedores-edit',
  standalone: false,
  templateUrl: './detalle-proveedores-edit.component.html',
  styleUrl: './detalle-proveedores-edit.component.css',
})
export class DetalleProveedoresEditComponent implements OnInit {
  user: detalle_proveedores = {
    id_producto: null,
    id_proveedor: null,
    precio_proveedor: null,
  };
  nombreProducto = '';
  nombreProveedor = '';

  constructor(private Data: DataService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    this.Data.getOne(params['producto'] + '/' + params['proveedor'], '/product-suppliers').subscribe({
      next: (res) => (this.user = res),
      error: (err) => {
        alert(err);
        this.router.navigate(['/detalle-proveedores']);
      },
    });
    this.Data.getOne(params['producto'], '/products').subscribe((res) => (this.nombreProducto = res.nombre));
    this.Data.getOne(params['proveedor'], '/suppliers').subscribe((res) => (this.nombreProveedor = res.nombre));
  }

  updateUser(f: NgForm) {
    if (f.invalid) return;
    const id = this.user.id_producto + '/' + this.user.id_proveedor;
    this.Data.update(id, { precio_proveedor: this.user.precio_proveedor }, '/product-suppliers').subscribe({
      next: () => {
        alert('Registro Actualizado');
        this.router.navigate(['/detalle-proveedores']);
      },
      error: (err) => alert(err),
    });
  }
}
