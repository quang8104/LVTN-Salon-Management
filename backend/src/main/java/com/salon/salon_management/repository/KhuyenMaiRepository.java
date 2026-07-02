package com.salon.salon_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.salon.salon_management.entity.KhuyenMai;

@Repository
public interface KhuyenMaiRepository extends JpaRepository<KhuyenMai, Integer> {
}