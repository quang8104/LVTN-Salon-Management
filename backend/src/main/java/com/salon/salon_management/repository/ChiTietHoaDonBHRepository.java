package com.salon.salon_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.salon.salon_management.dto.TopSanPhamDTO;
import com.salon.salon_management.entity.ChiTietHoaDonBH;
import com.salon.salon_management.entity.HoaDonBanHang;

public interface ChiTietHoaDonBHRepository
        extends JpaRepository<ChiTietHoaDonBH, Integer> {
        
        List<ChiTietHoaDonBH>findByHoaDon_MaHoaDonBh(Integer maHoaDonBh);

        @Query("""
        SELECT new com.salon.salon_management.dto.TopSanPhamDTO(
        c.sanPham.tenSanPham,
        SUM(c.soLuong)
        )
        FROM ChiTietHoaDonBH c
        GROUP BY c.sanPham.tenSanPham
        ORDER BY SUM(c.soLuong) DESC
        """)
        List<TopSanPhamDTO> topSanPham();
}
