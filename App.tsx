import React, { useState } from 'react';
import StoryForm from './components/StoryForm';
import LoadingScreen from './components/LoadingScreen';
import StoryPlayer from './components/StoryPlayer';
import LanguageSwitcher from './components/LanguageSwitcher';
import { generateCharacterDescription, generateStory, generateImageForSegment } from './services/geminiService';
import type { StoryFormData, StorySegment } from './types';
import { GenerationStep } from './types';

function App() {
  const [step, setStep] = useState<GenerationStep>(GenerationStep.IDLE);
  const [storySegments, setStorySegments] = useState<StorySegment[]>([]);
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    setStep(GenerationStep.IDLE);
    setStorySegments([]);
    setLanguage('en');
    setProgress(0);
    setError(null);
  };

  const startGeneration = async (formData: StoryFormData) => {
    // Clear previous story data, but preserve the selected language
    setStep(GenerationStep.IDLE);
    setStorySegments([]);
    setProgress(0);
    setError(null);
    
    setStep(GenerationStep.CHARACTER);
    setProgress(5);

    try {
      // 1. Generate Character Description for consistency
      const characterDescription = await generateCharacterDescription(formData);
      setProgress(15);
      setStep(GenerationStep.STORY);

      // 2. Generate Story using the global language state
      const fullStory = await generateStory(formData, language);
      const textSegments = fullStory.split('[SEGMENT_BREAK]').map(s => s.trim()).filter(s => s.length > 0);
      
      if (textSegments.length === 0) {
        throw new Error("The AI failed to generate a story. Please try again with a different prompt.");
      }

      const totalTasks = textSegments.length;
      let tasksCompleted = 0;

      setProgress(25);
      setStep(GenerationStep.IMAGES);

      const finalSegments: StorySegment[] = [];

      // 3. Generate Images for each segment using the consistent character description
      for (let i = 0; i < textSegments.length; i++) {
        const text = textSegments[i];
        const imageBase64 = await generateImageForSegment(text, language, characterDescription);
        finalSegments.push({
          id: i,
          text: text,
          imageUrl: `data:image/png;base64,${imageBase64}`,
        });
        tasksCompleted++;
        setProgress(25 + Math.round((tasksCompleted / totalTasks) * 75));
      }
      
      setStorySegments(finalSegments);
      setProgress(100);
      setStep(GenerationStep.IDLE); // Set to IDLE to signify completion and switch view
      
    } catch (err) {
      console.error("Story generation failed:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    }
  };
  
  const translateError = (message: string): string => {
    if (language !== 'zh') return message;
    const errorMap: Record<string, string> = {
      "Failed to design the character.": "设计角色失败。",
      "The AI failed to generate a story. Please try again with a different prompt.": "AI未能生成故事。请换个提示词再试一次。",
      "Failed to generate story from AI.": "AI生成故事失败。",
      "No image was generated.": "未能生成图片。",
      "Failed to generate image for a story segment.": "为故事片段生成图片失败。",
      "Could not authenticate with the voice generation service.": "无法连接语音生成服务。",
    };
    if (message.startsWith("Voice generation failed:")) {
        return message.replace("Voice generation failed:", "语音生成失败:");
    }
    return errorMap[message] || message;
  };

  const renderContent = () => {
    if (error) {
      const T = language === 'zh' ? {
        errorTitle: "发生错误",
        tryAgain: "重试"
      } : {
        errorTitle: "An Error Occurred",
        tryAgain: "Try Again"
      };
  
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 p-4">
              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                  <h2 className="text-2xl font-bold text-red-600 mb-4">{T.errorTitle}</h2>
                  <p className="text-gray-700">{translateError(error)}</p>
                  <button onClick={handleReset} className="mt-6 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">
                      {T.tryAgain}
                  </button>
              </div>
          </div>
      );
    }
  
    if (step !== GenerationStep.IDLE && storySegments.length === 0) {
      return <LoadingScreen currentStep={step} progress={progress} language={language} />;
    }
  
    if (storySegments.length > 0) {
      return <StoryPlayer segments={storySegments} onReset={handleReset} language={language} />;
    }
    
    return <StoryForm onSubmit={startGeneration} isGenerating={step !== GenerationStep.IDLE} language={language} />;
  }

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher language={language} setLanguage={setLanguage} />
      </div>
      {renderContent()}
    </div>
  );
}

export default App;