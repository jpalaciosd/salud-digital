"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useAuth } from "@/lib/AuthContext";
import UserNav from "@/lib/UserNav";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SalaContent() {
  const { user, loading } = useAuth();
  const params = useSearchParams();
  const consultaId = params.get("id");

  const [consulta, setConsulta] = useState<Record<string, unknown> | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [chatMsgs, setChatMsgs] = useState<{ from: string; text: string; time: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [notes, setNotes] = useState("");
  const [videoReady, setVideoReady] = useState(false);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  // Load consultation
  useEffect(() => {
    if (!consultaId) return;
    fetch("/api/clinico/consultas")
      .then((r) => r.json())
      .then((d) => {
        const c = (d.consultas || []).find((x: Record<string, unknown>) => x.id === consultaId);
        if (c) setConsulta(c);
      });
  }, [consultaId]);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMsgs([...chatMsgs, {
      from: user?.nombre || "Yo",
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
    }]);
    setChatInput("");
  };

  const startConsulta = async () => {
    if (!consultaId) return;
    await fetch("/api/clinico/consultas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: consultaId, estado: "en_curso" }),
    });
    setVideoReady(true);
  };

  const endConsulta = async () => {
    if (!consultaId) return;
    await fetch("/api/clinico/consultas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: consultaId, estado: "completada" }),
    });
    // Redirect to HCE
    window.location.href = `/clinico/hce?consulta_id=${consultaId}`;
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="animate-spin h-10 w-10 border-4 border-[#c5a044] border-t-transparent rounded-full" />
    </div>
  );

  const isMedical = user && ["medico", "profesional", "admin"].includes((user as Record<string, string>).rol);

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white flex flex-col">
      {/* Top bar */}
      <div className="bg-[#0f2847] px-4 py-2 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link href="/clinico/agenda" className="text-gray-400 hover:text-white text-sm">← Agenda</Link>
          <div className="h-4 w-px bg-white/20" />
          <span className="text-sm font-bold">🩺 Teleconsulta</span>
          {consulta && <span className="text-xs text-gray-400">{(consulta.especialidad as string)?.replace("_", " ")}</span>}
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono ${videoReady ? "bg-red-500/20 text-red-400" : "bg-gray-500/20 text-gray-400"}`}>
            <span className={`w-2 h-2 rounded-full ${videoReady ? "bg-red-500 animate-pulse" : "bg-gray-500"}`} />
            {videoReady ? formatTime(elapsed) : "En espera"}
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Video area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative bg-[#0a0f1a] flex items-center justify-center">
            {/* Remote video placeholder */}
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#0a0f1a]">
              {videoReady ? (
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full bg-[#c5a044]/20 flex items-center justify-center text-6xl mx-auto mb-4">
                    {isMedical ? "👤" : "⚕️"}
                  </div>
                  <p className="text-gray-400 text-sm">
                    {isMedical ? (consulta?.paciente_nombre as string || "Paciente") : (consulta?.medico_nombre as string || "Médico")}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Video disponible con Daily.co (Fase 2)</p>
                  <p className="text-xs text-[#c5a044] mt-2">Chat activo · Notas clínicas disponibles</p>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-2xl bg-[#c5a044]/20 flex items-center justify-center text-4xl mx-auto">🩺</div>
                  <h2 className="text-lg font-bold">Sala de Teleconsulta</h2>
                  {consulta ? (
                    <>
                      <p className="text-sm text-gray-400">Consulta: {consulta.motivo as string}</p>
                      <p className="text-xs text-gray-500">
                        Paciente: {consulta.paciente_nombre as string || "—"} · Especialidad: {(consulta.especialidad as string)?.replace("_", " ")}
                      </p>
                      <button onClick={startConsulta}
                        className="mt-4 px-8 py-3 bg-green-600 text-white rounded-xl font-bold text-sm active:scale-95 transition">
                        ▶ Iniciar Teleconsulta
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">No se encontró la consulta. <Link href="/clinico/agenda" className="text-[#c5a044]">Ir a agenda →</Link></p>
                  )}
                </div>
              )}
            </div>

            {/* Self video (PIP) */}
            {videoReady && (
              <div className="absolute bottom-4 right-4 w-36 h-28 bg-[#1e293b] rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
                {camOff ? (
                  <span className="text-2xl">🚫</span>
                ) : (
                  <div className="text-center">
                    <span className="text-2xl">📷</span>
                    <p className="text-[8px] text-gray-500 mt-1">Cámara local</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          {videoReady && (
            <div className="bg-[#0f172a] border-t border-white/10 px-4 py-3 flex items-center justify-center gap-4">
              <button onClick={() => setMuted(!muted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition ${muted ? "bg-red-500/20 text-red-400" : "bg-white/10 text-white"}`}>
                {muted ? "🔇" : "🎤"}
              </button>
              <button onClick={() => setCamOff(!camOff)}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition ${camOff ? "bg-red-500/20 text-red-400" : "bg-white/10 text-white"}`}>
                {camOff ? "📵" : "📷"}
              </button>
              <button className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center text-xl">
                🖥️
              </button>
              <button onClick={endConsulta}
                className="px-6 h-12 rounded-full bg-red-600 text-white font-bold text-sm flex items-center gap-2 active:scale-95 transition">
                📞 Finalizar → HCE
              </button>
            </div>
          )}
        </div>

        {/* Sidebar: Chat + Notes */}
        {videoReady && (
          <div className="w-80 border-l border-white/10 flex flex-col bg-[#0f172a]">
            {/* Tabs */}
            <div className="flex border-b border-white/10">
              <button className="flex-1 py-2 text-xs font-bold text-[#c5a044] border-b-2 border-[#c5a044]">💬 Chat</button>
              <button className="flex-1 py-2 text-xs font-bold text-gray-400" onClick={() => {}}>📝 Notas</button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {chatMsgs.length === 0 && (
                <p className="text-xs text-gray-600 text-center mt-4">Sin mensajes. Inicie la conversación.</p>
              )}
              {chatMsgs.map((m, i) => (
                <div key={i} className="bg-white/5 rounded-xl px-3 py-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#c5a044]">{m.from}</span>
                    <span className="text-[10px] text-gray-600">{m.time}</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-0.5">{m.text}</p>
                </div>
              ))}
            </div>

            {/* Chat input */}
            <div className="p-3 border-t border-white/10">
              <div className="flex gap-2">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendChat()}
                  placeholder="Escribir mensaje..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none" />
                <button onClick={sendChat} className="px-3 py-2 bg-[#c5a044] text-[#0f172a] rounded-xl font-bold text-sm">→</button>
              </div>
            </div>

            {/* Clinical notes */}
            {isMedical && (
              <div className="p-3 border-t border-white/10">
                <p className="text-[10px] text-gray-500 mb-1">Notas clínicas (privadas)</p>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                  placeholder="Notas durante la consulta..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white resize-none" />
              </div>
            )}

            {/* Quick actions */}
            {isMedical && (
              <div className="p-3 border-t border-white/10 flex flex-col gap-2">
                <Link href={`/clinico/formula`} className="block py-2 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-bold text-center border border-purple-500/20">
                  💊 Formular
                </Link>
                <Link href={`/clinico/aiepi`} className="block py-2 bg-green-500/10 text-green-400 rounded-lg text-xs font-bold text-center border border-green-500/20">
                  🧒 AIEPI
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SalaTeleconsulta() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-[#c5a044] border-t-transparent rounded-full" /></div>}>
      <SalaContent />
    </Suspense>
  );
}
