package com.salon.salon_management.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import com.salon.salon_management.dto.BookingFilterRequest;
import com.salon.salon_management.dto.BookingFilterResponse;
import com.salon.salon_management.dto.TimeSlotDTO;
import com.salon.salon_management.entity.CauHinhSalon;
import com.salon.salon_management.entity.DichVu;
import com.salon.salon_management.entity.Lich;
import com.salon.salon_management.entity.NhanVien;
import com.salon.salon_management.repository.DichVuRepository;
import com.salon.salon_management.repository.LichRepository;
import com.salon.salon_management.repository.NghiPhepNhanVienRepository;
import com.salon.salon_management.repository.NhanVienRepository;

@Service
public class BookingService {

    private final LichRepository lichRepository;
    private final DichVuRepository dichVuRepository;
    private final NhanVienRepository nhanVienRepository;
    private final CauHinhSalonService cauHinhSalonService;
    private final NghiPhepNhanVienRepository nghiPhepRepository;

    public BookingService(
            LichRepository lichRepository,
            DichVuRepository dichVuRepository,
            NhanVienRepository nhanVienRepository,
            CauHinhSalonService cauHinhSalonService,
            NghiPhepNhanVienRepository nghiPhepRepository
    ) {
        this.lichRepository = lichRepository;
        this.dichVuRepository = dichVuRepository;
        this.nhanVienRepository = nhanVienRepository;
        this.cauHinhSalonService = cauHinhSalonService;
        this.nghiPhepRepository = nghiPhepRepository;
    }

    private boolean nhanVienDangNghi(Integer maNhanVien, LocalDate ngay) {
        return nghiPhepRepository
                .existsByNhanVien_MaNhanVienAndTrangThaiAndNgayBatDauLessThanEqualAndNgayKetThucGreaterThanEqual(
                        maNhanVien,
                        1,
                        ngay,
                        ngay
                );
    }

    private List<NhanVien> findEmployees(LocalDate ngay) {
        List<NhanVien> employees = nhanVienRepository.findByTrangThaiAndVaiTro(
                1,
                "NHAN_VIEN"
        );

        if (ngay == null) {
            return employees;
        }

        employees.removeIf(nv -> nhanVienDangNghi(nv.getMaNhanVien(), ngay));

        return employees;
    }

    private Integer calculateDuration(List<Integer> services, CauHinhSalon cauHinh) {
        if (services == null || services.isEmpty()) {
            return 0;
        }

        int total = 0;

        for (Integer id : services) {
            DichVu dv = dichVuRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ"));

            total += dv.getThoiGianThucHien();
        }

        return total + cauHinh.getBufferPhut();
    }

    private List<TimeSlotDTO> findAvailableSlotsForAnyEmployee(
            LocalDate ngay,
            Integer duration,
            CauHinhSalon cauHinh
    ) {
        List<TimeSlotDTO> result = new ArrayList<>();
        List<NhanVien> employees = findEmployees(ngay);

        for (NhanVien nv : employees) {
            List<TimeSlotDTO> slots = findAvailableSlots(
                    nv.getMaNhanVien(),
                    ngay,
                    duration,
                    cauHinh
            );

            for (TimeSlotDTO slot : slots) {
                boolean existed = result.stream()
                        .anyMatch(s -> s.getStart().equals(slot.getStart()));

                if (!existed) {
                    result.add(slot);
                }
            }
        }

        result.sort(Comparator.comparing(TimeSlotDTO::getStart));
        return result;
    }

    private List<TimeSlotDTO> findAvailableSlots(
            Integer maNhanVien,
            LocalDate ngay,
            Integer duration,
            CauHinhSalon cauHinh
    ) {
        List<TimeSlotDTO> result = new ArrayList<>();

        if (maNhanVien == null || ngay == null || duration == null || duration <= 0) {
            return result;
        }

        if (nhanVienDangNghi(maNhanVien, ngay)) {
            return result;
        }

        LocalTime open = cauHinh.getGioMoCua();
        LocalTime close = cauHinh.getGioDongCua();

        if (open == null || close == null || !open.isBefore(close)) {
            return result;
        }

        List<Lich> lichTrongNgay = lichRepository.findByNhanVienAndNgayHen(
                maNhanVien,
                ngay
        );

        lichTrongNgay.removeIf(lich -> lich.getTrangThai() == 4);
        lichTrongNgay.sort(Comparator.comparing(Lich::getGioHen));

        LocalTime freeStart = open;

        for (Lich lich : lichTrongNgay) {
            LocalTime busyStart = lich.getGioHen();
            LocalTime busyEnd = lich.getGioKetThucDuKien();

            addSlotsInFreeRange(
                    result,
                    freeStart,
                    busyStart,
                    duration,
                    cauHinh.getBuocSlot()
            );

            if (busyEnd != null && busyEnd.isAfter(freeStart)) {
                freeStart = busyEnd;
            }
        }

        addSlotsInFreeRange(
                result,
                freeStart,
                close,
                duration,
                cauHinh.getBuocSlot()
        );

        return result;
    }

    private void addSlotsInFreeRange(
            List<TimeSlotDTO> result,
            LocalTime freeStart,
            LocalTime freeEnd,
            Integer duration,
            Integer buocSlot
    ) {
        if (freeStart == null || freeEnd == null || !freeStart.isBefore(freeEnd)) {
            return;
        }

        if (buocSlot == null || buocSlot <= 0) {
            return;
        }

        LocalTime current = freeStart;

        while (!current.plusMinutes(duration).isAfter(freeEnd)) {
            result.add(new TimeSlotDTO(
                    current,
                    current.plusMinutes(duration)
            ));

            current = current.plusMinutes(buocSlot);
        }
    }

    public BookingFilterResponse filter(BookingFilterRequest request) {
        BookingFilterResponse response = new BookingFilterResponse();
        response.setWarnings(new ArrayList<>());

        CauHinhSalon cauHinh = cauHinhSalonService.getCauHinhDangDung();

        List<NhanVien> employees = findEmployees(request.getDate());
        response.setEmployees(employees);

        if (request.getDate() != null
                && request.getSelectedServices() != null
                && !request.getSelectedServices().isEmpty()) {

            Integer duration = calculateDuration(
                    request.getSelectedServices(),
                    cauHinh
            );

            if (request.getEmployeeId() != null) {
                response.setAvailableSlots(
                        findAvailableSlots(
                                request.getEmployeeId(),
                                request.getDate(),
                                duration,
                                cauHinh
                        )
                );
            } else {
                response.setAvailableSlots(
                        findAvailableSlotsForAnyEmployee(
                                request.getDate(),
                                duration,
                                cauHinh
                        )
                );
            }
        }

        return response;
    }
}