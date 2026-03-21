package com.za.testexe.controller;

import com.za.testexe.controller.API.SalvadanaiAPI;
import com.za.testexe.model.dto.request.salvadanai.SalvadanaiRequest;
import com.za.testexe.model.dto.response.common.ApiResponse;
import com.za.testexe.model.dto.response.salvadanai.SalvadanaiResponse;
import com.za.testexe.service.SalvadanaiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class SalvadanaiController implements SalvadanaiAPI {

    private final SalvadanaiService salvadanaiService;

    @Override
    public ResponseEntity<ApiResponse<SalvadanaiResponse>> saveSalvadanaio(
            @Valid @RequestBody SalvadanaiRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Salvadanaio salvato correttamente",
                salvadanaiService.saveSalvadanaio(request)));
    }

    @Override
    public ResponseEntity<ApiResponse<List<SalvadanaiResponse>>> getSalvadanai() {
        return ResponseEntity.ok(ApiResponse.success("Lista recuperata",
                salvadanaiService.getSalvadanai()));
    }

    @Override
    public ResponseEntity<ApiResponse<Void>> deleteSalvadanaio(Integer idSalvadanaio) {
        salvadanaiService.deleteSalvadanaio(idSalvadanaio);
        return ResponseEntity.ok(ApiResponse.success("Salvadanaio eliminato correttamente"));
    }

    @Override
    public ResponseEntity<ApiResponse<Void>> updateAttivo(Integer idSalvadanaio, Boolean attivo) {
        salvadanaiService.updateAttivo(idSalvadanaio, attivo);
        return ResponseEntity.ok(ApiResponse.success("Stato aggiornato correttamente"));
    }

    @Override
    public ResponseEntity<ApiResponse<Void>> accumula(Integer idSalvadanaio, BigDecimal euro) {
        salvadanaiService.accumula(idSalvadanaio, euro);
        return ResponseEntity.ok(ApiResponse.success("Accumulo aggiornato correttamente"));
    }
}
