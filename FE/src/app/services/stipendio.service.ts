import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StipendioRequest, StipendioResponse } from '../models/stipendio.model';
import { ApiResponse } from '../models/utlils.model';
import { ResocontoResponse } from '../models/resoconto.model';
import { API_BASE } from '../core/api.config';

@Injectable({ providedIn: 'root' })
export class StipendioService {
  private http = inject(HttpClient);
  private baseUrl = `${API_BASE}/api/stipendio`;

  saveStipendio(request: StipendioRequest): Observable<ApiResponse<StipendioResponse>> {
    const body = {
      ...request,
      dataInizio:
        request.dataInizio instanceof Date
          ? request.dataInizio.toISOString().split('T')[0]
          : request.dataInizio,
    };
    return this.http.post<ApiResponse<StipendioResponse>>(`${this.baseUrl}/salva`, body);
  }

  getStipendio(): Observable<ApiResponse<StipendioResponse>> {
    return this.http.get<ApiResponse<StipendioResponse>>(`${this.baseUrl}/get`);
  }

  getResoconto(): Observable<ApiResponse<ResocontoResponse>> {
    return this.http.get<ApiResponse<ResocontoResponse>>(`${this.baseUrl}/getResoconto`);
  }
}
