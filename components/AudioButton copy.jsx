"use client";
import { useRef, useState, useEffect } from "react";

export default function AudioPlayer({
  src,
  buttonClassName = "",
  imgClassName = "",
  autoPlay = true,
  volume = 0.2,
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (!isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    if (autoPlay && audioRef.current) {
      const playAudio = async () => {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.warn("Autoplay bloqueado:", error);
        }
      };
      playAudio();
    }
  }, [autoPlay, volume]);

  return (
    <>
      <div
        className={`w-[60px] h-[60px] bg-[#4BA8FF] rounded-full flex items-center justify-center cursor-pointer transition duration-200 hover:bg-[#4BA8FF] hover:scale-110 absolute z-10 ${buttonClassName}`}
        onClick={handlePlayPause}
        tabIndex={0}
        role="button"
        aria-label={isPlaying ? "Pausar áudio" : "Tocar áudio"}
      >
        <img
          className={`w-[28px] h-[28px] pointer-events-none ${imgClassName}`}
          src={isPlaying ? "/imgHome/Pause.png" : "/imgHome/Play.png"}
          alt={isPlaying ? "Pausar" : "Tocar"}
        />
      </div>
      <audio ref={audioRef} src={src} onEnded={() => setIsPlaying(false)} />
    </>
  );
}
