package com.salon.salon_management.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.salon.salon_management.entity.DonHang;

public interface DonHangRepository extends JpaRepository<DonHang, Integer> {
    List<DonHang> findByKhachHang_MaKhachHang(Integer maKhachHang);
    List<DonHang> findByTrangThai(Integer trangThai);
    List<DonHang> findByPhuongThucThanhToanAndTrangThaiThanhToanAndTrangThaiAndNgayTaoBefore(
        String phuongThucThanhToan,
        Integer trangThaiThanhToan,
        Integer trangThai,
        LocalDateTime time
    );
}