const { jsPDF } = require("jspdf");
const fs = require("fs");

const doc = new jsPDF({ unit: "mm", format: "a4" });
const W = 210, H = 297;
const ML = 20, MR = 20, MT = 25;
const PW = W - ML - MR;
let y = MT;
let pageNum = 1;

const NAVY = [15, 40, 71];
const GOLD = [197, 160, 68];
const BLACK = [30, 30, 30];
const GRAY = [100, 100, 100];
const LIGHT = [245, 245, 240];
const WHITE = [255, 255, 255];

function checkPage(need = 20) {
  if (y + need > H - 25) { addFooter(); doc.addPage(); pageNum++; y = MT; addHeader(); }
}

function addHeader() {
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, 12, "F");
  doc.setFontSize(8); doc.setTextColor(...GOLD);
  doc.text("ISSI — Instituto Superior de Salud Integral", ML, 8);
  doc.text("Manual de Usuario v1.0", W - MR, 8, { align: "right" });
  doc.setTextColor(...BLACK);
  y = MT;
}

function addFooter() {
  doc.setFontSize(7); doc.setTextColor(...GRAY);
  doc.text(`Página ${pageNum}`, W / 2, H - 10, { align: "center" });
  doc.text("salud-digital-iota.vercel.app", W - MR, H - 10, { align: "right" });
  doc.setDrawColor(...GOLD); doc.setLineWidth(0.3);
  doc.line(ML, H - 15, W - MR, H - 15);
}

function title(text, size = 22) {
  checkPage(25);
  doc.setFontSize(size); doc.setTextColor(...NAVY); doc.setFont("helvetica", "bold");
  doc.text(text, ML, y); y += size * 0.5 + 4;
}

function subtitle(text) {
  checkPage(18);
  doc.setFillColor(...NAVY); doc.rect(ML, y - 5, PW, 9, "F");
  doc.setFontSize(12); doc.setTextColor(...WHITE); doc.setFont("helvetica", "bold");
  doc.text(text, ML + 4, y + 1); y += 12;
  doc.setTextColor(...BLACK);
}

function subheading(text) {
  checkPage(14);
  doc.setFontSize(11); doc.setTextColor(...GOLD); doc.setFont("helvetica", "bold");
  doc.text(text, ML, y); y += 7;
  doc.setTextColor(...BLACK);
}

function para(text) {
  checkPage(12);
  doc.setFontSize(9.5); doc.setTextColor(...BLACK); doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(text, PW);
  lines.forEach(l => { checkPage(5); doc.text(l, ML, y); y += 4.5; });
  y += 3;
}

function bullet(text, indent = 0) {
  checkPage(8);
  doc.setFontSize(9.5); doc.setTextColor(...BLACK); doc.setFont("helvetica", "normal");
  const x = ML + 4 + indent;
  doc.setFillColor(...GOLD); doc.circle(x - 2, y - 1.2, 1, "F");
  const lines = doc.splitTextToSize(text, PW - 6 - indent);
  lines.forEach((l, i) => { checkPage(5); doc.text(l, x + 1, y); y += 4.5; });
  y += 1;
}

function step(num, text) {
  checkPage(10);
  doc.setFillColor(...GOLD); doc.roundedRect(ML, y - 5, 8, 8, 2, 2, "F");
  doc.setFontSize(10); doc.setTextColor(...WHITE); doc.setFont("helvetica", "bold");
  doc.text(String(num), ML + 4, y, { align: "center" });
  doc.setTextColor(...BLACK); doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(text, PW - 14);
  lines.forEach((l, i) => { doc.text(l, ML + 12, y + (i * 4.5)); });
  y += Math.max(8, lines.length * 4.5) + 3;
}

function infoBox(text) {
  checkPage(16);
  const lines = doc.splitTextToSize(text, PW - 12);
  const bh = lines.length * 4.5 + 8;
  doc.setFillColor(240, 245, 255); doc.roundedRect(ML, y - 3, PW, bh, 2, 2, "F");
  doc.setDrawColor(...NAVY); doc.setLineWidth(0.5);
  doc.roundedRect(ML, y - 3, PW, bh, 2, 2, "S");
  doc.setFontSize(9); doc.setTextColor(...NAVY); doc.setFont("helvetica", "italic");
  lines.forEach(l => { doc.text(l, ML + 6, y + 3); y += 4.5; });
  y += 8;
}

