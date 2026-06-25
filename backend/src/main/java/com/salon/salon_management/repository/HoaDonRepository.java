package com.salon.salon_management.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.salon.salon_management.entity.HoaDon;

public interface HoaDonRepository
        extends JpaRepository<HoaDon, Integer> {
    
    List<HoaDon> findByTrangThai(Integer trangThai);

            @Query("""
    SELECT COALESCE(SUM(h.tongTien),0)
    FROM HoaDon h
    WHERE h.trangThai = 1
    """)
    Double tongDoanhThu();
}
