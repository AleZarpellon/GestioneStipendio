export interface StipendioRequest {
  idStipendio: number | null;
  stipendio: number;
  dataInizio: Date | null;
}

export interface StipendioResponse {
  idStipendio: number;
  stipendio: number;
  dataInizio: Date;
  dataFine: Date;
  nrSettimane: number;
}
