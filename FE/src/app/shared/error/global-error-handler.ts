import { Component, ErrorHandler, inject, Injectable } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  private toastService = inject(ToastService);

  handleError(error: any): void {
    console.error('Global Error Handler:', error);

    // Log dell'errore per debugging
    const errorMessage = error?.message || 'Errore sconosciuto';
    const errorStack = error?.stack || '';

    // Mostra toast di errore all'utente
    this.toastService.show(
      'error',
      'Errore Applicazione',
      'Si è verificato un errore imprevisto. Riprova o contatta il supporto.',
    );

    // In produzione, potresti voler inviare l'errore a un servizio di logging
    // this.loggingService.logError(errorMessage, errorStack);
  }
}
