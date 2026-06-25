package com.salon.salon_management.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.salon.salon_management.entity.ChiTietLichHen;
import com.salon.salon_management.entity.HoaDon;
import com.salon.salon_management.entity.Lich;
import com.salon.salon_management.repository.ChiTietLichHenRepository;
import com.salon.salon_management.repository.HoaDonRepository;
import com.salon.salon_management.repository.LichRepository;

@Service
public class HoaDonService {

    private final HoaDonRepository hoaDonRepository;
    private final LichRepository lichRepository;
    private final ChiTietLichHenRepository chiTietRepository;

    public HoaDonService(HoaDonRepository hoaDonRepository, LichRepository lichRepository,
            ChiTietLichHenRepository chiTietRepository) {
        this.hoaDonRepository = hoaDonRepository;
        this.lichRepository = lichRepository;
        this.chiTietRepository = chiTietRepository;
    }

    public void taoHoaDon(Integer maLichHen){

        Lich lich = lichRepository.findById(maLichHen)
            .orElseThrow(() ->new RuntimeException("Không tìm thấy lịch"));

        List<ChiTietLichHen> ds = chiTietRepository.findByLichHen_Id(maLichHen);

        Double tongTien =ds.stream().map(ChiTietLichHen::getDonGia).reduce(0.0, Double::sum);

        HoaDon hd = new HoaDon();

        hd.setLichHen(lich);
        hd.setTongTien(tongTien);
        hd.setTrangThai(0);
        hd.setNgayTao(LocalDateTime.now());

        hoaDonRepository.save(hd);
    }

    public List<HoaDon> getAll() {
        return hoaDonRepository.findAll();
    }

    public HoaDon getById(Integer id) {
        return hoaDonRepository.findById(id)
                .orElseThrow(() ->new RuntimeException("Không tìm thấy hóa đơn"));
    }
        
    public String thanhToan(Integer id){

        HoaDon hd = hoaDonRepository.findById(id)
                .orElseThrow(() ->new RuntimeException("Không tìm thấy hóa đơn"));

        hd.setTrangThai(1);

        hoaDonRepository.save(hd);

        return "Thanh toán thành công";
    }

    public List<HoaDon> chuaThanhToan(){
        return hoaDonRepository.findByTrangThai(0);
    }

    public Double tongDoanhThu(){
        return hoaDonRepository.tongDoanhThu();
    }
    
}
