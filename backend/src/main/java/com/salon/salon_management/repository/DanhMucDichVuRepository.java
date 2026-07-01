package com.salon.salon_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.salon.salon_management.entity.DanhMucDichVu;

public interface DanhMucDichVuRepository 
        extends JpaRepository<DanhMucDichVu, Integer> {

    List<DanhMucDichVu> findByTrangThai(Integer trangThai);
}