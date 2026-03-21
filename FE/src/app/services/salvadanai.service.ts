import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalvadanaiModel } from '../models/salvadanai.model';
import { ApiResponse } from '../models/utlils.model';
import { API_BASE } from '../core/api.config';

@Injectable({ providedIn: 'root' })
export class SalvadanaiService {
  private http = inject(HttpClient);
  private baseUrl = `${API_BASE}/api/salvadanaio`;

  saveSalvadanaio(request: SalvadanaiModel): Observable<ApiResponse<SalvadanaiModel>> {
    return this.http.post<ApiResponse<SalvadanaiModel>>(`${this.baseUrl}/salva`, request);
  }

  getSalvadanai(): Observable<ApiResponse<SalvadanaiModel[]>> {
    return this.http.get<ApiResponse<SalvadanaiModel[]>>(`${this.baseUrl}/lista`);
  }

  deleteSalvadanaio(idSalvadanaio: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/elimina/${idSalvadanaio}`);
  }

  updateAttivo(idSalvadanaio: number, attivo: boolean): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(
      `${this.baseUrl}/attivo/${idSalvadanaio}?attivo=${attivo}`,
      {},
    );
  }

  accumula(idSalvadanaio: number, euro: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(
      `${this.baseUrl}/accumula/${idSalvadanaio}?euro=${euro}`,
      {},
    );
  }
}