function tableRow(cols, widths, isBold = false, bg = null) {
  checkPage(8);
  let x = ML;
  if (bg) { doc.setFillColor(...bg); doc.rect(ML, y - 4, PW, 7, "F"); }
  doc.setFontSize(8.5); doc.setFont("helvetica", isBold ? "bold" : "normal");
  if (isBold) { doc.setTextColor(255, 255, 255); } else { doc.setTextColor(30, 30, 30); }
  cols.forEach((c, i) => { doc.text(String(c), x + 2, y); x += widths[i]; });
  y += 7;
}

// ==================== COVER PAGE ====================
doc.setFillColor(...NAVY); doc.rect(0, 0, W, H, "F");

// Gold accent line
doc.setFillColor(...GOLD); doc.rect(0, 100, W, 3, "F");

doc.setFontSize(14); doc.setTextColor(...GOLD); doc.setFont("helvetica", "bold");
doc.text("ISSI", W / 2, 65, { align: "center" });
doc.setFontSize(9); doc.setTextColor(180, 180, 180); doc.setFont("helvetica", "normal");
doc.text("Instituto Superior de Salud Integral", W / 2, 73, { align: "center" });

doc.setFontSize(28); doc.setTextColor(...WHITE); doc.setFont("helvetica", "bold");
doc.text("Manual de Usuario", W / 2, 125, { align: "center" });

doc.setFontSize(14); doc.setTextColor(...GOLD);
doc.text("Ecosistema de Telemedicina SaaS", W / 2, 138, { align: "center" });

doc.setFontSize(10); doc.setTextColor(160, 160, 160); doc.setFont("helvetica", "normal");
doc.text("Versión 1.0 — Abril 2026", W / 2, 155, { align: "center" });

doc.setFontSize(8); doc.setTextColor(120, 120, 120);
doc.text("salud-digital-iota.vercel.app", W / 2, 170, { align: "center" });

// Normativa
doc.setFontSize(7); doc.setTextColor(100, 100, 100);
doc.text("Res. 1995/1999 · Res. 2654/2019 · Decreto 2200/2005 · Ley 1581/2012", W / 2, H - 30, { align: "center" });
doc.text("© 2026 ISSI — Todos los derechos reservados", W / 2, H - 22, { align: "center" });

// ==================== TABLE OF CONTENTS ====================
doc.addPage(); pageNum++; y = MT; addHeader();

title("Tabla de Contenido", 18);
y += 5;
const toc = [
  ["1.", "Introducción y Acceso", 3],
  ["2.", "Registro e Inicio de Sesión", 3],
  ["3.", "Panel de Control (Dashboard)", 4],
  ["4.", "Centro Clínico — Hub Principal", 4],
  ["5.", "Agenda y Consultas", 5],
  ["6.", "Teleconsulta (Sala Virtual)", 6],
  ["7.", "Historia Clínica Electrónica (HCE)", 7],
  ["8.", "Fórmula Médica Digital", 8],
  ["9.", "Incapacidades Médicas", 8],
  ["10.", "Órdenes de Paraclínicos", 9],
  ["11.", "AIEPI Pediátrico", 10],
  ["12.", "Consentimiento Informado", 10],
  ["13.", "Panel de Auditoría", 11],
  ["14.", "Gestión de Pacientes", 11],
  ["15.", "Onboarding de IPS/Consultorio", 12],
  ["16.", "Agentes IA (Dr. Nova y Aura)", 12],
  ["17.", "Módulo de Educación", 13],
  ["18.", "Preguntas Frecuentes", 13],
];
toc.forEach(([num, label, pg]) => {
  doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(...NAVY);
  doc.text(num, ML + 2, y);
  doc.setFont("helvetica", "normal"); doc.setTextColor(...BLACK);
  doc.text(label, ML + 12, y);
  doc.setTextColor(...GRAY);
  doc.text(String(pg), W - MR, y, { align: "right" });
  doc.setDrawColor(220, 220, 220); doc.setLineWidth(0.2);
  doc.line(ML + 12 + doc.getTextWidth(label) + 2, y - 0.5, W - MR - 8, y - 0.5);
  y += 7;
});

