"use client";
import { useEffect, useRef, useState } from "react";

export default function AutoPlayAudio({ src, buttonClassName = "", imgClassName = "" }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (!isPlaying) {
      try {
        audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Erro ao tentar tocar áudio:", error);
      }
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // 🎯 Disparar áudio automaticamente no primeiro clique em qualquer lugar da página
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.1; // 🔊 Ajuste de volume (20%)
    }

    const handleUserInteraction = () => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => console.log("Erro ao tocar áudio:", err));

        window.removeEventListener('click', handleUserInteraction);
      }
    };

    window.addEventListener('click', handleUserInteraction);

    return () => {
      window.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  return (
    <>
      <div
        className={`bg-[#cb6ce6] rounded-full flex items-center justify-center cursor-pointer transition duration-200 hover:bg-[#b24dd7] hover:scale-110 absolute z-10 ${buttonClassName}`}
        onClick={handlePlayPause}
        tabIndex={0}
        role="button"
        aria-label={isPlaying ? "Pausar áudio" : "Tocar áudio"}
      >
        <img
          className={`pointer-events-none ${imgClassName}`}
          src={isPlaying ? "/imgHome/Pause.png" : "/imgHome/Play.png"}
          alt={isPlaying ? "Pausar" : "Tocar"}
        />
      </div>
      <audio ref={audioRef} src={src} onEnded={() => setIsPlaying(false)} />
    </>
  );
}
