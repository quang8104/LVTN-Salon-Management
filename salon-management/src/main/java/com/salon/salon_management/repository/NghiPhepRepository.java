package com.salon.salon_management.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.salon.salon_management.entity.NghiPhep;

public interface NghiPhepRepository 
        extends JpaRepository<NghiPhep, Integer> {
    
    @Query("""
    SELECT n
    FROM NghiPhep n
    WHERE n.nhanVien.maNhanVien = :maNhanVien
    AND n.tuNgay <= :denNgay
    AND n.denNgay >= :tuNgay
    """)
    List<NghiPhep> findOverlap(
            @Param("maNhanVien") Integer maNhanVien,
            @Param("tuNgay") LocalDate tuNgay,
            @Param("denNgay") LocalDate denNgay);


        @Query("SELECT n FROM NghiPhep n WHERE n.nhanVien.maNhanVien = :maNhanVien AND :ngayHen BETWEEN n.tuNgay AND n.denNgay")
        NghiPhep findByNhanVienIdAndDate(@Param("maNhanVien") Integer maNhanVien, @Param("ngayHen") LocalDate ngayHen);
} 
    

