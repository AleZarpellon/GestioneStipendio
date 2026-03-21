import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../core/api.config';
import { BudgetSettimanaleResponse } from '../models/budget-settimanale.model';
import { ApiResponse } from '../models/utlils.model';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class BudgetSettimanaleService {
  private http = inject(HttpClient);
  private baseUrl = `${API_BASE}/api/budget-settimanale`;

  getBudgetList(): Observable<ApiResponse<BudgetSettimanaleResponse[]>> {
    return this.http.get<ApiResponse<BudgetSettimanaleResponse[]>>(`${this.baseUrl}/lista`);
  }

  updateSpeso(
    idSettimana: number,
    speso: number,
  ): Observable<ApiResponse<BudgetSettimanaleResponse[]>> {
    return this.http.patch<ApiResponse<BudgetSettimanaleResponse[]>>(
      `${this.baseUrl}/speso/${idSettimana}?speso=${speso}`,
      {},
    );
  }
}
