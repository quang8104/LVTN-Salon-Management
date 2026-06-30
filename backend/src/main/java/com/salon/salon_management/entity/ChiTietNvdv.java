package com.salon.salon_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "chi_tiet_nvdv")
@IdClass(ChiTietNvdvId.class)
public class ChiTietNvdv {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_nhan_vien")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private NhanVien nhanVien;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_dich_vu")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private DichVu dichVu;

    public NhanVien getNhanVien() {
        return nhanVien;
    }

    public void setNhanVien(NhanVien nhanVien) {
        this.nhanVien = nhanVien;
    }

    public DichVu getDichVu() {
        return dichVu;
    }

    public void setDichVu(DichVu dichVu) {
        this.dichVu = dichVu;
    }
}