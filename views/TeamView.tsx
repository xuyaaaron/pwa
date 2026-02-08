import React, { useState } from 'react';
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
  const [activeModal, setActiveModal] = useState<null | 'deep' | 'topic' | 'conference'>(null);

  const renderModalContent = () => {
    if (!activeModal) return null;

    let title = "";
    let items: any[] = [];
    let icon = "";
    let colorClass = "";

    if (activeModal === 'deep') {
      title = "季度深度报告明细";
      items = mockDetails.deep;
      icon = "description";
      colorClass = "text-primary";
    } else if (activeModal === 'topic') {
      title = "季度专题报告明细";
      items = mockDetails.topic;
      icon = "topic";
      colorClass = "text-blue-400";
    } else if (activeModal === 'conference') {
      title = "联合电话会议记录";
      items = mockDetails.conference;
      icon = "call";
      colorClass = "text-emerald-500";
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
           {items.map((item, idx) => (
             <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="mt-0.5">
                  {item.status === 'completed' ? (
                    <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
                  ) : (
                    <span className="material-symbols-outlined text-gray-300 text-lg">radio_button_unchecked</span>
                  )}
                </div>
                <div className="flex-1">
                   <div className="text-sm font-bold text-gray-800 leading-tight mb-1">{item.title}</div>
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-medium text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-100">
                        {item.date}
                      </span>
                      {item.author && (
                        <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                          {item.author}
                        </span>
                      )}
                   </div>
                </div>
             </div>
           ))}
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
    <div className="pb-32 animate-fade-in h-full bg-background relative">
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
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md px-4 pt-4 pb-2 flex justify-between items-center">
        <div className="relative group">
            <button className="flex items-center gap-1.5 bg-white pl-3 pr-2 py-1.5 rounded-full shadow-sm border border-gray-200">
                <span className="text-xs font-bold text-primary">2026 Q1</span>
                <span className="material-symbols-outlined text-sm text-gray-400">expand_more</span>
            </button>
        </div>
        <h2 className="text-base font-bold text-gray-900">团队整体数据</h2>
        <button className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-200">
             <span className="material-symbols-outlined text-gray-500 text-[20px]">notifications</span>
        </button>
      </div>

      <div className="px-4 py-2 space-y-4">
        {/* Gauge Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-white">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    季度路演总进度
                </h3>
                <div className="bg-primary/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[14px]">trending_up</span>
                    <span className="text-[10px] font-bold text-primary">进行中</span>
                </div>
            </div>
            
            <div className="flex flex-col items-center justify-center h-[120px] relative">
                <ResponsiveContainer width={200} height={100}>
                    <PieChart>
                        <Pie
                            data={gaugeData}
                            cx="50%"
                            cy="100%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={60}
                            outerRadius={80}
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
                    <div className="text-3xl font-black text-gray-900 tracking-tight">72<span className="text-sm text-gray-400 font-medium ml-0.5">%</span></div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 bg-gray-50 rounded-2xl p-4">
                <div className="text-center">
                    <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase">已完成</p>
                    <p className="text-lg font-bold text-gray-900">72</p>
                </div>
                <div className="text-center relative border-x border-gray-200">
                    <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase">目标</p>
                    <p className="text-lg font-bold text-gray-900">100</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase">待执行</p>
                    <p className="text-lg font-bold text-primary">28</p>
                </div>
            </div>
        </div>

        {/* Report Output Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-white">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    季度报告总输出
                </h3>
                <span className="text-xs font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-full">5 <span className="text-gray-400 text-[10px] font-medium">/ 8</span></span>
            </div>

            <div className="space-y-6">
                <div 
                  onClick={() => setActiveModal('deep')}
                  className="group cursor-pointer rounded-xl p-2 -m-2 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex justify-between items-center mb-2.5">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400 text-[18px] group-hover:text-primary transition-colors">description</span>
                            <span className="text-sm font-bold text-gray-700">深度报告 <span className="text-[10px] text-gray-400 font-normal ml-1">(点击查看)</span></span>
                        </div>
                        <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded">75%</span>
                    </div>
                    <div className="flex gap-1.5 h-2">
                         <div className="flex-1 rounded-full bg-primary"></div>
                         <div className="flex-1 rounded-full bg-primary"></div>
                         <div className="flex-1 rounded-full bg-primary"></div>
                         <div className="flex-1 rounded-full bg-gray-100"></div>
                    </div>
                     <div className="flex justify-between mt-1.5 px-1">
                        <span className="text-[10px] text-gray-400 font-medium">已完成 3</span>
                        <span className="text-[10px] text-gray-400 font-medium">目标 4</span>
                    </div>
                </div>
                 <div className="h-px bg-gray-50 w-full"></div>
                <div 
                  onClick={() => setActiveModal('topic')}
                  className="group cursor-pointer rounded-xl p-2 -m-2 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex justify-between items-center mb-2.5">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400 text-[18px] group-hover:text-blue-400 transition-colors">topic</span>
                            <span className="text-sm font-bold text-gray-700">专题报告 <span className="text-[10px] text-gray-400 font-normal ml-1">(点击查看)</span></span>
                        </div>
                        <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">50%</span>
                    </div>
                    <div className="flex gap-1.5 h-2">
                         <div className="flex-1 rounded-full bg-blue-400"></div>
                         <div className="flex-1 rounded-full bg-blue-400"></div>
                         <div className="flex-1 rounded-full bg-gray-100"></div>
                         <div className="flex-1 rounded-full bg-gray-100"></div>
                    </div>
                     <div className="flex justify-between mt-1.5 px-1">
                        <span className="text-[10px] text-gray-400 font-medium">已完成 2</span>
                        <span className="text-[10px] text-gray-400 font-medium">目标 4</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Conference Checklist */}
        <div 
          onClick={() => setActiveModal('conference')}
          className="bg-white rounded-3xl p-5 shadow-sm border border-white cursor-pointer active:scale-[0.99] transition-transform hover:shadow-md"
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    联合电话会议
                </h3>
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">进度</span>
                    <span className="text-xs font-black text-gray-900">7/12</span>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
                 {[...Array(7)].map((_, i) => (
                     <div key={i} className="aspect-square rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                         <span className="material-symbols-outlined text-emerald-500 text-xl font-bold">check_circle</span>
                     </div>
                 ))}
                 <div className="aspect-square rounded-xl bg-white border-2 border-dashed border-primary/30 flex items-center justify-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
                     <span className="material-symbols-outlined text-primary text-xl relative z-10">pending</span>
                 </div>
                 {[9, 10, 11, 12].map((num) => (
                      <div key={num} className="aspect-square rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                          <span className="text-xs text-gray-300 font-bold">{num < 10 ? `0${num}` : num}</span>
                      </div>
                 ))}
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-4 font-medium flex items-center justify-center gap-1">
               <span className="material-symbols-outlined text-xs">touch_app</span> 点击查看会议列表
            </p>
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

export default TeamView;