package com.salon.salon_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.salon.salon_management.entity.SanPham;
import com.salon.salon_management.repository.SanPhamRepository;

@Service
public class SanPhamService {
     private final SanPhamRepository repository;

    public SanPhamService(SanPhamRepository repository) {
        this.repository = repository;
    }

    public List<SanPham> getAll() {
        return repository.findAll();
    }

    public SanPham getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy sản phẩm"));
    }

    public SanPham create(SanPham sp) {
        return repository.save(sp);
    }

    public SanPham update(Integer id, SanPham sp) {

        SanPham old = getById(id);

        old.setTenSanPham(sp.getTenSanPham());
        old.setMoTa(sp.getMoTa());
        old.setGia(sp.getGia());
        old.setHinhAnh(sp.getHinhAnh());
        old.setTrangThai(sp.getTrangThai());
        old.setSoLuongTon(sp.getSoLuongTon());

        return repository.save(old);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }

    public List<SanPham> search(String keyword) {
        return repository.findByTenSanPhamContaining(keyword);
    }

}
