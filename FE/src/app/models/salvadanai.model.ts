export interface SalvadanaiModel {
  idSalvadanaio: number;
  descrizione: string;
  euro: number;
  quotaFinale: number | null;
  euroAccumulati: number | null;
  attivo: boolean;
}
