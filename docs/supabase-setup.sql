-- ══════════════════════════════════════════════════════════════
-- ISSI — Ecosistema de Telemedicina SaaS
-- Setup SQL para Supabase (ejecutar en SQL Editor)
-- ══════════════════════════════════════════════════════════════

-- ── Organizaciones (tenants) ──
CREATE TABLE IF NOT EXISTS organizaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  nit TEXT UNIQUE,
  tipo TEXT DEFAULT 'ips' CHECK (tipo IN ('ips', 'eps', 'consultorio', 'universidad')),
  logo_url TEXT,
  plan TEXT DEFAULT 'basico' CHECK (plan IN ('basico', 'profesional', 'enterprise')),
  max_usuarios INTEGER DEFAULT 10,
  max_consultas_mes INTEGER DEFAULT 100,
  activa BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Miembros de organización ──
CREATE TABLE IF NOT EXISTS org_miembros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES organizaciones(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rol_org TEXT NOT NULL CHECK (rol_org IN ('admin_org', 'medico', 'enfermero', 'auditor', 'recepcion')),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(org_id, user_id)
);

-- ── Perfiles clínicos de pacientes ──
CREATE TABLE IF NOT EXISTS perfiles_paciente (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  documento_tipo TEXT CHECK (documento_tipo IN ('CC', 'TI', 'CE', 'PA', 'RC')),
  documento_numero TEXT,
  fecha_nacimiento DATE,
  sexo TEXT CHECK (sexo IN ('M', 'F', 'O')),
  eps TEXT,
  direccion TEXT,
  ubicacion_actual TEXT,
  telefono TEXT,
  contacto_emergencia JSONB,
  antecedentes JSONB DEFAULT '{"patologicos":[],"quirurgicos":[],"farmacologicos":[],"alergicos":[],"familiares":[]}',
  habitos JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Perfiles de médicos ──
CREATE TABLE IF NOT EXISTS perfiles_medico (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  rethus TEXT,
  especialidad TEXT,
  institucion TEXT,
  firma_url TEXT,
  disponibilidad JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Consentimientos informados (inmutable) ──
CREATE TABLE IF NOT EXISTS consentimientos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizaciones(id),
  paciente_id UUID NOT NULL,
  consulta_id UUID,
  tipo TEXT NOT NULL CHECK (tipo IN ('telemedicina', 'datos_personales', 'aiepi')),
  aceptado BOOLEAN NOT NULL,
  texto_mostrado TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Consultas ──
CREATE TABLE IF NOT EXISTS consultas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizaciones(id),
  paciente_id UUID NOT NULL,
  medico_id UUID,
  consentimiento_id UUID REFERENCES consentimientos(id),
  tipo_atencion TEXT NOT NULL CHECK (tipo_atencion IN ('teleorientacion', 'teleconsulta_sincronica', 'teleconsulta_asincronica', 'teleexperticia', 'presencial')),
  medio TEXT CHECK (medio IN ('video', 'chat', 'presencial')),
  estado TEXT DEFAULT 'agendada' CHECK (estado IN ('agendada', 'en_curso', 'completada', 'cancelada', 'no_asistio')),
  fecha_programada TIMESTAMPTZ,
  duracion_min INTEGER,
  ubicacion_paciente TEXT,
  ubicacion_medico TEXT,
  plataforma TEXT DEFAULT 'ISSI',
  calidad_conexion TEXT,
  sala_video_url TEXT,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Historia Clínica Electrónica ──
CREATE TABLE IF NOT EXISTS hce_registros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizaciones(id),
  consulta_id UUID NOT NULL REFERENCES consultas(id),
  version INTEGER DEFAULT 1,
  motivo_consulta TEXT,
  enfermedad_actual TEXT,
  antecedentes_consulta JSONB,
  revision_sistemas JSONB,
  examen_fisico JSONB,
  signos_vitales JSONB,
  limitaciones_teleconsulta TEXT,
  diagnosticos JSONB, -- [{cie10, descripcion, tipo}]
  plan_manejo JSONB,
  seguimiento JSONB,
  alertas_riesgos JSONB,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Fórmulas médicas ──
CREATE TABLE IF NOT EXISTS formulas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizaciones(id),
  consulta_id UUID NOT NULL REFERENCES consultas(id),
  medico_id UUID NOT NULL,
  paciente_id UUID NOT NULL,
  medicamentos JSONB NOT NULL, -- [{nombre, dosis, frecuencia, via, duracion}]
  firma_medico_url TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Paraclínicos ──
CREATE TABLE IF NOT EXISTS paraclinicos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizaciones(id),
  consulta_id UUID NOT NULL REFERENCES consultas(id),
  medico_id UUID NOT NULL,
  paciente_id UUID NOT NULL,
  tipo_orden TEXT NOT NULL,
  justificacion TEXT,
  prioridad TEXT DEFAULT 'normal' CHECK (prioridad IN ('normal', 'urgente')),
  resultado_url TEXT,
  resultado_datos JSONB,
  estado TEXT DEFAULT 'ordenado' CHECK (estado IN ('ordenado', 'en_proceso', 'completado')),
  created_at TIMESTAMPTZ DEFAULT now(),
  completado_at TIMESTAMPTZ
);

-- ── Incapacidades ──
CREATE TABLE IF NOT EXISTS incapacidades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizaciones(id),
  consulta_id UUID NOT NULL REFERENCES consultas(id),
  medico_id UUID NOT NULL,
  paciente_id UUID NOT NULL,
  dias INTEGER NOT NULL,
  diagnostico_cie10 TEXT NOT NULL,
  diagnostico_desc TEXT,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Evaluaciones AIEPI ──
CREATE TABLE IF NOT EXISTS aiepi_evaluaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizaciones(id),
  consulta_id UUID REFERENCES consultas(id),
  paciente_id UUID NOT NULL,
  profesional_id UUID NOT NULL,
  
  nombre_nino TEXT,
  edad_meses INTEGER NOT NULL,
  peso DECIMAL(5,2) NOT NULL,
  talla DECIMAL(5,2),
  cuidador_nombre TEXT,
  cuidador_parentesco TEXT,
  
  signos_peligro JSONB NOT NULL,
  tiene_signo_peligro BOOLEAN DEFAULT false,
  
  sintomas_respiratorio JSONB,
  sintomas_diarrea JSONB,
  sintomas_fiebre JSONB,
  sintomas_oido JSONB,
  
  nutricion JSONB,
  vacunacion JSONB,
  
  clasificaciones JSONB NOT NULL,
  plan_tratamiento JSONB,
  
  consejeria JSONB NOT NULL,
  consejeria_completa BOOLEAN DEFAULT false,
  
  fecha_control DATE,
  motivo_reconsulta TEXT,
  
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Chat de consulta ──
CREATE TABLE IF NOT EXISTS mensajes_consulta (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizaciones(id),
  consulta_id UUID NOT NULL REFERENCES consultas(id),
  sender_id UUID NOT NULL,
  contenido TEXT NOT NULL,
  leido BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Audit logs (NUNCA ELIMINAR) ──
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizaciones(id),
  user_id UUID,
  rol TEXT,
  accion TEXT NOT NULL CHECK (accion IN ('CREATE', 'READ', 'UPDATE', 'DELETE')),
  recurso_tipo TEXT NOT NULL,
  recurso_id UUID,
  datos_antes JSONB,
  datos_despues JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Índices ──
CREATE INDEX IF NOT EXISTS idx_consultas_org ON consultas(org_id);
CREATE INDEX IF NOT EXISTS idx_consultas_paciente ON consultas(paciente_id);
CREATE INDEX IF NOT EXISTS idx_consultas_medico ON consultas(medico_id);
CREATE INDEX IF NOT EXISTS idx_consultas_fecha ON consultas(fecha_programada);
CREATE INDEX IF NOT EXISTS idx_hce_consulta ON hce_registros(consulta_id);
CREATE INDEX IF NOT EXISTS idx_formulas_consulta ON formulas(consulta_id);
CREATE INDEX IF NOT EXISTS idx_aiepi_paciente ON aiepi_evaluaciones(paciente_id);
CREATE INDEX IF NOT EXISTS idx_aiepi_profesional ON aiepi_evaluaciones(profesional_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_recurso ON audit_logs(recurso_tipo, recurso_id);
CREATE INDEX IF NOT EXISTS idx_org_miembros_user ON org_miembros(user_id);

-- ── RLS (Row Level Security) ──
ALTER TABLE organizaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_miembros ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultas ENABLE ROW LEVEL SECURITY;
ALTER TABLE hce_registros ENABLE ROW LEVEL SECURITY;
ALTER TABLE formulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE aiepi_evaluaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Nota: Las políticas RLS específicas se configuran según el método de auth.
-- Con Supabase Auth: usar auth.uid()
-- Con JWT custom (actual): las API routes validan rol en el código.
