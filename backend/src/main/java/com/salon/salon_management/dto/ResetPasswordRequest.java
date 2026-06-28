package com.salon.salon_management.dto;

public class ResetPasswordRequest {
    private String email;
    private String otp;
    private String matKhauMoi;

    public String getEmail() {
        return email;
    }

    public String getOtp() {
        return otp;
    }

    public String getMatKhauMoi() {
        return matKhauMoi;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public void setMatKhauMoi(String matKhauMoi) {
        this.matKhauMoi = matKhauMoi;
    }
}