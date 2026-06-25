package com.salon.salon_management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.salon.salon_management.dto.TaoHoaDonRequest;
import com.salon.salon_management.entity.ChiTietHoaDonBH;
import com.salon.salon_management.entity.HoaDonBanHang;
import com.salon.salon_management.service.HoaDonBanHangService;

@RestController
@RequestMapping("/api/hoa-don-ban-hang")
public class HoaDonBanHangController {

    private final HoaDonBanHangService service;

    public HoaDonBanHangController(
            HoaDonBanHangService service) {
        this.service = service;
    }

    @PostMapping
    public HoaDonBanHang taoHoaDon(
            @RequestBody TaoHoaDonRequest request) {

        return service.taoHoaDon(request);
    }

    @GetMapping
    public List<HoaDonBanHang> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public HoaDonBanHang getById(@PathVariable Integer id) {

        return service.getById(id);
    }

    @GetMapping("/{id}/chi-tiet")
    public List<ChiTietHoaDonBH> getChiTiet(@PathVariable Integer id) {

        return service.getChiTiet(id);
    }

    @PutMapping("/{id}/thanh-toan")
    public HoaDonBanHang thanhToan(@PathVariable Integer id) {

        return service.thanhToan(id);
    }

    @GetMapping("/chua-thanh-toan")
    public List<HoaDonBanHang> chuaThanhToan() {

        return service.chuaThanhToan();
    }

    @GetMapping("/doanh-thu")
    public Double doanhThu() {

        return service.doanhThu();
    }
}
