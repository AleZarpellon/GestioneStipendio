package com.za.testexe.model.dto.request.budgetSettimanale;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record BudgetSettimanaleRequest(
        Integer idSettimana,

        @NotNull(message = "Soldi per settimana obbligatori")
        BigDecimal soldiXSettimana,

        BigDecimal speso
) {}
