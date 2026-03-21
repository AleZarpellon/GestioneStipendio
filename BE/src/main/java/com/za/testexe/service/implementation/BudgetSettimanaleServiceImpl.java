package com.za.testexe.service.implementation;

import com.za.testexe.mapper.BudgetSettimanaleMapper;
import com.za.testexe.model.dto.response.BudgetSettimanale.BudgetSettimanaleResponse;
import com.za.testexe.model.entity.BudgetSettimanaleEntity;
import com.za.testexe.repository.BudgetSettimanaleRepository;
import com.za.testexe.service.BudgetSettimanaleService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetSettimanaleServiceImpl implements BudgetSettimanaleService {

    private final BudgetSettimanaleRepository budgetRepository;
    private final BudgetSettimanaleMapper budgetMapper;

    @Override
    public List<BudgetSettimanaleResponse> getBudgetList() {
        ricalcolaRimanenti();
        return budgetRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(BudgetSettimanaleEntity::getIdSettimana))
                .map(budgetMapper::toDto)
                .toList();
    }

    @Override
    public List<BudgetSettimanaleResponse> updateSpeso(Integer idSettimana, BigDecimal speso) {
        BudgetSettimanaleEntity entity = budgetRepository.findById(idSettimana)
                .orElseThrow(() -> new EntityNotFoundException("Settimana non trovata"));

        BigDecimal spesoAttuale = entity.getSpeso() != null ? entity.getSpeso() : BigDecimal.ZERO;
        entity.setSpeso(spesoAttuale.add(speso));
        budgetRepository.save(entity);

        ricalcolaRimanenti();
        return getBudgetList();
    }

    public void generaBudgetSettimanale(BigDecimal rimanente, Integer nrSettimane) {
        BigDecimal soldiXSettimana = rimanente.divide(
                BigDecimal.valueOf(nrSettimane), 2, RoundingMode.HALF_UP);

        List<BudgetSettimanaleEntity> existing = budgetRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(BudgetSettimanaleEntity::getIdSettimana))
                .collect(Collectors.toList());

        if (existing.size() == nrSettimane) {
            existing.forEach(e -> {
                e.setSoldiXSettimana(soldiXSettimana);
                budgetRepository.save(e);
            });
        }
    }

    private void ricalcolaRimanenti() {
        List<BudgetSettimanaleEntity> list = budgetRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(BudgetSettimanaleEntity::getIdSettimana))
                .collect(Collectors.toList());

        int nrSettimane = list.size();

        for (int i = 0; i < list.size(); i++) {
            BudgetSettimanaleEntity current = list.get(i);
            BigDecimal budget = current.getSoldiXSettimana();

            for (int j = 0; j < i; j++) {
                BudgetSettimanaleEntity previous = list.get(j);
                BigDecimal rimanentePrev = previous.getRimanente() != null
                        ? previous.getRimanente() : BigDecimal.ZERO;
                int settimaneRimanenti = nrSettimane - (j + 1);
                if (settimaneRimanenti > 0) {
                    budget = budget.add(rimanentePrev.divide(
                            BigDecimal.valueOf(settimaneRimanenti), 2, RoundingMode.HALF_UP));
                }
            }

            BigDecimal speso = current.getSpeso() != null
                    ? current.getSpeso() : BigDecimal.ZERO;
            current.setRimanente(budget.subtract(speso));
            budgetRepository.save(current);
        }
    }
}
