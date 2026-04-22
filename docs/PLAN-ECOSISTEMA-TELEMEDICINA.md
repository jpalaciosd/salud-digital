# 🏥 ISSI — Plan de Ecosistema Integral: Educación + Telemedicina Clínica

## Visión

ISSI pasa de ser una plataforma educativa a un **ecosistema completo de salud digital** donde:

1. **Los profesionales se forman** (cursos, diplomados, certificaciones)
2. **Los profesionales ejercen** (teleconsulta, HCE, fórmulas)
3. **Los pacientes se atienden** (agendar, consulta, historia clínica, fórmulas)
4. **Los auditores supervisan** (calidad, pertinencia, fraude)
5. **Los administradores operan** (gestión, reportes, configuración)

> Los cursos son el **diferenciador competitivo**: ninguna otra plataforma de telemedicina en Colombia incluye formación certificada integrada.

---

## 🧩 Lo que YA existe (ISSI actual)

| Componente | Estado | Reutilizable |
|-----------|--------|-------------|
| Auth (email + Google OAuth) | ✅ Funcional | Sí — expandir roles |
| Roles (estudiante, profesional, admin) | ✅ Funcional | Sí — agregar paciente, médico, auditor |
| 12 cursos con módulos + evaluaciones | ✅ Funcional | Sí — son el "plus" |
| Dashboard estudiante | ✅ Funcional | Sí — se convierte en portal unificado |
| Panel profesional (tutorías) | ✅ Funcional | Sí — base para panel médico |
| Sistema de agendas (tutorías) | ✅ Funcional | Sí — expandir a citas clínicas |
| Admin dashboard con métricas | ✅ Funcional | Sí — expandir con métricas clínicas |
| API de cursos dinámicos | ✅ Funcional | Sí |
| Lambda WhatsApp bot (Aura) | ✅ Funcional | Sí — notificaciones |
| Vercel Blob storage | ✅ Funcional | ⚠️ Migrar a Supabase para datos clínicos |

---

## 🗺️ Mapa de Roles (nuevo)

| Rol | Hereda de | Acceso |
|-----|-----------|--------|
| **Paciente** | (nuevo) | Portal paciente, agendar, ver HCE propia, descargar fórmulas |
| **Estudiante** | Paciente* | Todo de paciente + cursos + progreso + certificados |
| **Profesional/Médico** | Estudiante* | Todo de estudiante + teleconsulta + HCE + fórmulas + órdenes |
| **Auditor** | (nuevo) | Lectura HCE, logs, alertas, reportes de calidad |
| **Admin** | (existente) | Todo + gestión usuarios + configuración + auditoría sistema |

> *Un médico que se forma en ISSI tiene acceso a cursos Y al módulo clínico. Esto es el gancho comercial.*

---

## 📐 ARQUITECTURA TÉCNICA

```
┌─────────────────────────────────────────────────────────┐
│                    ISSI FRONTEND                         │
│              Next.js 14 (App Router)                     │
│                                                          │
│  /portal-paciente  /portal-medico  /portal-auditor       │
│  /dashboard        /cursos         /admin                │
│  /teleconsulta     /hce            /formulas             │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                    API LAYER                              │
│              Next.js API Routes                           │
│                                                          │
│  /api/auth/*          (existente + expandido)            │
│  /api/cursos/*        (existente)                        │
│  /api/agendas/*       (existente → expandir a clínico)   │
│  /api/hce/*           (NUEVO — historia clínica)         │
│  /api/teleconsulta/*  (NUEVO — sesiones video/chat)      │
│  /api/formulas/*      (NUEVO — prescripciones)           │
│  /api/paraclinicos/*  (NUEVO — órdenes/resultados)       │
│  /api/consentimiento/*(NUEVO)                            │
│  /api/auditoria/*     (NUEVO — logs, alertas)            │
│  /api/admin/*         (existente → expandir)             │
│  /api/cie10/*         (NUEVO — búsqueda diagnósticos)    │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                   SUPABASE                               │
│          (migración desde Vercel Blob)                   │
│                                                          │
│  PostgreSQL:  users, patients, medicos, consultas,       │
│               hce_registros, consentimientos,             │
│               formulas, paraclinicos, incapacidades,     │
│               audit_logs, cursos_inscripciones            │
│                                                          │
│  Auth:        Google OAuth + email/password              │
│  Storage:     Documentos, fórmulas PDF, resultados       │
│  Realtime:    Chat clínico en teleconsulta               │
│  RLS:         Políticas por rol (paciente solo ve lo     │
│               suyo, médico ve sus consultas, etc.)       │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│              SERVICIOS EXTERNOS                          │
│                                                          │
│  📹 Daily.co        → Videoconsulta (free: 10K min/mes) │
│  📋 CIE-10 local    → Catálogo JSON (~14K códigos)      │
│  📧 Resend/Twilio   → Notificaciones email + WhatsApp   │
│  🤖 Lambda WhatsApp → Bot Aura (recordatorios, citas)   │
│  📄 PDF generation  → Fórmulas, incapacidades, HCE      │
└─────────────────────────────────────────────────────────┘
```

