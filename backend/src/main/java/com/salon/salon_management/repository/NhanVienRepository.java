package com.salon.salon_management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.salon.salon_management.entity.NhanVien;

public interface NhanVienRepository
        extends JpaRepository<NhanVien, Integer> {

    boolean existsByEmail(String email);

    boolean existsBySdt(String sdt);

    Optional<NhanVien> findByEmail(String email);

    List<NhanVien> findByTrangThai(Integer trangThai);
    List<NhanVien> findByTrangThaiAndVaiTro(Integer trangThai, String vaiTro);

    @Query("""
            SELECT n FROM NhanVien n
            WHERE n.hoTen LIKE %:keyword%
            OR n.sdt LIKE %:keyword%
            """)
    List<NhanVien> search(String keyword);
}