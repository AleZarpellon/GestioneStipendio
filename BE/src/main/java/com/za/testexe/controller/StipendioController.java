package com.za.testexe.controller;

import com.za.testexe.controller.API.StipendioAPI;
import com.za.testexe.model.dto.request.stipendio.StipendioRequest;
import com.za.testexe.model.dto.response.resoconto.ResocontoResponse;
import com.za.testexe.model.dto.response.stipendio.StipendioResponse;
import com.za.testexe.model.dto.response.common.ApiResponse;
import com.za.testexe.service.StipendioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class StipendioController implements StipendioAPI {

    private final StipendioService stipendioService;

    @Override
    public ResponseEntity<ApiResponse<StipendioResponse>> saveStipendio(
            @Valid @RequestBody StipendioRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Stipendio salvato correttamente",
                stipendioService.saveStipendio(request)));
    }

    @Override
    public ResponseEntity<ApiResponse<StipendioResponse>> getStipendio() {
        return ResponseEntity.ok(ApiResponse.success("Stipendio recuperato",
                stipendioService.getStipendio()));
    }

    @Override
    public ResponseEntity<ApiResponse<ResocontoResponse>> getResoconto() {
        return ResponseEntity.ok(ApiResponse.success("Resoconto recuperato",
                stipendioService.getResoconto()));
    }
}
