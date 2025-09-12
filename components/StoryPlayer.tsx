import React, { useState, useEffect } from 'react';
import type { StorySegment } from '../types';
import { speak, cancel } from '../services/ttsService';
import { PlayIcon, PauseIcon, ChevronLeftIcon, ChevronRightIcon, ArrowUturnLeftIcon } from './icons/Icons';

interface StoryPlayerProps {
  segments: StorySegment[];
  onReset: () => void;
  language: 'en' | 'zh';
}

const StoryPlayer: React.FC<StoryPlayerProps> = ({ segments, onReset, language }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentSegment = segments[currentIndex];

  const handleSpeechEnd = () => {
    if (currentIndex < segments.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsPlaying(false); // Story finished
    }
  };

  useEffect(() => {
    if (isPlaying && currentSegment) {
      speak(currentSegment.text, language, handleSpeechEnd);
    } else {
      cancel();
    }
    // Cleanup function to cancel speech when the component unmounts or dependencies change
    return () => {
      cancel();
    };
  }, [currentIndex, isPlaying, currentSegment, language]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const goToNext = () => {
    // Stop speech before navigating
    if (isPlaying) setIsPlaying(false);
    if (currentIndex < segments.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    // Stop speech before navigating
    if (isPlaying) setIsPlaying(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <button onClick={onReset} className="absolute top-4 left-4 z-20 bg-white/70 backdrop-blur-sm rounded-full p-2 text-gray-700 hover:bg-white transition" title="Create a new story">
            <ArrowUturnLeftIcon className="w-6 h-6" />
        </button>
        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
          <img src={currentSegment.imageUrl} alt={`Illustration for story segment ${currentIndex + 1}`} className="w-full h-full object-cover" />
        </div>

        <div className="p-6">
          <p className="text-gray-700 text-lg leading-relaxed mb-6 h-32 overflow-y-auto">{currentSegment.text}</p>
          
          <div className="flex items-center justify-between">
            <button onClick={goToPrev} disabled={currentIndex === 0} className="disabled:opacity-30 text-gray-600 hover:text-gray-900 transition">
              <ChevronLeftIcon className="w-8 h-8" />
            </button>

            <button onClick={handlePlayPause} className="bg-purple-600 text-white rounded-full p-4 mx-4 hover:bg-purple-700 transition shadow-md">
              {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
            </button>

            <button onClick={goToNext} disabled={currentIndex === segments.length - 1} className="disabled:opacity-30 text-gray-600 hover:text-gray-900 transition">
              <ChevronRightIcon className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryPlayer;
