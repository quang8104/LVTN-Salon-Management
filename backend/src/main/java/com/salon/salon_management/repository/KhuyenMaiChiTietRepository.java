package com.salon.salon_management.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.salon.salon_management.entity.KhuyenMaiChiTiet;

@Repository
public interface KhuyenMaiChiTietRepository extends JpaRepository<KhuyenMaiChiTiet, Integer> {
    List<KhuyenMaiChiTiet> findByKhuyenMai_MaKhuyenMai(Integer maKhuyenMai);
    void deleteByKhuyenMai_MaKhuyenMai(Integer maKhuyenMai);


    @Query("""
        SELECT ct FROM KhuyenMaiChiTiet ct
        WHERE ct.loaiApDung = 1
        AND ct.sanPham.maSanPham = :maSanPham
        AND ct.khuyenMai.trangThai = 1
        AND :today BETWEEN ct.khuyenMai.ngayBatDau AND ct.khuyenMai.ngayKetThuc
        ORDER BY ct.khuyenMai.phanTramGiam DESC
    """)
    List<KhuyenMaiChiTiet> findKhuyenMaiSanPhamDangHieuLuc(
            @Param("maSanPham") Integer maSanPham,
            @Param("today") LocalDate today
    );

    @Query("""
        SELECT ct FROM KhuyenMaiChiTiet ct
        WHERE ct.loaiApDung = 2
        AND ct.dichVu.maDichVu = :maDichVu
        AND ct.khuyenMai.trangThai = 1
        AND :today BETWEEN ct.khuyenMai.ngayBatDau AND ct.khuyenMai.ngayKetThuc
        ORDER BY ct.khuyenMai.phanTramGiam DESC
    """)
    List<KhuyenMaiChiTiet> findKhuyenMaiDichVuDangHieuLuc(
            @Param("maDichVu") Integer maDichVu,
            @Param("today") LocalDate today
    );
}