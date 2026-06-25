package com.salon.salon_management.controller;

import com.salon.salon_management.service.LichService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.salon.salon_management.dto.ThemDichVuRequest;
import com.salon.salon_management.entity.ChiTietLichHen;
import com.salon.salon_management.entity.Lich;
import com.salon.salon_management.service.ChiTietLichHenService;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/chi-tiet-lich")
public class ChiTietLichHenController {

    private final LichService lichService;
    private final ChiTietLichHenService service;

    public ChiTietLichHenController(ChiTietLichHenService service, LichService lichService) {
        this.service = service;
        this.lichService = lichService;
    }

    @GetMapping("/{id}")
    public List<ChiTietLichHen> getByLichHen(@PathVariable Integer id){
        return service.getByLichHen(id);
    }

    @PostMapping
    public ChiTietLichHen themDichVu(@RequestBody ThemDichVuRequest request){

        return service.themDichVu(request);
    }
    
}