---

## 📅 PLAN DE FASES

### FASE 0 — Migración de infraestructura (1 semana)
> *Fundación técnica para soportar datos clínicos*

- [ ] Crear proyecto Supabase dedicado para ISSI (o usar el de VRTX si prefieres compartir)
- [ ] Migrar usuarios de Vercel Blob → Supabase `users` table
- [ ] Migrar inscripciones/agendas → Supabase tables
- [ ] Actualizar Auth para usar Supabase Auth (Google + email)
- [ ] Configurar RLS policies por rol
- [ ] Verificar cursos siguen funcionando post-migración
- [ ] Mantener Lambda WhatsApp apuntando al nuevo backend

**Entregable**: ISSI funciona igual que hoy pero sobre Supabase.

---

### FASE 1 — Módulo Clínico Base (3-4 semanas)
> *Flujo completo: paciente agenda → médico atiende → HCE generada*

#### 1.1 Roles y perfiles expandidos
- [ ] Nuevos roles en auth: `paciente`, `medico`, `auditor`
- [ ] Perfil paciente: documento (CC/TI/CE), fecha nacimiento, sexo, EPS, dirección, contacto emergencia
- [ ] Perfil médico: Rethus, especialidad, institución, firma (imagen), disponibilidad semanal
- [ ] Registro diferenciado: formulario adaptado al tipo de usuario
- [ ] Middleware RBAC: rutas protegidas por rol

#### 1.2 Consentimiento informado digital
- [ ] Pantalla de consentimiento antes de primera atención
- [ ] Checkbox: aceptación telemedicina + manejo de datos + limitaciones examen físico
- [ ] Registro automático: fecha/hora, IP, user_agent, texto mostrado
- [ ] Almacenado en `consentimientos` table (inmutable)
- [ ] Validación: no se puede crear consulta sin consentimiento vigente

#### 1.3 Agendamiento clínico (expandir existente)
- [ ] Expandir tabla `agendas` → `consultas` con campos clínicos
- [ ] Tipo de atención: teleorientación | teleconsulta sincrónica | teleconsulta asincrónica | teleexperticia
- [ ] Medio: video | chat
- [ ] Disponibilidad del médico (franjas horarias configurables)
- [ ] Paciente selecciona: especialidad → médico → franja → confirmar
- [ ] Estados: `agendada` → `en_curso` → `completada` | `cancelada` | `no_asistio`
- [ ] Notificación por email/WhatsApp al agendar y recordatorio 1h antes

#### 1.4 Historia Clínica Electrónica (HCE)
- [ ] Formulario estructurado completo para el médico (durante/después de consulta):
  - **Motivo de consulta** (texto libre)
  - **Enfermedad actual** (inicio, evolución, síntomas, factores)
  - **Antecedentes** (JSONB estructurado: patológicos, quirúrgicos, farmacológicos, alérgicos, familiares, gineco-obstétricos, hábitos)
  - **Revisión por sistemas** (checklist sí/no + observaciones por sistema)
  - **Examen físico** adaptado a teleconsulta:
    - Estado general, conciencia, respiración, coloración
    - Signos vitales (autoreportados)
    - Campo obligatorio: "Limitaciones por modalidad virtual"
  - **Impresión diagnóstica** (búsqueda CIE-10 con autocompletado, principal + diferenciales)
  - **Plan de manejo** (farmacológico, no farmacológico, educación, signos de alarma)
- [ ] Versionado: cada edición crea nueva versión (nunca se sobreescribe)
- [ ] Trazabilidad automática: created_by, created_at, versión
- [ ] Vista lectura para paciente (parcial, según política)

#### 1.5 Catálogo CIE-10
- [ ] Importar catálogo CIE-10 completo (~14,000 códigos) como JSON o tabla
- [ ] Endpoint de búsqueda: `/api/cie10?q=gastritis` → resultados con código + descripción
- [ ] Autocompletado en formulario de diagnóstico
- [ ] Validación: diagnóstico obligatorio con código CIE-10 válido

