package com.salon.salon_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.salon.salon_management.dto.NghiPhepNhanVienRequest;
import com.salon.salon_management.entity.Lich;
import com.salon.salon_management.entity.NghiPhepNhanVien;
import com.salon.salon_management.entity.NhanVien;
import com.salon.salon_management.repository.LichRepository;
import com.salon.salon_management.repository.NghiPhepNhanVienRepository;
import com.salon.salon_management.repository.NhanVienRepository;

@Service
public class NghiPhepNhanVienService {

    private final NghiPhepNhanVienRepository nghiPhepRepository;
    private final NhanVienRepository nhanVienRepository;
    private final LichRepository lichRepository;

    public NghiPhepNhanVienService(
            NghiPhepNhanVienRepository nghiPhepRepository,
            NhanVienRepository nhanVienRepository,
            LichRepository lichRepository
    ) {
        this.nghiPhepRepository = nghiPhepRepository;
        this.nhanVienRepository = nhanVienRepository;
        this.lichRepository = lichRepository;
    }

    public List<NghiPhepNhanVien> getAll() {
        return nghiPhepRepository.findByTrangThaiOrderByNgayBatDauDesc(1);
    }

    public NghiPhepNhanVien create(NghiPhepNhanVienRequest request) {
        if (request.getMaNhanVien() == null) {
            throw new RuntimeException("Vui lòng chọn nhân viên");
        }

        if (request.getNgayBatDau() == null || request.getNgayKetThuc() == null) {
            throw new RuntimeException("Vui lòng chọn ngày bắt đầu và ngày kết thúc");
        }

        if (request.getNgayKetThuc().isBefore(request.getNgayBatDau())) {
            throw new RuntimeException("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu");
        }

        NhanVien nhanVien = nhanVienRepository.findById(request.getMaNhanVien())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));

        if (!"NHAN_VIEN".equals(nhanVien.getVaiTro())) {
            throw new RuntimeException("Chỉ được tạo nghỉ phép cho nhân viên");
        }

        boolean daCoNghiPhep = nghiPhepRepository
                .existsByNhanVien_MaNhanVienAndTrangThaiAndNgayBatDauLessThanEqualAndNgayKetThucGreaterThanEqual(
                        request.getMaNhanVien(),
                        1,
                        request.getNgayKetThuc(),
                        request.getNgayBatDau()
                );

        if (daCoNghiPhep) {
            throw new RuntimeException("Nhân viên đã có lịch nghỉ trong khoảng ngày này");
        }

        List<Lich> lichTrung = lichRepository
                .findByNhanVien_MaNhanVienAndNgayHenBetweenAndTrangThaiNot(
                        request.getMaNhanVien(),
                        request.getNgayBatDau(),
                        request.getNgayKetThuc(),
                        4
                );

        if (!lichTrung.isEmpty()) {
            throw new RuntimeException("Nhân viên có lịch hẹn vào ngày này, không thể nghỉ");
        }

        NghiPhepNhanVien nghiPhep = new NghiPhepNhanVien();
        nghiPhep.setNhanVien(nhanVien);
        nghiPhep.setNgayBatDau(request.getNgayBatDau());
        nghiPhep.setNgayKetThuc(request.getNgayKetThuc());
        nghiPhep.setLyDo(request.getLyDo());
        nghiPhep.setTrangThai(1);

        return nghiPhepRepository.save(nghiPhep);
    }

    public void delete(Integer id) {
        NghiPhepNhanVien nghiPhep = nghiPhepRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch nghỉ"));

        nghiPhep.setTrangThai(0);
        nghiPhepRepository.save(nghiPhep);
    }
}