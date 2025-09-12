
// A global variable to hold the voices.
let voices: SpeechSynthesisVoice[] = [];

// A function to load and cache the voices from the browser.
const loadVoices = () => {
  voices = window.speechSynthesis.getVoices();
};

// This block executes when the module is first loaded.
// It attempts to load voices immediately and sets up a listener
// for when the voice list changes, ensuring `voices` is populated.
if ('speechSynthesis' in window) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export const ttsService = {
  /**
   * Speaks the given text using the browser's Speech Synthesis API.
   * @param text The text to be spoken.
   * @param lang The language of the text ('en' or 'zh').
   * @param onEnd A callback function to execute when speech finishes or errors out.
   */
  speak: (text: string, lang: 'en' | 'zh', onEnd: () => void): void => {
    // If the browser doesn't support speech synthesis or the text is empty,
    // we call the onEnd callback after a short, estimated delay.
    if (!('speechSynthesis' in window) || !text) {
      console.warn("Speech Synthesis not supported or text is empty.");
      const estimatedDuration = text ? text.length * 80 : 500;
      setTimeout(onEnd, estimatedDuration);
      return;
    }

    // Cancel any speech that is currently in progress.
    // This prevents overlapping audio.
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const langCode = lang === 'en' ? 'en-US' : 'zh-CN';
    utterance.lang = langCode;

    // Attempt to find a suitable voice from the pre-loaded list.
    const voice = voices.find(v => v.lang === langCode) || voices.find(v => v.lang.startsWith(lang));
    if (voice) {
      utterance.voice = voice;
    } else {
      console.warn(`No matching voice found for language code: ${langCode}. Using browser default.`);
    }

    // Set the callback for when the speech ends successfully.
    utterance.onend = onEnd;

    // Set a more detailed error handler.
    utterance.onerror = (event: Event) => {
      const errorEvent = event as SpeechSynthesisErrorEvent;
      console.error('SpeechSynthesisUtterance.onerror - Error:', errorEvent.error, 'for text:', text);
      // We still call onEnd to allow the story to proceed to the next segment.
      onEnd();
    };

    // A small delay before speaking can prevent some browser-specific bugs,
    // like 'audio-busy' errors.
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 100);
  },

  /**
   * Immediately stops any speech that is currently in progress.
   */
  cancel: (): void => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
};
