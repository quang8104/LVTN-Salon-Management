package com.salon.salon_management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.salon.salon_management.dto.TaoDonHangRequest;
import com.salon.salon_management.entity.ChiTietDonHang;
import com.salon.salon_management.entity.DonHang;
import com.salon.salon_management.service.DonHangService;

@RestController
@RequestMapping("/api/don-hang")
public class DonHangController {

    private final DonHangService service;

    public DonHangController(DonHangService service) {
        this.service = service;
    }

    @PostMapping
    public DonHang taoDonHang(@RequestBody TaoDonHangRequest request) {
        return service.taoDonHang(request);
    }

    @GetMapping
    public List<DonHang> getAll() {
        return service.getAll();
    }

    @GetMapping("/cho-xac-nhan")
    public List<DonHang> getChoXacNhan() {
        return service.getChoXacNhan();
    }

    @GetMapping("/khach-hang/{id}")
    public List<DonHang> getByKhachHang(@PathVariable Integer id) {
        return service.getByKhachHang(id);
    }

    @GetMapping("/{id}")
    public DonHang getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @GetMapping("/{id}/chi-tiet")
    public List<ChiTietDonHang> getChiTiet(@PathVariable Integer id) {
        return service.getChiTiet(id);
    }

    @PutMapping("/{id}/xac-nhan")
    public DonHang xacNhan(@PathVariable Integer id) {
        return service.xacNhan(id);
    }

    @PutMapping("/{id}/dang-giao")
    public DonHang dangGiao(@PathVariable Integer id) {
        return service.dangGiao(id);
    }

    @PutMapping("/{id}/hoan-thanh")
    public DonHang hoanThanh(@PathVariable Integer id) {
        return service.hoanThanh(id);
    }

    @PutMapping("/{id}/huy")
    public DonHang huy(@PathVariable Integer id) {
        return service.huy(id);
    }
}