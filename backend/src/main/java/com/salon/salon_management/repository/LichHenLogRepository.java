package com.salon.salon_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.salon.salon_management.entity.LichHenLog;

public interface LichHenLogRepository 
        extends JpaRepository<LichHenLog, Integer> {

            List<LichHenLog> findByMaLichHen(
            Integer maLichHen);
    
} 
