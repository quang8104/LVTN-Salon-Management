package com.salon.salon_management.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.salon.salon_management.dto.LichCreateRequest;
import com.salon.salon_management.dto.LichResponse;
import com.salon.salon_management.service.LichService;

@RestController
@RequestMapping("/api/lich")
@CrossOrigin(origins = "*")
public class LichController {
    private LichService lichService;

    

    public LichController(LichService lichService) {
        this.lichService = lichService;
    }

    //lay slot ranh trong ngay
    @GetMapping("/slot-ranh")
    public ResponseEntity<?> getSlotRanh(
            @RequestParam Integer maNhanVien,
            @RequestParam String ngayHen) {
        try {
            LocalDate date = LocalDate.parse(ngayHen);
            List<LocalTime> slots = lichService.getSlotRanh(maNhanVien, date);
            
            Map<String, Object> response = new HashMap<>();
            response.put("timestamp", java.time.LocalDateTime.now());
            response.put("status", 200);
            response.put("data", slots);
            
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(createErrorResponse(ex.getMessage()));
        }
    }

    //Tao lich dat moi
    @PostMapping("/dat-lich")
    public ResponseEntity<?> createLich(@RequestBody LichCreateRequest request) {
        try {
            LichResponse response = lichService.createLich(request);
            
            Map<String, Object> result = new HashMap<>();
            result.put("timestamp", java.time.LocalDateTime.now());
            result.put("status", 201);
            result.put("message", "Đặt lịch thành công");
            result.put("data", response);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(createErrorResponse(ex.getMessage()));
        }
    }
    
    //Lay chi tiet lich
    @GetMapping("/{id}")
    public ResponseEntity<?> getLichById(@PathVariable Integer id) {
        try {
            LichResponse response = lichService.getLichById(id);
            
            Map<String, Object> result = new HashMap<>();
            result.put("timestamp", java.time.LocalDateTime.now());
            result.put("status", 200);
            result.put("data", response);
            
            return ResponseEntity.ok(result);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(createErrorResponse(ex.getMessage()));
        }
    }
    
    //Lay danh sach lich cua khach
    @GetMapping("/khach-hang/{maKhachHang}")
    public ResponseEntity<?> getLichByKhachHang(@PathVariable Integer maKhachHang) {
        try {
            List<LichResponse> lichList = lichService.getLichByKhachHang(maKhachHang);
            
            Map<String, Object> result = new HashMap<>();
            result.put("timestamp", java.time.LocalDateTime.now());
            result.put("status", 200);
            result.put("data", lichList);
            
            return ResponseEntity.ok(result);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(createErrorResponse(ex.getMessage()));
        }
    }
    
    //Cap nhat trang thai lich
    @PutMapping("/{id}/trang-thai")
    public ResponseEntity<?> updateTrangThai(
            @PathVariable Integer id,
            @RequestParam Integer trangThai) {
        try {
            LichResponse response = lichService.updateTrangThai(id, trangThai);
            
            Map<String, Object> result = new HashMap<>();
            result.put("timestamp", java.time.LocalDateTime.now());
            result.put("status", 200);
            result.put("message", "Cập nhật trạng thái thành công");
            result.put("data", response);
            
            return ResponseEntity.ok(result);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(createErrorResponse(ex.getMessage()));
        }
    }
    
    //Xoa lich
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLich(@PathVariable Integer id) {
        try {
            lichService.deleteLich(id);
            
            Map<String, Object> result = new HashMap<>();
            result.put("timestamp", java.time.LocalDateTime.now());
            result.put("status", 200);
            result.put("message", "Xóa lịch thành công");
            
            return ResponseEntity.ok(result);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(createErrorResponse(ex.getMessage()));
        }
    }
    
    // Helper
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", java.time.LocalDateTime.now());
        error.put("status", HttpStatus.BAD_REQUEST.value());
        error.put("error", "Bad Request");
        error.put("message", message);
        return error;
    }
}
