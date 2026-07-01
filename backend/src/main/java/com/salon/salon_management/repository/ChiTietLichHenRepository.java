package com.salon.salon_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.salon.salon_management.entity.ChiTietLichHen;
import com.salon.salon_management.entity.ChiTietLichHenId;

public interface ChiTietLichHenRepository
        extends JpaRepository<ChiTietLichHen, ChiTietLichHenId>{

    List<ChiTietLichHen> findByLich_Id(Integer maLichHen);

    void deleteByLich_Id(Integer lichId);

}