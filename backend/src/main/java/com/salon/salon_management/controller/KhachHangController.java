package com.salon.salon_management.controller;

import org.springframework.web.bind.annotation.*;

import com.salon.salon_management.entity.KhachHang;
import com.salon.salon_management.service.KhachHangService;
import com.salon.salon_management.dto.ChangePasswordRequest;

@RestController
@RequestMapping("/api/khach-hang")
public class KhachHangController {

    private final KhachHangService service;

    public KhachHangController(KhachHangService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public KhachHang getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PutMapping("/{id}/profile")
    public KhachHang updateProfile(
            @PathVariable Integer id,
            @RequestBody KhachHang request
    ) {
        return service.updateProfile(id, request);
    }

    @PutMapping("/{id}/doi-mat-khau")
    public String changePassword(
            @PathVariable Integer id,
            @RequestBody ChangePasswordRequest request
    ) {
        return service.changePassword(id, request);
    }
}