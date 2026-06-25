package com.salon.salon_management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "dich_vu")
public class DichVu {

     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_dich_vu")
    private Integer maDichVu;

    @Column(name = "ten_dich_vu")
    private String tenDichVu;

    @Column(name = "mo_ta")
    private String moTa;

    private Double gia;

    @Column(name = "thoi_gian_thuc_hien")
    private Integer thoiGianThucHien;

    @Column(name = "anh_gioi_thieu")
    private String anhGioiThieu;

    @Column(name = "trang_thai")
    private Integer trangThai;

    public Integer getMaDichVu() {
        return maDichVu;
    }

    public void setMaDichVu(Integer maDichVu) {
        this.maDichVu = maDichVu;
    }

    public String getTenDichVu() {
        return tenDichVu;
    }

    public void setTenDichVu(String tenDichVu) {
        this.tenDichVu = tenDichVu;
    }

    public String getMoTa() {
        return moTa;
    }

    public void setMoTa(String moTa) {
        this.moTa = moTa;
    }

    public Double getGia() {
        return gia;
    }

    public void setGia(Double gia) {
        this.gia = gia;
    }

    public Integer getThoiGianThucHien() {
        return thoiGianThucHien;
    }

    public void setThoiGianThucHien(Integer thoiGianThucHien) {
        this.thoiGianThucHien = thoiGianThucHien;
    }

    public String getAnhGioiThieu() {
        return anhGioiThieu;
    }

    public void setAnhGioiThieu(String anhGioiThieu) {
        this.anhGioiThieu = anhGioiThieu;
    }

    public Integer getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(Integer trangThai) {
        this.trangThai = trangThai;
    }
}
