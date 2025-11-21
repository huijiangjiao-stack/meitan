import { CoalData, AIReport, PolicyItem, PredictionResult } from '../types';
import { LOCATIONS, COAL_TYPES, SOURCES } from '../constants';

export const generateHistoricalData = (count: number): CoalData[] => {
  const data: CoalData[] = [];
  const endDate = new Date();
  const startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 2));
  const totalTimeSpan = endDate.getTime() - startDate.getTime();

  for (let i = 0; i < count; i++) {
    const randomTime = startDate.getTime() + Math.random() * totalTimeSpan;
    const date = new Date(randomTime);
    data.push(generateSingleDataPoint(date));
  }
  return data.sort((a, b) => b.timestamp - a.timestamp);
};

const generateSingleDataPoint = (date: Date, isRealtime = false): CoalData => {
    const typeRaw = COAL_TYPES[Math.floor(Math.random() * COAL_TYPES.length)];
    let basePrice = 0;
    let cal = 0;
    
    const month = date.getMonth();
    const isWinter = month >= 10 || month <= 1;
    const seasonFactor = isWinter ? 50 : -20;

    if (typeRaw.includes('动力煤')) { basePrice = 800 + seasonFactor; cal = 5500; }
    else if (typeRaw.includes('炼焦煤')) { basePrice = 1800; cal = 6500; }
    else if (typeRaw.includes('无烟煤')) { basePrice = 1400 + seasonFactor; cal = 7000; }
    else if (typeRaw.includes('喷吹煤')) { basePrice = 1100; cal = 6000; }
    else { basePrice = 400; cal = 3500; }

    const priceVariation = Math.floor(Math.random() * 120) - 60;
    const finalPrice = basePrice + priceVariation;

    return {
      id: Math.random().toString(36).substr(2, 8).toUpperCase(),
      location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
      timestamp: date.getTime(),
      timeStr: date.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      type: typeRaw,
      price: finalPrice,
      calorific: cal + Math.floor(Math.random() * 200) - 100,
      sulfur: parseFloat((0.6 + Math.random() * 0.4).toFixed(2)),
      source: isRealtime ? '实时搜寻网络节点' : SOURCES[Math.floor(Math.random() * SOURCES.length)],
      changeRate: parseFloat(((Math.random() * 4 - 2)).toFixed(2)),
    };
}

export const createNewDataPoint = (
  lastPoint?: CoalData,
  filterType: string = '全部',
  filterLocation: string = '全部'
): CoalData => {
  const now = new Date();
  
  // Determine Type based on filter or random
  let typeRaw: string;
  if (filterType !== '全部') {
     const match = COAL_TYPES.find(t => t.includes(filterType));
     typeRaw = match || COAL_TYPES[0];
  } else {
     typeRaw = COAL_TYPES[Math.floor(Math.random() * COAL_TYPES.length)];
  }

  // Determine Location based on filter or random
  let location: string;
  if (filterLocation !== '全部') {
    location = filterLocation;
  } else {
    location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  }

  // Calculate Base params
  let basePrice = 0;
  let cal = 0;
  const month = now.getMonth();
  const isWinter = month >= 10 || month <= 1;
  const seasonFactor = isWinter ? 50 : -20;

  if (typeRaw.includes('动力煤')) { basePrice = 800 + seasonFactor; cal = 5500; }
  else if (typeRaw.includes('炼焦煤')) { basePrice = 1800; cal = 6500; }
  else if (typeRaw.includes('无烟煤')) { basePrice = 1400 + seasonFactor; cal = 7000; }
  else if (typeRaw.includes('喷吹煤')) { basePrice = 1100; cal = 6000; }
  else { basePrice = 400; cal = 3500; }

  let finalPrice: number;

  // Random Walk Logic: if last point matches type, drift from it to create smooth transitions
  if (lastPoint && lastPoint.type === typeRaw) {
      const drift = Math.floor(Math.random() * 15) - 7; // Smaller drift for smoothness
      finalPrice = lastPoint.price + drift;
  } else {
      const priceVariation = Math.floor(Math.random() * 120) - 60;
      finalPrice = basePrice + priceVariation;
  }

  const changeRate = parseFloat((Math.random() * 4 - 2).toFixed(2));

  return {
    id: Math.random().toString(36).substr(2, 8).toUpperCase(),
    location,
    timestamp: now.getTime(),
    timeStr: now.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    type: typeRaw,
    price: finalPrice,
    calorific: cal + Math.floor(Math.random() * 200) - 100,
    sulfur: parseFloat((0.6 + Math.random() * 0.4).toFixed(2)),
    source: '实时搜寻网络节点',
    changeRate
  };
};

