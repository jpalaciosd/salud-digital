export interface CursoModulo {
  titulo: string;
  items: string[];
}

export interface CursoPregunta {
  pregunta: string;
  opciones: string[];
  respuesta: number; // index of correct answer
}

export interface CursoCompleto {
  id: string;
  titulo: string;
  descripcion: string;
  instructor: string;
  categoria: string;
  duracionHoras: number;
  imagen: string;
  precio: number;
  modulos: CursoModulo[];
  evaluacion: CursoPregunta[];
}

export const CURSOS_CATALOGO: CursoCompleto[] = [
  {
    id: "curso-primeros-auxilios",
    titulo: "Taller de Primeros Auxilios",
    descripcion: "Aprende técnicas esenciales de primeros auxilios para situaciones de emergencia. Modalidad virtual dirigida.",
    instructor: "Dra. María López",
    categoria: "salud",
    duracionHoras: 8,
    imagen: "🩺",
    precio: 89900,
    modulos: [
      {
        titulo: "1. Introducción a los Primeros Auxilios",
        items: [
          "Concepto de primeros auxilios",
          "Objetivos y principios básicos",
          "Conducta del primer respondiente",
          "Activación del sistema de emergencias",
          "Evaluación inicial de la escena (seguridad)",
          "Botiquín básico: elementos esenciales",
        ],
      },
      {
        titulo: "2. Evaluación Primaria del Paciente (ABC)",
        items: [
          "Valoración del estado de conciencia",
          "Apertura de vía aérea",
          "Evaluación de respiración",
          "Evaluación de circulación",
          "Posición lateral de seguridad",
        ],
      },
      {
        titulo: "3. Reanimación Cardiopulmonar (RCP)",
        items: [
          "Concepto de paro cardiorrespiratorio",
          "Cadena de supervivencia",
          "RCP en adulto",
          "RCP en niño y lactante (conceptual)",
          "Uso del DEA (Desfibrilador Externo Automático)",
          "Compresiones torácicas de calidad",
        ],
      },
      {
        titulo: "4. Manejo de Hemorragias y Heridas",
        items: [
          "Tipos de hemorragias",
          "Control de sangrado (presión directa)",
          "Vendajes básicos",
          "Uso adecuado del torniquete (conceptual)",
          "Tipos de heridas",
        ],
      },
      {
        titulo: "5. Fracturas, Esguinces y Luxaciones",
        items: [
          "Signos y síntomas",
          "Inmovilización básica",
          "Uso de férulas improvisadas",
          "Manejo inicial del trauma",
        ],
      },
      {
        titulo: "6. Emergencias Médicas Comunes",
        items: [
          "Convulsiones",
          "Desmayo (síncope)",
          "Hipoglucemia",
          "Dificultad respiratoria",
          "Reacciones alérgicas",
          "Golpe de calor",
        ],
      },
      {
        titulo: "7. Quemaduras",
        items: [
          "Clasificación de quemaduras",
          "Manejo inicial",
          "Qué NO hacer en una quemadura",
        ],
      },
      {
        titulo: "8. Atragantamiento (Obstrucción de vía aérea)",
        items: [
          "Signos de obstrucción leve y grave",
          "Maniobra de desobstrucción en adulto",
          "Manejo en niños (conceptual)",
          "Actuación en persona inconsciente",
        ],
      },
    ],
    evaluacion: [
      { pregunta: "¿Cuál es el primer paso al llegar a una escena de emergencia?", opciones: ["Atender al paciente inmediatamente", "Evaluar la seguridad de la escena", "Llamar a familiares", "Administrar medicamentos"], respuesta: 1 },
      { pregunta: "¿Qué significa ABC en la evaluación primaria?", opciones: ["Atención Básica Clínica", "Airway, Breathing, Circulation (Vía aérea, Respiración, Circulación)", "Análisis Biológico Completo", "Asistencia Básica Cardíaca"], respuesta: 1 },
      { pregunta: "¿Cuál es la frecuencia recomendada de compresiones torácicas en RCP para adultos?", opciones: ["60-80 por minuto", "80-100 por minuto", "100-120 por minuto", "120-140 por minuto"], respuesta: 2 },
      { pregunta: "¿Cuál es el método principal para controlar una hemorragia externa?", opciones: ["Elevar la extremidad solamente", "Presión directa sobre la herida", "Aplicar hielo", "Torniquete inmediato"], respuesta: 1 },
      { pregunta: "¿Qué NO se debe hacer en caso de una quemadura?", opciones: ["Enfriar con agua", "Cubrir con paño limpio", "Aplicar mantequilla o pasta de dientes", "Retirar la fuente de calor"], respuesta: 2 },
      { pregunta: "¿Cuál es la maniobra indicada para desobstrucción de vía aérea en adulto consciente?", opciones: ["RCP", "Maniobra de Heimlich (compresiones abdominales)", "Golpes en la espalda solamente", "Ventilación boca a boca"], respuesta: 1 },
      { pregunta: "¿Qué es un DEA?", opciones: ["Dispositivo de Emergencia Ambulatoria", "Desfibrilador Externo Automático", "Detector de Estado Arterial", "Diagnóstico de Emergencia Avanzada"], respuesta: 1 },
      { pregunta: "En caso de una fractura, ¿qué se debe hacer primero?", opciones: ["Intentar alinear el hueso", "Inmovilizar la zona afectada", "Aplicar calor", "Mover al paciente rápidamente"], respuesta: 1 },
      { pregunta: "¿Cuál es la posición recomendada para una persona inconsciente que respira?", opciones: ["Boca arriba", "Sentada", "Posición lateral de seguridad", "Boca abajo"], respuesta: 2 },
      { pregunta: "¿Cuántos eslabones tiene la cadena de supervivencia?", opciones: ["3", "4", "5", "6"], respuesta: 2 },
    ],
  },
  {
    id: "curso-seguridad-paciente",
    titulo: "Taller: Seguridad del Paciente",
    descripcion: "Formación integral en seguridad del paciente para personal asistencial y administrativo en salud. Modalidad virtual dirigida.",
    instructor: "Dr. Alejandro Posada",
    categoria: "salud",
    duracionHoras: 8,
    imagen: "🛡️",
    precio: 89900,
    modulos: [
      {
        titulo: "1. Introducción a la Seguridad del Paciente",
        items: [
          "Concepto de Seguridad del Paciente",
          "Cultura de seguridad",
          "Evento adverso, incidente, complicación",
          "Error humano vs. falla del sistema",
          "Marco normativo en Colombia (Política de Seguridad del Paciente)",
        ],
      },
      {
        titulo: "2. Cultura de Seguridad y Gestión del Riesgo",
        items: [
          "Modelo del queso suizo (James Reason)",
          "Factores contributivos del error",
          "Gestión del riesgo clínico",
          "Barreras de seguridad",
          "Trabajo en equipo y comunicación efectiva",
        ],
      },
      {
        titulo: "3. Identificación Correcta del Paciente",
        items: [
          "Uso de dos identificadores",
          "Errores frecuentes en identificación",
          "Casos reales y análisis",
          "Estrategias de prevención",
        ],
      },
      {
        titulo: "4. Seguridad en la Administración de Medicamentos",
        items: [
          "Los 5 correctos (paciente, medicamento, dosis, vía, hora)",
          "Medicamentos de alto riesgo",
          "Errores más frecuentes",
          "Doble verificación",
          "Conciliación medicamentosa",
        ],
      },
      {
        titulo: "5. Prevención de IAAS",
        items: [
          "Higiene de manos (5 momentos OMS)",
          "Uso correcto de EPP",
          "Prevención de infecciones intrahospitalarias",
          "Vigilancia epidemiológica",
        ],
      },
      {
        titulo: "6. Comunicación Segura y Trabajo en Equipo",
        items: [
          "Técnica SBAR",
          "Entrega y recibo de turno seguro",
          "Comunicación en situaciones críticas",
          "Cultura de reporte sin culpa",
        ],
      },
      {
        titulo: "7. Cirugía Segura",
        items: [
          "Lista de chequeo de cirugía segura",
          "Marcación del sitio quirúrgico",
          "Tiempo fuera (Time Out)",
          "Prevención de eventos centinela",
        ],
      },
      {
        titulo: "8. Reporte y Análisis de Eventos Adversos",
        items: [
          "Sistema de reporte institucional",
          "Evento adverso vs. evento centinela",
          "Análisis causa raíz",
          "Planes de mejora",
        ],
      },
    ],
    evaluacion: [
      { pregunta: "¿Qué es un evento adverso?", opciones: ["Un error que no afecta al paciente", "Un daño no intencional causado por la atención en salud", "Una complicación esperada del tratamiento", "Un incidente administrativo"], respuesta: 1 },
      { pregunta: "¿Qué modelo explica cómo múltiples fallas alineadas causan un evento adverso?", opciones: ["Modelo de Donabedian", "Modelo del queso suizo (James Reason)", "Modelo de Florence Nightingale", "Modelo PDCA"], respuesta: 1 },
      { pregunta: "¿Cuántos identificadores se deben usar para la identificación correcta del paciente?", opciones: ["1", "2", "3", "4"], respuesta: 1 },
      { pregunta: "¿Cuáles son los 5 correctos en la administración de medicamentos?", opciones: ["Paciente, medicamento, dosis, vía, hora", "Nombre, edad, peso, diagnóstico, alergia", "Médico, enfermera, farmacia, paciente, familia", "Receta, farmacia, dosis, control, seguimiento"], respuesta: 0 },
      { pregunta: "¿Cuántos momentos de higiene de manos establece la OMS?", opciones: ["3", "4", "5", "7"], respuesta: 2 },
      { pregunta: "¿Qué significa la técnica SBAR?", opciones: ["Situación, Background, Análisis, Recomendación", "Seguridad, Barrera, Alerta, Riesgo", "Sistema, Base, Acción, Resultado", "Síntoma, Bienestar, Atención, Recuperación"], respuesta: 0 },
      { pregunta: "¿Qué es el 'Time Out' en cirugía segura?", opciones: ["Una pausa para descanso del equipo", "Una verificación final antes de iniciar la cirugía", "El momento de administrar anestesia", "La revisión post-quirúrgica"], respuesta: 1 },
      { pregunta: "¿Qué es un evento centinela?", opciones: ["Un evento menor sin consecuencias", "Un evento adverso grave que causa muerte o daño permanente", "Un reporte administrativo", "Una alerta de medicamento"], respuesta: 1 },
      { pregunta: "¿Cuál es el objetivo principal de la cultura de reporte sin culpa?", opciones: ["Sancionar al responsable", "Fomentar el reporte para aprender y mejorar", "Ocultar los errores", "Reducir costos"], respuesta: 1 },
      { pregunta: "¿Qué herramienta se usa para investigar la causa raíz de un evento adverso?", opciones: ["Encuesta de satisfacción", "Análisis causa raíz", "Auditoría financiera", "Evaluación de desempeño"], respuesta: 1 },
    ],
  },
  {
    id: "curso-salud-mental",
    titulo: "Navegando la Tormenta: Salud Mental y Manejo de Crisis",
    descripcion: "Estrategias de salud mental para identificar señales de alerta y actuar ante situaciones críticas. Técnicas de regulación emocional, grounding y primeros auxilios psicológicos.",
    instructor: "Ps. Andrea Martínez",
    categoria: "salud-mental",
    duracionHoras: 6,
    imagen: "🧠",
    precio: 89900,
    modulos: [
      { titulo: "1. El Mapa Mental", items: [
        "Conceptos básicos de salud mental",
        "Mitos y realidades del autocuidado",
        "Diferencia entre estrés, ansiedad y crisis",
        "Dinámica del Termómetro: autoevaluación emocional",
        "Estigma y barreras para buscar ayuda",
      ]},
      { titulo: "2. La Anatomía de la Crisis", items: [
        "Fisiología del pánico y la ansiedad",
        "¿Qué pasa en el cerebro durante una crisis?",
        "Identificación de disparadores (triggers)",
        "La curva de la crisis emocional",
        "Análisis de caso: reconocer señales de alerta",
      ]},
      { titulo: "3. Herramientas de Estabilización", items: [
        "Técnica de Grounding 5-4-3-2-1",
        "Respiración diafragmática (4-4-8)",
        "Técnicas de autorregulación emocional",
        "Ejercicios de enfoque sensorial",
        "Guía de bolsillo para manejo de crisis",
      ]},
      { titulo: "4. Primeros Auxilios Psicológicos (PAP)", items: [
        "Escucha activa y validación emocional",
        "Protocolo E.V.A. (Escuchar, Validar, Acordar)",
        "Conversación de apoyo ante un ataque de pánico",
        "Derivación a profesionales de salud mental",
        "Plan de autocuidado y descompresión post-crisis",
      ]},
    ],
    evaluacion: [
      { pregunta: "¿Cuál es la primera acción recomendada cuando sientes que pierdes el control emocional?", opciones: ["Buscar a alguien para hablar", "Parar y respirar (inhalar 4, mantener 4, exhalar 8)", "Tomar agua fría", "Distraerse con el celular"], respuesta: 1 },
      { pregunta: "La técnica de Grounding 5-4-3-2-1 utiliza los sentidos para:", opciones: ["Diagnosticar un trastorno mental", "Interrumpir el bucle emocional y regresar al presente", "Medir el nivel de estrés", "Evaluar la gravedad de la crisis"], respuesta: 1 },
      { pregunta: "En los Primeros Auxilios Psicológicos, ¿cuál frase es la más adecuada?", opciones: ["No es para tanto, cálmate", "Estoy aquí contigo, te escucho", "Tienes que ser fuerte", "A todos nos pasa lo mismo"], respuesta: 1 },
      { pregunta: "¿Qué significa la V en el protocolo E.V.A.?", opciones: ["Verificar", "Validar y Normalizar", "Ventilar", "Valorar clínicamente"], respuesta: 1 },
      { pregunta: "¿Cuál es la diferencia principal entre estrés y una crisis de salud mental?", opciones: ["No hay diferencia", "El estrés es temporal y adaptativo; la crisis desborda la capacidad de afrontamiento", "El estrés es más grave", "La crisis solo afecta a personas con diagnóstico previo"], respuesta: 1 },
    ],
  },
  {
    id: "curso-enfermeria-salud-mental",
    titulo: "Curso de Cuidados de Enfermería en Salud Mental",
    descripcion: "Humanización, seguridad y respuesta oportuna. Capacitación para técnicos de enfermería en detección de descompensación, desescalada verbal, contención segura y autocuidado profesional.",
    instructor: "Enf. Jefe Carlos Mendoza",
    categoria: "enfermeria",
    duracionHoras: 8,
    imagen: "🩺",
    precio: 89900,
    modulos: [
      { titulo: "1. Observación Clínica en Salud Mental", items: [
        "Identificación de ideas de fuga y autolesión",
        "Reconocimiento de alucinaciones y delirios",
        "Terminología técnica: soliloquios, acatisia, afecto",
        "Reporte preciso en la hoja de enfermería",
        "Notas clínicas: del lenguaje coloquial al técnico",
        "Casos clínicos: delirio de persecución",
      ]},
      { titulo: "2. Comunicación Terapéutica", items: [
        "Cómo hablar con un paciente paranoide",
        "Comunicación con paciente deprimido o maníaco",
        "Lenguaje no verbal y distancia de seguridad",
        "La postura lateral y manos visibles",
        "Validación emocional vs. discutir el delirio",
        "Role-playing: La burbuja de seguridad",
      ]},
      { titulo: "3. Manejo de la Agitación y Crisis", items: [
        "Niveles de agitación y curva de la crisis",
        "Protocolo P.A.S. (Proteger, Avisar, Sosegar)",
        "Desescalada verbal: técnicas paso a paso",
        "Lista de chequeo de seguridad del entorno",
        "Control de objetos peligrosos (C.O.P.)",
        "Caso clínico: agitación psicomotriz",
      ]},
      { titulo: "4. Procedimientos Seguros y Autocuidado", items: [
        "Administración de medicación en pacientes renuentes",
        "Contención con enfoque de derechos humanos",
        "Prevención del Síndrome de Burnout",
        "Descompresión post-turno: círculo de descarga",
        "Ritual de salida: quitarse el uniforme emocional",
        "Plan de autocuidado personal",
      ]},
    ],
    evaluacion: [
      { pregunta: "Un paciente habla solo, gesticulando y discutiendo con alguien que no está. El término técnico es:", opciones: ["El paciente está distraído", "Conducta alucinatoria (soliloquios)", "Mala actitud con el personal", "Paciente orientado en las tres esferas"], respuesta: 1 },
      { pregunta: "Si un paciente grita y golpea objetos, ¿cuál es la primera acción según el protocolo P.A.S.?", opciones: ["Sosegar: abrazarlo para que se calme", "Avisar: salir corriendo sin decir nada", "Proteger: asegurar el entorno y garantizar seguridad", "Medicar: administrar un sedante por cuenta propia"], respuesta: 2 },
      { pregunta: "¿Cuál es la postura física recomendada ante un paciente paranoide?", opciones: ["De frente con brazos cruzados", "Sentado muy cerca", "Postura lateral, a dos brazos de distancia, manos visibles", "De espaldas mientras preparas medicación"], respuesta: 2 },
      { pregunta: "¿Cuál nota de enfermería está redactada correctamente?", opciones: ["El paciente amaneció muy necio", "Paciente alerta, con inquietud motora y afecto irritable. Verbaliza ideas de daño.", "La paciente está muy triste y llora por todo", "Sin novedades, todo igual"], respuesta: 1 },
      { pregunta: "Si encuentras a un paciente guardando cordones bajo su colchón, esto se reporta como:", opciones: ["Paciente ordenado", "Conducta sin importancia clínica", "Riesgo inminente de autolesión / conducta suicida", "Problema de aseo"], respuesta: 2 },
      { pregunta: "El término Acatisia se refiere a:", opciones: ["No poder dejar de hablar", "Un estado de sueño profundo", "Incapacidad de permanecer sentado o quieto", "Pérdida total de la memoria"], respuesta: 2 },
    ],
  },
  // ─── CURSO RCP 60 HORAS ───
  {
    id: "curso-rcp-60h",
    titulo: "Curso de RCP — Reanimación Cardiopulmonar",
    descripcion: "Formación integral de 60 horas en reanimación cardiopulmonar: desde soporte vital básico hasta avanzado, situaciones especiales, simulación clínica y gestión de calidad. Cumple lineamientos tipo AHA adaptados a Colombia.",
    instructor: "Dr. Alejandro Posada",
    categoria: "emergencias",
    duracionHoras: 60,
    imagen: "❤️‍🔥",
    precio: 129900,
    modulos: [
      {
        titulo: "1. Fundamentos de la RCP (6h)",
        items: [
          "Concepto de paro cardiorrespiratorio (PCR)",
          "Cadena de supervivencia",
          "Importancia de la atención temprana",
          "Epidemiología del PCR",
          "Principios éticos y legales en RCP (normativa colombiana)",
          "Seguridad del reanimador",
        ],
      },
      {
        titulo: "2. Soporte Vital Básico — SVB (12h)",
        items: [
          "Evaluación inicial del paciente",
          "Activación del sistema de emergencias",
          "Técnica de compresiones torácicas",
          "Ventilaciones de rescate",
          "Uso del DEA (Desfibrilador Externo Automático)",
          "RCP en adultos",
          "RCP en niños y lactantes",
          "Manejo de obstrucción de vía aérea (OVACE)",
          "Simulación virtual",
        ],
      },
      {
        titulo: "3. Soporte Vital Avanzado — SVA (12h)",
        items: [
          "Manejo avanzado de vía aérea",
          "Uso de dispositivos (cánulas, bolsa-válvula-mascarilla)",
          "Monitorización básica (ritmos cardíacos)",
          "Algoritmos de paro cardíaco",
          "Manejo de arritmias",
          "Acceso vascular (conceptual)",
          "Farmacología básica en RCP",
        ],
      },
      {
        titulo: "4. RCP en Situaciones Especiales (6h)",
        items: [
          "RCP en pacientes pediátricos",
          "RCP en embarazadas",
          "RCP en trauma",
          "Paro por causas reversibles (H y T)",
          "RCP en ambientes extrahospitalarios",
        ],
      },
      {
        titulo: "5. Manejo Integral del Paciente Post-RCP (6h)",
        items: [
          "Cuidados post-paro",
          "Estabilización hemodinámica",
          "Oxigenación y ventilación",
          "Pronóstico neurológico",
          "Traslado seguro del paciente",
        ],
      },
      {
        titulo: "6. Simulación Clínica y Escenarios (10h)",
        items: [
          "Simulación de casos reales",
          "Trabajo en equipo (roles en reanimación)",
          "Toma de decisiones bajo presión",
          "Comunicación efectiva en emergencias",
          "Evaluación de desempeño práctico",
        ],
      },
      {
        titulo: "7. Gestión y Calidad en RCP (4h)",
        items: [
          "Protocolos institucionales",
          "Indicadores de calidad en reanimación",
          "Auditoría clínica",
          "Mejora continua en servicios de urgencias",
          "Registro clínico en eventos de RCP",
        ],
      },
      {
        titulo: "8. Evaluación Final y Certificación (4h)",
        items: [
          "Evaluación teórica",
          "Evaluación guiada",
          "Retroalimentación individual",
          "Certificación del curso",
        ],
      },
    ],
    evaluacion: [
      { pregunta: "¿Cuál es el primer eslabón de la cadena de supervivencia?", opciones: ["Desfibrilación temprana", "Reconocimiento del paro y activación del sistema de emergencias", "RCP de alta calidad", "Cuidados post-paro"], respuesta: 1 },
      { pregunta: "¿Cuál es la profundidad recomendada de las compresiones torácicas en adultos?", opciones: ["2–3 cm", "3–4 cm", "5–6 cm", "7–8 cm"], respuesta: 2 },
      { pregunta: "¿Cuál es la relación compresiones:ventilaciones en RCP para un solo reanimador en adulto?", opciones: ["15:2", "30:2", "15:1", "30:1"], respuesta: 1 },
      { pregunta: "¿Qué significa DEA?", opciones: ["Dispositivo Eléctrico de Apoyo", "Desfibrilador Externo Automático", "Detector Electrónico Arterial", "Desfibrilador de Emergencia Avanzada"], respuesta: 1 },
      { pregunta: "Las causas reversibles de paro cardíaco se resumen en:", opciones: ["A y B", "C y D", "H y T", "S y R"], respuesta: 2 },
      { pregunta: "¿Cuál es la frecuencia recomendada de compresiones torácicas?", opciones: ["60–80/min", "80–100/min", "100–120/min", "120–140/min"], respuesta: 2 },
      { pregunta: "En RCP avanzado, ¿cuál es el fármaco de primera línea en paro cardíaco?", opciones: ["Atropina", "Amiodarona", "Adrenalina (Epinefrina)", "Lidocaína"], respuesta: 2 },
      { pregunta: "¿Qué maniobra se realiza ante obstrucción de vía aérea en adulto consciente?", opciones: ["RCP convencional", "Maniobra de Heimlich (compresiones abdominales)", "Ventilación boca a boca", "Golpes en el pecho"], respuesta: 1 },
      { pregunta: "En el manejo post-paro, ¿cuál es una prioridad inmediata?", opciones: ["Dar de alta al paciente", "Estabilización hemodinámica y oxigenación", "Realizar radiografía", "Administrar antibióticos"], respuesta: 1 },
      { pregunta: "¿Cuál es el rol del líder en un equipo de reanimación?", opciones: ["Realizar compresiones todo el tiempo", "Coordinar acciones, asignar roles y tomar decisiones", "Registrar el evento únicamente", "Preparar medicamentos"], respuesta: 1 },
    ],
  },
  // ─── CURSO FARMACOLOGÍA 60 HORAS ───
  {
    id: "curso-farmacologia",
    titulo: "Curso Virtual de Farmacología",
    descripcion: "Formación de 60 horas en farmacología para estudiantes de ciencias de la salud. Cubre desde fundamentos, farmacocinética y farmacodinamia hasta cálculo de dosis, sistemas orgánicos y poblaciones especiales. 20 clases sincrónicas + trabajo autónomo.",
    instructor: "Dra. María López",
    categoria: "farmacologia",
    duracionHoras: 60,
    imagen: "💊",
    precio: 129900,
    modulos: [
      {
        titulo: "1. Introducción a la Farmacología (6h)",
        items: [
          "Concepto y ramas de la farmacología",
          "Historia de la farmacología",
          "Importancia clínica",
          "Clasificación de medicamentos",
          "Nombres genérico vs. comercial",
          "Formas farmacéuticas",
          "Vías de administración",
          "Normatividad básica farmacéutica (Colombia)",
        ],
      },
      {
        titulo: "2. Farmacocinética (9h)",
        items: [
          "Absorción y biodisponibilidad",
          "Factores que afectan la absorción",
          "Distribución: unión a proteínas, volumen de distribución",
          "Metabolismo hepático (fase I y fase II)",
          "Eliminación renal y vida media",
          "Concepto de estado estacionario",
        ],
      },
      {
        titulo: "3. Farmacodinamia (9h)",
        items: [
          "Receptores y mecanismos de acción",
          "Agonistas y antagonistas",
          "Curva dosis-respuesta",
          "Potencia y eficacia",
          "Efectos adversos y toxicidad",
          "Índice terapéutico y margen de seguridad",
        ],
      },
      {
        titulo: "4. Seguridad del Paciente en Farmacología (6h)",
        items: [
          "Errores de medicación: tipos y causas",
          "Los 10 correctos de la administración de medicamentos",
          "Farmacovigilancia",
          "Reacciones adversas a medicamentos (RAM)",
          "Notificación y prevención de RAM",
        ],
      },
      {
        titulo: "5. Cálculo de Dosis (9h)",
        items: [
          "Regla de tres y conversiones de unidades",
          "Cálculo de dosis en mg, mcg, UI",
          "Diluciones y concentraciones",
          "Cálculo de goteo (gotas/min, ml/h)",
          "Casos clínicos prácticos de cálculo de dosis",
        ],
      },
      {
        titulo: "6. Farmacología del Sistema Nervioso (9h)",
        items: [
          "Analgésicos opioides y no opioides",
          "Anestésicos locales y generales",
          "Psicofármacos: antidepresivos, ansiolíticos, antipsicóticos",
          "Anticonvulsivantes",
          "Sedantes e hipnóticos",
          "Casos clínicos del sistema nervioso",
        ],
      },
      {
        titulo: "7. Farmacología Cardiovascular (6h)",
        items: [
          "Antihipertensivos (IECA, ARA-II, calcioantagonistas, betabloqueadores)",
          "Diuréticos: clasificación y mecanismo",
          "Anticoagulantes y antiagregantes plaquetarios",
          "Antiarrítmicos",
          "Casos clínicos cardiovasculares",
        ],
      },
      {
        titulo: "8. Farmacología Antiinfecciosa (3h)",
        items: [
          "Clasificación de antibióticos",
          "Mecanismos de acción antibacteriana",
          "Resistencia bacteriana: causas y prevención",
          "Uso racional de antibióticos",
          "Antifúngicos y antivirales (generalidades)",
        ],
      },
      {
        titulo: "9. Farmacología en Poblaciones Especiales (3h)",
        items: [
          "Farmacología pediátrica: ajuste de dosis, particularidades",
          "Farmacología geriátrica: polifarmacia, interacciones",
          "Fármacos en el embarazo: categorías de riesgo",
          "Ajuste de dosis en paciente renal y hepático",
        ],
      },
    ],
    evaluacion: [
      { pregunta: "¿Qué estudia la farmacocinética?", opciones: ["El efecto del fármaco en el cuerpo", "Lo que el cuerpo le hace al fármaco (absorción, distribución, metabolismo, eliminación)", "La clasificación de los medicamentos", "Las interacciones medicamentosas únicamente"], respuesta: 1 },
      { pregunta: "¿Qué es la biodisponibilidad?", opciones: ["La velocidad de eliminación del fármaco", "La fracción del fármaco que llega a la circulación sistémica en forma activa", "El volumen de distribución", "La dosis máxima tolerada"], respuesta: 1 },
      { pregunta: "Un agonista es un fármaco que:", opciones: ["Bloquea el receptor sin activarlo", "Se une al receptor y produce una respuesta biológica", "Inhibe el metabolismo hepático", "Aumenta la eliminación renal"], respuesta: 1 },
      { pregunta: "¿Cuál es la fórmula básica para calcular goteo en gotas/min?", opciones: ["Volumen × tiempo × factor de goteo", "Volumen (ml) × factor de goteo / tiempo (min)", "Dosis / peso del paciente", "Concentración × volumen"], respuesta: 1 },
      { pregunta: "¿Qué son las RAM?", opciones: ["Respuestas Automáticas del Medicamento", "Reacciones Adversas a Medicamentos", "Registros de Administración Médica", "Regulaciones de Acceso a Medicamentos"], respuesta: 1 },
      { pregunta: "¿Cuál grupo de fármacos se usa como primera línea en hipertensión arterial?", opciones: ["Opioides", "IECA o ARA-II", "Anticonvulsivantes", "Antibióticos"], respuesta: 1 },
      { pregunta: "La resistencia bacteriana se produce principalmente por:", opciones: ["Uso de analgésicos", "Uso inadecuado e indiscriminado de antibióticos", "Vacunación", "Consumo de vitaminas"], respuesta: 1 },
      { pregunta: "¿Por qué se debe ajustar la dosis en pacientes con insuficiencia renal?", opciones: ["Porque absorben más rápido", "Porque eliminan el fármaco más lento, acumulándose en el cuerpo", "Porque metabolizan más rápido", "No se necesita ajuste"], respuesta: 1 },
      { pregunta: "¿Qué categoría de riesgo en embarazo indica que el fármaco es seguro?", opciones: ["Categoría X", "Categoría D", "Categoría A", "Categoría C"], respuesta: 2 },
      { pregunta: "El índice terapéutico mide:", opciones: ["La rapidez de absorción", "La relación entre la dosis tóxica y la dosis efectiva", "El costo del medicamento", "La biodisponibilidad oral"], respuesta: 1 },
    ],
  },
  // ─── CURSO BLS + ACLS 60 HORAS ───
  {
    id: "curso-bls-acls",
    titulo: "Curso Virtual BLS + ACLS",
    descripcion: "Formación de 60 horas basada en guías de la American Heart Association. BLS (20h): soporte vital básico, DEA, OVACE. ACLS (40h): algoritmos avanzados, ECG, farmacología de emergencia, mega códigos y simulación clínica virtual.",
    instructor: "Dr. Alejandro Posada",
    categoria: "emergencias",
    duracionHoras: 60,
    imagen: "🫀",
    precio: 129900,
    modulos: [
      {
        titulo: "BLS 1. Cadena de Supervivencia y Reconocimiento del Paro (4h)",
        items: [
          "Cadena de supervivencia (intra y extrahospitalaria)",
          "Reconocimiento del paro cardiorrespiratorio",
          "Activación del sistema de emergencias",
          "Evaluación de la escena y seguridad",
        ],
      },
      {
        titulo: "BLS 2. RCP de Alta Calidad (4h)",
        items: [
          "Técnica de compresiones torácicas de alta calidad",
          "Ventilaciones de rescate",
          "Relación compresiones:ventilaciones",
          "Minimización de interrupciones",
          "Retroalimentación en tiempo real",
        ],
      },
      {
        titulo: "BLS 3. Uso del DEA y OVACE (4h)",
        items: [
          "Uso del Desfibrilador Externo Automático (DEA)",
          "Colocación de parches y secuencia",
          "Obstrucción de vía aérea (OVACE) en adulto",
          "OVACE en niño y lactante",
          "Práctica guiada con objetos sustitutos",
        ],
      },
      {
        titulo: "BLS 4. Práctica y Evaluación BLS (8h)",
        items: [
          "Taller guiado de RCP (simulación en casa)",
          "Uso de maniquí improvisado (almohadas/sustitutos)",
          "Simulación virtual de escenarios BLS",
          "Examen teórico-práctico BLS",
          "Retroalimentación y refuerzo",
        ],
      },
      {
        titulo: "ACLS 1. Fundamentos y Algoritmos ACLS (6h)",
        items: [
          "Algoritmos ACLS: paro cardíaco, bradicardia, taquicardia",
          "Roles en el equipo de reanimación",
          "Enfoque sistemático de evaluación",
          "Diferencia entre ritmos desfibrilables y no desfibrilables",
          "Toma de decisiones basada en algoritmos",
        ],
      },
      {
        titulo: "ACLS 2. Interpretación de ECG (8h)",
        items: [
          "Ritmos cardíacos normales y anormales",
          "Fibrilación ventricular y taquicardia ventricular",
          "Asistolia y actividad eléctrica sin pulso (AESP)",
          "Bradicardia y bloqueos",
          "Taquicardias supraventriculares",
          "Práctica con simuladores ECG online",
        ],
      },
      {
        titulo: "ACLS 3. Farmacología de Emergencia (6h)",
        items: [
          "Adrenalina (Epinefrina): indicaciones, dosis, intervalos",
          "Amiodarona: uso en arritmias ventriculares",
          "Atropina: bradicardia sintomática",
          "Otros fármacos: lidocaína, vasopresina, adenosina",
          "Vías de administración en emergencia (IV, IO)",
        ],
      },
      {
        titulo: "ACLS 4. Manejo Avanzado de Vía Aérea (6h)",
        items: [
          "Dispositivos básicos: cánula orofaríngea, nasofaríngea",
          "Bolsa-válvula-mascarilla (BVM): técnica correcta",
          "Dispositivos supraglóticos (conceptual)",
          "Intubación endotraqueal (conceptual)",
          "Capnografía y confirmación de vía aérea",
        ],
      },
      {
        titulo: "ACLS 5. Casos Clínicos Integrados (8h)",
        items: [
          "Caso: Paro cardiorrespiratorio intrahospitalario",
          "Caso: Infarto Agudo de Miocardio (IAM)",
          "Caso: Accidente Cerebrovascular (ACV)",
          "Caso: Taquicardia inestable",
          "Caso: Bradicardia sintomática",
          "Análisis grupal y toma de decisiones",
        ],
      },
      {
        titulo: "ACLS 6. Simulación Virtual y Mega Códigos (6h)",
        items: [
          "Mega códigos: escenarios complejos integrados",
          "Liderazgo y comunicación en el equipo",
          "Simulación virtual de código azul",
          "Evaluación final práctica ACLS",
          "Retroalimentación y certificación",
        ],
      },
    ],
    evaluacion: [
      { pregunta: "¿Cuál es la diferencia principal entre BLS y ACLS?", opciones: ["No hay diferencia", "BLS usa solo compresiones; ACLS incluye fármacos, vía aérea avanzada y algoritmos", "ACLS es solo teórico", "BLS es solo para médicos"], respuesta: 1 },
      { pregunta: "¿Cuál es un ritmo desfibrilable?", opciones: ["Asistolia", "Actividad eléctrica sin pulso", "Fibrilación ventricular", "Bradicardia sinusal"], respuesta: 2 },
      { pregunta: "¿Cada cuánto se administra adrenalina en paro cardíaco?", opciones: ["Cada 1 minuto", "Cada 3–5 minutos", "Cada 10 minutos", "Una sola vez"], respuesta: 1 },
      { pregunta: "¿Qué fármaco es de primera línea en taquicardia ventricular sin pulso refractaria a desfibrilación?", opciones: ["Atropina", "Adenosina", "Amiodarona", "Metoprolol"], respuesta: 2 },
      { pregunta: "¿Qué indica la capnografía en un paciente intubado?", opciones: ["La presión arterial", "La saturación de oxígeno", "La concentración de CO₂ exhalado (confirma vía aérea y calidad de RCP)", "La frecuencia cardíaca"], respuesta: 2 },
      { pregunta: "En ACLS, ¿cuál es la primera acción ante un ritmo no desfibrilable (asistolia/AESP)?", opciones: ["Desfibrilar inmediatamente", "Iniciar RCP y administrar adrenalina", "Intubar primero", "Esperar al cardiólogo"], respuesta: 1 },
      { pregunta: "¿Qué significa AESP?", opciones: ["Arritmia Eléctrica Sin Pronóstico", "Actividad Eléctrica Sin Pulso", "Algoritmo de Emergencia Sin Protocolo", "Atención Especializada Sin Pausa"], respuesta: 1 },
      { pregunta: "¿Cuál es el rol del líder del equipo en un mega código?", opciones: ["Hacer compresiones todo el tiempo", "Coordinar, asignar roles, verificar algoritmos y tomar decisiones", "Solo observar", "Administrar medicamentos"], respuesta: 1 },
      { pregunta: "¿Qué fármaco se usa en bradicardia sintomática como primera línea?", opciones: ["Amiodarona", "Adrenalina", "Atropina", "Lidocaína"], respuesta: 2 },
      { pregunta: "Según las guías AHA, ¿cuál es la profundidad mínima de compresiones en adulto?", opciones: ["3 cm", "4 cm", "5 cm", "7 cm"], respuesta: 2 },
    ],
  },

  // ── Cuidado Integral del Adulto Mayor (60 h) ──
  {
    id: "curso-adulto-mayor",
    titulo: "Cuidado Integral del Adulto Mayor",
    descripcion: "Desarrolla competencias para brindar cuidado integral, humanizado y seguro al adulto mayor, abordando aspectos físicos, psicológicos, sociales y éticos.",
    instructor: "Dra. María López",
    categoria: "Cuidado Geriátrico",
    duracionHoras: 60,
    imagen: "/cursos/adulto-mayor.webp",
    precio: 129900,
    modulos: [
      {
        titulo: "1. Introducción al Envejecimiento",
        items: [
          "Concepto de envejecimiento",
          "Cambios biológicos, psicológicos y sociales",
          "Envejecimiento normal vs patológico",
          "Políticas de atención al adulto mayor en Colombia",
          "Foro: percepción del envejecimiento",
          "Quiz diagnóstico",
        ],
      },
      {
        titulo: "2. Valoración Integral del Adulto Mayor",
        items: [
          "Valoración geriátrica integral",
          "Escalas de valoración: Barthel, Lawton, Pfeiffer",
          "Identificación de riesgos: caídas, desnutrición, dependencia",
          "Taller de aplicación de escalas",
          "Estudio de caso",
        ],
      },
      {
        titulo: "3. Cuidados Básicos y Asistenciales",
        items: [
          "Higiene, confort y movilización",
          "Prevención de úlceras por presión",
          "Alimentación y nutrición del adulto mayor",
          "Administración de medicamentos (nociones básicas)",
          "Video práctico y lista de chequeo de cuidados",
        ],
      },
      {
        titulo: "4. Patologías Frecuentes en el Adulto Mayor",
        items: [
          "Enfermedades crónicas: hipertensión, diabetes",
          "Demencias incluyendo Alzheimer",
          "Parkinson y osteoporosis",
          "Manejo básico y signos de alarma",
          "Análisis de caso clínico",
        ],
      },
      {
        titulo: "5. Salud Mental y Apoyo Psicosocial",
        items: [
          "Depresión y ansiedad en el adulto mayor",
          "Soledad y abandono",
          "Comunicación efectiva con el adulto mayor",
          "Rol del cuidador",
          "Role play virtual y foro reflexivo",
        ],
      },
      {
        titulo: "6. Seguridad del Paciente y Prevención de Riesgos",
        items: [
          "Prevención de caídas",
          "Seguridad en el hogar",
          "Manejo de emergencias básicas",
          "Eventos adversos",
          "Diseño de plan de seguridad en casa",
        ],
      },
      {
        titulo: "7. Cuidados Paliativos y Final de Vida",
        items: [
          "Concepto de cuidados paliativos",
          "Manejo del dolor",
          "Acompañamiento familiar",
          "Dignidad en el final de la vida",
          "Ensayo reflexivo",
        ],
      },
      {
        titulo: "8. Ética, Humanización y Normativa",
        items: [
          "Derechos del adulto mayor",
          "Ética del cuidado",
          "Humanización en salud",
          "Normativa colombiana aplicable",
          "Análisis de dilemas éticos",
        ],
      },
    ],
    evaluacion: [
      { pregunta: "¿Cuál de las siguientes NO es una escala de valoración geriátrica?", opciones: ["Barthel", "Lawton", "Glasgow", "Pfeiffer"], respuesta: 2 },
      { pregunta: "¿Qué cambio es propio del envejecimiento normal?", opciones: ["Demencia severa", "Disminución de masa muscular", "Pérdida total de memoria", "Incapacidad para caminar"], respuesta: 1 },
      { pregunta: "La escala de Barthel evalúa:", opciones: ["Estado cognitivo", "Actividades básicas de la vida diaria", "Riesgo cardiovascular", "Nivel de dolor"], respuesta: 1 },
      { pregunta: "¿Cuál es la principal causa de caídas en el adulto mayor?", opciones: ["Factores ambientales y debilidad muscular", "Uso de tecnología", "Alimentación excesiva", "Exceso de ejercicio"], respuesta: 0 },
      { pregunta: "Las úlceras por presión se previenen principalmente con:", opciones: ["Medicamentos tópicos", "Cambios de posición frecuentes", "Reposo absoluto", "Dieta líquida"], respuesta: 1 },
      { pregunta: "¿Qué enfermedad se caracteriza por pérdida progresiva de memoria y funciones cognitivas?", opciones: ["Parkinson", "Osteoporosis", "Alzheimer", "Hipertensión"], respuesta: 2 },
      { pregunta: "El rol del cuidador incluye:", opciones: ["Solo administrar medicamentos", "Apoyo físico, emocional y social", "Tomar decisiones médicas sin consultar", "Aislar al adulto mayor"], respuesta: 1 },
      { pregunta: "Los cuidados paliativos se enfocan en:", opciones: ["Curar la enfermedad", "Prolongar la vida a toda costa", "Aliviar el sufrimiento y mejorar calidad de vida", "Suspender todo tratamiento"], respuesta: 2 },
      { pregunta: "¿Cuál es un derecho fundamental del adulto mayor en Colombia?", opciones: ["Acceso a atención integral en salud", "Trabajar sin límite de edad", "No recibir visitas", "Automedicarse libremente"], respuesta: 0 },
      { pregunta: "¿Qué componente debe incluir un plan integral de cuidado?", opciones: ["Solo medicamentos", "Valoración, diagnóstico, intervenciones y seguimiento", "Solo actividades recreativas", "Únicamente dieta"], respuesta: 1 },
    ],
  },
];
