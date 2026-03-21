package com.za.testexe.service.implementation;

import com.za.testexe.mapper.SalvadanaiMapper;
import com.za.testexe.model.dto.request.salvadanai.SalvadanaiRequest;
import com.za.testexe.model.dto.response.salvadanai.SalvadanaiResponse;
import com.za.testexe.model.entity.SalvadanaiEntity;
import com.za.testexe.repository.SalvadanaiRepository;
import com.za.testexe.service.SalvadanaiService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SalvadanaiServiceImpl implements SalvadanaiService {

    private final SalvadanaiRepository salvadanaiRepository;
    private final SalvadanaiMapper salvadanaiMapper;

    @Override
    public SalvadanaiResponse saveSalvadanaio(SalvadanaiRequest request) {
        SalvadanaiEntity saved;
        if (request.idSalvadanaio() == null || request.idSalvadanaio() == 0) {
            SalvadanaiEntity entity = salvadanaiMapper.toEntity(request);
            saved = salvadanaiRepository.save(entity);
        } else {
            SalvadanaiEntity entity = salvadanaiRepository.findById(request.idSalvadanaio())
                    .orElseThrow(() -> new EntityNotFoundException("Salvadanaio non trovato"));
            salvadanaiMapper.updateEntity(request, entity);
            saved = salvadanaiRepository.save(entity);
        }
        return salvadanaiMapper.toDto(saved);
    }

    @Override
    public List<SalvadanaiResponse> getSalvadanai() {
        return salvadanaiRepository.findAll()
                .stream()
                .map(salvadanaiMapper::toDto)
                .toList();
    }

    @Override
    public void deleteSalvadanaio(Integer idSalvadanaio) {
        SalvadanaiEntity entity = salvadanaiRepository.findById(idSalvadanaio)
                .orElseThrow(() -> new EntityNotFoundException("Salvadanaio non trovato"));
        salvadanaiRepository.delete(entity);
    }

    @Override
    public void updateAttivo(Integer idSalvadanaio, Boolean attivo) {
        SalvadanaiEntity entity = salvadanaiRepository.findById(idSalvadanaio)
                .orElseThrow(() -> new EntityNotFoundException("Salvadanaio non trovato"));
        entity.setAttivo(attivo);
        salvadanaiRepository.save(entity);
    }

    @Override
    public void accumula(Integer idSalvadanaio, BigDecimal euro) {
        SalvadanaiEntity entity = salvadanaiRepository.findById(idSalvadanaio)
                .orElseThrow(() -> new EntityNotFoundException("Salvadanaio non trovato"));
        BigDecimal attuale = entity.getEuroAccumulati() != null ? entity.getEuroAccumulati() : BigDecimal.ZERO;
        entity.setEuroAccumulati(attuale.add(euro));
        salvadanaiRepository.save(entity);
    }
}
