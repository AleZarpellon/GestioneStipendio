package com.za.testexe.controller;

import com.za.testexe.controller.API.RisparmioAPI;
import com.za.testexe.model.dto.response.common.ApiResponse;
import com.za.testexe.model.dto.response.risparmio.RisparmioResponse;
import com.za.testexe.service.RisparmioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RisparmioController implements RisparmioAPI {

    private final RisparmioService risparmioService;

    @Override
    public ResponseEntity<ApiResponse<List<RisparmioResponse>>> getRisparmi() {
        return ResponseEntity.ok(ApiResponse.success("Lista recuperata",
                risparmioService.getRisparmi()));
    }
}
