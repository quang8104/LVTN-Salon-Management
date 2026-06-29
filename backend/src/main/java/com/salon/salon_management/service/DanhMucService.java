package com.salon.salon_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.salon.salon_management.entity.DanhMuc;
import com.salon.salon_management.repository.DanhMucRepository;

@Service
public class DanhMucService {

    private final DanhMucRepository repository;

    public DanhMucService(DanhMucRepository repository) {
        this.repository = repository;
    }

    public List<DanhMuc> getAll() {
        return repository.findAll();
    }

    public List<DanhMuc> getActive() {
        return repository.findByTrangThai(1);
    }

    public DanhMuc getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục"));
    }

    public DanhMuc create(DanhMuc danhMuc) {
        if (danhMuc.getTenDanhMuc() == null || danhMuc.getTenDanhMuc().trim().isEmpty()) {
            throw new RuntimeException("Tên danh mục không được để trống");
        }

        if (danhMuc.getTrangThai() == null) {
            danhMuc.setTrangThai(1);
        }

        return repository.save(danhMuc);
    }

    public DanhMuc update(Integer id, DanhMuc request) {
        DanhMuc old = getById(id);

        if (request.getTenDanhMuc() == null || request.getTenDanhMuc().trim().isEmpty()) {
            throw new RuntimeException("Tên danh mục không được để trống");
        }

        old.setTenDanhMuc(request.getTenDanhMuc());
        old.setMoTa(request.getMoTa());
        old.setTrangThai(request.getTrangThai());

        return repository.save(old);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}