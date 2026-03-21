package com.za.testexe.service;

import com.za.testexe.model.dto.request.rate.RateRequest;
import com.za.testexe.model.dto.response.rate.RateResponse;

import java.util.List;

public interface RateService {
    RateResponse saveRate(RateRequest request);
    List<RateResponse> getRate();
    void deleteRate(Integer idRate);
}
