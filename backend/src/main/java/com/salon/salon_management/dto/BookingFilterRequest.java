package com.salon.salon_management.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class BookingFilterRequest {

    private List<Integer> selectedServices;

    private Integer employeeId;

    private LocalDate date;

    private LocalTime time;

    public List<Integer> getSelectedServices() {
        return selectedServices;
    }

    public void setSelectedServices(List<Integer> selectedServices) {
        this.selectedServices = selectedServices;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }
}