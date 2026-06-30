package com.salon.salon_management.entity;

import java.io.Serializable;
import java.util.Objects;

public class ChiTietLichHenId implements Serializable {

    private Integer lich;

    private Integer dichVu;

    public ChiTietLichHenId() {
    }

    public ChiTietLichHenId(Integer lich, Integer dichVu) {
        this.lich = lich;
        this.dichVu = dichVu;
    }

    public Integer getLich() {
        return lich;
    }

    public void setLich(Integer lich) {
        this.lich = lich;
    }

    public Integer getDichVu() {
        return dichVu;
    }

    public void setDichVu(Integer dichVu) {
        this.dichVu = dichVu;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ChiTietLichHenId)) return false;

        ChiTietLichHenId that = (ChiTietLichHenId) o;

        return Objects.equals(lich, that.lich)
                && Objects.equals(dichVu, that.dichVu);
    }

    @Override
    public int hashCode() {
        return Objects.hash(lich, dichVu);
    }
}