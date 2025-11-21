import React, { useState } from 'react';
import { Factory, Pause, Play, Download, X, Calendar } from 'lucide-react';

interface HeaderProps {
  isScanning: boolean;
  setIsScanning: (val: boolean) => void;
  scanCount: number;
  exportStart: string;
  setExportStart: (val: string) => void;
  exportEnd: string;
  setExportEnd: (val: string) => void;
  handleExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  isScanning, setIsScanning, scanCount,
  exportStart, setExportStart,
  exportEnd, setExportEnd,
  handleExport
}) => {
  const [showExportModal, setShowExportModal] = useState(false);

  return (
    <>
      <nav className="bg-[#1e293b] border-b border-slate-700 px-6 py-4 sticky top-0 z-30 shadow-lg flex flex-wrap gap-4 justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-orange-600 p-2 rounded-lg shadow-lg">
            <Factory className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">
            碳<span className="text-orange-500">碳</span>
            <span className="ml-2 text-xs font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded">历史分析版</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Scanning Status Indicator */}
          <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded text-xs border transition-colors duration-300 ${isScanning ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'border-slate-600 bg-slate-800 text-slate-400'}`}>
            <span className={`w-2 h-2 rounded-full ${isScanning ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`}></span>
            {isScanning ? `正在从全网节点获取数据... (本次已搜寻 ${scanCount} 条)` : '搜索系统待机中'}
          </div>

          {/* Export Button */}
          <button 
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 bg-slate-800 border border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white active:scale-95"
          >
            <Download size={18} />
            <span className="hidden sm:inline">导出数据</span>
          </button>

          {/* Scan Toggle Button */}
          <button 
            onClick={() => setIsScanning(!isScanning)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 shadow-lg transform active:scale-95 ${
              isScanning 
                ? 'bg-slate-700 border border-slate-500 text-white hover:bg-slate-600' 
                : 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-500 hover:to-red-500 shadow-orange-900/30'
            }`}
          >
            {isScanning ? <Pause size={18} /> : <Play size={18} />}
            {isScanning ? '停止搜寻' : '启动全网搜寻'}
          </button>
        </div>
      </nav>

      {/* Export Modal Overlay */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-800/50">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Download size={18} className="text-orange-500"/>
                搜寻数据导出
              </h3>
              <button 
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <p className="text-sm text-slate-400">
                选择需要导出的时间范围。系统将生成包含ID、时间、地点、煤种、价格及来源的详细 CSV 报表。
              </p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Calendar size={12}/> 起始日期
                  </label>
                  <input 
                    type="date" 
                    value={exportStart}
                    onChange={(e) => setExportStart(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-sm focus:border-orange-500 outline-none text-slate-200 [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Calendar size={12}/> 结束日期
                  </label>
                  <input 
                    type="date" 
                    value={exportEnd}
                    onChange={(e) => setExportEnd(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-sm focus:border-orange-500 outline-none text-slate-200 [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    handleExport();
                    setShowExportModal(false);
                  }}
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-900/20"
                >
                  <Download size={16} />
                  确认导出 CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};