import { PrestamoService } from '../services/prestamos.service/prestamo.service';

export const PrestamosMapper = {
  /**
   * Cargar préstamos filtrados por estado ('aceptado', 'rechazado', etc.)
   */
  async obtenerPrestamosPorEstado(prestamoService: PrestamoService, estado: string): Promise<any[]> {
    const prestamos = await prestamoService.obtenerPrestamosPorEstado(estado);
    console.log(`📥 Préstamos recibidos (${estado}):`, prestamos);

    const resultadoFinal = prestamos.map((p) => {
      const socio = p.socio ?? {};

      return {
        id: p.id,
        nombre_completo: `${socio.nombre ?? ''} ${socio.apellido ?? ''}`.trim(),
        correo: socio.correo ?? 'No disponible',
        telefono: socio.telefono ?? 'No disponible',
        monto: `$${Number(p.monto).toFixed(2)}`,
        monto_pendiente: `$${Number(p.saldo_restante).toFixed(2)}`,
        interes: `${p.interes}%`,
        plazo: `${p.plazo_meses} meses`,
        estado: p.estado?.toUpperCase() ?? '',
        fecha_aprobacion: p.fecha_aprobacion?.split('T')[0] ?? 'N/A',
      };
    });

    console.log('📤 Datos mapeados enviados al componente:', resultadoFinal);
    return resultadoFinal;
  }
};
