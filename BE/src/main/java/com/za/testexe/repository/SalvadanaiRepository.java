package com.za.testexe.repository;

import com.za.testexe.model.entity.SalvadanaiEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalvadanaiRepository extends JpaRepository<SalvadanaiEntity, Integer> {
    List<SalvadanaiEntity> findByAttivoTrue();
}
