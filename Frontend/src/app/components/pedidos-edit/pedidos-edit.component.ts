import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { pedido } from '../../Interfaces/user';
import { DataService } from '../../Services/data.service';

@Component({
  selector: 'app-pedidos-edit',
  standalone: false,
  templateUrl: './pedidos-edit.component.html',
  styleUrl: './pedidos-edit.component.css',
})
export class PedidosEditComponent implements OnInit {
  user: pedido = {
    id_pedido: null,
    total: null,
    fecha_hora: null,
    dni_cliente: null,
    id_empleado: null,
    id_caja: null,
  };
  Clientelist: any = [];
  Empleadolist: any = [];
  Cajalist: any = [];

  constructor(private Data: DataService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.Data.getDropListClientes().subscribe((data: any) => (this.Clientelist = data));
    this.Data.getDropListEmpleados().subscribe((data: any) => (this.Empleadolist = data));
    this.Data.getDropListCajas().subscribe((data: any) => (this.Cajalist = data));

    const params = this.activatedRoute.snapshot.params;
    if (params['id']) {
      this.Data.getOne(params['id'], '/orders').subscribe({
        next: (res) => (this.user = res),
        error: (err) => {
          alert(err);
          this.router.navigate(['/pedidos']);
        },
      });
    }
  }

  updateUser(f: NgForm) {
    if (f.invalid) return;
    const cambios = {
      dni_cliente: this.user.dni_cliente,
      id_empleado: this.user.id_empleado,
      id_caja: this.user.id_caja,
    };
    this.Data.update(this.user.id_pedido!, cambios, '/orders').subscribe({
      next: () => {
        alert('Registro Actualizado');
        this.router.navigate(['/pedidos']);
      },
      error: (err) => alert(err),
    });
  }
}
