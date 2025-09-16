import React, { useState, useEffect } from 'react';
import type { StorySegment } from '../types';
import { speak, cancel } from '../services/ttsService';
import { generateSpeech } from '../services/baiduTtsService';
import { PlayIcon, PauseIcon, ChevronLeftIcon, ChevronRightIcon, ArrowUturnLeftIcon } from './icons/Icons';

interface StoryPlayerProps {
  segments: StorySegment[];
  onReset: () => void;
  language: 'en' | 'zh';
}

const StoryPlayer: React.FC<StoryPlayerProps> = ({ segments, onReset, language }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const currentSegment = segments[currentIndex];

  const T = language === 'zh' ? {
    resetTitle: '创建新故事',
  } : {
    resetTitle: 'Create a new story',
  };

  const cleanupAudio = () => {
    if (audio) {
      audio.pause();
      if (audio.src.startsWith('blob:')) {
          URL.revokeObjectURL(audio.src);
      }
      setAudio(null);
    }
    cancel(); // Also cancel browser TTS
  };

  const handleSpeechEnd = () => {
    if (currentIndex < segments.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsPlaying(false); // Story finished
    }
  };

  useEffect(() => {
    if (!isPlaying || !currentSegment) {
      cleanupAudio();
      return;
    }

    if (language === 'zh') {
      setIsAudioLoading(true);
      generateSpeech(currentSegment.text, 'zh')
        .then(blob => {
          const audioUrl = URL.createObjectURL(blob);
          const newAudio = new Audio(audioUrl);
          setAudio(newAudio);
          newAudio.onended = handleSpeechEnd;
          newAudio.onerror = (e) => {
            console.error("Audio playback error:", e);
            handleSpeechEnd(); 
          };
          newAudio.play();
        })
        .catch(err => {
          console.error("Baidu TTS generation failed:", err);
          handleSpeechEnd(); // Advance to next segment to avoid getting stuck
        })
        .finally(() => {
          setIsAudioLoading(false);
        });
    } else {
      speak(currentSegment.text, 'en', handleSpeechEnd);
    }

    return () => {
      cleanupAudio();
    };
  }, [currentIndex, isPlaying, language]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const goToNext = () => {
    if (currentIndex < segments.length - 1) {
      setIsPlaying(false); // Stop playback
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setIsPlaying(false); // Stop playback
      setCurrentIndex(currentIndex - 1);
    }
  };

  const PlayPauseButtonIcon = () => {
    if (language === 'zh' && isAudioLoading) {
        return (
           <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
        );
    }
    return isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-0 md:p-4">
      <div className="relative w-full max-w-4xl mx-auto bg-white shadow-lg flex flex-col h-screen md:h-auto md:max-h-[90vh] md:my-8 md:rounded-2xl overflow-hidden">
        
        <div className="relative flex-grow md:flex-grow-0 md:aspect-video">
          <img src={currentSegment.imageUrl} alt={`Illustration for story segment ${currentIndex + 1}`} className="absolute inset-0 w-full h-full object-cover" />
          <button onClick={onReset} className="absolute top-4 left-4 z-20 bg-white/70 backdrop-blur-sm rounded-full p-2 text-gray-700 hover:bg-white transition" title={T.resetTitle}>
              <ArrowUturnLeftIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-200">
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 min-h-[7rem] max-h-[40vh] md:min-h-[6rem] md:max-h-48 overflow-y-auto">{currentSegment.text}</p>
          
          <div className="flex items-center justify-between">
            <button onClick={goToPrev} disabled={currentIndex === 0} className="disabled:opacity-30 text-gray-600 hover:text-gray-900 transition p-2">
              <ChevronLeftIcon className="w-8 h-8" />
            </button>

            <button onClick={handlePlayPause} disabled={isAudioLoading} className="bg-purple-600 text-white rounded-full p-4 mx-4 hover:bg-purple-700 transition shadow-md disabled:opacity-70 disabled:cursor-wait">
              <PlayPauseButtonIcon />
            </button>

            <button onClick={goToNext} disabled={currentIndex === segments.length - 1} className="disabled:opacity-30 text-gray-600 hover:text-gray-900 transition p-2">
              <ChevronRightIcon className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryPlayer;