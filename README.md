# proyecto_pedidos

Backend en NodeJS (Express + MySQL) para la base de datos `bd_tienda`.

## Puesta en marcha

1. Ejecutar en MySQL `Backend/database/Estructura_DB.sql` y luego `Backend/database/Ingresar_Datos.sql`.
2. En `Backend/`, copiar `.env.template` como `.env` y completar los valores.
3. `npm install`
4. `npm run dev` (con nodemon) o `npm start`

## Endpoints

La documentación completa de cada endpoint (esquemas, ejemplos y respuestas) está en [Backend/documentation/API.md](Backend/documentation/API.md).

Todas las rutas usan el mismo patrón:

| Método | Ruta | Acción |
|---|---|---|
| GET | `/api/<recurso>` | Listar todos |
| POST | `/api/<recurso>` | Insertar |
| GET | `/api/<recurso>/:id` | Obtener por id |
| POST | `/api/<recurso>/:id` | Actualizar por id |
| DELETE | `/api/<recurso>/:id` | Eliminar por id |

| Recurso | Tabla | Llave en la URL |
|---|---|---|
| `drawers` | gaveta | `id_gaveta` |
| `employees` | empleado | `id_empleado` |
| `customers` | cliente | `dni_cliente` |
| `products` | producto | `id_producto` |
| `suppliers` | proveedor | `id_proveedor` |
| `orders` | pedido | `id_pedido` |
| `receipts` | comprobante | `codigo_comprobante` |
| `complaints` | reclamo | `id_reclamo` |
| `order-details` | detalle_pedido | `/:orderId/:productId` |
| `product-suppliers` | detalle_proveedores | `/:productId/:supplierId` |

### Notas

- Empleado: la `credencial` se guarda como hash SHA-256 y nunca se devuelve en las consultas. Al actualizar, si no se envía `credencial`, se conserva la actual.
- Por ahora todas las rutas son públicas; el login con sesión se agregará más adelante.
