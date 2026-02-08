import React, { useState } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'W1', rank: 6 },
  { name: 'W2', rank: 5 },
  { name: 'W3', rank: 5 },
  { name: 'W4', rank: 4 },
  { name: 'W5', rank: 2 },
  { name: 'W6', rank: 1 },
];

const RankingsView: React.FC = () => {
  // State for Analysts
  const [analysts, setAnalysts] = useState([
    { id: 1, name: 'Peidong (沛东)', role: '策略研究', percentile: 15, initial: 'P', color: 'bg-primary/10 text-primary' },
    { id: 2, name: 'Xu Ya (徐雅)', role: '策略研究', percentile: 22, initial: 'X', color: 'bg-purple-100 text-purple-600' },
    { id: 3, name: 'Xiaoxi (晓希)', role: '策略研究', percentile: 45, initial: 'X', color: 'bg-blue-100 text-blue-600' },
    { id: 4, name: 'Tianran (天然)', role: '策略研究', percentile: 55, initial: 'T', color: 'bg-orange-100 text-orange-600' },
  ]);

  // State for 13 Groups Data
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groups, setGroups] = useState(
    Array.from({ length: 13 }).map((_, i) => ({
      id: i + 1,
      name: i === 0 ? '金融组 (我组)' : i === 1 ? '互联网传媒' : i === 2 ? '大健康医药' : `第 ${i + 1} 组`,
      rank: i === 0 ? 6 : i + 1, // Default ranks
      share: i === 0 ? 5.2 : (Math.random() * 5 + 2).toFixed(1) // Default share
    }))
  );

  const handleAnalystChange = (id: number, val: string) => {
    const num = parseInt(val) || 0;
    setAnalysts(prev => prev.map(a => a.id === id ? { ...a, percentile: num } : a));
  };

  const handleGroupChange = (id: number, field: 'rank' | 'share', val: string) => {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, [field]: val } : g));
  };

  const myGroup = groups[0];

  return (
    <div className="pb-32 animate-fade-in relative">
       {/* Header */}
       <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center px-4 py-3 justify-between">
          <button className="p-2 -ml-2 text-gray-800 rounded-full hover:bg-gray-100">
             <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <h2 className="text-lg font-bold text-gray-900">2026Q1团队所内排名</h2>
          <button className="p-2 -mr-2 text-primary rounded-full hover:bg-gray-100">
             <span className="material-symbols-outlined">save</span>
          </button>
        </div>
        <div className="px-4 pb-3">
          <div className="bg-gray-100 p-1 rounded-lg flex text-xs font-bold">
            <button className="flex-1 py-1.5 bg-white shadow-sm rounded-md text-primary text-center">工作量排名分位</button>
            <button className="flex-1 py-1.5 text-gray-500 text-center">收入/派点排名</button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">分析师工作量排名分位</h3>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold">Q1 周期中</span>
        </div>

        {/* List of Analysts */}
        <div className="space-y-3">
            {analysts.map((user) => (
                <div key={user.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${user.color}`}>
                            {user.initial}
                        </div>
                        <div>
                            <div className="text-sm font-bold text-gray-900">{user.name}</div>
                            <div className="text-[10px] text-gray-500 font-medium">{user.role}</div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
                        <label className="text-[10px] text-gray-400 font-bold uppercase">分位数 (%)</label>
                        <div className="relative w-20">
                            <input 
                                type="number" 
                                value={user.percentile} 
                                onChange={(e) => handleAnalystChange(user.id, e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-2 text-center font-bold text-gray-900 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Institute Data Section */}
        <div className="pt-6 border-t border-gray-200">
            <div className="flex justify-between items-end mb-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">全所收入与派点 (13组)</h3>
                <button 
                    onClick={() => setShowGroupModal(true)}
                    className="text-[10px] font-bold text-white bg-gray-900 px-3 py-1.5 rounded-lg flex items-center gap-1 active:scale-95 transition-transform"
                >
                    <span className="material-symbols-outlined text-xs">edit_note</span>
                    录入本季全所数据
                </button>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold">当前我组排名</div>
                        <div className="flex items-baseline gap-2">
                             <span className="text-2xl font-black text-gray-900">第 {myGroup.rank} 名</span>
                             <span className="text-[10px] text-gray-500 font-bold bg-gray-100 px-1.5 py-0.5 rounded">派点 {myGroup.share}%</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            <span className="text-[10px] text-gray-500">我组趋势</span>
                        </div>
                    </div>
                </div>

                <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorRank" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#135bec" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#135bec" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#135bec' }} />
                            <Area type="monotone" dataKey="rank" stroke="#135bec" strokeWidth={3} fillOpacity={1} fill="url(#colorRank)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Simplified Table based on Groups Data */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase">排名</th>
                        <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase">团队名称</th>
                        <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase text-right">派点占比</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {/* Just showing top 3 and mine as per typical dashboard logic, effectively sorted */}
                    {[...groups].sort((a, b) => Number(a.rank) - Number(b.rank)).slice(0, 5).map((group) => (
                         <tr key={group.id} className={group.id === 1 ? "bg-primary/5" : ""}>
                            <td className={`px-4 py-2.5 text-xs font-bold ${group.id === 1 ? "text-primary" : "text-gray-600"}`}>{group.rank}</td>
                            <td className={`px-4 py-2.5 text-xs font-bold ${group.id === 1 ? "text-gray-900" : "text-gray-600"}`}>{group.name}</td>
                            <td className={`px-4 py-2.5 text-xs font-bold ${group.id === 1 ? "text-gray-900" : "text-gray-600"} text-right`}>{group.share}%</td>
                        </tr>
                    ))}
                </tbody>
             </table>
        </div>
      </div>

      {/* 13-Group Data Entry Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in">
           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowGroupModal(false)}></div>
           <div className="bg-background w-full max-w-md h-[85vh] sm:h-[80vh] sm:rounded-3xl rounded-t-3xl relative z-10 flex flex-col shadow-2xl transform transition-transform duration-300">
              
              {/* Modal Header */}
              <div className="px-5 py-4 bg-white border-b border-gray-200 rounded-t-3xl flex justify-between items-center sticky top-0 z-20">
                  <div>
                      <h3 className="text-lg font-black text-gray-900">全所数据录入</h3>
                      <p className="text-xs text-gray-500 font-bold">请录入13个组的排名与派点数据</p>
                  </div>
                  <button onClick={() => setShowGroupModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-gray-600">close</span>
                  </button>
              </div>

              {/* Scrollable List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                  {groups.map((group) => (
                      <div key={group.id} className={`p-4 rounded-xl border ${group.id === 1 ? 'bg-white border-primary/30 shadow-sm ring-1 ring-primary/10' : 'bg-white border-gray-200'}`}>
                          <div className="flex justify-between items-center mb-3">
                              <span className={`text-sm font-bold ${group.id === 1 ? 'text-primary' : 'text-gray-700'}`}>
                                  {group.name}
                              </span>
                              {group.id === 1 && <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full font-bold">我组</span>}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-400">收入排名</label>
                                  <div className="relative">
                                      <input 
                                          type="number" 
                                          value={group.rank}
                                          onChange={(e) => handleGroupChange(group.id, 'rank', e.target.value)}
                                          className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary/20 outline-none"
                                      />
                                      <span className="absolute right-3 top-2 text-xs text-gray-400 font-bold">名</span>
                                  </div>
                              </div>
                              <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-400">派点占比</label>
                                  <div className="relative">
                                      <input 
                                          type="number" 
                                          value={group.share}
                                          onChange={(e) => handleGroupChange(group.id, 'share', e.target.value)}
                                          className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-primary/20 outline-none"
                                      />
                                      <span className="absolute right-3 top-2 text-xs text-gray-400 font-bold">%</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>

              {/* Footer Action */}
              <div className="p-4 bg-white border-t border-gray-200 safe-pb">
                  <button 
                    onClick={() => setShowGroupModal(false)}
                    className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/25 active:scale-[0.98] transition-transform"
                  >
                      保存数据
                  </button>
              </div>

           </div>
        </div>
      )}
    </div>
  );
};

export default RankingsView;