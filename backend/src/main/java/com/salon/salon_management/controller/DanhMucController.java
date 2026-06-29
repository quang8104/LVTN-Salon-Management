package com.salon.salon_management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.salon.salon_management.entity.DanhMuc;
import com.salon.salon_management.service.DanhMucService;

@RestController
@RequestMapping("/api/danh-muc")
public class DanhMucController {

    private final DanhMucService service;

    public DanhMucController(DanhMucService service) {
        this.service = service;
    }

    @GetMapping
    public List<DanhMuc> getAll() {
        return service.getAll();
    }

    @GetMapping("/active")
    public List<DanhMuc> getActive() {
        return service.getActive();
    }

    @GetMapping("/{id}")
    public DanhMuc getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PostMapping
    public DanhMuc create(@RequestBody DanhMuc danhMuc) {
        return service.create(danhMuc);
    }

    @PutMapping("/{id}")
    public DanhMuc update(
            @PathVariable Integer id,
            @RequestBody DanhMuc danhMuc
    ) {
        return service.update(id, danhMuc);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {
        service.delete(id);
        return "Xóa danh mục thành công";
    }
}