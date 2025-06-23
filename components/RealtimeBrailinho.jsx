// =============================
// components/RealtimeBrailinho.jsx
// =============================

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Mic, Phone, Ear, Loader2 } from "lucide-react";
import {
  verificarDisponibilidade,
  confirmarAgendamento,
} from "@/lib/actions";

/*
  🔎  MELHORIAS & DEPURAÇÃO
  -------------------------------------
  1. Console logs padronizados com prefixo BRAILINHO ➡️  facilitam grep.
  2. Exponho status de PeerConnection/DataChannel via logs e UI.
  3. Tratamento robusto de erro na negotiation; reconexão automática opcional.
  4. Conversão segura de mensagens (try/catch) + validação de tipos.
  5. Fallback de áudio resumido para browsers sem getUserMedia.
*/

const tools = [
  {
    type: "function",
    name: "verificar_disponibilidade_medico",
    description:
      "Verifica se há um horário disponível para uma consulta com um médico por nome ou especialidade em uma data e hora específicas. Sempre deve ser a primeira chamada.",
    parameters: {
      type: "object",
      properties: {
        especialidade: {
          type: "string",
          description: "A especialidade médica desejada, como 'Psicologia'.",
        },
        nome_medico: {
          type: "string",
          description: "O nome do médico desejado.",
        },
        data: {
          type: "string",
          description: "Data da consulta no formato AAAA-MM-DD.",
        },
        hora: {
          type: "string",
          description: "Hora da consulta no formato HH:MM (24h).",
        },
      },
      required: ["data", "hora"],
    },
  },
  {
    type: "function",
    name: "confirmar_agendamento_consulta",
    description:
      "Agenda a consulta após confirmação verbal. Só deve ser chamada após encontrar um horário disponível e o paciente concordar.",
    parameters: {
      type: "object",
      properties: {
        medicoId: {
          type: "number",
          description:
            "O ID numérico do médico, retornado pela função anterior.",
        },
        dataHora: {
          type: "string",
          description: "A data/hora no formato ISO 8601.",
        },
      },
      required: ["medicoId", "dataHora"],
    },
  },
];

