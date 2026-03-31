package com.za.testexe.config;

import com.za.testexe.model.entity.AppConfig;
import com.za.testexe.model.entity.BudgetSettimanaleEntity;
import com.za.testexe.model.entity.RisparmioEntity;
import com.za.testexe.model.entity.StipendioEntity;
import com.za.testexe.repository.AppConfigRepository;
import com.za.testexe.repository.BudgetSettimanaleRepository;
import com.za.testexe.repository.RisparmioRepository;
import com.za.testexe.repository.StipendioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor // Se usi Lombok, altrimenti tieni il tuo costruttore
public class DbInitializer implements CommandLineRunner { // 1. Implementa questa interfaccia

    private final RisparmioRepository risparmioRepository;
    private final StipendioRepository stipendioRepository;
    private final BudgetSettimanaleRepository settimanaRepository;
    private final AppConfigRepository configRepository;

    // 2. Sostituisci il metodo init() con questo
    @Override
    public void run(String... args) {

        if (configRepository.existsById("DB_INITIALIZED")) {
            return;
        }

        // Il resto della tua logica rimane identica
        if (stipendioRepository.count() > 0 ||
                settimanaRepository.count() > 0 ||
                risparmioRepository.count() > 0) {

            configRepository.save(new AppConfig("DB_INITIALIZED", "true"));
            return;
        }

        System.out.println("Inizializzazione database...");
        initStipendio();
        initSettimane();
        initRisparmio();

        configRepository.save(new AppConfig("DB_INITIALIZED", "true"));
    }

    private void initStipendio() {
        StipendioEntity stipendio = new StipendioEntity();
        stipendio.setStipendio(BigDecimal.ZERO);
        stipendio.setDataInizio(LocalDate.now());
        stipendio.setDataFine(LocalDate.now().plusMonths(1));
        stipendio.setNrSettimane(4);
        stipendioRepository.save(stipendio);
    }

    private void initSettimane() {
        for (int i = 0; i < 4; i++) {
            BudgetSettimanaleEntity settimana = new BudgetSettimanaleEntity();
            settimana.setSoldiXSettimana(BigDecimal.ZERO);
            settimana.setSpeso(BigDecimal.ZERO);
            settimana.setRimanente(BigDecimal.ZERO);
            settimanaRepository.save(settimana);
        }
    }

    private void initRisparmio() {
        RisparmioEntity totale = new RisparmioEntity();
        totale.setDescrizione("TOTALE");
        totale.setTotale(true);
        totale.setPeriodo("TOTALE");
        totale.setEuro(BigDecimal.ZERO);
        risparmioRepository.save(totale);
    }
}
