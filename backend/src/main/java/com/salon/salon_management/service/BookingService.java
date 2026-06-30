package com.salon.salon_management.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalTime;
import java.util.Comparator;

import org.springframework.stereotype.Service;

import com.salon.salon_management.dto.BookingFilterRequest;
import com.salon.salon_management.dto.BookingFilterResponse;
import com.salon.salon_management.dto.TimeSlotDTO;
import com.salon.salon_management.entity.DichVu;
import com.salon.salon_management.entity.NhanVien;
import com.salon.salon_management.repository.ChiTietNvdvRepository;
import com.salon.salon_management.repository.DichVuRepository;
import com.salon.salon_management.repository.LichRepository;
import com.salon.salon_management.entity.Lich;

@Service
public class BookingService {

    private final ChiTietNvdvRepository chiTietNvdvRepository;
    
    private final LichRepository lichRepository;

    private final DichVuRepository dichVuRepository;



       

    public BookingService(ChiTietNvdvRepository chiTietNvdvRepository, LichRepository lichRepository,
            DichVuRepository dichVuRepository) {
        this.chiTietNvdvRepository = chiTietNvdvRepository;
        this.lichRepository = lichRepository;
        this.dichVuRepository = dichVuRepository;
    }

    private Integer calculateDuration(List<Integer> services) {
        if (services == null || services.isEmpty()) {
            return 0;
        }

        int total = 0;

        for (Integer id : services) {
            DichVu dv = dichVuRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ"));

            total += dv.getThoiGianThucHien();
        }

        return total + 30; // buffer 30 phút
    }

    private List<TimeSlotDTO> findAvailableSlots(Integer maNhanVien,LocalDate ngay, Integer duration) {

        List<TimeSlotDTO> result = new ArrayList<>();

        if (maNhanVien == null || ngay == null || duration == null || duration <= 0) {
            return result;
        }

        LocalTime open = LocalTime.of(8, 0);
        LocalTime close = LocalTime.of(20, 0);

        List<Lich> lichTrongNgay = lichRepository.findByNhanVienAndNgayHen(
                maNhanVien,
                ngay
        );

        lichTrongNgay.sort(
                Comparator.comparing(Lich::getGioHen)
        );

        LocalTime freeStart = open;

        for (Lich lich : lichTrongNgay) {
            LocalTime busyStart = lich.getGioHen();
            LocalTime busyEnd = lich.getGioKetThucDuKien();

            addSlotsInFreeRange(result, freeStart, busyStart, duration);

            if (busyEnd.isAfter(freeStart)) {
                freeStart = busyEnd;
            }
        }

        addSlotsInFreeRange(result, freeStart, close, duration);

        return result;
    }

    private void addSlotsInFreeRange(List<TimeSlotDTO> result,LocalTime freeStart,LocalTime freeEnd,Integer duration) {

        LocalTime current = freeStart;

        while (!current.plusMinutes(duration).isAfter(freeEnd)) {
            result.add(
                    new TimeSlotDTO(
                            current,
                            current.plusMinutes(duration)
                    )
            );

            current = current.plusMinutes(30);
        }
    }

    private List<NhanVien> findEmployees(List<Integer> services){

        if(services==null || services.isEmpty()){
            return new ArrayList<>();
        }

        return chiTietNvdvRepository.findNhanVienByAllServices(
                services,
                (long)services.size());
    }

    public BookingFilterResponse filter(BookingFilterRequest request) {

        BookingFilterResponse response = new BookingFilterResponse();

        response.setWarnings(new ArrayList<>());

        List<NhanVien> employees = findEmployees(request.getSelectedServices());

        response.setEmployees(employees);

        if (request.getEmployeeId() != null && request.getDate() != null) {
            Integer duration = calculateDuration(request.getSelectedServices());

            response.setAvailableSlots(
                    findAvailableSlots(
                            request.getEmployeeId(),
                            request.getDate(),
                            duration
                    )
            );
        }

        return response;
    }
        
}