// ==================== 1. INTRODUCCIÓN ====================
doc.addPage(); pageNum++; y = MT; addHeader();

subtitle("1. Introducción y Acceso");
para("ISSI (Instituto Superior de Salud Integral) es una plataforma de telemedicina SaaS diseñada para IPS, clínicas y consultorios en Colombia. Integra 12 módulos clínicos, 4 generadores de PDF, un catálogo de 110+ códigos CIE-10 y cumple con la normativa colombiana vigente.");
para("La plataforma está disponible en:");
infoBox("🌐  salud-digital-iota.vercel.app\n\nAccesible desde cualquier navegador web (Chrome, Firefox, Safari, Edge) en computador, tablet o celular.");

subheading("¿Para quién es ISSI?");
bullet("IPS y Clínicas: Gestión multi-sede con datos aislados por organización.");
bullet("Médicos y Especialistas: HCE, fórmulas, teleconsulta, paraclínicos desde cualquier dispositivo.");
bullet("Pacientes: Agendamiento, consentimiento digital, historial de consultas.");
bullet("Estudiantes: Formación continua en salud con certificación.");
bullet("Administradores: Métricas, auditoría y gestión de usuarios.");

subheading("Normativa Colombiana");
bullet("Resolución 1995/1999 — Estándares de Historia Clínica Electrónica");
bullet("Resolución 2654/2019 — Regulación de Telemedicina");
bullet("Decreto 2200/2005 — Requisitos de Prescripción Médica");
bullet("Ley 1581/2012 — Protección de Datos Personales");

// ==================== 2. REGISTRO ====================
doc.addPage(); pageNum++; y = MT; addHeader();

subtitle("2. Registro e Inicio de Sesión");
subheading("Crear una Cuenta");
step(1, "Ingrese a salud-digital-iota.vercel.app y haga clic en \"Solicitar Demo\" o \"Registrarse\".");
step(2, "Complete el formulario: nombre, apellido, correo electrónico y contraseña.");
step(3, "Seleccione su rol: Paciente, Estudiante o Profesional/Tutor.");
step(4, "Si selecciona Profesional, ingrese su especialidad médica.");
step(5, "Haga clic en \"Registrarme\". Será redirigido al dashboard.");

subheading("Inicio de Sesión con Google");
step(1, "En la página de login, haga clic en \"Continuar con Google\".");
step(2, "Seleccione su cuenta de Google y autorice el acceso.");
step(3, "Si es su primera vez, complete los datos faltantes de perfil.");

infoBox("💡 Tip: El inicio con Google es la forma más rápida. No necesita recordar contraseñas.");

subheading("Roles del Sistema");
const roles = [
  ["Rol", "Acceso", "Descripción"],
  ["Paciente", "Dashboard + Clínico", "Agenda citas, ve historial, firma consentimientos"],
  ["Estudiante", "Dashboard + Cursos", "Accede a cursos de formación + dashboard académico"],
  ["Profesional", "Profesional + Clínico", "HCE, fórmulas, consultas, paraclínicos"],
  ["Médico", "Profesional + Clínico", "Todos los módulos clínicos completos"],
  ["Admin", "Admin + Clínico", "Métricas, usuarios, auditoría"],
];
const rw = [28, 52, PW - 80];
roles.forEach((r, i) => tableRow(r, rw, i === 0, i === 0 ? NAVY : (i % 2 === 0 ? LIGHT : null)));

// ==================== 3. DASHBOARD ====================
doc.addPage(); pageNum++; y = MT; addHeader();

subtitle("3. Panel de Control (Dashboard)");
para("Después de iniciar sesión, será dirigido al panel correspondiente a su rol:");

