package com.salon.salon_management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.salon.salon_management.entity.DanhMucDichVu;
import com.salon.salon_management.service.DanhMucDichVuService;

@RestController
@RequestMapping("/api/danh-muc-dich-vu")
public class DanhMucDichVuController {

    private final DanhMucDichVuService service;

    public DanhMucDichVuController(DanhMucDichVuService service) {
        this.service = service;
    }

    @GetMapping
    public List<DanhMucDichVu> getAll() {
        return service.getAll();
    }

    @GetMapping("/active")
    public List<DanhMucDichVu> getActive() {
        return service.getActive();
    }

    @PostMapping
    public DanhMucDichVu create(@RequestBody DanhMucDichVu dm) {
        return service.create(dm);
    }

    @PutMapping("/{id}")
    public DanhMucDichVu update(
            @PathVariable Integer id,
            @RequestBody DanhMucDichVu dm
    ) {
        return service.update(id, dm);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {
        return service.delete(id);
    }
}