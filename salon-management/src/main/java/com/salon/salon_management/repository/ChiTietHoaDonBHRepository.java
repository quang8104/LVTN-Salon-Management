package com.salon.salon_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.salon.salon_management.entity.ChiTietHoaDonBH;
import com.salon.salon_management.entity.HoaDonBanHang;

public interface ChiTietHoaDonBHRepository
        extends JpaRepository<ChiTietHoaDonBH, Integer> {
        
        List<ChiTietHoaDonBH>findByHoaDon_MaHoaDonBh(Integer maHoaDonBh);

        
}
