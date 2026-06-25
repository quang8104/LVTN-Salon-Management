package com.salon.salon_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.salon.salon_management.dto.ThemDichVuRequest;
import com.salon.salon_management.dto.TopDichVuDTO;
import com.salon.salon_management.entity.ChiTietLichHen;
import com.salon.salon_management.entity.DichVu;
import com.salon.salon_management.entity.Lich;
import com.salon.salon_management.repository.ChiTietLichHenRepository;
import com.salon.salon_management.repository.DichVuRepository;
import com.salon.salon_management.repository.LichRepository;

@Service
public class ChiTietLichHenService {

    private final ChiTietLichHenRepository repository;
    private final LichRepository lichRepository;
    private final DichVuRepository dichVuRepository;

    
    
    public ChiTietLichHenService(ChiTietLichHenRepository repository, LichRepository lichRepository,
            DichVuRepository dichVuRepository) {
        this.repository = repository;
        this.lichRepository = lichRepository;
        this.dichVuRepository = dichVuRepository;
    }



    public List<ChiTietLichHen> getByLichHen(Integer id) {
        List<ChiTietLichHen> ds =repository.findByLichHen_Id(id);

        System.out.println(ds.size());

        return ds;
    }


    public ChiTietLichHen themDichVu(ThemDichVuRequest request){

        //Them dich vu vao lich hen
        Lich lich = lichRepository.findById(request.getMaLichHen())
        .orElseThrow(()->new RuntimeException("Không tìm thấy lịch hẹn"));

        DichVu dichVu = dichVuRepository.findById(request.getMaDichVu())
        .orElseThrow(()->new RuntimeException("Không tìm thấy dịch vụ"));

        //+Kiem tra dichj vu da ton tai trong lich hen chua
        boolean daTonTai =
                repository.existsByLichHen_IdAndDichVu_MaDichVu(
                        lich.getId(),
                        dichVu.getMaDichVu());

        if (daTonTai) {
            throw new RuntimeException(
                    "Dịch vụ đã tồn tại trong lịch hẹn");
        }
       
        ChiTietLichHen ct = new ChiTietLichHen();
        ct.setLichHen(lich);
        ct.setDichVu(dichVu);
        ct.setDonGia(dichVu.getGia());
        ct.setThoiGian(dichVu.getThoiGianThucHien());

        repository.save(ct);

        //tinh tong thoi gian va gio ket thuc du kien
        List<ChiTietLichHen> ds =
                repository.findByLichHen_Id(
                        lich.getId());

        int tong =
                ds.stream()
                .mapToInt(
                    ChiTietLichHen::getThoiGian)
                .sum();

        lich.setTongThoiGian(tong);

        lich.setGioKetThucDuKien(
                lich.getGioHen()
                    .plusMinutes(tong));

        lichRepository.save(lich);

        return ct;
        
    }


    public List<TopDichVuDTO> topDichVu() {
        return repository.topDichVu();
    }
}
