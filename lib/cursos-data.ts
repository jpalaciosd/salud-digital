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
    titulo: "Rol del Curso de Enfermería en Salud Mental",
    descripcion: "Humanización, seguridad y respuesta oportuna. Capacitación para técnicos de enfermería en detección de descompensación, desescalada verbal, contención segura y autocuidado profesional.",
    instructor: "Enf. Jefe Carlos Mendoza",
    categoria: "enfermeria",
    duracionHoras: 8,
    imagen: "🩺",
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
];
