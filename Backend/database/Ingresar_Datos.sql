-- =====================================================================
--  BASE DE DATOS: bd_tienda   (datos de prueba)
--  Montos en Lempiras (L.)
-- =====================================================================

USE bd_tienda;
SET NAMES utf8mb4;

START TRANSACTION;

-- ---------------------------------------------------------------------
-- Cajas (monto = fondo inicial L. 1,000 + ventas registradas)
-- ---------------------------------------------------------------------
INSERT INTO caja (id_caja, monto_dinero) VALUES
(1, 2648.00),
(2, 2181.00),
(3, 1794.00);

-- ---------------------------------------------------------------------
-- Empleados
-- ---------------------------------------------------------------------
INSERT INTO empleado (id_empleado, nombre, apellidos, dni, email, cargo, fecha_ingreso, fecha_nacimiento) VALUES
(1, 'Carlos',  'Mejía Rivera',     '0801198011111', 'carlos.mejia@tienda.hn',  'Administrador', '2018-03-01', '1980-05-14'),
(2, 'Ana',     'López Zelaya',     '0801199222222', 'ana.lopez@tienda.hn',     'Cajero',        '2021-06-15', '1992-09-22'),
(3, 'José',    'Martínez Flores',  '0501199533333', 'jose.martinez@tienda.hn', 'Cajero',        '2022-01-10', '1995-02-03'),
(4, 'María',   'Hernández Castro', '0801199744444', 'maria.hernandez@tienda.hn','Cajero',       '2023-08-01', '1997-11-30'),
(5, 'Luis',    'Ramírez Pineda',   '1804199055555', 'luis.ramirez@tienda.hn',  'Bodeguero',     '2020-02-20', '1990-07-08');

-- ---------------------------------------------------------------------
-- Clientes
-- ---------------------------------------------------------------------
INSERT INTO cliente (dni_cliente, nombre, apellido, telefono, email, direccion, fecha_nacimiento) VALUES
('0801199012345', 'Karla',    'Rodríguez', '9876-5432', 'karla.rodriguez@gmail.com', 'Col. Kennedy, Tegucigalpa',          '1990-04-12'),
('0501198567890', 'Pedro',    'Gómez',     '9988-1122', 'pedro.gomez@yahoo.com',     'Barrio Guamilito, San Pedro Sula',   '1985-08-25'),
('0801200011223', 'Sofía',    'Aguilar',   '3344-5566', 'sofia.aguilar@gmail.com',   'Res. El Trapiche, Tegucigalpa',      '2000-01-30'),
('1804199533445', 'Miguel',   'Turcios',   '8877-6655', NULL,                        'Barrio El Centro, El Progreso',      '1995-06-18'),
('0301199877889', 'Daniela',  'Ordóñez',   '9555-7788', 'daniela.ordonez@outlook.com','Col. Palmira, Tegucigalpa',         '1998-12-05'),
('0801198822334', 'Roberto',  'Cruz',      '3211-4455', 'roberto.cruz@gmail.com',    'Col. Miraflores, Tegucigalpa',       '1988-03-09'),
('1501200155667', 'Valeria',  'Sánchez',   '9700-1234', NULL,                        'Barrio Abajo, Juticalpa',            '2001-10-21'),
('0801197566778', 'Jorge',    'Barahona',  NULL,        NULL,                        NULL,                                 NULL);

-- ---------------------------------------------------------------------
-- Proveedores
-- ---------------------------------------------------------------------
INSERT INTO proveedor (id_proveedor, nombre, telefono, n_cuenta, email) VALUES
(1, 'Distribuidora Central S.A.',   '2234-5678', '200-01-123456-7', 'ventas@distcentral.hn'),
(2, 'Comercializadora del Norte',   '2550-1122', '110-02-987654-3', 'pedidos@comnorte.hn'),
(3, 'Importadora La Económica',     '2245-9900', '305-11-456789-0', 'contacto@laeconomica.hn'),
(4, 'Lácteos y Bebidas del Valle',  '2770-3344', '210-05-654321-8', NULL);

