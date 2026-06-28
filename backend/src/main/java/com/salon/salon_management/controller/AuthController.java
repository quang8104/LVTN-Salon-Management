package com.salon.salon_management.controller;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.salon.salon_management.dto.LoginRequest;
import com.salon.salon_management.dto.LoginResponse;
import com.salon.salon_management.dto.RegisterRequest;
import com.salon.salon_management.dto.VerifyOtpRequest;
import com.salon.salon_management.service.KhachHangService;
import com.salon.salon_management.dto.ForgotPasswordRequest;
import com.salon.salon_management.dto.ResetPasswordRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final KhachHangService service;
    private final PasswordEncoder passwordEncoder;

    public AuthController(KhachHangService service, PasswordEncoder passwordEncoder) {
        this.service = service;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        return service.register(request);
    }

    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestBody VerifyOtpRequest request) {
        return service.verifyOtp(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return service.login(request);
    }

    @GetMapping("/encode")
    public String encode(@RequestParam String password) {
        return passwordEncoder.encode(password);
    }

    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return service.forgotPassword(request);
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody ResetPasswordRequest request) {
        return service.resetPassword(request);
}
}