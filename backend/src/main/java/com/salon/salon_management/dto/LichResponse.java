package com.salon.salon_management.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class LichResponse {
    private Integer id;
    private Integer maKhachHang;
    private String tenKhachHang;
    private String sdt;
    private Integer maNhanVien;
    private String tenNhanVien;
    private LocalDate ngayHen;
    private LocalTime gioHen;
    private LocalTime gioKetThucDuKien;
    private Integer tongThoiGian;
    private Integer trangThai;
    private String trangThaiText;
    private String ghiChu;

    public LichResponse() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getMaKhachHang() {
        return maKhachHang;
    }

    public void setMaKhachHang(Integer maKhachHang) {
        this.maKhachHang = maKhachHang;
    }

    public String getTenKhachHang() {
        return tenKhachHang;
    }

    public void setTenKhachHang(String tenKhachHang) {
        this.tenKhachHang = tenKhachHang;
    }

    public String getSdt() {
        return sdt;
    }

    public void setSdt(String sdt) {
        this.sdt = sdt;
    }

    public Integer getMaNhanVien() {
        return maNhanVien;
    }

    public void setMaNhanVien(Integer maNhanVien) {
        this.maNhanVien = maNhanVien;
    }

    public String getTenNhanVien() {
        return tenNhanVien;
    }

    public void setTenNhanVien(String tenNhanVien) {
        this.tenNhanVien = tenNhanVien;
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

    public LocalTime getGioKetThucDuKien() {
        return gioKetThucDuKien;
    }

    public void setGioKetThucDuKien(LocalTime gioKetThucDuKien) {
        this.gioKetThucDuKien = gioKetThucDuKien;
    }

    public Integer getTongThoiGian() {
        return tongThoiGian;
    }

    public void setTongThoiGian(Integer tongThoiGian) {
        this.tongThoiGian = tongThoiGian;
    }

    public Integer getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(Integer trangThai) {
        this.trangThai = trangThai;
    }

    public String getTrangThaiText() {
        return trangThaiText;
    }

    public void setTrangThaiText(String trangThaiText) {
        this.trangThaiText = trangThaiText;
    }

    public String getGhiChu() {
        return ghiChu;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }

}
