import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/utlils.model';
import { API_BASE } from '../core/api.config';

@Injectable({ providedIn: 'root' })
export class GestioneService {
  private http = inject(HttpClient);
  private baseUrl = `${API_BASE}/api/gestione`;

  nuovaGestione(): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/nuova-gestione`, {});
  }
}
