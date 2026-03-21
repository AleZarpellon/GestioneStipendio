package com.za.testexe.model.dto.request.spese;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record SpeseRequest(
        Integer idSpesa,
        @NotBlank(message = "Descrizione obbligatoria")
        String descrizione,
        @NotNull(message = "euro obbligatorio")
        BigDecimal euro,
        BigDecimal maxValore,
        Boolean continuative) {
}