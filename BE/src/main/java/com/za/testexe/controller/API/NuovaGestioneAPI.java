package com.za.testexe.controller.API;

import com.za.testexe.model.dto.response.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/api/gestione")
public interface NuovaGestioneAPI {
    @PostMapping("/nuova-gestione")
    @Operation(summary = "Nuova gestione", description = "Avvia una nuova gestione mensile")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "Nuova gestione avviata con successo")
    })
    ResponseEntity<ApiResponse<Void>> nuovaGestione();
}
