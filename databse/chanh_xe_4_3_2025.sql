-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: mysql-12ea7de1-ptnghia-vnpt.g.aivencloud.com    Database: chanh_xe
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'adbfd8e7-f34e-11ef-8c3c-aeb42a39543a:1-464';

--
-- Table structure for table `ben_xe`
--

DROP TABLE IF EXISTS `ben_xe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ben_xe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dia_chi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ten_ben_xe` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tinh` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `huyen` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `xa` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_nguoi_cap_nhat` int NOT NULL,
  `ngay_cap_nhat` datetime NOT NULL,
  `ngay_tao` datetime NOT NULL,
  `duong` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ben_xe`
--

LOCK TABLES `ben_xe` WRITE;
/*!40000 ALTER TABLE `ben_xe` DISABLE KEYS */;
INSERT INTO `ben_xe` VALUES (16,'Nguyễn Thiện Thành, Thị trấn Càng Long, Huyện Càng Long, Tỉnh Trà Vinh','Bến xe Trà Vinh','Tỉnh Trà Vinh','Huyện Càng Long','Thị trấn Càng Long',13,'2025-03-03 13:06:05','2025-02-26 16:23:00','Nguyễn Thiện Thành'),(17,'Nguyễn Đáng, Thị trấn An Phú, Huyện An Phú, Tỉnh An Giang','Bến xe Tỉnh An Giang','Tỉnh An Giang','Huyện An Phú','Thị trấn An Phú',13,'2025-02-26 17:40:42','2025-02-26 16:57:20','Nguyễn Đáng'),(18,'1234, Thị trấn Trà Cú, Huyện Trà Cú, Tỉnh Trà Vinh','Tra Cu','Tỉnh Trà Vinh','Huyện Trà Cú','Thị trấn Trà Cú',21,'2025-02-27 04:21:57','2025-02-27 04:21:57','1234'),(19,'Đường 10, Xã Phú Thành, Huyện Trà Ôn, Tỉnh Vĩnh Long','Bến Xe Vĩnh Long','Tỉnh Vĩnh Long','Huyện Trà Ôn','Xã Phú Thành',13,'2025-03-03 06:07:00','2025-03-03 06:07:00','Đường 10'),(20,'Đường 18, Phường Phú Thượng, Quận Tây Hồ, Thành phố Hà Nội','Bến xe Hà Nội','Thành phố Hà Nội','Quận Tây Hồ','Phường Phú Thượng',13,'2025-03-03 17:58:14','2025-03-03 17:58:14','Đường 18');
/*!40000 ALTER TABLE `ben_xe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chuyen_xe`
--

DROP TABLE IF EXISTS `chuyen_xe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chuyen_xe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `xe_id` int DEFAULT NULL,
  `tai_xe_id` int DEFAULT NULL,
  `tai_xe_phu_id` int DEFAULT NULL,
  `thoi_gian_xuat_ben` datetime DEFAULT NULL,
  `thoi_gian_cap_ben` datetime DEFAULT NULL,
  `trang_thai` enum('dang_van_chuyen','da_cap_ben','cho_xuat_ben') COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_nguoi_cap_nhat` int NOT NULL,
  `ngay_cap_nhat` datetime NOT NULL,
  `ngay_tao` datetime NOT NULL,
  `id_ben_xe_nhan` int NOT NULL,
  `id_ben_xe_gui` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `xe_id` (`xe_id`),
  KEY `tai_xe_id` (`tai_xe_id`),
  KEY `tai_xe_phu_id` (`tai_xe_phu_id`),
  CONSTRAINT `chuyen_xe_ibfk_1` FOREIGN KEY (`xe_id`) REFERENCES `xe` (`id`),
  CONSTRAINT `chuyen_xe_ibfk_2` FOREIGN KEY (`tai_xe_id`) REFERENCES `tai_xe` (`id`),
  CONSTRAINT `chuyen_xe_ibfk_3` FOREIGN KEY (`tai_xe_phu_id`) REFERENCES `tai_xe` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chuyen_xe`
--