#### 1.6 Fórmula médica digital
- [ ] Formulario: medicamento, dosis, frecuencia, vía, duración
- [ ] Múltiples medicamentos por fórmula
- [ ] Datos automáticos: médico (nombre, Rethus, especialidad), paciente, fecha
- [ ] Generación de PDF descargable
- [ ] Firma del médico (imagen cargada en perfil)
- [ ] Almacenamiento en Supabase Storage

#### 1.7 Audit logs
- [ ] Tabla `audit_logs`: user_id, rol, acción, recurso, datos_antes, datos_después, IP, timestamp
- [ ] Trigger automático en cada operación CRUD sobre tablas clínicas
- [ ] Retención: no eliminar (política de 5+ años)

**Entregable**: Un paciente puede registrarse, agendar cita, dar consentimiento. Un médico puede atender, llenar HCE completa, formular. Todo queda registrado con trazabilidad.

---

### FASE 2 — Teleconsulta + Auditor (2-3 semanas)
> *Video en vivo + supervisión de calidad*

#### 2.1 Videoconsulta
- [ ] Integración Daily.co (API REST + iframe embebido)
- [ ] Crear sala al confirmar cita → URL única por consulta
- [ ] Página `/teleconsulta/[id]`: video + panel lateral con HCE
- [ ] Registro automático: duración, calidad conexión, inicio/fin
- [ ] Botón "Finalizar consulta" → abre formulario HCE
- [ ] Fallback: si video falla, cambiar a chat

#### 2.2 Chat clínico
- [ ] Supabase Realtime para mensajería durante consulta
- [ ] Tabla `mensajes_consulta`: consulta_id, sender_id, contenido, timestamp
- [ ] Historial guardado como parte del registro clínico
- [ ] Indicador de escritura, leído

#### 2.3 Portal Auditor Médico
- [ ] Dashboard `/auditor` con:
  - Búsqueda de HCEs por médico, fecha, diagnóstico, paciente
  - Vista completa de cualquier HCE (solo lectura)
  - Logs de actividad por usuario
  - **Alertas automáticas**:
    - Prescripción inusual (>5 medicamentos por consulta)
    - Consultas <5 minutos (posible fraude)
    - HCE incompleta (campos obligatorios vacíos)
    - Sobrediagnóstico (mismo CIE-10 repetido sin justificación)
  - Indicadores:
    - Adherencia a guías clínicas
    - Tiempos promedio de atención
    - Tasa de resolución en primera consulta
- [ ] Exportar reportes (CSV/PDF)

#### 2.4 Paraclínicos
- [ ] Orden médica digital (desde HCE): tipo examen, justificación, prioridad
- [ ] Carga manual de resultados (PDF/imagen) por paciente o admin
- [ ] Visualización estructurada en HCE
- [ ] Estado: ordenado → en_proceso → completado

#### 2.5 Incapacidades
- [ ] Generación desde HCE: días, diagnóstico CIE-10, fecha inicio/fin
- [ ] PDF descargable con datos de médico + paciente + firma
- [ ] Registro en tabla `incapacidades`

**Entregable**: Teleconsulta completa con video, auditoría automatizada, órdenes de paraclínicos e incapacidades.

---

### FASE 3 — Integración Educación + Clínica (1-2 semanas)
> *El diferenciador: formación que habilita práctica*

- [ ] **Requisitos por curso**: completar ciertos cursos habilita funcionalidades clínicas
  - Ej: "Diplomado SST" → puede auditar fichas SST
  - Ej: "RCP Avanzado" → badge visible en perfil médico
- [ ] **Certificados en perfil médico**: mostrar certificaciones ISSI en la tarjeta del médico que ve el paciente
- [ ] **Educación continua**: cursos recomendados basados en práctica clínica
  - Médico que formula mucho antibiótico → recomendar curso de farmacología
- [ ] **Créditos de formación**: horas de curso contabilizadas como educación continua
- [ ] **Ranking de profesionales**: pacientes ven calificación + certificaciones al elegir médico

**Entregable**: Ecosistema cerrado donde formarse en ISSI da ventajas clínicas reales.

---

### FASE 4 — Compliance y Escala (futuro)
> *Para operación real con IPS/EPS*

- [ ] Firma digital legal (Certicámara o Andes SCD)
- [ ] Endpoints HL7/FHIR (Patient, Encounter, Observation, MedicationRequest)
- [ ] Integración con laboratorios (API bidireccional)
- [ ] Integración con farmacias (validación interacciones)
- [ ] Triage automatizado con IA (previo a consulta)
- [ ] Plantillas por especialidad (medicina general, pediatría, ginecología, etc.)
- [ ] IA para sugerencia de diagnósticos
- [ ] Integración con dispositivos IoT (tensiómetros, oxímetros bluetooth)
- [ ] App móvil (React Native o PWA avanzada)
- [ ] Analítica ML: riesgo clínico, salud poblacional

