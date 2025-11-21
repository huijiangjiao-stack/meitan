import React, { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { 
  AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Brush, Legend 
} from 'recharts';
import { CoalData } from '../types';

interface ChartSectionProps {
  filteredData: CoalData[];
}

export const ChartSection: React.FC<ChartSectionProps> = ({ filteredData }) => {
  const chartData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => a.timestamp - b.timestamp);
    
    // Calculate Moving Averages
    return sorted.map((item, index, array) => {
      // MA5
      let ma5 = null;
      if (index >= 4) {
        const slice = array.slice(index - 4, index + 1);
        const sum = slice.reduce((acc, curr) => acc + curr.price, 0);
        ma5 = Math.round(sum / 5);
      }

      // MA10
      let ma10 = null;
      if (index >= 9) {
        const slice = array.slice(index - 9, index + 1);
        const sum = slice.reduce((acc, curr) => acc + curr.price, 0);
        ma10 = Math.round(sum / 10);
      }

      return {
        time: item.timeStr.split(' ')[0],
        fullTime: item.timeStr,
        price: item.price,
        ma5,
        ma10,
        type: item.type.split(' ')[0],
      };
    });
  }, [filteredData]);

  return (
    <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 shadow-sm h-[500px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
          <TrendingUp className="text-orange-500" size={18} />
          报价历史走势与均线分析
        </h3>
        <div className="text-xs text-slate-500">
          显示范围: {filteredData.length > 0 ? `${chartData[0]?.time} 至 ${chartData[chartData.length-1]?.time}` : '无数据'}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#64748b" 
            fontSize={11} 
            tickMargin={10}
            minTickGap={50}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={11} 
            domain={['auto', 'auto']} 
            unit="￥"
          />
          <RechartsTooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
            labelFormatter={(label) => `日期: ${label}`}
            formatter={(value: number, name: string) => {
               if (name === 'price') return [`￥${value}`, '成交价'];
               if (name === 'ma5') return [`￥${value}`, 'MA5 (5日均线)'];
               if (name === 'ma10') return [`￥${value}`, 'MA10 (10日均线)'];
               return [value, name];
            }}
          />
          <Legend verticalAlign="top" height={36} iconType="plainline" />
          <Area 
            name="price"
            type="monotone" 
            dataKey="price" 
            stroke="#f97316" 
            strokeWidth={2} 
            fill="url(#colorPrice2)" 
            animationDuration={300}
            isAnimationActive={false}
          />
          <Line 
            name="ma5"
            type="monotone" 
            dataKey="ma5" 
            stroke="#3b82f6" 
            strokeWidth={1.5} 
            dot={false}
            isAnimationActive={false}
          />
          <Line 
            name="ma10"
            type="monotone" 
            dataKey="ma10" 
            stroke="#10b981" 
            strokeWidth={1.5} 
            dot={false}
            isAnimationActive={false}
          />
          <Brush 
            dataKey="time" 
            height={30} 
            stroke="#475569" 
            fill="#1e293b" 
            tickFormatter={() => ''}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
