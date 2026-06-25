package com.salon.salon_management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.salon.salon_management.dto.TopDichVuDTO;
import com.salon.salon_management.service.ChiTietLichHenService;

@RestController
@RequestMapping("/api/thong-ke")
public class ThongKeController {
    private final ChiTietLichHenService service;

    public ThongKeController(
            ChiTietLichHenService service) {
        this.service = service;
    }

    @GetMapping("/top-dich-vu")
    public List<TopDichVuDTO> topDichVu() {
        return service.topDichVu();
    }
}
