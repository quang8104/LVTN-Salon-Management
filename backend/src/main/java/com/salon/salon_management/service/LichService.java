package com.salon.salon_management.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.salon.salon_management.dto.LichHenReasonRequest;
import com.salon.salon_management.dto.SuaLichAdminRequest;
import com.salon.salon_management.dto.TaoLichRequest;
import com.salon.salon_management.entity.ChiTietLichHen;
import com.salon.salon_management.entity.DichVu;
import com.salon.salon_management.entity.KhachHang;
import com.salon.salon_management.entity.Lich;
import com.salon.salon_management.entity.LichSuLichHen;
import com.salon.salon_management.entity.NhanVien;
import com.salon.salon_management.repository.ChiTietLichHenRepository;
import com.salon.salon_management.repository.DichVuRepository;
import com.salon.salon_management.repository.KhachHangRepository;
import com.salon.salon_management.repository.LichRepository;
import com.salon.salon_management.repository.LichSuLichHenRepository;
import com.salon.salon_management.repository.NhanVienRepository;
import com.salon.salon_management.dto.AdminTaoLichRequest;

import jakarta.transaction.Transactional;

@Service
public class LichService {

    private final LichRepository lichRepository;
    private final KhachHangRepository khachHangRepository;
    private final NhanVienRepository nhanVienRepository;
    private final DichVuRepository dichVuRepository;
    private final ChiTietLichHenRepository chiTietRepository;
    private final LichSuLichHenRepository lichSuRepo;

    

    

    public LichService(LichRepository lichRepository, KhachHangRepository khachHangRepository,
            NhanVienRepository nhanVienRepository, DichVuRepository dichVuRepository,
            ChiTietLichHenRepository chiTietRepository, LichSuLichHenRepository lichSuRepo) {
        this.lichRepository = lichRepository;
        this.khachHangRepository = khachHangRepository;
        this.nhanVienRepository = nhanVienRepository;
        this.dichVuRepository = dichVuRepository;
        this.chiTietRepository = chiTietRepository;
        this.lichSuRepo = lichSuRepo;
    }

