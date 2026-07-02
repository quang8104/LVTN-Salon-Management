package com.salon.salon_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.salon.salon_management.dto.DichVuKhuyenMaiDTO;
import com.salon.salon_management.entity.DanhMucDichVu;
import com.salon.salon_management.entity.DichVu;
import com.salon.salon_management.repository.DanhMucDichVuRepository;
import com.salon.salon_management.repository.DichVuRepository;

@Service
public class DichVuService {

    private final DichVuRepository repository;
    private final DanhMucDichVuRepository danhMucRepository;
    private final KhuyenMaiApDungService khuyenMaiApDungService;

    public DichVuService(
            DichVuRepository repository,
            DanhMucDichVuRepository danhMucRepository,
            KhuyenMaiApDungService khuyenMaiApDungService
    ) {
        this.repository = repository;
        this.danhMucRepository = danhMucRepository;
        this.khuyenMaiApDungService = khuyenMaiApDungService;
    }

    private DichVuKhuyenMaiDTO toKhuyenMaiDTO(DichVu dv) {
        Integer phanTramGiam = khuyenMaiApDungService
                .layPhanTramGiamDichVu(dv.getMaDichVu());

        Double giaSauGiam = khuyenMaiApDungService
                .tinhGiaSauGiam(dv.getGia(), phanTramGiam);

        DichVuKhuyenMaiDTO dto = new DichVuKhuyenMaiDTO();

        dto.setMaDichVu(dv.getMaDichVu());
        dto.setTenDichVu(dv.getTenDichVu());
        dto.setMoTa(dv.getMoTa());
        dto.setGia(dv.getGia());
        dto.setGiaSauGiam(giaSauGiam);
        dto.setPhanTramGiam(phanTramGiam);
        dto.setThoiGianThucHien(dv.getThoiGianThucHien());
        dto.setAnhGioiThieu(dv.getAnhGioiThieu());
        dto.setTrangThai(dv.getTrangThai());
        dto.setGioiTinhApDung(dv.getGioiTinhApDung());
        if (dv.getDanhMucDichVu() != null) {
            dto.setMaDanhMucDichVu(dv.getDanhMucDichVu().getMaDanhMucDichVu());
            dto.setTenDanhMucDichVu(dv.getDanhMucDichVu().getTenDanhMuc());
        }

        return dto;
    }

    public List<DichVuKhuyenMaiDTO> getAllWithKhuyenMai() {
        return repository.findAll()
                .stream()
                .map(this::toKhuyenMaiDTO)
                .toList();
    }

    public List<DichVu> getAll() {
        return repository.findAll();
    }

    public DichVu getByID(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ"));
    }

    public DichVu create(DichVu dv) {
        validate(dv);

        dv.setTrangThai(dv.getTrangThai() == null ? 1 : dv.getTrangThai());
        dv.setGioiTinhApDung(dv.getGioiTinhApDung() == null ? 0 : dv.getGioiTinhApDung());

        ganDanhMuc(dv);

        return repository.save(dv);
    }

    public DichVu update(Integer id, DichVu data) {
        validate(data);

        DichVu dv = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ"));

        dv.setTenDichVu(data.getTenDichVu());
        dv.setMoTa(data.getMoTa());
        dv.setGia(data.getGia());
        dv.setThoiGianThucHien(data.getThoiGianThucHien());
        dv.setAnhGioiThieu(data.getAnhGioiThieu());
        dv.setTrangThai(data.getTrangThai() == null ? 1 : data.getTrangThai());
        dv.setGioiTinhApDung(data.getGioiTinhApDung() == null ? 0 : data.getGioiTinhApDung());
        dv.setDanhMucDichVu(data.getDanhMucDichVu());

        ganDanhMuc(dv);

        return repository.save(dv);
    }

    private void validate(DichVu dv) {
        if (dv.getTenDichVu() == null || dv.getTenDichVu().trim().isEmpty()) {
            throw new RuntimeException("Tên dịch vụ không được để trống");
        }

        if (dv.getGia() == null || dv.getGia() < 0) {
            throw new RuntimeException("Giá dịch vụ không hợp lệ");
        }

        if (dv.getThoiGianThucHien() == null || dv.getThoiGianThucHien() <= 0) {
            throw new RuntimeException("Thời gian thực hiện phải lớn hơn 0");
        }

        Integer gioiTinh = dv.getGioiTinhApDung();

        if (gioiTinh != null && gioiTinh != 0 && gioiTinh != 1 && gioiTinh != 2) {
            throw new RuntimeException("Giới tính áp dụng không hợp lệ");
        }
    }

    private void ganDanhMuc(DichVu dv) {
        if (dv.getDanhMucDichVu() != null
                && dv.getDanhMucDichVu().getMaDanhMucDichVu() != null) {

            DanhMucDichVu dm = danhMucRepository
                    .findById(dv.getDanhMucDichVu().getMaDanhMucDichVu())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục dịch vụ"));

            dv.setDanhMucDichVu(dm);
        }
    }

    public String delete(Integer id) {
        DichVu dv = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ"));

        dv.setTrangThai(0);
        repository.save(dv);

        return "Xóa dịch vụ thành công";
    }
}