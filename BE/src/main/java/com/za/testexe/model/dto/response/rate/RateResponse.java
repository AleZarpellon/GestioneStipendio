package com.za.testexe.model.dto.response.rate;

import java.math.BigDecimal;

public record RateResponse(
        Integer idRate,
        String descrizione,
        BigDecimal euro,
        Integer nrRate,
        Integer nrRateMax,
        BigDecimal maxValore,
        String periodo
) {}
