package com.za.testexe.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Table(name = "stipendio")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class StipendioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idStipendio;
    private BigDecimal stipendio;
    private LocalDate dataInizio;
    private LocalDate dataFine;
    private Integer nrSettimane;
}
