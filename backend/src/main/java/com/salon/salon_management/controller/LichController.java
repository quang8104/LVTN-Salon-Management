package com.salon.salon_management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.salon.salon_management.dto.TaoLichRequest;
import com.salon.salon_management.entity.ChiTietLichHen;
import com.salon.salon_management.entity.Lich;
import com.salon.salon_management.service.LichService;

@RestController
@RequestMapping("/api/lich-hen")
public class LichController {

    private final LichService service;

    public LichController(LichService service) {
        this.service = service;
    }

    @PostMapping
    public Lich taoLich(@RequestBody TaoLichRequest request) {
        return service.taoLich(request);
    }

    @GetMapping
    public List<Lich> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}/chi-tiet")
    public List<ChiTietLichHen> getChiTiet(@PathVariable Integer id) {
        return service.getChiTiet(id);
    }

    @GetMapping("/khach-hang/{id}")
    public List<Lich> getByKhachHang(@PathVariable Integer id) {
        return service.getByKhachHang(id);
    }

    @GetMapping("/nhan-vien/{id}")
    public List<Lich> getByNhanVien(@PathVariable Integer id) {
        return service.getByNhanVien(id);
    }

    @GetMapping("/{id}")
    public Lich getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PutMapping("/{id}/xac-nhan")
    public Lich xacNhan(@PathVariable Integer id) {
        return service.xacNhan(id);
    }

    @PutMapping("/{id}/bat-dau")
    public Lich batDauPhucVu(@PathVariable Integer id) {
        return service.batDauPhucVu(id);
    }

    @PutMapping("/{id}/hoan-thanh")
    public Lich hoanThanh(@PathVariable Integer id) {
        return service.hoanThanh(id);
    }

    @PutMapping("/{id}/huy")
    public Lich huy(@PathVariable Integer id) {
        return service.huy(id);
    }
}