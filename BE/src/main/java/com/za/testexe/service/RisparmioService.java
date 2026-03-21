package com.za.testexe.service;

import com.za.testexe.model.dto.request.risparmio.RisparmioRequest;
import com.za.testexe.model.dto.response.risparmio.RisparmioResponse;

import java.util.List;

public interface RisparmioService {
    List<RisparmioResponse> getRisparmi();
    void saveRisparmio(RisparmioRequest request);
}
