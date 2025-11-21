import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { FilterSection } from './components/FilterSection';
import { AnalysisSection } from './components/AnalysisSection';
import { ChartSection } from './components/ChartSection';
import { DataGrid } from './components/DataGrid';
import { ToastContainer, ToastMessage } from './components/Toast';
import { 
  generateHistoricalData, 
  generateAIAnalysis, 
  createNewDataPoint,
  generatePolicyNews,
  predictNextDay
} from './services/dataService';
import { CoalData, AIReport, PolicyItem, PredictionResult } from './types';

export default function App() {
  // Basic Data State
  const [allData, setAllData] = useState<CoalData[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  
  // Filter State
  const [filterLocation, setFilterLocation] = useState('全部');
  const [filterType, setFilterType] = useState('全部');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Export State
  const [exportStart, setExportStart] = useState('2023-07-01');
  const [exportEnd, setExportEnd] = useState('2025-09-30');

  // Analysis State
  const [aiReport, setAiReport] = useState<AIReport | null>(null);
  const [policyNews, setPolicyNews] = useState<PolicyItem[]>([]);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  // Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Initialization
  useEffect(() => {
    const initData = generateHistoricalData(800);
    setAllData(initData);
    
    const today = new Date();
    const lastMonth = new Date(new Date().setMonth(today.getMonth() - 1));
    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(lastMonth.toISOString().split('T')[0]);

    // Init Policy & Prediction
    const news = generatePolicyNews();
    setPolicyNews(news);
    const pred = predictNextDay(initData);
    setPrediction(pred);
  }, []);

  // Core Filtering Logic
  const filteredData = useMemo(() => {
    return allData.filter(item => {
      const itemDate = new Date(item.timestamp);
      const start = startDate ? new Date(startDate) : new Date('2000-01-01');
      const end = endDate ? new Date(new Date(endDate).setHours(23, 59, 59)) : new Date();

      const matchLoc = filterLocation === '全部' || item.location === filterLocation;
      const matchType = filterType === '全部' || item.type.includes(filterType);
      const matchTime = itemDate >= start && itemDate <= end;

      return matchLoc && matchType && matchTime;
    });
  }, [allData, filterLocation, filterType, startDate, endDate]);

  // Statistics
  const stats = useMemo(() => {
    if (filteredData.length === 0) return { avg: 0, max: 0, min: 0, count: 0, current: 0, change: 0 };
    const prices = filteredData.map(i => i.price);
    const latest = filteredData[0]; 
    return {
      avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      max: Math.max(...prices),
      min: Math.min(...prices),
      count: filteredData.length,
      current: latest ? latest.price : 0,
      change: latest ? latest.changeRate : 0
    };
  }, [filteredData]);

  // Trigger AI Analysis on filter/data change
  useEffect(() => {
    // Pass policyNews and prediction to the analysis engine
    setAiReport(generateAIAnalysis(filteredData, startDate, endDate, policyNews, prediction));
  }, [filteredData, startDate, endDate, policyNews, prediction]);

  // Real-time Scanning Simulation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isScanning) {
      interval = setInterval(() => {
        setAllData(prev => {
          const lastPoint = prev[0]; 
          const newData = createNewDataPoint(lastPoint, filterType, filterLocation);
          return [newData, ...prev];
        });
        setScanCount(c => c + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isScanning, filterType, filterLocation]);

  // Quick Date Handlers
  const handleQuickDate = (days: number) => {
    const end = new Date();
    const start = new Date();
    if (days === 365) {
      start.setFullYear(end.getFullYear(), 0, 1); // This year
    } else {
      start.setDate(end.getDate() - days);
    }
    
    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
    addToast(`已切换至最近 ${days === 365 ? '一年' : days + ' 天'} 数据`, 'info');
  };

  // Export Handler
  const handleExport = () => {
    const exportData = allData.filter(item => {
      const itemT = item.timestamp;
      const s = new Date(exportStart).getTime();
      const e = new Date(new Date(exportEnd).setHours(23, 59, 59)).getTime();
      return itemT >= s && itemT <= e;
    });

    if (exportData.length === 0) {
      addToast("所选时间段内无数据，无法导出。", 'error');
      return;
    }

    const tableRows = exportData.map(row => `
      <tr>
        <td>${row.id}</td>
        <td>${row.timeStr}</td>
        <td>${row.location}</td>
        <td>${row.type}</td>
        <td>${row.price}</td>
        <td style="color:${row.changeRate > 0 ? 'red' : 'green'}">${row.changeRate}%</td>
        <td>${row.calorific}</td>
        <td>${row.sulfur}</td>
        <td>${row.source}</td>
      </tr>
    `).join('');

    const tableTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>煤炭行情数据</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          td { mso-number-format:"\@"; }
          .header { font-weight: bold; background-color: #cccccc; }
        </style>
      </head>
      <body>
        <table border="1">
          <thead>
            <tr class="header">
              <th>ID</th>
              <th>时间</th>
              <th>地点</th>
              <th>煤种</th>
              <th>价格(元/吨)</th>
              <th>涨跌幅</th>
              <th>发热量(kcal/kg)</th>
              <th>硫分(%)</th>
              <th>来源</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([tableTemplate], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `煤炭行情数据_${exportStart}_至_${exportEnd}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addToast("Excel 格式数据导出成功", 'success');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans pb-10">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <Header 
        isScanning={isScanning} 
        setIsScanning={setIsScanning} 
        scanCount={scanCount}
        exportStart={exportStart}
        setExportStart={setExportStart}
        exportEnd={exportEnd}
        setExportEnd={setExportEnd}
        handleExport={handleExport}
      />

      <main className="max-w-[1600px] mx-auto p-4 space-y-6">
        <FilterSection
          filterLocation={filterLocation}
          setFilterLocation={setFilterLocation}
          filterType={filterType}
          setFilterType={setFilterType}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          stats={stats}
          isScanning={isScanning}
          onQuickDate={handleQuickDate}
        />

        <AnalysisSection aiReport={aiReport} stats={stats} />

        <ChartSection filteredData={filteredData} />

        <DataGrid filteredData={filteredData} isScanning={isScanning} />
      </main>
    </div>
  );
}