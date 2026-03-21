package com.za.testexe.repository;

import com.za.testexe.model.entity.SpeseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpeseRepository extends JpaRepository<SpeseEntity, Integer> {
}
