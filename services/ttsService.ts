let voices: SpeechSynthesisVoice[] = [];

// This promise will be resolved when voices are loaded.
const voicesPromise = new Promise<SpeechSynthesisVoice[]>((resolve) => {
  const checkVoices = () => {
    voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
    }
  };

  // Voices are loaded asynchronously.
  window.speechSynthesis.onvoiceschanged = checkVoices;
  checkVoices(); // In case they are already loaded on some browsers.
});

/**
 * Speaks the given text using the browser's text-to-speech engine.
 * @param text The text to speak.
 * @param lang The desired language ('en' or 'zh').
 * @param onEndCallback A callback function to execute when speech finishes.
 */
export const speak = (text: string, lang: 'en' | 'zh', onEndCallback: () => void): void => {
  // Immediately cancel any ongoing or pending speech to prevent conflicts.
  window.speechSynthesis.cancel();

  voicesPromise.then(loadedVoices => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voiceLang = lang === 'en' ? 'en-US' : 'zh-CN';
    
    // Find a suitable voice that matches the language.
    const selectedVoice = loadedVoices.find(voice => voice.lang.startsWith(voiceLang)) || null;
    utterance.voice = selectedVoice;
    utterance.lang = voiceLang;

    if (!selectedVoice) {
      console.warn(`No specific voice found for language ${voiceLang}. Using browser default.`);
    }
    
    utterance.onend = onEndCallback;
    utterance.onerror = (event) => {
      // Provide more detailed error logging.
      console.error('SpeechSynthesisUtterance.onerror - Error:', event.error);
      // We still call the callback to allow the player to advance and not get stuck.
      onEndCallback();
    };
    
    // A small delay can prevent issues on some browsers where the engine is not ready.
    // Increased delay slightly for more stability.
    setTimeout(() => {
       window.speechSynthesis.speak(utterance);
    }, 150);
  });
};

/**
 * Cancels any currently ongoing speech.
 */
export const cancel = (): void => {
  window.speechSynthesis.cancel();
};