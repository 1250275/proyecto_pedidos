import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

export interface ItemCarrito {
  id_producto: number;
  nombre: string;
  precio_venta: number;
  stock: number;
  cantidad: number;
}

interface EstadoCarrito {
  items: ItemCarrito[];
  dni_cliente: string | null;
  id_gaveta: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  items: ItemCarrito[] = [];
  dni_cliente: string | null = null;
  id_gaveta: number | null = null;
  private clave = '';

  constructor(private auth: AuthService) {}

  cargar() {
    this.clave = 'carrito_' + (this.auth.usuario?.id_usuario ?? 'anonimo');
    try {
      const guardado: EstadoCarrito = JSON.parse(localStorage.getItem(this.clave) || 'null');
      this.items = guardado?.items ?? [];
      this.dni_cliente = guardado?.dni_cliente ?? null;
      this.id_gaveta = guardado?.id_gaveta ?? null;
    } catch {
      this.items = [];
    }
  }

  guardar() {
    try {
      const estado: EstadoCarrito = { items: this.items, dni_cliente: this.dni_cliente, id_gaveta: this.id_gaveta };
      localStorage.setItem(this.clave, JSON.stringify(estado));
    } catch {}
  }

  item(idProducto: number): ItemCarrito | undefined {
    return this.items.find((i) => i.id_producto === idProducto);
  }

  agregar(producto: any) {
    const existente = this.item(producto.id_producto);
    if (existente) {
      this.cambiarCantidad(producto.id_producto, existente.cantidad + 1);
      return;
    }
    if (producto.stock < 1) return;
    this.items.push({
      id_producto: producto.id_producto,
      nombre: producto.nombre,
      precio_venta: Number(producto.precio_venta),
      stock: producto.stock,
      cantidad: 1,
    });
    this.guardar();
  }

  cambiarCantidad(idProducto: number, cantidad: number) {
    const item = this.item(idProducto);
    if (!item) return;
    const nueva = Math.floor(Number(cantidad) || 0);
    if (nueva < 1) {
      this.quitar(idProducto);
      return;
    }
    item.cantidad = Math.min(nueva, item.stock);
    this.guardar();
  }

  quitar(idProducto: number) {
    this.items = this.items.filter((i) => i.id_producto !== idProducto);
    this.guardar();
  }

  vaciar() {
    this.items = [];
    this.guardar();
  }

  actualizarProductos(productos: any[]) {
    for (const item of [...this.items]) {
      const p = productos.find((x) => x.id_producto === item.id_producto);
      if (!p || p.stock < 1) {
        this.items = this.items.filter((i) => i.id_producto !== item.id_producto);
        continue;
      }
      item.nombre = p.nombre;
      item.precio_venta = Number(p.precio_venta);
      item.stock = p.stock;
      item.cantidad = Math.min(item.cantidad, p.stock);
    }
    this.guardar();
  }

  subtotal(item: ItemCarrito): number {
    return item.precio_venta * item.cantidad;
  }

  get total(): number {
    return this.items.reduce((suma, i) => suma + this.subtotal(i), 0);
  }

  get unidades(): number {
    return this.items.reduce((suma, i) => suma + i.cantidad, 0);
  }
}
