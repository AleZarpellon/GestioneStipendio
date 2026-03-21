package com.za.testexe.repository;

import com.za.testexe.model.entity.StipendioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StipendioRepository extends JpaRepository<StipendioEntity, Integer> {
}