-- Productos
INSERT INTO producto (id_producto, nombre, marca, categoria, precio_compra, precio_venta, stock, stock_limite, descripcion) VALUES
(1, 'Arroz Blanco 5 lb', 'El Granero', 'Granos básicos', 85.00, 105.00, 120, 20, 'Arroz blanco grano largo'),
(2, 'Frijoles Rojos 2 lb', 'La Cosecha', 'Granos básicos', 38.00, 48.00, 150, 25, 'Frijol rojo seda seleccionado'),
(3, 'Aceite Vegetal 1 L', 'Dorado', 'Abarrotes', 62.00, 78.00, 80, 15, 'Aceite vegetal de soya'),
(4, 'Azúcar 5 lb', 'Caña Real', 'Abarrotes', 70.00, 88.00, 100, 20, 'Azúcar blanca refinada'),
(5, 'Café Molido 400 g', 'Montaña Azul', 'Bebidas', 95.00, 125.00, 60, 10, 'Café hondureño tostado y molido'),
(6, 'Leche Entera 1 L', 'Lácteos del Valle', 'Lácteos', 28.00, 36.00, 90, 20, 'Leche entera pasteurizada'),
(7, 'Jabón de Lavar 400 g', 'Espumax', 'Limpieza', 18.00, 25.00, 200, 30, 'Jabón en barra para ropa'),
(8, 'Papel Higiénico 4 rollos', 'Suave Plus', 'Higiene', 45.00, 60.00, 75, 15, 'Papel higiénico doble hoja'),
(9, 'Refresco 2 L', 'Burbujas', 'Bebidas', 35.00, 48.00, 110, 24, 'Bebida gaseosa sabor cola'),
(10, 'Pasta Dental 100 ml', 'Dentiblanc', 'Higiene', 32.00, 45.00, 70, 12, 'Pasta dental con flúor');

-- Pedidos (total = suma de sus sub_total)
INSERT INTO pedido (id_pedido, total, fecha_hora, dni_cliente, id_empleado, id_caja) VALUES
(1, 498.00, '2026-11-02 08:15:00', '0801199012345', 2, 1),
(2, 213.00, '2026-11-02 09:40:00', '0501198567890', 2, 1),
(3, 290.00, '2026-11-03 10:05:00', '0801200011223', 3, 2),
(4, 222.00, '2026-11-04 14:30:00', '1804199533445', 2, 1),
(5, 603.00, '2026-11-05 16:45:00', '0801199012345', 3, 2),
(6, 348.00, '2026-11-07 11:20:00', '0301199877889', 4, 3),
(7, 225.00, '2026-11-09 17:10:00', '0801198822334', 4, 3),
(8, 288.00, '2026-11-12 08:55:00', '1501200155667', 3, 2),
(9, 715.00, '2026-11-14 13:25:00', '0501198567890', 2, 1),
(10, 221.00, '2026-11-15 18:05:00', '0801200011223', 4, 3);

-- Comprobantes (formato SAR: establecimiento-punto-tipo-correlativo)
INSERT INTO comprobante (codigo_comprobante, id_pedido) VALUES
('000-001-01-00000001', 1),
('000-001-01-00000002', 2),
('000-001-01-00000003', 3),
('000-001-01-00000004', 4),
('000-001-01-00000005', 5),
('000-001-01-00000006', 6),
('000-001-01-00000007', 7),
('000-001-01-00000008', 8),
('000-001-01-00000009', 9),
('000-001-01-00000010', 10);

