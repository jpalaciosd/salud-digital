// ── Users ────────────────────────────────────
export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  documento: string;
  tipoDocumento: string;
  rol: "paciente" | "medico" | "estudiante" | "admin";
  telefono?: string;
  avatarUrl?: string;
  descripcionProfesional?: string;
  createdAt: string;
}

// ── Citas (Appointments) ─────────────────────
export interface Cita {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  medicoId?: string;
  medicoNombre: string;
  especialidad: string;
  fecha: string;        // ISO date
  hora: string;         // "10:00"
  tipo: "presencial" | "teleconsulta" | "laboratorio";
  estado: "pendiente" | "confirmada" | "completada" | "cancelada";
  motivo: string;
  notas?: string;
  createdAt: string;
}

// ── Fórmulas (Prescriptions) ─────────────────
export interface Formula {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  medicoId: string;
  medicoNombre: string;
  medicamentos: Medicamento[];
  diagnostico: string;
  observaciones?: string;
  estado: "activa" | "por_renovar" | "vencida" | "cancelada";
  fechaEmision: string;
  fechaVencimiento: string;
  createdAt: string;
}

export interface Medicamento {
  nombre: string;
  dosis: string;
  frecuencia: string;
  via: string;
  duracionDias: number;
  cantidad: string;
}

// ── Historia Clínica ─────────────────────────
export interface HistoriaClinica {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  medicoId: string;
  medicoNombre: string;
  tipo: string;           // "Control", "Consulta", "Laboratorio", etc.
  diagnostico: string;
  notas: string;
  signos?: {
    presion?: string;
    peso?: string;
    glucosa?: string;
    temperatura?: string;
    saturacion?: string;
  };
  fecha: string;
  createdAt: string;
}

// ── Cursos ───────────────────────────────────
export interface Curso {
  id: string;
  titulo: string;
  descripcion: string;
  instructor: string;
  categoria: string;
  modulos: number;
  duracionHoras: number;
  imagen: string;
  precio: number;
  createdAt: string;
}

// ── Inscripciones (Enrollments) ──────────────
export interface Inscripcion {
  id: string;
  cursoId: string;
  cursoTitulo: string;
  userId: string;
  userNombre: string;
  progreso: number;         // 0-100
  modulosCompletados: number;
  estado: "activo" | "completado" | "pausado";
  fechaInscripcion: string;
  ultimaActividad: string;
}

// ── Pagos (Nequi) ────────────────────────────
export type EstadoPago =
  | "pendiente_ia"
  | "aprobado_auto"
  | "revision_manual"
  | "aprobado_manual"
  | "rechazado"
  | "canjeado";

export interface IaData {
  monto?: number;
  titular?: string;
  last4?: string;
  fecha?: string;
  referencia?: string;
  confianza: number;        // 0-1
  motivosDuda?: string[];
}

export interface Pago {
  id: string;
  userId: string;
  userNombre: string;
  userEmail: string;
  cursoId: string;
  cursoTitulo: string;
  montoEsperado: number;
  imagenUrl: string;
  iaData?: IaData;
  estado: EstadoPago;
  codigoCanje: string | null;
  motivoRechazo?: string;
  adminRevisor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PagoRefIndex {
  id: string;        // referencia usada como ID
  pagoId: string;
  createdAt: string;
}
