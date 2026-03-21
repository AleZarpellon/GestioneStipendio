package com.za.testexe.repository;

import com.za.testexe.model.entity.RisparmioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RisparmioRepository extends JpaRepository<RisparmioEntity, Integer> {
}
