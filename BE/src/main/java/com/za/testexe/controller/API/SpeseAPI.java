package com.za.testexe.controller.API;

import com.za.testexe.model.dto.request.spese.SpeseRequest;
import com.za.testexe.model.dto.response.spese.SpeseResponse;
import com.za.testexe.model.dto.response.common.ApiResponse;
import com.za.testexe.model.dto.response.common.ErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/spese")
public interface SpeseAPI {
    @PostMapping(path = "/salva")
    @Operation(
            summary = "Salva spesa",
            description = "Salva una nuova spesa"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201",
                    description = "Spesa salvata con successo"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Dati non validi",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    ResponseEntity<ApiResponse<SpeseResponse>> saveSpesa(
            @Parameter(description = "Dati della spesa", required = true)
            @Valid @RequestBody SpeseRequest request);

    @GetMapping("/lista")
    @Operation(summary = "Lista spese", description = "Recupera tutte le spese")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Lista recuperata con successo"
            )
    })
    ResponseEntity<ApiResponse<List<SpeseResponse>>> getSpese();

    @DeleteMapping("/elimina/{idSpesa}")
    @Operation(summary = "Elimina spesa", description = "Elimina una spesa tramite id")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Spesa eliminata con successo"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Spesa non trovata",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    ResponseEntity<ApiResponse<Void>> deleteSpesa(
            @Parameter(description = "Id della spesa", required = true)
            @PathVariable Integer idSpesa);
}
