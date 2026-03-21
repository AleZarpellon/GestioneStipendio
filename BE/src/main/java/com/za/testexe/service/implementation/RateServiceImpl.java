package com.za.testexe.service.implementation;

import com.za.testexe.mapper.RateMapper;
import com.za.testexe.model.dto.request.rate.RateRequest;
import com.za.testexe.model.dto.response.rate.RateResponse;
import com.za.testexe.model.entity.RateEntity;
import com.za.testexe.repository.RateRepository;
import com.za.testexe.service.RateService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RateServiceImpl implements RateService {

    private final RateRepository rateRepository;
    private final RateMapper rateMapper;

    @Override
    public RateResponse saveRate(RateRequest request) {
        RateEntity saved;
        if (request.idRate() == null || request.idRate() == 0) {
            saved = rateRepository.save(rateMapper.toEntity(request));
        } else {
            RateEntity entity = rateRepository.findById(request.idRate())
                    .orElseThrow(() -> new EntityNotFoundException("Rata non trovata"));
            rateMapper.updateEntity(request, entity);
            saved = rateRepository.save(entity);
        }
        return rateMapper.toDto(saved);
    }

    @Override
    public List<RateResponse> getRate() {
        return rateRepository.findAllByOrderByPeriodoAsc()
                .stream()
                .map(rateMapper::toDto)
                .toList();
    }

    @Override
    public void deleteRate(Integer idRate) {
        RateEntity entity = rateRepository.findById(idRate)
                .orElseThrow(() -> new EntityNotFoundException("Rata non trovata"));
        rateRepository.delete(entity);
    }
}
