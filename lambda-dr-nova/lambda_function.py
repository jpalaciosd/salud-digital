"""
Lambda Dr. Nova — Agente médico IPS Virtual SaludDigital.
Recibe webhook de Twilio (WhatsApp), obtiene contexto del paciente desde Vercel,
genera respuesta con OpenAI y opcionalmente agenda cita en Vercel.
"""

import os
import json
import urllib.parse
import requests
from requests.auth import HTTPBasicAuth
import boto3
from openai import OpenAI
from prompts import build_system_prompt
from datetime import datetime
from zoneinfo import ZoneInfo

# Configuración
OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
TWILIO_SID = os.environ["TWILIO_SID"]
TWILIO_AUTH_TOKEN = os.environ["TWILIO_AUTH_TOKEN"]
TWILIO_NUMBER = os.environ.get("TWILIO_WHATSAPP_NUMBER", "whatsapp:+17433306127")
VERCEL_URL = (os.environ.get("VERCEL_URL") or "").rstrip("/")
DR_NOVA_API_SECRET = os.environ.get("DR_NOVA_API_SECRET")

dynamodb = boto3.resource("dynamodb")
# Ajusta el nombre de la tabla si usas otra en AWS
tabla_contactos = dynamodb.Table(
    os.environ.get("DR_NOVA_CONTACTOS_TABLE", "Asistente-AINovaX-contactos")
)

client = OpenAI(api_key=OPENAI_API_KEY)


def now_col():
    return datetime.now(ZoneInfo("America/Bogota"))


def normalize_phone(twilio_from: str) -> str:
    """Extrae número para uso en APIs (ej. whatsapp:+573001234567 -> 573001234567)."""
    s = (twilio_from or "").replace("whatsapp:", "").replace("+", "").replace(" ", "")
    return s.strip() or twilio_from


def obtener_historial(from_number: str):
    try:
        response = tabla_contactos.get_item(Key={"phone_id": from_number})
        if "Item" in response:
            item = response["Item"]
            return (
                item.get("mensajes", []),
                item.get("last_message_formatted"),
            )
    except Exception as e:
        print(f"[DynamoDB] Error obtener historial: {e}")
    return [], None


def actualizar_historial(from_number: str, historial_mensajes: list):
    fecha_local = now_col().strftime("%Y-%m-%d %H:%M:%S")
    try:
        tabla_contactos.update_item(
            Key={"phone_id": from_number},
            UpdateExpression="SET mensajes = :m, last_message_formatted = :f",
            ExpressionAttributeValues={
                ":m": historial_mensajes,
                ":f": fecha_local,
            },
        )
    except Exception as e:
        print(f"[DynamoDB] Error actualizar historial: {e}")


def fetch_datos_paciente(telefono: str) -> str | None:
    """Obtiene datos del paciente desde Vercel. Retorna JSON string para el prompt o None."""
    if not VERCEL_URL or not DR_NOVA_API_SECRET:
        return None
    url = f"{VERCEL_URL}/api/agente/datos-paciente?telefono={urllib.parse.quote(telefono)}"
    try:
        r = requests.get(
            url,
            headers={"x-api-key": DR_NOVA_API_SECRET},
            timeout=10,
        )
        if r.status_code != 200:
            return None
        data = r.json()
        if not data.get("encontrado"):
            return None
        return json.dumps(
            {
                "nombreCompleto": data.get("nombreCompleto"),
                "historia": data.get("historia", [])[:15],
                "formulasActivas": data.get("formulasActivas", []),
                "proximasCitas": data.get("proximasCitas", []),
            },
            ensure_ascii=False,
        )
    except Exception as e:
        print(f"[Vercel] Error datos-paciente: {e}")
    return None


def enviar_mensaje_twilio(to: str, body: str):
    url = f"https://api.twilio.com/2010-04-01/Accounts/{TWILIO_SID}/Messages.json"
    data = {"From": TWILIO_NUMBER, "To": to, "Body": body}
    r = requests.post(
        url,
        data=data,
        auth=HTTPBasicAuth(TWILIO_SID, TWILIO_AUTH_TOKEN),
        timeout=15,
    )
    return r.status_code, r.text


def contiene_agendar_cita(texto: str) -> bool:
    return "[AGENDAR_CITA]" in texto


def extraer_datos_cita(texto: str) -> dict | None:
    """Extrae datos de cita. Acepta typo 'medicold' como medicoId; si falta medicoNombre y medicoId=Por asignar, usa Por asignar."""
    lines = texto.splitlines()
    in_block = False
    data = {}
    for line in lines:
        if "[AGENDAR_CITA]" in line:
            in_block = True
            continue
        if in_block and "=" in line:
            key, _, value = line.strip().partition("=")
            key = key.strip().lower()
            value = value.strip()
            if key == "medicold":
                key = "medicoid"
            if key in ("medicoid", "mediconombre", "especialidad", "fecha", "hora", "tipo", "motivo", "notas"):
                data[key] = value
        elif in_block and line.strip() and "=" not in line:
            break
    medico_nombre = data.get("mediconombre")
    if not medico_nombre and data.get("medicoid") == "Por asignar":
        medico_nombre = "Por asignar"
    if not medico_nombre or not data.get("fecha") or not data.get("hora") or not data.get("tipo") or not data.get("motivo"):
        return None
    return {
        "medicoId": data.get("medicoid") or "",
        "medicoNombre": medico_nombre,
        "especialidad": data.get("especialidad") or "Medicina general",
        "fecha": data.get("fecha", ""),
        "hora": data.get("hora", ""),
        "tipo": data.get("tipo", "teleconsulta"),
        "motivo": data.get("motivo", ""),
        "notas": data.get("notas"),
    }


