package com.salon.salon_management.controller;

import org.springframework.web.bind.annotation.*;

import com.salon.salon_management.dto.BookingFilterRequest;
import com.salon.salon_management.dto.BookingFilterResponse;
import com.salon.salon_management.service.BookingService;

@RestController
@RequestMapping("/api/booking")
public class BookingController {

    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    @PostMapping("/filter")
    public BookingFilterResponse filter(
            @RequestBody BookingFilterRequest request){

        return service.filter(request);

    }

}