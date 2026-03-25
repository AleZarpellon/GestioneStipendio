import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SalvadanaiService } from '../../services/salvadanai.service';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { SalvadanaiModel } from '../../models/salvadanai.model';
import { DialogModule } from 'primeng/dialog';
import { positiveEuroValidator } from '../../shared/validators/euro.validator';

@Component({
  selector: 'app-salvadanai.component',
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    ReactiveFormsModule,
    ToggleSwitchModule,
    Button,
    TooltipModule,
    FormsModule,
    DialogModule,
  ],
  templateUrl: './salvadanai.component.html',
  styleUrl: './salvadanai.component.css',
  standalone: true,
})
export class SalvadanaiComponent implements OnInit {
  private fb = inject(FormBuilder);
  private salvadanaiService = inject(SalvadanaiService);
  private toastService = inject(ToastService);
  checkTipeForm = signal<string>('');
  salvadanaiList = signal<SalvadanaiModel[]>([]);
  dialogVisible = signal<boolean>(false);
  euroAccumulo = signal<number | null>(null);
  salvadanaiDialog = signal<SalvadanaiModel | null>(null);
  cols = signal<string[]>([
    'descrizione',
    'euro',
    'euroAccumulati',
    'quotaFinale',
    'disattivo/attivo',
    'azioni',
  ]);
  totale = computed<number>(() =>
    this.salvadanaiList().reduce((acc, s) => acc + (Number(s.euro) || 0), 0),
  );

  form = signal<FormGroup>(
    this.fb.group({
      idSalvadanaio: [null],
      descrizione: ['', Validators.required],
      euro: [null, [Validators.required, positiveEuroValidator()]],
      quotaFinale: [null, positiveEuroValidator()],
      euroAccumulati: [null],
      attivo: [true],
    }),
  );

  ngOnInit(): void {
    this.loadSalvadanai();
  }

  onAnnullaOrNew(isNew: boolean) {
    if (isNew) this.checkTipeForm.set('nuovo');
    else this.checkTipeForm.set('');

    // resetta il form per una nuova spesa
    this.form().reset({
      isSalvadanaio: null,
      descrizione: '',
      euro: null,
      quotaFinale: null,
      euroAccumulati: null,
      attivo: true,
    });
  }

  onDelete(idSalvadanaio: number) {
    this.salvadanaiService.deleteSalvadanaio(idSalvadanaio).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.show('success', 'Successo!', res.message);
          this.salvadanaiList.update((list) =>
            list.filter((s) => s.idSalvadanaio !== idSalvadanaio),
          );
        }
      },
      error: (err) => {
        this.toastService.showErrorHttp(err.message);
        console.error(err);
      },
    });
  }

  onEdit(objSpesa: SalvadanaiModel) {
    this.checkTipeForm.set('modifica');
    this.form().patchValue(objSpesa);
  }

  loadSalvadanai() {
    this.salvadanaiService.getSalvadanai().subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.show('success', 'Successo!', res.message);
          this.salvadanaiList.set(res.data);
        }
      },
      error: (err) => {
        this.toastService.showErrorHttp(err.message);
        console.error(err);
      },
    });
  }

  onRipristina() {
    const salvadanaio = this.salvadanaiList().find(
      (s) => s.idSalvadanaio === this.form().get('idSalvadanaio')?.value,
    );
    if (salvadanaio) this.form().patchValue(salvadanaio);
  }

  salva(objSalvadanaio?: SalvadanaiModel) {
    let objTosave: SalvadanaiModel;
    if (objSalvadanaio) {
      objTosave = objSalvadanaio;
    } else {
      if (this.form().valid) objTosave = this.form().value as SalvadanaiModel;
      else {
        this.toastService.show('warn', 'Attenzione!', 'Form non valido, controllare i campi');
        return;
      }
    }
    this.salvadanaiService.saveSalvadanaio(objTosave).subscribe({
      next: (res) => {
        if (res.success) {
          if (this.checkTipeForm() === 'nuovo')
            this.salvadanaiList.update((list) => [...list, res.data]);
          else
            this.salvadanaiList.update((list) =>
              list.map((s) => (s.idSalvadanaio === res.data.idSalvadanaio ? res.data : s)),
            );

          this.toastService.show('success', 'Successo!', res.message);
          this.onAnnullaOrNew(false);
        }
      },
      error: (err) => {
        this.toastService.showErrorHttp(err.message);
        console.error(err);
      },
    });
  }

  onToggleAttivo(row: SalvadanaiModel, value: boolean) {
    this.salvadanaiService.updateAttivo(row.idSalvadanaio, value).subscribe({
      next: (res) => {
        if (res.success) {
          this.salvadanaiList.update((list) =>
            list.map((s) => (s.idSalvadanaio === row.idSalvadanaio ? { ...s, attivo: value } : s)),
          );
          this.toastService.show('success', 'Successo!', res.message);
        }
      },
      error: (err) => {
        this.toastService.showErrorHttp(err.error?.message);
        console.error(err);
      },
    });
  }

  onApriDialog(row: SalvadanaiModel) {
    this.salvadanaiDialog.set(row);
    this.euroAccumulo.set(null);
    this.dialogVisible.set(true);
  }

  onChiudiDialog() {
    this.dialogVisible.set(false);
    this.salvadanaiDialog.set(null);
    this.euroAccumulo.set(null);
  }

  onConfermaAccumulo() {
    const salvadanaio = this.salvadanaiDialog();
    const euro = this.euroAccumulo();

    if (!salvadanaio?.idSalvadanaio || !euro || euro === 0) return;

    this.salvadanaiService.accumula(salvadanaio.idSalvadanaio, euro).subscribe({
      next: (res) => {
        if (res.success) {
          this.salvadanaiList.update((list) =>
            list.map((s) =>
              s.idSalvadanaio === salvadanaio.idSalvadanaio
                ? { ...s, euroAccumulati: (Number(s.euroAccumulati) || 0) + euro }
                : s,
            ),
          );
          this.toastService.show('success', 'Successo!', res.message);
          this.onChiudiDialog();
        }
      },
      error: (err) => {
        this.toastService.showErrorHttp(err.error?.message);
        console.error(err);
      },
    });
  }
}