def quitar_bloque_agendar_cita(texto: str) -> str:
    """Elimina [AGENDAR_CITA] y las líneas key=value (incluye medicold) del mensaje al usuario."""
    lines = texto.splitlines()
    out = []
    in_block = False
    for line in lines:
        if "[AGENDAR_CITA]" in line:
            in_block = True
            continue
        if in_block and "=" in line:
            key = line.strip().split("=")[0].strip().lower()
            if key in ("medicoid", "medicold", "mediconombre", "especialidad", "fecha", "hora", "tipo", "motivo", "notas"):
                continue
        if in_block and line.strip() == "":
            in_block = False
        if not in_block:
            out.append(line)
    return "\n".join(out).strip()


def crear_cita_vercel(telefono: str, payload: dict) -> bool:
    if not VERCEL_URL or not DR_NOVA_API_SECRET:
        print("[Vercel] Falta VERCEL_URL o DR_NOVA_API_SECRET")
        return False
    url = f"{VERCEL_URL}/api/agente/cita"
    body = {
        "telefono": telefono,
        "medicoNombre": payload.get("medicoNombre") or "Por asignar",
        "especialidad": payload.get("especialidad"),
        "fecha": payload.get("fecha"),
        "hora": payload.get("hora"),
        "tipo": payload.get("tipo"),
        "motivo": payload.get("motivo"),
        "notas": payload.get("notas"),
    }
    medico_id = payload.get("medicoId")
    if medico_id and medico_id.strip() and medico_id != "Por asignar":
        body["medicoId"] = medico_id
    body = {k: v for k, v in body.items() if v is not None}
    try:
        r = requests.post(
            url,
            json=body,
            headers={
                "x-api-key": DR_NOVA_API_SECRET,
                "Content-Type": "application/json",
            },
            timeout=10,
        )
        if r.status_code in (200, 201):
            return True
        print(f"[Vercel] POST cita status={r.status_code} body={r.text}")
    except Exception as e:
        print(f"[Vercel] Error POST cita: {e}")
    return False


def lambda_handler(event, context):
    try:
        body_str = event.get("body", "")
        body_dict = urllib.parse.parse_qs(body_str)
        from_number = (body_dict.get("From") or [""])[0]
        message_body = (body_dict.get("Body") or [""])[0]

        if not from_number:
            return {
                "statusCode": 400,
                "body": json.dumps("Error: Número de teléfono vacío."),
            }

        telefono = normalize_phone(from_number)
        patient_context_str = fetch_datos_paciente(telefono)

        if patient_context_str is None:
            base_url = VERCEL_URL or "https://salud-digital-iota.vercel.app"
            registro_url = f"{base_url.rstrip('/')}/registro" if base_url.startswith("http") else "https://salud-digital-iota.vercel.app/registro"
            mensaje_no_registrado = (
                "Hola. Soy *Dr. Nova*, tu asistente de salud de SaludDigital.\n\n"
                "Para poder atenderte necesitas estar registrado en la plataforma con *este número de WhatsApp*.\n\n"
                f"Regístrate aquí: {registro_url}\n\n"
                "Cuando estés registrado, escríbeme de nuevo."
            )
            enviar_mensaje_twilio(from_number, mensaje_no_registrado)
            return {"statusCode": 200, "body": json.dumps({"ok": True, "accion": "no_registrado"})}

        system_prompt = build_system_prompt(patient_context_str)
        historial_mensajes, _ = obtener_historial(from_number)
        historial_mensajes.append({"role": "user", "content": message_body})

        messages = [{"role": "system", "content": system_prompt}]
        messages.extend(historial_mensajes)

        response = client.chat.completions.create(
            model=os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
            messages=messages,
        )
        respuesta_ai = (response.choices[0].message.content or "").strip()
        if not respuesta_ai:
            raise Exception("No se generó respuesta desde OpenAI")

        historial_mensajes.append({"role": "assistant", "content": respuesta_ai})
        actualizar_historial(from_number, historial_mensajes)

        texto_para_usuario = respuesta_ai
        if contiene_agendar_cita(respuesta_ai):
            datos = extraer_datos_cita(respuesta_ai)
            if datos and crear_cita_vercel(telefono, datos):
                texto_para_usuario = quitar_bloque_agendar_cita(respuesta_ai)
                if not texto_para_usuario:
                    texto_para_usuario = "He agendado tu cita. Recibirás confirmación por la plataforma. Si necesitas algo más, escríbeme."

        status_code, twilio_response = enviar_mensaje_twilio(from_number, texto_para_usuario)
        fecha_local_str = now_col().strftime("%Y-%m-%d %H:%M:%S")

        return {
            "statusCode": status_code,
            "body": json.dumps({
                "respuesta_ai": texto_para_usuario,
                "twilio_response": twilio_response,
                "ultima_fecha_local_colombia": fecha_local_str,
            }),
        }
    except Exception as e:
        print(f"Error en Lambda: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps(str(e)),
        }
