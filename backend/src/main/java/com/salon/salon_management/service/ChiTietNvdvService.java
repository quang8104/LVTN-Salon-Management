package com.salon.salon_management.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.salon.salon_management.dto.GanDichVuNhanVienRequest;
import com.salon.salon_management.entity.ChiTietNvdv;
import com.salon.salon_management.entity.DichVu;
import com.salon.salon_management.entity.NhanVien;
import com.salon.salon_management.repository.ChiTietNvdvRepository;
import com.salon.salon_management.repository.DichVuRepository;
import com.salon.salon_management.repository.NhanVienRepository;

@Service
public class ChiTietNvdvService {

    private final ChiTietNvdvRepository repository;
    private final NhanVienRepository nhanVienRepository;
    private final DichVuRepository dichVuRepository;

    public ChiTietNvdvService(
            ChiTietNvdvRepository repository,
            NhanVienRepository nhanVienRepository,
            DichVuRepository dichVuRepository
    ) {
        this.repository = repository;
        this.nhanVienRepository = nhanVienRepository;
        this.dichVuRepository = dichVuRepository;
    }

    public List<ChiTietNvdv> getByNhanVien(Integer maNhanVien) {
        return repository.findByNhanVien_MaNhanVien(maNhanVien);
    }

    public List<ChiTietNvdv> getByDichVu(Integer maDichVu) {
        return repository.findByDichVu_MaDichVu(maDichVu);
    }

    @Transactional
    public String ganDichVuChoNhanVien(GanDichVuNhanVienRequest request) {
        NhanVien nhanVien = nhanVienRepository.findById(request.getMaNhanVien())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

        repository.deleteByNhanVien_MaNhanVien(request.getMaNhanVien());

        if (request.getDanhSachMaDichVu() == null
                || request.getDanhSachMaDichVu().isEmpty()) {
            return "Đã bỏ tất cả dịch vụ của nhân viên";
        }

        for (Integer maDichVu : request.getDanhSachMaDichVu()) {
            DichVu dichVu = dichVuRepository.findById(maDichVu)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ"));

            ChiTietNvdv ct = new ChiTietNvdv();
            ct.setNhanVien(nhanVien);
            ct.setDichVu(dichVu);

            repository.save(ct);
        }

        return "Gán dịch vụ cho nhân viên thành công";
    }
}