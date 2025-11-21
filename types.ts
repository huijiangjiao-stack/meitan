export interface CoalData {
  id: string;
  location: string;
  timestamp: number;
  timeStr: string;
  type: string;
  price: number;
  calorific: number;
  sulfur: number;
  source: string;
  changeRate: number;
}

export interface AIReport {
  summary: string;
  trend: 'bullish' | 'bearish' | 'neutral';
  suggestion: string;
  confidence: number;
  rangeText: string;
}

export interface Stats {
  avg: number;
  max: number;
  min: number;
  count: number;
  current: number;
  change: number;
}

export interface PolicyItem {
  id: string;
  title: string;
  source: string;
  date: string;
  impact: 'positive' | 'negative' | 'neutral';
  summary: string;
}

export interface PredictionResult {
  targetDate: string;
  predictedChange: number; // e.g., 15 (RMB)
  direction: 'up' | 'down' | 'flat';
  reasoning: string;
  factors: {
    inventory: string; // e.g., "580万吨 (低位)"
    consumption: string; // e.g., "82万吨 (高位)"
    policy: string; // e.g., "安监趋严"
    trend30d: string; // e.g., "上行趋势"
  };
}