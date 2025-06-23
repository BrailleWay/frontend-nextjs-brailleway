//este componente é usado para tocar um áudio quando o usuário clica no botão


"use client";
import { useRef, useState } from "react";

export default function AudioButton({ src, buttonClassName = "", imgClassName = "" }) {
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

  return (
    <>
      <div
        className={`bg-[#4BA8FF] rounded-full flex items-center justify-center cursor-pointer transition duration-200 hover:bg-[#4BA8FF] hover:scale-110 absolute z-10 ${buttonClassName}`}
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