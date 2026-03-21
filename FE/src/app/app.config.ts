import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import { MessageService } from 'primeng/api';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { spinnerInterceptor } from './shared/spinner/spinner.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([spinnerInterceptor])),
    provideRouter(routes),
    provideAnimations(),
    MessageService,
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          //aggiunto per evitare lo switch automatico alla dark mode di primeng
          darkModeSelector: '.use-dark',
        },
      },
    }),
  ],
};
