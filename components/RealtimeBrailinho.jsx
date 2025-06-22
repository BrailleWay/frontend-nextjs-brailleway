// file: components/RealtimeBrailinho.jsx

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Mic, Phone, Ear, Loader2 } from "lucide-react";
import { verificarDisponibilidade, confirmarAgendamento } from "@/lib/actions";

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
  const audioPlayerRef = useRef(null);
  const localStreamRef = useRef(null);
  const dataChannelRef = useRef(null);

  // Limpa recursos
  const cleanup = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.srcObject = null;
    }
  }, []);

  // Função para enviar mensagem pelo DataChannel
  const sendToAssistant = useCallback((obj) => {
    const dc = dataChannelRef.current;
    if (dc && dc.readyState === "open") {
      dc.send(JSON.stringify(obj));
    }
  }, []);

  // Escuta a resposta do usuário para confirmações
  useEffect(() => {
    if (!pendingConfirm || !pendingArgs) return;

    // Função que interpreta "sim" ou "não" a partir da fala/texto
    const handleUserConfirm = async (event) => {
      if (!event.data) return;
      try {
        const msg = JSON.parse(event.data);
        if (
          msg.type === "response.audio_transcript.delta" ||
          msg.type === "response.audio_transcript.done"
        ) {
          const fala = (msg.transcript || msg.delta || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

          // Simples filtro: aceita "sim" ou "isso" como confirmação
          if (fala.includes("sim") || fala.includes("isso")) {
            // Refaz a chamada, agora com o valor confirmado
            let newArgs = { ...pendingArgs };
            if (pendingConfirm.tipo === "medico") {
              newArgs.nome_medico = pendingConfirm.sugestao;
            }
            if (pendingConfirm.tipo === "especialidade") {
              newArgs.especialidade = pendingConfirm.sugestao;
            }
            // Limpa estado e executa novamente
            setPendingConfirm(null);
            setPendingArgs(null);
            const output = await verificarDisponibilidade(newArgs);
            if (output.disponivel) {
              // (passo atual) Informa para IA, para ela mesma chamar a função de agendamento!
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
          // Recusa: usuário disse "não"
          if (fala.includes("nao") || fala.includes("não")) {
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
            return;
          }
        }
      } catch {}
    };

    // Assina o canal
    const dc = dataChannelRef.current;
    if (dc) {
      dc.addEventListener("message", handleUserConfirm);
    }
    return () => {
      if (dc) {
        dc.removeEventListener("message", handleUserConfirm);
      }
    };
  }, [pendingConfirm, pendingArgs, sendToAssistant]);

  // Efeito principal de conexão
  useEffect(() => {
    if (sessionStatus !== "authenticated") {
      setConnectionStatus(
        sessionStatus === "loading" ? "initializing" : "unauthenticated"
      );
      return;
    }

    let isComponentMounted = true;
    let localPc = null;
    let localDc = null;

    const connect = async () => {
      if (peerConnectionRef.current) return;

      if (isComponentMounted) setConnectionStatus("connecting");

      try {
        const sessionResponse = await fetch("/api/realtime-session");
        if (!sessionResponse.ok)
          throw new Error("Falha ao obter chave de sessão");
        const sessionData = await sessionResponse.json();
        const ephemeralKey = sessionData.client_secret.value;

        localPc = new RTCPeerConnection();
        peerConnectionRef.current = localPc;

        localPc.onconnectionstatechange = () => {
          if (
            ["failed", "disconnected", "closed"].includes(
              localPc.connectionState
            )
          ) {
            if (isComponentMounted) setConnectionStatus("error");
          }
        };

        localDc = localPc.createDataChannel("oai-events");
        dataChannelRef.current = localDc;

        localDc.onopen = () => {
          let systemPrompt = `
Sua função é agendar consultas para a plataforma BrailleWay.
Sempre confirme o nome do médico ou especialidade se houver mais de uma possibilidade ou se o nome não for exato.
Jamais agende sem confirmação clara do paciente.
Use obrigatoriamente as funções fornecidas. Fale sempre em português do Brasil. Seja claro e objetivo.
`;
          if (session?.user?.role)
            systemPrompt += ` O usuário é um ${session.user.role}.`;
          localDc.send(
            JSON.stringify({
              type: "session.update",
              session: { instructions: systemPrompt, tools },
            })
          );
        };

        // RECEBE RESPOSTAS DA IA
        localDc.onmessage = async (event) => {
          console.log("RECEBIDO NO DATACHANNEL:", event.data);
          let serverEvent;
          try {
            serverEvent = JSON.parse(event.data);
          } catch {
            return;
          }
          // Função chamada pela IA
          if (
            serverEvent.type === "response.done" &&
            serverEvent.response?.output?.some(
              (item) => item.type === "function_call"
            )
          ) {
            const functionCall = serverEvent.response.output.find(
              (item) => item.type === "function_call"
            );
            const { name, arguments: argsString, id: call_id } = functionCall;
            const args = JSON.parse(argsString);
            let output = {};

            try {
              if (name === "verificar_disponibilidade_medico") {
                output = await verificarDisponibilidade(args);

                // Se precisa confirmação (nomes parecidos ou múltiplos médicos), pede para o usuário!
                if (
                  output.precisaConfirmar &&
                  output.sugestoes &&
                  output.sugestoes.length > 0
                ) {
                  setPendingConfirm({
                    tipo: output.precisaConfirmar,
                    sugestao: output.sugestoes[0], // pega o mais parecido
                    call_id,
                  });
                  setPendingArgs(args);

                  let frasesugestao = "";
                  if (output.sugestoes.length === 1) {
                    if (output.precisaConfirmar === "medico") {
                      frasesugestao = `Você quis dizer o médico ${output.sugestoes[0]}? Por favor, responda sim ou não.`;
                    } else {
                      frasesugestao = `Você quis dizer a especialidade ${output.sugestoes[0]}? Por favor, responda sim ou não.`;
                    }
                  } else {
                    frasesugestao = `Encontrei mais de um resultado: ${output.sugestoes.join(
                      ", "
                    )}. Qual deles você deseja?`;
                  }

                  localDc.send(
                    JSON.stringify({
                      type: "conversation.item.create",
                      item: {
                        type: "message",
                        role: "assistant",
                        content: [
                          {
                            type: "audio",
                            transcript: frasesugestao,
                          },
                        ],
                      },
                    })
                  );
                  return; // Só volta para continuar depois do usuário responder
                }
              } else if (name === "confirmar_agendamento_consulta") {
                output = await confirmarAgendamento(args);
              }
            } catch (actionError) {
              output = {
                error: `Erro ao executar a função no servidor: ${actionError.message}`,
              };
            }

            if (localDc.readyState === "open" && isComponentMounted) {
              localDc.send(
                JSON.stringify({
                  type: "conversation.item.create",
                  item: {
                    type: "function_call_output",
                    call_id,
                    output: JSON.stringify(output),
                  },
                })
              );
              localDc.send(JSON.stringify({ type: "response.create" }));
            }
          }
        };

        if (!audioPlayerRef.current) audioPlayerRef.current = new Audio();
        audioPlayerRef.current.autoplay = true;

        localPc.ontrack = (event) => {
          if (isComponentMounted) setIsSpeaking(true);
          if (audioPlayerRef.current)
            audioPlayerRef.current.srcObject = event.streams[0];
          event.track.onended = () => {
            if (isComponentMounted) setIsSpeaking(false);
          };
        };

        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        if (!isComponentMounted)
          return userMediaStream.getTracks().forEach((track) => track.stop());
        localStreamRef.current = userMediaStream;
        userMediaStream
          .getTracks()
          .forEach((track) => localPc.addTrack(track, userMediaStream));

        const offer = await localPc.createOffer();
        await localPc.setLocalDescription(offer);

        const sdpResponse = await fetch(
          `https://api.openai.com/v1/realtime?model=gpt-4o-mini-realtime-preview`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/sdp",
              Authorization: `Bearer ${ephemeralKey}`,
            },
            body: offer.sdp,
          }
        );

        if (!sdpResponse.ok)
          throw new Error(`Erro na negociação SDP: ${sdpResponse.statusText}`);

        const answerSdp = await sdpResponse.text();
        await localPc.setRemoteDescription({ type: "answer", sdp: answerSdp });

        if (isComponentMounted) setConnectionStatus("connected");
      } catch (error) {
        if (isComponentMounted) setConnectionStatus("error");
        cleanup();
      }
    };

    connect();

    return () => {
      isComponentMounted = false;
      cleanup();
    };
  }, [sessionStatus, session, cleanup]);

  const getStatusIndicator = () => {
    switch (connectionStatus) {
      case "initializing":
        return (
          <div className="flex items-center justify-center text-gray-500">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Carregando
            sessão...
          </div>
        );
      case "unauthenticated":
        return (
          <div className="text-gray-500">
            Faça login como paciente para usar.
          </div>
        );
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
        return (
          <span className="text-red-500">Erro na Conexão. Tente reabrir.</span>
        );
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
      <Button
        onClick={cleanup}
        className="w-full"
        variant="destructive"
        disabled={
          connectionStatus !== "connected" && connectionStatus !== "error"
        }
      >
        <Phone className="w-4 h-4 mr-2" /> Encerrar Chamada
      </Button>
    </div>
  );
}

export default RealtimeBrailinho;
