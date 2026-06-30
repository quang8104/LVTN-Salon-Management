package com.salon.salon_management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.salon.salon_management.dto.GanDichVuNhanVienRequest;
import com.salon.salon_management.entity.ChiTietNvdv;
import com.salon.salon_management.service.ChiTietNvdvService;

@RestController
@RequestMapping("/api/chi-tiet-nvdv")
public class ChiTietNvdvController {

    private final ChiTietNvdvService service;

    public ChiTietNvdvController(ChiTietNvdvService service) {
        this.service = service;
    }

    @GetMapping("/nhan-vien/{id}")
    public List<ChiTietNvdv> getByNhanVien(@PathVariable Integer id) {
        return service.getByNhanVien(id);
    }

    @GetMapping("/dich-vu/{id}")
    public List<ChiTietNvdv> getByDichVu(@PathVariable Integer id) {
        return service.getByDichVu(id);
    }

    @PostMapping("/gan")
    public String ganDichVu(@RequestBody GanDichVuNhanVienRequest request) {
        return service.ganDichVuChoNhanVien(request);
    }
}