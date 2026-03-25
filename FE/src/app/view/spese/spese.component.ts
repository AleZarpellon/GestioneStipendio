import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SpeseService } from '../../services/spese.service';
import { ToastService } from '../../services/toast.service';
import { Button } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { SpeseModel } from '../../models/spese.model';
import { euroValidator, positiveEuroValidator } from '../../shared/validators/euro.validator';

@Component({
  selector: 'app-spese.component',
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    ReactiveFormsModule,
    InputText,
    ToggleSwitchModule,
    Button,
    TooltipModule,
  ],
  templateUrl: './spese.component.html',
  styleUrl: './spese.component.css',
  standalone: true,
})
export class SpeseComponent implements OnInit {
  private fb = inject(FormBuilder);
  private speseService = inject(SpeseService);
  private toastService = inject(ToastService);
  checkTipeForm = signal<string>('');
  speseList = signal<SpeseModel[]>([]);
  cols = signal<string[]>(['descrizione', 'euro', 'continuative', 'maxValore', 'azioni']);
  form = signal<FormGroup>(
    this.fb.group({
      idSpesa: [null],
      descrizione: ['', Validators.required],
      euro: [null, [Validators.required, euroValidator()]],
      continuative: [false],
      maxValore: [null, positiveEuroValidator()],
    }),
  );
  totale = computed<number>(() =>
    this.speseList().reduce((acc, s) => acc + (Number(s.euro) || 0), 0),
  );

  ngOnInit(): void {
    this.loadSpese();

    this.form()
      .get('continuative')
      ?.valueChanges.subscribe((value: boolean) => {
        if (!value) {
          this.form().get('maxValore')?.disable();
          this.form().get('maxValore')?.setValue(null);
        } else {
          this.form().get('maxValore')?.enable();
        }
      });
  }

  salva() {
    if (this.form().valid) {
      this.speseService.saveSpesa(this.form().value as SpeseModel).subscribe({
        next: (res) => {
          if (res.success) {
            if (this.checkTipeForm() === 'nuovo')
              this.speseList.update((list) => [...list, res.data]);
            else
              this.speseList.update((list) =>
                list.map((s) => (s.idSpesa === res.data.idSpesa ? res.data : s)),
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
    } else {
      this.toastService.show('warn', 'Attenzione!', 'Form non valido, controllare i campi');
    }
  }

  onDelete(idSpesa: number) {
    this.speseService.deleteSpesa(idSpesa).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.show('success', 'Successo!', res.message);
          this.speseList.update((list) => list.filter((s) => s.idSpesa !== idSpesa));
        }
      },
      error: (err) => {
        this.toastService.showErrorHttp(err.message);
        console.error(err);
      },
    });
  }

  onEdit(objSpesa: SpeseModel) {
    this.checkTipeForm.set('modifica');
    this.form().patchValue(objSpesa);
  }

  loadSpese() {
    this.speseService.getSpese().subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.show('success', 'Successo!', res.message);
          this.speseList.set(res.data);
        }
      },
      error: (err) => {
        this.toastService.showErrorHttp(err.message);
        console.error(err);
      },
    });
  }

  onAnnullaOrNew(isNew: boolean) {
    if (isNew) this.checkTipeForm.set('nuovo');
    else this.checkTipeForm.set('');

    // resetta il form per una nuova spesa
    this.form().reset({
      idSpesa: null,
      descrizione: '',
      euro: 0,
      maxValore: null,
      continuative: false,
    });
  }

  onRipristina() {
    const spesa = this.speseList().find((s) => s.idSpesa === this.form().get('idSpesa')?.value);
    if (spesa) this.form().patchValue(spesa);
  }

  updateEuroMaxValore() {
    this.form().get('euro')?.setValue(this.form().get('maxValore')?.value);
  }
}
