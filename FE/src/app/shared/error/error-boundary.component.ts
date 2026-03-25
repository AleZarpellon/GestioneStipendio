import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-error-boundary',
  standalone: true,
  imports: [CommonModule, CardModule, Button],
  template: `
    <div class="error-boundary-container">
      @if (hasError) {
        <p-card class="error-card">
          <div class="text-center p-4">
            <h2 class="text-red-600 mb-4">Oops! Qualcosa è andato storto</h2>
            <p class="text-body mb-4">
              Si è verificato un errore in questa sezione dell'applicazione.
            </p>
            <p-button
              label="Riprova"
              icon="pi pi-refresh"
              styleClass="btn-primary"
              (onClick)="retry()"
            ></p-button>
          </div>
        </p-card>
      } @else {
        <ng-content></ng-content>
      }
    </div>
  `,
  styles: [
    `
      .error-boundary-container {
        width: 100%;
        min-height: 200px;
      }
      .error-card {
        max-width: 500px;
        margin: 0 auto;
      }
    `,
  ],
})
export class ErrorBoundaryComponent implements OnInit, OnDestroy {
  hasError = false;

  ngOnInit() {
    // In Angular non abbiamo error boundaries come in React
    // Questo componente serve principalmente come wrapper visuale
    // Gli errori vengono catturati dal GlobalErrorHandler
  }

  ngOnDestroy() {
    this.hasError = false;
  }

  retry() {
    this.hasError = false;
    // In un'implementazione più avanzata, potremmo ricaricare il componente
    window.location.reload();
  }

  // Metodo per mostrare l'errore manualmente (chiamato da componenti padre se necessario)
  showError() {
    this.hasError = true;
  }
}
