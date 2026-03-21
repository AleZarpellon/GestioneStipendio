import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { StipendioService } from '../../services/stipendio.service';
import { ToastService } from '../../services/toast.service';
import { StipendioRequest, StipendioResponse } from '../../models/stipendio.model';
import { Button } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { ResocontoResponse } from '../../models/resoconto.model';
import { forkJoin, switchMap } from 'rxjs';
import { BudgetSettimanaleResponse } from '../../models/budget-settimanale.model';
import { Dialog } from 'primeng/dialog';
import { BudgetSettimanaleService } from '../../services/budget.service';
import { GestioneService } from '../../services/gestione.service';

@Component({
  selector: 'app-resoconto.component',
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    ReactiveFormsModule,
    InputText,
    FormsModule,
    Button,
    DatePickerModule,
    Dialog,
  ],
  templateUrl: './resoconto.component.html',
  styleUrl: './resoconto.component.css',
  standalone: true,
})
export class ResocontoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private stipendioService = inject(StipendioService);
  private budgetService = inject(BudgetSettimanaleService);
  private gestioneService = inject(GestioneService);
  private toastService = inject(ToastService);
  checkTipeFormStipendio = signal<string>('');
  objStipendioRequest = signal<StipendioRequest | null>(null);
  objStipendioResponse = signal<StipendioResponse | null>(null);
  minDate = signal<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), 10));
  objResocontoResponse = signal<ResocontoResponse | null>(null);
  resocontoCols = signal<string[]>([
    'stipendio',
    'nrSettimane',
    'totSpese',
    'totRate',
    'totSalvadanai',
    'totale',
    'rimanente',
  ]);

  budgetCols = signal<string[]>(['idSettimana', 'soldiXSettimana', 'speso', 'rimanente', 'azioni']);

  budgetList = signal<BudgetSettimanaleResponse[]>([]);
  dialogSpesoVisible = signal<boolean>(false);
  budgetSelezionato = signal<BudgetSettimanaleResponse | null>(null);
  spesoInput = signal<number>(0);
  dialogNuovaGestioneVisible = signal<boolean>(false);

  ngOnInit(): void {
    forkJoin({
      stipendio: this.stipendioService.getStipendio(),
      resoconto: this.stipendioService.getResoconto(),
    })
      .pipe(
        switchMap(({ stipendio, resoconto }) => {
          if (stipendio.success) {
            this.toastService.show('success', 'Successo!', stipendio.message);
            this.objStipendioResponse.set(stipendio.data);
            this.onRipristinaGestione();
          }
          if (resoconto.success) {
            this.toastService.show('success', 'Successo!', resoconto.message);
            this.objResocontoResponse.set(resoconto.data);
          }
          return this.budgetService.getBudgetList();
        }),
      )
      .subscribe({
        next: (budget) => {
          if (budget.success) {
            this.toastService.show('success', 'Successo!', budget.message);
            this.budgetList.set(budget.data);
          }
        },
        error: (err) => {
          this.toastService.showErrorHttp(err.error?.message);
          console.error(err);
        },
      });
  }

  onAnnullaGestione() {
    this.checkTipeFormStipendio.set('');
  }

  onRipristinaGestione() {
    const response = this.objStipendioResponse();
    this.objStipendioRequest.set({
      idStipendio: response?.idStipendio ?? null,
      stipendio: response?.stipendio ?? 0,
      dataInizio: response?.dataInizio ? new Date(response.dataInizio) : null,
    });
  }

  salva() {
    const request = this.objStipendioRequest();
    if (!request?.stipendio || !request?.dataInizio) return;

    this.stipendioService
      .saveStipendio(request)
      .pipe(
        switchMap((res) => {
          if (res.success) {
            this.objStipendioResponse.set(res.data);
            this.onRipristinaGestione();
            this.toastService.show('success', 'Successo!', res.message);
            this.onAnnullaGestione();
          }
          return this.stipendioService.getResoconto();
        }),
        switchMap((res) => {
          if (res.success) {
            this.toastService.show('success', 'Successo!', res.message);
            this.objResocontoResponse.set(res.data);
          }
          return this.budgetService.getBudgetList();
        }),
      )
      .subscribe({
        next: (budget) => {
          if (budget.success) {
            this.toastService.show('success', 'Successo!', budget.message);
            this.budgetList.set(budget.data);
          }
        },
        error: (err) => {
          this.toastService.showErrorHttp(err.error?.message);
          console.error(err);
        },
      });
  }

  onEditSpeso(row: BudgetSettimanaleResponse) {
    this.budgetSelezionato.set(row);
    this.spesoInput.set(0);
    this.dialogSpesoVisible.set(true);
  }

  onChiudiDialogSpeso() {
    this.dialogSpesoVisible.set(false);
    this.budgetSelezionato.set(null);
    this.spesoInput.set(0);
  }

  onConfermaSpeso() {
    const budget = this.budgetSelezionato();
    if (!budget?.idSettimana || this.spesoInput === null) return;

    this.budgetService.updateSpeso(budget.idSettimana, this.spesoInput()).subscribe({
      next: (res) => {
        if (res.success) {
          this.budgetList.set(res.data);
          this.toastService.show('success', 'Successo!', res.message);
          this.onChiudiDialogSpeso();
        }
      },
      error: (err) => {
        this.toastService.showErrorHttp(err.error?.message);
        console.error(err);
      },
    });
  }

  isSettimanaCorrente(row: BudgetSettimanaleResponse): boolean {
    const oggi = new Date();
    const dataInizio = this.objStipendioResponse()?.dataInizio;
    if (!dataInizio) return false;

    const inizio = new Date(dataInizio);
    const giorniDallInizio = Math.floor(
      (oggi.getTime() - inizio.getTime()) / (1000 * 60 * 60 * 24),
    );
    const settimanaCorrente = Math.min(Math.floor(giorniDallInizio / 7) + 1, 4);

    return row.idSettimana === settimanaCorrente;
  }

  newGestione() {
    this.checkTipeFormStipendio.set('nuovo');
    this.dialogNuovaGestioneVisible.set(true);
  }

  onConfermaGestione() {
    this.gestioneService.nuovaGestione().subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.show('success', 'Successo!', res.message);
          this.dialogNuovaGestioneVisible.set(false);
          // ricarica tutti i dati
          this.ngOnInit();
        }
      },
      error: (err) => {
        this.toastService.showErrorHttp(err.error?.message);
        console.error(err);
      },
    });
  }
}
