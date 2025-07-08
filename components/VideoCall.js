// file: components/VideoCall.jsx
"use client";

import { useState, useEffect, useRef } from 'react';
import Video from 'twilio-video';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VideoCall({ consultaId }) {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [status, setStatus] = useState('Conectando...');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const roomName = `consulta-${consultaId}`;

    const connectToRoom = async () => {
      try {
        // 1. Fetch Token
        setStatus('Obtendo autorização...');
        const response = await fetch('/api/video/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomName, consultaId }),
        });

        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error || 'Falha ao obter token de acesso.');
        }

        const { token } = await response.json();

        // 2. Connect to Twilio Room
        setStatus('Entrando na sala...');
        const newRoom = await Video.connect(token, {
          name: roomName,
          audio: true,
          video: { width: 640 },
        });

        setRoom(newRoom);
        setStatus('Conectado');

        // 3. Handle Local Participant
        if (localVideoRef.current) {
          const localTrack = Array.from(newRoom.localParticipant.videoTracks.values())[0].track;
          localVideoRef.current.appendChild(localTrack.attach());
        }

        // 4. Handle Remote Participants
        newRoom.participants.forEach(participantConnected);
        newRoom.on('participantConnected', participantConnected);
        newRoom.on('participantDisconnected', participantDisconnected);

        window.addEventListener('beforeunload', () => newRoom.disconnect());

      } catch (error) {
        console.error('Erro ao conectar à sala:', error);
        setStatus(`Erro: ${error.message}`);
      }
    };

    connectToRoom();

    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [consultaId]);

  const participantConnected = (participant) => {
    setParticipants(prev => [...prev, participant]);
    participant.on('trackSubscribed', track => {
      if (remoteVideoRef.current) {
         remoteVideoRef.current.innerHTML = ''; // Limpa o container
        remoteVideoRef.current.appendChild(track.attach());
      }
    });
  };

  const participantDisconnected = (participant) => {
    setParticipants(prev => prev.filter(p => p !== participant));
     if (remoteVideoRef.current) {
        remoteVideoRef.current.innerHTML = '';
      }
  };

  const handleDisconnect = () => {
    if (room) {
      room.disconnect();
    }
    router.push('/consultas');
  };

  // Funções para mutar áudio/vídeo (a implementar)
  const toggleMute = () => {
    if(room) {
        room.localParticipant.audioTracks.forEach(publication => {
            if(isMuted) {
                publication.track.enable();
            } else {
                publication.track.disable();
            }
        });
        setIsMuted(!isMuted);
    }
  };
  const toggleVideo = () => {
    if(room) {
         room.localParticipant.videoTracks.forEach(publication => {
            if(isVideoEnabled) {
                publication.track.disable();
            } else {
                publication.track.enable();
            }
        });
        setIsVideoEnabled(!isVideoEnabled);
    }
  };


  return (
    <div className="bg-gray-900 w-full h-full flex flex-col items-center justify-center text-white p-4">
       <h1 className="text-2xl font-bold mb-2">Consulta #{consultaId}</h1>
       <p className="text-gray-400 mb-4">{status}</p>

        <div className="relative w-full h-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vídeo Remoto (Ocupa a maior parte) */}
            <div ref={remoteVideoRef} className="bg-black rounded-lg w-full h-full flex items-center justify-center">
                {participants.length === 0 && <p>Aguardando participante...</p>}
            </div>

             {/* Vídeo Local (Pequeno no canto) */}
            <div className="bg-black rounded-lg w-full h-full flex items-center justify-center" ref={localVideoRef} />
        </div>

        {/* Controles da Chamada */}
         <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-800 p-3 rounded-full">
            <button onClick={toggleMute} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
                {isMuted ? <MicOff /> : <Mic />}
            </button>
             <button onClick={toggleVideo} className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
                {isVideoEnabled ? <VideoIcon /> : <VideoOff />}
            </button>
             <button onClick={handleDisconnect} className="p-3 rounded-full bg-red-600 hover:bg-red-500">
                <PhoneOff />
            </button>
        </div>

        {status === 'Conectando...' && (
             <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p>{status}</p>
             </div>
        )}
    </div>
  );
}