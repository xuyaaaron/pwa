import React, { useState } from 'react';
import { Analyst } from '../types';

// Raw data source
const rawData = [
  {
    id: '1',
    name: '沛东',
    avatarColor: 'bg-blue-100 text-blue-700',
    roadshows: { current: 18, target: 25 },
    calls: { current: 2, target: 3 },
    reports: { current: 1, target: 2 },
  },
  {
    id: '2',
    name: '徐亚',
    avatarColor: 'bg-indigo-100 text-indigo-700',
    roadshows: { current: 22, target: 25 },
    calls: { current: 3, target: 3 },
    reports: { current: 2, target: 2 },
  },
  {
    id: '3',
    name: '晓希',
    avatarColor: 'bg-red-50 text-red-600',
    roadshows: { current: 12, target: 25 },
    calls: { current: 1, target: 3 },
    reports: { current: 0, target: 2 },
  },
  {
    id: '4',
    name: '天然',
    avatarColor: 'bg-orange-50 text-orange-600',
    roadshows: { current: 20, target: 25 },
    calls: { current: 2, target: 3 },
    reports: { current: 1, target: 2 },
  }
];

// Detailed data for modals
const detailsData: Record<string, { calls: {title: string, date: string}[], reports: {title: string, date: string, type: string}[] }> = {
  '1': {
    calls: [
      { title: "2026年宏观经济展望电话会", date: "01/15" },
      { title: "银行业绩前瞻闭门交流", date: "02/10" }
    ],
    reports: [
      { title: "2026年银行业资产质量深度复盘", date: "01/15", type: "深度" }
    ]
  },
  '2': {
    calls: [
      { title: "AI大模型商业化落地路径会议", date: "01/20" },
      { title: "半导体产业链专家解读会", date: "02/05" },
      { title: "消费电子复苏趋势研讨", date: "02/18" }
    ],
    reports: [
      { title: "AI大模型商业化落地路径全景图", date: "02/03", type: "深度" },
      { title: "人形机器人核心零部件拆解", date: "02/14", type: "深度" }
    ]
  },
  '3': {
    calls: [
       { title: "固态电池技术路线专家会", date: "02/12" }
    ],
    reports: []
  },
  '4': {
    calls: [
       { title: "春节消费数据解读电话会", date: "02/18" },
       { title: "低空经济政策解读会", date: "01/25" }
    ],
    reports: [
       { title: "2026春节消费数据超预期专题点评", date: "02/18", type: "专题" }
    ]
  }
};

