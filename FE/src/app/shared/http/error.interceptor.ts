import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP Error:', error);

      switch (error.status) {
        case 401:
          return throwError(() => new Error('Sessione scaduta. Effettua nuovamente il login.'));
        case 403:
          return throwError(() => new Error('Accesso negato'));
        case 500:
          return throwError(() => new Error('Errore del server. Riprova più tardi.'));
        default:
          return throwError(() => error);
      }
    }),
  );
};
