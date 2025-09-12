
import React, { useState } from 'react';
import type { StoryFormData } from '../types';
import { SparklesIcon, UserIcon, GlobeAltIcon, BookOpenIcon, BeakerIcon, AdjustmentsHorizontalIcon, LanguageIcon, ClockIcon } from './icons/Icons';

interface StoryFormProps {
  onSubmit: (formData: StoryFormData) => void;
}

const StoryForm: React.FC<StoryFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<StoryFormData>({
    character: 'a brave little fox',
    personality: 'curious and friendly',
    setting: 'a magical, glowing forest',
    theme: 'the importance of friendship',
    age: '5',
    length: 'short',
    language: 'en',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 transform hover:scale-[1.01] transition-transform duration-500">
        <div className="text-center mb-8">
          <SparklesIcon className="w-16 h-16 mx-auto text-purple-500" />
          <h1 className="text-4xl md:text-5xl font-black text-gray-800 mt-2">Create a Story!</h1>
          <p className="text-gray-600 mt-2">Fill in the details below and let AI create a magical tale for you.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="character" className="form-label"><UserIcon /> Character</label>
              <input type="text" id="character" name="character" value={formData.character} onChange={handleChange} className="form-input" placeholder="e.g., a brave little fox" />
            </div>
            <div className="form-group">
              <label htmlFor="personality" className="form-label"><BeakerIcon /> Personality</label>
              <input type="text" id="personality" name="personality" value={formData.personality} onChange={handleChange} className="form-input" placeholder="e.g., curious and friendly" />
            </div>
            <div className="form-group">
              <label htmlFor="setting" className="form-label"><GlobeAltIcon /> Setting</label>
              <input type="text" id="setting" name="setting" value={formData.setting} onChange={handleChange} className="form-input" placeholder="e.g., a magical forest" />
            </div>
            <div className="form-group">
              <label htmlFor="theme" className="form-label"><BookOpenIcon /> Theme</label>
              <input type="text" id="theme" name="theme" value={formData.theme} onChange={handleChange} className="form-input" placeholder="e.g., friendship" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="form-group">
              <label htmlFor="age" className="form-label"><AdjustmentsHorizontalIcon /> Age Group</label>
              <select id="age" name="age" value={formData.age} onChange={handleChange} className="form-input">
                <option value="3">2-3 years old</option>
                <option value="5">4-6 years old</option>
                <option value="8">7-9 years old</option>
              </select>
            </div>
             <div className="form-group">
              <label htmlFor="length" className="form-label"><ClockIcon/> Story Length</label>
              <select id="length" name="length" value={formData.length} onChange={handleChange} className="form-input">
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>
          </div>
          
           <div className="form-group">
              <label htmlFor="language" className="form-label"><LanguageIcon /> Language</label>
              <div className="flex gap-4 mt-2">
                <label className={`radio-label ${formData.language === 'en' ? 'radio-label-active' : ''}`}>
                  <input type="radio" name="language" value="en" checked={formData.language === 'en'} onChange={handleChange} className="sr-only" />
                  🇺🇸 English
                </label>
                <label className={`radio-label ${formData.language === 'zh' ? 'radio-label-active' : ''}`}>
                  <input type="radio" name="language" value="zh" checked={formData.language === 'zh'} onChange={handleChange} className="sr-only" />
                  🇨🇳 中文
                </label>
              </div>
            </div>

          <button type="submit" disabled={isSubmitting} className="w-full mt-4 flex items-center justify-center gap-3 text-white font-bold py-4 px-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg">
            {isSubmitting ? 'Creating Magic...' : 'Generate Story'}
            <SparklesIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
      <style>{`
        .form-group { position: relative; }
        .form-label { display: flex; align-items: center; gap: 0.5rem; font-weight: bold; color: #4a5568; margin-bottom: 0.5rem; }
        .form-label svg { width: 1.25rem; height: 1.25rem; color: #a0aec0; }
        .form-input { width: 100%; padding: 0.75rem 1rem; border: 2px solid #e2e8f0; border-radius: 0.75rem; transition: all 0.2s ease-in-out; background-color: white; }
        .form-input:focus { outline: none; border-color: #a78bfa; box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.3); }
        .radio-label { cursor: pointer; padding: 0.75rem 1.5rem; border: 2px solid #e2e8f0; border-radius: 9999px; font-weight: bold; transition: all 0.2s; }
        .radio-label-active { border-color: #c084fc; background-color: #f3e8ff; color: #8b5cf6; }
      `}</style>
    </div>
  );
};

export default StoryForm;
