package com.salon.salon_management.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.salon.salon_management.entity.Lich;

public interface LichRepository extends JpaRepository<Lich, Integer> {

    @Query("SELECT l FROM Lich l WHERE l.khachHang.maKhachHang = :maKhachHang")
    List<Lich> findByKhachHangId(@Param("maKhachHang") Integer maKhachHang);

    @Query("SELECT l FROM Lich l WHERE l.nhanVien.maNhanVien = :maNhanVien")
    List<Lich> findByNhanVienId(@Param("maNhanVien") Integer maNhanVien);

    List<Lich> findByNgayHen(LocalDate ngayHen);

    @Query("""
        SELECT l FROM Lich l
        WHERE l.nhanVien.maNhanVien = :maNhanVien
        AND l.ngayHen = :ngayHen
        AND l.trangThai <> 4
    """)
    List<Lich> findByNhanVienAndNgayHen(
            @Param("maNhanVien") Integer maNhanVien,
            @Param("ngayHen") LocalDate ngayHen
    );
}