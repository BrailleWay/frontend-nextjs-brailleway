// src/lib/utils/audio.js

export function transcribeAudio(blob) {
  return new Promise((resolve, reject) => {
    // Verifica se o navegador suporta a Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      reject(new Error("O reconhecimento de fala não é suportado neste navegador."));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR'; // Defina o idioma para português do Brasil
    recognition.interimResults = false; // Queremos apenas o resultado final
    recognition.maxAlternatives = 1; // Queremos apenas a alternativa mais provável

    // A API não funciona diretamente com um Blob,
    // então ativamos o reconhecimento e o usuário precisa falar.
    // Esta é uma limitação da API do navegador.
    // A implementação ideal para um blob real exigiria um serviço de terceiros (ex: OpenAI Whisper API).
    // Para um caso de uso em tempo real, o fluxo seria:
    // 1. Clicar no botão de microfone.
    // 2. Iniciar 'recognition.start()'.
    // 3. O usuário fala.
    // 4. O resultado é capturado no 'onresult'.

    // O componente de chat provavelmente espera que esta função inicie a gravação
    // e retorne o texto. Vamos adaptar para esse fluxo.

    console.log("Por favor, fale agora...");

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Texto reconhecido:", transcript);
      resolve(transcript); // Resolva a promessa com o texto transcrito
    };

    recognition.onerror = (event) => {
      console.error("Erro no reconhecimento de fala:", event.error);
      if (event.error === 'no-speech') {
        reject(new Error("Nenhuma fala foi detectada. Tente novamente."));
      } else if (event.error === 'audio-capture') {
        reject(new Error("Falha ao capturar áudio. Verifique as permissões do microfone."));
      } else if (event.error === 'not-allowed') {
        reject(new Error("Permissão para usar o microfone negada."));
      } else {
        reject(new Error(`Erro no reconhecimento de fala: ${event.error}`));
      }
    };

    recognition.onend = () => {
      console.log("Reconhecimento de fala encerrado.");
    };
    
    // Inicia o reconhecimento de fala
    recognition.start();
  });
}