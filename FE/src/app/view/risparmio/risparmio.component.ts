import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RisparmioResponse } from '../../models/risparmio.model';
import { RisparmioService } from '../../services/risparmio.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-risparmio.component',
  imports: [CommonModule, TableModule, CardModule, Select, FormsModule],
  templateUrl: './risparmio.component.html',
  styleUrl: './risparmio.component.css',
  standalone: true,
})
export class RisparmioComponent {
  risparmioService = inject(RisparmioService);
  risparmioList = signal<RisparmioResponse[]>([]);
  periodoSelezionato = signal<string>('');
  cols = signal<string[]>(['descrizione', 'euro', 'periodo']);
  totale = computed<number>(() =>
    this.risparmioListFiltrata().reduce((acc, r) => acc + (Number(r.euro) || 0), 0),
  );

  periodoOptions = computed(() => {
    const periodi = [...new Set(this.risparmioList().map((r) => r.periodo))];
    return [
      { label: 'Tutti i periodi', value: '' },
      ...periodi.map((p) => ({ label: p, value: p })),
    ];
  });

  risparmioListFiltrata = computed(() => {
    const periodo = this.periodoSelezionato();
    if (!periodo) return this.risparmioList();
    return this.risparmioList().filter((r) => r.periodo === periodo);
  });

  ngOnInit(): void {
    this.risparmioService.getRisparmi().subscribe({
      next: (res) => {
        if (res.success) this.risparmioList.set(res.data);
      },
      error: (err) => console.error(err),
    });
  }
}
