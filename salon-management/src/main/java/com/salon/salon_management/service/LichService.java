package com.salon.salon_management.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.salon.salon_management.dto.LichCreateRequest;
import com.salon.salon_management.dto.LichResponse;
import com.salon.salon_management.entity.Lich;
import com.salon.salon_management.repository.KhachHangRepository;
import com.salon.salon_management.repository.LichRepository;
import com.salon.salon_management.repository.NghiPhepRepository;
import com.salon.salon_management.repository.NhanVienRepository;

@Service
public class LichService {
    private LichRepository lichRepository;
    private KhachHangRepository khachHangRepository;
    private NhanVienRepository nhanVienRepository;
    private NghiPhepRepository nghiPhepRepository;

    public LichService(LichRepository lichRepository, KhachHangRepository khachHangRepository,
            NhanVienRepository nhanVienRepository, NghiPhepRepository nghiPhepRepository) {
        this.lichRepository = lichRepository;
        this.khachHangRepository = khachHangRepository;
        this.nhanVienRepository = nhanVienRepository;
        this.nghiPhepRepository = nghiPhepRepository;
    }

    // Hằng số
    private static final LocalTime GIO_MO_CUA = LocalTime.of(8, 0);
    private static final LocalTime GIO_DONG_CUA = LocalTime.of(20, 0);
    private static final int KHOANG_CACH_SLOT = 30; // phút

    // lay dannh sach slot ranh trong ngay
    public List<LocalTime> getSlotRanh(Integer maNhanVien, LocalDate ngayHen) {
        // Kiem tra nhan vien co nghi phep hay khong
        if (isNhanVienNghiPhep(maNhanVien, ngayHen)) {
            return List.of(); // khong co slot ranh
        }

        // Lay tat ca lich cua nhan vien trong ngay
        List<Lich> lichTrongNgay = lichRepository.findByNhanVienAndNgayHen(maNhanVien, ngayHen);

        // Tao danh sach tat ca cac slot trong ngay
        List<LocalTime> allSlots = getAllSlots();

        // loai bo cac slot da duoc dat
        return allSlots.stream()
                .filter(slot -> !isSlotDaDat(slot, lichTrongNgay))
                .collect(Collectors.toList());
    }

    private boolean isNhanVienNghiPhep(Integer maNhanVien, LocalDate ngayHen) {
        return nghiPhepRepository.findByNhanVienIdAndDate(maNhanVien, ngayHen) != null;
    }

    private List<LocalTime> getAllSlots() {
        List<LocalTime> slots = new java.util.ArrayList<>();
        LocalTime current = GIO_MO_CUA;

        while (current.isBefore(GIO_DONG_CUA)) {
            slots.add(current);
            current = current.plusMinutes(KHOANG_CACH_SLOT);
        }

        return slots;
    }

    private boolean isSlotDaDat(LocalTime slot, List<Lich> lichTrongNgay) {
        return lichTrongNgay.stream()
                .anyMatch(lich -> lich.getGioHen().equals(slot));
    }

    // tao lich dat moi
    public LichResponse createLich(LichCreateRequest request) {
        // Validate
        validateBookingRequest(request);

        // Kiểm tra slot trống
        List<Lich> existingBookings = lichRepository.checkDuplicateBooking(
                request.getMaNhanVien(),
                request.getNgayHen(),
                request.getGioHen());

        if (!existingBookings.isEmpty()) {
            throw new RuntimeException("Slot thời gian này đã được đặt. Vui lòng chọn slot khác.");
        }

        // Tao lich
        Lich lich = new Lich();
        lich.setKhachHang(khachHangRepository.findById(request.getMaKhachHang())
                .orElseThrow(() -> new RuntimeException("Khách hàng không tồn tại")));
        lich.setNhanVien(nhanVienRepository.findById(request.getMaNhanVien())
                .orElseThrow(() -> new RuntimeException("Nhân viên không tồn tại")));
        lich.setNgayHen(request.getNgayHen());
        lich.setGioHen(request.getGioHen());
        lich.setTrangThai(0); // Cho xac nhan

        // Tinh gio ket thuc du kien (mac dinh 30 phut)
        lich.setGioKetThucDuKien(request.getGioHen().plusMinutes(30));
        lich.setTongThoiGian(30);

        Lich saved = lichRepository.save(lich);
        return convertToResponse(saved);
    }

    private void validateBookingRequest(LichCreateRequest request) {
        if (request.getMaKhachHang() == null || request.getMaNhanVien() == null) {
            throw new RuntimeException("Thiếu thông tin khách hàng hoặc nhân viên");
        }

        if (request.getNgayHen() == null || request.getGioHen() == null) {
            throw new RuntimeException("Thiếu thông tin ngày giờ đặt");
        }

        if (request.getNgayHen().isBefore(LocalDate.now())) {
            throw new RuntimeException("Không thể đặt lịch trong quá khứ");
        }

        if (request.getGioHen().isBefore(GIO_MO_CUA) || request.getGioHen().isAfter(GIO_DONG_CUA)) {
            throw new RuntimeException("Giờ đặt không nằm trong giờ hoạt động (08:00 - 20:00)");
        }
    }

    private LichResponse convertToResponse(Lich lich) {
        LichResponse response = new LichResponse();
        response.setId(lich.getId());
        response.setMaKhachHang(lich.getKhachHang().getMaKhachHang());
        response.setTenKhachHang(lich.getKhachHang().getHoTen());
        response.setSdt(lich.getKhachHang().getSdt());
        response.setMaNhanVien(lich.getNhanVien().getMaNhanVien());
        response.setTenNhanVien(lich.getNhanVien().getHoTen());
        response.setNgayHen(lich.getNgayHen());
        response.setGioHen(lich.getGioHen());
        response.setGioKetThucDuKien(lich.getGioKetThucDuKien());
        response.setTongThoiGian(lich.getTongThoiGian());
        response.setTrangThai(lich.getTrangThai());
        response.setTrangThaiText(getTrangThaiText(lich.getTrangThai()));
        return response;
    }

    private String getTrangThaiText(Integer trangThai) {
        if (trangThai == null)
            return "";
        return switch (trangThai) {
            case 0 -> "Chờ xác nhận";
            case 1 -> "Xác nhận";
            case 2 -> "Hoàn tất";
            case 3 -> "Hủy";
            default -> "Không xác định";
        };
    }

    // Lay chi tiet
    public LichResponse getLichById(Integer id) {
        Lich lich = lichRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lịch không tồn tại"));
        return convertToResponse(lich);
    }

    // Lay danh sach lich theo khach hang
    public List<LichResponse> getLichByKhachHang(Integer maKhachHang) {
        return lichRepository.findByKhachHangId(maKhachHang)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Cap nhat trang thai lich
    public LichResponse updateTrangThai(Integer id, Integer trangThai) {
        Lich lich = lichRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lịch không tồn tại"));
        lich.setTrangThai(trangThai);
        Lich updated = lichRepository.save(lich);
        return convertToResponse(updated);
    }

    // Xoa lich
    public void deleteLich(Integer id) {
        if (!lichRepository.existsById(id)) {
            throw new RuntimeException("Lịch không tồn tại");
        }
        lichRepository.deleteById(id);
    }
}
