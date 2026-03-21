package com.za.testexe.controller;

import com.za.testexe.controller.API.NuovaGestioneAPI;
import com.za.testexe.model.dto.response.common.ApiResponse;

import com.za.testexe.service.NuovaGestioneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class NuovaGestioneController implements NuovaGestioneAPI {

    private final NuovaGestioneService  nuovaGestioneService;

    @Override
    public ResponseEntity<ApiResponse<Void>> nuovaGestione() {
        nuovaGestioneService.nuovaGestione();
        return ResponseEntity.ok(ApiResponse.success("Nuova gestione avviata correttamente"));
    }
}
