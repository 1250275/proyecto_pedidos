import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { GavetasComponent } from './components/gavetas/gavetas.component';
import { GavetasEditComponent } from './components/gavetas-edit/gavetas-edit.component';
import { EmpleadosComponent } from './components/empleados/empleados.component';
import { EmpleadosEditComponent } from './components/empleados-edit/empleados-edit.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { ClientesEditComponent } from './components/clientes-edit/clientes-edit.component';
import { ProductosComponent } from './components/productos/productos.component';
import { ProductosEditComponent } from './components/productos-edit/productos-edit.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { ProveedoresEditComponent } from './components/proveedores-edit/proveedores-edit.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { PedidosEditComponent } from './components/pedidos-edit/pedidos-edit.component';
import { DetallePedidosComponent } from './components/detalle-pedidos/detalle-pedidos.component';
import { DetallePedidosEditComponent } from './components/detalle-pedidos-edit/detalle-pedidos-edit.component';
import { ComprobantesComponent } from './components/comprobantes/comprobantes.component';
import { ComprobantesEditComponent } from './components/comprobantes-edit/comprobantes-edit.component';
import { ReclamosComponent } from './components/reclamos/reclamos.component';
import { ReclamosEditComponent } from './components/reclamos-edit/reclamos-edit.component';
import { DetalleProveedoresComponent } from './components/detalle-proveedores/detalle-proveedores.component';
import { DetalleProveedoresEditComponent } from './components/detalle-proveedores-edit/detalle-proveedores-edit.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { UsuariosEditComponent } from './components/usuarios-edit/usuarios-edit.component';
import { NuevaVentaComponent } from './components/nueva-venta/nueva-venta.component';
import { authGuard, loginGuard } from './guards/auth.guard';
import { ROLES } from './constants/roles';

const soloAdmin = [ROLES.ADMIN];
const adminCajero = [ROLES.ADMIN, ROLES.CASHIER];
const adminBodega = [ROLES.ADMIN, ROLES.WAREHOUSE];

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'inicio', component: InicioComponent, canActivate: [authGuard] },

  { path: 'gavetas', component: GavetasComponent, canActivate: [authGuard] },
  { path: 'gavetas/edit/:id', component: GavetasEditComponent, canActivate: [authGuard], data: { roles: soloAdmin } },
  { path: 'empleados', component: EmpleadosComponent, canActivate: [authGuard] },
  { path: 'empleados/edit/:id', component: EmpleadosEditComponent, canActivate: [authGuard], data: { roles: soloAdmin } },
  { path: 'clientes', component: ClientesComponent, canActivate: [authGuard] },
  { path: 'clientes/edit/:id', component: ClientesEditComponent, canActivate: [authGuard], data: { roles: adminCajero } },
  { path: 'productos', component: ProductosComponent, canActivate: [authGuard] },
  { path: 'productos/edit/:id', component: ProductosEditComponent, canActivate: [authGuard], data: { roles: adminBodega } },
  { path: 'proveedores', component: ProveedoresComponent, canActivate: [authGuard] },
  { path: 'proveedores/edit/:id', component: ProveedoresEditComponent, canActivate: [authGuard], data: { roles: adminBodega } },

  { path: 'nueva-venta', component: NuevaVentaComponent, canActivate: [authGuard], data: { roles: adminCajero } },
  { path: 'pedidos', component: PedidosComponent, canActivate: [authGuard] },
  { path: 'pedidos/edit/:id', component: PedidosEditComponent, canActivate: [authGuard], data: { roles: adminCajero } },
  { path: 'detalle-pedidos', component: DetallePedidosComponent, canActivate: [authGuard] },
  { path: 'detalle-pedidos/edit/:pedido/:producto', component: DetallePedidosEditComponent, canActivate: [authGuard], data: { roles: adminCajero } },
  { path: 'comprobantes', component: ComprobantesComponent, canActivate: [authGuard] },
  { path: 'comprobantes/edit/:id', component: ComprobantesEditComponent, canActivate: [authGuard], data: { roles: adminCajero } },
  { path: 'reclamos', component: ReclamosComponent, canActivate: [authGuard] },
  { path: 'reclamos/edit/:id', component: ReclamosEditComponent, canActivate: [authGuard], data: { roles: adminCajero } },
  { path: 'detalle-proveedores', component: DetalleProveedoresComponent, canActivate: [authGuard] },
  { path: 'detalle-proveedores/edit/:producto/:proveedor', component: DetalleProveedoresEditComponent, canActivate: [authGuard], data: { roles: adminBodega } },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [authGuard], data: { roles: soloAdmin } },
  { path: 'usuarios/edit/:id', component: UsuariosEditComponent, canActivate: [authGuard], data: { roles: soloAdmin } },

  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
