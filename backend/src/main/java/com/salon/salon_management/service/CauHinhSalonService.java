package com.salon.salon_management.service;

import org.springframework.stereotype.Service;

import com.salon.salon_management.entity.CauHinhSalon;
import com.salon.salon_management.repository.CauHinhSalonRepository;

@Service
public class CauHinhSalonService {

    private final CauHinhSalonRepository repository;

    public CauHinhSalonService(CauHinhSalonRepository repository) {
        this.repository = repository;
    }

    public CauHinhSalon getCauHinhDangDung() {
        return repository.findFirstByTrangThai(1)
                .orElseThrow(() -> new RuntimeException("Chưa cấu hình giờ hoạt động salon"));
    }

    public CauHinhSalon update(CauHinhSalon request) {
        CauHinhSalon cauHinh = getCauHinhDangDung();

        if (!request.getGioMoCua().isBefore(request.getGioDongCua())) {
            throw new RuntimeException("Giờ mở cửa phải nhỏ hơn giờ đóng cửa");
        }

        if (request.getBuocSlot() == null || request.getBuocSlot() <= 0) {
            throw new RuntimeException("Bước slot không hợp lệ");
        }

        if (request.getBufferPhut() == null || request.getBufferPhut() < 0) {
            throw new RuntimeException("Buffer không hợp lệ");
        }

        cauHinh.setGioMoCua(request.getGioMoCua());
        cauHinh.setGioDongCua(request.getGioDongCua());
        cauHinh.setBuocSlot(request.getBuocSlot());
        cauHinh.setBufferPhut(request.getBufferPhut());

        return repository.save(cauHinh);
    }
}