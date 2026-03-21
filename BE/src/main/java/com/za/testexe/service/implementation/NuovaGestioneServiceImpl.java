package com.za.testexe.service.implementation;

import com.za.testexe.model.entity.*;
import com.za.testexe.repository.*;
import com.za.testexe.service.NuovaGestioneService;
import com.za.testexe.service.RisparmioService;
import com.za.testexe.model.dto.request.risparmio.RisparmioRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NuovaGestioneServiceImpl implements NuovaGestioneService {

    private final BudgetSettimanaleRepository budgetRepository;
    private final SpeseRepository speseRepository;
    private final SalvadanaiRepository salvadanaiRepository;
    private final RateRepository rateRepository;
    private final StipendioRepository stipendioRepository;
    private final RisparmioService risparmioService;

    @Override
    @Transactional
    public void nuovaGestione() {

        StipendioEntity stipendio = stipendioRepository.findAll()
                .stream().findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Stipendio non trovato"));

        int nrSettimane = stipendio.getNrSettimane();

        // 1 — risparmio da budget
        List<BudgetSettimanaleEntity> budgetList = budgetRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getIdSettimana().compareTo(a.getIdSettimana()))
                .toList();

        if (!budgetList.isEmpty()) {
            BudgetSettimanaleEntity ultimoBudget = budgetList.stream()
                    .filter(b -> b.getIdSettimana().equals(nrSettimane))
                    .findFirst()
                    .orElse(null);

            if (ultimoBudget != null && ultimoBudget.getRimanente() != null
                    && ultimoBudget.getRimanente().compareTo(BigDecimal.ZERO) > 0) {
                risparmioService.saveRisparmio(new RisparmioRequest(
                        null,
                        "Risparmi da stipendio",
                        ultimoBudget.getRimanente(),
                        null
                ));
            }
        }

        // 2 — elimina spese non continuative
        speseRepository.findAll()
                .stream()
                .filter(s -> Boolean.FALSE.equals(s.getContinuative()))
                .forEach(speseRepository::delete);

        // 3 — salvadanai attivi
        salvadanaiRepository.findByAttivoTrue()
                .forEach(s -> {
                    BigDecimal euroAccumulati = s.getEuroAccumulati() != null
                            ? s.getEuroAccumulati() : BigDecimal.ZERO;
                    s.setEuroAccumulati(euroAccumulati.add(s.getEuro()));
                    salvadanaiRepository.save(s);

                    risparmioService.saveRisparmio(new RisparmioRequest(
                            null,
                            s.getDescrizione(),
                            s.getEuro(),
                            null
                    ));
                });

        // 4 — rate
        rateRepository.findAll().forEach(r -> {
            if (r.getNrRateMax() == null || r.getNrRate() == null) return;
            int nuovoNrRate = (r.getNrRate() != null ? r.getNrRate() : 0) + 1;

            if (r.getNrRateMax() != null && nuovoNrRate > r.getNrRateMax()) {
                rateRepository.delete(r);
            } else {
                r.setNrRate(nuovoNrRate);
                if (r.getNrRateMax() != null && r.getEuro() != null) {
                    BigDecimal nuovoMaxValore = BigDecimal.valueOf(r.getNrRateMax() - nuovoNrRate)
                            .multiply(r.getEuro())
                            .setScale(2, RoundingMode.HALF_UP);
                    r.setMaxValore(nuovoMaxValore);
                }
                rateRepository.save(r);
            }
        });

        // 5 — stipendio a 0
        stipendio.setStipendio(BigDecimal.ZERO);
        stipendio.setDataInizio(null);
        stipendio.setDataFine(null);
        stipendio.setStipendio(BigDecimal.ZERO);
        stipendioRepository.save(stipendio);

        // 6 — budget a 0
        budgetRepository.findAll().forEach(b -> {
            b.setSoldiXSettimana(BigDecimal.ZERO);
            b.setSpeso(BigDecimal.ZERO);
            b.setRimanente(BigDecimal.ZERO);
            budgetRepository.save(b);
        });
    }
}
