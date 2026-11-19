-- =====================================================================
--  BASE DE DATOS: bd_tienda   (solo tablas nuevas)
--  Agrega la tabla USUARIOS y sus datos de prueba a una base ya creada
--  con Estructura_DB.sql e Ingresar_Datos.sql.
-- =====================================================================

USE bd_tienda;
SET NAMES utf8mb4;

-- ---------------------------------------------------------------------
-- 11. USUARIOS   (Empleado 1 ── 1 Usuario)
--     Rol fijo (ENUM) validado también en el código (constants/roles.js)
-- ---------------------------------------------------------------------
CREATE TABLE usuarios (
    id_usuario          INT UNSIGNED        NOT NULL AUTO_INCREMENT,
    id_empleado         INT UNSIGNED        NOT NULL,
    nombre_usuario      VARCHAR(50)         NOT NULL,
    contrasena_hash     VARCHAR(255)        NOT NULL,   -- hash bcrypt, nunca texto plano
    rol                 ENUM('Administrador','Cajero','Bodeguero') NOT NULL,
    estado              ENUM('activo','inactivo','bloqueado')      NOT NULL DEFAULT 'activo',
    intentos_fallidos   TINYINT UNSIGNED    NOT NULL DEFAULT 0,
    ultimo_acceso       DATETIME            NULL,
    fecha_creacion      DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_usuarios PRIMARY KEY (id_usuario),
    CONSTRAINT uq_usuarios_nombre   UNIQUE (nombre_usuario),
    CONSTRAINT uq_usuarios_empleado UNIQUE (id_empleado),   -- garantiza 1 a 1
    CONSTRAINT fk_usuarios_empleado FOREIGN KEY (id_empleado)
        REFERENCES empleado (id_empleado)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE = InnoDB;

START TRANSACTION;

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
