import React from 'react';
import { Filter, MapPin, Flame, Calendar, Zap, Clock } from 'lucide-react';
import { LOCATIONS, COAL_TYPES } from '../constants';
import { Stats } from '../types';

interface FilterSectionProps {
  filterLocation: string;
  setFilterLocation: (val: string) => void;
  filterType: string;
  setFilterType: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  stats: Stats;
  isScanning?: boolean;
  onQuickDate: (days: number) => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  filterLocation, setFilterLocation,
  filterType, setFilterType,
  startDate, setStartDate,
  endDate, setEndDate,
  stats,
  isScanning,
  onQuickDate
}) => {
  return (
    <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-4 shadow-sm">
      <div className="flex flex-wrap justify-between items-center mb-3 gap-3">
        <div className="flex items-center gap-2 text-sm font-bold text-orange-400 uppercase tracking-wider">
          <Filter size={16} /> 样本筛选与分析范围
        </div>
        <div className="flex gap-1">
           <button onClick={() => onQuickDate(7)} className="px-2 py-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-slate-300 transition-colors">近7天</button>
           <button onClick={() => onQuickDate(30)} className="px-2 py-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-slate-300 transition-colors">近30天</button>
           <button onClick={() => onQuickDate(90)} className="px-2 py-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-slate-300 transition-colors">近3个月</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
        
        {/* Location */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500">产地 / 港口</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <select 
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:border-orange-500 outline-none appearance-none text-slate-200"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            >
              <option value="全部">全部地点</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Coal Type */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500">煤炭种类</label>
          <div className="relative">
            <Flame className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <select 
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:border-orange-500 outline-none appearance-none text-slate-200"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="全部">全部煤种</option>
              {COAL_TYPES.map(t => <option key={t} value={t.split(' ')[0]}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Start Date */}
        <div className="flex flex-col gap-1 lg:col-span-1 md:col-span-2">
          <label className="text-xs text-slate-500">分析起始日期</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="date" 
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:border-orange-500 outline-none text-slate-200 [color-scheme:dark]"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-1 lg:col-span-1 md:col-span-2">
          <label className="text-xs text-slate-500">分析结束日期</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="date" 
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:border-orange-500 outline-none text-slate-200 [color-scheme:dark]"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Info */}
        <div className="hidden lg:flex flex-col justify-center items-start px-2 border-l border-slate-700/50">
             <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                <Clock size={12}/> 数据更新频率
             </div>
             <div className="text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded border border-slate-600">
                实时流式传输 (RT)
             </div>
        </div>

        {/* Stats Count */}
        <div className="flex flex-col justify-center items-end lg:items-center pb-1">
          <div className="text-right">
              <span className="text-xs text-slate-500 flex items-center justify-end gap-1">
                匹配样本数
                {isScanning && <Zap size={10} className="text-orange-500 animate-pulse"/>}
              </span>
              <div className="text-2xl font-bold text-white">{stats.count} <span className="text-sm text-slate-500 font-normal">条</span></div>
          </div>
        </div>

      </div>
    </div>
  );
};
