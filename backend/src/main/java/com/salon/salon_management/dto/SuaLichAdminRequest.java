package com.salon.salon_management.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class SuaLichAdminRequest {
    private LocalDate ngayHen;
    private LocalTime gioHen;
    private Integer maNhanVien;
    private List<Integer> danhSachDichVu;

    private String lyDo;
    private String nguoiThucHien;
    private String vaiTro;

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

    public Integer getMaNhanVien() {
        return maNhanVien;
    }

    public void setMaNhanVien(Integer maNhanVien) {
        this.maNhanVien = maNhanVien;
    }

    public List<Integer> getDanhSachDichVu() {
        return danhSachDichVu;
    }

    public void setDanhSachDichVu(List<Integer> danhSachDichVu) {
        this.danhSachDichVu = danhSachDichVu;
    }

    public String getLyDo() {
        return lyDo;
    }

    public void setLyDo(String lyDo) {
        this.lyDo = lyDo;
    }

    public String getNguoiThucHien() {
        return nguoiThucHien;
    }

    public void setNguoiThucHien(String nguoiThucHien) {
        this.nguoiThucHien = nguoiThucHien;
    }

    public String getVaiTro() {
        return vaiTro;
    }

    public void setVaiTro(String vaiTro) {
        this.vaiTro = vaiTro;
    }
}