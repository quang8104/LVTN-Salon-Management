package com.salon.salon_management.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.stereotype.Service;

import com.salon.salon_management.dto.RegisterRequest;

@Service
public class OtpService {

    private final Map<String, String> otpMap = new HashMap<>();
    private final Map<String, LocalDateTime> expiredMap = new HashMap<>();
    private final Map<String, RegisterRequest> registerMap = new HashMap<>();

    public String generateOtp(String email, RegisterRequest request) {
        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        otpMap.put(email, otp);
        expiredMap.put(email, LocalDateTime.now().plusMinutes(5));
        registerMap.put(email, request);

        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        if (!otpMap.containsKey(email)) {
            return false;
        }

        if (LocalDateTime.now().isAfter(expiredMap.get(email))) {
            clear(email);
            return false;
        }

        return otpMap.get(email).equals(otp);
    }

    public RegisterRequest getRegisterRequest(String email) {
        return registerMap.get(email);
    }

    public void clear(String email) {
        otpMap.remove(email);
        expiredMap.remove(email);
        registerMap.remove(email);
    }

    public String generateOtpOnly(String email) {

        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        otpMap.put(email, otp);
        expiredMap.put(email, LocalDateTime.now().plusMinutes(5));

        return otp;
    }
}