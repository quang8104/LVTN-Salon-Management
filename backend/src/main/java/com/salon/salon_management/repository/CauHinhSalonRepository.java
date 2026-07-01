package com.salon.salon_management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.salon.salon_management.entity.CauHinhSalon;

@Repository
public interface CauHinhSalonRepository extends JpaRepository<CauHinhSalon, Integer> {
    Optional<CauHinhSalon> findFirstByTrangThai(Integer trangThai);
}