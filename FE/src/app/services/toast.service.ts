import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private messageService: MessageService) {}

  // Metodo generico
  show(severity: 'success' | 'info' | 'warn' | 'error', summaryKey: string, detailKey: string) {
    this.messageService.add({
      severity: severity,
      summary: summaryKey,
      detail: detailKey,
    });
  }

  showErrorHttp(detailKey?: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Errore!',
      detail: detailKey || 'Errore sconosciuto',
    });
  }
}
