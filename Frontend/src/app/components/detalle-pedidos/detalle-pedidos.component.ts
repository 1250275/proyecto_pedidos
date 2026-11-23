import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { detalle_pedido } from '../../Interfaces/user';
import { DataService } from '../../Services/data.service';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-detalle-pedidos',
  standalone: false,
  templateUrl: './detalle-pedidos.component.html',
  styleUrl: './detalle-pedidos.component.css',
})
export class DetallePedidosComponent implements OnInit {
  TUser: any = [];
  filterPost = '';
  user: detalle_pedido = {};
  Pedidolist: any = [];
  Productolist: any = [];
  filtroPedido: number | null = null;
  puedeEscribir = false;
  esAdmin = false;

  constructor(
    private Data: DataService,
    private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.puedeEscribir = this.auth.puedeEscribir('/detalle-pedidos');
    this.esAdmin = this.auth.esAdmin;
    const pedido = this.activatedRoute.snapshot.queryParams['pedido'];
    this.filtroPedido = pedido ? Number(pedido) : null;
    this.user = this.nuevoDetalle();
    this.getDropListPedidos();
    this.Data.getDropListProductos().subscribe((data: any) => (this.Productolist = data));
    this.getUser();
  }

  nuevoDetalle(): detalle_pedido {
    return { id_pedido: this.filtroPedido, id_producto: null, cantidad: null, sub_total: null };
  }

  getDropListPedidos() {
    this.Data.getDropListPedidos().subscribe((data: any) => (this.Pedidolist = data));
  }

  getUser() {
    this.Data.getAll('/order-details').subscribe({
      next: (res) => (this.TUser = res),
      error: (err) => console.error(err),
    });
  }

  get detallesFiltrados() {
    if (!this.filtroPedido) return this.TUser;
    return this.TUser.filter((d: any) => d.id_pedido === this.filtroPedido);
  }

  get totalPedido(): number {
    return this.Pedidolist.find((p: any) => p.id_pedido === this.filtroPedido)?.total ?? 0;
  }

  cambiarFiltro() {
    this.router.navigate([], { queryParams: { pedido: this.filtroPedido || null } });
    this.user.id_pedido = this.filtroPedido;
  }

  producto(id: number) {
    return this.Productolist.find((p: any) => p.id_producto === id);
  }

  calcularSubtotal() {
    const p = this.producto(this.user.id_producto!);
    this.user.sub_total = p && this.user.cantidad ? Number((p.precio_venta * this.user.cantidad).toFixed(2)) : null;
  }

  textoBusqueda = (d: any) => [d.id_pedido, this.producto(d.id_producto)?.nombre, d.cantidad, d.sub_total].join(' ');

  AgregarValor(f: NgForm) {
    if (f.invalid) return;
    const p = this.producto(this.user.id_producto!);
    if (p && this.user.cantidad! > p.stock) {
      alert('Stock insuficiente: solo hay ' + p.stock + ' unidades de ' + p.nombre);
      return;
    }
    const nuevo = { id_pedido: this.user.id_pedido, id_producto: this.user.id_producto, cantidad: this.user.cantidad };
    this.Data.save(nuevo, '/order-details').subscribe({
      next: () => {
        alert('Registro Almacenado');
        f.resetForm(this.nuevoDetalle());
        this.refrescar();
      },
      error: (err) =>
        alert(
          String(err).startsWith('Ya existe')
            ? 'Ese producto ya está en el pedido. Use Actualizar para cambiar la cantidad.'
            : err,
        ),
    });
  }

  EliminarData(idPedido: number, idProducto: number) {
    const nombre = this.producto(idProducto)?.nombre ?? idProducto;
    if (!confirm('¿Desea quitar ' + nombre + ' del pedido No. ' + idPedido + '?')) return;
    this.Data.delete(idPedido + '/' + idProducto, '/order-details').subscribe({
      next: () => {
        alert('Registro Eliminado');
        this.refrescar();
      },
      error: (err) => alert(err),
    });
  }

  refrescar() {
    this.getUser();
    this.getDropListPedidos();
    this.Data.getDropListProductos().subscribe((data: any) => (this.Productolist = data));
  }
}
