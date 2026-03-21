package com.za.testexe.model.dto.request.risparmio;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record RisparmioRequest(
        Integer idRisparmio,

        @NotBlank(message = "Descrizione obbligatoria")
        String descrizione,

        @NotNull(message = "Euro obbligatorio")
        BigDecimal euro,

        @NotBlank(message = "Periodo obbligatorio")
        String periodo
) {}
