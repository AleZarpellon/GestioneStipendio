package com.za.testexe.model.entity;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
@Table(name = "spese")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class SpeseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSpesa;
    private String descrizione;
    private BigDecimal euro;
    private BigDecimal maxValore;
    private Boolean continuative;
}

