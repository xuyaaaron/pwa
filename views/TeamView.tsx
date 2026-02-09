import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const gaugeData = [
  { name: 'Completed', value: 72 },
  { name: 'Remaining', value: 28 },
];
const GAUGE_COLORS = ['#135bec', '#f1f5f9'];

// Mock Data for Details
const mockDetails = {
  deep: [
    { title: "2026年银行业资产质量深度复盘：拐点已至", date: "01/15", status: "completed", author: "沛东" },
    { title: "AI大模型商业化落地路径全景图", date: "02/03", status: "completed", author: "徐亚" },
    { title: "固态电池产业链深度梳理与投资机会", date: "02/20", status: "completed", author: "晓希" },
    { title: "人形机器人核心零部件拆解", date: "计划中", status: "pending", author: "徐亚" },
  ],
  topic: [
    { title: "2026春节消费数据超预期专题点评", date: "02/18", status: "completed", author: "天然" },
    { title: "美联储降息预期下的全球资产配置", date: "01/10", status: "completed", author: "沛东" },
    { title: "低空经济产业政策专题解读", date: "计划中", status: "pending", author: "天然" },
    { title: "合成生物学行业发展现状", date: "计划中", status: "pending", author: "晓希" },
  ],
  conference: [
    { title: "春季策略联合路演 - 上海站", date: "01/05", status: "completed" },
    { title: "高端制造产业链闭门调研", date: "01/12", status: "completed" },
    { title: "金融科技创新与监管闭门会", date: "01/20", status: "completed" },
    { title: "创新药出海商业化趋势电话会", date: "02/08", status: "completed" },
    { title: "1月宏观经济数据深度解读", date: "02/15", status: "completed" },
    { title: "地产链复苏趋势专家研讨", date: "02/22", status: "completed" },
    { title: "半导体库存周期反转交流会", date: "02/28", status: "completed" },
  ]
};

