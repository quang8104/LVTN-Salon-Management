package com.salon.salon_management.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.salon.salon_management.entity.HoaDon;
import com.salon.salon_management.service.HoaDonService;

@RestController
@RequestMapping("/api/hoa-don")
public class HoaDonController {

    private final HoaDonService service;

    public HoaDonController(
            HoaDonService service) {
        this.service = service;
    }

    @PostMapping("/tao/{maLichHen}")
    public String taoHoaDon(@PathVariable Integer maLichHen){

        service.taoHoaDon(maLichHen);

        return "Tạo hóa đơn thành công";
    }

    @GetMapping
    public List<HoaDon> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public HoaDon getById(@PathVariable Integer id) {

        return service.getById(id);
    }

    @PutMapping("/{id}/thanh-toan")
    public String thanhToan(@PathVariable Integer id){

        return service.thanhToan(id);
    }

    @GetMapping("/chua-thanh-toan")
    public List<HoaDon> chuaThanhToan(){
        return service.chuaThanhToan();
    }

    @GetMapping("/doanh-thu")
    public Double doanhThu(){
        return service.tongDoanhThu();
    }

    
}
