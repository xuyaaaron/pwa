import React, { useState, useEffect } from 'react';
import { Record } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WeeklyView: React.FC = () => {
    const [currentWeekStats, setCurrentWeekStats] = useState<any>(null);
    const [lastWeekStats, setLastWeekStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Helper to get date range
    const getWeekRange = (date: Date) => {
        // Current day of week (0-6, Sun-Sat)
        // We want Mon-Sat cycle.
        // If today is Sun (0), we want previous Mon-Sat?
        // User definition: "Weekly Mon to Sat 23:59"
        // Assuming standard ISO week logic but tailored.
        const day = date.getDay();
        const diffToMon = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        const monday = new Date(date.setDate(diffToMon));
        monday.setHours(0, 0, 0, 0);

        const saturday = new Date(monday);
        saturday.setDate(monday.getDate() + 5);
        saturday.setHours(23, 59, 59, 999);

        return { start: monday, end: saturday };
    };

    const processRecords = (records: Record[], start: Date, end: Date) => {
        const stats: any = {
            total: { roadshow: 0, call: 0, report: 0, service: 0, internal: 0 },
            members: {}
        };

        records.forEach(r => {
            const rDate = new Date(r.date);
            // r.date is YYYY-MM-DD string, new Date(r.date) is UTC 00:00 usually, but local timezone matters
            // Let's assume r.date string is sufficient for comparison or normalize
            // Simple string comparison YYYY-MM-DD might be safer if we format start/end

            // Normalize to compare
            const d = new Date(r.date);
            d.setHours(12, 0, 0, 0); // Avoid timezone edge cases for simple date dates

            if (d >= start && d <= end) {
                // Accumulate Team
                if (!stats.total[r.type]) stats.total[r.type] = 0;
                stats.total[r.type]++;

                // Accumulate Member
                if (!stats.members[r.member]) {
                    stats.members[r.member] = { roadshow: 0, call: 0, report: 0, service: 0, internal: 0 };
                }
                if (!stats.members[r.member][r.type]) stats.members[r.member][r.type] = 0;
                stats.members[r.member][r.type]++;
            }
        });
        return stats;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/records');
                if (res.ok) {
                    const records: Record[] = await res.json();

                    const now = new Date();
                    const thisWeek = getWeekRange(new Date(now)); // Clone date
                    const lastWeekDate = new Date(now);
                    lastWeekDate.setDate(lastWeekDate.getDate() - 7);
                    const lastWeek = getWeekRange(lastWeekDate);

                    const currentStats = processRecords(records, thisWeek.start, thisWeek.end);
                    const prevStats = processRecords(records, lastWeek.start, lastWeek.end);

                    setCurrentWeekStats(currentStats);
                    setLastWeekStats(prevStats);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading || !currentWeekStats) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 pb-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Prepare chart data
    const chartData = [
        { name: '路演', current: currentWeekStats.total.roadshow, last: lastWeekStats.total.roadshow },
        { name: '会议', current: currentWeekStats.total.call, last: lastWeekStats.total.call },
        { name: '研报', current: currentWeekStats.total.report, last: lastWeekStats.total.report },
        { name: '高频', current: currentWeekStats.total.service, last: lastWeekStats.total.service },
        { name: '对内', current: currentWeekStats.total.internal, last: lastWeekStats.total.internal },
    ];

    return (
        <div className="pb-32 animate-fade-in min-h-screen bg-gray-50">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-4 py-3 border-b border-gray-200">
                <h1 className="text-lg font-black text-gray-900">周度数据分析</h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Weekly Analysis • Insight</p>
            </div>

            <div className="p-4 space-y-4">
                {/* Team Overview Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">团队本周概览</h3>
                    <div className="grid grid-cols-5 gap-2 text-center">
                        {chartData.map((item) => (
                            <div key={item.name} className="flex flex-col items-center">
                                <span className="text-[10px] text-gray-400 mb-1">{item.name}</span>
                                <span className="text-lg font-black text-gray-900 leading-none">{item.current}</span>
                                <span className={`text-[9px] font-bold mt-1 ${item.current >= item.last ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {item.current - item.last > 0 ? '+' : ''}{item.current - item.last}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-64">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">周度对比趋势</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Legend wrapperStyle={{ fontSize: '10px' }} />
                            <Bar dataKey="current" name="本周" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                            <Bar dataKey="last" name="上周" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Member Breakdown */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-gray-500 px-1">成员明细对比</h3>
                    {Object.keys(currentWeekStats.members).map(member => {
                        const curr = currentWeekStats.members[member];
                        const last = lastWeekStats.members[member] || { roadshow: 0, call: 0, report: 0, service: 0, internal: 0 };

                        return (
                            <div key={member} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-gray-900">{member}</h4>
                                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">本周 vs 上周</span>
                                </div>
                                <div className="grid grid-cols-5 gap-2 text-center">
                                    {(['roadshow', 'call', 'report', 'service', 'internal'] as const).map(type => {
                                        const labelMap: any = { roadshow: '路演', call: '会议', report: '研报', service: '高频', internal: '对内' };
                                        const diff = (curr[type] || 0) - (last[type] || 0);
                                        return (
                                            <div key={type} className="flex flex-col">
                                                <span className="text-[9px] text-gray-400 mb-0.5">{labelMap[type]}</span>
                                                <div className="flex items-end justify-center gap-1">
                                                    <span className="text-sm font-bold text-gray-800">{curr[type] || 0}</span>
                                                    <span className={`text-[8px] font-bold ${diff >= 0 ? 'text-gray-300' : 'text-red-300'}`}>
                                                        ({last[type] || 0})
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Report Generation Button (Mock) */}
                <div className="pt-4">
                    <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-gray-200 active:scale-95 transition-transform flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-lg">download</span>
                        导出周度分析报告
                    </button>
                    <p className="text-[10px] text-center text-gray-400 mt-2">报告将自动保存至桌面</p>
                </div>
            </div>
        </div>
    );
};

export default WeeklyView;
