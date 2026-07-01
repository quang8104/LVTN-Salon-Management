package com.salon.salon_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.salon.salon_management.entity.DanhMucDichVu;
import com.salon.salon_management.repository.DanhMucDichVuRepository;

@Service
public class DanhMucDichVuService {

    private final DanhMucDichVuRepository repository;

    public DanhMucDichVuService(DanhMucDichVuRepository repository) {
        this.repository = repository;
    }

    public List<DanhMucDichVu> getAll() {
        return repository.findAll();
    }

    public List<DanhMucDichVu> getActive() {
        return repository.findByTrangThai(1);
    }

    public DanhMucDichVu create(DanhMucDichVu dm) {
        if (dm.getTrangThai() == null) {
            dm.setTrangThai(1);
        }

        return repository.save(dm);
    }

    public DanhMucDichVu update(Integer id, DanhMucDichVu data) {
        DanhMucDichVu old = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục dịch vụ"));

        old.setTenDanhMuc(data.getTenDanhMuc());
        old.setMoTa(data.getMoTa());
        old.setTrangThai(data.getTrangThai());

        return repository.save(old);
    }

    public String delete(Integer id) {
        DanhMucDichVu dm = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục dịch vụ"));

        dm.setTrangThai(0);
        repository.save(dm);

        return "Xóa danh mục dịch vụ thành công";
    }
}