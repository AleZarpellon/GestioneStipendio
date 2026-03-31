package com.za.testexe.config;

import com.za.testexe.model.entity.AppConfig;
import com.za.testexe.model.entity.BudgetSettimanaleEntity;
import com.za.testexe.model.entity.RisparmioEntity;
import com.za.testexe.model.entity.StipendioEntity;
import com.za.testexe.repository.AppConfigRepository;
import com.za.testexe.repository.BudgetSettimanaleRepository;
import com.za.testexe.repository.RisparmioRepository;
import com.za.testexe.repository.StipendioRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DbInitializer {

    private final RisparmioRepository risparmioRepository;
    private final StipendioRepository stipendioRepository;
    private final BudgetSettimanaleRepository settimanaRepository;
    private final AppConfigRepository configRepository;

    public DbInitializer(RisparmioRepository risparmioRepository,
                         StipendioRepository stipendioRepository,
                         BudgetSettimanaleRepository settimanaRepository,
                         AppConfigRepository configRepository) {
        this.risparmioRepository = risparmioRepository;
        this.stipendioRepository = stipendioRepository;
        this.settimanaRepository = settimanaRepository;
        this.configRepository = configRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void init() {

        // 🔒 CONTROLLO SICURO
        if (configRepository.existsById("DB_INITIALIZED")) {
            return;
        }

        boolean dbGiaPopolato =
                stipendioRepository.count() > 0 ||
                        settimanaRepository.count() > 0 ||
                        risparmioRepository.count() > 0;

        if (dbGiaPopolato) {
            System.out.println("DB già esistente → aggiungo solo flag");

            // ✅ NON inizializzo, salvo solo il flag
            configRepository.save(new AppConfig("DB_INITIALIZED", "true"));
            return;
        }

        System.out.println("Inizializzazione database...");

        initStipendio();
        initSettimane();
        initRisparmio();

        // ✅ SALVO FLAG
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
