// FIX: Define and export a reusable Language type.
export type Language = 'en' | 'zh';

export interface StoryFormData {
  character: string;
  personality: string;
  setting: string;
  theme: string;
  age: string;
  length: 'short' | 'medium' | 'long';
  // FIX: Use the 'Language' type alias.
  language: Language;
}

export interface StorySegment {
  id: number;
  text: string;
  imageUrl: string;
}

export enum AppState {
  FORM,
  LOADING,
  PLAYER,
  ERROR,
}

export enum GenerationStep {
  IDLE = "Getting ready...",
  STORY = "Dreaming up a wonderful story...",
  IMAGES = "Painting magical pictures...",
  AUDIO = "Warming up the storyteller's voice..."
}