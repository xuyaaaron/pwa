import React, { useState, useEffect } from 'react';
import { Record } from '../types';

const MEMBER_OPTIONS = [
  { label: '沛东 (PD)', value: '沛东' },
  { label: '徐亚 (XY)', value: '徐亚' },
  { label: '晓希 (XX)', value: '晓希' },
  { label: '天然 (TR)', value: '天然' }
];

const FILTER_OPTIONS = ['全部', ...MEMBER_OPTIONS.map(m => m.value)];

const EntryView: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<'roadshow' | 'call' | 'report' | 'service' | 'internal'>('roadshow');

  // States for Form
  const [member, setMember] = useState('沛东');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [institution, setInstitution] = useState('');
  const [topic, setTopic] = useState('');
  const [clientName, setClientName] = useState('');
  const [reportType, setReportType] = useState<'deep' | 'topic'>('topic');
  const [serviceType, setServiceType] = useState<'review' | 'daily_chart' | 'segment'>('review');
  const [interactionType, setInteractionType] = useState<'online' | 'offline'>('online');
  const [isRealRoadshow, setIsRealRoadshow] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Data State
  const [records, setRecords] = useState<Record[]>([]);

  // Filter & View State
  const [filterMember, setFilterMember] = useState('全部');
  const [showAll, setShowAll] = useState(false);

  // Load records from server
  const fetchRecords = async () => {
    try {
      const res = await fetch('/api/records');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setRecords(data);
        }
      }
    } catch (e) {
      console.error('Failed to fetch records', e);
    }
  };

  useEffect(() => {
    fetchRecords();
    const interval = setInterval(fetchRecords, 5000);
    return () => clearInterval(interval);
  }, []);

  const saveToServer = async (newRecords: Record[]) => {
    try {
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecords)
      });
      if (!res.ok) throw new Error('Save failed');
      setRecords(newRecords);
      return true;
    } catch (e) {
      console.error(e);
      alert("同步服务器失败，请检查网络！");
      return false;
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (activeSegment === 'roadshow') {
      if (!institution) {
        alert("请输入机构名称");
        return;
      }
      if (!clientName) {
        alert("请输入客户姓名");
        return;
      }
    }
    if ((activeSegment === 'call' || activeSegment === 'report' || activeSegment === 'service' || activeSegment === 'internal') && !topic) {
      const msg = activeSegment === 'call' ? "请输入会议主题" : (activeSegment === 'service' ? "请输入输出名称" : (activeSegment === 'internal' ? "请输入服务名称" : "请输入报告标题"));
      alert(msg);
      return;
    }

    // Fetch latest data before saving to avoid overwriting others' work
    let currentRecords = records;
    try {
      const res = await fetch('/api/records');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) currentRecords = data;
      }
    } catch (e) {
      // Ignore fetch error, try to use local state (risk of conflict)
    }

    let updatedRecords: Record[];

    // Construct new record object
    const recordData = {
      type: activeSegment,
      member,
      date,
      institution: activeSegment === 'roadshow' ? institution : undefined,
      topic: activeSegment === 'roadshow'
        ? `${institution}-${clientName}`
        : topic,
      clientName: activeSegment === 'roadshow' ? clientName : undefined,
      reportType: activeSegment === 'report' ? reportType : undefined,
      serviceType: activeSegment === 'service' ? serviceType : undefined,
      interactionType: (activeSegment === 'roadshow' || activeSegment === 'service') ? interactionType : undefined,
      isRealRoadshow: activeSegment === 'roadshow' ? true : undefined,
      timestamp: Date.now()
    };

    if (editingId) {
      updatedRecords = currentRecords.map(rec =>
        rec.id === editingId
          ? { ...rec, ...recordData }
          : rec
      );
      setEditingId(null);
    } else {
      const newRecord: Record = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        ...recordData
      } as Record;
      updatedRecords = [newRecord, ...currentRecords];
    }

    const success = await saveToServer(updatedRecords);
    if (success) {
      setInstitution('');
      setTopic('');
      setClientName('');
      setIsRealRoadshow(false);
      alert(editingId ? "修改成功！" : "录入成功！");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('确认删除这条记录吗？')) {
      let currentRecords = records;
      try {
        const res = await fetch('/api/records');
        if (res.ok) currentRecords = await res.json();
      } catch (e) { }

      const updatedRecords = currentRecords.filter(r => r.id !== id);
      const success = await saveToServer(updatedRecords);

      if (success && editingId === id) {
        setEditingId(null);
        setInstitution('');
        setTopic('');
        setClientName('');
      }
    }
  };

  const handleEdit = (record: Record) => {
    setActiveSegment(record.type);
    setMember(record.member);
    setDate(record.date);
    if (record.type === 'roadshow') {
      // Strip the (线上/线下) suffix from the institution if it was stored there
      setInstitution(record.institution || record.topic.split('（')[0] || '');
      setTopic('');
      setClientName(record.clientName || '');
    } else {
      setTopic(record.topic || '');
      setInstitution('');
      setClientName('');
    }
    if (record.reportType) {
      setReportType(record.reportType);
    }
    if (record.serviceType) {
      setServiceType(record.serviceType);
    }
    setInteractionType(record.interactionType || 'online');
    setIsRealRoadshow(true);
    setEditingId(record.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter Logic
  const filteredRecords = records.filter(r =>
    filterMember === '全部' ? true : r.member === filterMember
  );

  const displayRecords = showAll ? filteredRecords : filteredRecords.slice(0, 5);

  return (
    <div className="pb-32 animate-fade-in relative min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md px-4 py-3 flex justify-between items-center border-b border-gray-200/50">
        <button className="p-2 -ml-2 text-primary rounded-full hover:bg-gray-100/50">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-gray-900">2026Q1数据录入</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">数据录入 • 工作量追踪</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setInstitution('');
            setTopic('');
          }}
          className="p-2 -mr-2 text-primary rounded-full hover:bg-gray-100/50"
        >
          <span className="material-symbols-outlined">add_circle</span>
        </button>
      </div>

      {/* Segmented Control */}
      <div className="sticky top-[60px] z-30 px-4 py-3 bg-background/95 backdrop-blur-sm">
        <div className="grid grid-cols-5 p-1 bg-gray-200/60 rounded-xl gap-0.5">
          {(['roadshow', 'call', 'report', 'service', 'internal'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setActiveSegment(type)}
              className={`w-full py-1.5 text-[10px] font-bold rounded-lg transition-all duration-200 ${activeSegment === type
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {type === 'roadshow' ? '路演' : type === 'call' ? '电话会' : type === 'report' ? '报告' : type === 'service' ? '高频输出' : '对内服务'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Form Card */}
        <div className={`rounded-3xl p-5 shadow-sm border transition-colors ${editingId ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {editingId ? '正在编辑记录' : '录入详情'}
            </h3>
            <span className="text-xs font-bold text-primary">2026 Q1</span>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              {/* Member Select */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 ml-1">成员</label>
                <div className="relative">
                  <select
                    value={member}
                    title="选择成员"
                    onChange={(e) => setMember(e.target.value)}
                    className="w-full bg-gray-50 rounded-xl px-3 py-3 text-sm font-bold text-gray-800 appearance-none focus:ring-2 focus:ring-primary/20 border-none outline-none"
                  >
                    {MEMBER_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined text-gray-400 text-lg absolute right-3 top-3 pointer-events-none">expand_more</span>
                </div>
              </div>

              {/* Date Picker */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 ml-1">记录日期</label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    title="选择日期"
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-gray-50 rounded-xl px-3 py-3 text-sm font-bold text-gray-800 border-none focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Conditional Inputs based on Segment */}

              {(activeSegment === 'roadshow' || activeSegment === 'service') && (
                <div className="space-y-3">
                </div>
              )}

              {activeSegment === 'roadshow' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">机构名称</label>
                    <input
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="输入机构/代码..."
                      className="w-full bg-gray-50 border-none rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-gray-300 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">客户姓名</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="备注姓名..."
                      className="w-full bg-gray-50 border-none rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-gray-300 transition-all outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-orange-500 font-bold bg-orange-50 px-2 py-1.5 rounded-lg border border-orange-100 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">info</span>
                      路演只允许填写真实路演，个人路演，团队路演不包括
                    </p>
                  </div>
                </div>
              )}

              {activeSegment === 'report' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">Report Type (报告类型)</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setReportType('topic')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${reportType === 'topic' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                    >
                      专题报告
                    </button>
                    <button
                      onClick={() => setReportType('deep')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${reportType === 'deep' ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                    >
                      深度报告
                    </button>
                  </div>
                </div>
              )}

              {(activeSegment === 'service') && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">Content Type (内容类型)</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setServiceType('review')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${serviceType === 'review' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                    >
                      点评报告
                    </button>
                    <button
                      onClick={() => setServiceType('daily_chart')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${serviceType === 'daily_chart' ? 'bg-cyan-50 border-cyan-200 text-cyan-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                    >
                      一图
                    </button>
                    <button
                      onClick={() => setServiceType('segment')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${serviceType === 'segment' ? 'bg-pink-50 border-pink-200 text-pink-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                    >
                      段子
                    </button>
                  </div>
                </div>
              )}

              {(activeSegment === 'call' || activeSegment === 'report' || activeSegment === 'service' || activeSegment === 'internal') && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">
                    {activeSegment === 'call' ? 'Conference Name (会议名称)' : (activeSegment === 'service' ? 'Output Name (输出名称)' : (activeSegment === 'internal' ? 'Service Name (服务名称)' : 'Report Title (报告标题)'))}
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={activeSegment === 'call' ? "输入电话会议主题..." : (activeSegment === 'service' ? "输入输出名称..." : (activeSegment === 'internal' ? "输入对内服务名称..." : "输入报告标题..."))}
                    className="w-full bg-gray-50 border-none rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-gray-300 transition-all outline-none"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {editingId && (
                <button
                  onClick={() => {
                    setEditingId(null);
                    setInstitution('');
                    setTopic('');
                    setClientName('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-600 py-3.5 rounded-xl font-bold text-sm"
                >
                  取消
                </button>
              )}
              <button
                onClick={handleSubmit}
                className="flex-[2] bg-primary text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-xl">{editingId ? 'update' : 'save_as'}</span>
                {editingId ? '更新记录' : '确认提交录入'}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Records */}
        <div className="space-y-3 pb-8">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">最近录入记录</h3>
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-[10px] text-primary font-bold flex items-center"
            >
              {showAll ? '收起列表' : '查看全部'} <span className="material-symbols-outlined text-xs">{showAll ? 'expand_less' : 'expand_more'}</span>
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {FILTER_OPTIONS.map((name) => (
              <button
                key={name}
                onClick={() => setFilterMember(name)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${filterMember === name
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-white text-gray-500 border border-gray-100'
                  }`}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {displayRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs">暂无记录</div>
            ) : (
              displayRecords.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${item.type === 'report' ? 'bg-purple-50 text-purple-600' : (item.type === 'service' ? 'bg-orange-50 text-orange-600' : (item.type === 'internal' ? 'bg-pink-50 text-pink-600' : 'bg-blue-50 text-blue-600'))
                      }`}>
                      <span className="material-symbols-outlined text-xl">
                        {item.type === 'report' ? 'description' : (item.type === 'call' ? 'call' : (item.type === 'service' ? 'flash_on' : (item.type === 'internal' ? 'handshake' : 'apartment')))}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-gray-800 truncate pr-1">{item.topic || item.institution || '无标题'}</h4>
                        <div className="flex gap-1 shrink-0">
                          {(item.type === 'service') && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${item.serviceType === 'review' ? 'bg-emerald-50 text-emerald-600' : (item.serviceType === 'segment' ? 'bg-pink-50 text-pink-600' : 'bg-cyan-50 text-cyan-600')}`}>
                              {item.serviceType === 'review' ? '点评' : (item.serviceType === 'segment' ? '段子' : '一图')}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                        {item.member} • {item.date}
                        {item.institution && <span className="bg-gray-100 px-1 rounded text-gray-500">{item.institution}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(item)}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-gray-300 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryView;