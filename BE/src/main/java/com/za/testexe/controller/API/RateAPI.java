package com.za.testexe.controller.API;
import com.za.testexe.model.dto.request.rate.RateRequest;
import com.za.testexe.model.dto.response.rate.RateResponse;
import com.za.testexe.model.dto.response.common.ApiResponse;
import com.za.testexe.model.dto.response.common.ErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/rate")
public interface RateAPI {

    @PostMapping("/salva")
    @Operation(summary = "Salva rata", description = "Salva o aggiorna una rata")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Rata salvata con successo"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Dati non validi",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    ResponseEntity<ApiResponse<RateResponse>> saveRate(
            @Parameter(description = "Dati della rata", required = true)
            @Valid @RequestBody RateRequest request);

    @GetMapping("/lista")
    @Operation(summary = "Lista rate", description = "Recupera tutte le rate")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Lista recuperata con successo")
    })
    ResponseEntity<ApiResponse<List<RateResponse>>> getRate();

    @DeleteMapping("/elimina/{idRate}")
    @Operation(summary = "Elimina rata", description = "Elimina una rata tramite id")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Rata eliminata con successo"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Rata non trovata",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    ResponseEntity<ApiResponse<Void>> deleteRate(
            @Parameter(description = "Id della rata", required = true)
            @PathVariable Integer idRate);
}
