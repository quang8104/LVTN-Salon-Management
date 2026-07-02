package com.salon.salon_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@Entity
@Table(name = "khuyen_mai_chi_tiet")
public class KhuyenMaiChiTiet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_chi_tiet")
    private Integer maChiTiet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_khuyen_mai")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private KhuyenMai khuyenMai;

    @Column(name = "loai_ap_dung")
    private Integer loaiApDung; // 1: sản phẩm, 2: dịch vụ

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_san_pham")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private SanPham sanPham;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_dich_vu")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private DichVu dichVu;

    public Integer getMaChiTiet() {
        return maChiTiet;
    }

    public void setMaChiTiet(Integer maChiTiet) {
        this.maChiTiet = maChiTiet;
    }

    public KhuyenMai getKhuyenMai() {
        return khuyenMai;
    }

    public void setKhuyenMai(KhuyenMai khuyenMai) {
        this.khuyenMai = khuyenMai;
    }

    public Integer getLoaiApDung() {
        return loaiApDung;
    }

    public void setLoaiApDung(Integer loaiApDung) {
        this.loaiApDung = loaiApDung;
    }

    public SanPham getSanPham() {
        return sanPham;
    }

    public void setSanPham(SanPham sanPham) {
        this.sanPham = sanPham;
    }

    public DichVu getDichVu() {
        return dichVu;
    }

    public void setDichVu(DichVu dichVu) {
        this.dichVu = dichVu;
    }
}