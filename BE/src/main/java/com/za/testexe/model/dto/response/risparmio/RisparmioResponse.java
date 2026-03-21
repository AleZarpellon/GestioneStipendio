package com.za.testexe.model.dto.response.risparmio;

import java.math.BigDecimal;

public record RisparmioResponse(
        Integer idRisparmio,
        String descrizione,
        BigDecimal euro,
        String periodo
) {}