subheading("Dashboard — Estudiante/Paciente (/dashboard)");
bullet("Resumen de cursos inscritos y progreso.");
bullet("Mis tutorías y agendas pendientes.");
bullet("Acceso directo al Centro Clínico.");
bullet("Notificaciones de consultas y alertas.");

subheading("Dashboard — Profesional (/profesional)");
bullet("Pool de solicitudes de tutoría pendientes.");
bullet("Mis tutorías aceptadas con estado.");
bullet("Métricas: tutorías completadas, calificación promedio.");
bullet("Acceso al Centro Clínico para consultas médicas.");

subheading("Dashboard — Administrador (/admin)");
bullet("Métricas generales: usuarios, inscripciones, ingresos.");
bullet("Gestión de pagos y promociones.");
bullet("Enlaces de pago y estrategia.");
bullet("Enlace directo a Panel de Auditoría clínica.");

subheading("Navegación");
para("La barra superior muestra su nombre, rol y enlaces principales. El enlace \"Clínico\" lo lleva al Hub de módulos clínicos. Use el menú para cambiar entre secciones.");

// ==================== 4. CENTRO CLÍNICO ====================
subtitle("4. Centro Clínico — Hub Principal");
para("Acceda desde el enlace \"Clínico\" en la navegación o directamente en /clinico. Este es el punto central de todos los módulos médicos.");

subheading("Módulos disponibles según rol");
const mods = [
  ["Módulo", "Médico", "Paciente", "Admin"],
  ["Agenda Clínica", "✅", "✅", "✅"],
  ["Teleconsulta (Sala)", "✅", "✅", "—"],
  ["Historia Clínica (HCE)", "✅", "Solo lectura", "—"],
  ["Fórmula Médica", "✅", "—", "—"],
  ["Incapacidades", "✅", "—", "—"],
  ["Paraclínicos", "✅", "—", "—"],
  ["AIEPI Pediátrico", "✅", "—", "—"],
  ["Consentimiento", "✅", "✅", "—"],
  ["Mis Pacientes", "✅", "—", "—"],
  ["Onboarding IPS", "✅", "—", "✅"],
  ["Auditoría", "—", "—", "✅"],
  ["Notificaciones", "✅", "✅", "✅"],
];
const mw = [42, 30, 30, 30];
mods.forEach((r, i) => tableRow(r, mw, i === 0, i === 0 ? NAVY : (i % 2 === 0 ? LIGHT : null)));

// ==================== 5. AGENDA ====================
doc.addPage(); pageNum++; y = MT; addHeader();

subtitle("5. Agenda y Consultas");
para("El módulo de Agenda Clínica (/clinico/agenda) permite crear, gestionar y dar seguimiento a las consultas médicas.");

subheading("Crear una Consulta");
step(1, "Haga clic en \"Nueva Consulta\" en la Agenda.");
step(2, "Seleccione el tipo: general, especializada, control o urgencia.");
step(3, "Ingrese el ID del paciente y opcionalmente notas.");
step(4, "La consulta se crea en estado \"Programada\".");

subheading("Estados de una Consulta");
para("Las consultas siguen un flujo de estados controlado:");
bullet("Programada → El médico puede \"Iniciar\" la consulta.");
bullet("En Curso → Se habilitan: Sala, HCE, Fórmula, Incapacidad, Paraclínicos.");
bullet("Completada → Se marca al terminar. Genera registro en auditoría.");
bullet("Cancelada / No Asistió → Estados terminales.");

infoBox("⚡ Importante: Solo las consultas \"En Curso\" permiten acceder a los módulos clínicos vinculados. El ID de consulta (consulta_id) se pasa automáticamente a cada módulo para trazabilidad.");

subheading("Acciones desde una Consulta en Curso");
bullet("🩺 Sala — Ingresa a la teleconsulta.");
bullet("📋 HCE — Abre el wizard de Historia Clínica.");
bullet("💊 Fórmula — Crea prescripción médica.");
bullet("🏥 Incapacidad — Genera certificado de incapacidad.");
bullet("🔬 Labs — Crea orden de paraclínicos.");
bullet("✅ Completar — Marca la consulta como finalizada.");

