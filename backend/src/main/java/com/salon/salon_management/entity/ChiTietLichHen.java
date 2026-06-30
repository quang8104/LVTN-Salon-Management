package com.salon.salon_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "chi_tiet_lich_hen")
@IdClass(ChiTietLichHenId.class)
public class ChiTietLichHen {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_lich_hen")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Lich lich;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_dich_vu")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private DichVu dichVu;

    @Column(name = "don_gia")
    private Double donGia;

    @Column(name = "thoi_gian")
    private Integer thoiGian;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_nhan_vien")
    @JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
    private NhanVien nhanVien;

    public Lich getLich() {
        return lich;
    }

    public void setLich(Lich lich) {
        this.lich = lich;
    }

    public DichVu getDichVu() {
        return dichVu;
    }

    public void setDichVu(DichVu dichVu) {
        this.dichVu = dichVu;
    }

    public Double getDonGia() {
        return donGia;
    }

    public void setDonGia(Double donGia) {
        this.donGia = donGia;
    }

    public Integer getThoiGian() {
        return thoiGian;
    }

    public void setThoiGian(Integer thoiGian) {
        this.thoiGian = thoiGian;
    }

    public NhanVien getNhanVien() {
        return nhanVien;
    }

    public void setNhanVien(NhanVien nhanVien) {
        this.nhanVien = nhanVien;
    }

    
}