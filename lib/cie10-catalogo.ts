// ── Catálogo CIE-10 (códigos más frecuentes en atención primaria Colombia) ──
// Para producción: importar catálogo completo (~14K códigos)

export interface CIE10Code {
  code: string;
  description: string;
  category: string;
}

export const CIE10_CATALOG: CIE10Code[] = [
  // Infecciosas
  { code: "A09", description: "Diarrea y gastroenteritis de presunto origen infeccioso", category: "Infecciosas" },
  { code: "A15", description: "Tuberculosis respiratoria", category: "Infecciosas" },
  { code: "A90", description: "Fiebre del dengue", category: "Infecciosas" },
  { code: "A91", description: "Fiebre del dengue hemorrágico", category: "Infecciosas" },
  { code: "B34", description: "Infección viral no especificada", category: "Infecciosas" },
  { code: "B37", description: "Candidiasis", category: "Infecciosas" },
  // Neoplasias
  { code: "C50", description: "Tumor maligno de la mama", category: "Neoplasias" },
  { code: "C53", description: "Tumor maligno del cuello del útero", category: "Neoplasias" },
  { code: "D50", description: "Anemia por deficiencia de hierro", category: "Sangre" },
  // Endocrinas
  { code: "E10", description: "Diabetes mellitus tipo 1", category: "Endocrinas" },
  { code: "E11", description: "Diabetes mellitus tipo 2", category: "Endocrinas" },
  { code: "E03", description: "Hipotiroidismo", category: "Endocrinas" },
  { code: "E05", description: "Tirotoxicosis (hipertiroidismo)", category: "Endocrinas" },
  { code: "E44", description: "Desnutrición proteicocalórica", category: "Endocrinas" },
  { code: "E46", description: "Desnutrición proteicocalórica no especificada", category: "Endocrinas" },
  { code: "E66", description: "Obesidad", category: "Endocrinas" },
  { code: "E78", description: "Trastornos del metabolismo de lipoproteínas (dislipidemia)", category: "Endocrinas" },
  // Trastornos mentales
  { code: "F10", description: "Trastornos mentales por uso de alcohol", category: "Mental" },
  { code: "F20", description: "Esquizofrenia", category: "Mental" },
  { code: "F31", description: "Trastorno afectivo bipolar", category: "Mental" },
  { code: "F32", description: "Episodio depresivo", category: "Mental" },
  { code: "F33", description: "Trastorno depresivo recurrente", category: "Mental" },
  { code: "F41", description: "Otros trastornos de ansiedad", category: "Mental" },
  { code: "F41.0", description: "Trastorno de pánico", category: "Mental" },
  { code: "F41.1", description: "Trastorno de ansiedad generalizada", category: "Mental" },
  { code: "F43", description: "Reacción al estrés grave y trastornos de adaptación", category: "Mental" },
  // Sistema nervioso
  { code: "G40", description: "Epilepsia", category: "Nervioso" },
  { code: "G43", description: "Migraña", category: "Nervioso" },
  { code: "G47", description: "Trastornos del sueño", category: "Nervioso" },
  // Ojo
  { code: "H10", description: "Conjuntivitis", category: "Ojo" },
  { code: "H52", description: "Trastornos de la refracción", category: "Ojo" },
  // Oído
  { code: "H65", description: "Otitis media no supurativa", category: "Oído" },
  { code: "H66", description: "Otitis media supurativa", category: "Oído" },
  // Circulatorio
  { code: "I10", description: "Hipertensión arterial esencial (primaria)", category: "Circulatorio" },
  { code: "I11", description: "Enfermedad cardíaca hipertensiva", category: "Circulatorio" },
  { code: "I20", description: "Angina de pecho", category: "Circulatorio" },
  { code: "I21", description: "Infarto agudo de miocardio", category: "Circulatorio" },
  { code: "I25", description: "Enfermedad isquémica crónica del corazón", category: "Circulatorio" },
  { code: "I48", description: "Fibrilación y aleteo auricular", category: "Circulatorio" },
  { code: "I50", description: "Insuficiencia cardíaca", category: "Circulatorio" },
  { code: "I63", description: "Infarto cerebral (ACV isquémico)", category: "Circulatorio" },
  { code: "I64", description: "Accidente cerebrovascular no especificado", category: "Circulatorio" },
  { code: "I83", description: "Venas varicosas de los miembros inferiores", category: "Circulatorio" },
  // Respiratorio
  { code: "J00", description: "Rinofaringitis aguda (resfriado común)", category: "Respiratorio" },
  { code: "J02", description: "Faringitis aguda", category: "Respiratorio" },
  { code: "J03", description: "Amigdalitis aguda", category: "Respiratorio" },
  { code: "J06", description: "Infección aguda de las vías respiratorias superiores", category: "Respiratorio" },
  { code: "J11", description: "Influenza (gripe)", category: "Respiratorio" },
  { code: "J15", description: "Neumonía bacteriana", category: "Respiratorio" },
  { code: "J18", description: "Neumonía no especificada", category: "Respiratorio" },
  { code: "J20", description: "Bronquitis aguda", category: "Respiratorio" },
  { code: "J21", description: "Bronquiolitis aguda", category: "Respiratorio" },
  { code: "J30", description: "Rinitis alérgica", category: "Respiratorio" },
  { code: "J31", description: "Rinitis crónica", category: "Respiratorio" },
  { code: "J40", description: "Bronquitis no especificada", category: "Respiratorio" },
  { code: "J44", description: "Enfermedad pulmonar obstructiva crónica (EPOC)", category: "Respiratorio" },
  { code: "J45", description: "Asma", category: "Respiratorio" },
  // Digestivo
  { code: "K02", description: "Caries dental", category: "Digestivo" },
  { code: "K21", description: "Enfermedad por reflujo gastroesofágico", category: "Digestivo" },
  { code: "K25", description: "Úlcera gástrica", category: "Digestivo" },
  { code: "K29", description: "Gastritis y duodenitis", category: "Digestivo" },
  { code: "K30", description: "Dispepsia funcional", category: "Digestivo" },
  { code: "K35", description: "Apendicitis aguda", category: "Digestivo" },
  { code: "K40", description: "Hernia inguinal", category: "Digestivo" },
  { code: "K59", description: "Otros trastornos funcionales del intestino (SII)", category: "Digestivo" },
  { code: "K76", description: "Hígado graso", category: "Digestivo" },
  { code: "K80", description: "Colelitiasis (cálculos biliares)", category: "Digestivo" },
  // Piel
  { code: "L01", description: "Impétigo", category: "Piel" },
  { code: "L02", description: "Absceso cutáneo, furúnculo", category: "Piel" },
  { code: "L20", description: "Dermatitis atópica", category: "Piel" },
  { code: "L23", description: "Dermatitis alérgica de contacto", category: "Piel" },
  { code: "L30", description: "Dermatitis no especificada", category: "Piel" },
  { code: "L50", description: "Urticaria", category: "Piel" },
  { code: "L60", description: "Trastornos de las uñas (onicomicosis)", category: "Piel" },
  { code: "L70", description: "Acné", category: "Piel" },
  // Musculoesquelético
  { code: "M15", description: "Poliartrosis", category: "Musculoesquelético" },
  { code: "M17", description: "Gonartrosis (artrosis de rodilla)", category: "Musculoesquelético" },
  { code: "M25", description: "Trastornos articulares no clasificados", category: "Musculoesquelético" },
  { code: "M54", description: "Dorsalgia (dolor de espalda)", category: "Musculoesquelético" },
  { code: "M54.5", description: "Lumbago (dolor lumbar)", category: "Musculoesquelético" },
  { code: "M79", description: "Trastornos de tejidos blandos (fibromialgia)", category: "Musculoesquelético" },
  // Genitourinario
  { code: "N10", description: "Nefritis tubulointersticial aguda (pielonefritis)", category: "Genitourinario" },
  { code: "N30", description: "Cistitis", category: "Genitourinario" },
  { code: "N39", description: "Infección de vías urinarias, sitio no especificado", category: "Genitourinario" },
  { code: "N40", description: "Hiperplasia de la próstata", category: "Genitourinario" },
  { code: "N76", description: "Vaginitis", category: "Genitourinario" },
  { code: "N92", description: "Menstruación excesiva/irregular", category: "Genitourinario" },
  // Embarazo
  { code: "O00", description: "Embarazo ectópico", category: "Embarazo" },
  { code: "O03", description: "Aborto espontáneo", category: "Embarazo" },
  { code: "O10", description: "Hipertensión preexistente en embarazo", category: "Embarazo" },
  { code: "O14", description: "Preeclampsia", category: "Embarazo" },
  { code: "O24", description: "Diabetes mellitus en embarazo", category: "Embarazo" },
  { code: "O80", description: "Parto único espontáneo", category: "Embarazo" },
  // Perinatales
  { code: "P07", description: "Recién nacido pretérmino", category: "Perinatales" },
  { code: "P22", description: "Dificultad respiratoria del recién nacido", category: "Perinatales" },
  { code: "P59", description: "Ictericia neonatal", category: "Perinatales" },
  // Malformaciones
  { code: "Q21", description: "Malformaciones cardíacas congénitas", category: "Congénitas" },
  // Síntomas y signos
  { code: "R05", description: "Tos", category: "Síntomas" },
  { code: "R10", description: "Dolor abdominal", category: "Síntomas" },
  { code: "R11", description: "Náusea y vómito", category: "Síntomas" },
  { code: "R42", description: "Mareo y desvanecimiento", category: "Síntomas" },
  { code: "R50", description: "Fiebre de origen desconocido", category: "Síntomas" },
  { code: "R51", description: "Cefalea", category: "Síntomas" },
  { code: "R53", description: "Malestar y fatiga", category: "Síntomas" },
  { code: "R56", description: "Convulsiones no clasificadas", category: "Síntomas" },
  // Traumatismos
  { code: "S00", description: "Traumatismo superficial de la cabeza", category: "Traumatismos" },
  { code: "S52", description: "Fractura del antebrazo", category: "Traumatismos" },
  { code: "S82", description: "Fractura de la pierna", category: "Traumatismos" },
  { code: "S93", description: "Luxación/esguince del tobillo", category: "Traumatismos" },
  { code: "T78", description: "Reacción alérgica no especificada", category: "Traumatismos" },
  // Factores de riesgo
  { code: "Z00", description: "Examen general/consulta de control", category: "Factores" },
  { code: "Z01", description: "Examen especial", category: "Factores" },
  { code: "Z23", description: "Necesidad de vacunación", category: "Factores" },
  { code: "Z30", description: "Anticoncepción", category: "Factores" },
  { code: "Z34", description: "Supervisión de embarazo normal", category: "Factores" },
  { code: "Z71", description: "Consulta para consejería", category: "Factores" },
  { code: "Z76", description: "Persona en contacto con servicios de salud", category: "Factores" },
];

// Search function
export function searchCIE10(query: string, limit = 10): CIE10Code[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return CIE10_CATALOG
    .filter((c) =>
      c.code.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    )
    .slice(0, limit);
}
