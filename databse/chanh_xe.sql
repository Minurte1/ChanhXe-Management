-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: chanh_xe
-- ------------------------------------------------------
-- Server version	8.0.40

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

--
-- Table structure for table `ben_don_hang`
--

DROP TABLE IF EXISTS `ben_don_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ben_don_hang` (
  `id` int NOT NULL AUTO_INCREMENT,
  `don_hang_id` int DEFAULT NULL,
  `dia_chi` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `trangthai` enum('dang_van_chuyen','giao_thanh_cong','giao_that_bai','cho_xu_ly') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `don_hang_id` (`don_hang_id`),
  CONSTRAINT `ben_don_hang_ibfk_1` FOREIGN KEY (`don_hang_id`) REFERENCES `don_hang` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ben_don_hang`
--

LOCK TABLES `ben_don_hang` WRITE;
/*!40000 ALTER TABLE `ben_don_hang` DISABLE KEYS */;
/*!40000 ALTER TABLE `ben_don_hang` ENABLE KEYS */;
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
  `trang_thai` enum('dang_van_chuyen','da_den') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'dang_van_chuyen',
  PRIMARY KEY (`id`),
  KEY `xe_id` (`xe_id`),
  KEY `tai_xe_id` (`tai_xe_id`),
  KEY `tai_xe_phu_id` (`tai_xe_phu_id`),
  CONSTRAINT `chuyen_xe_ibfk_1` FOREIGN KEY (`xe_id`) REFERENCES `xe` (`id`),
  CONSTRAINT `chuyen_xe_ibfk_2` FOREIGN KEY (`tai_xe_id`) REFERENCES `tai_xe` (`id`),
  CONSTRAINT `chuyen_xe_ibfk_3` FOREIGN KEY (`tai_xe_phu_id`) REFERENCES `tai_xe` (`id`),
  CONSTRAINT `chuyen_xe_ibfk_4` FOREIGN KEY (`id`) REFERENCES `don_hang_cua_ben_chuyen_xe` (`don_hang_chuyen_xe_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chuyen_xe`
--

LOCK TABLES `chuyen_xe` WRITE;
/*!40000 ALTER TABLE `chuyen_xe` DISABLE KEYS */;
/*!40000 ALTER TABLE `chuyen_xe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doanh_thu`
--

DROP TABLE IF EXISTS `doanh_thu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doanh_thu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ngay` date NOT NULL,
  `doanh_thu` decimal(15,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doanh_thu`
--

LOCK TABLES `doanh_thu` WRITE;
/*!40000 ALTER TABLE `doanh_thu` DISABLE KEYS */;
/*!40000 ALTER TABLE `doanh_thu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `don_hang`
--

DROP TABLE IF EXISTS `don_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `don_hang` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ma_van_don` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ma_qr_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nguoi_gui_id` int DEFAULT NULL,
  `nguoi_nhan_id` int DEFAULT NULL,
  `dia_chi_gui` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `dia_chi_nhan` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `loai_hang_hoa` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `trong_luong` decimal(10,2) DEFAULT NULL,
  `kich_thuoc` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `so_kien` int DEFAULT NULL,
  `gia_tri_hang` decimal(15,2) DEFAULT NULL,
  `cuoc_phi` decimal(15,2) NOT NULL,
  `phi_bao_hiem` decimal(15,2) DEFAULT NULL,
  `phu_phi` decimal(15,2) DEFAULT NULL,
  `trang_thai` enum('cho_xu_ly','da_nhan','dang_van_chuyen','giao_thanh_cong','giao_that_bai') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cho_xu_ly',
  `ben_don_hang_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ma_van_don` (`ma_van_don`),
  UNIQUE KEY `ma_qr_code` (`ma_qr_code`),
  KEY `nguoi_gui_id` (`nguoi_gui_id`),
  KEY `nguoi_nhan_id` (`nguoi_nhan_id`),
  KEY `fk_don_hang_ben_don_hang` (`ben_don_hang_id`),
  CONSTRAINT `don_hang_ibfk_1` FOREIGN KEY (`nguoi_gui_id`) REFERENCES `khach_hang` (`id`),
  CONSTRAINT `don_hang_ibfk_2` FOREIGN KEY (`nguoi_nhan_id`) REFERENCES `khach_hang` (`id`),
  CONSTRAINT `fk_don_hang_ben_don_hang` FOREIGN KEY (`ben_don_hang_id`) REFERENCES `ben_don_hang` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_hang`
--

LOCK TABLES `don_hang` WRITE;
/*!40000 ALTER TABLE `don_hang` DISABLE KEYS */;
/*!40000 ALTER TABLE `don_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `don_hang_cua_ben_chuyen_xe`
--

DROP TABLE IF EXISTS `don_hang_cua_ben_chuyen_xe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `don_hang_cua_ben_chuyen_xe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `don_hang_cua_ben_id` int DEFAULT NULL,
  `don_hang_chuyen_xe_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `don_hang_cua_ben_id` (`don_hang_cua_ben_id`),
  KEY `don_hang_chuyen_xe_id` (`don_hang_chuyen_xe_id`),
  CONSTRAINT `don_hang_cua_ben_chuyen_xe_ibfk_1` FOREIGN KEY (`don_hang_cua_ben_id`) REFERENCES `ben_don_hang` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_hang_cua_ben_chuyen_xe`
--

LOCK TABLES `don_hang_cua_ben_chuyen_xe` WRITE;
/*!40000 ALTER TABLE `don_hang_cua_ben_chuyen_xe` DISABLE KEYS */;
/*!40000 ALTER TABLE `don_hang_cua_ben_chuyen_xe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khach_hang`
--

DROP TABLE IF EXISTS `khach_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `khach_hang` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ho_ten` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_dien_thoai` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dia_chi` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `so_dien_thoai` (`so_dien_thoai`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khach_hang`
--

LOCK TABLES `khach_hang` WRITE;
/*!40000 ALTER TABLE `khach_hang` DISABLE KEYS */;
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
  `ho_ten` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_dien_thoai` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mat_khau` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vai_tro` enum('admin','nhan_vien_kho','tai_xe','tai_xe_phu','nhan_vien_dieu_phoi') COLLATE utf8mb4_unicode_ci NOT NULL,
  `trang_thai` enum('hoat_dong','tam_ngung','ngung_hoat_dong') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'hoat_dong',
  PRIMARY KEY (`id`),
  UNIQUE KEY `so_dien_thoai` (`so_dien_thoai`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nguoi_dung`
--

LOCK TABLES `nguoi_dung` WRITE;
/*!40000 ALTER TABLE `nguoi_dung` DISABLE KEYS */;
/*!40000 ALTER TABLE `nguoi_dung` ENABLE KEYS */;
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
  `bang_lai` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nguoi_dung_id` (`nguoi_dung_id`),
  CONSTRAINT `tai_xe_ibfk_1` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tai_xe`
--

LOCK TABLES `tai_xe` WRITE;
/*!40000 ALTER TABLE `tai_xe` DISABLE KEYS */;
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
  `bien_so` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `loai_xe` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `suc_chua` decimal(10,2) NOT NULL,
  `trang_thai` enum('hoat_dong','bao_tri','ngung_hoat_dong') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'hoat_dong',
  PRIMARY KEY (`id`),
  UNIQUE KEY `bien_so` (`bien_so`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `xe`
--

LOCK TABLES `xe` WRITE;
/*!40000 ALTER TABLE `xe` DISABLE KEYS */;
/*!40000 ALTER TABLE `xe` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-18 14:53:29
