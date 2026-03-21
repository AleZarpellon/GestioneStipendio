package com.za.testexe.controller.API;

import com.za.testexe.model.dto.response.common.ApiResponse;
import com.za.testexe.model.dto.response.risparmio.RisparmioResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
}
