package com.salon.salon_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.salon.salon_management.entity.ChiTietDonHang;

public interface ChiTietDonHangRepository extends JpaRepository<ChiTietDonHang, Integer> {
    List<ChiTietDonHang> findByDonHang_MaDonHang(Integer maDonHang);
}