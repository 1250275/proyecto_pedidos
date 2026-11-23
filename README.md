# proyecto_pedidos

Sistema de pedidos para la base de datos `bd_tienda`:

- `Backend/`: NodeJS (Express + MySQL), con inicio de sesión mediante JWT en cookie `httpOnly` y autorización por rol.
- `Frontend/`: Angular 21 con `NgModule`, Bootstrap 5 y Angular Material (menú), con CRUD de todas las tablas, búsqueda y exportación a Excel y PDF.

## Requisitos

- Node.js 20.19, 22.12 o superior (lo que pide Angular 21) y npm
- MySQL 8
- Angular CLI 21 (`npm install -g @angular/cli`)

## Puesta en marcha del backend

1. Ejecutar en MySQL `Backend/database/Estructura_DB.sql` y luego `Backend/database/Ingresar_Datos.sql`.
   - Si la base ya existía antes de agregar usuarios, basta con ejecutar `Backend/database/Agregar_Usuarios.sql` y luego `ALTER TABLE empleado DROP COLUMN credencial;`.
2. En `Backend/`, copiar `.env.template` como `.env` y completar los valores (incluido un `JWT_SECRET` largo y aleatorio).
3. `npm install`
4. `npm run dev` (con nodemon) o `npm start`

### Variables de entorno

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del backend (3000) |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Conexión a MySQL |
| `JWT_SECRET` | Clave para firmar los tokens (obligatoria) |
| `JWT_EXPIRES_HOURS` | Duración de la sesión en horas (8 por defecto) |
| `CORS_ORIGIN` | Origen del frontend permitido (`http://localhost:4200`) |
| `NODE_ENV` | `production` activa la cookie `Secure` (requiere HTTPS) |

## Puesta en marcha del frontend

Requiere que el backend esté corriendo en `http://localhost:3000`.

1. En `Frontend/`: `npm install`
2. `npm start` y abrir `http://localhost:4200`
3. Iniciar sesión con uno de los usuarios de prueba (ver abajo).

Para generar la versión de producción: `npm run build` (queda en `Frontend/dist/Frontend`).

## Autenticación y roles

- `POST /api/auth/login` guarda el JWT (`id_usuario` y `rol`) en la cookie `httpOnly` `token`.
- Todas las demás rutas requieren sesión. El frontend debe enviar las peticiones con `withCredentials: true`.
- Roles fijos: **Administrador**, **Cajero** y **Bodeguero**. Consultar está permitido para todos; insertar y actualizar depende del rol; eliminar y administrar usuarios es solo para el Administrador.

Usuarios de prueba:

| Usuario | Contraseña | Rol |
|---|---|---|
| `cmejia` | `Admin2026*` | Administrador |
| `alopez` | `Cajero01*` | Cajero |
| `jmartinez` | `Cajero02*` | Cajero |
| `mhernandez` | `Cajero03*` | Cajero |
| `lramirez` | `Bodega01*` | Bodeguero |

Permisos por pantalla (todos los roles pueden consultar todas las tablas, excepto Usuarios):

| Pantalla | Agregar y actualizar | Eliminar |
|---|---|---|
| Nueva venta, Pedidos, Detalle de pedidos, Comprobantes, Reclamos, Clientes | Administrador, Cajero | Administrador |
| Productos, Proveedores, Detalle de proveedores | Administrador, Bodeguero | Administrador |
| Empleados, Gavetas | Administrador | Administrador |
| Usuarios | Administrador (única pantalla que los demás roles no ven) | Administrador |

## Frontend

Angular 21 con `NgModule` (proyecto creado con `ng new Frontend --standalone=false --zoneless=false`), Bootstrap 5 y Angular Material para el menú.

### Funciones

