package com.za.testexe.repository;

import com.za.testexe.model.entity.RisparmioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface RisparmioRepository extends JpaRepository<RisparmioEntity, Integer> {

    // Trova la riga totale (ne esiste una sola)
    Optional<RisparmioEntity> findByIsTotaleTrue();

    // Somma solo le righe normali, esclude il totale
    @Query("SELECT SUM(r.euro) FROM RisparmioEntity r WHERE r.isTotale = false")
    BigDecimal sumEuroWhereNotTotale();
}
