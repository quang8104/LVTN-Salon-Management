package com.salon.salon_management.controller;

import org.springframework.web.bind.annotation.*;

import com.salon.salon_management.entity.CauHinhSalon;
import com.salon.salon_management.service.CauHinhSalonService;

@RestController
@RequestMapping("/api/cau-hinh-salon")
public class CauHinhSalonController {

    private final CauHinhSalonService service;

    public CauHinhSalonController(CauHinhSalonService service) {
        this.service = service;
    }

    @GetMapping
    public CauHinhSalon getCauHinh() {
        return service.getCauHinhDangDung();
    }

    @PutMapping
    public CauHinhSalon update(@RequestBody CauHinhSalon request) {
        return service.update(request);
    }
}