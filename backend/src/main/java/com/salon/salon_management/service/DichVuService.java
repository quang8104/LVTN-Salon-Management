package com.salon.salon_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.salon.salon_management.entity.DanhMucDichVu;
import com.salon.salon_management.entity.DichVu;
import com.salon.salon_management.repository.DanhMucDichVuRepository;
import com.salon.salon_management.repository.DichVuRepository;

@Service
public class DichVuService {
    private final DichVuRepository repository;
    private final DanhMucDichVuRepository danhMucRepository;

    public DichVuService(
            DichVuRepository repository,
            DanhMucDichVuRepository danhMucRepository
    ) {
        this.repository = repository;
        this.danhMucRepository = danhMucRepository;
    }

    public List<DichVu> getAll() {
        return repository.findAll();
    }

    public DichVu getByID(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ"));
    }

    public DichVu create(DichVu dv) {
        ganDanhMuc(dv);
        return repository.save(dv);
    }

    public DichVu update(Integer id, DichVu data) {
        DichVu dv = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ"));

        dv.setTenDichVu(data.getTenDichVu());
        dv.setMoTa(data.getMoTa());
        dv.setGia(data.getGia());
        dv.setThoiGianThucHien(data.getThoiGianThucHien());
        dv.setAnhGioiThieu(data.getAnhGioiThieu());
        dv.setTrangThai(data.getTrangThai());
        dv.setDanhMucDichVu(data.getDanhMucDichVu());

        ganDanhMuc(dv);

        return repository.save(dv);
    }

    private void ganDanhMuc(DichVu dv) {
        if (dv.getDanhMucDichVu() != null
                && dv.getDanhMucDichVu().getMaDanhMucDichVu() != null) {

            DanhMucDichVu dm = danhMucRepository
                    .findById(dv.getDanhMucDichVu().getMaDanhMucDichVu())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục dịch vụ"));

            dv.setDanhMucDichVu(dm);
        }
    }

    public String delete(Integer id) {
        DichVu dv = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ"));

        dv.setTrangThai(0);
        repository.save(dv);

        return "Xóa dịch vụ thành công";
    }
}