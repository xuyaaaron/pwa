import React, { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import EntryView from './views/EntryView';
import RankingsView from './views/RankingsView';
import TeamView from './views/TeamView';
import PersonalView from './views/PersonalView';
import { TabId } from './types';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabId>('entry');

  // Prevent bouncy scroll on mobile safari PWA
  useEffect(() => {
    document.body.style.overscrollBehavior = 'none';
    return () => {
      document.body.style.overscrollBehavior = 'auto';
    };
  }, []);

  const renderContent = () => {
    switch (currentTab) {
      case 'entry':
        return <EntryView />;
      case 'rankings':
        return <RankingsView />;
      case 'team':
        return <TeamView />;
      case 'personal':
        return <PersonalView />;
      default:
        return <EntryView />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-gray-900 font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden flex flex-col">
      <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth no-scrollbar">
        {renderContent()}
      </main>
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
};

export default App;