---

## 💰 COSTOS ESTIMADOS

### Fase 0-1 (MVP)
| Servicio | Costo/mes |
|----------|-----------|
| Vercel Pro | $20 USD |
| Supabase Pro | $25 USD |
| Daily.co (free tier) | $0 |
| OpenAI (CIE-10 search si se usa) | ~$2 USD |
| **Total** | **~$47 USD (~$200K COP)** |

### Fase 2+
| Servicio | Costo/mes |
|----------|-----------|
| Todo anterior | $47 USD |
| Daily.co (si excede free) | $15-50 USD |
| Supabase Storage (documentos) | incluido en Pro |
| Resend (emails) | $0-20 USD |
| **Total** | **~$65-120 USD (~$270-500K COP)** |

---

## 📊 MODELO DE DATOS COMPLETO

### Tablas nuevas (sobre Supabase)

```sql
-- Extender users existente
ALTER TABLE users ADD COLUMN documento_tipo TEXT; -- CC, TI, CE, PA
ALTER TABLE users ADD COLUMN documento_numero TEXT;
ALTER TABLE users ADD COLUMN fecha_nacimiento DATE;
ALTER TABLE users ADD COLUMN sexo TEXT; -- M, F, O
ALTER TABLE users ADD COLUMN eps TEXT;
ALTER TABLE users ADD COLUMN direccion TEXT;
ALTER TABLE users ADD COLUMN ubicacion_actual TEXT;
ALTER TABLE users ADD COLUMN telefono TEXT;
ALTER TABLE users ADD COLUMN contacto_emergencia JSONB;
-- Campos médico
ALTER TABLE users ADD COLUMN rethus TEXT;
ALTER TABLE users ADD COLUMN especialidad TEXT;
ALTER TABLE users ADD COLUMN institucion TEXT;
ALTER TABLE users ADD COLUMN firma_url TEXT;
ALTER TABLE users ADD COLUMN disponibilidad JSONB;
-- Campos clínicos paciente
ALTER TABLE users ADD COLUMN antecedentes JSONB;
ALTER TABLE users ADD COLUMN habitos JSONB;

-- Consentimientos (inmutable)
CREATE TABLE consentimientos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID NOT NULL REFERENCES users(id),
  consulta_id UUID,
  tipo TEXT NOT NULL, -- 'telemedicina', 'datos_personales'
  aceptado BOOLEAN NOT NULL,
  texto_mostrado TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Consultas (expande agendas actual)
CREATE TABLE consultas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id UUID NOT NULL REFERENCES users(id),
  medico_id UUID REFERENCES users(id),
  consentimiento_id UUID REFERENCES consentimientos(id),
  tipo_atencion TEXT NOT NULL, -- teleorientacion, teleconsulta_sincronica, teleconsulta_asincronica, teleexperticia
  medio TEXT, -- video, chat
  estado TEXT DEFAULT 'agendada', -- agendada, en_curso, completada, cancelada, no_asistio
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

-- Historia Clínica Electrónica
CREATE TABLE hce_registros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consulta_id UUID NOT NULL REFERENCES consultas(id),
  version INTEGER DEFAULT 1,
  motivo_consulta TEXT,
  enfermedad_actual TEXT,
  antecedentes_consulta JSONB, -- snapshot de antecedentes al momento
  revision_sistemas JSONB, -- {cardiovascular: {presente: bool, obs: ""}, respiratorio: {...}, ...}
  examen_fisico JSONB, -- {estado_general, conciencia, respiracion, coloracion, observaciones}
  signos_vitales JSONB, -- {ta, fc, fr, temp, spo2, peso, talla} (autoreportados)
  limitaciones_teleconsulta TEXT,
  diagnosticos JSONB, -- [{cie10, descripcion, tipo: "principal"|"diferencial"}]
  plan_manejo JSONB, -- {farmacologico, no_farmacologico, educacion, signos_alarma}
  seguimiento JSONB, -- {control_en_dias, remision, nivel_atencion}
  alertas_riesgos JSONB, -- {red_flags, remision_urgente}
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Fórmulas médicas
CREATE TABLE formulas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consulta_id UUID NOT NULL REFERENCES consultas(id),
  medico_id UUID NOT NULL REFERENCES users(id),
  paciente_id UUID NOT NULL REFERENCES users(id),
  medicamentos JSONB NOT NULL, -- [{nombre, dosis, frecuencia, via, duracion}]
  firma_medico_url TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Paraclínicos
CREATE TABLE paraclinicos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consulta_id UUID NOT NULL REFERENCES consultas(id),
  medico_id UUID NOT NULL REFERENCES users(id),
  paciente_id UUID NOT NULL REFERENCES users(id),
  tipo_orden TEXT NOT NULL,
  justificacion TEXT,
  prioridad TEXT DEFAULT 'normal', -- normal, urgente
  resultado_url TEXT,
  resultado_datos JSONB,
  estado TEXT DEFAULT 'ordenado', -- ordenado, en_proceso, completado
  created_at TIMESTAMPTZ DEFAULT now(),
  completado_at TIMESTAMPTZ
);

-- Incapacidades
CREATE TABLE incapacidades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consulta_id UUID NOT NULL REFERENCES consultas(id),
  medico_id UUID NOT NULL REFERENCES users(id),
  paciente_id UUID NOT NULL REFERENCES users(id),
  dias INTEGER NOT NULL,
  diagnostico_cie10 TEXT NOT NULL,
  diagnostico_desc TEXT,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Chat de consulta
CREATE TABLE mensajes_consulta (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consulta_id UUID NOT NULL REFERENCES consultas(id),
  sender_id UUID NOT NULL REFERENCES users(id),
  contenido TEXT NOT NULL,
  leido BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit logs (nunca eliminar)
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  rol TEXT,
  accion TEXT NOT NULL, -- CREATE, READ, UPDATE, DELETE
  recurso_tipo TEXT NOT NULL, -- hce, formula, consulta, etc
  recurso_id UUID,
  datos_antes JSONB,
  datos_despues JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 🔒 SEGURIDAD (Ley 1581 de 2012)

| Requisito | Implementación |
|-----------|---------------|
| Consentimiento explícito | Tabla `consentimientos`, obligatorio pre-consulta |
| Cifrado en tránsito | HTTPS (Vercel default) |
| Cifrado en reposo | Supabase Pro (encriptación de disco) |
| Control de accesos | RLS por rol en cada tabla |
| Trazabilidad | `audit_logs` en cada operación |
| Retención | Política de no-delete en tablas clínicas |
| Autenticación fuerte | Google OAuth + (futuro) 2FA |

---

## 🎯 PROPUESTA DE VALOR COMERCIAL

```
┌──────────────────────────────────────────────┐
│          ISSI — Ecosistema Integral          │
│                                               │
│   📚 EDUCACIÓN        🏥 TELEMEDICINA        │
│   12 cursos           Teleconsulta video     │
│   Diplomados SST      HCE completa           │
│   Certificaciones     Fórmulas digitales     │
│   Tutor IA (Aura)     CIE-10 estructurado   │
│                                               │
│         🔗 INTEGRACIÓN ÚNICA 🔗              │
│   Certificarse → Habilita práctica clínica   │
│   Práctica → Recomienda formación continua   │
│                                               │
│   👥 ROLES                                    │
│   Paciente | Médico | Auditor | Admin         │
│                                               │
│   🇨🇴 CUMPLIMIENTO NORMATIVO                 │
│   Res. 1995/1999 | Res. 2654/2019            │
│   Ley 1581/2012 | Decreto 2200/2005          │
└──────────────────────────────────────────────┘
```

---

## ⏱️ TIMELINE ESTIMADO

| Fase | Duración | Prioridad |
|------|----------|-----------|
| Fase 0 — Migrar a Supabase | 1 semana | 🔴 Primero |
| Fase 1 — Clínico base | 3-4 semanas | 🔴 Core |
| Fase 2 — Video + Auditor | 2-3 semanas | 🟡 Alto |
| Fase 3 — Edu + Clínica fusión | 1-2 semanas | 🟡 Diferenciador |
| Fase 4 — Compliance + escala | Continuo | 🟢 Futuro |

**Total MVP (Fases 0-1): ~4-5 semanas**
**Ecosistema completo (Fases 0-3): ~8-10 semanas**

---

---

## 🧒 MÓDULO AIEPI (Atención Integrada a Enfermedades Prevalentes de la Infancia)

> Módulo especializado de enfermería pediátrica. No es texto libre — es un **sistema de decisión clínica automatizado** con clasificación semáforo.

### Estructura (wizard paso a paso)

#### Paso 1 — Identificación del paciente pediátrico
- Nombre del niño
- Edad en meses (obligatorio — determina umbrales clínicos)
- Peso, talla
- Responsable/cuidador
- Fecha, hora
- Profesional de enfermería (nombre, registro)

#### Paso 2 — Signos Generales de Peligro (CRÍTICO)
Checkbox obligatorio — **si alguno = SÍ → bloqueo automático: ENFERMEDAD MUY GRAVE → remisión inmediata**

| Signo | Respuesta |
|-------|-----------|
| ¿No puede beber o lactar? | ☐ Sí / ☐ No |
| ¿Vomita todo? | ☐ Sí / ☐ No |
| ¿Convulsiones? | ☐ Sí / ☐ No |
| ¿Letárgico o inconsciente? | ☐ Sí / ☐ No |

> **Regla de oro**: Si cualquier signo de peligro = SÍ → clasificación automática 🔴 GRAVE → la app bloquea y muestra: "REMISIÓN INMEDIATA — No continuar evaluación ambulatoria"

#### Paso 3 — Síntomas Principales (Evaluación)

**3a. Tos o dificultad respiratoria**
- ¿Presente? Sí/No
- Duración (días)
- Frecuencia respiratoria (con calculadora automática por edad):
  - < 2 meses: FR alta = ≥60
  - 2-11 meses: FR alta = ≥50
  - 1-5 años: FR alta = ≥40
- Tiraje subcostal (Sí/No)
- Estridor en reposo (Sí/No)

**3b. Diarrea**
- ¿Presente? Sí/No
- Duración (días)
- Sangre en heces (Sí/No)
- Signos de deshidratación:
  - Ojos hundidos (Sí/No)
  - Pliegue cutáneo lento (Sí/No)
  - Sed aumentada (Sí/No)
  - Inquieto/irritable (Sí/No)

**3c. Fiebre**
- ¿Presente? Sí/No
- Duración (días)
- Temperatura (°C)
- Zona endémica dengue/malaria (auto-detectar por ubicación si es posible)
- Rigidez de nuca (Sí/No)

**3d. Problema de oído**
- Dolor de oído (Sí/No)
- Supuración (Sí/No)
- Tiempo de evolución (días)

#### Paso 4 — Estado Nutricional y Anemia
- Peso/edad (cálculo Z-score automático con tablas OMS)
- Edema en ambos pies (Sí/No)
- Palidez palmar (Sí/No → grave/leve)

#### Paso 5 — Estado de Vacunación
- Esquema: Completo / Incompleto
- Vacunas faltantes (checklist por edad)

#### Paso 6 — Clasificación AIEPI (AUTOMÁTICA)
Sistema semáforo generado automáticamente por reglas clínicas:

| Color | Significado | Acción |
|-------|------------|--------|
| 🔴 Rojo | Grave | Remitir urgente |
| 🟡 Amarillo | Moderado | Tratar + seguimiento 48h |
| 🟢 Verde | Leve | Manejo en casa + consejería |

**Reglas de clasificación (motor automático):**

```
RESPIRATORIO:
- Tiraje + FR alta → 🔴 Neumonía grave
- FR alta sin tiraje → 🟡 Neumonía
- Tos sin signos → 🟢 Resfriado

