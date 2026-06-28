package com.salon.salon_management.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.salon.salon_management.dto.DonHangItemRequest;
import com.salon.salon_management.dto.TaoDonHangRequest;
import com.salon.salon_management.entity.ChiTietDonHang;
import com.salon.salon_management.entity.DonHang;
import com.salon.salon_management.entity.KhachHang;
import com.salon.salon_management.entity.SanPham;
import com.salon.salon_management.repository.ChiTietDonHangRepository;
import com.salon.salon_management.repository.DonHangRepository;
import com.salon.salon_management.repository.KhachHangRepository;
import com.salon.salon_management.repository.SanPhamRepository;

@Service
public class DonHangService {

    private final DonHangRepository donHangRepository;
    private final ChiTietDonHangRepository chiTietRepository;
    private final KhachHangRepository khachHangRepository;
    private final SanPhamRepository sanPhamRepository;

    public DonHangService(
            DonHangRepository donHangRepository,
            ChiTietDonHangRepository chiTietRepository,
            KhachHangRepository khachHangRepository,
            SanPhamRepository sanPhamRepository) {
        this.donHangRepository = donHangRepository;
        this.chiTietRepository = chiTietRepository;
        this.khachHangRepository = khachHangRepository;
        this.sanPhamRepository = sanPhamRepository;
    }

    public DonHang taoDonHang(TaoDonHangRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Đơn hàng không có sản phẩm");
        }

        KhachHang kh = khachHangRepository.findById(request.getMaKhachHang())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng"));

        DonHang donHang = new DonHang();
        donHang.setKhachHang(kh);
        donHang.setNgayTao(LocalDateTime.now());
        donHang.setTrangThai(0);
        donHang.setTongTien(0.0);
        donHang.setHoTenNguoiNhan(request.getHoTenNguoiNhan());
        donHang.setSoDienThoai(request.getSoDienThoai());
        donHang.setDiaChi(request.getDiaChi());
        donHang.setGhiChu(request.getGhiChu());
        donHang.setPhuongThucThanhToan(
                request.getPhuongThucThanhToan() == null
                        ? "COD"
                        : request.getPhuongThucThanhToan()
        );

        donHang = donHangRepository.save(donHang);

        double tongTien = 0;

        for (DonHangItemRequest item : request.getItems()) {
            SanPham sp = sanPhamRepository.findById(item.getMaSanPham())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

            if (item.getSoLuong() == null || item.getSoLuong() <= 0) {
                throw new RuntimeException("Số lượng không hợp lệ");
            }

            if (sp.getSoLuongTon() == null || sp.getSoLuongTon() < item.getSoLuong()) {
                throw new RuntimeException("Sản phẩm " + sp.getTenSanPham() + " không đủ tồn kho");
            }

            double thanhTien = sp.getGia() * item.getSoLuong();

            ChiTietDonHang ct = new ChiTietDonHang();
            ct.setDonHang(donHang);
            ct.setSanPham(sp);
            ct.setSoLuong(item.getSoLuong());
            ct.setDonGia(sp.getGia());
            ct.setThanhTien(thanhTien);

            chiTietRepository.save(ct);

            sp.setSoLuongTon(sp.getSoLuongTon() - item.getSoLuong());
            sanPhamRepository.save(sp);

            tongTien += thanhTien;
        }

        donHang.setTongTien(tongTien);
        return donHangRepository.save(donHang);
    }

    public List<DonHang> getAll() {
        return donHangRepository.findAll();
    }

    public DonHang getById(Integer id) {
        return donHangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
    }

    public List<ChiTietDonHang> getChiTiet(Integer maDonHang) {
        return chiTietRepository.findByDonHang_MaDonHang(maDonHang);
    }

    public List<DonHang> getByKhachHang(Integer maKhachHang) {
        return donHangRepository.findByKhachHang_MaKhachHang(maKhachHang);
    }

    public DonHang xacNhan(Integer id) {
        DonHang dh = getById(id);

        if (dh.getTrangThai() != 0) {
            throw new RuntimeException("Chỉ xác nhận đơn hàng đang chờ xác nhận");
        }

        dh.setTrangThai(1);
        return donHangRepository.save(dh);
    }

    public DonHang dangGiao(Integer id) {
        DonHang dh = getById(id);

        if (dh.getTrangThai() != 1) {
            throw new RuntimeException("Chỉ chuyển sang đang giao khi đơn đã xác nhận");
        }

        dh.setTrangThai(2);
        return donHangRepository.save(dh);
    }

    public DonHang hoanThanh(Integer id) {
        DonHang dh = getById(id);

        if (dh.getTrangThai() != 2) {
            throw new RuntimeException("Chỉ hoàn thành đơn hàng đang giao");
        }

        dh.setTrangThai(3);
        return donHangRepository.save(dh);
    }

    public DonHang huy(Integer id) {
        DonHang dh = getById(id);

        if (dh.getTrangThai() == 3) {
            throw new RuntimeException("Không thể hủy đơn hàng đã hoàn thành");
        }

        if (dh.getTrangThai() != 4) {
            List<ChiTietDonHang> chiTiet = getChiTiet(id);

            for (ChiTietDonHang ct : chiTiet) {
                SanPham sp = ct.getSanPham();
                sp.setSoLuongTon(sp.getSoLuongTon() + ct.getSoLuong());
                sanPhamRepository.save(sp);
            }
        }

        dh.setTrangThai(4);
        return donHangRepository.save(dh);
    }

    public List<DonHang> getChoXacNhan() {
        return donHangRepository.findByTrangThai(0);
    }
}