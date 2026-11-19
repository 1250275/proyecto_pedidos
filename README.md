# proyecto_pedidos

Backend en NodeJS (Express + MySQL) para la base de datos `bd_tienda`, con inicio de sesión mediante JWT en cookie `httpOnly` y autorización por rol.

## Puesta en marcha

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
| Pedidos | `/api/orders` |
| Comprobantes | `/api/receipts` |
| Reclamos | `/api/complaints` |
| Detalle de pedidos | `/api/order-details/:orderId/:productId` |
| Detalle de proveedores | `/api/product-suppliers/:productId/:supplierId` |

Las tablas siguen el patrón del curso: `GET /` listar, `GET /:id` obtener, `POST /` insertar, `POST /:id` actualizar y `DELETE /:id` eliminar.
