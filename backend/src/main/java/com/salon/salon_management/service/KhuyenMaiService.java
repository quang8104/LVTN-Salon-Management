package com.salon.salon_management.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.salon.salon_management.dto.KhuyenMaiRequest;
import com.salon.salon_management.entity.DichVu;
import com.salon.salon_management.entity.KhuyenMai;
import com.salon.salon_management.entity.KhuyenMaiChiTiet;
import com.salon.salon_management.entity.SanPham;
import com.salon.salon_management.repository.DichVuRepository;
import com.salon.salon_management.repository.KhuyenMaiChiTietRepository;
import com.salon.salon_management.repository.KhuyenMaiRepository;
import com.salon.salon_management.repository.SanPhamRepository;

@Service
public class KhuyenMaiService {

    private final KhuyenMaiRepository khuyenMaiRepository;
    private final KhuyenMaiChiTietRepository chiTietRepository;
    private final SanPhamRepository sanPhamRepository;
    private final DichVuRepository dichVuRepository;

    public KhuyenMaiService(
            KhuyenMaiRepository khuyenMaiRepository,
            KhuyenMaiChiTietRepository chiTietRepository,
            SanPhamRepository sanPhamRepository,
            DichVuRepository dichVuRepository
    ) {
        this.khuyenMaiRepository = khuyenMaiRepository;
        this.chiTietRepository = chiTietRepository;
        this.sanPhamRepository = sanPhamRepository;
        this.dichVuRepository = dichVuRepository;
    }

    public List<KhuyenMai> getAll() {
        return khuyenMaiRepository.findAll();
    }

    public KhuyenMai getById(Integer id) {
        return khuyenMaiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khuyến mãi"));
    }

    public List<KhuyenMaiChiTiet> getChiTiet(Integer id) {
        return chiTietRepository.findByKhuyenMai_MaKhuyenMai(id);
    }

    @Transactional
    public KhuyenMai create(KhuyenMaiRequest request) {
        validate(request);

        KhuyenMai km = new KhuyenMai();
        km.setTenKhuyenMai(request.getTenKhuyenMai());
        km.setMoTa(request.getMoTa());
        km.setPhanTramGiam(request.getPhanTramGiam());
        km.setNgayBatDau(request.getNgayBatDau());
        km.setNgayKetThuc(request.getNgayKetThuc());
        km.setTrangThai(request.getTrangThai() == null ? 1 : request.getTrangThai());

        km = khuyenMaiRepository.save(km);

        saveChiTiet(km, request);

        return km;
    }

    @Transactional
    public KhuyenMai update(Integer id, KhuyenMaiRequest request) {
        validate(request);

        KhuyenMai km = getById(id);

        km.setTenKhuyenMai(request.getTenKhuyenMai());
        km.setMoTa(request.getMoTa());
        km.setPhanTramGiam(request.getPhanTramGiam());
        km.setNgayBatDau(request.getNgayBatDau());
        km.setNgayKetThuc(request.getNgayKetThuc());
        km.setTrangThai(request.getTrangThai() == null ? 1 : request.getTrangThai());

        km = khuyenMaiRepository.save(km);

        chiTietRepository.deleteByKhuyenMai_MaKhuyenMai(id);
        saveChiTiet(km, request);

        return km;
    }

    public void delete(Integer id) {
        KhuyenMai km = getById(id);
        km.setTrangThai(0);
        khuyenMaiRepository.save(km);
    }

    private void validate(KhuyenMaiRequest request) {
        if (request.getTenKhuyenMai() == null || request.getTenKhuyenMai().trim().isEmpty()) {
            throw new RuntimeException("Vui lòng nhập tên khuyến mãi");
        }

        if (request.getPhanTramGiam() == null
                || request.getPhanTramGiam() <= 0
                || request.getPhanTramGiam() > 100) {
            throw new RuntimeException("Phần trăm giảm phải từ 1 đến 100");
        }

        if (request.getNgayBatDau() == null || request.getNgayKetThuc() == null) {
            throw new RuntimeException("Vui lòng chọn ngày bắt đầu và ngày kết thúc");
        }

        if (request.getNgayKetThuc().isBefore(request.getNgayBatDau())) {
            throw new RuntimeException("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu");
        }

        boolean hasSanPham = request.getSanPhamIds() != null && !request.getSanPhamIds().isEmpty();
        boolean hasDichVu = request.getDichVuIds() != null && !request.getDichVuIds().isEmpty();

        if (!hasSanPham && !hasDichVu) {
            throw new RuntimeException("Vui lòng chọn ít nhất một sản phẩm hoặc một dịch vụ");
        }
    }

    private void saveChiTiet(KhuyenMai km, KhuyenMaiRequest request) {
        if (request.getSanPhamIds() != null) {
            for (Integer maSanPham : request.getSanPhamIds()) {
                SanPham sp = sanPhamRepository.findById(maSanPham)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

                KhuyenMaiChiTiet ct = new KhuyenMaiChiTiet();
                ct.setKhuyenMai(km);
                ct.setLoaiApDung(1);
                ct.setSanPham(sp);
                ct.setDichVu(null);

                chiTietRepository.save(ct);
            }
        }

        if (request.getDichVuIds() != null) {
            for (Integer maDichVu : request.getDichVuIds()) {
                DichVu dv = dichVuRepository.findById(maDichVu)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ"));

                KhuyenMaiChiTiet ct = new KhuyenMaiChiTiet();
                ct.setKhuyenMai(km);
                ct.setLoaiApDung(2);
                ct.setSanPham(null);
                ct.setDichVu(dv);

                chiTietRepository.save(ct);
            }
        }
    }
}