import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { producto } from '../../Interfaces/user';
import { DataService } from '../../Services/data.service';

@Component({
  selector: 'app-productos-edit',
  standalone: false,
  templateUrl: './productos-edit.component.html',
  styleUrl: './productos-edit.component.css',
})
export class ProductosEditComponent implements OnInit {
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

  constructor(private Data: DataService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    if (params['id']) {
      this.Data.getOne(params['id'], '/products').subscribe({
        next: (res) => (this.user = res),
        error: (err) => {
          alert(err);
          this.router.navigate(['/productos']);
        },
      });
    }
  }

  updateUser(f: NgForm) {
    if (f.invalid) return;
    if (Number(this.user.precio_venta) < Number(this.user.precio_compra)) {
      alert('El precio de venta no puede ser menor que el precio de compra');
      return;
    }
    this.Data.update(this.user.id_producto!, this.user, '/products').subscribe({
      next: () => {
        alert('Registro Actualizado');
        this.router.navigate(['/productos']);
      },
      error: (err) => alert(err),
    });
  }
}
