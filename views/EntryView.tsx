import React, { useState } from 'react';

const EntryView: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<'roadshow' | 'call' | 'report'>('roadshow');

  return (
    <div className="pb-32 animate-fade-in">
      {/* Header for Entry View */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md px-4 py-3 flex justify-between items-center border-b border-gray-200/50">
        <button className="p-2 -ml-2 text-primary rounded-full hover:bg-gray-100/50">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-gray-900">2026Q1数据录入</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">数据录入 • 工作量追踪</p>
        </div>
        <button className="p-2 -mr-2 text-primary rounded-full hover:bg-gray-100/50">
          <span className="material-symbols-outlined">history</span>
        </button>
      </div>

      {/* Segmented Control */}
      <div className="sticky top-[60px] z-30 px-4 py-3 bg-background/95 backdrop-blur-sm">
        <div className="flex p-1 bg-gray-200/60 rounded-xl">
          {(['roadshow', 'call', 'report'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setActiveSegment(type)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                activeSegment === type
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {type === 'roadshow' ? '路演' : type === 'call' ? '电话会' : '报告'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Form Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">录入详情</h3>
            <span className="text-xs font-bold text-primary">2026 Q1</span>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 ml-1">成员</label>
                <div className="bg-gray-50 rounded-xl px-3 py-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-800">沛东 (PD)</span>
                  <span className="material-symbols-outlined text-gray-400 text-lg">expand_more</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 ml-1">记录日期</label>
                <div className="bg-gray-50 rounded-xl px-3 py-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-800">2026-02-14</span>
                  <span className="material-symbols-outlined text-gray-400 text-lg">calendar_today</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">Institution (机构名称/代码)</label>
                <input 
                  type="text" 
                  placeholder="输入证券公司、公募或上市公司代码..."
                  className="w-full bg-gray-50 border-none rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-gray-300 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">Topic/Report Title (主题/标题)</label>
                <input 
                  type="text" 
                  placeholder="输入路演主题或报告标题..."
                  className="w-full bg-gray-50 border-none rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-gray-300 transition-all"
                />
              </div>
            </div>

            <button className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/25 flex items-center justify-center gap-2 active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-xl">save_as</span>
              确认提交录入
            </button>
          </div>
        </div>

        {/* Recent Records */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">最近录入记录</h3>
            <button className="text-[10px] text-primary font-bold flex items-center">
              查看全部 <span className="material-symbols-outlined text-xs">chevron_right</span>
            </button>
          </div>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {['沛东', '徐亚', '晓希', '天然'].map((name, i) => (
              <button 
                key={name}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${i === 0 ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white text-gray-500 border border-gray-100'}`}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="space-y-2">
             {[
               { title: '中信证券自营部', date: '2026-02-12', type: 'apartment', color: 'text-blue-600', bg: 'bg-blue-50' },
               { title: '2026Q1行业趋势展望报告', date: '2026-02-10', type: 'description', color: 'text-purple-600', bg: 'bg-purple-50' }
             ].map((item, idx) => (
               <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
                     <span className="material-symbols-outlined text-xl">{item.type}</span>
                   </div>
                   <div>
                     <h4 className="font-bold text-sm text-gray-800">{item.title}</h4>
                     <p className="text-[10px] text-gray-400 mt-0.5">沛东 • {item.date}</p>
                   </div>
                 </div>
                 <button className="text-gray-300 hover:text-gray-500">
                   <span className="material-symbols-outlined">edit_square</span>
                 </button>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryView;