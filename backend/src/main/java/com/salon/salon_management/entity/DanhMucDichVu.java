package com.salon.salon_management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "danh_muc_dich_vu")
public class DanhMucDichVu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_danh_muc_dich_vu")
    private Integer maDanhMucDichVu;

    @Column(name = "ten_danh_muc")
    private String tenDanhMuc;

    @Column(name = "mo_ta")
    private String moTa;

    @Column(name = "trang_thai")
    private Integer trangThai;

    public Integer getMaDanhMucDichVu() {
        return maDanhMucDichVu;
    }

    public void setMaDanhMucDichVu(Integer maDanhMucDichVu) {
        this.maDanhMucDichVu = maDanhMucDichVu;
    }

    public String getTenDanhMuc() {
        return tenDanhMuc;
    }

    public void setTenDanhMuc(String tenDanhMuc) {
        this.tenDanhMuc = tenDanhMuc;
    }

    public String getMoTa() {
        return moTa;
    }

    public void setMoTa(String moTa) {
        this.moTa = moTa;
    }

    public Integer getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(Integer trangThai) {
        this.trangThai = trangThai;
    }
}