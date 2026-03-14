# Lambda Dr. Nova — Agente médico SaludDigital

Lambda para el agente WhatsApp Dr. Nova (triaje, historia clínica, fórmulas, recordatorios, derivación y agendamiento de citas). Recibe webhook de Twilio, consulta datos del paciente en Vercel y responde vía OpenAI.

## Variables de entorno (Lambda)

| Variable | Descripción |
|----------|-------------|
| `OPENAI_API_KEY` | API key de OpenAI |
| `TWILIO_SID` | Account SID de Twilio |
| `TWILIO_AUTH_TOKEN` | Token de Twilio |
| `TWILIO_WHATSAPP_NUMBER` | Ej. `whatsapp:+17433306127` |
| `VERCEL_URL` | URL base de la app (ej. `https://tu-app.vercel.app`) |
| `DR_NOVA_API_SECRET` | Mismo valor que en Vercel (`DR_NOVA_API_SECRET`) |
| `DR_NOVA_CONTACTOS_TABLE` | (Opcional) Nombre tabla DynamoDB historial. Por defecto: `Asistente-AINovaX-contactos` |
| `OPENAI_MODEL` | (Opcional) Modelo OpenAI. Por defecto: `gpt-4o-mini` |

## DynamoDB

- Tabla con clave de partición `phone_id` (string, ej. `whatsapp:+573001234567`).
- Atributos: `mensajes` (lista de `{role, content}`), `last_message_formatted` (string opcional).

## Despliegue

1. Instalar dependencias: `pip install -r requirements.txt -t .`
2. Empaquetar `lambda_function.py`, `prompts.py` y la carpeta de paquetes en un ZIP (o usar capa para dependencias).
3. Configurar el handler: `lambda_function.lambda_handler`.
4. En Twilio, configurar el webhook de WhatsApp apuntando a la URL de la función (API Gateway o Function URL).

## Vercel

En el proyecto SaludDigital deben existir:

- `GET /api/agente/datos-paciente?telefono=...` (header `x-api-key`)
- `POST /api/agente/cita` (body: telefono, medicoId, medicoNombre, especialidad, fecha, hora, tipo, motivo)

Y la variable de entorno `DR_NOVA_API_SECRET` con el mismo valor que en la Lambda.
