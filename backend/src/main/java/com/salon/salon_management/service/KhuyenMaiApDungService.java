package com.salon.salon_management.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.salon.salon_management.entity.KhuyenMaiChiTiet;
import com.salon.salon_management.repository.KhuyenMaiChiTietRepository;

@Service
public class KhuyenMaiApDungService {

    private final KhuyenMaiChiTietRepository chiTietRepository;

    public KhuyenMaiApDungService(KhuyenMaiChiTietRepository chiTietRepository) {
        this.chiTietRepository = chiTietRepository;
    }

    public Integer layPhanTramGiamSanPham(Integer maSanPham) {
        List<KhuyenMaiChiTiet> list =
                chiTietRepository.findKhuyenMaiSanPhamDangHieuLuc(
                        maSanPham,
                        LocalDate.now()
                );

        if (list.isEmpty()) {
            return 0;
        }

        return list.get(0).getKhuyenMai().getPhanTramGiam();
    }

    public Integer layPhanTramGiamDichVu(Integer maDichVu) {
        List<KhuyenMaiChiTiet> list =
                chiTietRepository.findKhuyenMaiDichVuDangHieuLuc(
                        maDichVu,
                        LocalDate.now()
                );

        if (list.isEmpty()) {
            return 0;
        }

        return list.get(0).getKhuyenMai().getPhanTramGiam();
    }

    public Double tinhGiaSauGiam(Double giaGoc, Integer phanTramGiam) {
        if (giaGoc == null) {
            return 0.0;
        }

        if (phanTramGiam == null || phanTramGiam <= 0) {
            return giaGoc;
        }

        return giaGoc * (100 - phanTramGiam) / 100;
    }
}