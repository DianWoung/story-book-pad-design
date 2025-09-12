import React, { useState, useEffect, useCallback } from 'react';
import type { StorySegment, Language } from '../types';
import { ttsService } from '../services/ttsService';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon, ArrowUturnLeftIcon, SpeakerWaveIcon } from './icons/Icons';

interface StoryPlayerProps {
  segments: StorySegment[];
  language: Language;
  onReset: () => void;
}

const StoryPlayer: React.FC<StoryPlayerProps> = ({ segments, language, onReset }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentSegment = segments[currentIndex];

  const handleSpeechEnd = useCallback(() => {
    setIsPlaying(false);
    setIsSpeaking(false);
    // Auto-advance to next slide
    if (currentIndex < segments.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(true);
    }
  }, [currentIndex, segments.length]);

  useEffect(() => {
    // Stop speaking if component unmounts or dependencies change
    return () => {
      ttsService.cancel();
    };
  }, []);
  
  useEffect(() => {
    if (isPlaying && currentSegment) {
      setIsSpeaking(true);
      ttsService.speak(currentSegment.text, language, handleSpeechEnd);
    } else {
      ttsService.cancel();
      setIsSpeaking(false);
    }
  }, [currentIndex, isPlaying, currentSegment, language, handleSpeechEnd]);
  
  // Start playing audio when component mounts for the first segment
  useEffect(() => {
    setIsPlaying(true);
  }, []);


  const handleNext = () => {
    if (currentIndex < segments.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (isSpeaking) {
      ttsService.cancel(); // This will trigger onEnd, setting isPlaying to false.
    } else {
      setIsPlaying(true);
    }
  };
  
  const handleReset = () => {
    ttsService.cancel();
    onReset();
  };


  if (!currentSegment) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-rose-50 text-center p-8">
        <h2 className="text-2xl font-bold text-gray-700">Loading story...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center p-4 transition-all duration-500">
      <div className="w-full max-w-4xl aspect-[16/9] bg-white rounded-2xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row">
        {/* Image */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full bg-gray-100">
            <img src={currentSegment.imageUrl} alt={`Illustration for segment ${currentIndex + 1}`} className="w-full h-full object-cover" />
        </div>

        {/* Text */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full p-6 flex flex-col justify-center bg-white">
          <div className="overflow-y-auto h-full">
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
              {currentSegment.text}
            </p>
          </div>
        </div>

        {/* Speaking Indicator */}
        {isSpeaking && (
            <div className="absolute top-4 right-4 bg-purple-500/80 text-white p-2 rounded-full animate-pulse">
                <SpeakerWaveIcon className="w-6 h-6" />
            </div>
        )}
      </div>

      {/* Controls */}
      <div className="w-full max-w-4xl mt-6 flex items-center justify-between">
         <button onClick={handleReset} className="control-button bg-red-100 text-red-600 hover:bg-red-200">
            <ArrowUturnLeftIcon className="w-6 h-6" />
            <span className="hidden md:inline ml-2">Start Over</span>
         </button>

         <div className="flex items-center gap-4">
            <button onClick={handlePrev} disabled={currentIndex === 0} className="control-button">
                <ChevronLeftIcon className="w-8 h-8" />
            </button>
            <button onClick={togglePlay} className="control-button p-4 bg-purple-500 text-white hover:bg-purple-600">
                {isSpeaking ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
            </button>
             <button onClick={handleNext} disabled={currentIndex === segments.length - 1} className="control-button">
                <ChevronRightIcon className="w-8 h-8" />
            </button>
         </div>

         <div className="text-gray-600 font-bold text-lg w-28 text-right">
            {currentIndex + 1} / {segments.length}
         </div>
      </div>
       <style>{`
        .control-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem;
          border-radius: 9999px;
          background-color: white;
          color: #4b5563;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          transition: all 0.2s;
        }
        .control-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }
        .control-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default StoryPlayer;
