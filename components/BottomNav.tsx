import React from 'react';
import { TabId } from '../types';

interface BottomNavProps {
  currentTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const getIconClass = (isActive: boolean) => 
    `text-2xl mb-1 transition-transform duration-200 ${isActive ? 'material-symbols-filled scale-110' : 'material-symbols-outlined'}`;

  const getItemClass = (tabName: TabId) => {
    const isActive = currentTab === tabName;
    return `flex flex-col items-center justify-center w-full h-full py-2 cursor-pointer transition-colors duration-200 ${
      isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-500'
    }`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 pb-safe-bottom z-50 h-[80px]">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        <button className={getItemClass('team')} onClick={() => onTabChange('team')}>
          <span className={getIconClass(currentTab === 'team')}>group</span>
          <span className="text-[10px] font-bold">团队</span>
        </button>

        <button className={getItemClass('personal')} onClick={() => onTabChange('personal')}>
          <span className={getIconClass(currentTab === 'personal')}>person</span>
          <span className="text-[10px] font-bold">个人</span>
        </button>

        <button className={getItemClass('entry')} onClick={() => onTabChange('entry')}>
          <div className={`p-2 rounded-2xl mb-1 transition-all duration-200 ${currentTab === 'entry' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-transparent'}`}>
             <span className={`text-2xl block ${currentTab === 'entry' ? 'material-symbols-outlined' : 'material-symbols-outlined'}`}>add_box</span>
          </div>
          <span className="text-[10px] font-bold">录入</span>
        </button>

        <button className={getItemClass('rankings')} onClick={() => onTabChange('rankings')}>
          <span className={getIconClass(currentTab === 'rankings')}>leaderboard</span>
          <span className="text-[10px] font-bold">排名</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;