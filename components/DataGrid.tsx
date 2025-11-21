import React from 'react';
import { Database, Activity } from 'lucide-react';
import { CoalData } from '../types';

interface DataGridProps {
  filteredData: CoalData[];
  isScanning: boolean;
}

export const DataGrid: React.FC<DataGridProps> = ({ filteredData, isScanning }) => {
  return (
    <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden">
       <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex items-center gap-2">
         <Database size={16} className="text-slate-500" />
         <span className="text-sm font-bold text-slate-300">筛选数据明细</span>
         {isScanning && (
           <span className="text-xs text-green-400 animate-pulse ml-2 flex items-center">
             <Activity size={10} className="mr-1" /> 实时数据写入中...
           </span>
         )}
       </div>
       <div className="overflow-x-auto max-h-[400px]">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-[#0f172a] text-xs uppercase font-medium text-slate-500 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3">时间</th>
              <th className="px-6 py-3">地点</th>
              <th className="px-6 py-3">煤种</th>
              <th className="px-6 py-3 text-right">价格 (元/吨)</th>
              <th className="px-6 py-3 text-right">涨跌</th>
              <th className="px-6 py-3">来源</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredData.slice(0, 100).map((row, index) => {
              // Check if row is 'new' (simulated by check source and if it's at the top)
              const isNew = row.source === '实时搜寻网络节点' && index === 0 && isScanning;
              
              return (
              <tr 
                key={row.id} 
                className={`
                   hover:bg-slate-700/30 transition-all duration-500
                   ${row.source === '实时搜寻网络节点' ? 'bg-green-900/10' : ''}
                   ${isNew ? 'animate-pulse bg-green-500/20' : ''}
                `}
              >
                <td className="px-6 py-3 font-mono text-slate-300">{row.timeStr}</td>
                <td className="px-6 py-3">{row.location}</td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs border ${
                    row.type.includes('动力煤') ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' :
                    row.type.includes('炼焦煤') ? 'border-orange-500/30 text-orange-400 bg-orange-500/10' :
                    'border-slate-600 text-slate-400'
                  }`}>
                    {row.type.split(' ')[0]}
                  </span>
                </td>
                <td className="px-6 py-3 text-right font-bold text-slate-200">￥{row.price}</td>
                <td className="px-6 py-3 text-right">
                   <span className={row.changeRate > 0 ? 'text-red-400' : 'text-green-400'}>
                     {row.changeRate}%
                   </span>
                </td>
                <td className="px-6 py-3 text-xs flex items-center gap-1">
                  {row.source === '实时搜寻网络节点' && <Activity size={10} className="text-green-500" />}
                  {row.source}
                </td>
              </tr>
            )})}
            {filteredData.length === 0 && (
               <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  当前筛选条件下无数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
       </div>
    </div>
  );
};