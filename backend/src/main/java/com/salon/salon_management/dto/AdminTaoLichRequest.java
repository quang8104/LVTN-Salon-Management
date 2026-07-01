package com.salon.salon_management.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class AdminTaoLichRequest {
    private String tenKhach;
    private String sdtKhach;
    private Integer maNhanVien;
    private LocalDate ngayHen;
    private LocalTime gioHen;
    private List<Integer> danhSachDichVu;
    private String nguoiTao;
    private String ghiChu;

    public String getTenKhach() {
        return tenKhach;
    }

    public void setTenKhach(String tenKhach) {
        this.tenKhach = tenKhach;
    }

    public String getSdtKhach() {
        return sdtKhach;
    }

    public void setSdtKhach(String sdtKhach) {
        this.sdtKhach = sdtKhach;
    }

    public Integer getMaNhanVien() {
        return maNhanVien;
    }

    public void setMaNhanVien(Integer maNhanVien) {
        this.maNhanVien = maNhanVien;
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

    public List<Integer> getDanhSachDichVu() {
        return danhSachDichVu;
    }

    public void setDanhSachDichVu(List<Integer> danhSachDichVu) {
        this.danhSachDichVu = danhSachDichVu;
    }

    public String getNguoiTao() {
        return nguoiTao;
    }

    public void setNguoiTao(String nguoiTao) {
        this.nguoiTao = nguoiTao;
    }

    public String getGhiChu() {
        return ghiChu;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }
}