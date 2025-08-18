// Shared TTS utility for both ChatBot and PPT narration
// Uses browser SpeechSynthesis API, with unified controls and state

let isSpeaking = false;
let utteranceRef = null;

export function speakText(text, { onStart, onEnd, onError, voice = null, rate = 1, pitch = 1, volume = 1 } = {}) {
  if (!text) return;
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    if (voice) utterance.voice = voice;
    else {
      // Prefer Google voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => /google/i.test(v.name)) || voices[0];
      if (preferred) utterance.voice = preferred;
    }
    utterance.onstart = () => {
      isSpeaking = true;
      if (onStart) onStart();
    };
    utterance.onend = () => {
      isSpeaking = false;
      if (onEnd) onEnd();
    };
    utterance.onerror = (e) => {
      isSpeaking = false;
      if (onError) onError(e);
    };
    utteranceRef = utterance;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    isSpeaking = false;
    if (onError) onError(e);
  }
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
  }
}

export function pauseSpeaking() {
  if ('speechSynthesis' in window && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
    window.speechSynthesis.pause();
  }
}

export function resumeSpeaking() {
  if ('speechSynthesis' in window && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
}

export function getSpeakingStatus() {
  return isSpeaking;
}
