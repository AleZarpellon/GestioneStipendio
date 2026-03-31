package com.za.testexe.controller.API;

import com.za.testexe.model.dto.request.risparmio.AggiornaTotaleRequest;
import com.za.testexe.model.dto.response.common.ApiResponse;
import com.za.testexe.model.dto.response.risparmio.RisparmioResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RequestMapping("/api/risparmio")
public interface RisparmioAPI {

    @GetMapping("/lista")
    @Operation(summary = "Lista risparmi", description = "Recupera tutti i risparmi")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "Lista recuperata con successo")
    })
    ResponseEntity<ApiResponse<List<RisparmioResponse>>> getRisparmi();

    // ➕➖ UPDATE TOTALE
    @PostMapping(path = "/totale")
    @Operation(summary = "Aggiorna totale", description = "Aggiunge o sottrae dal totale")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "Totale aggiornato con successo")
    })
    ResponseEntity<ApiResponse<Void>> aggiornaTotale(
            @Parameter(description = "Importo da aggiornare", required = true)
            @Valid @RequestBody AggiornaTotaleRequest request);
}
