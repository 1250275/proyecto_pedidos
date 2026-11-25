-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: bd_tienda
-- ------------------------------------------------------
-- Server version	8.0.46-0ubuntu0.24.04.5

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `bd_tienda`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `bd_tienda` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `bd_tienda`;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `dni_cliente` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  PRIMARY KEY (`dni_cliente`),
  UNIQUE KEY `uq_cliente_email` (`email`),
  KEY `idx_cliente_apellido` (`apellido`),
  CONSTRAINT `chk_cliente_email` CHECK (((`email` is null) or (`email` like _utf8mb4'%_@_%._%')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES ('0301199877889','Daniela','Ordóñez','9555-7788','daniela.ordonez@outlook.com','Col. Palmira, Tegucigalpa','1998-12-05'),('0501198567890','Pedro','Gómez','9988-1122','pedro.gomez@yahoo.com','Barrio Guamilito, San Pedro Sula','1985-08-25'),('0801197566778','Jorge','Barahona',NULL,NULL,NULL,NULL),('0801198822334','Roberto','Cruz','3211-4455','roberto.cruz@gmail.com','Col. Miraflores, Tegucigalpa','1988-03-09'),('0801199012345','Karla','Rodríguez','9876-5432','karla.rodriguez@gmail.com','Col. Kennedy, Tegucigalpa','1990-04-12'),('0801200011223','Sofía','Aguilar','3344-5566','sofia.aguilar@gmail.com','Res. El Trapiche, Tegucigalpa','2000-01-30'),('1501200155667','Valeria','Sánchez','9700-1234',NULL,'Barrio Abajo, Juticalpa','2001-10-21'),('1804199533445','Miguel','Turcios','8877-6655',NULL,'Barrio El Centro, El Progreso','1995-06-18');
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comprobante`
--

DROP TABLE IF EXISTS `comprobante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comprobante` (
  `codigo_comprobante` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_pedido` int unsigned NOT NULL,
  PRIMARY KEY (`codigo_comprobante`),
  UNIQUE KEY `uq_comprobante_pedido` (`id_pedido`),
  CONSTRAINT `fk_comprobante_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comprobante`
--

LOCK TABLES `comprobante` WRITE;
/*!40000 ALTER TABLE `comprobante` DISABLE KEYS */;
INSERT INTO `comprobante` VALUES ('000-001-01-00000001',1),('000-001-01-00000002',2),('000-001-01-00000003',3),('000-001-01-00000004',4),('000-001-01-00000005',5),('000-001-01-00000006',6),('000-001-01-00000007',7),('000-001-01-00000008',8),('000-001-01-00000009',9),('000-001-01-00000010',10);
/*!40000 ALTER TABLE `comprobante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_pedido`
--

DROP TABLE IF EXISTS `detalle_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_pedido` (
  `id_pedido` int unsigned NOT NULL,
  `id_producto` int unsigned NOT NULL,
  `cantidad` int unsigned NOT NULL,
  `sub_total` decimal(12,2) NOT NULL,
  PRIMARY KEY (`id_pedido`,`id_producto`),
  KEY `fk_detalle_pedido_producto` (`id_producto`),
  CONSTRAINT `fk_detalle_pedido_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_detalle_pedido_producto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `chk_detalle_cantidad` CHECK ((`cantidad` > 0)),
  CONSTRAINT `chk_detalle_subtotal` CHECK ((`sub_total` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_pedido`
--

LOCK TABLES `detalle_pedido` WRITE;
/*!40000 ALTER TABLE `detalle_pedido` DISABLE KEYS */;
INSERT INTO `detalle_pedido` VALUES (1,1,2,210.00),(1,2,3,144.00),(1,6,4,144.00),(2,4,1,88.00),(2,5,1,125.00),(3,7,5,125.00),(3,8,2,120.00),(3,10,1,45.00),(4,3,1,78.00),(4,9,3,144.00),(5,1,1,105.00),(5,4,2,176.00),(5,5,2,250.00),(5,6,2,72.00),(6,2,4,192.00),(6,3,2,156.00),(7,7,3,75.00),(7,8,1,60.00),(7,10,2,90.00),(8,9,6,288.00),(9,1,3,315.00),(9,2,2,96.00),(9,4,1,88.00),(9,6,6,216.00),(10,5,1,125.00),(10,9,2,96.00);
/*!40000 ALTER TABLE `detalle_pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_proveedores`
--

DROP TABLE IF EXISTS `detalle_proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_proveedores` (
  `id_producto` int unsigned NOT NULL,
  `id_proveedor` int unsigned NOT NULL,
  `precio_proveedor` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_producto`,`id_proveedor`),
  KEY `fk_detprov_proveedor` (`id_proveedor`),
  CONSTRAINT `fk_detprov_producto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_detprov_proveedor` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_detprov_precio` CHECK ((`precio_proveedor` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_proveedores`
--

LOCK TABLES `detalle_proveedores` WRITE;
/*!40000 ALTER TABLE `detalle_proveedores` DISABLE KEYS */;
INSERT INTO `detalle_proveedores` VALUES (1,1,85.00),(1,3,83.50),(2,1,38.00),(2,2,37.25),(3,3,62.00),(4,1,70.00),(4,2,71.50),(5,2,95.00),(6,4,28.00),(7,3,18.00),(8,1,45.00),(8,3,44.00),(9,4,35.00),(10,3,32.00);
/*!40000 ALTER TABLE `detalle_proveedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleado`
--

DROP TABLE IF EXISTS `empleado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleado` (
  `id_empleado` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellidos` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dni` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cargo` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_ingreso` date NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  PRIMARY KEY (`id_empleado`),
  UNIQUE KEY `uq_empleado_dni` (`dni`),
  UNIQUE KEY `uq_empleado_email` (`email`),
  CONSTRAINT `chk_empleado_email` CHECK ((`email` like _utf8mb4'%_@_%._%')),
  CONSTRAINT `chk_empleado_fechas` CHECK ((`fecha_ingreso` > `fecha_nacimiento`))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleado`
--

LOCK TABLES `empleado` WRITE;
/*!40000 ALTER TABLE `empleado` DISABLE KEYS */;
INSERT INTO `empleado` VALUES (1,'Carlos','Mejía Rivera','0801198011111','carlos.mejia@tienda.hn','Administrador','2018-03-01','1980-05-14'),(2,'Ana','López Zelaya','0801199222222','ana.lopez@tienda.hn','Cajero','2021-06-15','1992-09-22'),(3,'José','Martínez Flores','0501199533333','jose.martinez@tienda.hn','Cajero','2022-01-10','1995-02-03'),(4,'María','Hernández Castro','0801199744444','maria.hernandez@tienda.hn','Cajero','2023-08-01','1997-11-30'),(5,'Luis','Ramírez Pineda','1804199055555','luis.ramirez@tienda.hn','Bodeguero','2020-02-20','1990-07-08');
/*!40000 ALTER TABLE `empleado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gaveta`
--

DROP TABLE IF EXISTS `gaveta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gaveta` (
  `id_gaveta` int unsigned NOT NULL AUTO_INCREMENT,
  `monto_dinero` decimal(12,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id_gaveta`),
  CONSTRAINT `chk_gaveta_monto` CHECK ((`monto_dinero` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gaveta`
--

LOCK TABLES `gaveta` WRITE;
/*!40000 ALTER TABLE `gaveta` DISABLE KEYS */;
INSERT INTO `gaveta` VALUES (1,2648.00),(2,2181.00),(3,1794.00);
/*!40000 ALTER TABLE `gaveta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido` (
  `id_pedido` int unsigned NOT NULL AUTO_INCREMENT,
  `total` decimal(12,2) NOT NULL DEFAULT '0.00',
  `fecha_hora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dni_cliente` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_empleado` int unsigned NOT NULL,
  `id_gaveta` int unsigned NOT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `fk_pedido_cliente` (`dni_cliente`),
  KEY `fk_pedido_empleado` (`id_empleado`),
  KEY `fk_pedido_gaveta` (`id_gaveta`),
  KEY `idx_pedido_fecha` (`fecha_hora`),
  CONSTRAINT `fk_pedido_cliente` FOREIGN KEY (`dni_cliente`) REFERENCES `cliente` (`dni_cliente`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_pedido_empleado` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_pedido_gaveta` FOREIGN KEY (`id_gaveta`) REFERENCES `gaveta` (`id_gaveta`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `chk_pedido_total` CHECK ((`total` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido`
--

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
INSERT INTO `pedido` VALUES (1,498.00,'2026-11-02 08:15:00','0801199012345',2,1),(2,213.00,'2026-11-02 09:40:00','0501198567890',2,1),(3,290.00,'2026-11-03 10:05:00','0801200011223',3,2),(4,222.00,'2026-11-04 14:30:00','1804199533445',2,1),(5,603.00,'2026-11-05 16:45:00','0801199012345',3,2),(6,348.00,'2026-11-07 11:20:00','0301199877889',4,3),(7,225.00,'2026-11-09 17:10:00','0801198822334',4,3),(8,288.00,'2026-11-12 08:55:00','1501200155667',3,2),(9,715.00,'2026-11-14 13:25:00','0501198567890',2,1),(10,221.00,'2026-11-15 18:05:00','0801200011223',4,3);
/*!40000 ALTER TABLE `pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `id_producto` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `marca` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categoria` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `precio_compra` decimal(10,2) NOT NULL,
  `precio_venta` decimal(10,2) NOT NULL,
  `stock` int unsigned NOT NULL DEFAULT '0',
  `stock_limite` int unsigned NOT NULL DEFAULT '0',
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id_producto`),
  KEY `idx_producto_nombre` (`nombre`),
  KEY `idx_producto_categoria` (`categoria`),
  CONSTRAINT `chk_producto_precio_compra` CHECK ((`precio_compra` >= 0)),
  CONSTRAINT `chk_producto_precio_venta` CHECK ((`precio_venta` >= `precio_compra`))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (1,'Arroz Blanco 5 lb','El Granero','Granos básicos',85.00,105.00,120,20,'Arroz blanco grano largo'),(2,'Frijoles Rojos 2 lb','La Cosecha','Granos básicos',38.00,48.00,150,25,'Frijol rojo seda seleccionado'),(3,'Aceite Vegetal 1 L','Dorado','Abarrotes',62.00,78.00,80,15,'Aceite vegetal de soya'),(4,'Azúcar 5 lb','Caña Real','Abarrotes',70.00,88.00,100,20,'Azúcar blanca refinada'),(5,'Café Molido 400 g','Montaña Azul','Bebidas',95.00,125.00,60,10,'Café hondureño tostado y molido'),(6,'Leche Entera 1 L','Lácteos del Valle','Lácteos',28.00,36.00,90,20,'Leche entera pasteurizada'),(7,'Jabón de Lavar 400 g','Espumax','Limpieza',18.00,25.00,200,30,'Jabón en barra para ropa'),(8,'Papel Higiénico 4 rollos','Suave Plus','Higiene',45.00,60.00,75,15,'Papel higiénico doble hoja'),(9,'Refresco 2 L','Burbujas','Bebidas',35.00,48.00,110,24,'Bebida gaseosa sabor cola'),(10,'Pasta Dental 100 ml','Dentiblanc','Higiene',32.00,45.00,70,12,'Pasta dental con flúor');
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedor`
--

DROP TABLE IF EXISTS `proveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedor` (
  `id_proveedor` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `n_cuenta` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_proveedor`),
  UNIQUE KEY `uq_proveedor_email` (`email`),
  CONSTRAINT `chk_proveedor_email` CHECK (((`email` is null) or (`email` like _utf8mb4'%_@_%._%')))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedor`
--

LOCK TABLES `proveedor` WRITE;
/*!40000 ALTER TABLE `proveedor` DISABLE KEYS */;
INSERT INTO `proveedor` VALUES (1,'Distribuidora Central S.A.','2234-5678','200-01-123456-7','ventas@distcentral.hn'),(2,'Comercializadora del Norte','2550-1122','110-02-987654-3','pedidos@comnorte.hn'),(3,'Importadora La Económica','2245-9900','305-11-456789-0','contacto@laeconomica.hn'),(4,'Lácteos y Bebidas del Valle','2770-3344','210-05-654321-8',NULL);
/*!40000 ALTER TABLE `proveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reclamo`
--

DROP TABLE IF EXISTS `reclamo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reclamo` (
  `id_reclamo` int unsigned NOT NULL AUTO_INCREMENT,
  `observaciones` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_reclamo` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dni_cliente` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_empleado` int unsigned NOT NULL,
  PRIMARY KEY (`id_reclamo`),
  KEY `fk_reclamo_cliente` (`dni_cliente`),
  KEY `fk_reclamo_empleado` (`id_empleado`),
  CONSTRAINT `fk_reclamo_cliente` FOREIGN KEY (`dni_cliente`) REFERENCES `cliente` (`dni_cliente`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_reclamo_empleado` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reclamo`
--

LOCK TABLES `reclamo` WRITE;
/*!40000 ALTER TABLE `reclamo` DISABLE KEYS */;
INSERT INTO `reclamo` VALUES (1,'La leche entregada estaba próxima a vencer.','Producto en mal estado','0801199012345',1),(2,'Se cobró un refresco de más en el pedido.','Error de cobro','1501200155667',3),(3,'Demora excesiva en la atención en caja.','Atención al cliente','0301199877889',1),(4,'Solicita cambio de pasta dental por empaque dañado.','Devolución','0801198822334',4);
/*!40000 ALTER TABLE `reclamo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int unsigned NOT NULL AUTO_INCREMENT,
  `id_empleado` int unsigned NOT NULL,
  `nombre_usuario` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contrasena_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` enum('Administrador','Cajero','Bodeguero') COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` enum('activo','inactivo','bloqueado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'activo',
  `intentos_fallidos` tinyint unsigned NOT NULL DEFAULT '0',
  `ultimo_acceso` datetime DEFAULT NULL,
  `fecha_creacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `uq_usuarios_nombre` (`nombre_usuario`),
  UNIQUE KEY `uq_usuarios_empleado` (`id_empleado`),
  CONSTRAINT `fk_usuarios_empleado` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,1,'cmejia','$2a$10$uwyKD7Z3akPaAGOi0FaKe.o/aFIzgcA1MNpJaAyeFKa6rtivGxIhi','Administrador','activo',0,'2026-11-25 00:53:34','2026-11-24 01:44:37'),(2,2,'alopez','$2a$10$keQQaWl07addBoYrjDE6K.zTucAYWC5sTZ4OgOLFL5gUniIs3KcuC','Cajero','activo',0,NULL,'2026-11-24 01:44:37'),(3,3,'jmartinez','$2a$10$/.saaYsVAGBUtu8wieQf..5g/thWs5mOVq8g59IundiQpBDacy/h.','Cajero','activo',0,NULL,'2026-11-24 01:44:37'),(4,4,'mhernandez','$2a$10$ckhxsEoHYq6j92fw0nJrHe2VmNJomMRz4scW4T7zECZ1YuZvB1CGG','Cajero','activo',0,NULL,'2026-11-24 01:44:37'),(5,5,'lramirez','$2a$10$SKuFfGbC1v.EkEKyWJxDzOoPuq.3rvnLXEsDXImcb15cCFcgeMdmS','Bodeguero','activo',0,NULL,'2026-11-24 01:44:37');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-25  1:37:51