// ==================== 6. TELECONSULTA ====================
doc.addPage(); pageNum++; y = MT; addHeader();

subtitle("6. Teleconsulta (Sala Virtual)");
para("La Sala de Teleconsulta (/clinico/sala) es el espacio virtual para la atención en tiempo real. Conforme a la Resolución 2654/2019.");

subheading("Funcionalidades de la Sala");
bullet("Chat en tiempo real: Mensajes instantáneos entre médico y paciente.");
bullet("Notas clínicas privadas: Solo visibles para el profesional.");
bullet("Controles de audio y video: Activar/desactivar micrófono y cámara.");
bullet("Timer de consulta: Cronómetro automático desde el inicio.");
bullet("Acceso directo a módulos: Botones para HCE, Fórmula, Paraclínicos.");

subheading("Cómo Iniciar una Teleconsulta");
step(1, "Desde la Agenda, inicie una consulta (cambia a \"En Curso\").");
step(2, "Haga clic en el botón \"Sala\" para ingresar.");
step(3, "Active micrófono y cámara según necesite.");
step(4, "Use el chat para comunicarse con el paciente.");
step(5, "Tome notas clínicas privadas durante la consulta.");
step(6, "Al finalizar, haga clic en \"Terminar Consulta\" — será redirigido a completar la HCE.");

infoBox("📹 Nota: La videollamada integrada con Daily.co estará disponible en la próxima actualización. Actualmente la sala funciona con chat y notas.");

// ==================== 7. HCE ====================
doc.addPage(); pageNum++; y = MT; addHeader();

subtitle("7. Historia Clínica Electrónica (HCE)");
para("El módulo de HCE (/clinico/hce) permite crear historias clínicas completas en 8 pasos, conforme a la Resolución 1995/1999. Genera PDF firmado digitalmente.");

subheading("Wizard de 8 Pasos");
step(1, "Motivo de Consulta: Describa el motivo principal de la visita.");
step(2, "Enfermedad Actual: Detalle la evolución del cuadro clínico.");
step(3, "Antecedentes: Personales, familiares, quirúrgicos, farmacológicos, alérgicos.");
step(4, "Revisión por Sistemas: Checklist por sistema (cardiovascular, respiratorio, etc.).");
step(5, "Examen Físico: Hallazgos del examen por región corporal.");
step(6, "Signos Vitales: FC, FR, PA, T°, SpO2, peso, talla.");
step(7, "Diagnóstico: Búsqueda CIE-10 con autocompletado (110+ códigos). Diagnóstico principal y secundarios.");
step(8, "Plan de Manejo: Tratamiento, recomendaciones, seguimiento.");

subheading("Búsqueda CIE-10");
para("Al escribir en el campo de diagnóstico, el sistema busca automáticamente en el catálogo de 110+ códigos CIE-10 más usados en atención primaria colombiana. Incluye: enfermedades respiratorias, digestivas, cardiovasculares, endocrinas, mentales, musculoesqueléticas y más.");

subheading("Generar PDF");
para("Al completar la HCE, haga clic en \"Descargar PDF\". El documento incluye:");
bullet("Encabezado institucional ISSI (azul navy + dorado).");
bullet("Todas las secciones clínicas completadas.");
bullet("Códigos CIE-10 del diagnóstico.");
bullet("Espacio para firma del profesional.");
bullet("Pie de página con referencia a Res. 1995/1999.");

// ==================== 8. FÓRMULA ====================
doc.addPage(); pageNum++; y = MT; addHeader();

subtitle("8. Fórmula Médica Digital");
para("El módulo de Fórmula (/clinico/formula) permite crear prescripciones médicas digitales conforme al Decreto 2200/2005.");

