import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { GrupoMenu } from '../../constants/roles';

@Component({
  selector: 'app-navegacion',
  standalone: false,
  templateUrl: './navegacion.component.html',
  styleUrl: './navegacion.component.css',
})
export class NavegacionComponent implements OnInit {
  menuAbierto = false;
  colapsado = false;
  abiertos: Record<string, boolean> = {};
  grupos: GrupoMenu[] = [];

  // Íconos de Material por título de grupo (ajusta los títulos a los tuyos)
  private iconos: Record<string, string> = {
    'Ventas': 'point_of_sale',
    'Pedidos': 'shopping_cart',
    'Comprobantes': 'receipt_long',
    'Reclamos': 'report_problem',
    'Proveedores': 'local_shipping',
    'Administración': 'admin_panel_settings',
    'Usuarios': 'group',
  };

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.grupos = this.auth.menuPermitido();
  }

  icono(titulo: string): string {
    return this.iconos[titulo] || 'folder';
  }

  toggleGrupo(titulo: string) {
    if (this.colapsado) {
      this.colapsado = false;
      this.abiertos[titulo] = true;
      return;
    }
    this.abiertos[titulo] = !this.abiertos[titulo];
  }

  cerrarMovil() {
    this.menuAbierto = false;
  }

  CerrarSesion() {
    this.menuAbierto = false;
    this.auth.logout();
  }
}