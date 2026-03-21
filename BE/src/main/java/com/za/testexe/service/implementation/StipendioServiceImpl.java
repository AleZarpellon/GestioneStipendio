package com.za.testexe.service.implementation;

import com.za.testexe.mapper.StipendioMapper;
import com.za.testexe.model.dto.request.stipendio.StipendioRequest;
import com.za.testexe.model.dto.response.resoconto.ResocontoResponse;
import com.za.testexe.model.dto.response.stipendio.StipendioResponse;
import com.za.testexe.model.entity.RateEntity;
import com.za.testexe.model.entity.SalvadanaiEntity;
import com.za.testexe.model.entity.SpeseEntity;
import com.za.testexe.model.entity.StipendioEntity;
import com.za.testexe.repository.RateRepository;
import com.za.testexe.repository.SalvadanaiRepository;
import com.za.testexe.repository.SpeseRepository;
import com.za.testexe.repository.StipendioRepository;
import com.za.testexe.service.StipendioService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class StipendioServiceImpl implements StipendioService {

    private final StipendioRepository stipendioRepository;
    private final SpeseRepository speseRepository;
    private final RateRepository  rateRepository;
    private final SalvadanaiRepository salvadanaiRepository;
    private final StipendioMapper stipendioMapper;
    private final BudgetSettimanaleServiceImpl budgetService;

    @Override
    public StipendioResponse saveStipendio(StipendioRequest request) {
        StipendioEntity entity;

        if (request.idStipendio() == null || request.idStipendio() == 0) {
            entity = stipendioMapper.toEntity(request);
        } else {
            entity = stipendioRepository.findById(request.idStipendio())
                    .orElseThrow(() -> new EntityNotFoundException("Stipendio non trovato"));
            stipendioMapper.updateEntity(request, entity);
        }

        // calcola dataFine — stesso giorno del mese successivo
        LocalDate dataFine = request.dataInizio().plusMonths(1);
        entity.setDataFine(dataFine);

        // calcola nrSettimane tra dataInizio e dataFine
        long giorni = ChronoUnit.DAYS.between(request.dataInizio(), dataFine);
        entity.setNrSettimane(4);

        return stipendioMapper.toDto(stipendioRepository.save(entity));
    }

    @Override
    public StipendioResponse getStipendio() {
        return stipendioRepository.findAll()
                .stream()
                .findFirst()
                .map(stipendioMapper::toDto)
                .orElse(null);
    }

    @Override
    public ResocontoResponse getResoconto() {
        StipendioEntity stipendio = stipendioRepository.findAll()
                .stream().findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Stipendio non trovato"));

        BigDecimal totSpese = speseRepository.findAll()
                .stream()
                .map(SpeseEntity::getEuro)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totRate = rateRepository.findAll()
                .stream()
                .map(RateEntity::getEuro)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totSalvadanai = salvadanaiRepository.findAll()
                .stream()
                .filter(s -> Boolean.TRUE.equals(s.getAttivo()))
                .map(SalvadanaiEntity::getEuro)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totale = totSpese.add(totRate).add(totSalvadanai);
        BigDecimal rimanente = stipendio.getStipendio().subtract(totale);

        budgetService.generaBudgetSettimanale(
                rimanente, stipendio.getNrSettimane());

        return new ResocontoResponse(
                stipendio.getStipendio(),
                stipendio.getNrSettimane(),
                totSpese,
                totRate,
                totSalvadanai,
                totale,
                rimanente
        );
    }
}
