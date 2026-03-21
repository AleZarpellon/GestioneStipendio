package com.za.testexe.service;

import com.za.testexe.model.dto.request.spese.SpeseRequest;
import com.za.testexe.model.dto.response.spese.SpeseResponse;

import java.util.List;

public interface SpeseService {
    SpeseResponse saveSpesa(SpeseRequest request);
    List<SpeseResponse> getSpese();
    void deleteSpesa(Integer idSpesa);
}
