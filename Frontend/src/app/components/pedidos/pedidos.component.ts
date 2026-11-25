import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { pedido } from '../../Interfaces/user';
import { DataService } from '../../Services/data.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-pedidos',
  standalone: false,
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css',
})
export class PedidosComponent implements OnInit {
  TUser: any = [];
  filterPost = '';
  user: pedido = {};
  Clientelist: any = [];
  Empleadolist: any = [];
  Cajalist: any = [];
  puedeEscribir = false;
  esAdmin = false;

  constructor(private Data: DataService, private auth: AuthService) {}

  ngOnInit(): void {
    this.puedeEscribir = this.auth.puedeEscribir('/pedidos');
    this.esAdmin = this.auth.esAdmin;
    this.user = this.nuevoPedido();
    this.getDropLists();
    this.getUser();
  }

  nuevoPedido(): pedido {
    return {
      id_pedido: null,
      dni_cliente: null,
      id_empleado: this.auth.usuario?.id_empleado ?? null,
      id_caja: null,
    };
  }

  getDropLists() {
    this.Data.getDropListClientes().subscribe((data: any) => (this.Clientelist = data));
    this.Data.getDropListEmpleados().subscribe((data: any) => (this.Empleadolist = data));
    this.Data.getDropListCajas().subscribe((data: any) => (this.Cajalist = data));
  }

  getUser() {
    this.Data.getAll('/orders').subscribe({
      next: (res) => (this.TUser = res),
      error: (err) => console.error(err),
    });
  }

  nombreCliente(dni: string): string {
    const c = this.Clientelist.find((x: any) => x.dni_cliente === dni);
    return c ? c.nombre + ' ' + c.apellido : dni;
  }

  nombreEmpleado(id: number): string {
    const e = this.Empleadolist.find((x: any) => x.id_empleado === id);
    return e ? e.nombre + ' ' + e.apellidos : String(id);
  }

  textoBusqueda = (p: any) =>
    [p.id_pedido, p.fecha_hora, p.dni_cliente, this.nombreCliente(p.dni_cliente), this.nombreEmpleado(p.id_empleado), p.total].join(' ');

  AgregarValor(f: NgForm) {
    if (f.invalid) return;
    delete this.user.id_pedido;
    this.Data.save(this.user, '/orders').subscribe({
      next: (res) => {
        alert('Pedido No. ' + res.id + ' almacenado. Agregue sus productos en Detalle.');
        f.resetForm(this.nuevoPedido());
        this.getUser();
      },
      error: (err) => alert(err),
    });
  }

  EliminarData(id: number) {
    if (!confirm('¿Desea eliminar el pedido No. ' + id + '? Se devolverá el stock de sus productos y su total se restará de la caja.')) return;
    this.Data.delete(id, '/orders').subscribe({
      next: () => {
        alert('Registro Eliminado');
        this.getUser();
      },
      error: (err) => alert(err),
    });
  }
}
