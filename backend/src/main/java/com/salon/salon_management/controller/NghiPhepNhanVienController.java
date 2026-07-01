package com.salon.salon_management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.salon.salon_management.dto.NghiPhepNhanVienRequest;
import com.salon.salon_management.entity.NghiPhepNhanVien;
import com.salon.salon_management.service.NghiPhepNhanVienService;

@RestController
@RequestMapping("/api/nghi-phep-nhan-vien")
public class NghiPhepNhanVienController {

    private final NghiPhepNhanVienService service;

    public NghiPhepNhanVienController(NghiPhepNhanVienService service) {
        this.service = service;
    }

    @GetMapping
    public List<NghiPhepNhanVien> getAll() {
        return service.getAll();
    }

    @PostMapping
    public NghiPhepNhanVien create(@RequestBody NghiPhepNhanVienRequest request) {
        return service.create(request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}