package com.salon.salon_management.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.salon.salon_management.entity.NghiPhepNhanVien;

@Repository
public interface NghiPhepNhanVienRepository extends JpaRepository<NghiPhepNhanVien, Integer> {

    List<NghiPhepNhanVien> findByTrangThaiOrderByNgayBatDauDesc(Integer trangThai);

    boolean existsByNhanVien_MaNhanVienAndTrangThaiAndNgayBatDauLessThanEqualAndNgayKetThucGreaterThanEqual(
            Integer maNhanVien,
            Integer trangThai,
            LocalDate ngay,
            LocalDate ngay2
    );
}