subheading("Crear una Fórmula");
step(1, "Ingrese al módulo desde el Hub Clínico o desde una consulta en curso.");
step(2, "Agregue medicamentos: nombre, concentración, forma farmacéutica.");
step(3, "Para cada medicamento: dosis, frecuencia, vía de administración, duración.");
step(4, "Agregue indicaciones adicionales si es necesario.");
step(5, "Haga clic en \"Guardar Fórmula\".");
step(6, "Descargue el PDF para entregar al paciente.");

subheading("Contenido del PDF");
bullet("Datos del paciente y del profesional prescriptor.");
bullet("Tabla de medicamentos con todos los detalles.");
bullet("Indicaciones generales.");
bullet("Firma del profesional.");
bullet("Referencia al Decreto 2200/2005.");

// ==================== 9. INCAPACIDADES ====================
subtitle("9. Incapacidades Médicas");
para("El módulo de Incapacidades (/clinico/incapacidad) genera certificados de incapacidad médica.");

subheading("Tipos de Incapacidad");
bullet("Enfermedad General: La más común, por enfermedad o condición médica.");
bullet("Accidente de Trabajo: Por accidentes ocurridos en el trabajo (reportar a ARL).");
bullet("Licencia de Maternidad: 18 semanas según legislación colombiana.");
bullet("Licencia de Paternidad: 2 semanas según legislación colombiana.");

subheading("Crear una Incapacidad");
step(1, "Seleccione el tipo de incapacidad.");
step(2, "Busque el diagnóstico con CIE-10 (autocompletado).");
step(3, "Ingrese la fecha de inicio y el número de días.");
step(4, "El sistema calcula automáticamente la fecha de finalización.");
step(5, "Agregue observaciones clínicas.");
step(6, "Guarde y descargue el PDF.");

// ==================== 10. PARACLÍNICOS ====================
doc.addPage(); pageNum++; y = MT; addHeader();

subtitle("10. Órdenes de Paraclínicos");
para("El módulo de Paraclínicos (/clinico/paraclinicos) permite crear órdenes de laboratorio e imágenes diagnósticas con un catálogo de 26 exámenes comunes.");

subheading("Catálogo de Exámenes (26)");
const exams = [
  ["Categoría", "Exámenes incluidos"],
  ["Hematología", "Hemograma completo, VSG"],
  ["Química Sanguínea", "Glicemia, creatinina, BUN, ácido úrico, transaminasas"],
  ["Perfil Lipídico", "Colesterol total, HDL, LDL, triglicéridos"],
  ["Endocrinología", "TSH, T4 libre, hemoglobina glicosilada"],
  ["Imagenología", "Rx tórax, ecografía abdominal"],
  ["Serología", "VIH, VDRL, HBsAg"],
  ["Uroanálisis", "Parcial de orina, urocultivo"],
  ["Parasitología", "Coprológico"],
  ["Cardiología", "Electrocardiograma"],
];
const ew = [45, PW - 45];
exams.forEach((r, i) => tableRow(r, ew, i === 0, i === 0 ? NAVY : (i % 2 === 0 ? LIGHT : null)));
y += 5;

subheading("Crear una Orden");
step(1, "Busque exámenes por nombre o categoría.");
step(2, "Seleccione los exámenes necesarios (puede agregar varios).");
step(3, "Marque la prioridad: Normal o Urgente.");
step(4, "Agregue indicaciones clínicas.");
step(5, "Guarde y descargue el PDF con la orden.");

// ==================== 11. AIEPI ====================
subtitle("11. AIEPI Pediátrico");
para("El módulo AIEPI (/clinico/aiepi) implementa la estrategia de Atención Integrada a las Enfermedades Prevalentes de la Infancia (OMS/OPS), con un wizard de 10 pasos y clasificación automática por semáforo.");

subheading("Los 10 Pasos del AIEPI");
step(1, "Datos del niño: edad, peso, talla, temperatura.");
step(2, "Signos generales de peligro.");
step(3, "Tos y dificultad respiratoria.");
step(4, "Diarrea: duración, sangre, deshidratación.");
step(5, "Fiebre: duración, signos asociados.");
step(6, "Problema de oído.");
step(7, "Desnutrición y anemia.");
step(8, "Estado de vacunación.");
step(9, "Evaluación de la alimentación.");
step(10, "Clasificación final y conducta.");

