// ── Tipos del Ecosistema Clínico ISSI (SaaS Multi-tenant) ──

// ── Organización (tenant) ──
export interface Organizacion {
  id: string;
  nombre: string;
  nit: string;
  tipo: "ips" | "eps" | "consultorio" | "universidad";
  logo_url?: string;
  plan: "basico" | "profesional" | "enterprise";
  max_usuarios: number;
  max_consultas_mes: number;
  activa: boolean;
  config: Record<string, unknown>;
  created_at: string;
}

export interface OrgMiembro {
  id: string;
  org_id: string;
  user_id: string;
  rol_org: "admin_org" | "medico" | "enfermero" | "auditor" | "recepcion";
  activo: boolean;
  created_at: string;
}

// ── Perfil clínico extendido ──
export interface PerfilPaciente {
  id: string;
  user_id: string;
  documento_tipo: "CC" | "TI" | "CE" | "PA" | "RC";
  documento_numero: string;
  fecha_nacimiento: string;
  sexo: "M" | "F" | "O";
  eps: string;
  direccion: string;
  ubicacion_actual?: string;
  telefono: string;
  contacto_emergencia?: {
    nombre: string;
    telefono: string;
    parentesco: string;
  };
  antecedentes: Antecedentes;
  habitos?: Record<string, string>;
  created_at: string;
}

export interface Antecedentes {
  patologicos: string[];
  quirurgicos: string[];
  farmacologicos: string[];
  alergicos: string[];
  familiares: string[];
  gineco_obstetricos?: string[];
  otros?: string;
}

export interface PerfilMedico {
  id: string;
  user_id: string;
  rethus: string;
  especialidad: string;
  institucion: string;
  firma_url?: string;
  disponibilidad: FranjaHoraria[];
  created_at: string;
}

export interface FranjaHoraria {
  dia: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=domingo
  hora_inicio: string; // "08:00"
  hora_fin: string;    // "12:00"
}

// ── Consentimiento Informado ──
export interface Consentimiento {
  id: string;
  org_id: string;
  paciente_id: string;
  consulta_id?: string;
  tipo: "telemedicina" | "datos_personales" | "aiepi";
  aceptado: boolean;
  texto_mostrado: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// ── Consulta ──
export type TipoAtencion =
  | "teleorientacion"
  | "teleconsulta_sincronica"
  | "teleconsulta_asincronica"
  | "teleexperticia"
  | "presencial";

export type EstadoConsulta =
  | "agendada"
  | "en_curso"
  | "completada"
  | "cancelada"
  | "no_asistio";

export interface Consulta {
  id: string;
  org_id: string;
  paciente_id: string;
  medico_id?: string;
  consentimiento_id?: string;
  tipo_atencion: TipoAtencion;
  medio?: "video" | "chat" | "presencial";
  estado: EstadoConsulta;
  fecha_programada: string;
  duracion_min?: number;
  ubicacion_paciente?: string;
  ubicacion_medico?: string;
  plataforma: string;
  calidad_conexion?: string;
  sala_video_url?: string;
  notas?: string;
  created_at: string;
  updated_at: string;
}

// ── Historia Clínica Electrónica ──
export interface HCERegistro {
  id: string;
  org_id: string;
  consulta_id: string;
  version: number;
  motivo_consulta: string;
  enfermedad_actual: string;
  antecedentes_consulta: Antecedentes;
  revision_sistemas: RevisionSistemas;
  examen_fisico: ExamenFisico;
  signos_vitales: SignosVitales;
  limitaciones_teleconsulta?: string;
  diagnosticos: Diagnostico[];
  plan_manejo: PlanManejo;
  seguimiento?: Seguimiento;
  alertas_riesgos?: AlertasRiesgos;
  created_by: string;
  created_at: string;
}

export interface RevisionSistemas {
  cardiovascular: { presente: boolean; observaciones?: string };
  respiratorio: { presente: boolean; observaciones?: string };
  gastrointestinal: { presente: boolean; observaciones?: string };
  genitourinario: { presente: boolean; observaciones?: string };
  neurologico: { presente: boolean; observaciones?: string };
  musculoesqueletico: { presente: boolean; observaciones?: string };
  piel: { presente: boolean; observaciones?: string };
  endocrino: { presente: boolean; observaciones?: string };
  hematologico: { presente: boolean; observaciones?: string };
  psiquiatrico: { presente: boolean; observaciones?: string };
}

export interface ExamenFisico {
  estado_general: string;
  conciencia: string;
  dificultad_respiratoria: boolean;
  coloracion: string;
  observaciones?: string;
  limitado_por_virtualidad: boolean;
}

export interface SignosVitales {
  ta_sistolica?: number;
  ta_diastolica?: number;
  frecuencia_cardiaca?: number;
  frecuencia_respiratoria?: number;
  temperatura?: number;
  saturacion_o2?: number;
  peso?: number;
  talla?: number;
  autoreportados: boolean;
}

export interface Diagnostico {
  cie10: string;
  descripcion: string;
  tipo: "principal" | "diferencial";
}

export interface PlanManejo {
  farmacologico: string;
  no_farmacologico: string;
  educacion: string;
  signos_alarma: string;
}

export interface Seguimiento {
  control_en_dias?: number;
  remision?: string;
  nivel_atencion?: string;
}

export interface AlertasRiesgos {
  red_flags: string[];
  remision_urgente: boolean;
  motivo_remision?: string;
}

// ── Fórmula Médica ──
export interface Formula {
  id: string;
  org_id: string;
  consulta_id: string;
  medico_id: string;
  paciente_id: string;
  medicamentos: Medicamento[];
  firma_medico_url?: string;
  pdf_url?: string;
  created_at: string;
}

export interface Medicamento {
  nombre: string;
  dosis: string;
  frecuencia: string;
  via: string;
  duracion: string;
}

// ── Paraclínicos ──
export interface Paraclinico {
  id: string;
  org_id: string;
  consulta_id: string;
  medico_id: string;
  paciente_id: string;
  tipo_orden: string;
  justificacion: string;
  prioridad: "normal" | "urgente";
  resultado_url?: string;
  resultado_datos?: Record<string, unknown>;
  estado: "ordenado" | "en_proceso" | "completado";
  created_at: string;
  completado_at?: string;
}

// ── Incapacidad ──
export interface Incapacidad {
  id: string;
  org_id: string;
  consulta_id: string;
  medico_id: string;
  paciente_id: string;
  dias: number;
  diagnostico_cie10: string;
  diagnostico_desc: string;
  fecha_inicio: string;
  fecha_fin: string;
  pdf_url?: string;
  created_at: string;
}

// ── AIEPI ──
export interface AiepiEvaluacion {
  id: string;
  org_id: string;
  consulta_id?: string;
  paciente_id: string;
  profesional_id: string;

