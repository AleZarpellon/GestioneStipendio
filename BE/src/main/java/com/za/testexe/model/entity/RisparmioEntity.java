package com.za.testexe.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Table(name = "risparmio")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class RisparmioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idRisparmio;
    private String descrizione;
    private BigDecimal euro;
    private String periodo;
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean isTotale = false;
}
