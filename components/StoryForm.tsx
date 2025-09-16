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
  language: 'en' | 'zh';
}

const characterOptions = [
  { label: 'A Curious Squirrel', zh_label: '好奇的小松鼠', value: 'a curious squirrel named Squeaky with fluffy, warm-brown fur', Icon: SquirrelIcon },
  { label: 'A Brave Knight', zh_label: '勇敢的小骑士', value: 'a brave little knight named Leo with shiny silver armor and a friendly smile', Icon: KnightIcon },
  { label: 'A Friendly Robot', zh_label: '友好的机器人', value: 'a friendly robot named Bolt with a round, blue body and one big, curious eye', Icon: RobotIcon },
  { label: 'A Magical Unicorn', zh_label: '神奇的独角兽', value: 'a magical unicorn named Luna with a shimmering white coat and a rainbow-colored horn', Icon: UnicornIcon },
];

const settingOptions = [
  { label: 'Enchanted Forest', zh_label: '魔法森林', value: 'an enchanted forest filled with glowing mushrooms and talking animals', Icon: ForestIcon },
  { label: 'Crystal Cave', zh_label: '水晶洞穴', value: 'a sparkling crystal cave where the walls glitter with every color imaginable', Icon: CrystalCaveIcon },
  { label: 'Animal Town', zh_label: '动物小镇', value: 'a bustling town where all the animals live and work together in tiny, cute houses', Icon: AnimalTownIcon },
  { label: 'Candy Land', zh_label: '糖果乐园', value: 'a whimsical land made of candy, with chocolate rivers and lollipop trees', Icon: CandyLandIcon },
];

const themeOptions = [
  { label: 'Magic of Friendship', zh_label: '友谊的魔力', value: 'the magic of friendship and how it can overcome any obstacle', Icon: FriendshipIcon },
  { label: 'Courage to Be Different', zh_label: '与众不同的勇气', value: 'the courage to be different and embrace what makes you unique', Icon: CourageIcon },
  { label: 'Joy of Helping', zh_label: '助人之乐', value: 'the joy of helping others and the importance of kindness', Icon: HelpingIcon },
  { label: 'Adventure of a New Thing', zh_label: '新事物的冒险', value: 'the excitement and adventure of trying something new for the first time', Icon: AdventureIcon },
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

const StoryForm: React.FC<StoryFormProps> = ({ onSubmit, isGenerating, language }) => {
  const [formData, setFormData] = useState<StoryFormData>({
    character: characterOptions[0].value,
    setting: settingOptions[0].value,
    theme: themeOptions[0].value,
    age: 5,
    length: 'short',
  });

  const T = language === 'zh' ? {
      title: "我们来创作一个故事吧！",
      subtitle: "选择你最喜欢的选项，见证魔法发生。",
      characterTitle: "1. 选择一个角色",
      settingTitle: "2. 挑选一个场景",
      themeTitle: "3. 设定一个主题",
      ageLabel: "目标年龄",
      lengthLabel: "故事长度",
      lengthShort: "短篇",
      lengthMedium: "中篇",
      lengthLong: "长篇",
      generating: "正在创作...",
      generate: "✨ 生成故事 ✨",
  } : {
      title: "Let's Create a Story!",
      subtitle: "Pick your favorite options below and watch the magic happen.",
      characterTitle: "1. Choose a Character",
      settingTitle: "2. Pick a Setting",
      themeTitle: "3. Select a Theme",
      ageLabel: "Target Age",
      lengthLabel: "Story Length",
      lengthShort: "Short",
      lengthMedium: "Medium",
      lengthLong: "Long",
      generating: "Creating...",
      generate: "✨ Generate Story ✨",
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-4 pt-20 sm:pt-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
        <h1 className="text-3xl sm:text-4xl font-black text-center text-gray-800 tracking-tight">{T.title}</h1>
        <p className="text-center text-gray-500 mt-2 mb-6 sm:mb-8">{T.subtitle}</p>
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <OptionSection title={T.characterTitle}>
            {characterOptions.map(opt => <OptionCard key={opt.label} label={language === 'zh' ? opt.zh_label : opt.label} Icon={opt.Icon} isSelected={formData.character === opt.value} onSelect={() => handleSelect('character', opt.value)} />)}
          </OptionSection>

          <OptionSection title={T.settingTitle}>
            {settingOptions.map(opt => <OptionCard key={opt.label} label={language === 'zh' ? opt.zh_label : opt.label} Icon={opt.Icon} isSelected={formData.setting === opt.value} onSelect={() => handleSelect('setting', opt.value)} />)}
          </OptionSection>

          <OptionSection title={T.themeTitle}>
            {themeOptions.map(opt => <OptionCard key={opt.label} label={language === 'zh' ? opt.zh_label : opt.label} Icon={opt.Icon} isSelected={formData.theme === opt.value} onSelect={() => handleSelect('theme', opt.value)} />)}
          </OptionSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
             <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">{T.ageLabel}</label>
              <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} min="2" max="10" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" required />
            </div>
            <div>
              <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">{T.lengthLabel}</label>
              <select name="length" id="length" value={formData.length} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500">
                <option value="short">{T.lengthShort}</option>
                <option value="medium">{T.lengthMedium}</option>
                <option value="long">{T.lengthLong}</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={isGenerating} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-lg">
            {isGenerating ? T.generating : T.generate}
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