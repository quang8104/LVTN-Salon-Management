package com.salon.salon_management.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "lich_hen_log")
public class LichHenLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maLog;

    private Integer maLichHen;

    private String hanhDong;

    @Column(columnDefinition = "TEXT")
    private String noiDungCu;

    @Column(columnDefinition = "TEXT")
    private String noiDungMoi;

    private String lyDo;

    private LocalDateTime thoiGian;

    public Integer getMaLog() {
        return maLog;
    }

    public void setMaLog(Integer maLog) {
        this.maLog = maLog;
    }

    public Integer getMaLichHen() {
        return maLichHen;
    }

    public void setMaLichHen(Integer maLichHen) {
        this.maLichHen = maLichHen;
    }

    public String getHanhDong() {
        return hanhDong;
    }

    public void setHanhDong(String hanhDong) {
        this.hanhDong = hanhDong;
    }

    public String getNoiDungCu() {
        return noiDungCu;
    }

    public void setNoiDungCu(String noiDungCu) {
        this.noiDungCu = noiDungCu;
    }

    public String getNoiDungMoi() {
        return noiDungMoi;
    }

    public void setNoiDungMoi(String noiDungMoi) {
        this.noiDungMoi = noiDungMoi;
    }

    public String getLyDo() {
        return lyDo;
    }

    public void setLyDo(String lyDo) {
        this.lyDo = lyDo;
    }

    public LocalDateTime getThoiGian() {
        return thoiGian;
    }

    public void setThoiGian(LocalDateTime thoiGian) {
        this.thoiGian = thoiGian;
    }

    
}