// Helper to calculate recent trend strength (last ~10% vs previous ~10%)
const calculateRecentTrend = (data: CoalData[]): number => {
  if (data.length < 20) return 0;
  const sliceSize = Math.max(5, Math.floor(data.length * 0.1));
  const recent = data.slice(-sliceSize);
  const previous = data.slice(-sliceSize * 2, -sliceSize);
  
  const recentAvg = recent.reduce((a, b) => a + b.price, 0) / recent.length;
  const prevAvg = previous.reduce((a, b) => a + b.price, 0) / previous.length;
  
  return ((recentAvg - prevAvg) / prevAvg) * 100;
};

const getTrendDescription = (changePct: number, volatility: number): string => {
  if (volatility > 10) {
     if (changePct > 5) return "高波动上涨";
     if (changePct < -5) return "高波动下跌";
     return "宽幅剧烈震荡";
  }
  if (changePct > 8) return "单边强势拉升";
  if (changePct > 2) return "温和震荡上行";
  if (changePct < -8) return "加速单边下行";
  if (changePct < -2) return "阴跌探底";
  return "窄幅横盘整理";
};

// --- New Policy & Prediction Data Generation ---

export const generatePolicyNews = (): PolicyItem[] => {
  return [
    {
      id: '1',
      title: '国家能源局：全力做好迎峰度夏煤炭电力保供工作',
      source: '国家能源局官网',
      date: new Date().toISOString().split('T')[0],
      impact: 'negative', // Supply up -> Price down/stable
      summary: '强调增加产能释放，确保电厂存煤在安全水平之上。'
    },
    {
      id: '2',
      title: '陕西省发改委发布关于开展煤炭市场价格巡查的通知',
      source: '陕西省发改委',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      impact: 'negative', // Regulation -> Price down
      summary: '严厉打击囤积居奇、哄抬煤价等违法行为，稳定市场预期。'
    },
    {
      id: '3',
      title: '近期产地安监力度加大，部分中小煤矿停产整顿',
      source: '中国煤炭资源网',
      date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
      impact: 'positive', // Supply down -> Price up
      summary: '受事故影响，榆林地区开展为期一周的安全生产大检查。'
    }
  ];
};

export const predictNextDay = (allData: CoalData[]): PredictionResult => {
  // Simplified prediction logic
  const recent = allData.slice(0, 10);
  const avg = recent.reduce((a,b) => a+b.price,0)/recent.length;
  const direction = recent[0].price > avg ? 'up' : 'down';
  
  return {
    targetDate: new Date(Date.now() + 86400000).toLocaleDateString('zh-CN'),
    predictedChange: Math.floor(Math.random() * 20),
    direction: direction,
    reasoning: "综合研判：产地安监力度加大与下游补库需求共振。",
    factors: {
        inventory: "580万吨 (低位)",
        consumption: "82万吨 (高位)",
        policy: "安监趋严",
        trend30d: direction === 'up' ? "震荡上行" : "承压回调"
    }
  };
};

// --- Enhanced AI Analysis ---

