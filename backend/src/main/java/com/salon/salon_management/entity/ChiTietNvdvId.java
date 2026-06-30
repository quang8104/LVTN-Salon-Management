package com.salon.salon_management.entity;

import java.io.Serializable;
import java.util.Objects;

public class ChiTietNvdvId implements Serializable {

    private Integer nhanVien;
    private Integer dichVu;

    public ChiTietNvdvId() {
    }

    public ChiTietNvdvId(Integer nhanVien, Integer dichVu) {
        this.nhanVien = nhanVien;
        this.dichVu = dichVu;
    }

    public Integer getNhanVien() {
        return nhanVien;
    }

    public void setNhanVien(Integer nhanVien) {
        this.nhanVien = nhanVien;
    }

    public Integer getDichVu() {
        return dichVu;
    }

    public void setDichVu(Integer dichVu) {
        this.dichVu = dichVu;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ChiTietNvdvId)) return false;
        ChiTietNvdvId that = (ChiTietNvdvId) o;
        return Objects.equals(nhanVien, that.nhanVien)
                && Objects.equals(dichVu, that.dichVu);
    }

    @Override
    public int hashCode() {
        return Objects.hash(nhanVien, dichVu);
    }
}