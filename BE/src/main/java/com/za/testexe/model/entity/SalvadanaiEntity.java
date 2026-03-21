package com.za.testexe.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Table(name = "salvadanaio")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class SalvadanaiEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSalvadanaio;
    private String descrizione;
    private BigDecimal euro;
    private BigDecimal quotaFinale;
    private BigDecimal euroAccumulati;
    private Boolean attivo = false;
}
