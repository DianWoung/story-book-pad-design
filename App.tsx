import React, { useState } from 'react';
import StoryForm from './components/StoryForm';
import LoadingScreen from './components/LoadingScreen';
import StoryPlayer from './components/StoryPlayer';
import { generateCharacterDescription, generateStory, generateImageForSegment } from './services/geminiService';
import type { StoryFormData, StorySegment } from './types';
import { GenerationStep } from './types';

function App() {
  const [step, setStep] = useState<GenerationStep>(GenerationStep.IDLE);
  const [storySegments, setStorySegments] = useState<StorySegment[]>([]);
  const [storyLanguage, setStoryLanguage] = useState<'en' | 'zh'>('en');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    setStep(GenerationStep.IDLE);
    setStorySegments([]);
    setStoryLanguage('en');
    setProgress(0);
    setError(null);
  };

  const startGeneration = async (formData: StoryFormData) => {
    handleReset();
    setStep(GenerationStep.CHARACTER);
    setStoryLanguage(formData.language);
    setProgress(5);

    try {
      // 1. Generate Character Description for consistency
      const characterDescription = await generateCharacterDescription(formData);
      setProgress(15);
      setStep(GenerationStep.STORY);

      // 2. Generate Story
      const fullStory = await generateStory(formData);
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
        const imageBase64 = await generateImageForSegment(text, formData.language, characterDescription);
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

  if (error) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">An Error Occurred</h2>
                <p className="text-gray-700">{error}</p>
                <button onClick={handleReset} className="mt-6 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">
                    Try Again
                </button>
            </div>
        </div>
    );
  }

  if (step !== GenerationStep.IDLE && storySegments.length === 0) {
    return <LoadingScreen currentStep={step} progress={progress} />;
  }

  if (storySegments.length > 0) {
    return <StoryPlayer segments={storySegments} onReset={handleReset} language={storyLanguage} />;
  }
  
  return <StoryForm onSubmit={startGeneration} isGenerating={step !== GenerationStep.IDLE} />;
}

export default App;