package com.salon.salon_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import com.salon.salon_management.entity.ChiTietNvdv;
import com.salon.salon_management.entity.ChiTietNvdvId;
import com.salon.salon_management.entity.NhanVien;
import org.springframework.data.jpa.repository.Query;

public interface ChiTietNvdvRepository
        extends JpaRepository<ChiTietNvdv, ChiTietNvdvId> {

    List<ChiTietNvdv> findByNhanVien_MaNhanVien(Integer maNhanVien);

    List<ChiTietNvdv> findByDichVu_MaDichVu(Integer maDichVu);

    void deleteByNhanVien_MaNhanVien(Integer maNhanVien);

    @Query("""
    SELECT n
    FROM NhanVien n
    WHERE n.maNhanVien IN (
        SELECT c.nhanVien.maNhanVien
        FROM ChiTietNvdv c
        WHERE c.dichVu.maDichVu IN :services
        GROUP BY c.nhanVien.maNhanVien
        HAVING COUNT(DISTINCT c.dichVu.maDichVu)=:total
    )
    """)
    List<NhanVien> findNhanVienByAllServices(
            @Param("services") List<Integer> services,
            @Param("total") Long total);
}