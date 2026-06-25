package com.salon.salon_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.salon.salon_management.dto.TopDichVuDTO;
import com.salon.salon_management.entity.ChiTietLichHen;
import java.util.List;


public interface ChiTietLichHenRepository extends 
    JpaRepository<ChiTietLichHen, Integer> {

        List<ChiTietLichHen> findByLichHen_Id(Integer id);

        boolean existsByLichHen_IdAndDichVu_MaDichVu(Integer maLichHen,Integer maDichVu);

        @Query("""
        SELECT new com.salon.salon_management.dto.TopDichVuDTO(
            c.dichVu.tenDichVu,
            COUNT(c)
        )
        FROM ChiTietLichHen c
        GROUP BY c.dichVu.tenDichVu
        ORDER BY COUNT(c) DESC
        """)
        List<TopDichVuDTO> topDichVu();
}
