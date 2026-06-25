package com.salon.salon_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.salon.salon_management.entity.HoaDonBanHang;

public interface HoaDonBanHangRepository
        extends JpaRepository<HoaDonBanHang, Integer> {
        List<HoaDonBanHang>findByTrangThai(Integer trangThai);

        @Query("""
    SELECT COALESCE(SUM(h.tongTien),0)
    FROM HoaDonBanHang h
    WHERE h.trangThai = 1
        """)
         Double tinhDoanhThu();
}
