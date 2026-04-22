// ── Motor de Clasificación AIEPI ──
// Implementa las reglas clínicas del protocolo AIEPI Colombia
// Genera clasificaciones automáticas tipo semáforo (rojo/amarillo/verde)

import type {
  SignosPeligro,
  SintomaRespiratorio,
  SintomaDiarrea,
  SintomaFiebre,
  SintomaOido,
  Nutricion,
  ClasificacionAiepi,
  NivelClasificacion,
  PlanAiepi,
} from "./types-clinical";

// ── FR normal por edad ──
export function getFRAlta(edadMeses: number): number {
  if (edadMeses < 2) return 60;
  if (edadMeses < 12) return 50;
  return 40; // 1-5 años
}

export function esFRAlta(fr: number, edadMeses: number): boolean {
  return fr >= getFRAlta(edadMeses);
}

// ── Clasificación de signos de peligro ──
export function clasificarSignosPeligro(signos: SignosPeligro): ClasificacionAiepi | null {
  const tieneSigno =
    signos.no_bebe_lacta ||
    signos.vomita_todo ||
    signos.convulsiones ||
    signos.letargico_inconsciente;

  if (tieneSigno) {
    const detalles: string[] = [];
    if (signos.no_bebe_lacta) detalles.push("no puede beber/lactar");
    if (signos.vomita_todo) detalles.push("vomita todo");
    if (signos.convulsiones) detalles.push("convulsiones");
    if (signos.letargico_inconsciente) detalles.push("letárgico/inconsciente");

    return {
      tipo: "ENFERMEDAD MUY GRAVE",
      nivel: "rojo",
      descripcion: `Signos generales de peligro: ${detalles.join(", ")}`,
      accion: "REMISIÓN URGENTE — Referir inmediatamente al hospital. Administrar primera dosis de antibiótico. Tratar hipoglucemia.",
    };
  }
  return null;
}

// ── Clasificación respiratoria ──
export function clasificarRespiratorio(
  sintomas: SintomaRespiratorio | undefined,
  edadMeses: number
): ClasificacionAiepi | null {
  if (!sintomas?.presente) return null;

  const frAlta = sintomas.frecuencia_respiratoria
    ? esFRAlta(sintomas.frecuencia_respiratoria, edadMeses)
    : false;

  // Tiraje + cualquier signo → Neumonía grave
  if (sintomas.tiraje_subcostal || sintomas.estridor_reposo) {
    return {
      tipo: "NEUMONÍA GRAVE",
      nivel: "rojo",
      descripcion: `Tiraje subcostal${sintomas.estridor_reposo ? " + estridor en reposo" : ""}. FR: ${sintomas.frecuencia_respiratoria || "no medida"}`,
      accion: "Remitir urgente. Primera dosis de antibiótico IM. Oxígeno si disponible.",
    };
  }

  // FR alta sin tiraje → Neumonía
  if (frAlta) {
    return {
      tipo: "NEUMONÍA",
      nivel: "amarillo",
      descripcion: `FR elevada (${sintomas.frecuencia_respiratoria}/min, umbral ≥${getFRAlta(edadMeses)} para ${edadMeses} meses). Sin tiraje.`,
      accion: "Amoxicilina por 5 días. Control en 48 horas. Enseñar signos de alarma.",
    };
  }

  // Tos sin signos de gravedad
  return {
    tipo: "RESFRIADO / TOS",
    nivel: "verde",
    descripcion: `Tos de ${sintomas.duracion_dias || "?"} días sin signos de neumonía.`,
    accion: "Manejo sintomático en casa. No antibióticos. Líquidos abundantes. Volver si empeora.",
  };
}

// ── Clasificación diarrea ──
export function clasificarDiarrea(
  sintomas: SintomaDiarrea | undefined
): ClasificacionAiepi | null {
  if (!sintomas?.presente) return null;

  // Contar signos de deshidratación
  const signosDeshidratacion = [
    sintomas.ojos_hundidos,
    sintomas.pliegue_lento,
    sintomas.sed_aumentada,
    sintomas.irritable,
  ].filter(Boolean).length;

  // Disentería
  if (sintomas.sangre_heces) {
    return {
      tipo: "DISENTERÍA",
      nivel: "rojo",
      descripcion: "Diarrea con sangre en heces.",
      accion: "Tratar con antibiótico (según protocolo local). Remitir si menor de 2 meses o desnutrido. Control 48h.",
    };
  }

  // Deshidratación grave (letargia ya se captura en signos de peligro)
  if (signosDeshidratacion >= 3) {
    return {
      tipo: "DESHIDRATACIÓN GRAVE",
      nivel: "rojo",
      descripcion: `${signosDeshidratacion} signos de deshidratación presentes. Plan C.`,
      accion: "PLAN C: Rehidratación IV inmediata. Remitir. SRO durante transporte.",
    };
  }

  // Algún grado de deshidratación
  if (signosDeshidratacion >= 1) {
    return {
      tipo: "DESHIDRATACIÓN",
      nivel: "amarillo",
      descripcion: `${signosDeshidratacion} signo(s) de deshidratación. Plan B.`,
      accion: "PLAN B: SRO en consultorio durante 4 horas. Zinc por 14 días. Reevaluar después.",
    };
  }

  // Sin deshidratación
  return {
    tipo: "DIARREA SIN DESHIDRATACIÓN",
    nivel: "verde",
    descripcion: `Diarrea de ${sintomas.duracion_dias || "?"} días sin signos de deshidratación. Plan A.`,
    accion: "PLAN A: SRO en casa. Zinc por 14 días. Continuar alimentación. Volver si empeora.",
  };
}

