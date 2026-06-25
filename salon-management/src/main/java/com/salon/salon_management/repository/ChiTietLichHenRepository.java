package com.salon.salon_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.salon.salon_management.entity.ChiTietLichHen;
import java.util.List;


public interface ChiTietLichHenRepository extends 
    JpaRepository<ChiTietLichHen, Integer> {

        List<ChiTietLichHen> findByLichHen_Id(Integer id);

        boolean existsByLichHen_IdAndDichVu_MaDichVu(Integer maLichHen,Integer maDichVu);
}
