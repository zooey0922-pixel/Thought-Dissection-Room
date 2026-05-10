export interface DissectionRecord {
  id: string;
  date: string;
  timestamp: number;
  rawInput: string;
  facts: string[];
  thoughts: string[];
  painLevel: number;
  reframe?: string;
}

export interface UserProfile {
  name: string;
  isPro: boolean;
  medals: number;
  history: DissectionRecord[];
}

export const VIRUS_LIST = [
  "一定是", "肯定", "絕對", "覺得", "故意", "討厭", "慘了", "完了", 
  "總是", "每次", "會不會", "是不是", "想說", "尷尬", "排擠", "沒希望", "預測"
];

export const FACT_KEYWORDS = [
  "已讀", "沒回", "說", "走", "看到", "聽到", "拿給", "坐著", "沒看", "跳過", "會議", "時間"
];
