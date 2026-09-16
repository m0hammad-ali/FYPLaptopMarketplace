import { useCallback } from 'react';

/**
 * Text-to-speech hook using the Web Speech API.
 * Works in Chrome, Edge, Safari. Falls back silently if unsupported.
 */
export function useTextToSpeech() {
  const speak = useCallback((text, lang = 'en-US') => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('TTS failed:', err);
    }
  }, []);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, stop };
}
