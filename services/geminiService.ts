import { GoogleGenAI } from "@google/genai";
import type { StoryFormData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCharacterDescription = async (formData: Pick<StoryFormData, 'character'>): Promise<string> => {
  const { character } = formData;
  const prompt = `
    You are an art director creating a character sheet for a children's book illustrator.
    Based on the character description "${character}", provide a concise but detailed visual description.
    This description will be used to ensure the character looks the same in every illustration.
    Focus on consistent, simple features like main colors, clothing, and one or two key accessories.
    The style is a cute, simple cartoon for young children.
    Example: 'A small squirrel with fluffy, warm-brown fur. He always wears a tiny, bright blue backpack and has a curious, wide-eyed expression.'
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating character description:", error);
    throw new Error("Failed to design the character.");
  }
};


const generateStoryPrompt = (formData: StoryFormData, language: 'en' | 'zh'): string => {
  const { character, setting, theme, age, length } = formData;
  const langMap = { en: 'English', zh: 'Chinese (Mandarin)' };
  const lengthMap = { short: 'about 150 words', medium: 'about 300 words', long: 'about 500 words' };
  
  return `
    You are a creative and cheerful storyteller for children.
    Please write a captivating story for a ${age}-year-old child.
    The story must be written in ${langMap[language]}.
    The total length should be ${lengthMap[length]}.

    The story must feature:
    - Main Character: ${character}
    - Setting: ${setting}
    - Central Theme: ${theme}

    CRITICAL INSTRUCTIONS:
    1.  The story must be simple, engaging, and age-appropriate.
    2.  Divide the story into 3 to 5 logical paragraphs.
    3.  After EACH paragraph, you MUST insert the exact text '[SEGMENT_BREAK]' on a new line. Do not use any other separator or formatting.
  `;
};

export const generateStory = async (formData: StoryFormData, language: 'en' | 'zh'): Promise<string> => {
  try {
    const prompt = generateStoryPrompt(formData, language);
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

const generateImagePrompt = (segmentText: string, language: 'en' | 'zh', characterDescription: string): string => {
  const languageInstruction = language === 'zh' ? 'The following story text is in Chinese:' : 'The following story text is in English:';
  return `
    A vibrant, colorful, and cheerful children's book illustration.
    Style: Cute cartoon, simple shapes, friendly characters, bright and happy background. No text, letters, or words.

    **CRITICAL CHARACTER DESIGN:** The main character MUST be drawn exactly according to this description to ensure consistency: "${characterDescription}"
    
    The scene should visually represent the following story segment, featuring the character described above.
    ${languageInstruction} "${segmentText}"
  `;
}

export const generateImageForSegment = async (segmentText: string, language: 'en' | 'zh', characterDescription: string): Promise<string> => {
  try {
    const prompt = generateImagePrompt(segmentText, language, characterDescription);
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