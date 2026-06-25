package com.salon.salon_management.dto;

public class TopSanPhamDTO {

    private String tenSanPham;
    private Long tongSoLuong;
    
    public TopSanPhamDTO(String tenSanPham, Long tongSoLuong) {
        this.tenSanPham = tenSanPham;
        this.tongSoLuong = tongSoLuong;
    }

    public String getTenSanPham() {
        return tenSanPham;
    }

    public void setTenSanPham(String tenSanPham) {
        this.tenSanPham = tenSanPham;
    }

    public Long getTongSoLuong() {
        return tongSoLuong;
    }

    public void setTongSoLuong(Long tongSoLuong) {
        this.tongSoLuong = tongSoLuong;
    }

    
}
