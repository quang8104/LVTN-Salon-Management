package com.salon.salon_management.dto;

import java.time.LocalTime;
import java.util.List;

import com.salon.salon_management.entity.DichVu;
import com.salon.salon_management.entity.NhanVien;

public class BookingFilterResponse {

    private List<DichVu> services;

    private List<NhanVien> employees;

    private List<LocalTime> availableTimeSlots;

    private List<String> warnings;

    private List<TimeSlotDTO> availableSlots;

    public List<DichVu> getServices() {
        return services;
    }

    public void setServices(List<DichVu> services) {
        this.services = services;
    }

    public List<NhanVien> getEmployees() {
        return employees;
    }

    public void setEmployees(List<NhanVien> employees) {
        this.employees = employees;
    }

    public List<LocalTime> getAvailableTimeSlots() {
        return availableTimeSlots;
    }

    public void setAvailableTimeSlots(List<LocalTime> availableTimeSlots) {
        this.availableTimeSlots = availableTimeSlots;
    }

    public List<String> getWarnings() {
        return warnings;
    }

    public void setWarnings(List<String> warnings) {
        this.warnings = warnings;
    }

    public List<TimeSlotDTO> getAvailableSlots() {
        return availableSlots;
    }

    public void setAvailableSlots(List<TimeSlotDTO> availableSlots) {
        this.availableSlots = availableSlots;
    }

    
}