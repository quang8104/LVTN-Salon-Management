package com.salon.salon_management.dto;

import java.util.List;

public class GanDichVuNhanVienRequest {

    private Integer maNhanVien;
    private List<Integer> danhSachMaDichVu;

    public Integer getMaNhanVien() {
        return maNhanVien;
    }

    public void setMaNhanVien(Integer maNhanVien) {
        this.maNhanVien = maNhanVien;
    }

    public List<Integer> getDanhSachMaDichVu() {
        return danhSachMaDichVu;
    }

    public void setDanhSachMaDichVu(List<Integer> danhSachMaDichVu) {
        this.danhSachMaDichVu = danhSachMaDichVu;
    }
}