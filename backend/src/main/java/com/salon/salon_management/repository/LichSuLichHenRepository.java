package com.salon.salon_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.salon.salon_management.entity.LichSuLichHen;

@Repository
public interface LichSuLichHenRepository extends JpaRepository<LichSuLichHen, Long> {
    List<LichSuLichHen> findByLichHen_IdOrderByThoiGianDesc(Integer lichId);
}
