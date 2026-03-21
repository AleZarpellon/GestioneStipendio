package com.za.testexe.model.dto.response.salvadanai;

import java.math.BigDecimal;

public record SalvadanaiResponse(
        Integer idSalvadanaio,
        String descrizione,
        BigDecimal euro,
        BigDecimal quotaFinale,
        BigDecimal euroAccumulati,
        Boolean attivo
) {}
