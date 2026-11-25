export const ROLES = {
  ADMIN: 'Administrador',
  CASHIER: 'Cajero',
  WAREHOUSE: 'Bodeguero',
} as const;

export interface OpcionMenu {
  titulo: string;
  ruta: string;
  escribir: string[];
  ver?: string[];
}

export interface GrupoMenu {
  titulo: string;
  opciones: OpcionMenu[];
}

export const MENU: GrupoMenu[] = [
  {
    titulo: 'Ventas',
    opciones: [
      {
        titulo: 'Nueva venta',
        ruta: '/nueva-venta',
        escribir: [ROLES.ADMIN, ROLES.CASHIER],
        ver: [ROLES.ADMIN, ROLES.CASHIER],
      },
      { titulo: 'Pedidos', ruta: '/pedidos', escribir: [ROLES.ADMIN, ROLES.CASHIER] },
      { titulo: 'Detalle de pedidos', ruta: '/detalle-pedidos', escribir: [ROLES.ADMIN, ROLES.CASHIER] },
      { titulo: 'Comprobantes', ruta: '/comprobantes', escribir: [ROLES.ADMIN, ROLES.CASHIER] },
      { titulo: 'Reclamos', ruta: '/reclamos', escribir: [ROLES.ADMIN, ROLES.CASHIER] },
      { titulo: 'Clientes', ruta: '/clientes', escribir: [ROLES.ADMIN, ROLES.CASHIER] },
    ],
  },
  {
    titulo: 'Inventario',
    opciones: [
      { titulo: 'Productos', ruta: '/productos', escribir: [ROLES.ADMIN, ROLES.WAREHOUSE] },
      { titulo: 'Proveedores', ruta: '/proveedores', escribir: [ROLES.ADMIN, ROLES.WAREHOUSE] },
      { titulo: 'Detalle de proveedores', ruta: '/detalle-proveedores', escribir: [ROLES.ADMIN, ROLES.WAREHOUSE] },
    ],
  },
  {
    titulo: 'Administración',
    opciones: [
      { titulo: 'Empleados', ruta: '/empleados', escribir: [ROLES.ADMIN] },
      { titulo: 'Cajas', ruta: '/cajas', escribir: [ROLES.ADMIN] },
      { titulo: 'Usuarios', ruta: '/usuarios', escribir: [ROLES.ADMIN], ver: [ROLES.ADMIN] },
    ],
  },
];
