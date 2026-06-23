package com.salon.salon_management.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class LichCreateRequest {
    private Integer maKhachHang;
    private Integer maNhanVien;
    private LocalDate ngayHen;
    private LocalTime gioHen;
    private String ghiChu;

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
    public String getGhiChu() {
        return ghiChu;
    }
    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }

    
}
