-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 22, 2026 at 11:36 AM
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
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `khach_hang`
--

INSERT INTO `khach_hang` (`ma_khach_hang`, `email`, `mat_khau`, `ho_ten`, `sdt`, `dia_chi`, `ngay_tao`) VALUES
(1, 'qqqqqqqq@gmail.com', '123aada2@', 'qqqqqqqqqq', '0202022020', 'qdddddddd', '2026-06-22 15:24:38'),
(2, 'a@gmail.com', '123456', 'Nguyen Van A', '0909123456', 'Can Tho', '2026-06-22 15:28:45');

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
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  KEY `ma_nhan_vien` (`ma_nhan_vien`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  PRIMARY KEY (`ma_nhan_vien`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `sdt` (`sdt`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