DIARREA:
- Letargia + ojos hundidos + pliegue lento → 🔴 Deshidratación grave (Plan C)
- 2 de 3 signos → 🟡 Algún grado deshidratación (Plan B)
- Sin signos → 🟢 Sin deshidratación (Plan A)
- Sangre en heces → 🔴 Disentería

FIEBRE:
- Rigidez de nuca → 🔴 Meningitis (remitir)
- Zona endémica + fiebre >7d → 🟡 Malaria/Dengue probable
- Fiebre <7d sin signos → 🟢 Viral probable

NUTRICIÓN:
- Edema bilateral → 🔴 Desnutrición grave
- Peso/edad < -3 DE → 🔴 Desnutrición grave
- Peso/edad < -2 DE → 🟡 Desnutrición
- Palidez grave → 🟡 Anemia

OÍDO:
- Supuración ≥14 días → 🟡 Otitis crónica
- Dolor + supuración → 🟡 Otitis aguda
- Solo dolor → 🟢 Observar
```

#### Paso 7 — Plan de Manejo (según clasificación)
Generado automáticamente:

- **Medicación protocolo**: Amoxicilina (neumonía), SRO (diarrea), Zinc (diarrea), Acetaminofén (fiebre)
- **Hidratación**: Plan A (casa), Plan B (SRO en consultorio), Plan C (IV urgente)
- **Manejo fiebre**: medios físicos + antitérmico
- El profesional puede ajustar pero el protocolo queda como base

#### Paso 8 — Consejería al Cuidador (OBLIGATORIO — no se puede saltar)
Checkboxes que el profesional debe marcar como explicados:

- [ ] Signos de alarma explicados: no come, empeora, fiebre persistente, dificultad respiratoria
- [ ] Alimentación adecuada para la edad
- [ ] Hidratación
- [ ] Lactancia materna (si aplica)
- [ ] Cuándo volver de inmediato
- [ ] Fecha de control

> La app NO permite finalizar la consulta sin completar consejería.

#### Paso 9 — Seguimiento
- Fecha control sugerida (automática según clasificación: 🟡 = 48h, 🟢 = 5 días)
- Motivo de reconsulta

#### Paso 10 — Registro Legal
- Firma del profesional
- Registro profesional
- Trazabilidad automática (fecha/hora/IP/versión)

### Modelo de datos AIEPI

```sql
CREATE TABLE aiepi_evaluaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consulta_id UUID REFERENCES consultas(id),
  paciente_id UUID NOT NULL REFERENCES users(id),
  profesional_id UUID NOT NULL REFERENCES users(id),
  
  -- Identificación pediátrica
  edad_meses INTEGER NOT NULL,
  peso DECIMAL(5,2) NOT NULL,
  talla DECIMAL(5,2),
  cuidador_nombre TEXT,
  cuidador_parentesco TEXT,
  
  -- Signos de peligro (bloqueo si alguno = true)
  signos_peligro JSONB NOT NULL DEFAULT '{
    "no_bebe_lacta": false,
    "vomita_todo": false,
    "convulsiones": false,
    "letargico_inconsciente": false
  }',
  tiene_signo_peligro BOOLEAN GENERATED ALWAYS AS (
    (signos_peligro->>'no_bebe_lacta')::boolean OR
    (signos_peligro->>'vomita_todo')::boolean OR
    (signos_peligro->>'convulsiones')::boolean OR
    (signos_peligro->>'letargico_inconsciente')::boolean
  ) STORED,
  
  -- Síntomas principales
  sintomas_respiratorio JSONB, -- {presente, duracion_dias, fr, tiraje, estridor}
  sintomas_diarrea JSONB,      -- {presente, duracion_dias, sangre, ojos_hundidos, pliegue_lento, sed, irritable}
  sintomas_fiebre JSONB,       -- {presente, duracion_dias, temperatura, zona_endemica, rigidez_nuca}
  sintomas_oido JSONB,         -- {dolor, supuracion, duracion_dias}
  
  -- Nutrición
  nutricion JSONB, -- {peso_edad_zscore, edema_bilateral, palidez_palmar, palidez_grave}
  
  -- Vacunación
  vacunacion JSONB, -- {completo, faltantes: [...]}
  
  -- Clasificación automática
  clasificaciones JSONB NOT NULL, -- [{tipo, nivel: "rojo"|"amarillo"|"verde", descripcion}]
  
  -- Plan
  plan_tratamiento JSONB,  -- {medicamentos: [...], hidratacion_plan, manejo_fiebre, otros}
  
  -- Consejería (obligatorio completar)
  consejeria JSONB NOT NULL, -- {signos_alarma: bool, alimentacion: bool, hidratacion: bool, lactancia: bool, cuando_volver: bool, control_fecha: date}
  consejeria_completa BOOLEAN DEFAULT false,
  
  -- Seguimiento
  fecha_control DATE,
  motivo_reconsulta TEXT,
  
  -- Trazabilidad
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Integración con el ecosistema ISSI

