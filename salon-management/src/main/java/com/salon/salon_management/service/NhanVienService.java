package com.salon.salon_management.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.salon.salon_management.entity.NhanVien;
import com.salon.salon_management.repository.NhanVienRepository;

@Service
public class NhanVienService {
    private final NhanVienRepository repository;
    private final PasswordEncoder passwordEncoder;

    public NhanVienService(NhanVienRepository repository,
                            PasswordEncoder passwordEncoder ){
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<NhanVien> getAll(){
        return repository.findAll();
    }

    public NhanVien getByID(Integer id){
        return repository.findById(id).orElseThrow(()->new RuntimeException("Không tìm thấy nhân viên"));
    }

    public NhanVien create(NhanVien nv){
        if(repository.existsByEmail(nv.getEmail())){
            throw new RuntimeException("Email đã tồn tại");
        }
        if(repository.existsBySdt(nv.getSdt())){
            throw new RuntimeException("Số điện thoại đã tồn tại");
        }
        nv.setMatKhau(passwordEncoder.encode(nv.getMatKhau()));
        nv.setTrangThai(1);
        if(nv.getVaiTro()==null){
            nv.setVaiTro("NHAN_VIEN");
        }

        return repository.save(nv);
    }

    public NhanVien update(Integer id, NhanVien data){
        NhanVien nv=repository.findById(id)
                    .orElseThrow(()-> new RuntimeException("Không tìm thấy nhân viên"));

        nv.setHoTen(data.getHoTen());
        nv.setSdt(data.getSdt());
        nv.setChuyenMon(data.getChuyenMon());
        nv.setVaiTro(data.getVaiTro());

        return repository.save(nv);
    }

    public String delete(Integer id){
        NhanVien nv=repository.findById(id)
                    .orElseThrow(()->new RuntimeException("Không tìm thấy nhân viên"));
        nv.setTrangThai(0);

        repository.save(nv);
        return "Xóa nhân viên thành công";
    }

    public List<NhanVien> search(String keyword){
        return repository.search(keyword);
    }
}
