package com.za.testexe.controller;

import com.za.testexe.controller.API.BudgetSettimanaleAPI;
import com.za.testexe.model.dto.response.BudgetSettimanale.BudgetSettimanaleResponse;
import com.za.testexe.model.dto.response.common.ApiResponse;
import com.za.testexe.service.BudgetSettimanaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class BudgetSettimanaleController implements BudgetSettimanaleAPI {

    private final BudgetSettimanaleService budgetService;

    @Override
    public ResponseEntity<ApiResponse<List<BudgetSettimanaleResponse>>> getBudgetList() {
        return ResponseEntity.ok(ApiResponse.success("Lista recuperata",
                budgetService.getBudgetList()));
    }

    @Override
    public ResponseEntity<ApiResponse<List<BudgetSettimanaleResponse>>> updateSpeso(
            Integer idSettimana, BigDecimal speso) {
        return ResponseEntity.ok(ApiResponse.success("Speso aggiornato correttamente",
                budgetService.updateSpeso(idSettimana, speso)));
    }
}
