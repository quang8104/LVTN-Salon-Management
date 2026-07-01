package com.salon.salon_management.repository;

import com.salon.salon_management.entity.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface KhachHangRepository
        extends JpaRepository<KhachHang,Integer> {

    Optional<KhachHang> findByEmail(String email);

    Optional<KhachHang> findBySdt(String sdt);

}