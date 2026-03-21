package com.za.testexe.controller.API;


import com.za.testexe.model.dto.request.salvadanai.SalvadanaiRequest;
import com.za.testexe.model.dto.response.common.ApiResponse;
import com.za.testexe.model.dto.response.common.ErrorResponse;
import com.za.testexe.model.dto.response.salvadanai.SalvadanaiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RequestMapping("/api/salvadanaio")
public interface SalvadanaiAPI {

    @PostMapping("/salva")
    @Operation(summary = "Salva salvadanaio", description = "Salva o aggiorna un salvadanaio")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "Salvadanaio salvato con successo"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "Dati non validi",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    ResponseEntity<ApiResponse<SalvadanaiResponse>> saveSalvadanaio(
            @Parameter(description = "Dati del salvadanaio", required = true)
            @Valid @RequestBody SalvadanaiRequest request);

    @GetMapping("/lista")
    @Operation(summary = "Lista salvadanai", description = "Recupera tutti i salvadanai")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "Lista recuperata con successo")
    })
    ResponseEntity<ApiResponse<List<SalvadanaiResponse>>> getSalvadanai();

    @DeleteMapping("/elimina/{idSalvadanaio}")
    @Operation(summary = "Elimina salvadanaio", description = "Elimina un salvadanaio tramite id")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "Salvadanaio eliminato con successo"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "Salvadanaio non trovato",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    ResponseEntity<ApiResponse<Void>> deleteSalvadanaio(
            @Parameter(description = "Id del salvadanaio", required = true)
            @PathVariable Integer idSalvadanaio);

    @PatchMapping("/attivo/{idSalvadanaio}")
    @Operation(summary = "Aggiorna attivo", description = "Aggiorna lo stato attivo del salvadanaio")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Stato aggiornato con successo"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Salvadanaio non trovato",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    ResponseEntity<ApiResponse<Void>> updateAttivo(
            @Parameter(description = "Id del salvadanaio", required = true)
            @PathVariable Integer idSalvadanaio,
            @Parameter(description = "Nuovo stato attivo", required = true)
            @RequestParam Boolean attivo);

    @PatchMapping("/accumula/{idSalvadanaio}")
    @Operation(summary = "Accumula", description = "Aggiunge euro agli accumulati")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Accumulato aggiornato"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Salvadanaio non trovato",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    ResponseEntity<ApiResponse<Void>> accumula(
            @Parameter(description = "Id del salvadanaio", required = true)
            @PathVariable Integer idSalvadanaio,
            @Parameter(description = "Euro da aggiungere", required = true)
            @RequestParam BigDecimal euro);
}