const TeamView: React.FC = () => {
  // Data State
  const [activeModal, setActiveModal] = useState<null | 'deep' | 'topic' | 'conference' | 'service' | 'internal'>(null);
  const [reportCounts, setReportCounts] = useState({ deep: { done: 0, target: 4 }, topic: { done: 0, target: 4 } });
  const [conferenceCount, setConferenceCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [internalCount, setInternalCount] = useState(0);
  const [items, setItems] = useState<{ deep: any[], topic: any[], conference: any[], service: any[], internal: any[] }>({ deep: [], topic: [], conference: [], service: [], internal: [] });
  // Gauge State
  const [roadshowTotal, setRoadshowTotal] = useState(0);

  // Quarter State
  const [currentQuarter, setCurrentQuarter] = useState('2026 Q1');
  const [showQuarterMenu, setShowQuarterMenu] = useState(false);

  // Hardcoded Targets
  const TOTAL_TARGET = 60;

  const getTheoreticalProgress = () => {
    const now = new Date();
    // For Q1: Jan 1 to Mar 31
    const start = new Date(2026, 0, 1);
    const end = new Date(2026, 2, 31);
    if (now < start) return 0;
    if (now > end) return 100;
    const total = end.getTime() - start.getTime();
    const passed = now.getTime() - start.getTime();
    return Math.round((passed / total) * 100);
  };

  const theoreticalProgress = getTheoreticalProgress();

  const [teamProgress, setTeamProgress] = useState(0);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await fetch('/api/records');
        if (res.ok) {
          const records: any[] = await res.json();

          // Process Records
          let deep: any[] = [];
          let topic: any[] = [];
          let conf: any[] = [];
          let serv: any[] = [];
          let intl: any[] = [];
          let roadshowCount = 0;

          records.forEach(r => {
            if (r.type === 'report') {
              if (r.reportType === 'deep' || (r.topic && r.topic.includes('深度'))) {
                deep.push(r);
              } else {
                topic.push(r);
              }
            } else if (r.type === 'call') {
              conf.push(r);
            } else if (r.type === 'service') {
              serv.push(r);
            } else if (r.type === 'internal') {
              intl.push(r);
            } else if (r.type === 'roadshow') {
              roadshowCount++;
            }
          });

          setItems({ deep, topic, conference: conf, service: serv, internal: intl });
          setReportCounts({
            deep: { done: deep.length, target: 4 },
            topic: { done: topic.length, target: 4 }
          });
          setConferenceCount(conf.length);
          setServiceCount(serv.length);
          setInternalCount(intl.length);
          setRoadshowTotal(roadshowCount);

          // Calculate Team Average Progress (Average of 4 core metrics for all 4 members)
          const members = ['沛东', '徐亚', '晓希', '天然'];
          const memberMetrics = members.map(m => {
            const mRoadshows = records.filter(r => r.member === m && r.type === 'roadshow').length;
            const mCalls = records.filter(r => r.member === m && r.type === 'call').length;
            const mReports = records.filter(r => r.member === m && r.type === 'report').length;
            const mServices = records.filter(r => r.member === m && r.type === 'service').length;

            const roadshowRate = Math.min(mRoadshows / 15, 1);
            const callRate = Math.min(mCalls / 3, 1);
            const reportRate = Math.min(mReports / 2, 1);
            const serviceRate = Math.min(mServices / 20, 1);

            return (roadshowRate + callRate + reportRate + serviceRate) / 4;
          });

          const avgProgress = Math.round((memberMetrics.reduce((a, b) => a + b, 0) / 4) * 100);
          setTeamProgress(avgProgress);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchRecords();
    const interval = setInterval(fetchRecords, 5000); // Sync
    return () => clearInterval(interval);
  }, []);

  const gaugeData = [
    { name: 'Completed', value: Math.min(roadshowTotal, TOTAL_TARGET) },
    { name: 'Remaining', value: Math.max(0, TOTAL_TARGET - roadshowTotal) },
  ];

  const renderModalContent = () => {
    if (!activeModal) return null;

    let title = "";
    let list: any[] = [];
    let icon = "";
    let colorClass = "";

    if (activeModal === 'deep') {
      title = "季度深度报告";
      list = items.deep;
      icon = "description";
      colorClass = "text-primary";
    } else if (activeModal === 'topic') {
      title = "季度专题报告";
      list = items.topic;
      icon = "topic";
      colorClass = "text-blue-400";
    } else if (activeModal === 'conference') {
      title = "联合电话会议";
      list = items.conference;
      icon = "call";
      colorClass = "text-emerald-500";
    } else if (activeModal === 'service') {
      title = "高频输出记录";
      list = items.service;
      icon = "diversity_3";
      colorClass = "text-orange-500";
    } else if (activeModal === 'internal') {
      title = "对内服务记录";
      list = items.internal;
      icon = "handshake";
      colorClass = "text-pink-500";
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2 border-b border-gray-100 pb-4">
          <div className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center ${colorClass}`}>
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500 font-medium">2026 Q1 执行清单</p>
          </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto no-scrollbar space-y-3">
          {list.length > 0 ? list.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="mt-0.5">
                <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-gray-800 leading-tight mb-1">{item.topic || item.institution}</div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-medium text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-100">
                    {item.date}
                  </span>
                  {item.member && (
                    <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                      {item.member}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-400">
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
    <div className="animate-fade-in min-h-full bg-background relative flex flex-col">
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
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md px-4 py-2 flex justify-between items-center shrink-0">
        <div className="relative">
          <button
            onClick={() => setShowQuarterMenu(!showQuarterMenu)}
            className="flex items-center gap-1.5 bg-white pl-3 pr-2 py-1.5 rounded-full shadow-sm border border-gray-200 active:scale-95 transition-transform"
          >
            <span className="text-xs font-bold text-gray-900">{currentQuarter}</span>
            <span className={`material-symbols-outlined text-sm text-gray-500 transition-transform ${showQuarterMenu ? 'rotate-180' : ''}`}>expand_more</span>
          </button>

          {/* Quarter Dropdown */}
          {showQuarterMenu && (
            <div className="absolute top-full left-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-50 animate-in fade-in zoom-in-95 duration-200">
              {['2026 Q1', '2026 Q2', '2026 Q3', '2026 Q4'].map(q => (
                <button
                  key={q}
                  onClick={() => { setCurrentQuarter(q); setShowQuarterMenu(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold ${currentQuarter === q ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
        <h2 className="text-base font-bold text-gray-900">团队看板</h2>
        <button className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-200">
          <span className="material-symbols-outlined text-gray-500 text-[20px]">notifications</span>
        </button>
      </div>

      <div className="px-3 pb-2 space-y-3 flex-1">
        {/* Team Overall Progress Banner */}
        <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">团队核心指标总进度</span>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl font-black tabular-nums leading-none ${teamProgress < theoreticalProgress - 10 ? 'text-red-600' : 'text-slate-900'}`}>
                  {teamProgress}%
                </span>
                <span className="text-[10px] text-slate-400 font-bold">/ 理论进度 {theoreticalProgress}%</span>
              </div>
            </div>
            <div className="text-right">
              {teamProgress < theoreticalProgress - 20 ? (
                <span className="text-[10px] text-red-600 font-black animate-pulse bg-red-50 px-2 py-0.5 rounded-full border border-red-100 italic">严重落后/节奏严重不平滑</span>
              ) : teamProgress < theoreticalProgress - 10 ? (
                <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 italic">已经落后/节奏不平滑</span>
              ) : (
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">运行平稳</span>
              )}
            </div>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${teamProgress < theoreticalProgress - 10 ? 'bg-red-500' : 'bg-blue-600'}`}
              style={{ width: `${teamProgress}%` }}
            ></div>
          </div>
        </div>
        {/* Gauge Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-white">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              季度路演进度
            </h3>
            <div className="bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="text-[10px] font-bold text-primary">目标: {TOTAL_TARGET}场</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center h-[90px] relative mt-1">
            <ResponsiveContainer width={180} height={90}>
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="100%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={55}
                  outerRadius={70}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  {gaugeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GAUGE_COLORS[index % GAUGE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute bottom-0 text-center -mb-2">
              <div className="text-2xl font-black text-gray-900 tracking-tight">{roadshowTotal}<span className="text-[10px] text-gray-400 font-medium ml-0.5">/ {TOTAL_TARGET}</span></div>
            </div>
          </div>

          {/* Legend/Info */}
          <div className="flex justify-center gap-6 mt-3 text-[10px] text-gray-400 font-bold uppercase">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              已完成 {roadshowTotal}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-gray-200"></div>
              待执行 {Math.max(0, TOTAL_TARGET - roadshowTotal)}
            </div>
          </div>
        </div>

        {/* Report Output Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-white">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              季度报告
            </h3>
            <span className="text-[10px] font-black text-gray-900 bg-gray-100 px-2 py-0.5 rounded-full">
              {reportCounts.deep.done + reportCounts.topic.done} <span className="text-gray-400 font-medium">/ 8</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => setActiveModal('deep')}
              className="group cursor-pointer rounded-xl bg-gray-50/50 p-2.5 border border-gray-100 hover:border-primary/20 transition-all"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span className="material-symbols-outlined text-primary text-[16px]">description</span>
                <span className="text-xs font-bold text-gray-700">深度</span>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-xl font-black text-gray-900 leading-none">{reportCounts.deep.done}<span className="text-[10px] text-gray-400 font-medium ml-0.5">/{reportCounts.deep.target}</span></div>
                <div className="h-1.5 w-12 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(reportCounts.deep.done / reportCounts.deep.target) * 100}%` }}></div>
                </div>
              </div>
            </div>

            <div
              onClick={() => setActiveModal('topic')}
              className="group cursor-pointer rounded-xl bg-gray-50/50 p-2.5 border border-gray-100 hover:border-blue-400/20 transition-all"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span className="material-symbols-outlined text-blue-400 text-[16px]">topic</span>
                <span className="text-xs font-bold text-gray-700">专题</span>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-xl font-black text-gray-900 leading-none">{reportCounts.topic.done}<span className="text-[10px] text-gray-400 font-medium ml-0.5">/{reportCounts.topic.target}</span></div>
                <div className="h-1.5 w-12 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full transition-all duration-500" style={{ width: `${(reportCounts.topic.done / reportCounts.topic.target) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Conference + Service + Internal */}
        <div className="flex-1 min-h-0 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
            {/* Conference List */}
            <div
              onClick={() => setActiveModal('conference')}
              className="bg-white rounded-2xl p-4 shadow-sm border border-white cursor-pointer active:scale-[0.99] transition-transform flex flex-col h-full overflow-hidden"
            >
              <div className="flex justify-between items-center mb-3 shrink-0">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  联合会议
                </h3>
                <span className="text-[10px] font-black text-gray-900">{conferenceCount} <span className="text-gray-400 font-medium">/ 12</span></span>
              </div>

              <div className="space-y-2 overflow-y-auto pr-1 flex-1 min-h-0">
                {items.conference.length > 0 ? (
                  items.conference.map((c, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/50 border border-emerald-100/50">
                      <span className="material-symbols-outlined text-emerald-500 text-[16px] shrink-0">check_circle</span>
                      <span className="text-xs font-bold text-gray-700 truncate flex-1">{c.topic}</span>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-300 py-2">
                    <span className="material-symbols-outlined text-2xl mb-1">call</span>
                    <span className="text-[10px]">无会议</span>
                  </div>
                )}
              </div>
            </div>

            {/* Service List */}
            <div
              onClick={() => setActiveModal('service')}
              className="bg-white rounded-2xl p-4 shadow-sm border border-white cursor-pointer active:scale-[0.99] transition-transform flex flex-col h-full overflow-hidden"
            >
              <div className="flex justify-between items-center mb-3 shrink-0">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                  高频输出
                </h3>
                <span className="text-[10px] font-black text-gray-900">{serviceCount} <span className="text-gray-400 font-medium">/ 80</span></span>
              </div>

              <div className="space-y-2 overflow-y-auto pr-1 flex-1 min-h-0">
                {items.service.length > 0 ? (
                  items.service.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-orange-50/50 border border-orange-100/50">
                      <span className="material-symbols-outlined text-orange-400 text-[16px] shrink-0">diversity_3</span>
                      <span className="text-xs font-bold text-gray-700 truncate flex-1">{s.topic}</span>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-300 py-2">
                    <span className="material-symbols-outlined text-2xl mb-1">groups</span>
                    <span className="text-[10px]">无服务</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Internal Service List */}
          <div
            onClick={() => setActiveModal('internal')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-white cursor-pointer active:scale-[0.99] transition-transform flex flex-col flex-1 min-h-0 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-3 shrink-0">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                对内服务
              </h3>
              <span className="text-[10px] font-black text-gray-900">{internalCount} <span className="text-gray-400 font-medium">/ 24</span></span>
            </div>

            <div className="space-y-2 overflow-y-auto pr-1 flex-1 min-h-0">
              {items.internal.length > 0 ? (
                items.internal.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-pink-50/50 border border-pink-100/50">
                    <span className="material-symbols-outlined text-pink-400 text-[16px] shrink-0">handshake</span>
                    <span className="text-xs font-bold text-gray-700 truncate flex-1">{s.topic}</span>
                    {s.member && <span className="text-[10px] text-gray-400 shrink-0">{s.member}</span>}
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 py-2">
                  <span className="material-symbols-outlined text-2xl mb-1">volunteer_activism</span>
                  <span className="text-[10px]">无对内服务</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {
        activeModal && (
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
        )
      }
    </div >
  );
};

export default TeamView;