export const generateAIAnalysis = (
  data: CoalData[], 
  startDate?: string, 
  endDate?: string, 
  policyNews: PolicyItem[] = [],
  prediction?: PredictionResult | null
): AIReport => {
  if (data.length === 0) return { summary: "所选范围内无数据，请调整筛选条件。", trend: 'neutral', suggestion: "无数据", confidence: 0, rangeText: "--" };

  // Sort for logic
  const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);
  const count = sortedData.length;
  
  // Stats
  const prices = sortedData.map(d => d.price);
  const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / count);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const volatility = (Math.sqrt(prices.reduce((sum, p) => sum + Math.pow(p - avgPrice, 2), 0) / count) / avgPrice) * 100;
  
  const firstPrice = sortedData[0].price;
  const lastPrice = sortedData[count - 1].price;
  const changePct = ((lastPrice - firstPrice) / firstPrice) * 100;

  // Policy Analysis
  const negativePolicies = policyNews.filter(p => p.impact === 'negative').length;
  const positivePolicies = policyNews.filter(p => p.impact === 'positive').length;
  let policyText = "";
  if (negativePolicies > positivePolicies) {
    policyText = "政策端偏空，国家发改委及能源局强调保供稳价，加强市场监管，对高价形成压制。";
  } else if (positivePolicies > negativePolicies) {
    policyText = "政策端扰动增加，安监力度加大导致局部供应收缩，对价格形成支撑。";
  } else {
    policyText = "政策面相对平静，市场主要受供需基本面主导。";
  }

  // Simulate Inventory/Consumption data for the report text
  const inventory = 500 + Math.floor(Math.random() * 150); // Mock
  const consumption = 70 + Math.floor(Math.random() * 20); // Mock
  const fundamentalText = `港口库存当前维持在${(inventory/100).toFixed(1)}万吨，电厂日耗${consumption}万吨。`;

  // Trend Determination
  let trend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  let trendDesc = getTrendDescription(changePct, volatility);
  let summary = "";
  let suggestion = "";

  const rangeDesc = startDate && endDate ? `${startDate} 至 ${endDate}` : "当前周期";

  // Text Generation
  summary += `【市场回顾】在 ${rangeDesc} 统计区间内，煤炭价格呈现“${trendDesc}”态势。\n`;
  summary += `• 价格区间：￥${minPrice} - ￥${maxPrice} (均价 ￥${avgPrice})\n`;
  summary += `• 波动特征：波动率 ${volatility.toFixed(1)}%，市场情绪分歧较大，资金博弈激烈。\n\n`;
  
  summary += `【趋势预测】${policyText} ${fundamentalText} `;
  
  if (changePct > 3) {
     trend = 'bullish';
     summary += "当前价格有效突破均线压制，叠加安监导致供给收缩，预计短期内煤价仍有上行惯性，下方支撑位看至 ￥" + (maxPrice * 0.95).toFixed(0) + "。";
     suggestion = "建议：当前处于右侧上涨通道，建议下游企业按需加大采购比例，锁定长协兑现率。激进投资者可关注逢低做多机会。";
  } else if (changePct < -3) {
     trend = 'bearish';
     summary += "随着港口库存累积及政策监管加强，市场悲观情绪浓厚。预计短期内煤价仍有下行压力，建议关注 ￥" + (minPrice * 0.95).toFixed(0) + " 一线支撑。";
     suggestion = "建议：市场处于去库周期，建议维持极低库存运行，暂缓大额现货采购。采取“即买即用”策略，防范存货跌价风险。";
  } else {
     trend = 'neutral';
     summary += "多空双方力量均衡，缺乏明确的消息面驱动。预计短期将围绕均价 ￥" + avgPrice + " 维持窄幅震荡整理格局。";
     suggestion = "建议：市场方向不明，建议保持中性仓位。操作上适合区间内高抛低吸，避免单边押注。";
  }

  return {
    summary,
    trend,
    suggestion,
    confidence: Math.min(Math.abs(changePct) * 5 + 60, 95),
    rangeText: rangeDesc
  };
};