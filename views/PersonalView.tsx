import React, { useState, useEffect } from 'react';
import { Analyst, Record as AppRecord } from '../types';

const PersonalView: React.FC = () => {
  // Fetch and aggregate data from API
  const [records, setRecords] = useState<AppRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysts, setAnalysts] = useState<any[]>([]);
  const [activeModal, setActiveModal] = useState<{ id: string, name: string, type: 'calls' | 'reports' | 'roadshows' } | null>(null);

  const getTheoreticalProgress = () => {
    const now = new Date();
    // For Q1: Jan 1 to Mar 31
    const start = new Date(2026, 0, 1); // Month is 0-indexed, so 0 is January
    const end = new Date(2026, 2, 31); // Month is 0-indexed, so 2 is March

    // If current date is outside Q1, handle accordingly
    if (now < start) return 0;
    if (now > end) return 100;

    const total = end.getTime() - start.getTime();
    const passed = now.getTime() - start.getTime();
    return Math.round((passed / total) * 100);
  };

  const theoreticalProgress = getTheoreticalProgress();

  useEffect(() => {
    const fetchAndProcessRecords = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/records');
        if (res.ok) {
          const records: AppRecord[] = await res.json();

          // Group by member
          const memberMap: any = {
            '沛东': { id: '1', name: '沛东', avatarColor: 'bg-blue-100 text-blue-700', roadshows: { current: 0, target: 15 }, calls: { current: 0, target: 3 }, reports: { current: 0, target: 2 }, services: { current: 0, target: 20 }, internal: { current: 0, target: 6 }, items: { roadshow: [], call: [], report: [], service: [], internal: [] } },
            '徐亚': { id: '2', name: '徐亚', avatarColor: 'bg-indigo-100 text-indigo-700', roadshows: { current: 0, target: 15 }, calls: { current: 0, target: 3 }, reports: { current: 0, target: 2 }, services: { current: 0, target: 20 }, internal: { current: 0, target: 6 }, items: { roadshow: [], call: [], report: [], service: [], internal: [] } },
            '晓希': { id: '3', name: '晓希', avatarColor: 'bg-red-50 text-red-600', roadshows: { current: 0, target: 15 }, calls: { current: 0, target: 3 }, reports: { current: 0, target: 2 }, services: { current: 0, target: 20 }, internal: { current: 0, target: 6 }, items: { roadshow: [], call: [], report: [], service: [], internal: [] } },
            '天然': { id: '4', name: '天然', avatarColor: 'bg-orange-50 text-orange-600', roadshows: { current: 0, target: 15 }, calls: { current: 0, target: 3 }, reports: { current: 0, target: 2 }, services: { current: 0, target: 20 }, internal: { current: 0, target: 6 }, items: { roadshow: [], call: [], report: [], service: [], internal: [] } }
          };

          records.forEach(r => {
            const m = memberMap[r.member];
            if (m) {
              if (r.type === 'roadshow') {
                m.roadshows.current++;
                m.items.roadshow.push(r);
              } else if (r.type === 'call') {
                m.calls.current++;
                m.items.call.push(r);
              } else if (r.type === 'report') {
                m.reports.current++;
                m.items.report.push(r);
              } else if (r.type === 'service') {
                m.services.current++;
                m.items.service.push(r);
              } else if (r.type === 'internal') {
                m.internal.current++;
                m.items.internal.push(r);
              }
            }
          });

          const processed = Object.values(memberMap).map((a: any) => {
            const roadshowRate = a.roadshows.target > 0 ? a.roadshows.current / a.roadshows.target : 0;
            const callRate = a.calls.target > 0 ? a.calls.current / a.calls.target : 0;
            const reportRate = a.reports.target > 0 ? a.reports.current / a.reports.target : 0;
            const serviceRate = a.services.target > 0 ? a.services.current / a.services.target : 0;
            // Progress is average of the 4 core metrics as requested
            const progress = Math.round(((roadshowRate + callRate + reportRate + serviceRate) / 4) * 100);
            return { ...a, role: '策略研究', progress };
          });

          setAnalysts(processed);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchAndProcessRecords();
    const interval = setInterval(fetchAndProcessRecords, 5000); // Sync every 5s
    return () => clearInterval(interval);
  }, []);

  // Calculate Team Average
  const teamAverage = analysts.length > 0 ? Math.round(analysts.reduce((acc, curr) => acc + curr.progress, 0) / analysts.length) : 0;
  const minProgress = analysts.length > 0 ? Math.min(...analysts.map(a => a.progress)) : 0;

  const renderModalContent = () => {
    if (!activeModal) return null;

    const analyst = analysts.find(a => a.id === activeModal.id);
    if (!analyst) return null;

    let items: any[] = [];
    let title = "";
    let icon = "";
    let colorClass = "";

    if (activeModal.type === 'calls') {
      items = analyst.items.call;
      title = "电话会议记录";
      icon = "call";
      colorClass = "text-emerald-600 bg-emerald-50";
    } else if (activeModal.type === 'reports') {
      items = analyst.items.report;
      title = "研究报告记录";
      icon = "description";
      colorClass = "text-blue-600 bg-blue-50";
    } else if (activeModal.type === 'services') {
      items = analyst.items.service;
      title = "高频输出记录";
      icon = "diversity_3";
      colorClass = "text-orange-600 bg-orange-50";
    } else if (activeModal.type === 'internal') {
      items = analyst.items.internal;
      title = "对内服务记录";
      icon = "handshake";
      colorClass = "text-pink-600 bg-pink-50";
    } else {
      items = analyst.items.roadshow;
      title = "路演记录";
      icon = "trending_up";
      colorClass = "text-primary bg-primary/10";
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2 border-b border-gray-100 pb-4">
          <div className={`w - 10 h - 10 rounded - full flex items - center justify - center ${colorClass} `}>
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{analyst.name} - {title}</h3>
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
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-sm font-bold text-gray-800 leading-tight">{item.topic || item.institution}</div>
                    <div className="flex gap-1 shrink-0">
                      {(item.type === 'service') && (
                        <span className={`text - [9px] font - bold px - 1.5 py - 0.5 rounded ${item.serviceType === 'review' ? 'bg-emerald-50 text-emerald-600' : (item.serviceType === 'segment' ? 'bg-pink-50 text-pink-600' : 'bg-cyan-50 text-cyan-600')} `}>
                          {item.serviceType === 'review' ? '点评' : (item.serviceType === 'segment' ? '段子' : '一图')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-100">
                      {item.date}
                    </span>
                    {item.institution && (
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">
                        {item.institution}
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
          from { transform: translateY(100 %); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
}
@keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
}
`}</style>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-4 h-12 flex items-center justify-between border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <span className="material-symbols-outlined text-[18px]">analytics</span>
          </div>
          <div>
            <h1 className="text-base font-black text-slate-900 leading-tight">2026Q1 个人数据</h1>
          </div>
        </div>
        <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600">
          <span className="material-symbols-outlined text-[18px]">tune</span>
        </button>
      </div>

      <div className="px-3 py-2 space-y-3">
        {/* Total Progress Banner */}
        <div className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 shadow-sm flex items-center gap-3">
          <div className="flex items-center gap-2 min-w-0 whitespace-nowrap">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">团队总进度</span>
            <span className="text-sm font-black text-slate-800">{teamAverage}%</span>
          </div>
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_10px_rgba(37,99,235,0.3)] transition-all duration-1000" style={{ width: `${teamAverage}% ` }}></div>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-3">
          {analysts.map((analyst) => {
            // Warning condition: Progress matches the minimum in the group
            const isWarning = analyst.progress === minProgress && analyst.progress < 50;

            const accentColor = isWarning ? 'bg-red-500' : 'bg-blue-600';
            const textColor = isWarning ? 'text-red-600' : 'text-blue-700';
            const barColor = isWarning ? 'bg-red-500' : 'bg-blue-600';
            const ringClass = isWarning ? 'ring-2 ring-red-100' : '';

            return (
              <div key={analyst.id} className={`bg-white rounded-xl relative overflow-hidden border border-slate-200 shadow-sm flex flex-col min-h-[120px] ${ringClass}`}>
                <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${accentColor}`}></div>
                <div className="flex flex-col h-full p-3 pl-5 relative z-10">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <div className={`relative flex items-center justify-center rounded-full border-[3px] border-white shadow-sm size-10 text-base font-black ${analyst.avatarColor}`}>
                        {analyst.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 leading-none mb-0.5">{analyst.name}</h3>
                        <div className="flex items-center gap-1">
                          {isWarning ? (
                            <div className="flex items-center gap-1 text-[10px] text-red-500 font-bold bg-red-50 px-1 py-0.5 rounded">
                              <span className="material-symbols-outlined text-[12px]">warning</span>
                              <span>滞后</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                              <span>{analyst.role}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end justify-center">
                      <div className={`text-2xl font-black tabular-nums tracking-tight leading-none ${analyst.progress < theoreticalProgress - 10 ? 'text-red-600' : 'text-slate-900'}`}>
                        {analyst.progress}<span className={`text-xs font-bold ml-0.5 ${analyst.progress < theoreticalProgress - 10 ? 'text-red-300' : 'text-slate-400'}`}>%</span>
                      </div>
                      <div className="flex flex-col items-end mt-0.5">
                        <span className="text-[9px] text-slate-400 font-bold whitespace-nowrap">理论进度: {theoreticalProgress}%</span>
                        {analyst.progress < theoreticalProgress - 20 ? (
                          <span className="text-[9px] text-red-600 font-black animate-pulse bg-red-50 px-1 rounded mt-0.5">严重落后/节奏严重不平滑</span>
                        ) : analyst.progress < theoreticalProgress - 10 ? (
                          <span className="text-[9px] text-orange-600 font-bold bg-orange-50 px-1 rounded mt-0.5">已经落后/节奏不平滑</span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-10 gap-2 mt-2 items-end">
                    {/* Roadshow (2/10) */}
                    <div
                      className="col-span-2 flex flex-col gap-1 cursor-pointer active:scale-[0.98] transition-transform"
                      onClick={() => setActiveModal({ id: analyst.id, name: analyst.name, type: 'roadshows' })}
                    >
                      <div className="flex justify-between items-end mb-0.5">
                        <span className="text-[10px] text-slate-500 font-semibold uppercase">路演</span>
                        <span className={`text - xs font - black ${textColor} `}>{analyst.roadshows.current}<span className="text-slate-300 font-medium mx-0.5">/</span>{analyst.roadshows.target}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-lg overflow-hidden">
                        <div className={`h - full rounded - lg ${barColor} `} style={{ width: `${Math.min((analyst.roadshows.current / analyst.roadshows.target) * 100, 100)}% ` }}></div>
                      </div>
                    </div>

                    {/* Report (2/10) */}
                    <div
                      className="col-span-2 flex flex-col items-center justify-end pb-0.5 cursor-pointer active:scale-95 transition-transform group"
                      onClick={() => setActiveModal({ id: analyst.id, name: analyst.name, type: 'reports' })}
                    >
                      <span className="text-[10px] text-slate-400 font-bold uppercase mb-0.5 group-hover:text-blue-500 transition-colors">研报</span>
                      <div className={`flex items-center justify-center gap-1 rounded-md px-1 py-0.5 w-full transition-colors border ${analyst.reports.current >= analyst.reports.target ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                        <span className={`text-xs font-bold ${analyst.reports.current >= analyst.reports.target ? 'text-emerald-700' : 'text-slate-700'}`}>{analyst.reports.current}/{analyst.reports.target}</span>
                      </div>
                    </div>

                    {/* Call (2/10) */}
                    <div
                      className="col-span-2 flex flex-col items-center justify-end pb-0.5 cursor-pointer active:scale-95 transition-transform group"
                      onClick={() => setActiveModal({ id: analyst.id, name: analyst.name, type: 'calls' })}
                    >
                      <span className="text-[10px] text-slate-400 font-bold uppercase mb-0.5 group-hover:text-emerald-500 transition-colors">电话</span>
                      <div className={`flex items-center justify-center gap-1 rounded-md px-1 py-0.5 w-full transition-colors border ${analyst.calls.current >= analyst.calls.target ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                        <span className={`text-xs font-bold ${analyst.calls.current >= analyst.calls.target ? 'text-emerald-700' : 'text-slate-700'}`}>{analyst.calls.current}/{analyst.calls.target}</span>
                      </div>
                    </div>

                    {/* Service (2/10) */}
                    <div
                      className="col-span-2 flex flex-col items-center justify-end pb-0.5 cursor-pointer active:scale-95 transition-transform group"
                      onClick={() => setActiveModal({ id: analyst.id, name: analyst.name, type: 'services' })}
                    >
                      <span className="text-[10px] text-slate-400 font-bold uppercase mb-0.5 group-hover:text-orange-500 transition-colors">高频</span>
                      <div className={`flex items-center justify-center gap-1 rounded-md px-1 py-0.5 w-full transition-colors border ${analyst.services.current >= analyst.services.target ? 'bg-orange-50 border-orange-100' : 'bg-slate-50 border-slate-100'}`}>
                        <span className={`text-xs font-bold ${analyst.services.current >= analyst.services.target ? 'text-orange-700' : 'text-slate-700'}`}>{analyst.services.current}/{analyst.services.target}</span>
                      </div>
                    </div>

                    {/* Internal (2/10) */}
                    <div
                      className="col-span-2 flex flex-col items-center justify-end pb-0.5 cursor-pointer active:scale-95 transition-transform group"
                      onClick={() => setActiveModal({ id: analyst.id, name: analyst.name, type: 'internal' })}
                    >
                      <span className="text-[10px] text-slate-400 font-bold uppercase mb-0.5 group-hover:text-pink-500 transition-colors">对内</span>
                      <div className={`flex items-center justify-center gap-1 rounded-md px-1 py-0.5 w-full transition-colors border ${analyst.internal.current >= analyst.internal.target ? 'bg-pink-50 border-pink-100' : 'bg-slate-50 border-slate-100'}`}>
                        <span className={`text-xs font-bold ${analyst.internal.current >= analyst.internal.target ? 'text-pink-700' : 'text-slate-700'}`}>{analyst.internal.current}/{analyst.internal.target}</span>
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