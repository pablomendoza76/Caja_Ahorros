import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../env/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrestamoService {
  private baseUrl = `${environment.supabaseUrl}/rest/v1/prestamos`;
  private movimientosUrl = `${environment.supabaseUrl}/rest/v1/movimientos`;

  private headers = new HttpHeaders({
    apikey: environment.supabaseKey,
    Authorization: `Bearer ${environment.supabaseKey}`,
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  /** Obtener todos los préstamos */
  async obtenerPrestamos(): Promise<any[]> {
    const res$ = this.http.get<any[]>(this.baseUrl, { headers: this.headers });
    return await firstValueFrom(res$);
  }

  /** Obtener préstamo por ID */
  async obtenerPrestamoPorId(id: number): Promise<any> {
    const params = new HttpParams().set('id', `eq.${id}`);
    const res$ = this.http.get<any[]>(this.baseUrl, {
      headers: this.headers,
      params
    });
    const datos = await firstValueFrom(res$);
    return datos[0] ?? null;
  }

  /** Crear préstamo */
  async crearPrestamo(prestamo: any): Promise<any> {
    const res$ = this.http.post(this.baseUrl, prestamo, { headers: this.headers });
    return await firstValueFrom(res$);
  }

  /** Editar préstamo */
  async editarPrestamo(id: number, prestamo: any): Promise<any> {
    const url = `${this.baseUrl}?id=eq.${id}`;
    const res$ = this.http.patch(url, prestamo, { headers: this.headers });
    return await firstValueFrom(res$);
  }

  /** Eliminar préstamo */
  async eliminarPrestamo(id: number): Promise<any> {
    const url = `${this.baseUrl}?id=eq.${id}`;
    const res$ = this.http.delete(url, { headers: this.headers });
    return await firstValueFrom(res$);
  }

  /** Obtener préstamos aceptados (activos) */
  async obtenerPrestamosActivos(): Promise<any[]> {
    const params = new HttpParams().set('estado', 'eq.aceptado');
    const res$ = this.http.get<any[]>(this.baseUrl, {
      headers: this.headers,
      params
    });
    return await firstValueFrom(res$);
  }

  /** Obtener resumen de pagos de un préstamo */
  async obtenerResumenPago(prestamoId: number): Promise<{ monto_total: number, monto_pagado: number }> {
    const prestamo = await this.obtenerPrestamoPorId(prestamoId);

    const params = new HttpParams()
      .set('prestamo_id', `eq.${prestamoId}`)
      .set('tipo', 'eq.pago_prestamo')
      .set('select', 'monto');

    const pagos$ = this.http.get<any[]>(this.movimientosUrl, {
      headers: this.headers,
      params
    });

    const pagos = await firstValueFrom(pagos$);
    const montoPagado = pagos.reduce((suma, pago) => suma + Number(pago.monto), 0);

    return {
      monto_total: Number(prestamo?.monto ?? 0),
      monto_pagado: montoPagado
    };
  }

  /** Actualizar el saldo restante de un préstamo */
  async actualizarSaldoRestante(data: { id: number, saldo_restante: number }): Promise<any> {
    const url = `${this.baseUrl}?id=eq.${data.id}`;
    const body = { saldo_restante: data.saldo_restante };
    const res$ = this.http.patch(url, body, { headers: this.headers });
    return await firstValueFrom(res$);
  }

  /** Obtener préstamos por estado: 'aceptado', 'rechazado', 'en_espera', etc. */
async obtenerPrestamosPorEstado(estado: string): Promise<any[]> {
  const params = new HttpParams()
    .set('estado', `eq.${estado}`)
    .set(
      'select',
      `
        id, monto, interes, plazo_meses, estado, fecha_aprobacion, saldo_restante,
        socio:socio_id(nombre, apellido, correo, telefono)
      `.replace(/\s+/g, '')
    );

  const res$ = this.http.get<any[]>(this.baseUrl, {
    headers: this.headers,
    params,
  });

  return await firstValueFrom(res$);
}


/** Cambiar el estado de un préstamo */
async cambiarEstadoPrestamo(id: number, nuevoEstado: 'aceptado' | 'rechazado' | 'en_espera' | 'generado'): Promise<any> {
  const url = `${this.baseUrl}?id=eq.${id}`;
  const body = { estado: nuevoEstado };
  const res$ = this.http.patch(url, body, { headers: this.headers });
  return await firstValueFrom(res$);
}


}
