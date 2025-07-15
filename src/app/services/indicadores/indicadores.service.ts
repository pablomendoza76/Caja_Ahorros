// src/app/services/indicadores.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndicadoresService {
  private headers = new HttpHeaders({
    apikey: environment.supabaseKey,
    Authorization: `Bearer ${environment.supabaseKey}`
  });

  constructor(private http: HttpClient) {}

  obtenerBalanceGeneral(): Observable<any> {
    return this.http.get<any[]>(`${environment.supabaseUrl}/rest/v1/vista_balance_general`, {
      headers: this.headers,
      params: {
        select: '*'
      }
    });
  }
}
