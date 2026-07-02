package com.salon.salon_management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.salon.salon_management.dto.KhuyenMaiRequest;
import com.salon.salon_management.entity.KhuyenMai;
import com.salon.salon_management.entity.KhuyenMaiChiTiet;
import com.salon.salon_management.service.KhuyenMaiService;

@RestController
@RequestMapping("/api/khuyen-mai")
public class KhuyenMaiController {

    private final KhuyenMaiService service;

    public KhuyenMaiController(KhuyenMaiService service) {
        this.service = service;
    }

    @GetMapping
    public List<KhuyenMai> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public KhuyenMai getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @GetMapping("/{id}/chi-tiet")
    public List<KhuyenMaiChiTiet> getChiTiet(@PathVariable Integer id) {
        return service.getChiTiet(id);
    }

    @PostMapping
    public KhuyenMai create(@RequestBody KhuyenMaiRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public KhuyenMai update(
            @PathVariable Integer id,
            @RequestBody KhuyenMaiRequest request
    ) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}