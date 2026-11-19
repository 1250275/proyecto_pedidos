-- =====================================================================
--  BASE DE DATOS: bd_tienda   (solo estructura)
-- =====================================================================

DROP DATABASE IF EXISTS bd_tienda;
CREATE DATABASE bd_tienda
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bd_tienda;

-- ---------------------------------------------------------------------
-- 1. GAVETA (caja registradora)
-- ---------------------------------------------------------------------
CREATE TABLE gaveta (
    id_gaveta       INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    monto_dinero    DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
    CONSTRAINT pk_gaveta PRIMARY KEY (id_gaveta),
    CONSTRAINT chk_gaveta_monto CHECK (monto_dinero >= 0)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- 2. EMPLEADO
-- ---------------------------------------------------------------------
CREATE TABLE empleado (
    id_empleado         INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    nombre              VARCHAR(50)     NOT NULL,
    apellidos           VARCHAR(80)     NOT NULL,
    dni                 VARCHAR(15)     NOT NULL,
    email               VARCHAR(100)    NOT NULL,
    cargo               VARCHAR(50)     NOT NULL,
    credencial          VARCHAR(255)    NOT NULL,   -- guardar hash, no texto plano
    fecha_ingreso       DATE            NOT NULL,
    fecha_nacimiento    DATE            NOT NULL,
    CONSTRAINT pk_empleado PRIMARY KEY (id_empleado),
    CONSTRAINT uq_empleado_dni   UNIQUE (dni),
    CONSTRAINT uq_empleado_email UNIQUE (email),
    CONSTRAINT chk_empleado_email  CHECK (email LIKE '%_@_%._%'),
    CONSTRAINT chk_empleado_fechas CHECK (fecha_ingreso > fecha_nacimiento)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- 3. CLIENTE
-- ---------------------------------------------------------------------
CREATE TABLE cliente (
    dni_cliente         VARCHAR(15)     NOT NULL,
    nombre              VARCHAR(50)     NOT NULL,
    apellido            VARCHAR(80)     NOT NULL,
    telefono            VARCHAR(20)     NULL,
    email               VARCHAR(100)    NULL,
    direccion           VARCHAR(200)    NULL,
    fecha_nacimiento    DATE            NULL,
    CONSTRAINT pk_cliente PRIMARY KEY (dni_cliente),
    CONSTRAINT uq_cliente_email UNIQUE (email),
    CONSTRAINT chk_cliente_email CHECK (email IS NULL OR email LIKE '%_@_%._%')
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- 4. PRODUCTO
-- ---------------------------------------------------------------------
CREATE TABLE producto (
    id_producto     INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    nombre          VARCHAR(100)    NOT NULL,
    marca           VARCHAR(50)     NULL,
    categoria       VARCHAR(50)     NOT NULL,
    precio_compra   DECIMAL(10,2)   NOT NULL,
    precio_venta    DECIMAL(10,2)   NOT NULL,
    stock           INT UNSIGNED    NOT NULL DEFAULT 0,
    stock_limite    INT UNSIGNED    NOT NULL DEFAULT 0,   -- stock mínimo de alerta
    descripcion     TEXT            NULL,
    CONSTRAINT pk_producto PRIMARY KEY (id_producto),
    CONSTRAINT chk_producto_precio_compra CHECK (precio_compra >= 0),
    CONSTRAINT chk_producto_precio_venta  CHECK (precio_venta >= precio_compra)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- 5. PROVEEDOR
-- ---------------------------------------------------------------------
CREATE TABLE proveedor (
    id_proveedor    INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    nombre          VARCHAR(100)    NOT NULL,
    telefono        VARCHAR(20)     NULL,
    n_cuenta        VARCHAR(30)     NULL,
    email           VARCHAR(100)    NULL,
    CONSTRAINT pk_proveedor PRIMARY KEY (id_proveedor),
    CONSTRAINT uq_proveedor_email UNIQUE (email),
    CONSTRAINT chk_proveedor_email CHECK (email IS NULL OR email LIKE '%_@_%._%')
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- 6. PEDIDO
--    Cliente 1 ── N Pedido | Empleado 1 ── N Pedido | Gaveta 1 ── N Pedido
-- ---------------------------------------------------------------------
CREATE TABLE pedido (
    id_pedido       INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    total           DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
    fecha_hora      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dni_cliente     VARCHAR(15)     NOT NULL,
    id_empleado     INT UNSIGNED    NOT NULL,
    id_gaveta       INT UNSIGNED    NOT NULL,
    CONSTRAINT pk_pedido PRIMARY KEY (id_pedido),
    CONSTRAINT chk_pedido_total CHECK (total >= 0),
    CONSTRAINT fk_pedido_cliente FOREIGN KEY (dni_cliente)
        REFERENCES cliente (dni_cliente)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_pedido_empleado FOREIGN KEY (id_empleado)
        REFERENCES empleado (id_empleado)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_pedido_gaveta FOREIGN KEY (id_gaveta)
        REFERENCES gaveta (id_gaveta)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- 7. COMPROBANTE   (Pedido 1 ── 1 Comprobante)
-- ---------------------------------------------------------------------
CREATE TABLE comprobante (
    codigo_comprobante  VARCHAR(25)     NOT NULL,
    id_pedido           INT UNSIGNED    NOT NULL,
    CONSTRAINT pk_comprobante PRIMARY KEY (codigo_comprobante),
    CONSTRAINT uq_comprobante_pedido UNIQUE (id_pedido),   -- garantiza 1 a 1
    CONSTRAINT fk_comprobante_pedido FOREIGN KEY (id_pedido)
        REFERENCES pedido (id_pedido)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- 8. DETALLE_PEDIDO   (Pedido N ── M Producto)
-- ---------------------------------------------------------------------
CREATE TABLE detalle_pedido (
    id_pedido       INT UNSIGNED    NOT NULL,
    id_producto     INT UNSIGNED    NOT NULL,
    cantidad        INT UNSIGNED    NOT NULL,
    sub_total       DECIMAL(12,2)   NOT NULL,
    CONSTRAINT pk_detalle_pedido PRIMARY KEY (id_pedido, id_producto),
    CONSTRAINT chk_detalle_cantidad CHECK (cantidad > 0),
    CONSTRAINT chk_detalle_subtotal CHECK (sub_total >= 0),
    CONSTRAINT fk_detalle_pedido_pedido FOREIGN KEY (id_pedido)
        REFERENCES pedido (id_pedido)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_detalle_pedido_producto FOREIGN KEY (id_producto)
        REFERENCES producto (id_producto)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- 9. RECLAMO   (Cliente 1 ── N Reclamo | Empleado 1 ── N Reclamo)
-- ---------------------------------------------------------------------
CREATE TABLE reclamo (
    id_reclamo      INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    observaciones   VARCHAR(500)    NOT NULL,
    tipo_reclamo    VARCHAR(50)     NOT NULL,
    dni_cliente     VARCHAR(15)     NOT NULL,
    id_empleado     INT UNSIGNED    NOT NULL,
    CONSTRAINT pk_reclamo PRIMARY KEY (id_reclamo),
    CONSTRAINT fk_reclamo_cliente FOREIGN KEY (dni_cliente)
        REFERENCES cliente (dni_cliente)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_reclamo_empleado FOREIGN KEY (id_empleado)
        REFERENCES empleado (id_empleado)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- 10. DETALLE_PROVEEDORES   (Producto N ── M Proveedor)
-- ---------------------------------------------------------------------
CREATE TABLE detalle_proveedores (
    id_producto         INT UNSIGNED    NOT NULL,
    id_proveedor        INT UNSIGNED    NOT NULL,
    precio_proveedor    DECIMAL(10,2)   NOT NULL,
    CONSTRAINT pk_detalle_proveedores PRIMARY KEY (id_producto, id_proveedor),
    CONSTRAINT chk_detprov_precio CHECK (precio_proveedor >= 0),
    CONSTRAINT fk_detprov_producto FOREIGN KEY (id_producto)
        REFERENCES producto (id_producto)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_detprov_proveedor FOREIGN KEY (id_proveedor)
        REFERENCES proveedor (id_proveedor)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
-- Índices de apoyo para búsquedas frecuentes
-- ---------------------------------------------------------------------
CREATE INDEX idx_pedido_fecha       ON pedido (fecha_hora);
CREATE INDEX idx_producto_nombre    ON producto (nombre);
CREATE INDEX idx_producto_categoria ON producto (categoria);
CREATE INDEX idx_cliente_apellido   ON cliente (apellido);