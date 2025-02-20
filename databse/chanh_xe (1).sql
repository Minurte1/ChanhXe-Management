-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th2 20, 2025 lúc 06:51 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `chanh_xe`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ben_xe`
--

CREATE TABLE `ben_xe` (
  `id` int(11) NOT NULL,
  `dia_chi` int(11) NOT NULL,
  `ten_ben_xe` text NOT NULL,
  `id_nguoi_cap_nhat` int(11) NOT NULL,
  `ngay_cap_nhat` datetime NOT NULL,
  `ngay_tao` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chuyen_xe`
--

CREATE TABLE `chuyen_xe` (
  `id` int(11) NOT NULL,
  `xe_id` int(11) DEFAULT NULL,
  `tai_xe_id` int(11) DEFAULT NULL,
  `tai_xe_phu_id` int(11) DEFAULT NULL,
  `thoi_gian_xuat_ben` datetime DEFAULT NULL,
  `thoi_gian_cap_ben` datetime DEFAULT NULL,
  `trang_thai` enum('dang_van_chuyen','da_den') NOT NULL DEFAULT 'dang_van_chuyen',
  `id_nguoi_cap_nhat` int(11) NOT NULL,
  `ngay_cap_nhat` datetime NOT NULL,
  `ngay_tao` datetime NOT NULL,
  `id_ben_xe_nhan` int(11) NOT NULL,
  `id_ben_xe_gui` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dia_diem`
--

CREATE TABLE `dia_diem` (
  `id` int(11) NOT NULL,
  `tinh` text NOT NULL,
  `huyen` text NOT NULL,
  `xa` text NOT NULL,
  `id_nguoi_cap_nhat` int(11) NOT NULL,
  `ngay_cap_nhat` datetime NOT NULL,
  `ngay_tao` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `don_hang`
--

CREATE TABLE `don_hang` (
  `id` int(11) NOT NULL,
  `ma_van_don` varchar(50) NOT NULL,
  `ma_qr_code` varchar(255) NOT NULL,
  `nguoi_gui_id` int(11) DEFAULT NULL,
  `nguoi_nhan_id` int(11) DEFAULT NULL,
  `id_ben_xe_nhan` int(11) NOT NULL,
  `id_ben_xe_gui` int(11) NOT NULL,
  `loai_hang_hoa` varchar(255) NOT NULL,
  `trong_luong` decimal(10,2) DEFAULT NULL,
  `kich_thuoc` varchar(255) DEFAULT NULL,
  `so_kien` int(11) DEFAULT NULL,
  `gia_tri_hang` decimal(15,2) DEFAULT NULL,
  `cuoc_phi` decimal(15,2) NOT NULL,
  `phi_bao_hiem` decimal(15,2) DEFAULT NULL,
  `phu_phi` decimal(15,2) DEFAULT NULL,
  `trang_thai` enum('cho_xu_ly','da_nhan','dang_van_chuyen','giao_thanh_cong','giao_that_bai') NOT NULL DEFAULT 'cho_xu_ly',
  `ben_don_hang_id` int(11) DEFAULT NULL,
  `id_nguoi_cap_nhat` int(11) NOT NULL,
  `ngay_cap_nhat` datetime NOT NULL,
  `ngay_tao` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `don_hang_chuyen_xe`
--

CREATE TABLE `don_hang_chuyen_xe` (
  `id` int(11) NOT NULL,
  `don_hang_id` int(11) DEFAULT NULL,
  `don_hang_chuyen_xe_id` int(11) DEFAULT NULL,
  `id_nguoi_cap_nhat` int(11) NOT NULL,
  `ngay_cap_nhat` datetime NOT NULL,
  `ngay_tao` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khach_hang`
--

CREATE TABLE `khach_hang` (
  `id` int(11) NOT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `so_dien_thoai` varchar(20) NOT NULL,
  `dia_chi` text NOT NULL,
  `id_nguoi_cap_nhat` int(11) NOT NULL,
  `ngay_cap_nhat` datetime NOT NULL,
  `ngay_tao` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nguoi_dung`
--

CREATE TABLE `nguoi_dung` (
  `id` int(11) NOT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `so_dien_thoai` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mat_khau` varchar(255) NOT NULL,
  `vai_tro` enum('admin','nhan_vien_kho','tai_xe','tai_xe_phu','nhan_vien_dieu_phoi') NOT NULL,
  `trang_thai` enum('hoat_dong','tam_ngung','ngung_hoat_dong') NOT NULL DEFAULT 'hoat_dong',
  `id_nguoi_cap_nhat` int(11) NOT NULL,
  `ngay_cap_nhat` datetime NOT NULL,
  `ngay_tao` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phan_cong_dia_diem_nguoi_dung`
--

CREATE TABLE `phan_cong_dia_diem_nguoi_dung` (
  `id` int(11) NOT NULL,
  `id_ben` int(11) NOT NULL,
  `id_nguoi_dung` int(11) NOT NULL,
  `id_nguoi_cap_nhat` int(11) NOT NULL,
  `ngay_tao` datetime NOT NULL,
  `ngay_cap_nhat` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phan_cong_dia_diem_tai_xe`
--

CREATE TABLE `phan_cong_dia_diem_tai_xe` (
  `id` int(11) NOT NULL,
  `id_ben` int(11) NOT NULL,
  `id_tai_xe` int(11) NOT NULL,
  `id_nguoi_cap_nhat` int(11) NOT NULL,
  `ngay_tao` datetime NOT NULL,
  `ngay_cap_nhat` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phan_cong_dia_diem_xe`
--

CREATE TABLE `phan_cong_dia_diem_xe` (
  `id` int(11) NOT NULL,
  `id_ben` int(11) NOT NULL,
  `id_xe` int(11) NOT NULL,
  `id_nguoi_cap_nhat` int(11) NOT NULL,
  `ngay_tao` datetime NOT NULL,
  `ngay_cap_nhat` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tai_xe`
--

CREATE TABLE `tai_xe` (
  `id` int(11) NOT NULL,
  `nguoi_dung_id` int(11) DEFAULT NULL,
  `bang_lai` varchar(50) NOT NULL,
  `id_nguoi_cap_nhat` int(11) NOT NULL,
  `ngay_cap_nhat` datetime NOT NULL,
  `ngay_tao` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `xe`
--

CREATE TABLE `xe` (
  `id` int(11) NOT NULL,
  `bien_so` varchar(20) NOT NULL,
  `loai_xe` varchar(50) NOT NULL,
  `suc_chua` decimal(10,2) NOT NULL,
  `trang_thai` enum('hoat_dong','bao_tri','ngung_hoat_dong') NOT NULL DEFAULT 'hoat_dong',
  `id_nguoi_cap_nhat` int(11) NOT NULL,
  `ngay_cap_nhat` datetime NOT NULL,
  `ngay_tao` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `ben_xe`
--
ALTER TABLE `ben_xe`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rang_buot_dia_chi_ben_xe` (`dia_chi`);

--
-- Chỉ mục cho bảng `chuyen_xe`
--
ALTER TABLE `chuyen_xe`
  ADD PRIMARY KEY (`id`),
  ADD KEY `xe_id` (`xe_id`),
  ADD KEY `tai_xe_id` (`tai_xe_id`),
  ADD KEY `tai_xe_phu_id` (`tai_xe_phu_id`);

--
-- Chỉ mục cho bảng `dia_diem`
--
ALTER TABLE `dia_diem`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `don_hang`
--
ALTER TABLE `don_hang`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ma_van_don` (`ma_van_don`),
  ADD UNIQUE KEY `ma_qr_code` (`ma_qr_code`),
  ADD KEY `nguoi_gui_id` (`nguoi_gui_id`),
  ADD KEY `nguoi_nhan_id` (`nguoi_nhan_id`),
  ADD KEY `fk_don_hang_ben_don_hang` (`ben_don_hang_id`);

--
-- Chỉ mục cho bảng `don_hang_chuyen_xe`
--
ALTER TABLE `don_hang_chuyen_xe`
  ADD PRIMARY KEY (`id`),
  ADD KEY `don_hang_cua_ben_id` (`don_hang_id`),
  ADD KEY `don_hang_chuyen_xe_id` (`don_hang_chuyen_xe_id`);

--
-- Chỉ mục cho bảng `khach_hang`
--
ALTER TABLE `khach_hang`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `so_dien_thoai` (`so_dien_thoai`);

--
-- Chỉ mục cho bảng `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `so_dien_thoai` (`so_dien_thoai`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Chỉ mục cho bảng `phan_cong_dia_diem_nguoi_dung`
--
ALTER TABLE `phan_cong_dia_diem_nguoi_dung`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_nguoi_dung` (`id_nguoi_dung`);

--
-- Chỉ mục cho bảng `phan_cong_dia_diem_tai_xe`
--
ALTER TABLE `phan_cong_dia_diem_tai_xe`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tai_xe` (`id_tai_xe`);

--
-- Chỉ mục cho bảng `phan_cong_dia_diem_xe`
--
ALTER TABLE `phan_cong_dia_diem_xe`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_xe` (`id_xe`);

--
-- Chỉ mục cho bảng `tai_xe`
--
ALTER TABLE `tai_xe`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nguoi_dung_id` (`nguoi_dung_id`);

--
-- Chỉ mục cho bảng `xe`
--
ALTER TABLE `xe`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `bien_so` (`bien_so`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `chuyen_xe`
--
ALTER TABLE `chuyen_xe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `don_hang`
--
ALTER TABLE `don_hang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `don_hang_chuyen_xe`
--
ALTER TABLE `don_hang_chuyen_xe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `khach_hang`
--
ALTER TABLE `khach_hang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tai_xe`
--
ALTER TABLE `tai_xe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `xe`
--
ALTER TABLE `xe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `ben_xe`
--
ALTER TABLE `ben_xe`
  ADD CONSTRAINT `rang_buot_dia_chi_ben_xe` FOREIGN KEY (`dia_chi`) REFERENCES `dia_diem` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `chuyen_xe`
--
ALTER TABLE `chuyen_xe`
  ADD CONSTRAINT `chuyen_xe_ibfk_1` FOREIGN KEY (`xe_id`) REFERENCES `xe` (`id`),
  ADD CONSTRAINT `chuyen_xe_ibfk_2` FOREIGN KEY (`tai_xe_id`) REFERENCES `tai_xe` (`id`),
  ADD CONSTRAINT `chuyen_xe_ibfk_3` FOREIGN KEY (`tai_xe_phu_id`) REFERENCES `tai_xe` (`id`);

--
-- Các ràng buộc cho bảng `don_hang`
--
ALTER TABLE `don_hang`
  ADD CONSTRAINT `don_hang_ibfk_1` FOREIGN KEY (`nguoi_gui_id`) REFERENCES `khach_hang` (`id`),
  ADD CONSTRAINT `don_hang_ibfk_2` FOREIGN KEY (`nguoi_nhan_id`) REFERENCES `khach_hang` (`id`);

--
-- Các ràng buộc cho bảng `don_hang_chuyen_xe`
--
ALTER TABLE `don_hang_chuyen_xe`
  ADD CONSTRAINT `don_hang_chuyen_xe_ibfk_1` FOREIGN KEY (`don_hang_chuyen_xe_id`) REFERENCES `chuyen_xe` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `don_hang_chuyen_xe_ibfk_2` FOREIGN KEY (`don_hang_id`) REFERENCES `don_hang` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `phan_cong_dia_diem_nguoi_dung`
--
ALTER TABLE `phan_cong_dia_diem_nguoi_dung`
  ADD CONSTRAINT `phan_cong_dia_diem_nguoi_dung_ibfk_1` FOREIGN KEY (`id_nguoi_dung`) REFERENCES `nguoi_dung` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `phan_cong_dia_diem_tai_xe`
--
ALTER TABLE `phan_cong_dia_diem_tai_xe`
  ADD CONSTRAINT `phan_cong_dia_diem_tai_xe_ibfk_1` FOREIGN KEY (`id_tai_xe`) REFERENCES `tai_xe` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `phan_cong_dia_diem_xe`
--
ALTER TABLE `phan_cong_dia_diem_xe`
  ADD CONSTRAINT `phan_cong_dia_diem_xe_ibfk_1` FOREIGN KEY (`id_xe`) REFERENCES `xe` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tai_xe`
--
ALTER TABLE `tai_xe`
  ADD CONSTRAINT `tai_xe_ibfk_1` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
