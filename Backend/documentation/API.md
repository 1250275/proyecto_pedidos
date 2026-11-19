# Documentación de la API — bd_tienda

Backend en NodeJS (Express + MySQL) del proyecto **proyecto_pedidos**.

| | |
|---|---|
| **URL base** | `http://localhost:3000/api` |
| **Formato** | JSON (`Content-Type: application/json`) |
| **Autenticación** | Ninguna por ahora. Todas las rutas son públicas; el login con sesión se integrará más adelante. |
| **Fechas** | `date` → `YYYY-MM-DD`, `datetime` → `YYYY-MM-DD HH:MM:SS` |
| **Decimales** | Se envían como número (`105.00`) y MySQL los devuelve como texto (`"105.00"`). |

## Índice

- [Convenciones generales](#convenciones-generales)
- [Gavetas](#gavetas) — `/api/drawers`
- [Empleados](#empleados) — `/api/employees`
- [Clientes](#clientes) — `/api/customers`
- [Productos](#productos) — `/api/products`
- [Proveedores](#proveedores) — `/api/suppliers`
- [Pedidos](#pedidos) — `/api/orders`
- [Comprobantes](#comprobantes) — `/api/receipts`
- [Reclamos](#reclamos) — `/api/complaints`
- [Detalle de pedidos](#detalle-de-pedidos) — `/api/order-details`
- [Detalle de proveedores](#detalle-de-proveedores) — `/api/product-suppliers`

## Convenciones generales

Cada recurso expone las mismas 5 operaciones:

| Método | Ruta | Operación |
|---|---|---|
| `GET` | `/api/{recurso}` | Listar todos |
| `GET` | `/api/{recurso}/{id}` | Obtener uno |
| `POST` | `/api/{recurso}` | Insertar |
| `POST` | `/api/{recurso}/{id}` | Actualizar (se usa `POST`, no `PUT`) |
| `DELETE` | `/api/{recurso}/{id}` | Eliminar |

En las tablas con llave compuesta, `{id}` se reemplaza por las dos llaves: `/{llave1}/{llave2}`.

**Actualización parcial:** al actualizar solo se modifican los campos enviados en el cuerpo; los demás quedan igual.

### Respuestas comunes

| Código | Cuándo | Cuerpo |
|---|---|---|
| `200` | Operación correcta | Ver cada endpoint |
| `404` | No existe un registro con esa llave (obtener, actualizar, eliminar) | `{ "message": "Registro no encontrado" }` |
| `500` | Error de conexión o de MySQL (campo requerido faltante, llave duplicada, llave foránea inexistente, restricción `CHECK`, registro referenciado por otra tabla) | Objeto de error de MySQL |

Ejemplo de error `500` (llave duplicada):

```json
{
  "code": "ER_DUP_ENTRY",
  "errno": 1062,
  "sqlState": "23000",
  "sqlMessage": "Duplicate entry 'ana.lopez@tienda.hn' for key 'empleado.uq_empleado_email'",
  "sql": "insert into empleado set ..."
}
```

Códigos de MySQL más comunes:

| `code` | Significado |
|---|---|
| `ER_DUP_ENTRY` | Llave primaria o campo único repetido |
| `ER_NO_REFERENCED_ROW_2` | La llave foránea enviada no existe |
| `ER_ROW_IS_REFERENCED_2` | No se puede eliminar: otra tabla lo referencia |
| `ER_CHECK_CONSTRAINT_VIOLATED` | No cumple una restricción `CHECK` (montos negativos, email inválido, fechas, etc.) |
| `ER_NO_DEFAULT_FOR_FIELD` | Falta un campo requerido |
| `ER_BAD_FIELD_ERROR` | Se envió un campo que no existe en la tabla |

---

## Gavetas

Cajas registradoras de la tienda.

**Tabla:** `gaveta` · **Ruta base:** `/api/drawers`

### Esquema

| Campo | Tipo | Requerido al insertar | Notas |
|---|---|:---:|---|
| `id_gaveta` | integer | No | Autoincremental. No se envía al insertar. |
| `monto_dinero` | decimal(12,2) | No | Por defecto 0.00. Debe ser >= 0. |

### `GET` /api/drawers

Lista todos los registros de `gaveta`.

**Respuesta `200`**

```json
[
  {
    "id_gaveta": 1,
    "monto_dinero": "2648.00"
  }
]
```

```bash
curl http://localhost:3000/api/drawers
```

### `GET` /api/drawers/{id}

Obtiene un registro por su llave.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | integer | Id de la gaveta (`id_gaveta`) |

**Respuesta `200`**

```json
{
  "id_gaveta": 1,
  "monto_dinero": "2648.00"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

```bash
curl http://localhost:3000/api/drawers/1
```

### `POST` /api/drawers

Inserta un registro nuevo.

**Cuerpo de la petición**

```json
{
  "monto_dinero": 1000.0
}
```

**Respuesta `200`**

```json
{
  "message": "Registro Guardado",
  "id": 11
}
```

`id` es el valor autoincremental generado.

**Respuesta `500`:** falta un campo requerido, llave duplicada, llave foránea inexistente o no se cumple una restricción.

```bash
curl -X POST http://localhost:3000/api/drawers \
  -H "Content-Type: application/json" \
  -d '{"monto_dinero": 1000.0}'
```

### `POST` /api/drawers/{id}

Actualiza un registro. Solo se modifican los campos enviados.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | integer | Id de la gaveta (`id_gaveta`) |

**Cuerpo de la petición**

```json
{
  "monto_dinero": 1500.0
}
```

**Respuesta `200`**

```json
{
  "message": "Registro Actualizado"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

```bash
curl -X POST http://localhost:3000/api/drawers/1 \
  -H "Content-Type: application/json" \
  -d '{"monto_dinero": 1500.0}'
```

### `DELETE` /api/drawers/{id}

Elimina un registro.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | integer | Id de la gaveta (`id_gaveta`) |

**Respuesta `200`**

```json
{
  "message": "Registro Eliminado"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

> **Nota:** Falla con 500 (`ER_ROW_IS_REFERENCED_2`) si la gaveta tiene pedidos.

```bash
curl -X DELETE http://localhost:3000/api/drawers/1
```

[↑ Volver al índice](#índice)

---

## Empleados

Empleados de la tienda. La `credencial` se recibe en texto plano, se guarda como hash SHA-256 y **nunca** se devuelve en las respuestas.

**Tabla:** `empleado` · **Ruta base:** `/api/employees`

### Esquema

| Campo | Tipo | Requerido al insertar | Notas |
|---|---|:---:|---|
| `id_empleado` | integer | No | Autoincremental. No se envía al insertar. |
| `nombre` | string(50) | Sí |  |
| `apellidos` | string(80) | Sí |  |
| `dni` | string(15) | Sí | Único. |
| `email` | string(100) | Sí | Único. Formato válido (`x@y.z`). |
| `cargo` | string(50) | Sí | Ej.: Administrador, Cajero, Bodeguero. |
| `credencial` | string | Sí | Texto plano; el backend guarda el hash SHA-256. Solo escritura. Al actualizar es opcional: si no se envía o va vacía, se conserva la actual. |
| `fecha_ingreso` | date (YYYY-MM-DD) | Sí | Debe ser posterior a `fecha_nacimiento`. |
| `fecha_nacimiento` | date (YYYY-MM-DD) | Sí |  |

### `GET` /api/employees

Lista todos los registros de `empleado`.

**Respuesta `200`**

```json
[
  {
    "id_empleado": 2,
    "nombre": "Ana",
    "apellidos": "López Zelaya",
    "dni": "0801199222222",
    "email": "ana.lopez@tienda.hn",
    "cargo": "Cajero",
    "fecha_ingreso": "2021-06-15",
    "fecha_nacimiento": "1992-09-22"
  }
]
```

```bash
curl http://localhost:3000/api/employees
```

### `GET` /api/employees/{id}

Obtiene un registro por su llave.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | integer | Id del empleado (`id_empleado`) |

**Respuesta `200`**

```json
{
  "id_empleado": 2,
  "nombre": "Ana",
  "apellidos": "López Zelaya",
  "dni": "0801199222222",
  "email": "ana.lopez@tienda.hn",
  "cargo": "Cajero",
  "fecha_ingreso": "2021-06-15",
  "fecha_nacimiento": "1992-09-22"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

```bash
curl http://localhost:3000/api/employees/2
```

### `POST` /api/employees

Inserta un registro nuevo.

**Cuerpo de la petición**

```json
{
  "nombre": "Laura",
  "apellidos": "Paz Midence",
  "dni": "0801199966666",
  "email": "laura.paz@tienda.hn",
  "cargo": "Cajero",
  "credencial": "Cajero04*",
  "fecha_ingreso": "2026-11-18",
  "fecha_nacimiento": "1999-04-10"
}
```

**Respuesta `200`**

```json
{
  "message": "Registro Guardado",
  "id": 11
}
```

`id` es el valor autoincremental generado.

**Respuesta `500`:** falta un campo requerido, llave duplicada, llave foránea inexistente o no se cumple una restricción.

```bash
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Laura", "apellidos": "Paz Midence", "dni": "0801199966666", "email": "laura.paz@tienda.hn", "cargo": "Cajero", "credencial": "Cajero04*", "fecha_ingreso": "2026-11-18", "fecha_nacimiento": "1999-04-10"}'
```

### `POST` /api/employees/{id}

Actualiza un registro. Solo se modifican los campos enviados.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | integer | Id del empleado (`id_empleado`) |

**Cuerpo de la petición**

```json
{
  "cargo": "Administrador"
}
```

**Respuesta `200`**

```json
{
  "message": "Registro Actualizado"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

```bash
curl -X POST http://localhost:3000/api/employees/2 \
  -H "Content-Type: application/json" \
  -d '{"cargo": "Administrador"}'
```

### `DELETE` /api/employees/{id}

Elimina un registro.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | integer | Id del empleado (`id_empleado`) |

**Respuesta `200`**

```json
{
  "message": "Registro Eliminado"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

> **Nota:** Falla con 500 (`ER_ROW_IS_REFERENCED_2`) si el empleado tiene pedidos o reclamos.

```bash
curl -X DELETE http://localhost:3000/api/employees/2
```

[↑ Volver al índice](#índice)

---

## Clientes

Clientes de la tienda. La llave es el DNI (no es autoincremental).

**Tabla:** `cliente` · **Ruta base:** `/api/customers`

### Esquema

| Campo | Tipo | Requerido al insertar | Notas |
|---|---|:---:|---|
| `dni_cliente` | string(15) | Sí | Llave primaria. Se envía al insertar. |
| `nombre` | string(50) | Sí |  |
| `apellido` | string(80) | Sí |  |
| `telefono` | string(20) | No |  |
| `email` | string(100) | No | Único. Formato válido si se envía. |
| `direccion` | string(200) | No |  |
| `fecha_nacimiento` | date (YYYY-MM-DD) | No |  |

### `GET` /api/customers

Lista todos los registros de `cliente`.

**Respuesta `200`**

```json
[
  {
    "dni_cliente": "0801199012345",
    "nombre": "Karla",
    "apellido": "Rodríguez",
    "telefono": "9876-5432",
    "email": "karla.rodriguez@gmail.com",
    "direccion": "Col. Kennedy, Tegucigalpa",
    "fecha_nacimiento": "1990-04-12"
  }
]
```

```bash
curl http://localhost:3000/api/customers
```

### `GET` /api/customers/{id}

Obtiene un registro por su llave.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | string | DNI del cliente (`dni_cliente`) |

**Respuesta `200`**

```json
{
  "dni_cliente": "0801199012345",
  "nombre": "Karla",
  "apellido": "Rodríguez",
  "telefono": "9876-5432",
  "email": "karla.rodriguez@gmail.com",
  "direccion": "Col. Kennedy, Tegucigalpa",
  "fecha_nacimiento": "1990-04-12"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

```bash
curl http://localhost:3000/api/customers/0801199012345
```

### `POST` /api/customers

Inserta un registro nuevo.

**Cuerpo de la petición**

```json
{
  "dni_cliente": "0801199588990",
  "nombre": "Mario",
  "apellido": "Funes",
  "telefono": "9911-2233",
  "email": "mario.funes@gmail.com",
  "direccion": "Col. Lara, Tegucigalpa",
  "fecha_nacimiento": "1995-07-01"
}
```

**Respuesta `200`**

```json
{
  "message": "Registro Guardado",
  "id": "0801199588990"
}
```

`id` es la misma llave enviada en el cuerpo.

**Respuesta `500`:** falta un campo requerido, llave duplicada, llave foránea inexistente o no se cumple una restricción.

```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"dni_cliente": "0801199588990", "nombre": "Mario", "apellido": "Funes", "telefono": "9911-2233", "email": "mario.funes@gmail.com", "direccion": "Col. Lara, Tegucigalpa", "fecha_nacimiento": "1995-07-01"}'
```

### `POST` /api/customers/{id}

Actualiza un registro. Solo se modifican los campos enviados.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | string | DNI del cliente (`dni_cliente`) |

**Cuerpo de la petición**

```json
{
  "telefono": "9911-0000"
}
```

**Respuesta `200`**

```json
{
  "message": "Registro Actualizado"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

```bash
curl -X POST http://localhost:3000/api/customers/0801199012345 \
  -H "Content-Type: application/json" \
  -d '{"telefono": "9911-0000"}'
```

### `DELETE` /api/customers/{id}

Elimina un registro.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | string | DNI del cliente (`dni_cliente`) |

**Respuesta `200`**

```json
{
  "message": "Registro Eliminado"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

> **Nota:** Falla con 500 (`ER_ROW_IS_REFERENCED_2`) si el cliente tiene pedidos o reclamos.

```bash
curl -X DELETE http://localhost:3000/api/customers/0801199012345
```

[↑ Volver al índice](#índice)

---

## Productos

Inventario de productos.

**Tabla:** `producto` · **Ruta base:** `/api/products`

### Esquema

| Campo | Tipo | Requerido al insertar | Notas |
|---|---|:---:|---|
| `id_producto` | integer | No | Autoincremental. No se envía al insertar. |
| `nombre` | string(100) | Sí |  |
| `marca` | string(50) | No |  |
| `categoria` | string(50) | Sí |  |
| `precio_compra` | decimal(10,2) | Sí | Debe ser >= 0. |
| `precio_venta` | decimal(10,2) | Sí | Debe ser >= `precio_compra`. |
| `stock` | integer | No | Por defecto 0. No negativo. |
| `stock_limite` | integer | No | Stock mínimo de alerta. Por defecto 0. |
| `descripcion` | text | No |  |

### `GET` /api/products

Lista todos los registros de `producto`.

**Respuesta `200`**

```json
[
  {
    "id_producto": 1,
    "nombre": "Arroz Blanco 5 lb",
    "marca": "El Granero",
    "categoria": "Granos básicos",
    "precio_compra": "85.00",
    "precio_venta": "105.00",
    "stock": 120,
    "stock_limite": 20,
    "descripcion": "Arroz blanco grano largo"
  }
]
```

```bash
curl http://localhost:3000/api/products
```

### `GET` /api/products/{id}

Obtiene un registro por su llave.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | integer | Id del producto (`id_producto`) |

**Respuesta `200`**

```json
{
  "id_producto": 1,
  "nombre": "Arroz Blanco 5 lb",
  "marca": "El Granero",
  "categoria": "Granos básicos",
  "precio_compra": "85.00",
  "precio_venta": "105.00",
  "stock": 120,
  "stock_limite": 20,
  "descripcion": "Arroz blanco grano largo"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

```bash
curl http://localhost:3000/api/products/1
```

### `POST` /api/products

Inserta un registro nuevo.

**Cuerpo de la petición**

```json
{
  "nombre": "Harina de Maíz 2 lb",
  "marca": "Maseca",
  "categoria": "Abarrotes",
  "precio_compra": 30.0,
  "precio_venta": 40.0,
  "stock": 50,
  "stock_limite": 10,
  "descripcion": "Harina de maíz nixtamalizado"
}
```

**Respuesta `200`**

```json
{
  "message": "Registro Guardado",
  "id": 11
}
```

`id` es el valor autoincremental generado.

**Respuesta `500`:** falta un campo requerido, llave duplicada, llave foránea inexistente o no se cumple una restricción.

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Harina de Maíz 2 lb", "marca": "Maseca", "categoria": "Abarrotes", "precio_compra": 30.0, "precio_venta": 40.0, "stock": 50, "stock_limite": 10, "descripcion": "Harina de maíz nixtamalizado"}'
```

### `POST` /api/products/{id}

Actualiza un registro. Solo se modifican los campos enviados.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | integer | Id del producto (`id_producto`) |

**Cuerpo de la petición**

```json
{
  "precio_venta": 110.0,
  "stock": 100
}
```

**Respuesta `200`**

```json
{
  "message": "Registro Actualizado"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

```bash
curl -X POST http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"precio_venta": 110.0, "stock": 100}'
```

### `DELETE` /api/products/{id}

Elimina un registro.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | integer | Id del producto (`id_producto`) |

**Respuesta `200`**

```json
{
  "message": "Registro Eliminado"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

> **Nota:** Falla con 500 (`ER_ROW_IS_REFERENCED_2`) si el producto aparece en algún `detalle_pedido`. Sus filas en `detalle_proveedores` se eliminan en cascada.

```bash
curl -X DELETE http://localhost:3000/api/products/1
```

[↑ Volver al índice](#índice)

---

## Proveedores

Proveedores de productos.

**Tabla:** `proveedor` · **Ruta base:** `/api/suppliers`

### Esquema

| Campo | Tipo | Requerido al insertar | Notas |
|---|---|:---:|---|
| `id_proveedor` | integer | No | Autoincremental. No se envía al insertar. |
| `nombre` | string(100) | Sí |  |
| `telefono` | string(20) | No |  |
| `n_cuenta` | string(30) | No | Número de cuenta bancaria. |
| `email` | string(100) | No | Único. Formato válido si se envía. |

### `GET` /api/suppliers

Lista todos los registros de `proveedor`.

**Respuesta `200`**

```json
[
  {
    "id_proveedor": 1,
    "nombre": "Distribuidora Central S.A.",
    "telefono": "2234-5678",
    "n_cuenta": "200-01-123456-7",
    "email": "ventas@distcentral.hn"
  }
]
```

```bash
curl http://localhost:3000/api/suppliers
```

### `GET` /api/suppliers/{id}

Obtiene un registro por su llave.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | integer | Id del proveedor (`id_proveedor`) |

**Respuesta `200`**

```json
{
  "id_proveedor": 1,
  "nombre": "Distribuidora Central S.A.",
  "telefono": "2234-5678",
  "n_cuenta": "200-01-123456-7",
  "email": "ventas@distcentral.hn"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

```bash
curl http://localhost:3000/api/suppliers/1
```

### `POST` /api/suppliers

Inserta un registro nuevo.

**Cuerpo de la petición**

```json
{
  "nombre": "Abarrotería El Sol",
  "telefono": "2233-4455",
  "n_cuenta": "100-03-111222-9",
  "email": "ventas@elsol.hn"
}
```

**Respuesta `200`**

```json
{
  "message": "Registro Guardado",
  "id": 11
}
```

`id` es el valor autoincremental generado.

**Respuesta `500`:** falta un campo requerido, llave duplicada, llave foránea inexistente o no se cumple una restricción.

```bash
curl -X POST http://localhost:3000/api/suppliers \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Abarrotería El Sol", "telefono": "2233-4455", "n_cuenta": "100-03-111222-9", "email": "ventas@elsol.hn"}'
```

### `POST` /api/suppliers/{id}

Actualiza un registro. Solo se modifican los campos enviados.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | integer | Id del proveedor (`id_proveedor`) |

**Cuerpo de la petición**

```json
{
  "telefono": "2233-0000"
}
```

**Respuesta `200`**

```json
{
  "message": "Registro Actualizado"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

```bash
curl -X POST http://localhost:3000/api/suppliers/1 \
  -H "Content-Type: application/json" \
  -d '{"telefono": "2233-0000"}'
```

### `DELETE` /api/suppliers/{id}

Elimina un registro.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | integer | Id del proveedor (`id_proveedor`) |

**Respuesta `200`**

```json
{
  "message": "Registro Eliminado"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

> **Nota:** Sus filas en `detalle_proveedores` se eliminan en cascada.

```bash
curl -X DELETE http://localhost:3000/api/suppliers/1
```

[↑ Volver al índice](#índice)

---

## Pedidos

Encabezado de los pedidos (ventas). El detalle de productos está en `order-details`.

**Tabla:** `pedido` · **Ruta base:** `/api/orders`

### Esquema

| Campo | Tipo | Requerido al insertar | Notas |
|---|---|:---:|---|
| `id_pedido` | integer | No | Autoincremental. No se envía al insertar. |
| `total` | decimal(12,2) | No | Por defecto 0.00. Debe ser >= 0. No se calcula automáticamente: enviar la suma de los `sub_total`. |
| `fecha_hora` | datetime (YYYY-MM-DD HH:MM:SS) | No | Por defecto la fecha y hora actual. |
| `dni_cliente` | string(15) | Sí | FK → `cliente.dni_cliente`. |
| `id_empleado` | integer | Sí | FK → `empleado.id_empleado`. |
| `id_gaveta` | integer | Sí | FK → `gaveta.id_gaveta`. |

### `GET` /api/orders

Lista todos los registros de `pedido`.

**Respuesta `200`**

```json
[
  {
    "id_pedido": 1,
    "total": "498.00",
    "fecha_hora": "2026-11-02 08:15:00",
    "dni_cliente": "0801199012345",
    "id_empleado": 2,
    "id_gaveta": 1
  }
]
```

```bash
curl http://localhost:3000/api/orders
```

### `GET` /api/orders/{id}

Obtiene un registro por su llave.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | integer | Id del pedido (`id_pedido`) |

**Respuesta `200`**

```json
{
  "id_pedido": 1,
  "total": "498.00",
  "fecha_hora": "2026-11-02 08:15:00",
  "dni_cliente": "0801199012345",
  "id_empleado": 2,
  "id_gaveta": 1
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

```bash
curl http://localhost:3000/api/orders/1
```

### `POST` /api/orders

Inserta un registro nuevo.

**Cuerpo de la petición**

```json
{
  "total": 210.0,
  "dni_cliente": "0801199012345",
  "id_empleado": 2,
  "id_gaveta": 1
}
```

**Respuesta `200`**

```json
{
  "message": "Registro Guardado",
  "id": 11
}
```

`id` es el valor autoincremental generado.

**Respuesta `500`:** falta un campo requerido, llave duplicada, llave foránea inexistente o no se cumple una restricción.

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"total": 210.0, "dni_cliente": "0801199012345", "id_empleado": 2, "id_gaveta": 1}'
```

### `POST` /api/orders/{id}

Actualiza un registro. Solo se modifican los campos enviados.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | integer | Id del pedido (`id_pedido`) |

**Cuerpo de la petición**

```json
{
  "total": 258.0
}
```

**Respuesta `200`**

```json
{
  "message": "Registro Actualizado"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

```bash
curl -X POST http://localhost:3000/api/orders/1 \
  -H "Content-Type: application/json" \
  -d '{"total": 258.0}'
```

### `DELETE` /api/orders/{id}

Elimina un registro.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | integer | Id del pedido (`id_pedido`) |

**Respuesta `200`**

```json
{
  "message": "Registro Eliminado"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

> **Nota:** Falla con 500 (`ER_ROW_IS_REFERENCED_2`) si el pedido tiene comprobante. Sus filas en `detalle_pedido` se eliminan en cascada.

```bash
curl -X DELETE http://localhost:3000/api/orders/1
```

[↑ Volver al índice](#índice)

---

## Comprobantes

Comprobante (factura) de un pedido. Relación 1 a 1 con `pedido`. La llave es el código (no es autoincremental).

**Tabla:** `comprobante` · **Ruta base:** `/api/receipts`

### Esquema

| Campo | Tipo | Requerido al insertar | Notas |
|---|---|:---:|---|
| `codigo_comprobante` | string(25) | Sí | Llave primaria. Formato SAR: `establecimiento-punto-tipo-correlativo`. |
| `id_pedido` | integer | Sí | FK → `pedido.id_pedido`. Único (un comprobante por pedido). |

### `GET` /api/receipts

Lista todos los registros de `comprobante`.

**Respuesta `200`**

```json
[
  {
    "codigo_comprobante": "000-001-01-00000001",
    "id_pedido": 1
  }
]
```

```bash
curl http://localhost:3000/api/receipts
```

### `GET` /api/receipts/{id}

Obtiene un registro por su llave.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | string | Código del comprobante (`codigo_comprobante`) |

**Respuesta `200`**

```json
{
  "codigo_comprobante": "000-001-01-00000001",
  "id_pedido": 1
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

```bash
curl http://localhost:3000/api/receipts/000-001-01-00000001
```

### `POST` /api/receipts

Inserta un registro nuevo.

**Cuerpo de la petición**

```json
{
  "codigo_comprobante": "000-001-01-00000011",
  "id_pedido": 11
}
```

**Respuesta `200`**

```json
{
  "message": "Registro Guardado",
  "id": "000-001-01-00000011"
}
```

`id` es la misma llave enviada en el cuerpo.

**Respuesta `500`:** falta un campo requerido, llave duplicada, llave foránea inexistente o no se cumple una restricción.

```bash
curl -X POST http://localhost:3000/api/receipts \
  -H "Content-Type: application/json" \
  -d '{"codigo_comprobante": "000-001-01-00000011", "id_pedido": 11}'
```

### `POST` /api/receipts/{id}

Actualiza un registro. Solo se modifican los campos enviados.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | string | Código del comprobante (`codigo_comprobante`) |

**Cuerpo de la petición**

```json
{
  "id_pedido": 12
}
```

**Respuesta `200`**

```json
{
  "message": "Registro Actualizado"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

```bash
curl -X POST http://localhost:3000/api/receipts/000-001-01-00000001 \
  -H "Content-Type: application/json" \
  -d '{"id_pedido": 12}'
```

### `DELETE` /api/receipts/{id}

Elimina un registro.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | string | Código del comprobante (`codigo_comprobante`) |

**Respuesta `200`**

```json
{
  "message": "Registro Eliminado"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

```bash
curl -X DELETE http://localhost:3000/api/receipts/000-001-01-00000001
```

[↑ Volver al índice](#índice)

---

## Reclamos

Reclamos de clientes, atendidos por un empleado.

**Tabla:** `reclamo` · **Ruta base:** `/api/complaints`

### Esquema

| Campo | Tipo | Requerido al insertar | Notas |
|---|---|:---:|---|
| `id_reclamo` | integer | No | Autoincremental. No se envía al insertar. |
| `observaciones` | string(500) | Sí |  |
| `tipo_reclamo` | string(50) | Sí | Ej.: Error de cobro, Devolución. |
| `dni_cliente` | string(15) | Sí | FK → `cliente.dni_cliente`. |
| `id_empleado` | integer | Sí | FK → `empleado.id_empleado`. |

### `GET` /api/complaints

Lista todos los registros de `reclamo`.

**Respuesta `200`**

```json
[
  {
    "id_reclamo": 1,
    "observaciones": "La leche entregada estaba próxima a vencer.",
    "tipo_reclamo": "Producto en mal estado",
    "dni_cliente": "0801199012345",
    "id_empleado": 1
  }
]
```

```bash
curl http://localhost:3000/api/complaints
```

### `GET` /api/complaints/{id}

Obtiene un registro por su llave.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | integer | Id del reclamo (`id_reclamo`) |

**Respuesta `200`**

```json
{
  "id_reclamo": 1,
  "observaciones": "La leche entregada estaba próxima a vencer.",
  "tipo_reclamo": "Producto en mal estado",
  "dni_cliente": "0801199012345",
  "id_empleado": 1
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

```bash
curl http://localhost:3000/api/complaints/1
```

### `POST` /api/complaints

Inserta un registro nuevo.

**Cuerpo de la petición**

```json
{
  "observaciones": "El producto llegó con el empaque abierto.",
  "tipo_reclamo": "Devolución",
  "dni_cliente": "0501198567890",
  "id_empleado": 3
}
```

**Respuesta `200`**

```json
{
  "message": "Registro Guardado",
  "id": 11
}
```

`id` es el valor autoincremental generado.

**Respuesta `500`:** falta un campo requerido, llave duplicada, llave foránea inexistente o no se cumple una restricción.

```bash
curl -X POST http://localhost:3000/api/complaints \
  -H "Content-Type: application/json" \
  -d '{"observaciones": "El producto llegó con el empaque abierto.", "tipo_reclamo": "Devolución", "dni_cliente": "0501198567890", "id_empleado": 3}'
```

### `POST` /api/complaints/{id}

Actualiza un registro. Solo se modifican los campos enviados.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | integer | Id del reclamo (`id_reclamo`) |

**Cuerpo de la petición**

```json
{
  "tipo_reclamo": "Producto en mal estado"
}
```

**Respuesta `200`**

```json
{
  "message": "Registro Actualizado"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

```bash
curl -X POST http://localhost:3000/api/complaints/1 \
  -H "Content-Type: application/json" \
  -d '{"tipo_reclamo": "Producto en mal estado"}'
```

### `DELETE` /api/complaints/{id}

Elimina un registro.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | integer | Id del reclamo (`id_reclamo`) |

**Respuesta `200`**

```json
{
  "message": "Registro Eliminado"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

```bash
curl -X DELETE http://localhost:3000/api/complaints/1
```

[↑ Volver al índice](#índice)

---

## Detalle de pedidos

Productos de cada pedido (relación N a M entre `pedido` y `producto`). Llave compuesta: `id_pedido` + `id_producto`.

**Tabla:** `detalle_pedido` · **Ruta base:** `/api/order-details`

### Esquema

| Campo | Tipo | Requerido al insertar | Notas |
|---|---|:---:|---|
| `id_pedido` | integer | Sí | Parte de la llave. FK → `pedido.id_pedido`. |
| `id_producto` | integer | Sí | Parte de la llave. FK → `producto.id_producto`. |
| `cantidad` | integer | Sí | Debe ser > 0. |
| `sub_total` | decimal(12,2) | Sí | Debe ser >= 0. Se envía calculado (`cantidad × precio_venta`). |

### `GET` /api/order-details

Lista todos los registros de `detalle_pedido`.

**Respuesta `200`**

```json
[
  {
    "id_pedido": 1,
    "id_producto": 1,
    "cantidad": 2,
    "sub_total": "210.00"
  }
]
```

```bash
curl http://localhost:3000/api/order-details
```

### `GET` /api/order-details/{orderId}/{productId}

Obtiene un registro por su llave.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `orderId` | integer | Id del pedido (`id_pedido`) |
| `productId` | integer | Id del producto (`id_producto`) |

**Respuesta `200`**

```json
{
  "id_pedido": 1,
  "id_producto": 1,
  "cantidad": 2,
  "sub_total": "210.00"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

```bash
curl http://localhost:3000/api/order-details/1/1
```

### `POST` /api/order-details

Inserta un registro nuevo.

**Cuerpo de la petición**

```json
{
  "id_pedido": 11,
  "id_producto": 1,
  "cantidad": 2,
  "sub_total": 210.0
}
```

**Respuesta `200`**

```json
{
  "message": "Registro Guardado"
}
```

**Respuesta `500`:** falta un campo requerido, llave duplicada, llave foránea inexistente o no se cumple una restricción.

```bash
curl -X POST http://localhost:3000/api/order-details \
  -H "Content-Type: application/json" \
  -d '{"id_pedido": 11, "id_producto": 1, "cantidad": 2, "sub_total": 210.0}'
```

### `POST` /api/order-details/{orderId}/{productId}

Actualiza un registro. Solo se modifican los campos enviados.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `orderId` | integer | Id del pedido (`id_pedido`) |
| `productId` | integer | Id del producto (`id_producto`) |

**Cuerpo de la petición**

```json
{
  "cantidad": 3,
  "sub_total": 315.0
}
```

**Respuesta `200`**

```json
{
  "message": "Registro Actualizado"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

```bash
curl -X POST http://localhost:3000/api/order-details/1/1 \
  -H "Content-Type: application/json" \
  -d '{"cantidad": 3, "sub_total": 315.0}'
```

### `DELETE` /api/order-details/{orderId}/{productId}

Elimina un registro.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `orderId` | integer | Id del pedido (`id_pedido`) |
| `productId` | integer | Id del producto (`id_producto`) |

**Respuesta `200`**

```json
{
  "message": "Registro Eliminado"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

```bash
curl -X DELETE http://localhost:3000/api/order-details/1/1
```

[↑ Volver al índice](#índice)

---

## Detalle de proveedores

Qué proveedor vende cada producto y a qué precio (relación N a M entre `producto` y `proveedor`). Llave compuesta: `id_producto` + `id_proveedor`.

**Tabla:** `detalle_proveedores` · **Ruta base:** `/api/product-suppliers`

### Esquema

| Campo | Tipo | Requerido al insertar | Notas |
|---|---|:---:|---|
| `id_producto` | integer | Sí | Parte de la llave. FK → `producto.id_producto`. |
| `id_proveedor` | integer | Sí | Parte de la llave. FK → `proveedor.id_proveedor`. |
| `precio_proveedor` | decimal(10,2) | Sí | Debe ser >= 0. |

### `GET` /api/product-suppliers

Lista todos los registros de `detalle_proveedores`.

**Respuesta `200`**

```json
[
  {
    "id_producto": 1,
    "id_proveedor": 1,
    "precio_proveedor": "85.00"
  }
]
```

```bash
curl http://localhost:3000/api/product-suppliers
```

### `GET` /api/product-suppliers/{productId}/{supplierId}

Obtiene un registro por su llave.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `productId` | integer | Id del producto (`id_producto`) |
| `supplierId` | integer | Id del proveedor (`id_proveedor`) |

**Respuesta `200`**

```json
{
  "id_producto": 1,
  "id_proveedor": 1,
  "precio_proveedor": "85.00"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

```bash
curl http://localhost:3000/api/product-suppliers/1/1
```

### `POST` /api/product-suppliers

Inserta un registro nuevo.

**Cuerpo de la petición**

```json
{
  "id_producto": 3,
  "id_proveedor": 1,
  "precio_proveedor": 61.5
}
```

**Respuesta `200`**

```json
{
  "message": "Registro Guardado"
}
```

**Respuesta `500`:** falta un campo requerido, llave duplicada, llave foránea inexistente o no se cumple una restricción.

```bash
curl -X POST http://localhost:3000/api/product-suppliers \
  -H "Content-Type: application/json" \
  -d '{"id_producto": 3, "id_proveedor": 1, "precio_proveedor": 61.5}'
```

### `POST` /api/product-suppliers/{productId}/{supplierId}

Actualiza un registro. Solo se modifican los campos enviados.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `productId` | integer | Id del producto (`id_producto`) |
| `supplierId` | integer | Id del proveedor (`id_proveedor`) |

**Cuerpo de la petición**

```json
{
  "precio_proveedor": 60.0
}
```

**Respuesta `200`**

```json
{
  "message": "Registro Actualizado"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

```bash
curl -X POST http://localhost:3000/api/product-suppliers/1/1 \
  -H "Content-Type: application/json" \
  -d '{"precio_proveedor": 60.0}'
```

### `DELETE` /api/product-suppliers/{productId}/{supplierId}

Elimina un registro.

**Parámetros de ruta**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `productId` | integer | Id del producto (`id_producto`) |
| `supplierId` | integer | Id del proveedor (`id_proveedor`) |

**Respuesta `200`**

```json
{
  "message": "Registro Eliminado"
}
```

**Respuesta `404`**

```json
{
  "message": "Registro no encontrado"
}
```

```bash
curl -X DELETE http://localhost:3000/api/product-suppliers/1/1
```

[↑ Volver al índice](#índice)

---
