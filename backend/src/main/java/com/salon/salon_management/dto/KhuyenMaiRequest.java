package com.salon.salon_management.dto;

import java.time.LocalDate;
import java.util.List;

public class KhuyenMaiRequest {
    private String tenKhuyenMai;
    private String moTa;
    private Integer phanTramGiam;
    private LocalDate ngayBatDau;
    private LocalDate ngayKetThuc;
    private Integer trangThai;
    private List<Integer> sanPhamIds;
    private List<Integer> dichVuIds;

    public String getTenKhuyenMai() {
        return tenKhuyenMai;
    }

    public void setTenKhuyenMai(String tenKhuyenMai) {
        this.tenKhuyenMai = tenKhuyenMai;
    }

    public String getMoTa() {
        return moTa;
    }

    public void setMoTa(String moTa) {
        this.moTa = moTa;
    }

    public Integer getPhanTramGiam() {
        return phanTramGiam;
    }

    public void setPhanTramGiam(Integer phanTramGiam) {
        this.phanTramGiam = phanTramGiam;
    }

    public LocalDate getNgayBatDau() {
        return ngayBatDau;
    }

    public void setNgayBatDau(LocalDate ngayBatDau) {
        this.ngayBatDau = ngayBatDau;
    }

    public LocalDate getNgayKetThuc() {
        return ngayKetThuc;
    }

    public void setNgayKetThuc(LocalDate ngayKetThuc) {
        this.ngayKetThuc = ngayKetThuc;
    }

    public Integer getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(Integer trangThai) {
        this.trangThai = trangThai;
    }

    public List<Integer> getSanPhamIds() {
        return sanPhamIds;
    }

    public void setSanPhamIds(List<Integer> sanPhamIds) {
        this.sanPhamIds = sanPhamIds;
    }

    public List<Integer> getDichVuIds() {
        return dichVuIds;
    }

    public void setDichVuIds(List<Integer> dichVuIds) {
        this.dichVuIds = dichVuIds;
    }
}