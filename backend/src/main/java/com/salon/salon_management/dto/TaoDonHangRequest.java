package com.salon.salon_management.dto;

import java.util.List;

public class TaoDonHangRequest {
    private Integer maKhachHang;
    private String hoTenNguoiNhan;
    private String soDienThoai;
    private String diaChi;
    private String ghiChu;
    private String phuongThucThanhToan;
    private List<DonHangItemRequest> items;

    public Integer getMaKhachHang() {
        return maKhachHang;
    }

    public void setMaKhachHang(Integer maKhachHang) {
        this.maKhachHang = maKhachHang;
    }

    public String getHoTenNguoiNhan() {
        return hoTenNguoiNhan;
    }

    public void setHoTenNguoiNhan(String hoTenNguoiNhan) {
        this.hoTenNguoiNhan = hoTenNguoiNhan;
    }

    public String getSoDienThoai() {
        return soDienThoai;
    }

    public void setSoDienThoai(String soDienThoai) {
        this.soDienThoai = soDienThoai;
    }

    public String getDiaChi() {
        return diaChi;
    }

    public void setDiaChi(String diaChi) {
        this.diaChi = diaChi;
    }

    public String getGhiChu() {
        return ghiChu;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }

    public String getPhuongThucThanhToan() {
        return phuongThucThanhToan;
    }

    public void setPhuongThucThanhToan(String phuongThucThanhToan) {
        this.phuongThucThanhToan = phuongThucThanhToan;
    }

    public List<DonHangItemRequest> getItems() {
        return items;
    }

    public void setItems(List<DonHangItemRequest> items) {
        this.items = items;
    }
}