// ── Clasificación fiebre ──
export function clasificarFiebre(
  sintomas: SintomaFiebre | undefined
): ClasificacionAiepi | null {
  if (!sintomas?.presente) return null;

  // Rigidez de nuca → Meningitis
  if (sintomas.rigidez_nuca) {
    return {
      tipo: "MENINGITIS / ENFERMEDAD FEBRIL MUY GRAVE",
      nivel: "rojo",
      descripcion: `Fiebre con rigidez de nuca. T: ${sintomas.temperatura || "?"}°C`,
      accion: "Remitir URGENTE. Primera dosis de antibiótico. Tratar convulsiones si las hay.",
    };
  }

  // Zona endémica + fiebre prolongada
  if (sintomas.zona_endemica && (sintomas.duracion_dias || 0) >= 5) {
    return {
      tipo: "MALARIA / DENGUE PROBABLE",
      nivel: "amarillo",
      descripcion: `Fiebre de ${sintomas.duracion_dias} días en zona endémica. T: ${sintomas.temperatura || "?"}°C`,
      accion: "Gota gruesa / NS1. Tratar según resultado. Signos de alarma dengue. Control 24h.",
    };
  }

  // Fiebre >7 días
  if ((sintomas.duracion_dias || 0) > 7) {
    return {
      tipo: "FIEBRE PROLONGADA",
      nivel: "amarillo",
      descripcion: `Fiebre de ${sintomas.duracion_dias} días sin foco claro.`,
      accion: "Estudiar causa. Paraclínicos. Considerar remisión a pediatría.",
    };
  }

  // Fiebre simple
  return {
    tipo: "ENFERMEDAD FEBRIL",
    nivel: "verde",
    descripcion: `Fiebre de ${sintomas.duracion_dias || "?"} días. T: ${sintomas.temperatura || "?"}°C. Sin signos de alarma.`,
    accion: "Acetaminofén. Medios físicos. Líquidos. Volver si persiste >3 días o empeora.",
  };
}

// ── Clasificación oído ──
export function clasificarOido(
  sintomas: SintomaOido | undefined
): ClasificacionAiepi | null {
  if (!sintomas?.dolor && !sintomas?.supuracion) return null;

  if (sintomas.supuracion && (sintomas.duracion_dias || 0) >= 14) {
    return {
      tipo: "OTITIS MEDIA CRÓNICA",
      nivel: "amarillo",
      descripcion: `Supuración ótica de ${sintomas.duracion_dias} días.`,
      accion: "Secar oído con mecha. No instilar gotas. Remitir a ORL.",
    };
  }

  if (sintomas.dolor && sintomas.supuracion) {
    return {
      tipo: "OTITIS MEDIA AGUDA",
      nivel: "amarillo",
      descripcion: "Dolor de oído con supuración.",
      accion: "Amoxicilina por 7 días. Secar oído. Acetaminofén para dolor. Control 48h.",
    };
  }

  return {
    tipo: "OTALGIA",
    nivel: "verde",
    descripcion: "Dolor de oído sin supuración.",
    accion: "Acetaminofén para dolor. Observar. Volver si empeora o aparece supuración.",
  };
}

