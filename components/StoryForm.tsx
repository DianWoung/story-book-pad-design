import React, { useState } from 'react';
import type { StoryFormData } from '../types';
import {
  SquirrelIcon, KnightIcon, RobotIcon, UnicornIcon,
  ForestIcon, CrystalCaveIcon, AnimalTownIcon, CandyLandIcon,
  FriendshipIcon, CourageIcon, HelpingIcon, AdventureIcon, CheckCircleIcon
} from './icons/Icons';

interface StoryFormProps {
  onSubmit: (formData: StoryFormData) => void;
  isGenerating: boolean;
}

const characterOptions = [
  { label: 'A Curious Squirrel', value: 'a curious squirrel named Squeaky with fluffy, warm-brown fur', Icon: SquirrelIcon },
  { label: 'A Brave Knight', value: 'a brave little knight named Leo with shiny silver armor and a friendly smile', Icon: KnightIcon },
  { label: 'A Friendly Robot', value: 'a friendly robot named Bolt with a round, blue body and one big, curious eye', Icon: RobotIcon },
  { label: 'A Magical Unicorn', value: 'a magical unicorn named Luna with a shimmering white coat and a rainbow-colored horn', Icon: UnicornIcon },
];

const settingOptions = [
  { label: 'Enchanted Forest', value: 'an enchanted forest filled with glowing mushrooms and talking animals', Icon: ForestIcon },
  { label: 'Crystal Cave', value: 'a sparkling crystal cave where the walls glitter with every color imaginable', Icon: CrystalCaveIcon },
  { label: 'Animal Town', value: 'a bustling town where all the animals live and work together in tiny, cute houses', Icon: AnimalTownIcon },
  { label: 'Candy Land', value: 'a whimsical land made of candy, with chocolate rivers and lollipop trees', Icon: CandyLandIcon },
];

const themeOptions = [
  { label: 'Magic of Friendship', value: 'the magic of friendship and how it can overcome any obstacle', Icon: FriendshipIcon },
  { label: 'Courage to Be Different', value: 'the courage to be different and embrace what makes you unique', Icon: CourageIcon },
  { label: 'Joy of Helping', value: 'the joy of helping others and the importance of kindness', Icon: HelpingIcon },
  { label: 'Adventure of a New Thing', value: 'the excitement and adventure of trying something new for the first time', Icon: AdventureIcon },
];

const OptionCard: React.FC<{ label: string; Icon: React.FC<React.SVGProps<SVGSVGElement>>; isSelected: boolean; onSelect: () => void; }> = ({ label, Icon, isSelected, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    className={`relative text-center p-3 sm:p-4 border-2 rounded-xl transition-all duration-200 ${isSelected ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500' : 'border-gray-200 bg-white hover:border-purple-300'}`}
  >
    <Icon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 text-purple-600" />
    <span className="block font-semibold text-gray-700 text-sm sm:text-base">{label}</span>
    {isSelected && <CheckCircleIcon className="w-6 h-6 text-white bg-purple-500 rounded-full absolute -top-2 -right-2" />}
  </button>
);

const StoryForm: React.FC<StoryFormProps> = ({ onSubmit, isGenerating }) => {
  const [formData, setFormData] = useState<StoryFormData>({
    character: characterOptions[0].value,
    setting: settingOptions[0].value,
    theme: themeOptions[0].value,
    age: 5,
    length: 'short',
    language: 'en',
  });

  const handleSelect = (field: keyof StoryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'age' ? parseInt(value, 10) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
        <h1 className="text-3xl sm:text-4xl font-black text-center text-gray-800 tracking-tight">Let's Create a Story!</h1>
        <p className="text-center text-gray-500 mt-2 mb-6 sm:mb-8">Pick your favorite options below and watch the magic happen.</p>
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <OptionSection title="1. Choose a Character">
            {characterOptions.map(opt => <OptionCard key={opt.label} {...opt} isSelected={formData.character === opt.value} onSelect={() => handleSelect('character', opt.value)} />)}
          </OptionSection>

          <OptionSection title="2. Pick a Setting">
            {settingOptions.map(opt => <OptionCard key={opt.label} {...opt} isSelected={formData.setting === opt.value} onSelect={() => handleSelect('setting', opt.value)} />)}
          </OptionSection>

          <OptionSection title="3. Select a Theme">
            {themeOptions.map(opt => <OptionCard key={opt.label} {...opt} isSelected={formData.theme === opt.value} onSelect={() => handleSelect('theme', opt.value)} />)}
          </OptionSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
             <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Target Age</label>
              <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} min="2" max="10" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" required />
            </div>
            <div>
              <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">Story Length</label>
              <select name="length" id="length" value={formData.length} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500">
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>
             <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select name="language" id="language" value={formData.language} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500">
                <option value="en">English</option>
                <option value="zh">Chinese (Mandarin)</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={isGenerating} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-lg">
            {isGenerating ? 'Creating...' : '✨ Generate Story ✨'}
          </button>
        </form>
      </div>
    </div>
  );
};

const OptionSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h2 className="text-xl font-bold text-gray-700 mb-4">{title}</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {children}
    </div>
  </div>
);


export default StoryForm;