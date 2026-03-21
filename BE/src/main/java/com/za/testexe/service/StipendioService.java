package com.za.testexe.service;

import com.za.testexe.model.dto.request.stipendio.StipendioRequest;
import com.za.testexe.model.dto.response.resoconto.ResocontoResponse;
import com.za.testexe.model.dto.response.stipendio.StipendioResponse;

public interface StipendioService {
    StipendioResponse saveStipendio(StipendioRequest request);
    StipendioResponse getStipendio();
    ResocontoResponse getResoconto();
}
