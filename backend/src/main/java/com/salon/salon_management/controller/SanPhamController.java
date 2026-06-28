package com.salon.salon_management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
    public SanPham create(@RequestBody SanPham sp) {
        return service.create(sp);
    }

    @PutMapping("/{id}")
    public SanPham update(
            @PathVariable Integer id,
            @RequestBody SanPham sp) {

        return service.update(id, sp);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {

        service.delete(id);

        return "Xóa thành công";
    }

    @GetMapping("/search")
    public List<SanPham> search(
            @RequestParam String keyword) {

        return service.search(keyword);
    }
}
