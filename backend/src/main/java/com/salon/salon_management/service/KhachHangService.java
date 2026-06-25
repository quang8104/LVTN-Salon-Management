package com.salon.salon_management.service;

import java.rmi.registry.Registry;
import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jwt.JwtUtil;
import com.salon.salon_management.dto.LoginRequest;
import com.salon.salon_management.dto.LoginResponse;
import com.salon.salon_management.dto.RegisterRequest;
import com.salon.salon_management.entity.KhachHang;
import com.salon.salon_management.repository.KhachHangRepository;

@Service
public class KhachHangService {
    private final KhachHangRepository repository;
    private final PasswordEncoder passwordEncoder;

    public KhachHangService(KhachHangRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public String register(RegisterRequest request) {
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            return "Email đã tồn tại";
        }

        if (repository.findBySdt(request.getSdt()).isPresent()) {
            return "Số điện thoại đã tồn tại";
        }

        KhachHang kh = new KhachHang();
        kh.setHoTen(request.getHoTen());
        kh.setEmail(request.getEmail());
        kh.setSdt(request.getSdt());
        kh.setDiaChi(request.getDiaChi());
        kh.setMatKhau(passwordEncoder.encode(request.getMatKhau()));
        kh.setNgayTao(LocalDateTime.now());
        repository.save(kh);
        return "Đăng ký thành công";
    }

    //
    public LoginResponse login(LoginRequest request) {
        KhachHang kh = repository.findByEmail(request.getEmail()).orElse(null);

        if (kh == null) {
            throw new RuntimeException("Email không tồn tại");
        }

        boolean dungMatKhau = passwordEncoder.matches(request.getMatKhau(),
                kh.getMatKhau());
        if (!dungMatKhau) {
            throw new RuntimeException("Sai mật khẩu");
        }
        String token = JwtUtil.generateToken(
                kh.getEmail());
        return new  LoginResponse(token);
    }
}