LOCK TABLES `chuyen_xe` WRITE;
/*!40000 ALTER TABLE `chuyen_xe` DISABLE KEYS */;
INSERT INTO `chuyen_xe` VALUES (1,1,1,1,'2025-02-28 17:42:51','2025-03-29 17:42:51','dang_van_chuyen',13,'2025-03-03 06:16:20','2025-02-27 10:50:36',16,17),(2,2,1,1,'2025-03-10 13:10:19','2025-03-29 13:10:19','dang_van_chuyen',13,'2025-03-03 11:54:30','2025-03-03 06:13:22',16,17),(3,296,4,13,'2025-03-05 00:19:00',NULL,'dang_van_chuyen',13,'2025-03-03 17:49:02','2025-03-03 17:21:47',16,17),(4,284,14,12,'2025-03-05 00:58:38',NULL,'dang_van_chuyen',13,'2025-03-03 18:04:09','2025-03-03 17:59:41',17,16);
/*!40000 ALTER TABLE `chuyen_xe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `don_hang`
--

DROP TABLE IF EXISTS `don_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `don_hang` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ma_van_don` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ma_qr_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nguoi_gui_id` int DEFAULT NULL,
  `id_ben_xe_nhan` int NOT NULL,
  `id_ben_xe_gui` int NOT NULL,
  `loai_hang_hoa` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `trong_luong` decimal(10,2) DEFAULT NULL,
  `kich_thuoc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `so_kien` int DEFAULT NULL,
  `gia_tri_hang` decimal(15,2) DEFAULT NULL,
  `cuoc_phi` decimal(15,2) NOT NULL,
  `phi_bao_hiem` decimal(15,2) DEFAULT NULL,
  `phu_phi` decimal(15,2) DEFAULT NULL,
  `trang_thai` enum('cho_xu_ly','da_nhan','dang_van_chuyen','giao_thanh_cong','giao_that_bai') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cho_xu_ly',
  `id_nguoi_cap_nhat` int NOT NULL,
  `ngay_cap_nhat` datetime NOT NULL,
  `ngay_tao` datetime NOT NULL,
  `ten_nguoi_nhan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `so_dien_thoai_nhan` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_nhan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ma_van_don` (`ma_van_don`),
  UNIQUE KEY `ma_qr_code` (`ma_qr_code`),
  KEY `nguoi_gui_id` (`nguoi_gui_id`),
  CONSTRAINT `don_hang_ibfk_1` FOREIGN KEY (`nguoi_gui_id`) REFERENCES `khach_hang` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_hang`
--

LOCK TABLES `don_hang` WRITE;
/*!40000 ALTER TABLE `don_hang` DISABLE KEYS */;
INSERT INTO `don_hang` VALUES (1,'VD-189bad66-6d9d-4dee-8','QR-7b1ca91b-9c44-4ab7-b',3,17,16,'ádfasd',10.00,'2',1,300000.00,20000.00,32000.00,21323.00,'dang_van_chuyen',13,'2025-03-03 11:54:30','2025-02-27 07:47:27','Vinh võ','0327434555','vinh@gmail.com'),(2,'VD-7db149d4-e647-41a4-9','QR-5aed7d2e-cd0a-430e-8',3,17,16,'hang_de_vo',10.00,'50 x 30 x 20 cm  ',2,500000.00,20000.00,20000.00,10000.00,'dang_van_chuyen',13,'2025-02-27 18:04:39','2025-02-27 08:04:42','Phạm Thái Khải Vinh','0327434222','khaivinh@gmail.com'),(3,'VD-959f7c34-1764-462e-8','QR-6c977446-aa15-41f1-8',3,17,16,'hang_nguy_hiem',21.00,' 50 x 20 x 30 cm',2,500000.00,20000.00,100000.00,10000.00,'dang_van_chuyen',13,'2025-03-03 06:16:20','2025-02-27 18:11:51','Phạm Thái Khải Vinh','0327434222','admin@gmail.com'),(4,'VD-1a2b3c4d-5678-9e0f','QR-5f6g7h8i-9j0k-l1m2',463,17,16,'hang_de_vong',15.50,'40 x 25 x 15 cm',1,300000.00,15000.00,60000.00,5000.00,'dang_van_chuyen',13,'2025-03-03 17:49:02','2025-03-03 17:30:39','Nguyễn Văn An','0912345678','annguyen@gmail.com'),(5,'VD-2b3c4d5e-6789-f0a1','QR-6g7h8i9j-0k1l-m2n3',463,17,16,'hang_thuong',10.00,'30 x 20 x 20 cm',3,200000.00,12000.00,40000.00,3000.00,'dang_van_chuyen',13,'2025-03-03 18:04:09','2025-03-03 17:30:39','Trần Thị Bình','0987654321','binhtran@gmail.com'),(6,'VD-3c4d5e6f-7890-a1b2','QR-7h8i9j0k-1l2m-n3o4',463,17,16,'hang_nguy_hiem',25.75,'60 x 30 x 40 cm',2,800000.00,25000.00,160000.00,15000.00,'dang_van_chuyen',13,'2025-03-03 18:04:09','2025-03-03 17:30:39','Lê Minh Châu','0934567890','chaule@gmail.com'),(7,'VD-4d5e6f7g-8901-b2c3','QR-8i9j0k1l-2m3n-o4p5',463,17,16,'hang_de_vong',8.25,'35 x 15 x 25 cm',1,150000.00,10000.00,30000.00,2000.00,'dang_van_chuyen',13,'2025-03-03 18:04:09','2025-03-03 17:30:39','Phạm Quốc Đạt','0978123456','datpham@gmail.com'),(8,'VD-5e6f7g8h-9012-c3d4','QR-9j0k1l2m-3n4o-p5q6',463,17,16,'hang_thuong',12.00,'45 x 25 x 20 cm',4,450000.00,18000.00,90000.00,8000.00,'dang_van_chuyen',13,'2025-03-03 18:04:09','2025-03-03 17:30:39','Hoàng Thị E','0945678901','ethoang@gmail.com'),(9,'VD-6f7g8h9i-0123-d4e5','QR-0k1l2m3n-4o5p-q6r7',463,17,16,'hang_nguy_hiem',30.00,'70 x 40 x 50 cm',2,1200000.00,30000.00,240000.00,20000.00,'dang_van_chuyen',13,'2025-03-03 18:04:09','2025-03-03 17:30:39','Vũ Văn Tài','0961234567','taivu@gmail.com'),(10,'VD-7g8h9i0j-1234-e5f6','QR-1l2m3n4o-5p6q-r7s8',463,17,16,'hang_de_vong',18.50,'50 x 30 x 25 cm',3,600000.00,20000.00,120000.00,10000.00,'dang_van_chuyen',13,'2025-03-03 18:04:09','2025-03-03 17:30:39','Đỗ Thị Gấm','0923456789','gamdo@gmail.com'),(11,'VD-8h9i0j1k-2345-f6g7','QR-2m3n4o5p-6q7r-s8t9',463,17,16,'hang_thuong',7.80,'25 x 20 x 15 cm',1,250000.00,13000.00,50000.00,4000.00,'dang_van_chuyen',13,'2025-03-03 18:04:09','2025-03-03 17:30:39','Bùi Văn Hùng','0956789012','hungbui@gmail.com'),(12,'VD-9i0j1k2l-3456-g7h8','QR-3n4o5p6q-7r8s-t9u0',463,17,16,'hang_nguy_hiem',22.30,'55 x 35 x 30 cm',2,700000.00,22000.00,140000.00,12000.00,'dang_van_chuyen',13,'2025-03-03 18:04:09','2025-03-03 17:30:39','Ngô Thị I','0918901234','ingo@gmail.com'),(13,'VD-0j1k2l3m-4567-h8i9','QR-4o5p6q7r-8s9t-u0v1',463,17,16,'hang_thuong',14.60,'40 x 30 x 20 cm',3,350000.00,17000.00,70000.00,6000.00,'dang_van_chuyen',13,'2025-03-03 18:04:09','2025-03-03 17:30:39','Lý Văn Khánh','0932109876','khanhly@gmail.com'),(14,'VD-28eebd2a-32d1-47ee-a','QR-5d090a36-5b3e-4adb-8',474,17,16,'hang_de_vo',10.00,'50 x 30 x 20 cm  ',2,500000.00,100000.00,100000.00,10000.00,'dang_van_chuyen',13,'2025-03-03 18:04:09','2025-03-03 18:03:21','Nguyễn Khánh','0327434222','nguyenkhanh@gmail.com');
/*!40000 ALTER TABLE `don_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `don_hang_chuyen_xe`
--

DROP TABLE IF EXISTS `don_hang_chuyen_xe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `don_hang_chuyen_xe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `don_hang_id` int DEFAULT NULL,
  `don_hang_chuyen_xe_id` int DEFAULT NULL,
  `id_nguoi_cap_nhat` int NOT NULL,
  `ngay_cap_nhat` datetime NOT NULL,
  `ngay_tao` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `don_hang_cua_ben_id` (`don_hang_id`),
  KEY `don_hang_chuyen_xe_id` (`don_hang_chuyen_xe_id`),
  CONSTRAINT `don_hang_chuyen_xe_ibfk_1` FOREIGN KEY (`don_hang_chuyen_xe_id`) REFERENCES `chuyen_xe` (`id`) ON DELETE CASCADE,
  CONSTRAINT `don_hang_chuyen_xe_ibfk_2` FOREIGN KEY (`don_hang_id`) REFERENCES `don_hang` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_hang_chuyen_xe`
--

LOCK TABLES `don_hang_chuyen_xe` WRITE;
/*!40000 ALTER TABLE `don_hang_chuyen_xe` DISABLE KEYS */;
INSERT INTO `don_hang_chuyen_xe` VALUES (15,1,2,13,'2025-03-03 18:54:30','2025-03-03 18:54:30'),(17,4,3,13,'2025-03-04 00:49:02','2025-03-04 00:49:02'),(18,5,4,13,'2025-03-04 01:04:09','2025-03-04 01:04:09'),(19,6,4,13,'2025-03-04 01:04:09','2025-03-04 01:04:09'),(20,7,4,13,'2025-03-04 01:04:09','2025-03-04 01:04:09'),(21,8,4,13,'2025-03-04 01:04:09','2025-03-04 01:04:09'),(22,9,4,13,'2025-03-04 01:04:09','2025-03-04 01:04:09'),(23,10,4,13,'2025-03-04 01:04:09','2025-03-04 01:04:09'),(24,11,4,13,'2025-03-04 01:04:09','2025-03-04 01:04:09'),(25,12,4,13,'2025-03-04 01:04:09','2025-03-04 01:04:09'),(26,13,4,13,'2025-03-04 01:04:09','2025-03-04 01:04:09'),(27,14,4,13,'2025-03-04 01:04:09','2025-03-04 01:04:09');
/*!40000 ALTER TABLE `don_hang_chuyen_xe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khach_hang`
--

DROP TABLE IF EXISTS `khach_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `khach_hang` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ho_ten` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_dien_thoai` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mat_khau` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dia_chi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_nguoi_cap_nhat` int NOT NULL,
  `ngay_cap_nhat` datetime NOT NULL,
  `ngay_tao` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `so_dien_thoai` (`so_dien_thoai`)
) ENGINE=InnoDB AUTO_INCREMENT=475 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khach_hang`
--

LOCK TABLES `khach_hang` WRITE;
/*!40000 ALTER TABLE `khach_hang` DISABLE KEYS */;
INSERT INTO `khach_hang` VALUES (3,'Phúc khách hàng nè','0327434821','$2b$10$xm6oE/1fiT3/jV4iYNLyleF2mTe0c8h1WNUrWSx2nK4V/6LWUs3ru','10, Xã Hàm Giang, Huyện Trà Cú, Tỉnh Trà Vinh',13,'2025-02-27 07:21:35','2025-02-27 07:21:35'),(4,'Trần Khải Vinh','0327434222','$2b$10$Mwe4REWC6AQkGw6.R..oZ.xSDOZuUb1Sf0IddJ2IZ7GrURnxPe1um','đường 18, Phường Quang Trung, Thành phố Hà Giang, Tỉnh Hà Giang',13,'2025-03-03 05:33:13','2025-03-03 05:33:13'),(455,'Nguyễn Văn An','0391234567','$2b$10$Mwe4REWC6AQkGw6.R..oZ.xSDOZuUb1Sf0IddJ2IZ7GrURnxPe1um','123 Đường Láng, Quận Đống Đa, Hà Nội',13,'2025-03-03 13:04:57','2025-03-03 13:04:57'),(456,'Trần Thị Bình','0912345670','$2b$10$Mwe4REWC6AQkGw6.R..oZ.xSDOZuUb1Sf0IddJ2IZ7GrURnxPe1um','45 Nguyễn Huệ, TP Huế, Thừa Thiên Huế',13,'2025-03-03 13:04:57','2025-03-03 13:04:57'),(457,'Lê Hoàng Cường','0387654321','$2b$10$Mwe4REWC6AQkGw6.R..oZ.xSDOZuUb1Sf0IddJ2IZ7GrURnxPe1um','78 Lê Lợi, Quận 1, TP Hồ Chí Minh',13,'2025-03-03 13:04:57','2025-03-03 13:04:57'),(458,'Phạm Minh Đức','0976543210','$2b$10$Mwe4REWC6AQkGw6.R..oZ.xSDOZuUb1Sf0IddJ2IZ7GrURnxPe1um','12 Trần Phú, TP Đà Nẵng',13,'2025-03-03 13:04:57','2025-03-03 13:04:57'),(459,'Hoàng Thị Hạnh','0356789123','$2b$10$Mwe4REWC6AQkGw6.R..oZ.xSDOZuUb1Sf0IddJ2IZ7GrURnxPe1um','56 Hùng Vương, TP Nha Trang, Khánh Hòa',13,'2025-03-03 13:04:57','2025-03-03 13:04:57'),(460,'Vũ Văn Hùng','0901234567','$2b$10$Mwe4REWC6AQkGw6.R..oZ.xSDOZuUb1Sf0IddJ2IZ7GrURnxPe1um','89 Nguyễn Trãi, Quận 5, TP Hồ Chí Minh',13,'2025-03-03 13:04:57','2025-03-03 13:04:57'),(461,'Đỗ Thị Lan','0367891234','$2b$10$Mwe4REWC6AQkGw6.R..oZ.xSDOZuUb1Sf0IddJ2IZ7GrURnxPe1um','34 Lê Đại Hành, TP Vinh, Nghệ An',13,'2025-03-03 13:04:57','2025-03-03 13:04:57'),(462,'Bùi Văn Minh','0934567890','$2b$10$Mwe4REWC6AQkGw6.R..oZ.xSDOZuUb1Sf0IddJ2IZ7GrURnxPe1um','67 Phạm Văn Đồng, TP Cần Thơ',13,'2025-03-03 13:04:57','2025-03-03 13:04:57'),(463,'Ngô Thị Ngọc','0378912345','$2b$10$Mwe4REWC6AQkGw6.R..oZ.xSDOZuUb1Sf0IddJ2IZ7GrURnxPe1um','23 Trần Hưng Đạo, TP Hải Phòng',13,'2025-03-03 13:04:57','2025-03-03 13:04:57'),(464,'Trương Văn Phong','0987654321','$2b$10$Mwe4REWC6AQkGw6.R..oZ.xSDOZuUb1Sf0IddJ2IZ7GrURnxPe1um','90 Lý Thường Kiệt, TP Quy Nhơn, Bình Định',13,'2025-03-03 13:04:57','2025-03-03 13:04:57'),(465,'Nguyễn Thị Quỳnh','0345678901','$2b$10$Mwe4REWC6AQkGw6.R..oZ.xSDOZuUb1Sf0IddJ2IZ7GrURnxPe1um','15 Nguyễn Văn Cừ, TP Hạ Long, Quảng Ninh',13,'2025-03-03 13:04:57','2025-03-03 13:04:57'),(466,'Trần Văn Sang','0961234567','$2b$10$Mwe4REWC6AQkGw6.R..oZ.xSDOZuUb1Sf0IddJ2IZ7GrURnxPe1um','27 Lê Văn Sỹ, Quận 3, TP Hồ Chí Minh',13,'2025-03-03 13:04:57','2025-03-03 13:04:57'),(467,'Lê Thị Thu','0337891234','$2b$10$Mwe4REWC6AQkGw6.R..oZ.xSDOZuUb1Sf0IddJ2IZ7GrURnxPe1um','81 Bùi Thị Xuân, TP Đà Lạt, Lâm Đồng',13,'2025-03-03 13:04:57','2025-03-03 13:04:57'),(468,'Phạm Văn Tâm','0923456789','$2b$10$Mwe4REWC6AQkGw6.R..oZ.xSDOZuUb1Sf0IddJ2IZ7GrURnxPe1um','19 Hùng Vương, TP Buôn Ma Thuột, Đắk Lắk',13,'2025-03-03 13:04:57','2025-03-03 13:04:57'),(469,'Hoàng Văn Toàn','0398765432','$2b$10$Mwe4REWC6AQkGw6.R..oZ.xSDOZuUb1Sf0IddJ2IZ7GrURnxPe1um','36 Nguyễn Thị Minh Khai, TP Vũng Tàu, Bà Rịa - Vũng Tàu',13,'2025-03-03 13:04:57','2025-03-03 13:04:57'),(470,'Vũ Thị Uyên','0915678901','$2b$10$Mwe4REWC6AQkGw6.R..oZ.xSDOZuUb1Sf0IddJ2IZ7GrURnxPe1um','54 Lê Thánh Tôn, TP Phan Thiết, Bình Thuận',13,'2025-03-03 13:04:57','2025-03-03 13:04:57'),(471,'Đỗ Văn Vĩ','0389123456','$2b$10$Mwe4REWC6AQkGw6.R..oZ.xSDOZuUb1Sf0IddJ2IZ7GrURnxPe1um','72 Trần Quốc Toản, TP Đồng Hới, Quảng Bình',13,'2025-03-03 13:04:57','2025-03-03 13:04:57'),(472,'Bùi Thị Xuân','0971234567','$2b$10$Mwe4REWC6AQkGw6.R..oZ.xSDOZuUb1Sf0IddJ2IZ7GrURnxPe1um','11 Nguyễn Đình Chiểu, TP Thanh Hóa',13,'2025-03-03 13:04:57','2025-03-03 13:04:57'),(473,'Ngô Văn Ý','0351234567','$2b$10$Mwe4REWC6AQkGw6.R..oZ.xSDOZuUb1Sf0IddJ2IZ7GrURnxPe1um','88 Phạm Hồng Thái, TP Nam Định',13,'2025-03-03 13:04:57','2025-03-03 13:04:57'),(474,'Mạnh An ','0983666123','$2b$10$A8xmpG5xmb9GlqUAtYKxFeG15bZVeXkCBSYcdt.7vKjM6h3ZeD1ZG','Đường 18, Xã Mỹ Hòa, Huyện Cầu Ngang, Tỉnh Trà Vinh',13,'2025-03-03 18:02:02','2025-03-03 18:02:02');
/*!40000 ALTER TABLE `khach_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nguoi_dung`
--

DROP TABLE IF EXISTS `nguoi_dung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nguoi_dung` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ho_ten` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_dien_thoai` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mat_khau` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `vai_tro` enum('admin','nhan_vien_kho','tai_xe','tai_xe_phu','nhan_vien_dieu_phoi','nhan_vien_giao_dich') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `trang_thai` enum('hoat_dong','tam_ngung','ngung_hoat_dong') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'hoat_dong',
  `id_nguoi_cap_nhat` int NOT NULL,
  `ngay_cap_nhat` datetime NOT NULL,
  `ngay_tao` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `so_dien_thoai` (`so_dien_thoai`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nguoi_dung`
--

LOCK TABLES `nguoi_dung` WRITE;
/*!40000 ALTER TABLE `nguoi_dung` DISABLE KEYS */;
INSERT INTO `nguoi_dung` VALUES (13,'Phúc','0327434824','hohoangphucjob@gmail.com','$2b$10$N..NEs5ybA5C8W/Q70twhuFkiSUsV.ggxTTCi5xowla.hNZIHmxsW','admin','hoat_dong',0,'2025-02-22 23:11:10','2025-02-22 23:11:10'),(16,'Phúc','0327434821','phucvntv159@gmail.com','$2b$10$PdQKp2LSu22QvEs0kafZAu52RhxemZIuWPBLsZA0Jy3eVNIbHmNci','nhan_vien_giao_dich','tam_ngung',13,'2025-03-03 12:12:34','2025-02-24 12:40:31'),(17,'Phúc Tài Xế','0327434555','phucvntv1@gmail.com','$2b$10$MmrGZ7Z38QTs7ilb9BFkaumW6TQ7rOrDMboezAA7PN.B3RgQD.75W','tai_xe','tam_ngung',13,'2025-02-28 04:21:44','2025-02-24 13:13:19'),(18,'Phúc tài xế phụ ','03274348552','phucvntv2@gmail.com','$2b$10$oNtHdWV7pSlQTYMKoyMb8.g13JbhN/t0dgKXtswab6JkBmkUhtKFK','tai_xe_phu','hoat_dong',13,'2025-02-26 17:42:06','2025-02-24 13:13:52'),(19,'Phúc Quản lý kho','03274348557','phucvntv3@gmail.com','$2b$10$8eOM4NkuP30o9DPGpnYkfe3Nu5iaIr394xVl7CLVxp5RlnGgTdNvO','nhan_vien_kho','hoat_dong',13,'2025-02-26 17:42:09','2025-02-24 13:14:11'),(20,'Phúc điều phối xe','03274348558','phucvntv4@gmail.com','$2b$10$mQ5/ZsTd93IyzxgKlWn.B.wcyb7iVo.H8ozvZm5m6Jvl8GlHdsfxm','nhan_vien_dieu_phoi','hoat_dong',13,'2025-02-26 17:42:19','2025-02-24 13:14:48'),(21,'Khải Vinh','03274347444','vinh@gmail.com','$2b$10$svi791CZcwWiHWUIT1x9VuhA3pX6iff61OA21FwmryEERVNZJqiNi','admin','hoat_dong',13,'2025-02-27 04:18:09','2025-02-27 04:18:09'),(22,'Khải','03274434222','khai@gmail.com','$2b$10$ZAwR01Dcp9k3Q4lN0UzumOCmfAYeVopbgmsChee5DU4ixM73Sfb1W','tai_xe','hoat_dong',13,'2025-03-03 12:38:36','2025-03-03 12:38:36'),(23,'Khánh ','0328825124','khanh@gmail.com','$2b$10$dxle40Wt8Dc7BzgG8oXqqOKCJQHzMEckleyYzmAD53QW99F1O9JAm','tai_xe_phu','hoat_dong',13,'2025-03-03 12:38:55','2025-03-03 12:38:55'),(24,'Trần Văn An','0912345678','taixephu1@example.com','$2b$10$N..NEs5ybA5C8W/Q70twhuFkiSUsV.ggxTTCi5xowla.hNZIHmxsW','tai_xe_phu','hoat_dong',13,'2025-03-03 16:57:46','2025-03-03 16:57:46'),(25,'Lê Thị Bình','0912345679','taixephu2@example.com','$2b$10$N..NEs5ybA5C8W/Q70twhuFkiSUsV.ggxTTCi5xowla.hNZIHmxsW','tai_xe_phu','hoat_dong',13,'2025-03-03 16:57:46','2025-03-03 16:57:46'),(26,'Phạm Văn Cường','0912345680','taixephu3@example.com','$2b$10$N..NEs5ybA5C8W/Q70twhuFkiSUsV.ggxTTCi5xowla.hNZIHmxsW','tai_xe_phu','hoat_dong',13,'2025-03-03 16:57:46','2025-03-03 16:57:46'),(27,'Nguyễn Thị Dung','0912345681','taixephu4@example.com','$2b$10$N..NEs5ybA5C8W/Q70twhuFkiSUsV.ggxTTCi5xowla.hNZIHmxsW','tai_xe_phu','hoat_dong',13,'2025-03-03 16:57:46','2025-03-03 16:57:46'),(28,'Hoàng Văn Đạt','0912345682','taixephu5@example.com','$2b$10$N..NEs5ybA5C8W/Q70twhuFkiSUsV.ggxTTCi5xowla.hNZIHmxsW','tai_xe_phu','hoat_dong',13,'2025-03-03 16:57:46','2025-03-03 16:57:46'),(29,'Vũ Thị Hương','0912345683','taixephu6@example.com','$2b$10$N..NEs5ybA5C8W/Q70twhuFkiSUsV.ggxTTCi5xowla.hNZIHmxsW','tai_xe_phu','hoat_dong',13,'2025-03-03 16:57:46','2025-03-03 16:57:46'),(30,'Đặng Văn Hải','0912345684','taixephu7@example.com','$2b$10$N..NEs5ybA5C8W/Q70twhuFkiSUsV.ggxTTCi5xowla.hNZIHmxsW','tai_xe_phu','hoat_dong',13,'2025-03-03 16:57:46','2025-03-03 16:57:46'),(31,'Bùi Thị Lan','0912345685','taixephu8@example.com','$2b$10$N..NEs5ybA5C8W/Q70twhuFkiSUsV.ggxTTCi5xowla.hNZIHmxsW','tai_xe_phu','hoat_dong',13,'2025-03-03 16:57:46','2025-03-03 16:57:46'),(32,'Mai Văn Minh','0912345686','taixephu9@example.com','$2b$10$N..NEs5ybA5C8W/Q70twhuFkiSUsV.ggxTTCi5xowla.hNZIHmxsW','tai_xe_phu','hoat_dong',13,'2025-03-03 16:57:46','2025-03-03 16:57:46'),(33,'Trịnh Thị Ngọc','0912345687','taixephu10@example.com','$2b$10$N..NEs5ybA5C8W/Q70twhuFkiSUsV.ggxTTCi5xowla.hNZIHmxsW','tai_xe_phu','hoat_dong',13,'2025-03-03 16:57:46','2025-03-03 16:57:46'),(34,'Nguyễn Văn Hùng','0912345688','taixe1@example.com','$2b$10$N..NEs5ybA5C8W/Q70twhuFkiSUsV.ggxTTCi5xowla.hNZIHmxsW','tai_xe','hoat_dong',13,'2025-03-03 16:57:46','2025-03-03 16:57:46'),(35,'Lý Thị Mai','0912345689','taixe2@example.com','$2b$10$N..NEs5ybA5C8W/Q70twhuFkiSUsV.ggxTTCi5xowla.hNZIHmxsW','tai_xe','hoat_dong',13,'2025-03-03 16:57:46','2025-03-03 16:57:46'),(36,'Trần Văn Nam','0912345690','taixe3@example.com','$2b$10$N..NEs5ybA5C8W/Q70twhuFkiSUsV.ggxTTCi5xowla.hNZIHmxsW','tai_xe','hoat_dong',13,'2025-03-03 16:57:46','2025-03-03 16:57:46'),(37,'Phan Thị Oanh','0912345691','taixe4@example.com','$2b$10$N..NEs5ybA5C8W/Q70twhuFkiSUsV.ggxTTCi5xowla.hNZIHmxsW','tai_xe','hoat_dong',13,'2025-03-03 16:57:46','2025-03-03 16:57:46'),(38,'Võ Văn Phúc','0912345692','taixe5@example.com','$2b$10$N..NEs5ybA5C8W/Q70twhuFkiSUsV.ggxTTCi5xowla.hNZIHmxsW','tai_xe','hoat_dong',13,'2025-03-03 16:57:46','2025-03-03 16:57:46'),(39,'Đỗ Thị Quỳnh','0912345693','taixe6@example.com','$2b$10$N..NEs5ybA5C8W/Q70twhuFkiSUsV.ggxTTCi5xowla.hNZIHmxsW','tai_xe','hoat_dong',13,'2025-03-03 16:57:46','2025-03-03 16:57:46'),(40,'Hồ Văn Sơn','0912345694','taixe7@example.com','$2b$10$N..NEs5ybA5C8W/Q70twhuFkiSUsV.ggxTTCi5xowla.hNZIHmxsW','tai_xe','hoat_dong',13,'2025-03-03 16:57:46','2025-03-03 16:57:46'),(41,'Chu Thị Tuyết','0912345695','taixe8@example.com','$2b$10$N..NEs5ybA5C8W/Q70twhuFkiSUsV.ggxTTCi5xowla.hNZIHmxsW','tai_xe','hoat_dong',13,'2025-03-03 16:57:46','2025-03-03 16:57:46'),(42,'Lưu Văn Tuấn','0912345696','taixe9@example.com','$2b$10$N..NEs5ybA5C8W/Q70twhuFkiSUsV.ggxTTCi5xowla.hNZIHmxsW','tai_xe','hoat_dong',13,'2025-03-03 16:57:46','2025-03-03 16:57:46'),(43,'Dương Thị Uyên','0912345697','taixe10@example.com','$2b$10$N..NEs5ybA5C8W/Q70twhuFkiSUsV.ggxTTCi5xowla.hNZIHmxsW','tai_xe','hoat_dong',13,'2025-03-03 16:57:46','2025-03-03 16:57:46'),(44,'Bảo Trân','0327434327','baotranh@gmail.com','$2b$10$e1VhNLdqkATP2Jp6qKEz6.1hvDi36y39zlFTwF/g.S6WXgZ3FtHEu','tai_xe','hoat_dong',13,'2025-03-03 17:55:14','2025-03-03 17:55:14');
/*!40000 ALTER TABLE `nguoi_dung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phan_cong_dia_diem_nguoi_dung`
--

DROP TABLE IF EXISTS `phan_cong_dia_diem_nguoi_dung`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phan_cong_dia_diem_nguoi_dung` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_ben` int NOT NULL,
  `id_nguoi_dung` int NOT NULL,
  `id_nguoi_cap_nhat` int NOT NULL,
  `ngay_tao` datetime NOT NULL,
  `ngay_cap_nhat` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_nguoi_dung` (`id_nguoi_dung`),
  CONSTRAINT `phan_cong_dia_diem_nguoi_dung_ibfk_1` FOREIGN KEY (`id_nguoi_dung`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phan_cong_dia_diem_nguoi_dung`
--

LOCK TABLES `phan_cong_dia_diem_nguoi_dung` WRITE;
/*!40000 ALTER TABLE `phan_cong_dia_diem_nguoi_dung` DISABLE KEYS */;
/*!40000 ALTER TABLE `phan_cong_dia_diem_nguoi_dung` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phan_cong_dia_diem_tai_xe`
--

DROP TABLE IF EXISTS `phan_cong_dia_diem_tai_xe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phan_cong_dia_diem_tai_xe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_ben` int NOT NULL,
  `id_tai_xe` int NOT NULL,
  `id_nguoi_cap_nhat` int NOT NULL,
  `ngay_tao` datetime NOT NULL,
  `ngay_cap_nhat` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_tai_xe` (`id_tai_xe`),
  CONSTRAINT `phan_cong_dia_diem_tai_xe_ibfk_1` FOREIGN KEY (`id_tai_xe`) REFERENCES `tai_xe` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phan_cong_dia_diem_tai_xe`
--

LOCK TABLES `phan_cong_dia_diem_tai_xe` WRITE;
/*!40000 ALTER TABLE `phan_cong_dia_diem_tai_xe` DISABLE KEYS */;
/*!40000 ALTER TABLE `phan_cong_dia_diem_tai_xe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phan_cong_dia_diem_xe`
--

DROP TABLE IF EXISTS `phan_cong_dia_diem_xe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phan_cong_dia_diem_xe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_ben` int NOT NULL,
  `id_xe` int NOT NULL,
  `id_nguoi_cap_nhat` int NOT NULL,
  `ngay_tao` datetime NOT NULL,
  `ngay_cap_nhat` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_xe` (`id_xe`),
  CONSTRAINT `phan_cong_dia_diem_xe_ibfk_1` FOREIGN KEY (`id_xe`) REFERENCES `xe` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phan_cong_dia_diem_xe`
--

LOCK TABLES `phan_cong_dia_diem_xe` WRITE;
/*!40000 ALTER TABLE `phan_cong_dia_diem_xe` DISABLE KEYS */;
/*!40000 ALTER TABLE `phan_cong_dia_diem_xe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tai_xe`
--

DROP TABLE IF EXISTS `tai_xe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tai_xe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nguoi_dung_id` int DEFAULT NULL,
  `bang_lai` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_nguoi_cap_nhat` int NOT NULL,
  `ngay_cap_nhat` datetime NOT NULL,
  `ngay_tao` datetime NOT NULL,
  `trang_thai` enum('hoat_dong','ngung_hoat_dong','dang_van_chuyen') COLLATE utf8mb4_unicode_ci DEFAULT 'hoat_dong',
  PRIMARY KEY (`id`),
  UNIQUE KEY `nguoi_dung_id` (`nguoi_dung_id`),
  CONSTRAINT `tai_xe_ibfk_1` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tai_xe`
--

LOCK TABLES `tai_xe` WRITE;
/*!40000 ALTER TABLE `tai_xe` DISABLE KEYS */;
INSERT INTO `tai_xe` VALUES (1,18,'B2',13,'2025-02-27 08:54:35','2025-02-27 08:54:35','hoat_dong'),(2,42,'B2',13,'2025-03-03 17:01:03','2025-03-03 17:01:03','hoat_dong'),(3,35,'B2',13,'2025-03-03 17:01:17','2025-03-03 17:01:17','hoat_dong'),(4,39,'B2',13,'2025-03-03 17:49:02','2025-03-03 17:01:31','dang_van_chuyen'),(5,25,'B2',13,'2025-03-03 17:01:37','2025-03-03 17:01:37','hoat_dong'),(6,32,'B2',13,'2025-03-03 17:01:44','2025-03-03 17:01:44','hoat_dong'),(10,17,'B2',13,'2025-03-03 17:18:28','2025-03-03 17:13:31','hoat_dong'),(11,22,'B2',13,'2025-03-03 17:18:22','2025-03-03 17:13:35','hoat_dong'),(12,23,'B2',13,'2025-03-03 18:04:09','2025-03-03 17:18:36','dang_van_chuyen'),(13,27,'B2',13,'2025-03-03 17:49:02','2025-03-03 17:18:44','dang_van_chuyen'),(14,44,'B2',13,'2025-03-03 18:04:09','2025-03-03 17:55:34','dang_van_chuyen');
/*!40000 ALTER TABLE `tai_xe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `xe`
--

DROP TABLE IF EXISTS `xe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `xe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bien_so` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `loai_xe` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `suc_chua` decimal(10,2) NOT NULL,
  `trang_thai` enum('hoat_dong','bao_tri','ngung_hoat_dong','dang_van_chuyen') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_nguoi_cap_nhat` int NOT NULL,
  `ngay_cap_nhat` datetime NOT NULL,
  `ngay_tao` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `bien_so` (`bien_so`)
) ENGINE=InnoDB AUTO_INCREMENT=310 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `xe`
--

LOCK TABLES `xe` WRITE;
/*!40000 ALTER TABLE `xe` DISABLE KEYS */;
INSERT INTO `xe` VALUES (1,'84-E12A261','Xe tải nhẹ',100.00,'hoat_dong',13,'2025-02-26 16:55:46','2025-02-24 13:48:37'),(2,'84-A4444-H','Xe tải trung',200.00,'dang_van_chuyen',13,'2025-03-03 11:54:30','2025-03-03 06:04:52'),(259,'84-A4244-H','Xe tải trung',200.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(260,'84-E12A2612','Xe tải nhẹ',100.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(261,'84-B5544-K','Xe tải trung',180.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(262,'84-C9932-L','Xe tải nặng',300.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(263,'84-D8821-M','Xe tải trung',220.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(264,'84-E7743-N','Xe tải nhẹ',120.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(265,'84-F6622-O','Xe tải trung',210.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(266,'84-G5511-P','Xe tải nặng',320.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(267,'84-H4400-Q','Xe tải nhẹ',130.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(268,'84-I3388-R','Xe tải trung',190.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(269,'84-J2277-S','Xe tải nhẹ',110.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(270,'84-K1166-T','Xe tải trung',200.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(271,'84-L0055-U','Xe tải nặng',350.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(272,'84-M9944-V','Xe tải trung',180.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(273,'84-N8833-W','Xe tải nhẹ',120.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(274,'84-O7722-X','Xe tải trung',230.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(275,'84-P6611-Y','Xe tải nặng',330.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(276,'84-Q5500-Z','Xe tải nhẹ',140.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(277,'84-R4499-A','Xe tải trung',200.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(278,'84-S3388-B','Xe tải nặng',300.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(279,'84-T2277-C','Xe tải trung',210.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(280,'84-U1166-D','Xe tải nhẹ',110.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(281,'84-V0055-E','Xe tải trung',200.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(282,'84-W9944-F','Xe tải nặng',350.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(283,'84-X8833-G','Xe tải nhẹ',120.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(284,'84-Y7722-H','Xe tải trung',230.00,'dang_van_chuyen',13,'2025-03-03 18:04:09','2025-03-03 12:53:04'),(285,'84-Z6611-I','Xe tải nặng',330.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(286,'84-A5500-J','Xe tải nhẹ',140.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(287,'84-B4499-K','Xe tải trung',200.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(288,'84-C3388-L','Xe tải nặng',300.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(289,'84-D2277-M','Xe tải trung',210.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(290,'84-E1166-N','Xe tải nhẹ',110.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(291,'84-F0055-O','Xe tải trung',200.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(292,'84-G9944-P','Xe tải nặng',350.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(293,'84-H8833-Q','Xe tải nhẹ',120.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(294,'84-I7722-R','Xe tải trung',230.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(295,'84-J6611-S','Xe tải nặng',330.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(296,'84-K5500-T','Xe tải nhẹ',140.00,'dang_van_chuyen',13,'2025-03-03 17:49:02','2025-03-03 12:53:04'),(297,'84-L4499-U','Xe tải trung',200.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(298,'84-M3388-V','Xe tải nặng',300.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(299,'84-N2277-W','Xe tải trung',210.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(300,'84-O1166-X','Xe tải nhẹ',110.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(301,'84-P0055-Y','Xe tải trung',200.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(302,'84-Q9944-Z','Xe tải nặng',350.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(303,'84-R8833-A','Xe tải nhẹ',120.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(304,'84-S7722-B','Xe tải trung',230.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(305,'84-T6611-C','Xe tải nặng',330.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(306,'84-U5500-D','Xe tải nhẹ',140.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(307,'84-V4499-E','Xe tải trung',200.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04'),(308,'84-W3388-F','Xe tải nặng',300.00,'hoat_dong',13,'2025-03-03 12:53:04','2025-03-03 12:53:04');
/*!40000 ALTER TABLE `xe` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-04 11:12:30
