package com.za.testexe.controller.API;

import com.za.testexe.model.dto.response.BudgetSettimanale.BudgetSettimanaleResponse;
import com.za.testexe.model.dto.response.common.ApiResponse;
import com.za.testexe.model.dto.response.common.ErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RequestMapping("/api/budget-settimanale")
public interface BudgetSettimanaleAPI {

    @GetMapping("/lista")
    @Operation(summary = "Lista budget", description = "Recupera tutti i budget settimanali")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "Lista recuperata con successo")
    })
    ResponseEntity<ApiResponse<List<BudgetSettimanaleResponse>>> getBudgetList();

    @PatchMapping("/speso/{idSettimana}")
    @Operation(summary = "Aggiorna speso", description = "Aggiorna lo speso della settimana")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "Speso aggiornato con successo"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "Settimana non trovata",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    ResponseEntity<ApiResponse<List<BudgetSettimanaleResponse>>> updateSpeso(
            @Parameter(description = "Id della settimana", required = true)
            @PathVariable Integer idSettimana,
            @Parameter(description = "Importo speso", required = true)
            @RequestParam BigDecimal speso);
}
