export interface StoryFormData {
  character: string;
  personality: string;
  setting: string;
  theme: string;
  age: number;
  length: 'short' | 'medium' | 'long';
  language: 'en' | 'zh';
}

export enum GenerationStep {
  IDLE = 'Ready to Create',
  CHARACTER = 'Designing the Character...',
  STORY = 'Writing the Story...',
  IMAGES = 'Illustrating the Pages...',
}

export interface StorySegment {
  id: number;
  text: string;
  imageUrl: string;
}