package com.za.testexe.model.dto.request.stipendio;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record StipendioRequest(
        Integer idStipendio,

        @NotNull(message = "Stipendio obbligatorio")
        BigDecimal stipendio,

        @NotNull(message = "Data inizio obbligatoria")
        LocalDate dataInizio
) {}
