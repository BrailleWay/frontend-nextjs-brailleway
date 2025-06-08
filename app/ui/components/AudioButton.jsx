//este componente é usado para tocar um áudio quando o usuário clica no botão


"use client";
import { useRef, useState } from "react";

export default function AudioButton({ src }) {
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
        className="w-[50px] h-[50px] bg-[#cb6ce6] rounded-full flex items-center justify-center
                   cursor-pointer transition duration-200 hover:bg-[#b24dd7] hover:scale-110 absolute top-10 left-10 z-10"
        onClick={handlePlayPause}
        tabIndex={0}
        role="button"
        aria-label={isPlaying ? "Pausar áudio" : "Tocar áudio"}
      >
        <img
          className="w-[41px] h-7 pointer-events-none"
          src={isPlaying ? "/imgHome/Pause.png" : "/imgHome/Play.png"}
          alt={isPlaying ? "Pausar" : "Tocar"}
        />
      </div>
      <audio ref={audioRef} src={src} onEnded={() => setIsPlaying(false)} />
    </>
  );
}