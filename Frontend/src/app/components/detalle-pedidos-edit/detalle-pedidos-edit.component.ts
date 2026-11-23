import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { detalle_pedido } from '../../Interfaces/user';
import { DataService } from '../../Services/data.service';

@Component({
  selector: 'app-detalle-pedidos-edit',
  standalone: false,
  templateUrl: './detalle-pedidos-edit.component.html',
  styleUrl: './detalle-pedidos-edit.component.css',
})
export class DetallePedidosEditComponent implements OnInit {
  user: detalle_pedido = {
    id_pedido: null,
    id_producto: null,
    cantidad: null,
    sub_total: null,
  };
  producto: any = null;
  precioUnitario = 0;

  constructor(private Data: DataService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    this.Data.getOne(params['pedido'] + '/' + params['producto'], '/order-details').subscribe({
      next: (res) => {
        this.user = res;
        this.precioUnitario = Number(res.sub_total) / res.cantidad;
      },
      error: (err) => {
        alert(err);
        this.volver();
      },
    });
    this.Data.getOne(params['producto'], '/products').subscribe((res) => (this.producto = res));
  }

  calcularSubtotal() {
    this.user.sub_total = this.user.cantidad ? Number((this.precioUnitario * this.user.cantidad).toFixed(2)) : null;
  }

  volver() {
    this.router.navigate(['/detalle-pedidos'], { queryParams: { pedido: this.user.id_pedido } });
  }

  updateUser(f: NgForm) {
    if (f.invalid) return;
    const id = this.user.id_pedido + '/' + this.user.id_producto;
    this.Data.update(id, { cantidad: this.user.cantidad }, '/order-details').subscribe({
      next: () => {
        alert('Registro Actualizado');
        this.volver();
      },
      error: (err) => alert(err),
    });
  }
}
