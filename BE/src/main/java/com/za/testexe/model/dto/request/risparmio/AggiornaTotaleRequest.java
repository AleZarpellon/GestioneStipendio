package com.za.testexe.model.dto.request.risparmio;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record AggiornaTotaleRequest(
        @NotNull(message = "importo obbligatorio")
        BigDecimal importo) {
}
