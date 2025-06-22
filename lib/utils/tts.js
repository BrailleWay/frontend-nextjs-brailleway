export function speak(text, options = {}) {
  if (typeof window === 'undefined') return;
  const synth = window.speechSynthesis;
  if (!synth) return;
  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  if (options.lang) utterance.lang = options.lang;
  if (options.rate) utterance.rate = options.rate;
  if (options.pitch) utterance.pitch = options.pitch;
  if (options.voice) utterance.voice = options.voice;

  synth.cancel();
  synth.speak(utterance);
}
