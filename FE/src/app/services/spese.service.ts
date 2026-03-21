import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/utlils.model';
import { SpeseModel } from '../models/spese.model';
import { API_BASE } from '../core/api.config';

@Injectable({
  providedIn: 'root',
})
export class SpeseService {
  private http = inject(HttpClient);
  private baseUrl = `${API_BASE}/api/spese`;

  saveSpesa(request: SpeseModel): Observable<ApiResponse<SpeseModel>> {
    return this.http.post<ApiResponse<SpeseModel>>(`${this.baseUrl}/salva`, request);
  }

  getSpese(): Observable<ApiResponse<SpeseModel[]>> {
    return this.http.get<ApiResponse<SpeseModel[]>>(`${this.baseUrl}/lista`);
  }

  deleteSpesa(idSpesa: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/elimina/${idSpesa}`);
  }
}