| Conexión | Detalle |
|----------|---------|
| **Cursos → AIEPI** | Profesional que completa curso "Cuidados de Enfermería" o "RCP" → badge AIEPI habilitado |
| **Teleconsulta → AIEPI** | Desde videoconsulta, el profesional puede abrir wizard AIEPI en panel lateral |
| **Auditor → AIEPI** | Auditor revisa evaluaciones AIEPI, valida que clasificación y plan coincidan |
| **Alertas** | Si clasificación 🔴 → alerta automática al auditor y admin |
| **Reportes** | Dashboard con: distribución semáforo, diagnósticos frecuentes, tasa de remisión |
| **Consejería** | Bot WhatsApp (Aura) envía recordatorio de signos de alarma al cuidador post-consulta |

### UX del wizard AIEPI

```
[Paso 1: Datos niño]  →  [Paso 2: ⚠️ Signos peligro]  →  [Paso 3: Síntomas]
         │                        │ Si alguno = SÍ                    │
         │                        ▼                                    │
         │               🔴 BLOQUEO: REMITIR                          │
         │                                                             ▼
[Paso 4: Nutrición]  →  [Paso 5: Vacunas]  →  [Paso 6: 🚦 Clasificación auto]
                                                          │
                                               ▼                      ▼
                                    [Paso 7: Plan]  →  [Paso 8: Consejería]
                                                              │
                                                    [Paso 9: Seguimiento]
                                                              │
                                                    [Paso 10: ✅ Firmar]
```

