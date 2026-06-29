package com.salon.salon_management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.salon.salon_management.dto.SanPhamRequest;
import com.salon.salon_management.entity.DanhMuc;
import com.salon.salon_management.entity.SanPham;
import com.salon.salon_management.repository.ChiTietDonHangRepository;
import com.salon.salon_management.repository.DanhMucRepository;
import com.salon.salon_management.repository.SanPhamRepository;

@Service
public class SanPhamService {
    private final SanPhamRepository repository;
    private final DanhMucRepository danhMucRepository;
    private final ChiTietDonHangRepository chiTietDonHangRepository;

    public SanPhamService(
            SanPhamRepository repository,
            DanhMucRepository danhMucRepository,
            ChiTietDonHangRepository chiTietDonHangRepository) {
        this.repository = repository;
        this.danhMucRepository = danhMucRepository;
        this.chiTietDonHangRepository = chiTietDonHangRepository;
    }

    public List<SanPham> getAll() {
        return repository.findAll();
    }

    public List<SanPham> getTop5() {
        return repository.findTop5ByTrangThaiOrderByMaSanPhamDesc(1);
    }

    public SanPham getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
    }

    public SanPham create(SanPhamRequest request) {
        SanPham sp = new SanPham();
        setData(sp, request);
        return repository.save(sp);
    }

    public SanPham update(Integer id, SanPhamRequest request) {
        SanPham old = getById(id);
        setData(old, request);
        return repository.save(old);
    }

    private void setData(SanPham sp, SanPhamRequest request) {
        if (request.getTenSanPham() == null || request.getTenSanPham().trim().isEmpty()) {
            throw new RuntimeException("Tên sản phẩm không được để trống");
        }

        if (request.getGia() == null || request.getGia() < 0) {
            throw new RuntimeException("Giá sản phẩm không hợp lệ");
        }

        if (request.getSoLuongTon() == null || request.getSoLuongTon() < 0) {
            throw new RuntimeException("Số lượng tồn không hợp lệ");
        }

        sp.setTenSanPham(request.getTenSanPham());
        sp.setMoTa(request.getMoTa());
        sp.setGia(request.getGia());
        sp.setHinhAnh(request.getHinhAnh());
        sp.setTrangThai(request.getTrangThai() == null ? 1 : request.getTrangThai());
        sp.setSoLuongTon(request.getSoLuongTon());

        if (request.getMaDanhMuc() != null) {
            DanhMuc danhMuc = danhMucRepository.findById(request.getMaDanhMuc())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục"));

            sp.setDanhMuc(danhMuc);
        } else {
            sp.setDanhMuc(null);
        }
    }

    public String delete(Integer id) {
        SanPham sp = getById(id);

        boolean daTungNamTrongDonHang =
                chiTietDonHangRepository.existsBySanPham_MaSanPham(id);

        if (daTungNamTrongDonHang) {
            sp.setTrangThai(0);
            repository.save(sp);

            return "Sản phẩm đang nằm trong đơn hàng nên không thể xóa. Hệ thống đã chuyển sản phẩm sang trạng thái ngừng hoạt động.";
        }

        repository.delete(sp);
        return "Xóa sản phẩm thành công";
    }

    public List<SanPham> search(String keyword) {
        return repository.findByTenSanPhamContaining(keyword);
    }
}