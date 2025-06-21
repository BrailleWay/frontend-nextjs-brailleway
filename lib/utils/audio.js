// src/lib/utils/audio.js

export async function transcribeAudio(blob) {
  const formData = new FormData();
  formData.append("file", blob, "audio.webm");

  const response = await fetch("/api/transcribe", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Falha ao transcrever áudio");
  }

  const data = await response.json();
  return data.text;
}

