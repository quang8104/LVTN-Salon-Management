package com.salon.salon_management.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.salon.salon_management.dto.DonHangItemRequest;
import com.salon.salon_management.dto.NotificationDTO;
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
    private final SimpMessagingTemplate messagingTemplate;

    public DonHangService(
            DonHangRepository donHangRepository,
            ChiTietDonHangRepository chiTietRepository,
            KhachHangRepository khachHangRepository,
            SanPhamRepository sanPhamRepository,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.donHangRepository = donHangRepository;
        this.chiTietRepository = chiTietRepository;
        this.khachHangRepository = khachHangRepository;
        this.sanPhamRepository = sanPhamRepository;
        this.messagingTemplate = messagingTemplate;
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

        String phuongThucThanhToan = request.getPhuongThucThanhToan() == null
                ? "COD"
                : request.getPhuongThucThanhToan();

        donHang.setPhuongThucThanhToan(phuongThucThanhToan);
        donHang.setTrangThaiThanhToan(0);

        donHang = donHangRepository.save(donHang);

        double tongTien = 0;

        for (DonHangItemRequest item : request.getItems()) {
            SanPham sp = sanPhamRepository.findById(item.getMaSanPham())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

            if (item.getSoLuong() == null || item.getSoLuong() <= 0) {
                throw new RuntimeException("Số lượng không hợp lệ");
            }

            if (sp.getSoLuongTon() == null || sp.getSoLuongTon() < item.getSoLuong()) {
                throw new RuntimeException(
                        "Sản phẩm " + sp.getTenSanPham() + " không đủ tồn kho"
                );
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

        DonHang saved = donHangRepository.save(donHang);

        sendOrderNotification(
                "ORDER",
                "Đơn hàng mới",
                "Khách hàng " + kh.getHoTen() + " vừa đặt đơn DH" + saved.getMaDonHang() + "."
        );

        return saved;
    }

    public DonHang xacNhanThanhToan(Integer id) {
        DonHang dh = getById(id);

        if (!"BANK_TRANSFER".equals(dh.getPhuongThucThanhToan())) {
            throw new RuntimeException("Chỉ xác nhận thanh toán cho đơn chuyển khoản");
        }

        if (dh.getTrangThai() == 4) {
            throw new RuntimeException("Không thể xác nhận thanh toán đơn đã hủy");
        }

        if (dh.getTrangThaiThanhToan() != null && dh.getTrangThaiThanhToan() == 1) {
            throw new RuntimeException("Đơn hàng đã được xác nhận thanh toán");
        }

        dh.setTrangThaiThanhToan(1);
        dh.setThoiGianThanhToan(LocalDateTime.now());

        DonHang saved = donHangRepository.save(dh);

        sendOrderNotification(
                "ORDER_UPDATED",
                "Đã xác nhận thanh toán",
                "Đơn DH" + saved.getMaDonHang() + " đã được xác nhận thanh toán."
        );

        return saved;
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

        if ("BANK_TRANSFER".equals(dh.getPhuongThucThanhToan())
                && (dh.getTrangThaiThanhToan() == null || dh.getTrangThaiThanhToan() == 0)) {
            throw new RuntimeException("Đơn chuyển khoản cần xác nhận thanh toán trước");
        }

        dh.setTrangThai(1);

        DonHang saved = donHangRepository.save(dh);

        sendOrderNotification(
                "ORDER_UPDATED",
                "Đơn hàng đã xác nhận",
                "Đơn DH" + saved.getMaDonHang() + " đã được xác nhận."
        );

        return saved;
    }

    public DonHang dangGiao(Integer id) {
        DonHang dh = getById(id);

        if (dh.getTrangThai() != 1) {
            throw new RuntimeException("Chỉ chuyển sang đang giao khi đơn đã xác nhận");
        }

        dh.setTrangThai(2);

        DonHang saved = donHangRepository.save(dh);

        sendOrderNotification(
                "ORDER_UPDATED",
                "Đơn hàng đang giao",
                "Đơn DH" + saved.getMaDonHang() + " đang được giao."
        );

        return saved;
    }

    public DonHang hoanThanh(Integer id) {
        DonHang dh = getById(id);

        if (dh.getTrangThai() != 2) {
            throw new RuntimeException("Chỉ hoàn thành đơn hàng đang giao");
        }

        dh.setTrangThai(3);

        DonHang saved = donHangRepository.save(dh);

        sendOrderNotification(
                "ORDER_UPDATED",
                "Đơn hàng hoàn thành",
                "Đơn DH" + saved.getMaDonHang() + " đã hoàn thành."
        );

        return saved;
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

        DonHang saved = donHangRepository.save(dh);

        sendOrderNotification(
                "ORDER_CANCELLED",
                "Đơn hàng đã hủy",
                "Đơn DH" + saved.getMaDonHang() + " đã bị hủy."
        );

        return saved;
    }

    public List<DonHang> getChoXacNhan() {
        return donHangRepository.findByTrangThai(0);
    }

    public void tuDongHuyDonQuaHan() {
        LocalDateTime time = LocalDateTime.now().minusMinutes(10);

        List<DonHang> list =
                donHangRepository
                        .findByPhuongThucThanhToanAndTrangThaiThanhToanAndTrangThaiAndNgayTaoBefore(
                                "BANK_TRANSFER",
                                0,
                                0,
                                time
                        );

        for (DonHang dh : list) {
            huy(dh.getMaDonHang());
        }
    }

    private void sendOrderNotification(String type, String title, String message) {
        NotificationDTO notification = new NotificationDTO(
                type,
                title,
                message
        );

        messagingTemplate.convertAndSend("/topic/admin", notification);
    }
}