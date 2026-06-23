package com.salon.salon_management.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.salon.salon_management.entity.NhanVien;
import com.salon.salon_management.service.NhanVienService;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/nhanvien")
public class NhanVienController {
    private final NhanVienService service;

    public NhanVienController(NhanVienService service) {
        this.service = service;
    }

    @GetMapping
    public List<NhanVien> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public NhanVien getById(@PathVariable Integer id) {
        return service.getByID(id);
    }

    @PostMapping
    public NhanVien create(@RequestBody NhanVien nv) {
        return service.create(nv);
    }

    @PutMapping("/{id}")
    public NhanVien update(@PathVariable Integer id, @RequestBody NhanVien nv) {
        return service.update(id, nv);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {
        return service.delete(id);
    }

    @GetMapping("/search")
    public List<NhanVien> search(@RequestParam String keyword) {
        return service.search(keyword);
    }
}
