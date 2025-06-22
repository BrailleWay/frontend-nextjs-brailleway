// file: components/RealtimeBrailinho.jsx (VERSÃO FINAL E CORRIGIDA)
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Mic, Phone, Ear, Loader2 } from 'lucide-react';
import { verificarDisponibilidade, confirmarAgendamento } from '@/lib/actions';

// --- CORREÇÃO APLICADA AQUI ---
// A estrutura agora é "plana", sem o objeto "function" aninhado.
const tools = [
  {
    type: "function",
    name: "verificar_disponibilidade_medico",
    description: "Verifica se há um horário disponível para uma consulta com um médico por nome ou especialidade em uma data e hora específicas. Esta função deve ser sempre a primeira a ser chamada no processo de agendamento.",
    parameters: {
      type: "object",
      properties: {
        especialidade: { type: "string", description: "A especialidade médica desejada, como 'Psicologia' ou 'Cardiologia'." },
        nome_medico: { type: "string", description: "O nome do médico desejado pelo paciente." },
        data: { type: "string", description: "A data da consulta no formato AAAA-MM-DD. Exemplo: '2025-07-15'." },
        hora: { type: "string", description: "A hora da consulta no formato HH:MM (formato 24 horas). Exemplo: '14:30'." }
      },
      required: ["data", "hora"],
    },
  },
  {
    type: "function",
    name: "confirmar_agendamento_consulta",
    description: "Agenda de fato a consulta após o usuário confirmar verbalmente. Só deve ser chamada depois que a função 'verificar_disponibilidade_medico' encontrar um horário e o usuário concordar explicitamente com o agendamento.",
    parameters: {
      type: "object",
      properties: {
        medicoId: { type: "number", description: "O ID numérico do médico, retornado pela função de verificação." },
        dataHora: { type: "string", description: "A data e hora exatas no formato ISO 8601 (ex: '2025-07-15T14:30:00.000Z') retornada pela função de verificação." }
      },
      required: ["medicoId", "dataHora"],
    },
  }
];