// ── Clasificación nutrición ──
export function clasificarNutricion(
  nutricion: Nutricion
): ClasificacionAiepi | null {
  if (nutricion.edema_bilateral) {
    return {
      tipo: "DESNUTRICIÓN GRAVE",
      nivel: "rojo",
      descripcion: "Edema bilateral en pies (kwashiorkor).",
      accion: "Remitir URGENTE. Tratar hipoglucemia. Iniciar alimentación terapéutica.",
    };
  }

  if (nutricion.peso_edad_zscore !== undefined && nutricion.peso_edad_zscore < -3) {
    return {
      tipo: "DESNUTRICIÓN GRAVE (MARASMO)",
      nivel: "rojo",
      descripcion: `Z-score peso/edad: ${nutricion.peso_edad_zscore.toFixed(1)} (< -3 DE).`,
      accion: "Remitir URGENTE. Alimentación terapéutica. Evaluar infecciones.",
    };
  }

  if (nutricion.peso_edad_zscore !== undefined && nutricion.peso_edad_zscore < -2) {
    return {
      tipo: "DESNUTRICIÓN",
      nivel: "amarillo",
      descripcion: `Z-score peso/edad: ${nutricion.peso_edad_zscore.toFixed(1)} (< -2 DE).`,
      accion: "Consejería nutricional. Suplementación. Control en 14 días. Evaluar causas.",
    };
  }

  if (nutricion.palidez_grave) {
    return {
      tipo: "ANEMIA GRAVE",
      nivel: "rojo",
      descripcion: "Palidez palmar grave.",
      accion: "Remitir. Hemograma urgente. Iniciar hierro.",
    };
  }

  if (nutricion.palidez_palmar && !nutricion.palidez_grave) {
    return {
      tipo: "ANEMIA",
      nivel: "amarillo",
      descripcion: "Palidez palmar leve/moderada.",
      accion: "Hierro por 3 meses. Antiparasitarios. Control en 14 días.",
    };
  }

  return null;
}

// ── Clasificación completa ──
export function generarClasificaciones(
  edadMeses: number,
  signos: SignosPeligro,
  respiratorio?: SintomaRespiratorio,
  diarrea?: SintomaDiarrea,
  fiebre?: SintomaFiebre,
  oido?: SintomaOido,
  nutricion?: Nutricion
): ClasificacionAiepi[] {
  const clasificaciones: ClasificacionAiepi[] = [];

  // Primero: signos de peligro (bloqueo)
  const peligro = clasificarSignosPeligro(signos);
  if (peligro) clasificaciones.push(peligro);

  // Síntomas principales
  const resp = clasificarRespiratorio(respiratorio, edadMeses);
  if (resp) clasificaciones.push(resp);

  const diarr = clasificarDiarrea(diarrea);
  if (diarr) clasificaciones.push(diarr);

  const fieb = clasificarFiebre(fiebre);
  if (fieb) clasificaciones.push(fieb);

  const oid = clasificarOido(oido);
  if (oid) clasificaciones.push(oid);

  const nutri = nutricion ? clasificarNutricion(nutricion) : null;
  if (nutri) clasificaciones.push(nutri);

  return clasificaciones;
}

// ── Nivel más grave ──
export function nivelMasGrave(clasificaciones: ClasificacionAiepi[]): NivelClasificacion {
  if (clasificaciones.some((c) => c.nivel === "rojo")) return "rojo";
  if (clasificaciones.some((c) => c.nivel === "amarillo")) return "amarillo";
  return "verde";
}

// ── Plan sugerido automático ──
export function generarPlanSugerido(
  clasificaciones: ClasificacionAiepi[],
  diarrea?: SintomaDiarrea
): PlanAiepi {
  const medicamentos: string[] = [];
  const otros: string[] = [];
  let hidratacion_plan: "A" | "B" | "C" | undefined;
  let manejo_fiebre: string | undefined;
  let zinc = false;

  for (const c of clasificaciones) {
    if (c.tipo === "NEUMONÍA" || c.tipo === "NEUMONÍA GRAVE") {
      medicamentos.push("Amoxicilina 50mg/kg/día cada 8h por 5 días");
    }
    if (c.tipo === "OTITIS MEDIA AGUDA") {
      medicamentos.push("Amoxicilina 50mg/kg/día cada 8h por 7 días");
    }
    if (c.tipo.includes("DESHIDRATACIÓN GRAVE")) {
      hidratacion_plan = "C";
    } else if (c.tipo.includes("DESHIDRATACIÓN") && !hidratacion_plan) {
      hidratacion_plan = "B";
    }
    if (c.tipo.includes("ANEMIA")) {
      medicamentos.push("Hierro elemental 3mg/kg/día por 3 meses");
      medicamentos.push("Antiparasitario (Albendazol si >2 años)");
    }
    if (c.tipo.includes("FEBRIL") || c.tipo.includes("FIEBRE")) {
      manejo_fiebre = "Acetaminofén 15mg/kg cada 6h si T>38°C. Medios físicos.";
    }
  }

  // Diarrea → siempre zinc
  if (diarrea?.presente) {
    zinc = true;
    medicamentos.push("Zinc: <6m 10mg/día, ≥6m 20mg/día por 14 días");
    if (!hidratacion_plan) hidratacion_plan = "A";
  }

  return { medicamentos, hidratacion_plan, manejo_fiebre, zinc, otros };
}

// ── Fecha de control sugerida ──
export function fechaControlSugerida(nivel: NivelClasificacion): number {
  if (nivel === "rojo") return 0; // remisión inmediata
  if (nivel === "amarillo") return 2; // 48 horas
  return 5; // 5 días
}
