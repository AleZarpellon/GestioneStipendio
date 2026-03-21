import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RisparmioResponse } from '../models/risparmio.model';
import { ApiResponse } from '../models/utlils.model';
import { API_BASE } from '../core/api.config';

@Injectable({ providedIn: 'root' })
export class RisparmioService {
  private http = inject(HttpClient);
  private baseUrl = `${API_BASE}/api/risparmio`;

  getRisparmi(): Observable<ApiResponse<RisparmioResponse[]>> {
    return this.http.get<ApiResponse<RisparmioResponse[]>>(`${this.baseUrl}/lista`);
  }
}