- **Inicio de sesión** con el JWT en cookie `httpOnly`. Al recargar la página la sesión se recupera con `/api/auth/me`; si expira, vuelve al login.
- **Menú responsive** (`mat-menu`) con las opciones permitidas para el rol del usuario.
- **CRUD de las 11 tablas**: formulario para agregar, tabla con botones Actualizar y Eliminar según el rol, y un componente `-edit` por tabla.
- **Listas desplegables** para las llaves foráneas (cliente, empleado, gaveta, pedido, producto, proveedor, rol). En las tablas se muestran los nombres en lugar de los códigos.
- **Nueva venta (carrito de compras)**, para Administrador y Cajero: catálogo de productos con buscador y filtro por categoría, carrito con cantidades limitadas al stock (se conserva al recargar la página), cliente, gaveta, efectivo recibido y cambio. Al confirmar, `POST /api/orders/checkout` registra en una sola transacción el pedido, su detalle, el comprobante, el descuento de stock y la suma a la gaveta. Después se puede imprimir el ticket en PDF (80 mm).
- **Pedidos**: el detalle se agrega desde el botón Detalle de cada pedido. El backend calcula el subtotal y el total del pedido, descuenta el stock de cada producto y mantiene el dinero de la gaveta: cualquier cambio en el total del pedido (agregar, cambiar o quitar productos, eliminar el pedido o cambiarlo de gaveta) se suma o se resta en su gaveta.
- **Buscador** en cada tabla (pipe `filtro`), sin distinguir mayúsculas ni tildes.
- **Exportar a Excel** (`xlsx`) y **Descargar PDF** (`jspdf` + `html2canvas`) de lo que se ve en la tabla, sin la columna de acciones.
- Validación de formularios con Bootstrap y mensajes de error del backend (permisos, registros duplicados, registros en uso, stock insuficiente).

### Estructura (`Frontend/src/app/`)

| Carpeta / archivo | Contenido |
|---|---|
| `Services/data.service.ts` | Servicio genérico: `getAll`, `getOne`, `save`, `update`, `delete` y los `getDropList...` para las listas desplegables |
| `Services/auth.service.ts` | Login, logout, usuario actual y permisos por rol |
| `Services/export.service.ts` | Exportar la tabla a Excel y a PDF, y el ticket de venta |
| `Services/carrito.service.ts` | Estado del carrito de compras (guardado en el navegador por usuario) |
| `interceptors/credentials.interceptor.ts` | Envía la cookie de sesión (`withCredentials`) y vuelve al login si el backend responde 401 |
| `guards/auth.guard.ts` | Protege las rutas; con `data: { roles: [...] }` limita por rol |
| `pipes/filtro.pipe.ts` | Filtro de búsqueda de las tablas |
| `constants/roles.ts` | Roles y opciones del menú con los roles que pueden editar cada tabla |
| `Interfaces/user.ts` | Interfaces de las tablas |
| `components/login`, `inicio`, `navegacion` | Pantalla de login, página de inicio y menú |
| `components/barra-tabla` | Buscador y botones de Excel y PDF que usan todas las tablas |
| `components/<tabla>` y `components/<tabla>-edit` | Listado con formulario y pantalla de actualizar de cada tabla |

Los colores están definidos como variables en `src/styles.css` (principal `#AA0E1B`, encabezado de tabla `#F26440`, filas `#FDEFED`, éxito `#2D8B76`, warning `#AD2B0B`).

Los componentes se generan con los nombres de clase (`ng generate component components/clientes` crea `clientes.component.ts`).

## Endpoints

La documentación completa de cada endpoint (esquemas, acceso por rol, ejemplos y respuestas) está en [Backend/documentation/API.md](Backend/documentation/API.md).

| Recurso | Ruta |
|---|---|
| Autenticación | `/api/auth` (`login`, `logout`, `me`, `change-password`) |
| Usuarios | `/api/users` |
| Roles | `/api/roles` |
| Gavetas | `/api/drawers` |
| Empleados | `/api/employees` |
| Clientes | `/api/customers` |
| Productos | `/api/products` |
| Proveedores | `/api/suppliers` |
| Pedidos | `/api/orders` (y `POST /api/orders/checkout` para ventas desde el carrito) |
| Comprobantes | `/api/receipts` |
| Reclamos | `/api/complaints` |
| Detalle de pedidos | `/api/order-details/:orderId/:productId` |
| Detalle de proveedores | `/api/product-suppliers/:productId/:supplierId` |

Las tablas siguen el patrón del curso: `GET /` listar, `GET /:id` obtener, `POST /` insertar, `POST /:id` actualizar y `DELETE /:id` eliminar.