    public Lich taoLich(TaoLichRequest request) {

        if (request.getDanhSachDichVu() == null
                || request.getDanhSachDichVu().isEmpty()) {
            throw new RuntimeException("Vui lòng chọn ít nhất một dịch vụ");
        }

        if (request.getNgayHen() == null || request.getGioHen() == null) {
            throw new RuntimeException("Ngày hẹn và giờ hẹn không được để trống");
        }

        KhachHang khachHang = khachHangRepository.findById(request.getMaKhachHang())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng"));

        double tongTien = 0;
        int tongThoiGian = 0;
        int buffer = 30;

        List<DichVu> danhSachDichVu = new ArrayList<>();

        for (Integer maDichVu : request.getDanhSachDichVu()) {
            DichVu dv = dichVuRepository.findById(maDichVu)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ"));

            danhSachDichVu.add(dv);
            tongTien += dv.getGia();
            tongThoiGian += dv.getThoiGianThucHien();
        }

        LocalTime gioBatDauMoi = request.getGioHen();
        LocalTime gioKetThucMoi = gioBatDauMoi.plusMinutes(tongThoiGian + buffer);

        NhanVien nhanVien;

        if (request.getMaNhanVien() != null) {
            nhanVien = nhanVienRepository.findById(request.getMaNhanVien())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

            kiemTraTrungLich(
                    nhanVien.getMaNhanVien(),
                    request.getNgayHen(),
                    gioBatDauMoi,
                    gioKetThucMoi
            );
        } else {
            nhanVien = timNhanVienRanh(
                    request.getNgayHen(),
                    gioBatDauMoi,
                    gioKetThucMoi
            );
        }

        Lich lich = new Lich();

        lich.setKhachHang(khachHang);
        lich.setNhanVien(nhanVien);
        lich.setNgayHen(request.getNgayHen());
        lich.setGioHen(gioBatDauMoi);
        lich.setGioKetThucDuKien(gioKetThucMoi);
        lich.setTongTien(tongTien);
        lich.setTongThoiGian(tongThoiGian);
        lich.setThoiGianBuffer(buffer);
        lich.setTrangThai(0);

        lich = lichRepository.save(lich);

        for (DichVu dv : danhSachDichVu) {
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

    private void kiemTraTrungLich(Integer maNhanVien,LocalDate ngayHen,LocalTime gioBatDauMoi,LocalTime gioKetThucMoi) {
        List<Lich> lichTrongNgay = lichRepository.findByNhanVienAndNgayHen(
                maNhanVien,
                ngayHen
        );

        for (Lich lichCu : lichTrongNgay) {
            boolean biTrung =
                    gioBatDauMoi.isBefore(lichCu.getGioKetThucDuKien())
                            &&
                    gioKetThucMoi.isAfter(lichCu.getGioHen());

            if (biTrung) {
                throw new RuntimeException("Nhân viên đã có lịch trong khung giờ này");
            }
        }
    }

    private NhanVien timNhanVienRanh(LocalDate ngayHen,LocalTime gioBatDauMoi,LocalTime gioKetThucMoi) {
        List<NhanVien> danhSachNhanVien = nhanVienRepository.findByTrangThai(1);

        for (NhanVien nv : danhSachNhanVien) {
            try {
                kiemTraTrungLich(
                        nv.getMaNhanVien(),
                        ngayHen,
                        gioBatDauMoi,
                        gioKetThucMoi
                );

                return nv;
            } catch (RuntimeException ignored) {
            }
        }

        throw new RuntimeException("Không còn nhân viên trống trong khung giờ này");
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

        if (lich.getTrangThai() != 0) {
            throw new RuntimeException("Chỉ được hủy lịch khi đang chờ xác nhận");
        }

        lich.setTrangThai(4);
        return lichRepository.save(lich);
    }

    @Transactional
    public Lich huyAdmin(Integer id, LichHenReasonRequest request) {
        if (request.getLyDo() == null || request.getLyDo().trim().isEmpty()) {
            throw new RuntimeException("Vui lòng nhập lý do hủy lịch");
        }

        Lich lich = getById(id);

        if (lich.getTrangThai() == 3) {
            throw new RuntimeException("Không thể hủy lịch đã hoàn thành");
        }

        if (lich.getTrangThai() == 4) {
            throw new RuntimeException("Lịch hẹn đã bị hủy trước đó");
        }

        lich.setTrangThai(4);
        Lich lichDaHuy = lichRepository.save(lich);

        LichSuLichHen lichSu = new LichSuLichHen();
        lichSu.setLichHen(lich);
        lichSu.setNguoiThucHien(request.getNguoiThucHien());
        lichSu.setVaiTro(request.getVaiTro());
        lichSu.setHanhDong("HUY");
        lichSu.setLyDo(request.getLyDo());
        lichSu.setThoiGian(LocalDateTime.now());

        lichSuRepo.save(lichSu);

        return lichDaHuy;
    }

    @Transactional
    public Lich suaLichAdmin(Integer id, SuaLichAdminRequest request) {
        if (request.getLyDo() == null || request.getLyDo().trim().isEmpty()) {
            throw new RuntimeException("Vui lòng nhập lý do sửa lịch");
        }

        if (request.getNgayHen() == null || request.getGioHen() == null) {
            throw new RuntimeException("Ngày hẹn và giờ hẹn không được để trống");
        }

        if (request.getMaNhanVien() == null) {
            throw new RuntimeException("Vui lòng chọn nhân viên");
        }

        if (request.getDanhSachDichVu() == null || request.getDanhSachDichVu().isEmpty()) {
            throw new RuntimeException("Vui lòng chọn ít nhất một dịch vụ");
        }

        Lich lich = getById(id);

        if (lich.getTrangThai() == 3) {
            throw new RuntimeException("Không thể sửa lịch đã hoàn thành");
        }

        if (lich.getTrangThai() == 4) {
            throw new RuntimeException("Không thể sửa lịch đã hủy");
        }

        NhanVien nhanVien = nhanVienRepository.findById(request.getMaNhanVien())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

        double tongTien = 0;
        int tongThoiGian = 0;
        int buffer = lich.getThoiGianBuffer() != null ? lich.getThoiGianBuffer() : 30;

        List<DichVu> danhSachDichVu = new ArrayList<>();

        for (Integer maDichVu : request.getDanhSachDichVu()) {
            DichVu dv = dichVuRepository.findById(maDichVu)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ"));

            danhSachDichVu.add(dv);
            tongTien += dv.getGia();
            tongThoiGian += dv.getThoiGianThucHien();
        }

        LocalTime gioBatDauMoi = request.getGioHen();
        LocalTime gioKetThucMoi = gioBatDauMoi.plusMinutes(tongThoiGian + buffer);

        kiemTraTrungLichKhiSua(
                id,
                nhanVien.getMaNhanVien(),
                request.getNgayHen(),
                gioBatDauMoi,
                gioKetThucMoi
        );

        lich.setNhanVien(nhanVien);
        lich.setNgayHen(request.getNgayHen());
        lich.setGioHen(gioBatDauMoi);
        lich.setGioKetThucDuKien(gioKetThucMoi);
        lich.setTongTien(tongTien);
        lich.setTongThoiGian(tongThoiGian);
        lich.setThoiGianBuffer(buffer);

        Lich lichDaSua = lichRepository.save(lich);

        chiTietRepository.deleteByLich_Id(id);

        for (DichVu dv : danhSachDichVu) {
            ChiTietLichHen ct = new ChiTietLichHen();

            ct.setLich(lichDaSua);
            ct.setDichVu(dv);
            ct.setNhanVien(nhanVien);
            ct.setDonGia(dv.getGia());
            ct.setThoiGian(dv.getThoiGianThucHien());

            chiTietRepository.save(ct);
        }

        LichSuLichHen lichSu = new LichSuLichHen();
        lichSu.setLichHen(lichDaSua);
        lichSu.setNguoiThucHien(request.getNguoiThucHien());
        lichSu.setVaiTro(request.getVaiTro());
        lichSu.setHanhDong("SUA");
        lichSu.setLyDo(request.getLyDo());
        lichSu.setThoiGian(LocalDateTime.now());

        lichSuRepo.save(lichSu);

        return lichDaSua;
    }

    private void kiemTraTrungLichKhiSua(
            Integer lichIdDangSua,
            Integer maNhanVien,
            LocalDate ngayHen,
            LocalTime gioBatDauMoi,
            LocalTime gioKetThucMoi
    ) {
        List<Lich> lichTrongNgay = lichRepository.findByNhanVienAndNgayHen(
                maNhanVien,
                ngayHen
        );

        for (Lich lichCu : lichTrongNgay) {
            if (lichCu.getId().equals(lichIdDangSua)) {
                continue;
            }

            if (lichCu.getTrangThai() == 4) {
                continue;
            }

            boolean biTrung =
                    gioBatDauMoi.isBefore(lichCu.getGioKetThucDuKien())
                            &&
                    gioKetThucMoi.isAfter(lichCu.getGioHen());

            if (biTrung) {
                throw new RuntimeException("Nhân viên đã có lịch trong khung giờ này");
            }
        }
    }

    public List<LichSuLichHen> getLichSu(Integer lichId) {
        return lichSuRepo.findByLichHen_IdOrderByThoiGianDesc(lichId);
    }

    public Lich adminTaoLich(AdminTaoLichRequest request) {
        if (request.getTenKhach() == null || request.getTenKhach().trim().isEmpty()) {
            throw new RuntimeException("Vui lòng nhập tên khách hàng");
        }

        if (request.getSdtKhach() == null || request.getSdtKhach().trim().isEmpty()) {
            throw new RuntimeException("Vui lòng nhập số điện thoại khách hàng");
        }

        if (request.getDanhSachDichVu() == null || request.getDanhSachDichVu().isEmpty()) {
            throw new RuntimeException("Vui lòng chọn ít nhất một dịch vụ");
        }

        if (request.getNgayHen() == null || request.getGioHen() == null) {
            throw new RuntimeException("Vui lòng chọn ngày và giờ hẹn");
        }

        KhachHang khachHang = khachHangRepository.findBySdt(request.getSdtKhach())
                .orElseGet(() -> {
                    KhachHang kh = new KhachHang();
                    kh.setHoTen(request.getTenKhach());
                    kh.setSdt(request.getSdtKhach());
                    return khachHangRepository.save(kh);
                });

        double tongTien = 0;
        int tongThoiGian = 0;
        int buffer = 30;

        List<DichVu> danhSachDichVu = new ArrayList<>();

        for (Integer maDichVu : request.getDanhSachDichVu()) {
            DichVu dv = dichVuRepository.findById(maDichVu)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ"));

            danhSachDichVu.add(dv);
            tongTien += dv.getGia();
            tongThoiGian += dv.getThoiGianThucHien();
        }

        LocalTime gioBatDauMoi = request.getGioHen();
        LocalTime gioKetThucMoi = gioBatDauMoi.plusMinutes(tongThoiGian + buffer);

        NhanVien nhanVien = nhanVienRepository.findById(request.getMaNhanVien())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

        kiemTraTrungLich(
                nhanVien.getMaNhanVien(),
                request.getNgayHen(),
                gioBatDauMoi,
                gioKetThucMoi
        );

        Lich lich = new Lich();

        lich.setKhachHang(khachHang);
        lich.setNhanVien(nhanVien);
        lich.setNgayHen(request.getNgayHen());
        lich.setGioHen(gioBatDauMoi);
        lich.setGioKetThucDuKien(gioKetThucMoi);
        lich.setTongTien(tongTien);
        lich.setTongThoiGian(tongThoiGian);
        lich.setThoiGianBuffer(buffer);
        lich.setTrangThai(1);
        lich.setNguonDat("ADMIN");
        lich.setNguoiTao(request.getNguoiTao());
        lich.setGhiChu(request.getGhiChu());

        lich = lichRepository.save(lich);

        for (DichVu dv : danhSachDichVu) {
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
}