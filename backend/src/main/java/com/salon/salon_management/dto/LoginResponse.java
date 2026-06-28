package com.salon.salon_management.dto;

public class LoginResponse {
    private String token;
    private String vaiTro;
    private Integer id;
    private String hoTen;

    public LoginResponse(String token, String vaiTro, Integer id, String hoTen) {
        this.token = token;
        this.vaiTro = vaiTro;
        this.id = id;
        this.hoTen = hoTen;
    }

    public String getToken() {
        return token;
    }

    public String getVaiTro() {
        return vaiTro;
    }

    public Integer getId() {
        return id;
    }

    public String getHoTen() {
        return hoTen;
    }
}