package com.za.testexe.repository;

import com.za.testexe.model.entity.BudgetSettimanaleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BudgetSettimanaleRepository extends JpaRepository<BudgetSettimanaleEntity, Integer> {
}