  // Identificación pediátrica
  edad_meses: number;
  peso: number;
  talla?: number;
  cuidador_nombre: string;
  cuidador_parentesco: string;

  // Signos de peligro
  signos_peligro: SignosPeligro;
  tiene_signo_peligro: boolean;

  // Síntomas
  sintomas_respiratorio?: SintomaRespiratorio;
  sintomas_diarrea?: SintomaDiarrea;
  sintomas_fiebre?: SintomaFiebre;
  sintomas_oido?: SintomaOido;

  // Nutrición
  nutricion: Nutricion;

  // Vacunación
  vacunacion: Vacunacion;

  // Clasificación automática
  clasificaciones: ClasificacionAiepi[];

  // Plan
  plan_tratamiento: PlanAiepi;

  // Consejería obligatoria
  consejeria: ConsejeriaAiepi;
  consejeria_completa: boolean;

  // Seguimiento
  fecha_control?: string;
  motivo_reconsulta?: string;

  version: number;
  created_at: string;
}

export interface SignosPeligro {
  no_bebe_lacta: boolean;
  vomita_todo: boolean;
  convulsiones: boolean;
  letargico_inconsciente: boolean;
}

export interface SintomaRespiratorio {
  presente: boolean;
  duracion_dias?: number;
  frecuencia_respiratoria?: number;
  tiraje_subcostal: boolean;
  estridor_reposo: boolean;
}

export interface SintomaDiarrea {
  presente: boolean;
  duracion_dias?: number;
  sangre_heces: boolean;
  ojos_hundidos: boolean;
  pliegue_lento: boolean;
  sed_aumentada: boolean;
  irritable: boolean;
}

export interface SintomaFiebre {
  presente: boolean;
  duracion_dias?: number;
  temperatura?: number;
  zona_endemica: boolean;
  rigidez_nuca: boolean;
}

export interface SintomaOido {
  dolor: boolean;
  supuracion: boolean;
  duracion_dias?: number;
}

export interface Nutricion {
  peso_edad_zscore?: number;
  edema_bilateral: boolean;
  palidez_palmar: boolean;
  palidez_grave: boolean;
}

export interface Vacunacion {
  esquema_completo: boolean;
  vacunas_faltantes: string[];
}

export type NivelClasificacion = "rojo" | "amarillo" | "verde";

export interface ClasificacionAiepi {
  tipo: string;
  nivel: NivelClasificacion;
  descripcion: string;
  accion: string;
}

export interface PlanAiepi {
  medicamentos: string[];
  hidratacion_plan?: "A" | "B" | "C";
  manejo_fiebre?: string;
  zinc: boolean;
  otros: string[];
}

export interface ConsejeriaAiepi {
  signos_alarma_explicados: boolean;
  alimentacion: boolean;
  hidratacion: boolean;
  lactancia: boolean;
  cuando_volver: boolean;
  control_fecha?: string;
}

// ── Audit Log ──
export interface AuditLog {
  id: string;
  org_id?: string;
  user_id: string;
  rol: string;
  accion: "CREATE" | "READ" | "UPDATE" | "DELETE";
  recurso_tipo: string;
  recurso_id?: string;
  datos_antes?: Record<string, unknown>;
  datos_despues?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}
