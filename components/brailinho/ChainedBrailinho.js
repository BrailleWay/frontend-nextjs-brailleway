"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Ear, Loader2, Sparkles } from "lucide-react";
import { useVoiceActivity } from "@/hooks/use-voice-activity";

export function ChainedBrailinho({ active }) {
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef([]);

  const [transcript, setTranscript] = useState("");     // transcrição do usuário
  const [assistantText, setAssistantText] = useState(""); // texto que o Brailinho fala
  const [status, setStatus] = useState("idle"); // idle | listening | transcribing | speaking

  const audioRef = useRef(null);
  const isComponentActive = useRef(active);

  const abortRef = useRef(null);

  // --- MediaRecorder ---
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const startMediaRecorder = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new window.MediaRecorder(stream, { mimeType: "audio/webm" });
    mediaRecorderRef.current = mediaRecorder;
    recordedChunksRef.current = [];
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunksRef.current.push(event.data);
    };
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
      sendAudioToApi(audioBlob);
      stream.getTracks().forEach((track) => track.stop());
    };
    mediaRecorder.start();
  };

  const stopMediaRecorder = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  // VAD só controla início/fim!
  const { startListening: startVAD, stopListening: stopVAD } = useVoiceActivity({
    onSpeechStart: () => {
      setStatus("listening");
      setTranscript(""); // Limpa antes de ouvir de novo
      setAssistantText("");
      startMediaRecorder();
    },
    onSpeechEnd: () => {
      setStatus("transcribing");
      stopMediaRecorder();
    },
    // Se você quiser partialTranscript, adicione onPartialTranscript aqui!
  });

  useEffect(() => {
    isComponentActive.current = active;
  }, [active]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const sendAudioToApi = useCallback(
    async (audioBlob) => {
      if (!audioBlob || audioBlob.size < 1024) {
        setStatus("idle");
        if (isComponentActive.current) startVAD();
        return;
      }

      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setStatus("transcribing");

      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm");
      formData.append("messages", JSON.stringify(messagesRef.current));

      try {
        const res = await fetch("/api/voice-chain", {
          method: "POST",
          body: formData,
          signal: abortRef.current.signal,
        });

        if (!res.ok) throw new Error(`API retornou ${res.status}`);

        const data = await res.json();

        // DEBUG LOGS!
        if (data.transcript) console.log("[Transcrição]:", data.transcript);
        if (data.assistantText) console.log("[Braillinho]:", data.assistantText);

        if (data.messages) setMessages(data.messages);
        if (data.transcript) setTranscript(data.transcript);
        if (data.assistantText) setAssistantText(data.assistantText);

        const playAnswer = async (base64) => {
          const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
          const url = URL.createObjectURL(new Blob([binary], { type: "audio/mpeg" }));
          audioRef.current.src = url;
          await audioRef.current.play();
        };

        if (data.audio) {
          setStatus("speaking");
          await playAnswer(data.audio);
        }

        if (isComponentActive.current) {
          setStatus("idle");
          startVAD();
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("[ChainedBrailinho] Erro:", err);
        setTranscript("Desculpe, ocorreu um erro.");
        setAssistantText("");
        if (isComponentActive.current) {
          setStatus("idle");
          startVAD();
        }
      }
    },
    [startVAD]
  );

  useEffect(() => {
    if (active) {
      const playIntroAndStart = async () => {
        if (!audioRef.current) return;
        try {
          setStatus("speaking");
          audioRef.current.src = "/audios/brailinho_intro.mp3";
          await audioRef.current.play();
        } catch (err) {
          console.warn("Não foi possível tocar a intro:", err);
        } finally {
          if (isComponentActive.current) {
            setStatus("idle");
            startVAD();
          }
        }
      };
      playIntroAndStart();
    } else {
      stopVAD();
      abortRef.current?.abort();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      setStatus("idle");
      setTranscript("");
      setAssistantText("");
      stopMediaRecorder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // --- UI helpers
  const StatusIndicator = () => {
    const classes = "flex items-center gap-2 text-sm";
    switch (status) {
      case "listening":
        return (
          <div className={`${classes} text-blue-600 animate-pulse`}>
            <Mic className="w-4 h-4" /> Ouvindo…
          </div>
        );
      case "speaking":
        return (
          <div className={`${classes} text-green-600`}>
            <Ear className="w-4 h-4" /> Brailinho falando…
          </div>
        );
      case "transcribing":
        return (
          <div className={`${classes} text-gray-500`}>
            <Loader2 className="w-4 h-4 animate-spin" /> Processando…
          </div>
        );
      default:
        return (
          <div className={`${classes} text-indigo-600`}>
            <Sparkles className="w-4 h-4" /> Aguardando…
          </div>
        );
    }
  };

  // --- UI de legenda
  function BrailinhoLegenda() {
    if (status === "listening") {
      return <span className="italic text-blue-500">Falando…</span>;
    }
    if (status === "speaking") {
      return <span className="font-semibold text-green-700">{assistantText || <>&nbsp;</>}</span>;
    }
    // Transcrição do usuário
    return <span className="italic text-gray-700">{transcript || <>&nbsp;</>}</span>;
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg shadow-md">
      <audio ref={audioRef} hidden />
      <div className="h-16 flex items-center justify-center border rounded bg-white px-2 min-h-16">
        <BrailinhoLegenda />
      </div>
      <StatusIndicator />
    </div>
  );
}

export default ChainedBrailinho;
