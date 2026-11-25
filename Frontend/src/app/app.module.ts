import {
  NgModule,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { NavegacionComponent } from './components/navegacion/navegacion.component';
import { credentialsInterceptor } from './interceptors/credentials.interceptor';
import { CajasComponent } from './components/cajas/cajas.component';
import { CajasEditComponent } from './components/cajas-edit/cajas-edit.component';
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
import { ComprobantesComponent } from './components/comprobantes/comprobantes.component';
import { ComprobantesEditComponent } from './components/comprobantes-edit/comprobantes-edit.component';
import { ReclamosComponent } from './components/reclamos/reclamos.component';
import { ReclamosEditComponent } from './components/reclamos-edit/reclamos-edit.component';
import { DetallePedidosComponent } from './components/detalle-pedidos/detalle-pedidos.component';
import { DetallePedidosEditComponent } from './components/detalle-pedidos-edit/detalle-pedidos-edit.component';
import { DetalleProveedoresComponent } from './components/detalle-proveedores/detalle-proveedores.component';
import { DetalleProveedoresEditComponent } from './components/detalle-proveedores-edit/detalle-proveedores-edit.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { UsuariosEditComponent } from './components/usuarios-edit/usuarios-edit.component';
import { FiltroPipe } from './pipes/filtro.pipe';
import { BarraTablaComponent } from './components/barra-tabla/barra-tabla.component';
import { NuevaVentaComponent } from './components/nueva-venta/nueva-venta.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InicioComponent,
    NavegacionComponent,
    CajasComponent,
    CajasEditComponent,
    EmpleadosComponent,
    EmpleadosEditComponent,
    ClientesComponent,
    ClientesEditComponent,
    ProductosComponent,
    ProductosEditComponent,
    ProveedoresComponent,
    ProveedoresEditComponent,
    PedidosComponent,
    PedidosEditComponent,
    ComprobantesComponent,
    ComprobantesEditComponent,
    ReclamosComponent,
    ReclamosEditComponent,
    DetallePedidosComponent,
    DetallePedidosEditComponent,
    DetalleProveedoresComponent,
    DetalleProveedoresEditComponent,
    UsuariosComponent,
    UsuariosEditComponent,
    FiltroPipe,
    BarraTablaComponent,
    NuevaVentaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([credentialsInterceptor])),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
