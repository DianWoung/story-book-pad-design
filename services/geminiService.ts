
import { GoogleGenAI } from "@google/genai";
import type { StoryFormData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateStoryPrompt = (formData: StoryFormData): string => {
  const { character, personality, setting, theme, age, length, language } = formData;
  const langMap = { en: 'English', zh: 'Chinese (Mandarin)' };
  const lengthMap = { short: 'about 150 words', medium: 'about 300 words', long: 'about 500 words' };
  
  return `
    You are a creative and cheerful storyteller for children.
    Please write a captivating story for a ${age}-year-old child.
    The story must be written in ${langMap[language]}.
    The total length should be ${lengthMap[length]}.

    The story must feature:
    - Main Character: A ${character}
    - Character's Personality: ${personality}
    - Setting: ${setting}
    - Central Theme: ${theme}

    CRITICAL INSTRUCTIONS:
    1.  The story must be simple, engaging, and age-appropriate.
    2.  Divide the story into 3 to 5 logical paragraphs.
    3.  After EACH paragraph, you MUST insert the exact text '[SEGMENT_BREAK]' on a new line. Do not use any other separator or formatting.
  `;
};

export const generateStory = async (formData: StoryFormData): Promise<string> => {
  try {
    const prompt = generateStoryPrompt(formData);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating story:", error);
    throw new Error("Failed to generate story from AI.");
  }
};

const generateImagePrompt = (segmentText: string, language: 'en' | 'zh'): string => {
  const languageInstruction = language === 'zh' ? 'The following text is in Chinese:' : 'The following text is in English:';
  return `
    A vibrant, colorful, and cheerful children's book illustration.
    Style: Cute cartoon, simple shapes, friendly characters, bright and happy background. No text, letters, or words.
    The scene should visually represent the following story segment.
    ${languageInstruction} "${segmentText}"
  `;
}

export const generateImageForSegment = async (segmentText: string, language: 'en' | 'zh'): Promise<string> => {
  try {
    const prompt = generateImagePrompt(segmentText, language);
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '16:9',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages[0].image.imageBytes;
    } else {
      throw new Error("No image was generated.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image for a story segment.");
  }
};