-- Detalle de pedidos (sub_total = cantidad x precio_venta)
INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, sub_total) VALUES
(1, 1, 2, 210.00),
(1, 2, 3, 144.00),
(1, 6, 4, 144.00),
(2, 5, 1, 125.00),
(2, 4, 1, 88.00),
(3, 7, 5, 125.00),
(3, 8, 2, 120.00),
(3, 10, 1, 45.00),
(4, 9, 3, 144.00),
(4, 3, 1, 78.00),
(5, 1, 1, 105.00),
(5, 4, 2, 176.00),
(5, 5, 2, 250.00),
(5, 6, 2, 72.00),
(6, 2, 4, 192.00),
(6, 3, 2, 156.00),
(7, 8, 1, 60.00),
(7, 10, 2, 90.00),
(7, 7, 3, 75.00),
(8, 9, 6, 288.00),
(9, 1, 3, 315.00),
(9, 2, 2, 96.00),
(9, 4, 1, 88.00),
(9, 6, 6, 216.00),
(10, 5, 1, 125.00),
(10, 9, 2, 96.00);

-- ---------------------------------------------------------------------
-- Reclamos
-- ---------------------------------------------------------------------
INSERT INTO reclamo (id_reclamo, observaciones, tipo_reclamo, dni_cliente, id_empleado) VALUES
(1, 'La leche entregada estaba próxima a vencer.',             'Producto en mal estado', '0801199012345', 1),
(2, 'Se cobró un refresco de más en el pedido.',               'Error de cobro',         '1501200155667', 3),
(3, 'Demora excesiva en la atención en caja.',                 'Atención al cliente',    '0301199877889', 1),
(4, 'Solicita cambio de pasta dental por empaque dañado.',     'Devolución',             '0801198822334', 4);

-- ---------------------------------------------------------------------
-- Detalle de proveedores (qué proveedor vende cada producto y a qué precio)
-- ---------------------------------------------------------------------
INSERT INTO detalle_proveedores (id_producto, id_proveedor, precio_proveedor) VALUES
(1, 1, 85.00),
(1, 3, 83.50),
(2, 1, 38.00),
(2, 2, 37.25),
(3, 3, 62.00),
(4, 1, 70.00),
(4, 2, 71.50),
(5, 2, 95.00),
(6, 4, 28.00),
(7, 3, 18.00),
(8, 1, 45.00),
(8, 3, 44.00),
(9, 4, 35.00),
(10, 3, 32.00);

-- ---------------------------------------------------------------------
-- Usuarios (contraseña guardada como hash bcrypt, costo 10)
--   Credenciales de prueba:
--   cmejia     / Admin2026*   (Administrador)
--   alopez     / Cajero01*    (Cajero)
--   jmartinez  / Cajero02*    (Cajero)
--   mhernandez / Cajero03*    (Cajero)
--   lramirez   / Bodega01*    (Bodeguero)
-- ---------------------------------------------------------------------
INSERT INTO usuarios (id_usuario, id_empleado, nombre_usuario, contrasena_hash, rol, estado) VALUES
(1, 1, 'cmejia',     '$2a$10$uwyKD7Z3akPaAGOi0FaKe.o/aFIzgcA1MNpJaAyeFKa6rtivGxIhi', 'Administrador', 'activo'),
(2, 2, 'alopez',     '$2a$10$keQQaWl07addBoYrjDE6K.zTucAYWC5sTZ4OgOLFL5gUniIs3KcuC', 'Cajero',        'activo'),
(3, 3, 'jmartinez',  '$2a$10$/.saaYsVAGBUtu8wieQf..5g/thWs5mOVq8g59IundiQpBDacy/h.', 'Cajero',        'activo'),
(4, 4, 'mhernandez', '$2a$10$ckhxsEoHYq6j92fw0nJrHe2VmNJomMRz4scW4T7zECZ1YuZvB1CGG', 'Cajero',        'activo'),
(5, 5, 'lramirez',   '$2a$10$SKuFfGbC1v.EkEKyWJxDzOoPuq.3rvnLXEsDXImcb15cCFcgeMdmS', 'Bodeguero',     'activo');

COMMIT;

-- ---------------------------------------------------------------------
-- Verificación rápida
-- ---------------------------------------------------------------------
-- Cada pedido: total guardado vs. suma real del detalle (deben ser iguales)
SELECT p.id_pedido, p.total, SUM(d.sub_total) AS suma_detalle
FROM pedido p
JOIN detalle_pedido d ON d.id_pedido = p.id_pedido
GROUP BY p.id_pedido, p.total;