package com.za.testexe.service.implementation;

import com.za.testexe.mapper.RisparmioMapper;
import com.za.testexe.model.dto.request.risparmio.RisparmioRequest;
import com.za.testexe.model.dto.response.risparmio.RisparmioResponse;
import com.za.testexe.model.entity.RisparmioEntity;
import com.za.testexe.model.entity.StipendioEntity;
import com.za.testexe.repository.RisparmioRepository;
import com.za.testexe.repository.StipendioRepository;
import com.za.testexe.service.RisparmioService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
@Service
@RequiredArgsConstructor
public class RisparmioServiceImpl implements RisparmioService {
    private final RisparmioMapper risparmioMapper;
    private final RisparmioRepository risparmioRepository;
    private final StipendioRepository stipendioRepository;

    @Override
    public List<RisparmioResponse> getRisparmi() {
        return risparmioRepository.findAll()
                .stream()
                .map(risparmioMapper::toDto)
                .toList();
    }

    @Override
    public void saveRisparmio(RisparmioRequest request) {
        StipendioEntity stipendio = stipendioRepository.findAll()
                .stream().findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Stipendio non trovato"));

        String periodo = stipendio.getDataInizio()
                .format(DateTimeFormatter.ofPattern("MM/yyyy"));

            RisparmioEntity entity = risparmioMapper.toEntity(request);
            entity.setPeriodo(periodo);
            risparmioRepository.save(entity);
    }


}
