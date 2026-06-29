package com.salon.salon_management.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.salon.salon_management.service.DonHangService;

@Component
public class DonHangScheduler {

    private final DonHangService donHangService;

    public DonHangScheduler(DonHangService donHangService) {
        this.donHangService = donHangService;
    }

    @Scheduled(fixedRate = 60000)
    public void huyDonHangQuaHan() {
        donHangService.tuDongHuyDonQuaHan();
    }
}