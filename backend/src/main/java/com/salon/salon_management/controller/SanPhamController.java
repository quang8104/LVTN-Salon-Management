package com.salon.salon_management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.salon.salon_management.dto.SanPhamKhuyenMaiDTO;
import com.salon.salon_management.dto.SanPhamRequest;
import com.salon.salon_management.entity.SanPham;
import com.salon.salon_management.service.SanPhamService;

@RestController
@RequestMapping("/api/san-pham")
public class SanPhamController {

    private final SanPhamService service;

    public SanPhamController(SanPhamService service) {
        this.service = service;
    }

    @GetMapping
    public List<SanPham> getAll() {
        return service.getAll();
    }

    @GetMapping("/top")
    public List<SanPham> getTop5() {
        return service.getTop5();
    }

    @GetMapping("/{id}")
    public SanPham getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PostMapping
    public SanPham create(@RequestBody SanPhamRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public SanPham update(
            @PathVariable Integer id,
            @RequestBody SanPhamRequest request
    ) {
        return service.update(id, request);
    }

    @GetMapping("/khuyen-mai")
    public List<SanPhamKhuyenMaiDTO> getAllWithKhuyenMai() {
        return service.getAllWithKhuyenMai();
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {
        return service.delete(id);
    }

    @GetMapping("/search")
    public List<SanPham> search(@RequestParam String keyword) {
        return service.search(keyword);
    }

    
}