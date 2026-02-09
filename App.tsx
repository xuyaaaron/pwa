import React, { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import EntryView from './views/EntryView';
import RankingsView from './views/RankingsView';
import TeamView from './views/TeamView';
import PersonalView from './views/PersonalView';
import WeeklyView from './views/WeeklyView';
import { TabId } from './types';
import { PasswordGate } from './components/PasswordGate';

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
      case 'weekly':
        return <WeeklyView />;
      default:
        return <EntryView />;
    }
  };

  return (
    <PasswordGate>
      <div className="min-h-[100dvh] w-full bg-background text-gray-900 font-sans relative overflow-x-hidden p-0 m-0">
        <main className="w-full pb-[80px]">
          {renderContent()}
        </main>
        <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
      </div>
    </PasswordGate>
  );
};

export default App;