package com.salon.salon_management.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class TaoLichRequest {

    private Integer maKhachHang;

    private Integer maNhanVien;

    private LocalDate ngayHen;

    private LocalTime gioHen;

    private List<Integer> danhSachDichVu;

    public Integer getMaKhachHang() {
        return maKhachHang;
    }

    public void setMaKhachHang(Integer maKhachHang) {
        this.maKhachHang = maKhachHang;
    }

    public Integer getMaNhanVien() {
        return maNhanVien;
    }

    public void setMaNhanVien(Integer maNhanVien) {
        this.maNhanVien = maNhanVien;
    }

    public LocalDate getNgayHen() {
        return ngayHen;
    }

    public void setNgayHen(LocalDate ngayHen) {
        this.ngayHen = ngayHen;
    }

    public LocalTime getGioHen() {
        return gioHen;
    }

    public void setGioHen(LocalTime gioHen) {
        this.gioHen = gioHen;
    }

    public List<Integer> getDanhSachDichVu() {
        return danhSachDichVu;
    }

    public void setDanhSachDichVu(List<Integer> danhSachDichVu) {
        this.danhSachDichVu = danhSachDichVu;
    }

    
}