const PersonalView: React.FC = () => {
  const [activeModal, setActiveModal] = useState<{id: string, name: string, type: 'calls' | 'reports'} | null>(null);

  // Calculate progress and process data
  const analysts = rawData.map(analyst => {
    const roadshowRate = analyst.roadshows.target > 0 ? analyst.roadshows.current / analyst.roadshows.target : 0;
    const callRate = analyst.calls.target > 0 ? analyst.calls.current / analyst.calls.target : 0;
    const reportRate = analyst.reports.target > 0 ? analyst.reports.current / analyst.reports.target : 0;
    
    // Average of the three rates * 100, rounded
    const progress = Math.round(((roadshowRate + callRate + reportRate) / 3) * 100);

    return {
      ...analyst,
      role: '策略研究',
      progress,
    };
  });

  // Find the lowest progress value to identify who is lagging
  const minProgress = Math.min(...analysts.map(a => a.progress));
  
  // Calculate Team Average for the banner
  const teamAverage = Math.round(analysts.reduce((acc, curr) => acc + curr.progress, 0) / analysts.length);

  const renderModalContent = () => {
      if (!activeModal) return null;
      
      const data = detailsData[activeModal.id];
      const items = activeModal.type === 'calls' ? data?.calls : data?.reports;
      const title = activeModal.type === 'calls' ? '已完成电话会议' : '已发布研究报告';
      const icon = activeModal.type === 'calls' ? 'call' : 'description';
      const colorClass = activeModal.type === 'calls' ? 'text-emerald-600 bg-emerald-50' : 'text-blue-600 bg-blue-50';

      return (
          <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2 border-b border-gray-100 pb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                      <span className="material-symbols-outlined">{icon}</span>
                  </div>
                  <div>
                      <h3 className="text-lg font-bold text-gray-900">{activeModal.name} - {title}</h3>
                      <p className="text-xs text-gray-500 font-medium">2026 Q1 明细清单</p>
                  </div>
              </div>

              <div className="max-h-[50vh] overflow-y-auto no-scrollbar space-y-3">
                  {items && items.length > 0 ? (
                      items.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                              <div className="mt-0.5">
                                  <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
                              </div>
                              <div className="flex-1">
                                  <div className="text-sm font-bold text-gray-800 leading-tight mb-1">{item.title}</div>
                                  <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-medium text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-100">
                                          {item.date}
                                      </span>
                                      {item.type && (
                                          <span className="text-[10px] font-bold text-primary bg-primary/5 px-1.5 py-0.5 rounded">
                                              {item.type}
                                          </span>
                                      )}
                                  </div>
                              </div>
                          </div>
                      ))
                  ) : (
                      <div className="text-center py-8 text-gray-400">
                          <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inbox</span>
                          <p className="text-xs">暂无记录</p>
                      </div>
                  )}
              </div>

              <button 
                  onClick={() => setActiveModal(null)}
                  className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm mt-2 active:scale-95 transition-transform"
              >
                  关闭
              </button>
          </div>
      );
  };

  return (
    <div className="pb-32 animate-fade-in bg-gray-100 min-h-full">
      {/* Animation Styles */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-5 h-16 flex items-center justify-between border-b border-gray-200">
         <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                 <span className="material-symbols-outlined text-[24px]">analytics</span>
             </div>
             <div>
                 <h1 className="text-lg font-black text-slate-900 leading-tight">2026Q1 个人数据</h1>
                 <p className="text-xs text-slate-500 font-semibold mt-0.5">全屏概览模式</p>
             </div>
         </div>
         <button className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600">
             <span className="material-symbols-outlined text-[22px]">tune</span>
         </button>
      </div>

      <div className="px-5 py-4">
        {/* Total Progress Banner */}
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2 min-w-0 whitespace-nowrap">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">团队总进度</span>
                <span className="text-base font-black text-slate-800">{teamAverage}%</span>
            </div>
            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_10px_rgba(37,99,235,0.3)] transition-all duration-1000" style={{ width: `${teamAverage}%` }}></div>
            </div>
        </div>

        {/* Cards */}
        <div className="space-y-4">
            {analysts.map((analyst) => {
                // Warning condition: Progress matches the minimum in the group
                const isWarning = analyst.progress === minProgress;
                
                const accentColor = isWarning ? 'bg-red-500' : 'bg-blue-600';
                const textColor = isWarning ? 'text-red-600' : 'text-blue-700';
                const barColor = isWarning ? 'bg-red-500' : 'bg-blue-600';
                const ringClass = isWarning ? 'ring-2 ring-red-100' : '';

                return (
                    <div key={analyst.id} className={`bg-white rounded-2xl relative overflow-hidden border border-slate-200 shadow-sm flex flex-col min-h-[160px] ${ringClass}`}>
                         <div className={`absolute left-0 top-0 bottom-0 w-[5px] ${accentColor}`}></div>
                         <div className="flex flex-col h-full p-4 pl-6 relative z-10">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-4">
                                    <div className={`relative flex items-center justify-center rounded-full border-[4px] border-white shadow-md size-14 text-xl font-black ${analyst.avatarColor}`}>
                                        {analyst.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 leading-none mb-1">{analyst.name}</h3>
                                        <div className="flex items-center gap-1.5">
                                            {isWarning ? (
                                                <div className="flex items-center gap-1 text-xs text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded">
                                                    <span className="material-symbols-outlined text-[14px]">warning</span>
                                                    <span>进度滞后</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                                                    <span>{analyst.role}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end justify-center">
                                    <div className={`text-3xl font-black tabular-nums tracking-tight leading-none ${isWarning ? 'text-red-600' : 'text-slate-900'}`}>
                                        {analyst.progress}<span className={`text-sm font-bold ml-0.5 ${isWarning ? 'text-red-300' : 'text-slate-400'}`}>%</span>
                                    </div>
                                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 ${isWarning ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-700'}`}>
                                        综合完成率
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-10 gap-4 mt-6 items-end">
                                <div className="col-span-5 flex flex-col gap-1">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-xs text-slate-500 font-semibold uppercase">路演</span>
                                        <span className={`text-sm font-black ${textColor}`}>{analyst.roadshows.current}<span className="text-slate-300 font-medium mx-0.5">/</span>{analyst.roadshows.target}</span>
                                    </div>
                                    <div className="h-3 bg-slate-100 rounded-lg overflow-hidden">
                                        <div className={`h-full rounded-lg ${barColor}`} style={{ width: `${Math.min((analyst.roadshows.current / analyst.roadshows.target) * 100, 100)}%` }}></div>
                                    </div>
                                </div>
                                
                                {/* Interactive Call Section */}
                                <div 
                                    className="col-span-2 flex flex-col items-center justify-end pb-0.5 pl-2 border-l border-slate-100 cursor-pointer active:scale-95 transition-transform group"
                                    onClick={() => setActiveModal({ id: analyst.id, name: analyst.name, type: 'calls' })}
                                >
                                    <span className="text-[10px] text-slate-400 font-bold uppercase mb-1 group-hover:text-emerald-500 transition-colors">电话</span>
                                    <div className={`flex items-center justify-center gap-1 rounded-lg px-1.5 py-1 w-full transition-colors ${analyst.calls.current >= analyst.calls.target ? 'bg-emerald-50 group-hover:bg-emerald-100' : 'bg-slate-50 group-hover:bg-slate-100'}`}>
                                        {analyst.calls.current >= analyst.calls.target ? (
                                           <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>
                                        ) : (
                                           <span className="material-symbols-outlined text-slate-400 text-[18px] group-hover:text-slate-600">call</span>
                                        )}
                                        <span className={`text-sm font-bold ${analyst.calls.current >= analyst.calls.target ? 'text-emerald-700' : 'text-slate-700'}`}>{analyst.calls.current}/{analyst.calls.target}</span>
                                    </div>
                                </div>

                                {/* Interactive Report Section */}
                                <div 
                                    className="col-span-3 flex flex-col items-center justify-end pb-0.5 pl-2 border-l border-slate-100 cursor-pointer active:scale-95 transition-transform group"
                                    onClick={() => setActiveModal({ id: analyst.id, name: analyst.name, type: 'reports' })}
                                >
                                    <span className="text-[10px] text-slate-400 font-bold uppercase mb-1 group-hover:text-blue-500 transition-colors">研报</span>
                                    <div className={`flex items-center justify-center gap-1 rounded-lg px-2 py-1 w-full transition-colors ${analyst.reports.current >= analyst.reports.target ? 'bg-emerald-50 group-hover:bg-emerald-100' : analyst.reports.current > 0 ? 'bg-slate-50 group-hover:bg-slate-100' : 'border border-slate-100 group-hover:bg-slate-50'}`}>
                                        <span className={`material-symbols-outlined text-[18px] ${analyst.reports.current >= analyst.reports.target ? 'text-emerald-500' : analyst.reports.current > 0 ? 'text-blue-500' : 'text-slate-400'}`}>
                                            {analyst.reports.current >= analyst.reports.target ? 'verified' : analyst.reports.current > 0 ? 'description' : 'pending'}
                                        </span>
                                        <span className={`text-sm font-bold ${analyst.reports.current >= analyst.reports.target ? 'text-emerald-700' : analyst.reports.current > 0 ? 'text-slate-700' : 'text-slate-400'}`}>{analyst.reports.current}/{analyst.reports.target}</span>
                                    </div>
                                </div>
                            </div>
                         </div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Modal Overlay */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ animation: 'fadeIn 0.2s ease-out' }}>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
          ></div>
          
          {/* Modal Card */}
          <div 
            className="bg-white w-full max-w-md m-0 sm:m-4 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative z-10 max-h-[85vh] flex flex-col"
            style={{ animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
             <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden"></div>
             {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalView;