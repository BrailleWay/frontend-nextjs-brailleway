"use client";

import { useRef, useState } from "react";
import { Mic, Loader2, Ear } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudioRecording } from "@/hooks/use-audio-recording";

export function ChainedBrailinho() {
  const [messages, setMessages] = useState([]);
  const [lastTranscript, setLastTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef(null);

  const sendAudio = async (blob) => {
    const form = new FormData();
    form.append("audio", blob, "audio.webm");
    form.append("messages", JSON.stringify(messages));

    const res = await fetch("/api/voice-chain", {
      method: "POST",
      body: form,
    });

    if (!res.ok) return;
    const data = await res.json();
    setLastTranscript(data.transcript || "");
    if (data.messages) setMessages(data.messages);

    if (data.audio) {
      const binary = Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([binary], { type: "audio/mpeg" }));
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.onended = () => setIsSpeaking(false);
        setIsSpeaking(true);
        audioRef.current.play().catch(() => setIsSpeaking(false));
      }
    }
  };

  const { isListening, isRecording, isTranscribing, audioStream, toggleListening } =
    useAudioRecording({ transcribeAudio: sendAudio });

  return (
    <div className="flex flex-col items-center gap-2 p-2 bg-gray-50 rounded-lg">
      <audio ref={audioRef} hidden />
      <div className="min-h-[2.5rem] w-full text-center p-2 border rounded-md">
        {isListening
          ? "Gravando..."
          : isTranscribing
          ? "Processando..."
          : isSpeaking
          ? "Brailinho falando..."
          : lastTranscript || "Pressione para falar"}
      </div>
      <Button onClick={toggleListening} disabled={isTranscribing} className="w-full">
        {isListening ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : isSpeaking ? (
          <Ear className="w-4 h-4 mr-2 animate-pulse" />
        ) : (
          <Mic className="w-4 h-4 mr-2" />
        )}
        {isListening ? "Parar" : "Falar"}
      </Button>
    </div>
  );
}

export default ChainedBrailinho;