package com.salon.salon_management.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.salon.salon_management.dto.HoaDonItemRequest;
import com.salon.salon_management.dto.TaoHoaDonRequest;
import com.salon.salon_management.dto.TopSanPhamDTO;
import com.salon.salon_management.entity.ChiTietHoaDonBH;
import com.salon.salon_management.entity.HoaDonBanHang;
import com.salon.salon_management.entity.KhachHang;
import com.salon.salon_management.entity.SanPham;
import com.salon.salon_management.repository.ChiTietHoaDonBHRepository;
import com.salon.salon_management.repository.HoaDonBanHangRepository;
import com.salon.salon_management.repository.KhachHangRepository;
import com.salon.salon_management.repository.SanPhamRepository;

@Service
public class HoaDonBanHangService {

    private final HoaDonBanHangRepository hoaDonRepository;
    private final ChiTietHoaDonBHRepository chiTietRepository;
    private final SanPhamRepository sanPhamRepository;
    private final KhachHangRepository khachHangRepository;
    private final ChiTietHoaDonBHRepository chiTietHDRepository;

    
    public HoaDonBanHangService(HoaDonBanHangRepository hoaDonRepository, ChiTietHoaDonBHRepository chiTietRepository,
            SanPhamRepository sanPhamRepository, KhachHangRepository khachHangRepository,
            ChiTietHoaDonBHRepository chiTietHDRepository) {
        this.hoaDonRepository = hoaDonRepository;
        this.chiTietRepository = chiTietRepository;
        this.sanPhamRepository = sanPhamRepository;
        this.khachHangRepository = khachHangRepository;
        this.chiTietHDRepository = chiTietHDRepository;
    }

    public HoaDonBanHang taoHoaDon(TaoHoaDonRequest request) {

        KhachHang kh = khachHangRepository.findById(request.getMaKhachHang())
                .orElseThrow();

        double tongTien = 0;

        HoaDonBanHang hoaDon = new HoaDonBanHang();

        hoaDon.setKhachHang(kh);
        hoaDon.setTrangThai(0);
        hoaDon.setNgayTao(LocalDateTime.now());

        hoaDon = hoaDonRepository.save(hoaDon);

        // Duyet tung san pham
        for (HoaDonItemRequest item : request.getItems()) {

            SanPham sp = sanPhamRepository.findById(item.getMaSanPham())
                    .orElseThrow();

            // Kiem tra ton kho
            if (sp.getSoLuongTon() < item.getSoLuong()) {

                throw new RuntimeException("Không đủ hàng tồn kho");
            }
            // Tru kho
            sp.setSoLuongTon(sp.getSoLuongTon() - item.getSoLuong());

            sanPhamRepository.save(sp);

            // Tao chi tiet hoa don
            ChiTietHoaDonBH ct = new ChiTietHoaDonBH();

            ct.setHoaDon(hoaDon);
            ct.setSanPham(sp);

            ct.setSoLuong(item.getSoLuong());

            ct.setDonGia(sp.getGia());

            chiTietRepository.save(ct);

            // tinh tien
            tongTien += sp.getGia() * item.getSoLuong();
        }

        // Cap nhat tong tien
        hoaDon.setTongTien(tongTien);

        return hoaDonRepository.save(hoaDon);
    }

    public List<HoaDonBanHang> getAll() {
        return hoaDonRepository.findAll();
    }

    public HoaDonBanHang getById(Integer id) {

        return hoaDonRepository.findById(id)
                .orElseThrow(() ->new RuntimeException("Không tìm thấy hóa đơn"));
    }

    public List<ChiTietHoaDonBH>getChiTiet(Integer maHoaDon) {

        return chiTietRepository.findByHoaDon_MaHoaDonBh(maHoaDon);
    }

    public HoaDonBanHang thanhToan(Integer id){

        HoaDonBanHang hd =hoaDonRepository.findById(id)
                .orElseThrow(() ->new RuntimeException("Không tìm thấy hóa đơn"));

        if(hd.getTrangThai() == 1){
            throw new RuntimeException(
                "Hóa đơn đã thanh toán");
        }

        hd.setTrangThai(1);

        return hoaDonRepository.save(hd);
    }

    public List<HoaDonBanHang> chuaThanhToan(){

        return hoaDonRepository.findByTrangThai(0);
    }

    public Double doanhThu(){

        return hoaDonRepository.tinhDoanhThu();
    }

    public Double doanhThuNgay(LocalDate ngay){
        return hoaDonRepository.doanhThuNgay(ngay);
    }

    public Double doanhThuThang(Integer thang,Integer nam){

        return hoaDonRepository.doanhThuThang(thang, nam);
    }

    public List<TopSanPhamDTO> topSanPham() {
        return chiTietHDRepository.topSanPham();
    }
}
