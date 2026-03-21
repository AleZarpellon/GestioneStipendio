package com.za.testexe.controller.API;

import com.za.testexe.model.dto.request.stipendio.StipendioRequest;
import com.za.testexe.model.dto.response.resoconto.ResocontoResponse;
import com.za.testexe.model.dto.response.stipendio.StipendioResponse;
import com.za.testexe.model.dto.response.common.ApiResponse;
import com.za.testexe.model.dto.response.common.ErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/stipendio")
public interface StipendioAPI {

    @PostMapping("/salva")
    @Operation(summary = "Salva stipendio", description = "Salva o aggiorna lo stipendio")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "Stipendio salvato con successo"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "Dati non validi",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    ResponseEntity<ApiResponse<StipendioResponse>> saveStipendio(
            @Parameter(description = "Dati dello stipendio", required = true)
            @Valid @RequestBody StipendioRequest request);

    @GetMapping("/get")
    @Operation(summary = "Get stipendio", description = "Recupera lo stipendio")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "Stipendio recuperato con successo")
    })
    ResponseEntity<ApiResponse<StipendioResponse>> getStipendio();

    @GetMapping("/getResoconto")
    @Operation(summary = "Get resoconto", description = "Recupera il resoconto")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "Resoconto recuperato con successo")
    })
    ResponseEntity<ApiResponse<ResocontoResponse>> getResoconto();
}
