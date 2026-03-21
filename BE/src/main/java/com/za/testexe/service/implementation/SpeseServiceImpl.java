package com.za.testexe.service.implementation;

import com.za.testexe.mapper.SpeseMapper;
import com.za.testexe.model.dto.request.spese.SpeseRequest;
import com.za.testexe.model.dto.response.spese.SpeseResponse;
import com.za.testexe.model.entity.SpeseEntity;
import com.za.testexe.repository.SpeseRepository;
import com.za.testexe.service.SpeseService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpeseServiceImpl implements SpeseService {

    private final SpeseRepository speseRepository;
    private final SpeseMapper speseMapper;

    @Override
    public SpeseResponse saveSpesa(SpeseRequest request) {
        SpeseEntity saved;
        if (request.idSpesa() == null || request.idSpesa() == 0) {
            saved = speseRepository.save(speseMapper.toEntity(request));
        } else {
            SpeseEntity entity = speseRepository.findById(request.idSpesa())
                    .orElseThrow(() -> new EntityNotFoundException("Spesa non trovata"));
            speseMapper.updateEntity(request, entity);
            saved = speseRepository.save(entity);
        }
        return speseMapper.toDto(saved);
    }

    @Override
    public List<SpeseResponse> getSpese() {
        return speseRepository.findAll()
                .stream()
                .map(speseMapper::toDto)
                .toList();
    }

    @Override
    public void deleteSpesa(Integer idSpesa) {
        SpeseEntity entity = speseRepository.findById(idSpesa)
                .orElseThrow(() -> new EntityNotFoundException("Spesa non trovata"));
        speseRepository.delete(entity);
    }
}
