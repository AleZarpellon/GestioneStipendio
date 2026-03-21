package com.za.testexe.model.dto.response.stipendio;

import java.math.BigDecimal;
import java.time.LocalDate;

public record StipendioResponse(
        Integer idStipendio,
        BigDecimal stipendio,
        LocalDate dataInizio,
        LocalDate dataFine,
        Integer nrSettimane
) {}
