package com.salon.salon_management.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.salon.salon_management.entity.HoaDonBanHang;

public interface HoaDonBanHangRepository
        extends JpaRepository<HoaDonBanHang, Integer> {
        List<HoaDonBanHang>findByTrangThai(Integer trangThai);

        @Query("""
    SELECT COALESCE(SUM(h.tongTien),0)
    FROM HoaDonBanHang h
    WHERE h.trangThai = 1
        """)
         Double tinhDoanhThu();

         @Query(value = """
    SELECT COALESCE(SUM(tong_tien),0)
    FROM hoa_don_ban_hang
    WHERE trang_thai = 1
    AND DATE(ngay_tao) = :ngay
    """, nativeQuery = true)
    Double doanhThuNgay(
            @Param("ngay") LocalDate ngay);

            @Query(value = """
    SELECT COALESCE(SUM(tong_tien),0)
    FROM hoa_don_ban_hang
    WHERE trang_thai = 1
    AND MONTH(ngay_tao) = :thang
    AND YEAR(ngay_tao) = :nam
    """, nativeQuery = true)
    Double doanhThuThang(
            @Param("thang") Integer thang,
            @Param("nam") Integer nam);
}
