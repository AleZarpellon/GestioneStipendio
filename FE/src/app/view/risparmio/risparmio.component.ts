import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RisparmioResponse } from '../../models/risparmio.model';
import { RisparmioService } from '../../services/risparmio.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-risparmio.component',
  imports: [CommonModule, TableModule, CardModule, Select, FormsModule, Dialog, Button],
  templateUrl: './risparmio.component.html',
  styleUrl: './risparmio.component.css',
  standalone: true,
})
export class RisparmioComponent {
  toastService = inject(ToastService);
  risparmioService = inject(RisparmioService);
  risparmioList = signal<RisparmioResponse[]>([]);
  periodoSelezionato = signal<string>('');
  cols = signal<string[]>(['descrizione', 'euro', 'periodo']);
  dialogTotaleVisible = signal(false);
  totaleInput: number | null = null;
  totale = computed<number>(() => {
    // Cerchiamo l'elemento che ha il periodo "TOTALE"
    const rTotale = this.risparmioList().find((r) => r.periodo === 'TOTALE');

    // Se lo trova, restituisce il suo valore (convertito in numero), altrimenti 0
    return rTotale ? Number(rTotale.euro) || 0 : 0;
  });

  periodoOptions = computed(() => {
    const periodi = [
      ...new Set(
        this.risparmioList()
          .filter((r) => r.periodo !== 'TOTALE') // 🔥
          .map((r) => r.periodo),
      ),
    ];

    return [
      { label: 'Tutti i periodi', value: '' },
      ...periodi.map((p) => ({ label: p, value: p })),
    ];
  });

  risparmioListFiltrata = computed(() => {
    const periodo = this.periodoSelezionato();

    return this.risparmioList()
      .filter((r) => r.periodo !== 'TOTALE') // 🔥 ESCLUDO TOTALE
      .filter((r) => !periodo || r.periodo === periodo);
  });

  ngOnInit(): void {
    this.risparmioService.getRisparmi().subscribe({
      next: (res) => {
        if (res.success) this.risparmioList.set(res.data);
      },
      error: (err) => console.error(err),
    });
  }

  apriDialogTotale() {
    this.totaleInput = null;
    this.dialogTotaleVisible.set(true);
  }

  chiudiDialogTotale() {
    this.dialogTotaleVisible.set(false);
  }

  confermaTotale() {
    if (this.totaleInput === null) return;

    this.risparmioService.aggiornaTotale(this.totaleInput).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.show('success', 'Successo!', res.message);
          this.chiudiDialogTotale();

          // 🔥 ricarico lista (così aggiorna anche totale)
          this.risparmioService.getRisparmi().subscribe({
            next: (r) => {
              if (r.success) {
                this.toastService.show('success', 'Successo!', res.message);
                this.risparmioList.set(r.data);
              }
            },
          });
        }
      },
      error: (err) => {
        this.toastService.showErrorHttp(err.message);
        console.error(err);
      },
    });
  }
}
