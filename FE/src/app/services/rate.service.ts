import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RateModel } from '../models/rate.model';
import { ApiResponse } from '../models/utlils.model';
import { API_BASE } from '../core/api.config';

@Injectable({
  providedIn: 'root',
})
export class RateService {
  private http = inject(HttpClient);
  private baseUrl = `${API_BASE}/api/rate`;

  saveRate(request: RateModel): Observable<ApiResponse<RateModel>> {
    return this.http.post<ApiResponse<RateModel>>(`${this.baseUrl}/salva`, request);
  }

  getRate(): Observable<ApiResponse<RateModel[]>> {
    return this.http.get<ApiResponse<RateModel[]>>(`${this.baseUrl}/lista`);
  }

  deleteRate(idRate: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/elimina/${idRate}`);
  }
}
