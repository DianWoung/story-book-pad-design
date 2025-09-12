import React, { useState } from 'react';
import type { StoryFormData } from '../types';

interface StoryFormProps {
  onSubmit: (formData: StoryFormData) => void;
  isGenerating: boolean;
}

const StoryForm: React.FC<StoryFormProps> = ({ onSubmit, isGenerating }) => {
  const [formData, setFormData] = useState<StoryFormData>({
    character: 'a curious squirrel',
    personality: 'brave and adventurous',
    setting: 'a magical forest',
    theme: 'the importance of friendship',
    age: 5,
    length: 'short',
    language: 'en',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'age' ? parseInt(value, 10) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 space-y-6 transform hover:scale-105 transition-transform duration-300">
        <h1 className="text-4xl font-bold text-center text-gray-800">Create a Magical Story</h1>
        <p className="text-center text-gray-500">Fill in the details below and let the magic begin!</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="character" className="block text-sm font-medium text-gray-700">Main Character</label>
            <input type="text" name="character" id="character" value={formData.character} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" required />
          </div>
          <div>
            <label htmlFor="personality" className="block text-sm font-medium text-gray-700">Character's Personality</label>
            <input type="text" name="personality" id="personality" value={formData.personality} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" required />
          </div>
          <div>
            <label htmlFor="setting" className="block text-sm font-medium text-gray-700">Setting</label>
            <input type="text" name="setting" id="setting" value={formData.setting} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" required />
          </div>
          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700">Theme</label>
            <input type="text" name="theme" id="theme" value={formData.theme} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">Target Age</label>
              <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} min="2" max="10" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" required />
            </div>
            <div>
              <label htmlFor="length" className="block text-sm font-medium text-gray-700">Story Length</label>
              <select name="length" id="length" value={formData.length} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500">
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
            <select name="language" id="language" value={formData.language} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500">
              <option value="en">English</option>
              <option value="zh">Chinese (Mandarin)</option>
            </select>
          </div>
          <button type="submit" disabled={isGenerating} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
            {isGenerating ? 'Creating...' : 'Generate Story'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StoryForm;
