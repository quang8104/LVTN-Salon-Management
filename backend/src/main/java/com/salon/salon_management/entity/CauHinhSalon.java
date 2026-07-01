package com.salon.salon_management.entity;

import java.time.LocalTime;

import jakarta.persistence.*;

@Entity
@Table(name = "cau_hinh_salon")
public class CauHinhSalon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_cau_hinh")
    private Integer maCauHinh;

    @Column(name = "gio_mo_cua")
    private LocalTime gioMoCua;

    @Column(name = "gio_dong_cua")
    private LocalTime gioDongCua;

    @Column(name = "buoc_slot")
    private Integer buocSlot;

    @Column(name = "buffer_phut")
    private Integer bufferPhut;

    @Column(name = "trang_thai")
    private Integer trangThai;

    public Integer getMaCauHinh() {
        return maCauHinh;
    }

    public void setMaCauHinh(Integer maCauHinh) {
        this.maCauHinh = maCauHinh;
    }

    public LocalTime getGioMoCua() {
        return gioMoCua;
    }

    public void setGioMoCua(LocalTime gioMoCua) {
        this.gioMoCua = gioMoCua;
    }

    public LocalTime getGioDongCua() {
        return gioDongCua;
    }

    public void setGioDongCua(LocalTime gioDongCua) {
        this.gioDongCua = gioDongCua;
    }

    public Integer getBuocSlot() {
        return buocSlot;
    }

    public void setBuocSlot(Integer buocSlot) {
        this.buocSlot = buocSlot;
    }

    public Integer getBufferPhut() {
        return bufferPhut;
    }

    public void setBufferPhut(Integer bufferPhut) {
        this.bufferPhut = bufferPhut;
    }

    public Integer getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(Integer trangThai) {
        this.trangThai = trangThai;
    }
}