export interface UsuarioSesion {
  id_usuario: number;
  nombre_usuario: string;
  rol: string;
  estado?: string;
  ultimo_acceso?: string | null;
  id_empleado?: number;
  nombre?: string;
  apellidos?: string;
}

export interface Login {
  nombre_usuario: string | null;
  contrasena: string | null;
}

export interface caja {
  id_caja?: number | null;
  monto_dinero?: number | null;
}

export interface empleado {
  id_empleado?: number | null;
  nombre?: string | null;
  apellidos?: string | null;
  dni?: string | null;
  email?: string | null;
  cargo?: string | null;
  fecha_ingreso?: string | null;
  fecha_nacimiento?: string | null;
}

export interface cliente {
  dni_cliente?: string | null;
  nombre?: string | null;
  apellido?: string | null;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  fecha_nacimiento?: string | null;
}

export interface producto {
  id_producto?: number | null;
  nombre?: string | null;
  marca?: string | null;
  categoria?: string | null;
  precio_compra?: number | null;
  precio_venta?: number | null;
  stock?: number | null;
  stock_limite?: number | null;
  descripcion?: string | null;
}

export interface proveedor {
  id_proveedor?: number | null;
  nombre?: string | null;
  telefono?: string | null;
  n_cuenta?: string | null;
  email?: string | null;
}

export interface pedido {
  id_pedido?: number | null;
  total?: number | null;
  fecha_hora?: string | null;
  dni_cliente?: string | null;
  id_empleado?: number | null;
  id_caja?: number | null;
}

export interface comprobante {
  codigo_comprobante?: string | null;
  id_pedido?: number | null;
}

export interface detalle_pedido {
  id_pedido?: number | null;
  id_producto?: number | null;
  cantidad?: number | null;
  sub_total?: number | null;
}

export interface reclamo {
  id_reclamo?: number | null;
  observaciones?: string | null;
  tipo_reclamo?: string | null;
  dni_cliente?: string | null;
  id_empleado?: number | null;
}

export interface detalle_proveedores {
  id_producto?: number | null;
  id_proveedor?: number | null;
  precio_proveedor?: number | null;
}

export interface usuario {
  id_usuario?: number | null;
  id_empleado?: number | null;
  nombre_empleado?: string | null;
  nombre_usuario?: string | null;
  contrasena?: string | null;
  rol?: string | null;
  estado?: string | null;
  intentos_fallidos?: number | null;
  ultimo_acceso?: string | null;
  fecha_creacion?: string | null;
}
