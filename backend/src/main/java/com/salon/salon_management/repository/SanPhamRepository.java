package com.salon.salon_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.salon.salon_management.dto.TopSanPhamDTO;
import com.salon.salon_management.entity.SanPham;

public interface SanPhamRepository 
        extends JpaRepository<SanPham, Integer> {
            List<SanPham> findByTenSanPhamContaining(String keyword);

}
