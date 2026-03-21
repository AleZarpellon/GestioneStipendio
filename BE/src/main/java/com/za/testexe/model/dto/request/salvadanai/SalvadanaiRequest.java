package com.za.testexe.model.dto.request.salvadanai;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record SalvadanaiRequest(
        Integer idSalvadanaio,

        @NotBlank(message = "Descrizione obbligatoria")
        String descrizione,

        @NotNull(message = "Euro obbligatorio")
        BigDecimal euro,

        BigDecimal quotaFinale,
        BigDecimal euroAccumulati,

        @NotNull(message = "Attivo obbligatorio")
        Boolean attivo
) {}
