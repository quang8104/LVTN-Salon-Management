package com.salon.salon_management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.salon.salon_management.entity.DichVu;
import com.salon.salon_management.service.DichVuService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;



@RestController
@RequestMapping("/api/dichvu")
public class DichVuController {
    private final DichVuService service;
    public DichVuController(DichVuService service){
        this.service = service;
    }

    @GetMapping
    public List<DichVu> getAll(){
        return service.getAll();
    }

    @GetMapping("/{id}")
    public DichVu getById(@PathVariable Integer id){
        return service.getByID(id);
    }

    @PostMapping
    public DichVu create(@RequestBody DichVu dv) {   
        return service.create(dv);
    }
    
    @PutMapping("/{id}")
    public DichVu update(@PathVariable Integer id, @RequestBody DichVu data) {
        return service.update(id, data);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id){
        return service.delete(id);
    }
}
