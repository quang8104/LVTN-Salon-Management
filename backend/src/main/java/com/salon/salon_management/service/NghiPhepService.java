package com.salon.salon_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.salon.salon_management.entity.NghiPhep;
import com.salon.salon_management.repository.NghiPhepRepository;
import com.salon.salon_management.repository.NhanVienRepository;

@Service
public class NghiPhepService {
    private final NghiPhepRepository repository;
    private final NhanVienRepository nhanVienRepository;

    public NghiPhepService(NghiPhepRepository repository, NhanVienRepository nhanVienRepository) {
        this.repository = repository;
        this.nhanVienRepository = nhanVienRepository;
    }

    public List<NghiPhep> getAll() {
        return repository.findAll();
    }

    public NghiPhep create(NghiPhep nghiPhep) {
        if (nghiPhep.getNhanVien() == null || 
            !nhanVienRepository.existsById(nghiPhep.getNhanVien().getMaNhanVien())) {
            throw new RuntimeException("Nhân viên không tồn tại");
        }

        if(nghiPhep.getDenNgay().isBefore(nghiPhep.getTuNgay())){
            throw new RuntimeException("Ngày kết thúc phải sau ngày bắt đầu");
        }

        List<NghiPhep> overlaps = repository.findOverlap(
                nghiPhep.getNhanVien().getMaNhanVien(),
                nghiPhep.getTuNgay(),
                nghiPhep.getDenNgay());

        if (!overlaps.isEmpty()) {
            throw new RuntimeException("Khoảng thời gian nghỉ phép bị trùng");
        }

        return repository.save(nghiPhep);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
