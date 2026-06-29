package com.salon.salon_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.salon.salon_management.entity.DanhMuc;

public interface DanhMucRepository extends JpaRepository<DanhMuc, Integer> {

    List<DanhMuc> findByTrangThai(Integer trangThai);
}