export function RealtimeBrailinho() {
  const [connectionStatus, setConnectionStatus] = useState('initializing');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { data: session, status: sessionStatus } = useSession();

  const peerConnectionRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const localStreamRef = useRef(null);

  const cleanup = useCallback(() => {
    if (peerConnectionRef.current) {
      console.log("DEBUG: Limpando conexão existente.");
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (sessionStatus !== 'authenticated') {
      setConnectionStatus(sessionStatus === 'loading' ? 'initializing' : 'unauthenticated');
      return;
    }

    let isComponentMounted = true;
    let localPc = null;
    let localDc = null;

    const connect = async () => {
      if (peerConnectionRef.current) return;
      
      if (isComponentMounted) setConnectionStatus('connecting');

      try {
        console.log("DEBUG: Iniciando conexão...");
        const sessionResponse = await fetch("/api/realtime-session");
        if (!sessionResponse.ok) throw new Error("Falha ao obter chave de sessão");
        const sessionData = await sessionResponse.json();
        const ephemeralKey = sessionData.client_secret.value;
        console.log("DEBUG: Chave de sessão recebida.");

        localPc = new RTCPeerConnection();
        peerConnectionRef.current = localPc;
        
        localPc.onconnectionstatechange = () => {
          console.log(`DEBUG: Estado da Conexão mudou para: ${localPc.connectionState}`);
          if (['failed', 'disconnected', 'closed'].includes(localPc.connectionState)) {
            if (isComponentMounted) setConnectionStatus('error');
          }
        };

        localDc = localPc.createDataChannel("oai-events");
        localDc.onopen = () => {
          console.log("DEBUG: Data Channel aberto. Enviando instruções e ferramentas...");
          let systemPrompt = `Você é Brailinho, um assistente de voz para a plataforma BrailleWay. Sua principal tarefa é ajudar pacientes a agendar consultas. O fluxo é estrito: 1. Use a ferramenta 'verificar_disponibilidade_medico'. 2. Se encontrar, informe o paciente sobre o horário e o médico e pergunte CLARAMENTE se ele deseja confirmar (Ex: 'Encontrei um horário com Dr. Silva às 10h. Posso confirmar?'). 3. SOMENTE se o usuário responder afirmativamente, use 'confirmar_agendamento_consulta'. Se não houver horário, informe e peça para tentar outra data.`;
          if(session?.user?.role) systemPrompt += ` O usuário atual é um ${session.user.role}.`;
          localDc.send(JSON.stringify({ type: "session.update", session: { instructions: systemPrompt, tools } }));
        };
        
        localDc.onmessage = async (event) => {
          console.log("%c--- MENSAGEM RECEBIDA DA OPENAI ---", "color: blue; font-weight: bold;");
          console.log(event.data);
          const serverEvent = JSON.parse(event.data);
          console.log("%c--- MENSAGEM PARSEADA ---", "color: green; font-weight: bold;", serverEvent);

          if (serverEvent.type === 'response.done' && serverEvent.response?.output?.some(item => item.type === 'function_call')) {
            const functionCall = serverEvent.response.output.find(item => item.type === 'function_call');
            console.log(`%cDEBUG: IA solicitou a função: ${functionCall.name}`, "color: orange;");
            
            const { name, arguments: argsString, id: call_id } = functionCall;
            const args = JSON.parse(argsString);
            let output = {};
            
            try {
              if (name === 'verificar_disponibilidade_medico') {
                  output = await verificarDisponibilidade(args);
              } else if (name === 'confirmar_agendamento_consulta') {
                  output = await confirmarAgendamento(args);
              }
              console.log(`%cDEBUG: Resultado da action '${name}':`, "color: purple;", output);
            } catch (actionError) {
              console.error(`ERRO ao executar a action '${name}':`, actionError);
              output = { error: `Erro ao executar a função no servidor: ${actionError.message}`};
            }

            if (localDc?.readyState === 'open' && isComponentMounted) {
                localDc.send(JSON.stringify({ type: "conversation.item.create", item: { type: "function_call_output", call_id, output: JSON.stringify(output) }}));
                localDc.send(JSON.stringify({ type: "response.create" }));
                console.log("DEBUG: Resultado da função enviado de volta para a IA.");
            }
          }
        };

        if (!audioPlayerRef.current) audioPlayerRef.current = new Audio();
        audioPlayerRef.current.autoplay = true;

        localPc.ontrack = (event) => {
          console.log("DEBUG: Recebendo áudio da OpenAI.");
          if (isComponentMounted) setIsSpeaking(true);
          if (audioPlayerRef.current) audioPlayerRef.current.srcObject = event.streams[0];
          event.track.onended = () => { if (isComponentMounted) setIsSpeaking(false); };
        };

        console.log("DEBUG: Solicitando permissão do microfone.");
        const userMediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!isComponentMounted) return userMediaStream.getTracks().forEach(track => track.stop());
        localStreamRef.current = userMediaStream;
        userMediaStream.getTracks().forEach(track => localPc.addTrack(track, userMediaStream));
        console.log("DEBUG: Microfone ativado e faixa adicionada.");
        
        const offer = await localPc.createOffer();
        await localPc.setLocalDescription(offer);
        console.log("DEBUG: Negociação SDP iniciada.");

        const sdpResponse = await fetch(`https://api.openai.com/v1/realtime?model=gpt-4o-mini`, {
            method: "POST",
            headers: { 'Content-Type': 'application/sdp', 'Authorization': `Bearer ${ephemeralKey}` },
            body: offer.sdp,
        });

        if (!sdpResponse.ok) throw new Error(`Erro na negociação SDP: ${sdpResponse.statusText}`);
        
        const answerSdp = await sdpResponse.text();
        await localPc.setRemoteDescription({ type: 'answer', sdp: answerSdp });

        console.log("DEBUG: Conexão estabelecida com sucesso!");
        if(isComponentMounted) setConnectionStatus('connected');

      } catch (error) {
        console.error("ERRO CRÍTICO no processo de conexão:", error);
        if(isComponentMounted) setConnectionStatus('error');
        cleanup();
      }
    };

    connect();

    return () => {
      console.log("DEBUG: Componente desmontando, executando cleanup.");
      isComponentMounted = false;
      cleanup();
    };
  }, [sessionStatus, session, cleanup]);

  const getStatusIndicator = () => {
    switch(connectionStatus) {
        case 'initializing':
            return <div className="flex items-center justify-center text-gray-500"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Carregando sessão...</div>;
        case 'unauthenticated':
            return <div className="text-gray-500">Faça login como paciente para usar.</div>;
        case 'connecting':
            return <div className="flex items-center justify-center text-yellow-500"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Conectando...</div>;
        case 'connected':
            return isSpeaking
                ? <div className="flex items-center justify-center text-blue-500"><Ear className="w-4 h-4 mr-2 animate-pulse" /> Brailinho falando...</div>
                : <div className="flex items-center justify-center text-green-500"><Mic className="w-4 h-4 mr-2" /> Conectado e ouvindo...</div>;
        case 'error':
            return <span className="text-red-500">Erro na Conexão. Tente reabrir.</span>;
        default:
            return <span className="text-gray-500">Desconectado</span>;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 rounded-lg bg-gray-50">
      <h3 className="font-semibold">Brailinho (Voz)</h3>
      <div className="my-2 p-2 border rounded-md min-h-[2.5rem] w-full text-center">
        {getStatusIndicator()}
      </div>
      <Button onClick={cleanup} className="w-full" variant="destructive" disabled={connectionStatus !== 'connected' && connectionStatus !== 'error'}>
        <Phone className="w-4 h-4 mr-2" /> Encerrar Chamada
      </Button>
    </div>
  );
}