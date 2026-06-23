package com.salon.salon_management.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "lich_hen")
public class Lich {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="ma_lich_hen")
    private Integer id;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="ma_khach_hang",nullable=false)
    private KhachHang khachHang;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="ma_nhan_vien",nullable=false)
    private NhanVien nhanVien;

    @Column(name="ngay_hen",nullable=false)
    private LocalDate ngayHen;

    @Column(name="gio_hen",nullable=false)
    private LocalTime gioHen;

    @Column(name="gio_ket_thuc_du_kien")
    private LocalTime gioKetThucDuKien;
    
     @Column(name = "gio_ket_thuc_thuc_te")
    private LocalTime gioKetThucThucTe;
    
    @Column(name = "tong_thoi_gian")
    private Integer tongThoiGian;
    
    @Column(name = "trang_thai")
    private Integer trangThai; // 0: Chờ xác nhận, 1: Xác nhận, 2: Hoàn tất, 3: Hủy

     @Column(name = "thoi_gian_buffer")
    private Integer thoiGianBuffer;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public KhachHang getKhachHang() {
        return khachHang;
    }

    public void setKhachHang(KhachHang khachHang) {
        this.khachHang = khachHang;
    }

    public NhanVien getNhanVien() {
        return nhanVien;
    }

    public void setNhanVien(NhanVien nhanVien) {
        this.nhanVien = nhanVien;
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

    public LocalTime getGioKetThucDuKien() {
        return gioKetThucDuKien;
    }

    public void setGioKetThucDuKien(LocalTime gioKetThucDuKien) {
        this.gioKetThucDuKien = gioKetThucDuKien;
    }

    public LocalTime getGioKetThucThucTe() {
        return gioKetThucThucTe;
    }

    public void setGioKetThucThucTe(LocalTime gioKetThucThucTe) {
        this.gioKetThucThucTe = gioKetThucThucTe;
    }

    public Integer getTongThoiGian() {
        return tongThoiGian;
    }

    public void setTongThoiGian(Integer tongThoiGian) {
        this.tongThoiGian = tongThoiGian;
    }

    public Integer getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(Integer trangThai) {
        this.trangThai = trangThai;
    }

    public Integer getThoiGianBuffer() {
        return thoiGianBuffer;
    }

    public void setThoiGianBuffer(Integer thoiGianBuffer) {
        this.thoiGianBuffer = thoiGianBuffer;
    }

}
