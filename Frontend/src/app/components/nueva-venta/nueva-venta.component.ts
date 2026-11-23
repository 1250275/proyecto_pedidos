import { Component, OnInit } from '@angular/core';
import { DataService } from '../../Services/data.service';
import { AuthService } from '../../Services/auth.service';
import { CarritoService, ItemCarrito } from '../../Services/carrito.service';
import { ExportService } from '../../Services/export.service';
import { FiltroPipe } from '../../pipes/filtro.pipe';

@Component({
  selector: 'app-nueva-venta',
  standalone: false,
  templateUrl: './nueva-venta.component.html',
  styleUrl: './nueva-venta.component.css',
})
export class NuevaVentaComponent implements OnInit {
  Productolist: any = [];
  Clientelist: any = [];
  Gavetalist: any = [];
  categorias: string[] = [];
  filterPost = '';
  categoria = '';
  clienteTexto = '';
  efectivo: number | null = null;
  procesando = false;
  venta: any = null;
  private filtro = new FiltroPipe();

  constructor(
    private Data: DataService,
    private auth: AuthService,
    public carrito: CarritoService,
    private exportar: ExportService,
  ) {}

  ngOnInit(): void {
    this.carrito.cargar();
    this.getProductos();
    this.Data.getDropListClientes().subscribe((data: any) => {
      this.Clientelist = data;
      const c = data.find((x: any) => x.dni_cliente === this.carrito.dni_cliente);
      this.clienteTexto = c ? this.etiquetaCliente(c) : '';
    });
    this.Data.getDropListGavetas().subscribe((data: any) => (this.Gavetalist = data));
  }

  getProductos() {
    this.Data.getDropListProductos().subscribe((data: any) => {
      this.Productolist = data;
      this.categorias = [...new Set<string>(data.map((p: any) => p.categoria))].sort();
      this.carrito.actualizarProductos(data);
    });
  }

  get productosFiltrados() {
    const porCategoria = this.categoria
      ? this.Productolist.filter((p: any) => p.categoria === this.categoria)
      : this.Productolist;
    return this.filtro.transform(porCategoria, this.filterPost, (p) => [p.nombre, p.marca, p.categoria].join(' '));
  }

  disponible(p: any): number {
    return p.stock - (this.carrito.item(p.id_producto)?.cantidad ?? 0);
  }

  etiquetaCliente(c: any): string {
    return c.nombre + ' ' + c.apellido + ' - ' + c.dni_cliente;
  }

  elegirCliente(texto: string) {
    const c = this.Clientelist.find((x: any) => this.etiquetaCliente(x) === texto);
    this.carrito.dni_cliente = c ? c.dni_cliente : null;
    this.carrito.guardar();
  }

  elegirGaveta() {
    this.carrito.guardar();
  }

  cambiarCantidad(item: ItemCarrito, cantidad: number) {
    this.carrito.cambiarCantidad(item.id_producto, cantidad);
  }

  get cambio(): number | null {
    if (this.efectivo == null || String(this.efectivo) === '') return null;
    return Number(this.efectivo) - this.carrito.total;
  }

  VaciarCarrito() {
    if (confirm('¿Desea vaciar el carrito?')) this.carrito.vaciar();
  }

  ConfirmarVenta() {
    if (this.carrito.items.length === 0) return alert('El carrito está vacío');
    if (!this.carrito.dni_cliente) return alert('Seleccione el cliente de la lista');
    if (!this.carrito.id_gaveta) return alert('Seleccione la gaveta');
    if (this.cambio != null && this.cambio < 0) return alert('El efectivo recibido no alcanza para el total');
    if (!confirm('¿Confirmar la venta por L ' + this.carrito.total.toFixed(2) + '?')) return;

    const datos = {
      dni_cliente: this.carrito.dni_cliente,
      id_gaveta: this.carrito.id_gaveta,
      productos: this.carrito.items.map((i) => ({ id_producto: i.id_producto, cantidad: i.cantidad })),
    };
    this.procesando = true;
    this.Data.save(datos, '/orders/checkout').subscribe({
      next: (res) => {
        this.procesando = false;
        const cliente = this.Clientelist.find((c: any) => c.dni_cliente === res.dni_cliente);
        this.venta = {
          ...res,
          cliente: cliente ? cliente.nombre + ' ' + cliente.apellido : res.dni_cliente,
          cajero: (this.auth.usuario?.nombre ?? '') + ' ' + (this.auth.usuario?.apellidos ?? ''),
          efectivo: this.cambio != null ? Number(this.efectivo) : null,
          cambio: this.cambio,
        };
        this.carrito.vaciar();
        this.carrito.dni_cliente = null;
        this.carrito.guardar();
        this.clienteTexto = '';
        this.efectivo = null;
        this.getProductos();
      },
      error: (err) => {
        this.procesando = false;
        alert(err);
        this.getProductos();
      },
    });
  }

  verCarrito() {
    document.getElementById('carrito')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  ImprimirTicket() {
    this.exportar.ticket(this.venta);
  }

  NuevaVenta() {
    this.venta = null;
  }
}
