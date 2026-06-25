package com.salon.salon_management.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.salon.salon_management.entity.NghiPhep;
import com.salon.salon_management.service.NghiPhepService;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/nghiphep")
public class NghiPhepController {
    private final NghiPhepService service;

    public NghiPhepController(NghiPhepService service) {
        this.service = service;
    }

    @GetMapping
    public List<NghiPhep> getAll() {
        return service.getAll();
    }

    @PostMapping
    public NghiPhep create(@RequestBody NghiPhep np) {
        return service.create(np);
    }
    
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
