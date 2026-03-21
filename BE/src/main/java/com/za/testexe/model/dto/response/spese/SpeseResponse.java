package com.za.testexe.model.dto.response.spese;

import java.math.BigDecimal;

public record SpeseResponse(Integer idSpesa, String descrizione,
BigDecimal euro, BigDecimal maxValore, Boolean continuative) {
}
