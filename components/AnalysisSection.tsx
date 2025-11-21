import React from 'react';
import { BrainCircuit, Activity, ShieldAlert, TrendingUp, TrendingDown } from 'lucide-react';
import { AIReport, Stats } from '../types';

interface AnalysisSectionProps {
  aiReport: AIReport | null;
  stats: Stats;
}

export const AnalysisSection: React.FC<AnalysisSectionProps> = ({ aiReport, stats }) => {
  return (
    <div className="bg-[#1e293b] rounded-xl border border-slate-700 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/30">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-purple-400" size={20} />
          <h3 className="font-bold text-slate-200">AI 趋势深度解析</h3>
        </div>
        <div className="text-xs text-slate-400">
          分析周期: <span className="text-purple-300">{aiReport?.rangeText}</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Left: Analysis Text (Market Review & Prediction) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                <Activity size={14}/> 走势研判
              </h4>
              <div className="bg-[#0f172a]/50 border border-slate-700/50 rounded-lg p-4 text-sm text-slate-300 leading-relaxed min-h-[140px] whitespace-pre-wrap">
                {aiReport?.summary || "正在分析数据..."}
              </div>
            </div>
          </div>

          {/* Right: Suggestion Box */}
          <div className="lg:col-span-2 flex flex-col h-full">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
              <ShieldAlert size={14}/> 操作建议
            </h4>
            <div className={`flex-1 p-5 rounded-lg border-l-4 text-sm font-medium flex items-center ${
              aiReport?.trend === 'bullish' ? 'bg-red-500/10 border-red-500 text-red-200' :
              aiReport?.trend === 'bearish' ? 'bg-green-500/10 border-green-500 text-green-200' :
              'bg-blue-500/10 border-blue-500 text-blue-200'
            }`}>
              {aiReport?.suggestion || "暂无建议"}
            </div>
          </div>
        </div>

        {/* Bottom: Metrics & Signal Strength */}
        <div className="mt-6 pt-6 border-t border-slate-700/50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          
          {/* Latest Price */}
          <div className="border-r border-slate-700/50 pr-6">
             <div className="text-xs text-slate-500 mb-1">最新报价</div>
             <div className="text-3xl font-black text-white flex items-center gap-2">
               ￥{stats.current}
               {stats.change !== 0 && (
                 <span className={`text-sm font-bold flex items-center ${stats.change > 0 ? 'text-red-500' : 'text-green-500'}`}>
                   {stats.change > 0 ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
                 </span>
               )}
             </div>
          </div>

          {/* High/Low */}
          <div className="flex gap-8 border-r border-slate-700/50 pr-6">
            <div>
              <div className="text-xs text-slate-500 mb-1">区间最高</div>
              <div className="text-xl font-bold text-orange-400">￥{stats.max}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">区间最低</div>
              <div className="text-xl font-bold text-green-400">￥{stats.min}</div>
            </div>
          </div>

          {/* Signal Strength */}
          <div className="lg:col-span-2">
             <div className="flex justify-between text-xs text-slate-500 mb-2">
                <span>AI 信号强度</span>
                <span className="text-purple-400 font-bold">{aiReport?.confidence.toFixed(0)}%</span>
             </div>
             <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    aiReport?.trend === 'bullish' ? 'bg-gradient-to-r from-red-600 to-orange-500' : 
                    aiReport?.trend === 'bearish' ? 'bg-gradient-to-r from-green-600 to-emerald-500' : 
                    'bg-gradient-to-r from-blue-600 to-cyan-500'
                  }`} 
                  style={{ width: `${aiReport?.confidence}%` }}
                ></div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};