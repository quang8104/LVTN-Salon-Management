package com.salon.salon_management.entity;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "chi_tiet_lich_hen")
public class ChiTietLichHen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_chi_tiet_lich_hen")
    private Integer maChiTietLichHen;

    @ManyToOne
    @JoinColumn(name = "ma_lich_hen")
    @JsonIgnore
    private Lich lichHen;

    @ManyToOne
    @JoinColumn(name = "ma_dich_vu")
    private DichVu dichVu;

    private Double donGia;

    private Integer thoiGian;

    public Integer getMaChiTietLichHen() {
        return maChiTietLichHen;
    }

    public void setMaChiTietLichHen(Integer maChiTietLichHen) {
        this.maChiTietLichHen = maChiTietLichHen;
    }

    public Lich getLichHen() {
        return lichHen;
    }

    public void setLichHen(Lich lichHen) {
        this.lichHen = lichHen;
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

    
}
