// file: components/RealtimeBrailinho.jsx
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Mic, Phone, Ear, Loader2 } from 'lucide-react';

export function RealtimeBrailinho() {
  const [connectionStatus, setConnectionStatus] = useState('initializing');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { data: session, status: sessionStatus } = useSession();

  // Usamos refs para tudo que é relacionado à conexão.
  // Isso evita que mudanças neles causem re-renderizações.
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  
  // Função de limpeza, agora sem dependências de estado.
  const cleanup = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
  }, []);

  // Este useEffect gerencia todo o ciclo de vida da conexão.
  useEffect(() => {
    // Só inicia se a sessão estiver carregada e for autenticada.
    if (sessionStatus !== 'authenticated') {
      setConnectionStatus('waiting_for_session');
      return;
    }

    let isComponentMounted = true; // Flag para evitar atualizações de estado se o componente desmontar
    
    const connect = async () => {
      // Evita múltiplas tentativas de conexão
      if (peerConnectionRef.current) return;
      
      setConnectionStatus('connecting');

      try {
        const sessionResponse = await fetch("/api/realtime-session");
        if (!sessionResponse.ok) throw new Error("Falha ao obter chave da sessão");
        const sessionData = await sessionResponse.json();
        const ephemeralKey = sessionData.client_secret.value;

        const pc = new RTCPeerConnection();
        peerConnectionRef.current = pc;
        
        pc.onconnectionstatechange = () => {
          if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected' || pc.connectionState === 'closed') {
            if(isComponentMounted) setConnectionStatus('error');
          }
        };

        const dc = pc.createDataChannel("oai-events");
        dc.onopen = () => {
          let systemPrompt = `Você é a assistente virtual, Brailinho...`; // Seu prompt
          if (session?.user?.role) {
            systemPrompt += ` O usuário é um ${session.user.role}.`;
          }
          dc.send(JSON.stringify({ type: "session.update", session: { instructions: systemPrompt } }));
        };
        
        const audioPlayer = document.createElement('audio');
        audioPlayer.autoplay = true;

        pc.ontrack = (event) => {
          if(isComponentMounted) setIsSpeaking(true);
          audioPlayer.srcObject = event.streams[0];
          event.track.onended = () => {
            if(isComponentMounted) setIsSpeaking(false);
          };
        };

        const userMediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if(!isComponentMounted) { // Verifica se o componente ainda está montado após a permissão do microfone
          userMediaStream.getTracks().forEach(track => track.stop());
          return;
        }
        localStreamRef.current = userMediaStream;
        userMediaStream.getTracks().forEach(track => pc.addTrack(track, userMediaStream));
        
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const sdpResponse = await fetch(`https://api.openai.com/v1/realtime?model=gpt-4o-mini`, {
          method: "POST",
          headers: { 'Content-Type': 'application/sdp', 'Authorization': `Bearer ${ephemeralKey}` },
          body: offer.sdp,
        });

        if (!sdpResponse.ok) throw new Error("Erro na negociação SDP");

        const answerSdp = await sdpResponse.text();
        await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });

        if(isComponentMounted) setConnectionStatus('connected');

      } catch (error) {
        console.error("Erro ao conectar com o serviço Realtime:", error);
        if(isComponentMounted) setConnectionStatus('error');
      }
    };

    connect();

    // A função de limpeza do useEffect é CRUCIAL.
    return () => {
      isComponentMounted = false;
      cleanup();
    };
  // A única dependência é o status da sessão, para que ele rode quando o usuário fizer login.
  }, [sessionStatus, session, cleanup]); 

  const getStatusIndicator = () => {
    if (connectionStatus === 'waiting_for_session') return <div className="flex items-center text-gray-500"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Aguardando sessão...</div>;
    if (connectionStatus === 'error') return <span className="text-red-500">Erro na Conexão. Tente reabrir.</span>;
    if (connectionStatus === 'connecting') return <div className="flex items-center text-yellow-500"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Conectando...</div>;
    if (connectionStatus === 'connected') {
      if (isSpeaking) return <div className="flex items-center text-blue-500"><Ear className="w-4 h-4 mr-1 animate-pulse" /> Brailinho falando...</div>;
      return <div className="flex items-center text-green-500"><Mic className="w-4 h-4 mr-1" /> Conectado e ouvindo...</div>;
    }
    return <span className="text-gray-500">Iniciando...</span>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 rounded-lg bg-gray-50">
      <h3 className="font-semibold">Brailinho (Voz)</h3>
      <div className="my-2 p-2 border rounded-md min-h-[2.5rem] w-full text-center">
        {getStatusIndicator()}
      </div>
      <Button onClick={cleanup} className="w-full" variant="destructive" disabled={connectionStatus !== 'connected'}>
        <Phone className="w-4 h-4 mr-2" /> Encerrar Chamada
      </Button>
      {/* O elemento de áudio foi removido do JSX para ser gerenciado apenas no script, evitando problemas de renderização. */}
    </div>
  );
}