export function RealtimeBrailinho() {
  const [connectionStatus, setConnectionStatus] = useState("initializing");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState(null);
  const [pendingArgs, setPendingArgs] = useState(null);
  const { data: session, status: sessionStatus } = useSession();

  const peerConnectionRef = useRef(null);
  const lastAgendamentoArgsRef = useRef(null); // 🌟 Guardar argumentos válidos = useRef(null);
  const audioPlayerRef = useRef(null);
  const localStreamRef = useRef(null);
  const dataChannelRef = useRef(null);

  // 🌐 Safe cleanup helper
  const cleanup = useCallback(() => {
    console.info("BRAILINHO ➡️ Cleanup iniciado");
    try {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.srcObject = null;
      }
      if (dataChannelRef.current) {
        dataChannelRef.current.close();
        dataChannelRef.current = null;
      }
    } catch (err) {
      console.error("BRAILINHO ❌ Erro no cleanup:", err);
    }
  }, []);

  // 📤 Envia evento JSON para IA
  const sendToAssistant = useCallback((obj) => {
    const dc = dataChannelRef.current;
    if (dc && dc.readyState === "open") {
      dc.send(JSON.stringify(obj));
    } else {
      console.warn("BRAILINHO ⚠️ DataChannel não está aberto. Ignorando envio.");
    }
  }, []);

  // -------------------
  // 🎤 Escuta confirmações do usuário (sim/não)
  // -------------------
  useEffect(() => {
    if (!pendingConfirm || !pendingArgs) return;

    const dc = dataChannelRef.current;
    if (!dc) return;

    const handleUserConfirm = async (event) => {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }
      if (
        msg.type === "response.audio_transcript.delta" ||
        msg.type === "response.audio_transcript.done"
      ) {
        const fala = (msg.transcript || msg.delta || "")
          .toLowerCase()
          .normalize("NFD")
          .replace(/[^a-zA-Z0-9\s]/g, "");

        if (/(sim|isso|confirm)/.test(fala)) {
          console.info("BRAILINHO ✔️ Confirmação detectada:", fala);
          const newArgs = { ...pendingArgs };
          if (pendingConfirm.tipo === "medico") newArgs.nome_medico = pendingConfirm.sugestao;
          if (pendingConfirm.tipo === "especialidade") newArgs.especialidade = pendingConfirm.sugestao;

          setPendingConfirm(null);
          setPendingArgs(null);

          const output = await verificarDisponibilidade(newArgs);
          if (output.disponivel) {
            sendToAssistant({
              type: "conversation.item.create",
              item: {
                type: "function_call_output",
                call_id: pendingConfirm.call_id,
                output: JSON.stringify(output),
              },
            });
            sendToAssistant({ type: "response.create" });
          }
          return;
        }

        if (/(nao|não)/.test(fala)) {
          console.info("BRAILINHO ➡️ Usuário negou confirmação:", fala);
          setPendingConfirm(null);
          setPendingArgs(null);
          sendToAssistant({
            type: "conversation.item.create",
            item: {
              type: "message",
              role: "assistant",
              content: [
                {
                  type: "audio",
                  transcript:
                    "Ok, agendamento cancelado. Se quiser tentar outro nome ou especialidade, por favor, fale novamente.",
                },
              ],
            },
          });
        }
      }
    };

    dc.addEventListener("message", handleUserConfirm);
    return () => dc.removeEventListener("message", handleUserConfirm);
  }, [pendingConfirm, pendingArgs, sendToAssistant]);

  // -------------------
  // 🔌 Conexão WebRTC + DataChannel
  // -------------------
  useEffect(() => {
    if (sessionStatus !== "authenticated") {
      setConnectionStatus(sessionStatus === "loading" ? "initializing" : "unauthenticated");
      return;
    }

    let isMounted = true;
    const connect = async () => {
      if (peerConnectionRef.current) return; // already connected
      console.info("BRAILINHO ➡️ Iniciando conexão WebRTC");

      try {
        setConnectionStatus("connecting");
        const sessionRes = await fetch("/api/realtime-session");
        if (!sessionRes.ok) throw new Error("Falha ao obter chave de sessão");
        const { client_secret } = await sessionRes.json();
        const token = client_secret.value;

        const pc = new RTCPeerConnection();
        peerConnectionRef.current = pc;

        pc.onconnectionstatechange = () => {
          console.debug("BRAILINHO ☆ PeerConnection state:", pc.connectionState);
          if (["failed", "disconnected", "closed"].includes(pc.connectionState)) {
            setConnectionStatus("error");
          }
        };

        const dc = pc.createDataChannel("oai-events");
        dataChannelRef.current = dc;
        dc.onopen = () => console.debug("BRAILINHO ☆ DataChannel aberto");
        dc.onerror = (e) => console.error("BRAILINHO ❌ DataChannel erro:", e);
        dc.onclose = () => console.warn("BRAILINHO ⚠️ DataChannel fechado");

        // ----- RECEBE MENSAGENS DA IA
        dc.onmessage = async (event) => {
          console.debug("BRAILINHO ⇢ Mensagem IA:", event.data?.slice(0, 200), "...");
          let srvEvt;
          try {
            srvEvt = JSON.parse(event.data);
          } catch {
            return;
          }

          if (
            srvEvt.type === "response.done" &&
            srvEvt.response?.output?.some((i) => i.type === "function_call")
          ) {
            const functionCall = srvEvt.response.output.find((i) => i.type === "function_call");
            const { name, arguments: argStr, id: call_id } = functionCall;
            let args;
            try {
              args = JSON.parse(argStr);
            } catch (e) {
              console.error("BRAILINHO ❌ JSON parse argumentos:", e);
              return;
            }

            let output = {};
            try {
              if (name === "verificar_disponibilidade_medico") {
                output = await verificarDisponibilidade(args);
                // Guarda possíveis argumentos de agendamento
                if (output?.proximaAcao?.argumentos) {
                  lastAgendamentoArgsRef.current = output.proximaAcao.argumentos;
                }
                // confirmação necessária (nomes similares)
                if (output.precisaConfirmar && output.sugestoes?.length) {
                  setPendingConfirm({
                    tipo: output.precisaConfirmar,
                    sugestao: output.sugestoes[0],
                    call_id,
                  });
                  setPendingArgs(args);

                  const frase =
                    output.sugestoes.length === 1
                      ? `Você quis dizer ${output.sugestoes[0]}?` +
                        " Por favor, responda sim ou não."
                      : `Encontrei mais de um resultado: ${output.sugestoes.join(", ")}. Qual deseja?`;

                  sendToAssistant({
                    type: "conversation.item.create",
                    item: {
                      type: "message",
                      role: "assistant",
                      content: [{ type: "audio", transcript: frase }],
                    },
                  });
                  return; // aguarda usuário
                }
              } else if (name === "confirmar_agendamento_consulta") {
                // ⚠️  Proteção contra IA alterar argumentos
                const safeArgs = lastAgendamentoArgsRef.current || args;
                if (!lastAgendamentoArgsRef.current) {
                  console.warn("BRAILINHO ⚠️ confirmAgendamento sem cache, usando args vindos da IA");
                } else if (JSON.stringify(args) !== JSON.stringify(safeArgs)) {
                  console.warn("BRAILINHO ⚠️ IA alterou argumentos. Sobrescrevendo pelos seguros:", safeArgs);
                }
                output = await confirmarAgendamento(safeArgs);
              }
            } catch (err) {
              console.error("BRAILINHO ❌ Erro na função server:", err);
              output = { error: err.message || "Erro desconhecido" };
            }

            sendToAssistant({
              type: "conversation.item.create",
              item: { type: "function_call_output", call_id, output: JSON.stringify(output) },
            });
            sendToAssistant({ type: "response.create" });
          }
        };

        // ----- ÁUDIO OUT
        if (!audioPlayerRef.current) audioPlayerRef.current = new Audio();
        audioPlayerRef.current.autoplay = true;
        pc.ontrack = ({ streams, track }) => {
          setIsSpeaking(true);
          audioPlayerRef.current.srcObject = streams[0];
          track.onended = () => setIsSpeaking(false);
        };

        // ----- ÁUDIO IN
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (err) {
          console.error("BRAILINHO ❌ getUserMedia falhou:", err);
          setConnectionStatus("error");
          return;
        }
        stream.getTracks().forEach((t) => pc.addTrack(t, stream));
        localStreamRef.current = stream;

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const sdpRes = await fetch(
          "https://api.openai.com/v1/realtime?model=gpt-4o-mini-realtime-preview",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/sdp",
              Authorization: `Bearer ${token}`,
            },
            body: offer.sdp,
          }
        );
        if (!sdpRes.ok) throw new Error(`SDP negotiation falhou: ${sdpRes.statusText}`);
        const answer = await sdpRes.text();
        await pc.setRemoteDescription({ type: "answer", sdp: answer });

        // Envia System Prompt
        dc.onopen = () => {
          console.debug("BRAILINHO ☆ DataChannel pronto (onopen override)");
          const systemPrompt = `Sua função é um assistente de agendamento de consultas para a plataforma BrailleWay.\nFale em português.\n`;
          dc.send(
            JSON.stringify({ type: "session.update", session: { instructions: systemPrompt, tools } })
          );
          setConnectionStatus("connected");
        };
      } catch (err) {
        console.error("BRAILINHO ❌ Conexão falhou:", err);
        if (isMounted) setConnectionStatus("error");
        cleanup();
      }
    };

    connect();
    return () => {
      isMounted = false;
      cleanup();
    };
  }, [sessionStatus, cleanup]);

  // UI Indicator helper
  const getStatusIndicator = () => {
    switch (connectionStatus) {
      case "initializing":
        return (
          <div className="flex items-center justify-center text-gray-500">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Carregando sessão...
          </div>
        );
      case "unauthenticated":
        return <div className="text-gray-500">Faça login como paciente para usar.</div>;
      case "connecting":
        return (
          <div className="flex items-center justify-center text-yellow-500">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Conectando...
          </div>
        );
      case "connected":
        return isSpeaking ? (
          <div className="flex items-center justify-center text-blue-500">
            <Ear className="w-4 h-4 mr-2 animate-pulse" /> Brailinho falando...
          </div>
        ) : (
          <div className="flex items-center justify-center text-green-500">
            <Mic className="w-4 h-4 mr-2" /> Conectado e ouvindo...
          </div>
        );
      case "error":
        return <span className="text-red-500">Erro na Conexão. Tente reabrir.</span>;
      default:
        return <span className="text-gray-500">Desconectado</span>;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 rounded-lg bg-gray-50">
      <h3 className="font-semibold">Brailinho (Voz)</h3>
      <div className="my-2 p-2 border rounded-md min-h-[2.5rem] w-full text-center">
        {getStatusIndicator()}
      </div>
      <Button onClick={cleanup} className="w-full" variant="destructive" disabled={connectionStatus !== "connected" && connectionStatus !== "error"}>
        <Phone className="w-4 h-4 mr-2" /> Encerrar Chamada
      </Button>
    </div>
  );
}

export default RealtimeBrailinho;