> **Principio UX**: Un paso a la vez. No mostrar todo junto. Reducir errores clínicos con flujo guiado.

---

## ✅ DECISIONES TOMADAS

1. **Supabase nuevo free** — Proyecto separado de VRTX, $0/mes (free tier)
2. **Sin migración inicial** — Educación sigue en Vercel Blob, lo clínico nuevo va en Supabase
3. **Video en Fase 2** — Fase 1 enfocada en HCE + AIEPI + fórmulas + agendamiento
4. **Hay médicos reales** — Flujos de onboarding reales con Rethus
5. **SaaS multi-tenant** — Todas las tablas con `organizacion_id`, cada IPS aislada

---

## 🏢 ARQUITECTURA MULTI-TENANT (SaaS)

### Concepto
Cada IPS/clínica que se registra es una **organización**. Sus datos están completamente aislados de otras organizaciones. ISSI cobra suscripción mensual por organización.

### Tabla base: organizaciones

```sql
CREATE TABLE organizaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,            -- "Clínica San Rafael"
  nit TEXT UNIQUE,                 -- NIT de la IPS
  tipo TEXT DEFAULT 'ips',         -- ips, eps, consultorio, universidad
  logo_url TEXT,
  plan TEXT DEFAULT 'basico',      -- basico, profesional, enterprise
  max_usuarios INTEGER DEFAULT 10,
  max_consultas_mes INTEGER DEFAULT 100,
  activa BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',       -- configuración personalizada
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Membresía de usuarios

```sql
CREATE TABLE org_miembros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES organizaciones(id),
  user_id UUID NOT NULL REFERENCES users(id),
  rol_org TEXT NOT NULL,           -- admin_org, medico, enfermero, auditor, recepcion
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(org_id, user_id)
);
```

### Impacto en todas las tablas clínicas
Cada tabla lleva `org_id`:

```sql
-- Ejemplo: consultas
CREATE TABLE consultas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES organizaciones(id),  -- ← TENANT KEY
  paciente_id UUID NOT NULL REFERENCES users(id),
  medico_id UUID REFERENCES users(id),
  -- ... resto de campos
);

