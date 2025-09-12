import React, { useState, useCallback } from 'react';
// FIX: Correctly import the 'Language' type and remove invalid syntax.
import { StoryFormData, StorySegment, AppState, GenerationStep, Language } from './types';
import { generateStory, generateImageForSegment } from './services/geminiService';
import StoryForm from './components/StoryForm';
import LoadingScreen from './components/LoadingScreen';
import StoryPlayer from './components/StoryPlayer';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.FORM);
  const [storySegments, setStorySegments] = useState<StorySegment[]>([]);
  const [storyLanguage, setStoryLanguage] = useState<Language>('en');
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<GenerationStep>(GenerationStep.IDLE);
  const [progress, setProgress] = useState(0);

  const handleReset = useCallback(() => {
    setAppState(AppState.FORM);
    setStorySegments([]);
    setError(null);
    setCurrentStep(GenerationStep.IDLE);
    setProgress(0);
  }, []);

  const handleGenerateStory = async (formData: StoryFormData) => {
    setAppState(AppState.LOADING);
    setError(null);
    setProgress(0);
    setStoryLanguage(formData.language);
    
    try {
      // Step 1: Generate Story Text
      setCurrentStep(GenerationStep.STORY);
      const fullStoryText = await generateStory(formData);
      if (!fullStoryText) {
        throw new Error("The story could not be generated. Please try again.");
      }

      const segments = fullStoryText.split('[SEGMENT_BREAK]').map(s => s.trim()).filter(Boolean);
      const totalSteps = 1 + segments.length; // 1 for story + N for images
      setProgress(1 / totalSteps * 100);

      const finalSegments: StorySegment[] = [];

      // Step 2: Generate Image for each segment
      for (let i = 0; i < segments.length; i++) {
        const segmentText = segments[i];

        // Generate Image
        setCurrentStep(GenerationStep.IMAGES);
        const imageBase64 = await generateImageForSegment(segmentText, formData.language);
        const imageUrl = `data:image/png;base64,${imageBase64}`;
        setProgress((1 + i + 1) / totalSteps * 100);
        
        finalSegments.push({
          id: i,
          text: segmentText,
          imageUrl: imageUrl,
        });
      }
      
      setStorySegments(finalSegments);
      setAppState(AppState.PLAYER);

    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Oh no! The magic spell fizzled. ${errorMessage}. Please try again.`);
      setAppState(AppState.ERROR);
    }
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.LOADING:
        return <LoadingScreen currentStep={currentStep} progress={progress} />;
      case AppState.PLAYER:
        return <StoryPlayer segments={storySegments} language={storyLanguage} onReset={handleReset} />;
      case AppState.ERROR:
        return (
          <div className="flex flex-col items-center justify-center h-screen bg-rose-50 text-center p-8">
            <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg">
              <h2 className="text-3xl font-bold text-rose-600 mb-4">Something Went Wrong</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-rose-500 text-white font-bold rounded-full hover:bg-rose-600 transition-transform transform hover:scale-105"
              >
                Try Again
              </button>
            </div>
          </div>
        );
      case AppState.FORM:
      default:
        return <StoryForm onSubmit={handleGenerateStory} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {renderContent()}
    </div>
  );
};

export default App;