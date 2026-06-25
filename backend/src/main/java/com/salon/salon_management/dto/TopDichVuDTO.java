package com.salon.salon_management.dto;

public class TopDichVuDTO {

    private String tenDichVu;
    private Long soLanDat;
    
    public TopDichVuDTO(String tenDichVu, Long soLanDat) {
        this.tenDichVu = tenDichVu;
        this.soLanDat = soLanDat;
    }

    public String getTenDichVu() {
        return tenDichVu;
    }

    public void setTenDichVu(String tenDichVu) {
        this.tenDichVu = tenDichVu;
    }

    public Long getSoLanDat() {
        return soLanDat;
    }

    public void setSoLanDat(Long soLanDat) {
        this.soLanDat = soLanDat;
    }

}
