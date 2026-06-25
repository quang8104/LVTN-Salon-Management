-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 25, 2026 at 02:51 PM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `salon_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `chi_tiet_don_hang`
--

DROP TABLE IF EXISTS `chi_tiet_don_hang`;
CREATE TABLE IF NOT EXISTS `chi_tiet_don_hang` (
  `ma_chi_tiet` int NOT NULL AUTO_INCREMENT,
  `ma_don_hang` int NOT NULL,
  `ma_san_pham` int NOT NULL,
  `so_luong` int NOT NULL,
  `don_gia` decimal(12,2) NOT NULL,
  `thanh_tien` decimal(12,2) NOT NULL,
  PRIMARY KEY (`ma_chi_tiet`),
  KEY `ma_don_hang` (`ma_don_hang`),
  KEY `ma_san_pham` (`ma_san_pham`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chi_tiet_hoa_don_bh`
--

DROP TABLE IF EXISTS `chi_tiet_hoa_don_bh`;
CREATE TABLE IF NOT EXISTS `chi_tiet_hoa_don_bh` (
  `ma_chi_tiet` int NOT NULL AUTO_INCREMENT,
  `ma_hoa_don_bh` int DEFAULT NULL,
  `ma_san_pham` int DEFAULT NULL,
  `so_luong` int DEFAULT NULL,
  `don_gia` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`ma_chi_tiet`),
  KEY `ma_hoa_don_bh` (`ma_hoa_don_bh`),
  KEY `ma_san_pham` (`ma_san_pham`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `chi_tiet_hoa_don_bh`
--

INSERT INTO `chi_tiet_hoa_don_bh` (`ma_chi_tiet`, `ma_hoa_don_bh`, `ma_san_pham`, `so_luong`, `don_gia`) VALUES
(1, 1, 1, 2, 120000.00),
(2, 1, 2, 1, 210000.00),
(3, 2, 1, 2, 120000.00),
(4, 2, 2, 1, 210000.00);

-- --------------------------------------------------------

--
-- Table structure for table `chi_tiet_lich_hen`
--

DROP TABLE IF EXISTS `chi_tiet_lich_hen`;
CREATE TABLE IF NOT EXISTS `chi_tiet_lich_hen` (
  `ma_chi_tiet_lich_hen` int NOT NULL AUTO_INCREMENT,
  `ma_lich_hen` int NOT NULL,
  `ma_dich_vu` int NOT NULL,
  `don_gia` decimal(12,2) NOT NULL,
  `thoi_gian` int NOT NULL,
  PRIMARY KEY (`ma_chi_tiet_lich_hen`),
  KEY `ma_lich_hen` (`ma_lich_hen`),
  KEY `ma_dich_vu` (`ma_dich_vu`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `chi_tiet_lich_hen`
--

INSERT INTO `chi_tiet_lich_hen` (`ma_chi_tiet_lich_hen`, `ma_lich_hen`, `ma_dich_vu`, `don_gia`, `thoi_gian`) VALUES
(1, 1, 1, 150000.00, 45),
(2, 2, 3, 500000.00, 120),
(3, 1, 1, 100000.00, 30),
(4, 1, 2, 50000.00, 15),
(5, 1, 3, 300000.00, 120),
(6, 1, 1, 100000.00, 60),
(7, 2, 1, 100000.00, 30),
(8, 2, 2, 50000.00, 15),
(9, 2, 3, 300000.00, 120),
(10, 2, 1, 150000.00, 45),
(11, 2, 1, 150000.00, 45),
(12, 2, 1, 150000.00, 45),
(13, 2, 1, 150000.00, 45),
(14, 3, 1, 150000.00, 45),
(15, 3, 1, 150000.00, 45);

-- --------------------------------------------------------

--
-- Table structure for table `chi_tiet_nvdv`
--

DROP TABLE IF EXISTS `chi_tiet_nvdv`;
CREATE TABLE IF NOT EXISTS `chi_tiet_nvdv` (
  `ma_nhan_vien` int NOT NULL,
  `ma_dich_vu` int NOT NULL,
  `ghi_chu` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ma_nhan_vien`,`ma_dich_vu`),
  KEY `ma_dich_vu` (`ma_dich_vu`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `chi_tiet_nvdv`
--

INSERT INTO `chi_tiet_nvdv` (`ma_nhan_vien`, `ma_dich_vu`, `ghi_chu`) VALUES
(1, 3, 'Chuyên gia uốn tóc'),
(1, 5, 'Chuyên gia nhuộm tóc'),
(2, 1, 'Cắt tóc nam VIP'),
(3, 5, 'Nhuộm màu thời trang'),
(3, 1, 'Cắt tóc cơ bản');

-- --------------------------------------------------------

--
-- Table structure for table `danh_gia`
--

DROP TABLE IF EXISTS `danh_gia`;
CREATE TABLE IF NOT EXISTS `danh_gia` (
  `ma_danh_gia` int NOT NULL AUTO_INCREMENT,
  `ma_khach_hang` int NOT NULL,
  `loai_danh_gia` int NOT NULL,
  `ma_san_pham` int DEFAULT NULL,
  `ma_dich_vu` int DEFAULT NULL,
  `ma_nhan_vien` int DEFAULT NULL,
  `noi_dung` text,
  `so_sao` int DEFAULT NULL,
  `ngay_danh_gia` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_danh_gia`),
  KEY `ma_khach_hang` (`ma_khach_hang`),
  KEY `ma_san_pham` (`ma_san_pham`),
  KEY `ma_dich_vu` (`ma_dich_vu`),
  KEY `ma_nhan_vien` (`ma_nhan_vien`)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `dich_vu`
--

DROP TABLE IF EXISTS `dich_vu`;
CREATE TABLE IF NOT EXISTS `dich_vu` (
  `ma_dich_vu` int NOT NULL AUTO_INCREMENT,
  `ten_dich_vu` varchar(100) NOT NULL,
  `mo_ta` text,
  `gia` decimal(12,2) NOT NULL,
  `thoi_gian_thuc_hien` int NOT NULL,
  `anh_gioi_thieu` varchar(255) DEFAULT NULL,
  `trang_thai` int DEFAULT '1',
  PRIMARY KEY (`ma_dich_vu`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `dich_vu`
--

INSERT INTO `dich_vu` (`ma_dich_vu`, `ten_dich_vu`, `mo_ta`, `gia`, `thoi_gian_thuc_hien`, `anh_gioi_thieu`, `trang_thai`) VALUES
(1, 'Cắt tóc nam VIP', 'Cắt tóc + gội đầu', 150000.00, 45, 'vip.jpg', 1),
(3, 'Uốn tóc', 'Uốn tóc nữ', 500000.00, 120, 'uon.jpg', 1),
(5, 'Nhuộm tóc', 'Nhuộm màu thời trang', 600000.00, 180, 'nhuom.jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `don_hang`
--

DROP TABLE IF EXISTS `don_hang`;
CREATE TABLE IF NOT EXISTS `don_hang` (
  `ma_don_hang` int NOT NULL AUTO_INCREMENT,
  `ma_khach_hang` int NOT NULL,
  `ngay_dat` datetime DEFAULT CURRENT_TIMESTAMP,
  `tong_tien` decimal(12,2) DEFAULT '0.00',
  `trang_thai` int DEFAULT '0',
  `phuong_thuc_thanh_toan` int DEFAULT NULL,
  `thoi_gian_thanh_toan` datetime DEFAULT NULL,
  `ma_giao_dich` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ma_don_hang`),
  KEY `ma_khach_hang` (`ma_khach_hang`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hoa_don`
--

DROP TABLE IF EXISTS `hoa_don`;
CREATE TABLE IF NOT EXISTS `hoa_don` (
  `ma_hoa_don` int NOT NULL AUTO_INCREMENT,
  `ma_lich_hen` int NOT NULL,
  `tong_tien` decimal(12,2) NOT NULL,
  `trang_thai` int DEFAULT '0',
  `ngay_tao` datetime DEFAULT NULL,
  PRIMARY KEY (`ma_hoa_don`),
  KEY `fk_hd_lich` (`ma_lich_hen`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `hoa_don`
--

INSERT INTO `hoa_don` (`ma_hoa_don`, `ma_lich_hen`, `tong_tien`, `trang_thai`, `ngay_tao`) VALUES
(2, 2, 1550000.00, 1, '2026-06-25 13:06:55'),
(3, 3, 300000.00, 0, '2026-06-25 13:18:48');

-- --------------------------------------------------------

--
-- Table structure for table `hoa_don_ban_hang`
--

DROP TABLE IF EXISTS `hoa_don_ban_hang`;
CREATE TABLE IF NOT EXISTS `hoa_don_ban_hang` (
  `ma_hoa_don_bh` int NOT NULL AUTO_INCREMENT,
  `ma_khach_hang` int DEFAULT NULL,
  `tong_tien` decimal(12,2) DEFAULT NULL,
  `trang_thai` int DEFAULT '0',
  `ngay_tao` datetime DEFAULT NULL,
  PRIMARY KEY (`ma_hoa_don_bh`),
  KEY `ma_khach_hang` (`ma_khach_hang`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `hoa_don_ban_hang`
--

INSERT INTO `hoa_don_ban_hang` (`ma_hoa_don_bh`, `ma_khach_hang`, `tong_tien`, `trang_thai`, `ngay_tao`) VALUES
(1, 1, 450000.00, 1, '2026-06-25 15:52:59'),
(2, 1, 450000.00, 0, '2026-06-25 16:07:49');

-- --------------------------------------------------------

--
-- Table structure for table `khach_hang`
--

DROP TABLE IF EXISTS `khach_hang`;
CREATE TABLE IF NOT EXISTS `khach_hang` (
  `ma_khach_hang` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `mat_khau` varchar(255) NOT NULL,
  `ho_ten` varchar(100) NOT NULL,
  `sdt` varchar(20) NOT NULL,
  `dia_chi` varchar(255) DEFAULT NULL,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_khach_hang`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `sdt` (`sdt`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `khach_hang`
--

INSERT INTO `khach_hang` (`ma_khach_hang`, `email`, `mat_khau`, `ho_ten`, `sdt`, `dia_chi`, `ngay_tao`) VALUES
(1, 'qqqqqqqq@gmail.com', '123aada2@', 'qqqqqqqqqq', '0202022020', 'qdddddddd', '2026-06-22 15:24:38'),
(3, 'a@example.com', '$2a$10$p3sJXIulT5QPenO5cng5o.yUeXnzowWGOebRkFtzZbV/JS9.SyHsG', 'Nguyễn Văn A', '0123456789', '123 Đường ABC', '2026-06-22 19:06:13');

-- --------------------------------------------------------

--
-- Table structure for table `khuyen_mai`
--

DROP TABLE IF EXISTS `khuyen_mai`;
CREATE TABLE IF NOT EXISTS `khuyen_mai` (
  `ma_khuyen_mai` int NOT NULL AUTO_INCREMENT,
  `ten_khuyen_mai` varchar(100) NOT NULL,
  `loai_ap_dung` int NOT NULL,
  `ma_dich_vu` int DEFAULT NULL,
  `ma_san_pham` int DEFAULT NULL,
  `giam_gia` decimal(12,2) NOT NULL,
  `ngay_bat_dau` date DEFAULT NULL,
  `ngay_ket_thuc` date DEFAULT NULL,
  `trang_thai` int DEFAULT '1',
  PRIMARY KEY (`ma_khuyen_mai`),
  KEY `ma_dich_vu` (`ma_dich_vu`),
  KEY `ma_san_pham` (`ma_san_pham`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lich_hen`
--

DROP TABLE IF EXISTS `lich_hen`;
CREATE TABLE IF NOT EXISTS `lich_hen` (
  `ma_lich_hen` int NOT NULL AUTO_INCREMENT,
  `ma_khach_hang` int NOT NULL,
  `ma_nhan_vien` int NOT NULL,
  `ngay_hen` date NOT NULL,
  `gio_hen` time NOT NULL,
  `gio_ket_thuc_du_kien` time DEFAULT NULL,
  `gio_ket_thuc_thuc_te` time DEFAULT NULL,
  `thoi_gian_buffer` int DEFAULT '0',
  `tong_thoi_gian` int DEFAULT NULL,
  `trang_thai` int DEFAULT '0',
  PRIMARY KEY (`ma_lich_hen`),
  KEY `ma_khach_hang` (`ma_khach_hang`),
  KEY `ma_nhan_vien` (`ma_nhan_vien`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `lich_hen`
--

INSERT INTO `lich_hen` (`ma_lich_hen`, `ma_khach_hang`, `ma_nhan_vien`, `ngay_hen`, `gio_hen`, `gio_ket_thuc_du_kien`, `gio_ket_thuc_thuc_te`, `thoi_gian_buffer`, `tong_thoi_gian`, `trang_thai`) VALUES
(2, 3, 1, '2026-06-30', '14:00:00', '21:45:00', '16:10:40', 0, 465, 2),
(3, 1, 2, '2026-06-30', '14:00:00', '11:30:00', '16:02:34', NULL, 90, 2);

-- --------------------------------------------------------

--
-- Table structure for table `lich_hen_log`
--

DROP TABLE IF EXISTS `lich_hen_log`;
CREATE TABLE IF NOT EXISTS `lich_hen_log` (
  `ma_log` int NOT NULL AUTO_INCREMENT,
  `ma_lich_hen` int NOT NULL,
  `hanh_dong` varchar(50) DEFAULT NULL,
  `noi_dung_cu` text,
  `noi_dung_moi` text,
  `ly_do` text,
  `thoi_gian` datetime DEFAULT NULL,
  PRIMARY KEY (`ma_log`),
  KEY `fk_log_lich` (`ma_lich_hen`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `lich_hen_log`
--

INSERT INTO `lich_hen_log` (`ma_log`, `ma_lich_hen`, `hanh_dong`, `noi_dung_cu`, `noi_dung_moi`, `ly_do`, `thoi_gian`) VALUES
(1, 2, 'SUA_LICH', '2026-06-30 14:00', '2026-06-30 14:00', 'Khách đổi lịch', '2026-06-25 12:41:41');

-- --------------------------------------------------------

--
-- Table structure for table `nghi_phep`
--

DROP TABLE IF EXISTS `nghi_phep`;
CREATE TABLE IF NOT EXISTS `nghi_phep` (
  `ma_nghi_phep` int NOT NULL AUTO_INCREMENT,
  `ma_nhan_vien` int NOT NULL,
  `tu_ngay` date NOT NULL,
  `den_ngay` date NOT NULL,
  `ly_do` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ma_nghi_phep`),
  KEY `fk_nghiphep_nhanvien` (`ma_nhan_vien`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `nghi_phep`
--

INSERT INTO `nghi_phep` (`ma_nghi_phep`, `ma_nhan_vien`, `tu_ngay`, `den_ngay`, `ly_do`) VALUES
(2, 1, '2026-07-01', '2026-07-05', 'Về quê'),
(4, 1, '2026-07-15', '2026-07-16', 'Du lịch'),
(5, 1, '2026-07-17', '2026-07-17', 'Du lịch'),
(9, 1, '2026-07-18', '2026-07-19', 'Du lịch');

-- --------------------------------------------------------

--
-- Table structure for table `nhan_vien`
--

DROP TABLE IF EXISTS `nhan_vien`;
CREATE TABLE IF NOT EXISTS `nhan_vien` (
  `ma_nhan_vien` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `mat_khau` varchar(255) NOT NULL,
  `ho_ten` varchar(100) NOT NULL,
  `sdt` varchar(20) NOT NULL,
  `chuyen_mon` varchar(255) DEFAULT NULL,
  `trang_thai` int DEFAULT '1',
  `vai_tro` varchar(20) NOT NULL DEFAULT 'NHAN_VIEN',
  PRIMARY KEY (`ma_nhan_vien`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `sdt` (`sdt`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `nhan_vien`
--

INSERT INTO `nhan_vien` (`ma_nhan_vien`, `email`, `mat_khau`, `ho_ten`, `sdt`, `chuyen_mon`, `trang_thai`, `vai_tro`) VALUES
(1, 'nv01@gmail.com', '$2a$10$u6uRydZNOmwlv06hRVXKb.5Sni78piiydXZUQKnW8sVvnnz7yYhXW', 'Nguyễn Văn A Updated', '0999999999', 'Uốn tóc', 1, 'NHAN_VIEN'),
(2, 'nv02@gmail.com', '$2a$10$u6uRydZNOmwlv06hRVXKb.5Sni78piiydXZUQKnW8sVvnnz7yYhXW', 'Trần Thị B', '0988888888', 'Cắt tóc nam', 1, 'NHAN_VIEN'),
(3, 'nv03@gmail.com', '$2a$10$u6uRydZNOmwlv06hRVXKb.5Sni78piiydXZUQKnW8sVvnnz7yYhXW', 'Phạm Văn C', '0977777777', 'Nhuộm tóc', 1, 'NHAN_VIEN');

-- --------------------------------------------------------

--
-- Table structure for table `san_pham`
--

DROP TABLE IF EXISTS `san_pham`;
CREATE TABLE IF NOT EXISTS `san_pham` (
  `ma_san_pham` int NOT NULL AUTO_INCREMENT,
  `ten_san_pham` varchar(100) NOT NULL,
  `mo_ta` text,
  `gia` decimal(12,2) NOT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL,
  `trang_thai` int DEFAULT '1',
  `so_luong_ton` int DEFAULT '0',
  PRIMARY KEY (`ma_san_pham`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `san_pham`
--

INSERT INTO `san_pham` (`ma_san_pham`, `ten_san_pham`, `mo_ta`, `gia`, `hinh_anh`, `trang_thai`, `so_luong_ton`) VALUES
(1, 'ASáp Vuốt Tóc X-Men', 'Giữ nếp 12 giờ', 120000.00, 'sap.jpg', 1, 46),
(2, 'bbb', 'ccc', 210000.00, 'sap.jpg', 1, 48);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