subheading("Clasificación por Semáforo");
bullet("🔴 Rojo: Requiere referencia urgente al hospital.");
bullet("🟡 Amarillo: Tratamiento específico + seguimiento en 2-5 días.");
bullet("🟢 Verde: Manejo ambulatorio con cuidados en el hogar.");

// ==================== 12. CONSENTIMIENTO ====================
doc.addPage(); pageNum++; y = MT; addHeader();

subtitle("12. Consentimiento Informado");
para("El módulo de Consentimiento (/clinico/consentimiento) gestiona el consentimiento informado digital según la Resolución 2654/2019.");

subheading("Proceso");
step(1, "El sistema presenta al paciente la información sobre el procedimiento.");
step(2, "El paciente revisa la descripción, riesgos y beneficios.");
step(3, "El paciente acepta digitalmente el consentimiento.");
step(4, "Se genera un registro con fecha, hora y datos de ambas partes.");

infoBox("⚖️ El consentimiento informado es obligatorio antes de cualquier teleconsulta según la Resolución 2654/2019. La plataforma lo gestiona automáticamente en el flujo de onboarding.");

// ==================== 13. AUDITORÍA ====================
subtitle("13. Panel de Auditoría");
para("El Panel de Auditoría (/clinico/auditor) es accesible solo para roles admin y auditor. Proporciona trazabilidad completa de todas las acciones clínicas.");

subheading("Funcionalidades");
bullet("Log de auditoría: Cada acción (crear HCE, firmar fórmula, etc.) queda registrada.");
bullet("Filtros por tipo de recurso: HCE, fórmulas, consultas, incapacidades, etc.");
bullet("Filtros por acción: Crear, actualizar, eliminar.");
bullet("Estadísticas: Total de acciones, acciones por tipo, actividad reciente.");
bullet("Exportable para cumplimiento regulatorio.");

subheading("¿Qué se audita?");
bullet("Creación y modificación de historias clínicas.");
bullet("Emisión de fórmulas médicas.");
bullet("Cambios de estado en consultas.");
bullet("Firmas de consentimiento informado.");
bullet("Generación de incapacidades y órdenes de paraclínicos.");

// ==================== 14. PACIENTES ====================
subtitle("14. Gestión de Pacientes");
para("El módulo Mis Pacientes (/clinico/pacientes) ofrece al médico una vista consolidada de sus pacientes.");

subheading("Funcionalidades");
bullet("Lista de pacientes atendidos con última consulta.");
bullet("Historial de consultas por paciente.");
bullet("Acceso directo a HCEs anteriores con opción de PDF.");
bullet("Acciones rápidas: nueva consulta, ver fórmulas, ver incapacidades.");

// ==================== 15. ONBOARDING ====================
doc.addPage(); pageNum++; y = MT; addHeader();

subtitle("15. Onboarding de IPS/Consultorio");
para("El proceso de Onboarding (/clinico/onboarding) permite registrar una nueva organización (IPS, clínica o consultorio) en la plataforma.");

subheading("3 Pasos del Onboarding");
step(1, "Datos de la Organización: Nombre, NIT, dirección, teléfono, tipo (IPS, consultorio, clínica).");
step(2, "Perfil Clínico: Configurar el perfil del profesional responsable, especialidad, número de registro médico.");
step(3, "Consentimiento: Aceptar términos de uso y política de datos.");

infoBox("🏢 Multi-tenant: Cada organización opera con datos completamente aislados. Un profesional puede pertenecer a múltiples organizaciones.");

// ==================== 16. AGENTES IA ====================
subtitle("16. Agentes IA — Dr. Nova y Aura");
para("ISSI integra dos asistentes de inteligencia artificial disponibles 24/7 por WhatsApp.");

subheading("🩺 Dr. Nova — Agente Médico");
bullet("Evalúa síntomas mediante conversación guiada.");
bullet("Consulta su historia clínica y fórmulas activas.");
bullet("Le recuerda horarios de medicamentos.");
bullet("Deriva al especialista adecuado automáticamente.");
bullet("Agenda citas directamente desde WhatsApp.");
para("Contactar: wa.me/17433306127");

