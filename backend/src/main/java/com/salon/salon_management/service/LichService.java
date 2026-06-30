package com.salon.salon_management.service;

import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.salon.salon_management.dto.TaoLichRequest;
import com.salon.salon_management.entity.ChiTietLichHen;
import com.salon.salon_management.entity.DichVu;
import com.salon.salon_management.entity.KhachHang;
import com.salon.salon_management.entity.Lich;
import com.salon.salon_management.entity.NhanVien;
import com.salon.salon_management.repository.ChiTietLichHenRepository;
import com.salon.salon_management.repository.DichVuRepository;
import com.salon.salon_management.repository.KhachHangRepository;
import com.salon.salon_management.repository.LichRepository;
import com.salon.salon_management.repository.NhanVienRepository;

@Service
public class LichService {

    private final LichRepository lichRepository;
    private final KhachHangRepository khachHangRepository;
    private final NhanVienRepository nhanVienRepository;
    private final DichVuRepository dichVuRepository;
    private final ChiTietLichHenRepository chiTietRepository;

    

    public LichService(LichRepository lichRepository, KhachHangRepository khachHangRepository,
            NhanVienRepository nhanVienRepository, DichVuRepository dichVuRepository,
            ChiTietLichHenRepository chiTietRepository) {
        this.lichRepository = lichRepository;
        this.khachHangRepository = khachHangRepository;
        this.nhanVienRepository = nhanVienRepository;
        this.dichVuRepository = dichVuRepository;
        this.chiTietRepository = chiTietRepository;
    }

    public Lich taoLich(TaoLichRequest request) {

        if (request.getDanhSachDichVu() == null
                || request.getDanhSachDichVu().isEmpty()) {
            throw new RuntimeException("Vui lòng chọn ít nhất một dịch vụ");
        }

        KhachHang khachHang = khachHangRepository.findById(request.getMaKhachHang())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng"));

        NhanVien nhanVien = nhanVienRepository.findById(request.getMaNhanVien())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

        if (request.getNgayHen() == null || request.getGioHen() == null) {
            throw new RuntimeException("Ngày hẹn và giờ hẹn không được để trống");
        }

        double tongTien = 0;
        int tongThoiGian = 0;
        int buffer = 30;

        // Tính tổng tiền và thời gian

        for (Integer maDichVu : request.getDanhSachDichVu()) {

            DichVu dv = dichVuRepository.findById(maDichVu)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ"));

            tongTien += dv.getGia();

            tongThoiGian += dv.getThoiGianThucHien();
        }

        LocalTime gioBatDauMoi = request.getGioHen();

        LocalTime gioKetThucMoi =
                gioBatDauMoi.plusMinutes(tongThoiGian + buffer);

        // Kiểm tra trùng lịch

        List<Lich> lichTrongNgay =
                lichRepository.findByNhanVienAndNgayHen(
                        request.getMaNhanVien(),
                        request.getNgayHen());

        for (Lich lichCu : lichTrongNgay) {

            boolean biTrung =
                    gioBatDauMoi.isBefore(lichCu.getGioKetThucDuKien())
                            &&
                    gioKetThucMoi.isAfter(lichCu.getGioHen());

            if (biTrung) {
                throw new RuntimeException("Nhân viên đã có lịch trong khung giờ này");
            }
        }

        // Lưu lịch

        Lich lich = new Lich();

        lich.setKhachHang(khachHang);

        lich.setNgayHen(request.getNgayHen());
        lich.setGioHen(request.getGioHen());

        lich.setTongTien(tongTien);
        lich.setTongThoiGian(tongThoiGian);

        lich.setThoiGianBuffer(buffer);

        lich.setGioKetThucDuKien(gioKetThucMoi);

        lich.setTrangThai(0);
        lich.setNhanVien(nhanVien);

        lich = lichRepository.save(lich);

        // Lưu chi tiết lịch
        int thuTu = 1;

        for (Integer maDichVu : request.getDanhSachDichVu()) {

            DichVu dv = dichVuRepository.findById(maDichVu)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ"));

            ChiTietLichHen ct = new ChiTietLichHen();

            ct.setLich(lich);

            ct.setDichVu(dv);

            ct.setNhanVien(nhanVien);

            ct.setDonGia(dv.getGia());

            ct.setThoiGian(dv.getThoiGianThucHien());

            chiTietRepository.save(ct);
        }

        return lich;
    }

    public List<ChiTietLichHen> getChiTiet(Integer maLichHen) {
        return chiTietRepository.findByLich_Id(maLichHen);
    }

    public List<Lich> getAll() {
        return lichRepository.findAll();
    }

    public Lich getById(Integer id) {
        return lichRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn"));
    }

    public List<Lich> getByKhachHang(Integer maKhachHang) {
        return lichRepository.findByKhachHangId(maKhachHang);
    }

    public List<Lich> getByNhanVien(Integer maNhanVien) {
        return lichRepository.findByNhanVienId(maNhanVien);
    }

    public Lich xacNhan(Integer id) {
        Lich lich = getById(id);

        if (lich.getTrangThai() != 0) {
            throw new RuntimeException("Chỉ xác nhận lịch đang chờ xác nhận");
        }

        lich.setTrangThai(1);
        return lichRepository.save(lich);
    }

    public Lich batDauPhucVu(Integer id) {
        Lich lich = getById(id);

        if (lich.getTrangThai() != 1) {
            throw new RuntimeException("Chỉ bắt đầu phục vụ khi lịch đã xác nhận");
        }

        lich.setTrangThai(2);
        return lichRepository.save(lich);
    }

    public Lich hoanThanh(Integer id) {
        Lich lich = getById(id);

        if (lich.getTrangThai() != 2) {
            throw new RuntimeException("Chỉ hoàn thành lịch đang phục vụ");
        }

        lich.setTrangThai(3);
        lich.setGioKetThucThucTe(LocalTime.now());

        return lichRepository.save(lich);
    }

    public Lich huy(Integer id) {
        Lich lich = getById(id);

        if (lich.getTrangThai() == 3) {
            throw new RuntimeException("Không thể hủy lịch đã hoàn thành");
        }

        lich.setTrangThai(4);
        return lichRepository.save(lich);
    }
}