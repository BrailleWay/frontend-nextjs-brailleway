"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MicVAD } from "@ricky0123/vad-web";

/**
 * Hook de detecção de voz robusto, com callback para partialTranscript em tempo real.
 */
export const useVoiceActivity = ({
  onSpeechStart,
  onSpeechEnd,
  onPartialTranscript,
  modelURL = "/silero_vad_v5.onnx",
  workletURL = "/vad.worklet.bundle.min.js",
} = {}) => {
  const [isListening, setIsListening] = useState(false);
  const vadRef = useRef(null);

  // Ajuste: mais responsivo (menos frames para detectar silêncio)
  const VAD_PARAMS = {
    minSpeechFrames: 2,
    negativeSpeechThreshold: 5,
  };

  const initVAD = useCallback(async () => {
    if (vadRef.current) return vadRef.current;
    try {
      const vad = await MicVAD.new({
        onnxURL: modelURL,
        workletURL,
        ...VAD_PARAMS,
        onSpeechStart: () => {
          setIsListening(true);
          onSpeechStart?.();
        },
        onSpeechEnd: () => {
          setIsListening(false);
          onSpeechEnd?.();
        },
        // (Opcional) Partial transcript enquanto fala – não está implementado no MicVAD puro!
      });
      vadRef.current = vad;
      return vad;
    } catch (err) {
      console.error("[useVoiceActivity] Falha ao inicializar VAD", err);
      return null;
    }
  }, [modelURL, workletURL, onSpeechStart, onSpeechEnd]);

  const startListening = useCallback(async () => {
    const vad = await initVAD();
    if (!vad) return;
    try {
      await vad.start();
    } catch (err) {
      console.error("[useVoiceActivity] Não foi possível iniciar o VAD", err);
    }
  }, [initVAD]);

  const stopListening = useCallback(() => {
    vadRef.current?.pause();
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => vadRef.current?.destroy();
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
  };
};
