import React from 'react';
// FIX: Changed `import type` to `import` to allow using the enum as a value.
import { GenerationStep } from '../types';
import { BookOpenIcon, PhotoIcon, SparklesIcon, UserCircleIcon } from './icons/Icons';

interface LoadingScreenProps {
  currentStep: GenerationStep;
  progress: number;
}

const stepIcons: Record<GenerationStep, React.ReactElement> = {
  [GenerationStep.IDLE]: <SparklesIcon className="w-8 h-8" />,
  [GenerationStep.CHARACTER]: <UserCircleIcon className="w-8 h-8" />,
  [GenerationStep.STORY]: <BookOpenIcon className="w-8 h-8" />,
  [GenerationStep.IMAGES]: <PhotoIcon className="w-8 h-8" />,
};

const LoadingScreen: React.FC<LoadingScreenProps> = ({ currentStep, progress }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-purple-200 p-4">
      <div className="w-full max-w-md text-center">
        <div className="relative w-40 h-40 mx-auto">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-200 stroke-current"
              strokeWidth="5"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
            ></circle>
            <circle
              className="text-purple-500 stroke-current"
              strokeWidth="5"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset={`calc(251.2 - (251.2 * ${progress}) / 100)`}
              style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
              transform="rotate(-90 50 50)"
            ></circle>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-purple-500">
            {stepIcons[currentStep]}
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 mt-8 animate-pulse">{currentStep}</h2>
        <p className="text-gray-600 mt-2">Please wait, magic is in the works!</p>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-8 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-pink-400 to-purple-500 h-2.5 rounded-full" 
            style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;