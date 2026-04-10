// MBTI 四个维度
export type Dimension = 'EI' | 'SN' | 'TF' | 'JP';
export type DimensionValue = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

// MBTI 类型（16种）
export type MBTIType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

// 测试长度
export type TestLength = 'quick' | 'full';

// 应用步骤
export type AppStep = 'welcome' | 'quiz' | 'calculating' | 'result';

// 题目接口
export interface Question {
  id: number;
  dimension: Dimension;
  text: string;
  options: {
    text: string;
    value: 1 | -1; // 1 = 正向, -1 = 负向
  }[];
}

// 答案状态
export interface Answers {
  EI: number;
  SN: number;
  TF: number;
  JP: number;
}

// 测试进度
export interface QuizProgress {
  testLength: TestLength;
  currentQuestion: number;
  answers: Answers;
  questionSelections?: Array<1 | -1 | null>;
  timestamp: number;
}

// 测试结果
export interface QuizResult {
  type: MBTIType;
  completedAt: number;
  testLength?: TestLength;
  answers?: Answers;
}

// 人格类型详情
export interface PersonalityType {
  type: MBTIType;
  name: string;
  nameEn: string;
  group: 'analyst' | 'diplomat' | 'sentinel' | 'explorer';
  dimensions: {
    EI: { label: string; value: DimensionValue };
    SN: { label: string; value: DimensionValue };
    TF: { label: string; value: DimensionValue };
    JP: { label: string; value: DimensionValue };
  };
  tagline: string;
  description: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  careers: string[];
  compatibility: {
    best: MBTIType[];
    similar: MBTIType[];
    challenging: MBTIType[];
  };
  celebrities: Array<{ name: string; role: string }>;
  growth: string[];
  source: string;
}

// 应用状态
export interface AppState {
  step: AppStep;
  testLength: TestLength | null;
  currentQuestion: number;
  answers: Answers;
  questionSelections: Array<1 | -1 | null>;
  result: MBTIType | null;
}