subheading("🎓 Aura — Mentora Académica");
bullet("Guía paso a paso por cada módulo de los cursos.");
bullet("Enseña con ejemplos prácticos y casos clínicos.");
bullet("Evalúa comprensión con preguntas de aplicación.");
bullet("Registra progreso automáticamente en la plataforma.");
bullet("Se adapta al ritmo de aprendizaje del estudiante.");
para("Contactar: wa.me/12763294935");

// ==================== 17. EDUCACIÓN ====================
doc.addPage(); pageNum++; y = MT; addHeader();

subtitle("17. Módulo de Educación");
para("ISSI incluye un catálogo de 12 cursos de formación continua en salud, accesibles desde /cursos. Los cursos son un valor agregado integrado al ecosistema clínico.");

subheading("Cursos Disponibles");
const cursos = [
  ["Curso", "Horas", "Precio COP"],
  ["Taller de Primeros Auxilios", "40h", "$89.900"],
  ["Seguridad del Paciente", "40h", "$89.900"],
  ["Salud Mental Comunitaria", "40h", "$89.900"],
  ["Enfermería en Salud Mental", "40h", "$89.900"],
  ["RCP Avanzado", "60h", "$129.900"],
  ["Farmacología Clínica", "60h", "$129.900"],
  ["BLS + ACLS", "60h", "$129.900"],
  ["Cuidado del Adulto Mayor", "60h", "$129.900"],
  ["Diplomado SST", "120h", "$189.900"],
  ["Diplomado Auditoría SST", "120h", "$189.900"],
  ["Diplomado SIG", "120h", "$189.900"],
  ["Taller Vig. Epidemiológica", "60h", "$129.900"],
];
const cw = [85, 25, PW - 110];
cursos.forEach((r, i) => tableRow(r, cw, i === 0, i === 0 ? NAVY : (i % 2 === 0 ? LIGHT : null)));
y += 5;

subheading("Proceso de Inscripción");
step(1, "Visite /cursos y seleccione el curso de su interés.");
step(2, "Haga clic en \"Inscribirme\".");
step(3, "Realice el pago según las instrucciones.");
step(4, "Acceda al contenido desde su dashboard.");
step(5, "Complete los módulos y evaluaciones.");
step(6, "Reciba su certificado digital al aprobar.");

// ==================== 18. FAQ ====================
subtitle("18. Preguntas Frecuentes");

subheading("¿Necesito instalar alguna aplicación?");
para("No. ISSI funciona completamente en el navegador web. Compatible con Chrome, Firefox, Safari y Edge en computador, tablet y celular.");

subheading("¿Mis datos clínicos son seguros?");
para("Sí. La plataforma cumple con la Ley 1581/2012 de protección de datos personales. Cada organización tiene datos aislados (multi-tenant). Toda acción queda registrada en el panel de auditoría.");

subheading("¿Puedo usar ISSI en mi celular?");
para("Sí. La plataforma es completamente responsive y se adapta a cualquier tamaño de pantalla.");

subheading("¿Cómo contacto soporte?");
para("Puede escribirnos por WhatsApp al +57 314 650 1052 o por correo a contacto@issi.edu.co.");

subheading("¿Los certificados de los cursos son universitarios?");
para("Los certificados son institucionales de ISSI. Validan la formación continua pero no son títulos universitarios.");

subheading("¿Puedo pertenecer a varias organizaciones?");
para("Sí. Un profesional puede estar vinculado a múltiples IPS o consultorios. Cada uno opera con datos independientes.");

// Add final footer
addFooter();

// Save
const outPath = "./public/manual-usuario-issi.pdf";
const buffer = doc.output("arraybuffer");
fs.writeFileSync(outPath, Buffer.from(buffer));
console.log(`✅ PDF generado: ${outPath} (${(Buffer.from(buffer).length / 1024).toFixed(0)} KB)`);
