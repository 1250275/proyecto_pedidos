import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { GrupoMenu } from '../../constants/roles';

@Component({
  selector: 'app-inicio',
  standalone: false,
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent implements OnInit {
  grupos: GrupoMenu[] = [];

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.grupos = this.auth.menuPermitido();
  }

  puedeEscribir(roles: string[]): boolean {
    return this.auth.tieneRol(roles);
  }

  // Saludo según la hora
  get saludo(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }

  get fechaHoy(): string {
    const f = new Date().toLocaleDateString('es-GT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return f.charAt(0).toUpperCase() + f.slice(1);
  }

  // Botón destacado: busca "Nueva venta" dentro de los grupos permitidos
  get nuevaVenta() {
    return this.grupos.flatMap((g) => g.opciones).find((o) => o.titulo === 'Nueva venta');
  }

  private readonly iconos: Record<string, string> = {
    'Nueva venta': 'M6 6h15l-1.5 9h-12z M6 6 5 3H2 M9 20.5a1 1 0 1 0 0 .01 M18 20.5a1 1 0 1 0 0 .01',
    'Pedidos': 'M9 4h6v3H9z M7 5H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2 M8 12h8 M8 16h5',
    'Detalle de pedidos': 'M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01',
    'Comprobantes': 'M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z M14 3v5h5 M9 13h6 M9 17h6',
    'Reclamos': 'M12 3 2 20h20z M12 10v4 M12 17h.01',
    'Clientes': 'M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2 M9.5 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7 M21 20v-2a4 4 0 0 0-3-3.9 M16 3.1a3.5 3.5 0 0 1 0 6.8',
    'Productos': 'M21 8 12 3 3 8v8l9 5 9-5z M3 8l9 5 9-5 M12 13v8',
    'Proveedores': 'M1 6h13v11H1z M14 10h4l3 3v4h-7z M5.5 19.5a1.5 1.5 0 1 0 0 .01 M17.5 19.5a1.5 1.5 0 1 0 0 .01',
    'Detalle de proveedores': 'M4 4h16v6H4z M4 14h16v6H4z M8 7h.01 M8 17h.01',
    'Empleados': 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z M8 11a2 2 0 1 0 0-.01 M5.5 16c.5-1.5 4.5-1.5 5 0 M14 10h4 M14 14h4',
    'Cajas': 'M5 3h14v6H5z M3 9h18v12H3z M7 14h2 M11 14h2 M15 14h2 M7 18h10',
    'Usuarios': 'M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z M12 11a2 2 0 1 0 0-.01 M8.5 16c.7-2 6.3-2 7 0',
  };

  private readonly descripciones: Record<string, string> = {
    'Nueva venta': 'Registrar una venta',
    'Pedidos': 'Consultar y gestionar pedidos',
    'Detalle de pedidos': 'Productos de cada pedido',
    'Comprobantes': 'Comprobantes emitidos',
    'Reclamos': 'Reclamos de clientes',
    'Clientes': 'Datos de clientes',
    'Productos': 'Catálogo y stock',
    'Proveedores': 'Proveedores registrados',
    'Detalle de proveedores': 'Precios por proveedor',
    'Empleados': 'Personal de la tienda',
    'Cajas': 'Dinero en caja',
    'Usuarios': 'Accesos y roles',
  };

  icono(titulo: string): string {
    return this.iconos[titulo] ?? 'M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7h-7z M13 13h7v7h-7z';
  }

  descripcion(titulo: string): string {
    return this.descripciones[titulo] ?? 'Abrir módulo';
  }
}