-- RLS Policy: usuarios solo ven datos de su organización
CREATE POLICY "tenant_isolation" ON consultas
  USING (org_id IN (
    SELECT org_id FROM org_miembros WHERE user_id = auth.uid()
  ));
```

### Tablas afectadas por multi-tenant (todas llevan `org_id`)
- `consultas`
- `hce_registros`
- `consentimientos`
- `formulas`
- `paraclinicos`
- `incapacidades`
- `aiepi_evaluaciones`
- `mensajes_consulta`
- `audit_logs`

### Flujo de onboarding SaaS

```
1. IPS se registra en ISSI → crea cuenta admin
2. Se crea `organizacion` → genera org_id
3. Admin invita médicos/enfermeros → se crean como org_miembros
4. Pacientes se registran → se asocian a la org cuando agendan
5. Cada query filtra por org_id → aislamiento total
```

### Modelo de precios SaaS (sugerido)

| Plan | Usuarios | Consultas/mes | Precio COP |
|------|----------|---------------|------------|
| Básico | Hasta 5 | 50 | $150,000 |
| Profesional | Hasta 20 | 300 | $450,000 |
| Enterprise | Ilimitado | Ilimitado | $1,200,000 |
| Educación (add-on) | Por usuario | Cursos ISSI | +$30,000/usuario |

> El módulo educativo como add-on es el diferenciador. Ningún competidor lo tiene.

### Panel Super-Admin (ISSI — tú)
Además del admin por organización, existe un super-admin (tu cuenta) que:
- Ve todas las organizaciones
- Gestiona planes/suscripciones
- Monitorea uso global
- Activa/desactiva organizaciones
- Ve métricas cross-tenant (anonimizadas)

```
ROLES:
├── super_admin (ISSI global — juandiegopalaciosdelgado@gmail.com)
├── admin_org (admin de cada IPS)
├── medico (por organización)
├── enfermero (por organización)
├── auditor (por organización)
├── recepcion (por organización)
├── paciente (puede estar en múltiples orgs)
└── estudiante (módulo educativo, cross-org)
```
