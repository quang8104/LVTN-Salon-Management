package com.salon.salon_management.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lich_su_lich_hen")
@NoArgsConstructor
@AllArgsConstructor
public class LichSuLichHen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_lich_su")
    private Long maLichSu;

    @ManyToOne
    @JoinColumn(name = "ma_lich_hen")
    private Lich lichHen;

    @Column(name = "nguoi_thuc_hien")
    private String nguoiThucHien;

    @Column(name = "vai_tro")
    private String vaiTro;

    @Column(name = "hanh_dong")
    private String hanhDong;

    @Column(name = "ly_do", columnDefinition = "TEXT")
    private String lyDo;

    @Column(name = "thoi_gian")
    private LocalDateTime thoiGian = LocalDateTime.now();

    public Long getMaLichSu() {
        return maLichSu;
    }

    public void setMaLichSu(Long maLichSu) {
        this.maLichSu = maLichSu;
    }

    public Lich getLichHen() {
        return lichHen;
    }

    public void setLichHen(Lich lichHen) {
        this.lichHen = lichHen;
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

    public String getHanhDong() {
        return hanhDong;
    }

    public void setHanhDong(String hanhDong) {
        this.hanhDong = hanhDong;
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
