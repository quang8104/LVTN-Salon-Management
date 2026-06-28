package com.salon.salon_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.salon.salon_management.entity.DichVu;
import com.salon.salon_management.repository.DichVuRepository;

@Service
public class DichVuService {
    private final DichVuRepository repository;

    public DichVuService(DichVuRepository repository){
        this.repository = repository;   
    }

    public List<DichVu> getAll(){
        return repository.findAll();
    }

    public DichVu getByID(Integer id){
        return repository.findById(id)
        .orElseThrow(()->new RuntimeException("Không tìm thấy dịch vụ"));
    }

    public DichVu create(DichVu dv){
        return repository.save(dv);
    }

    public DichVu update(Integer id,DichVu data){
        DichVu dv=repository.findById(id)
        .orElseThrow(()->new RuntimeException("Không tìm thấy dịch vụ"));

        dv.setTenDichVu(data.getTenDichVu());
        dv.setMoTa(data.getMoTa());
        dv.setGia(data.getGia());
        dv.setThoiGianThucHien(data.getThoiGianThucHien());
        dv.setAnhGioiThieu(data.getAnhGioiThieu());
        dv.setTrangThai(data.getTrangThai());
        dv.setDoiTuong(data.getDoiTuong());

        return repository.save(dv);
    }

    public String delete(Integer id){
        DichVu dv=repository.findById(id)
                 .orElseThrow(()->new RuntimeException("Không tìm thấy dịch vụ"));
        dv.setTrangThai(0);
        repository.save(dv);
        return "Xóa dịch vụ thành công";
    }
}
