package com.za.testexe.service;

import com.za.testexe.model.dto.response.BudgetSettimanale.BudgetSettimanaleResponse;

import java.math.BigDecimal;
import java.util.List;

public interface BudgetSettimanaleService {
    List<BudgetSettimanaleResponse> getBudgetList();
    List<BudgetSettimanaleResponse> updateSpeso(Integer idSettimana, BigDecimal speso);
}
