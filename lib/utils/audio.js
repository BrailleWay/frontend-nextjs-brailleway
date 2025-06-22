// src/lib/utils/audio.js

export async function transcribeAudio(blob) {
  try {
    if (typeof fetch === 'function' && typeof FormData !== 'undefined') {
      const formData = new FormData();
      formData.append('audio', blob, 'audio.webm');
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.text) return data.text;
      } else {
        throw new Error(`Server returned ${res.status}`);
      }
    }
  } catch (err) {
    console.error('Falling back to browser SpeechRecognition:', err);
  }

  return new Promise((resolve, reject) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      reject(new Error('O reconhecimento de fala não é suportado neste navegador.'));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      resolve(transcript);
    };

    recognition.onerror = (event) => {
      reject(new Error(`Erro no reconhecimento de fala: ${event.error}`));
    };

    recognition.start();
  });
}
