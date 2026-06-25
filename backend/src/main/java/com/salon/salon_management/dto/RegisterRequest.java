package com.salon.salon_management.dto;

public class RegisterRequest {

    private String hoTen;
    private String email;
    private String sdt;
    private String matKhau;
    private String diaChi;
    
    

    public RegisterRequest(String hoTen, String email, String sdt, String matKhau, String diaChi) {
        this.hoTen = hoTen;
        this.email = email;
        this.sdt = sdt;
        this.matKhau = matKhau;
        this.diaChi = diaChi;
    }
    
    public String getHoTen() {
        return hoTen;
    }
    public void setHoTen(String hoTen) {
        this.hoTen = hoTen;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getSdt() {
        return sdt;
    }
    public void setSdt(String sdt) {
        this.sdt = sdt;
    }
    public String getMatKhau() {
        return matKhau;
    }
    public void setMatKhau(String matKhau) {
        this.matKhau = matKhau;
    }
    public String getDiaChi() {
        return diaChi;
    }
    public void setDiaChi(String diaChi) {
        this.diaChi = diaChi;
    }

}