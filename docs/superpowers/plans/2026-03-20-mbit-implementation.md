# MBTI 16型人格测试网站 - 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标：** 构建一个移动优先、轻松活泼风格的 MBTI 16型人格测试单页应用

**架构：** Next.js 14+ (App Router) + shadcn/ui + Tailwind CSS，渐进式单页应用（SPA），localStorage 数据缓存

**技术栈：** Next.js 14+, TypeScript, shadcn/ui, Tailwind CSS, Framer Motion, Lucide React

---

## 文件结构概览

```
mbit/
├── app/
│   ├── page.tsx                    # 主页，包含所有步骤的状态管理
│   ├── layout.tsx                  # 全局布局和样式
│   └── globals.css                 # 全局 CSS 变量
│
├── components/
│   ├── steps/
│   │   ├── WelcomeStep.tsx         # 欢迎页：MBTI 介绍 + 选择测试长度
│   │   ├── QuizStep.tsx            # 答题页：单题展示 + 进度条
│   │   ├── CalculatingStep.tsx     # 计算页：加载动画
│   │   └── ResultStep.tsx          # 结果页：类型展示 + 详细信息
│   │
│   ├── ui/                         # shadcn/ui 组件（通过 CLI 添加）
│   └── TypeDetailModal.tsx         # 类型详情弹窗组件
│
├── lib/
│   ├── questions/
│   │   ├── quick.ts                # 快速测试 12 题
│   │   └── full.ts                 # 完整测试 60 题
│   │
│   ├── types.ts                    # TypeScript 类型定义
│   ├── calculateMBTI.ts            # MBTI 计算逻辑
│   ├── storage.ts                  # localStorage 管理器
│   └── data/
│       └── types.json              # 16型人格详细数据
│
├── public/
│   └── types/                      # 类型图片/图标（后期添加）
│
├── docs/superpowers/
│   ├── specs/2026-03-20-mbit-design.md
│   └── plans/2026-03-20-mbit-implementation.md
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

## 阶段 1：项目脚手架搭建

### Task 1: 初始化 Next.js 项目

**目标：** 创建 Next.js 14+ 项目，配置 TypeScript 和 Tailwind CSS

**Files:**

- Create: Project structure via `npx create-next-app@latest`

- [ ] **Step 1: 创建 Next.js 项目**

运行：

```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --yes
```

预期输出：项目文件创建完成，包含 `app/`, `public/`, `package.json` 等

- [ ] **Step 2: 验证项目可运行**

运行：

```bash
npm run dev
```

预期：开发服务器启动，访问 http://localhost:3000 显示 Next.js 欢迎页

- [ ] **Step 3: 停止服务器并清理默认内容**

删除或清空 `app/page.tsx` 的默认内容，保留基本结构

- [ ] **Step 4: 提交初始项目**

```bash
git add .
git commit -m "feat: initialize Next.js project with TypeScript and Tailwind CSS"
```

---

### Task 2: 安装依赖并配置 shadcn/ui

**目标：** 安装 shadcn/ui 和其他必需依赖

**Files:**

- Modify: `package.json`

- Create: `components.json`

- [ ] **Step 1: 安装 shadcn/ui 依赖**

运行：

```bash
npm install framer-motion lucide-react class-variance-authority clsx tailwind-merge
```

预期：依赖安装成功

- [ ] **Step 2: 初始化 shadcn/ui**

运行：

```bash
npx shadcn@latest init -y -d
```

预期：`components.json` 创建，`lib/utils.ts` 创建，Tailwind 配置更新

- [ ] **Step 3: 添加基础 UI 组件**

运行：

```bash
npx shadcn@latest add button card progress badge scroll-area separator dialog -y
```

预期：UI 组件添加到 `components/ui/` 目录，包括 button、card、progress、badge、scroll-area、separator、dialog

- [ ] **Step 4: 提交**

```bash
git add .
git commit -m "feat: install shadcn/ui and base UI components"
```

---

### Task 3: 配置全局样式和主题

**目标：** 设置全局 CSS 变量和主题配置，实现轻松活泼的风格

**Files:**

- Modify: `app/globals.css`

- Modify: `tailwind.config.ts`

- [ ] **Step 1: 配置 Tailwind 主题颜色**

修改 `tailwind.config.ts`，添加自定义颜色：

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // MBTI 类型颜色
        analyst: {
          DEFAULT: '#8B5CF6',
          light: '#A78BFA',
          dark: '#7C3AED',
        },
        diplomat: {
          DEFAULT: '#F97316',
          light: '#FB923C',
          dark: '#EA580C',
        },
        sentinel: {
          DEFAULT: '#0EA5E9',
          light: '#38BDF8',
          dark: '#0284C7',
        },
        explorer: {
          DEFAULT: '#EAB308',
          light: '#FACC15',
          dark: '#CA8A04',
        },
        // 渐变背景
        gradient: {
          from: '#EEF2FF',
          via: '#FAF5FF',
          to: '#FFF7ED',
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

- [ ] **Step 2: 配置全局样式**

修改 `app/globals.css`：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 262 83% 58%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 262 83% 58%;
    --radius: 0.75rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-gradient-to-b from-gradient-from via-gradient-via to-gradient-to text-foreground min-h-screen;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }
}

/* 移动端优化 */
@layer utilities {
  .touch-target {
    @apply min-h-[44px] min-w-[44px];
  }
}
```

- [ ] **Step 3: 更新 layout.tsx 添加中文字体**

修改 `app/layout.tsx`：

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MBTI 16型人格测试",
  description: "发现你的性格类型，了解真实的自己",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: 提交**

```bash
git add .
git commit -m "feat: configure global styles and MBTI theme colors"
```

---

## 阶段 2：核心类型和数据结构

### Task 4: 创建 TypeScript 类型定义

**目标：** 定义所有 TypeScript 类型接口

**Files:**

- Create: `lib/types.ts`

- [ ] **Step 1: 创建类型定义文件**

创建 `lib/types.ts`：

```typescript
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
  timestamp: number;
}

// 测试结果
export interface QuizResult {
  type: MBTIType;
  completedAt: number;
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
  result: MBTIType | null;
}
```

- [ ] **Step 2: 提交**

```bash
git add lib/types.ts
git commit -m "feat: add TypeScript type definitions"
```

---

### Task 5: 创建 MBTI 计算逻辑

**目标：** 实现从答案到 MBTI 类型的计算逻辑

**Files:**

- Create: `lib/calculateMBTI.ts`

- [ ] **Step 1: 创建计算函数**

创建 `lib/calculateMBTI.ts`：

```typescript
import { Answers, MBTIType } from './types';

/**
 * 根据答案计算 MBTI 类型
 * @param answers - 四个维度的得分
 * @returns MBTI 类型（4字母代码）
 */
export function calculateMBTI(answers: Answers): MBTIType {
  const { EI, SN, TF, JP } = answers;

  // 每个维度比较正负，正数取第一个字母，负数取第二个
  const eOrI = EI >= 0 ? 'E' : 'I';
  const sOrN = SN >= 0 ? 'S' : 'N';
  const tOrF = TF >= 0 ? 'T' : 'F';
  const jOrP = JP >= 0 ? 'J' : 'P';

  return `${eOrI}${sOrN}${tOrF}${jOrP}` as MBTIType;
}

/**
 * 获取每个维度的得分百分比
 * @param answers - 四个维度的得分
 * @param maxScore - 该维度的最大可能得分（快速测试3分，完整测试15分）
 */
export function getDimensionPercentages(
  answers: Answers,
  maxScore: number
): Record<keyof Answers, { positive: number; negative: number }> {
  const calculatePercentage = (score: number) => {
    const absolute = Math.abs(score);
    const positive = Math.round((absolute / maxScore) * 100);
    const negative = 100 - positive;
    return { positive, negative };
  };

  return {
    EI: calculatePercentage(answers.EI),
    SN: calculatePercentage(answers.SN),
    TF: calculatePercentage(answers.TF),
    JP: calculatePercentage(answers.JP),
  };
}

/**
 * 格式化维度标签
 */
export function formatDimensionLabel(dimension: keyof Answers): string {
  const labels = {
    EI: '外向 / 内向',
    SN: '实感 / 直觉',
    TF: '思考 / 情感',
    JP: '判断 / 感知',
  };
  return labels[dimension];
}
```

- [ ] **Step 2: 提交**

```bash
git add lib/calculateMBTI.ts
git commit -m "feat: add MBTI calculation logic"
```

---

### Task 6: 创建 localStorage 管理器

**目标：** 实现进度和结果的本地存储管理

**Files:**

- Create: `lib/storage.ts`

- [ ] **Step 1: 创建存储管理器**

创建 `lib/storage.ts`：

```typescript
import { QuizProgress, QuizResult, Answers } from './types';

const STORAGE_KEYS = {
  PROGRESS: 'mbit_progress',
  RESULT: 'mbit_result',
} as const;

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 天

/**
 * 保存答题进度
 */
export function saveProgress(progress: QuizProgress): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

/**
 * 获取答题进度
 */
export function getProgress(): QuizProgress | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!data) return null;

    const progress: QuizProgress = JSON.parse(data);

    // 检查是否过期
    if (Date.now() - progress.timestamp > CACHE_DURATION) {
      clearProgress();
      return null;
    }

    return progress;
  } catch (error) {
    console.error('Failed to get progress:', error);
    return null;
  }
}

/**
 * 清除答题进度
 */
export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
  } catch (error) {
    console.error('Failed to clear progress:', error);
  }
}

/**
 * 保存测试结果
 */
export function saveResult(result: QuizResult): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RESULT, JSON.stringify(result));
  } catch (error) {
    console.error('Failed to save result:', error);
  }
}

/**
 * 获取测试结果
 */
export function getResult(): QuizResult | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RESULT);
    if (!data) return null;

    const result: QuizResult = JSON.parse(data);

    // 检查是否过期
    if (Date.now() - result.completedAt > CACHE_DURATION) {
      clearResult();
      return null;
    }

    return result;
  } catch (error) {
    console.error('Failed to get result:', error);
    return null;
  }
}

/**
 * 清除测试结果
 */
export function clearResult(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.RESULT);
  } catch (error) {
    console.error('Failed to clear result:', error);
  }
}

/**
 * 清除所有缓存数据
 */
export function clearAll(): void {
  clearProgress();
  clearResult();
}
```

- [ ] **Step 2: 提交**

```bash
git add lib/storage.ts
git commit -m "feat: add localStorage manager for progress and results"
```

---

### Task 7: 创建16型人格数据

**目标：** 创建16种人格类型的详细数据（引用公开资料）

**Files:**

- Create: `lib/data/types.json`

- [ ] **Step 1: 创建人格类型数据文件**

创建 `lib/data/types.json`（包含完整的16型数据）：

```json
[
  {
    "type": "INTJ",
    "name": "建筑师",
    "nameEn": "Architect",
    "group": "analyst",
    "dimensions": {
      "EI": { "label": "内向", "value": "I" },
      "SN": { "label": "直觉", "value": "N" },
      "TF": { "label": "思考", "value": "T" },
      "JP": { "label": "判断", "value": "J" }
    },
    "tagline": "富有想象力和战略性的思想家",
    "description": "建筑师型人格是天生的战略家，具有强烈的原创性思维和独立自主的特质。他们既有驱动力又有决心去实现目标，无论这些目标是什么。",
    "traits": ["独立", "战略", "完美主义", "效率", "分析"],
    "strengths": ["战略思维", "高度专注", "独立自主", "理性分析", "追求知识"],
    "weaknesses": ["过度批判", "过分独立", "缺乏耐心", "社交疲劳", "傲慢"],
    "careers": ["软件架构师", "科学家", "战略顾问", "投资分析师", "大学教授", "系统分析师"],
    "compatibility": {
      "best": ["ENTP", "ENFP"],
      "similar": ["INFJ", "INTP"],
      "challenging": ["ESFP", "ESTP"]
    },
    "celebrities": [
      { "name": "埃隆·马斯克", "role": "企业家" },
      { "name": "艾萨克·牛顿", "role": "科学家" },
      { "name": "释迦牟尼", "role": "思想家" }
    ],
    "growth": ["学会接受反馈", "培养同理心", "放松完美主义", "多与外界交流"],
    "source": "16Personalities"
  },
  {
    "type": "INTP",
    "name": "逻辑学家",
    "nameEn": "Logician",
    "group": "analyst",
    "dimensions": {
      "EI": { "label": "内向", "value": "I" },
      "SN": { "label": "直觉", "value": "N" },
      "TF": { "label": "思考", "value": "T" },
      "JP": { "label": "感知", "value": "P" }
    },
    "tagline": "具有创新性的发明家，对知识有着止不住的渴望",
    "description": "逻辑学家型人格以其独特的视角和旺盛的智力而自豪。他们无法忍受无聊的事物，虽然他们经常陷入思考中，但这正是他们的魅力所在。",
    "traits": ["逻辑", "好奇", "灵活", "抽象", "独立"],
    "strengths": ["分析能力", "原创思维", "开放思想", "客观理性", "诚实直率"],
    "weaknesses": ["拖延", "缺乏耐心", "社交笨拙", "过度分析", "情感疏离"],
    "careers": ["研究员", "程序员", "哲学家", "数学家", "数据分析师", "大学教授"],
    "compatibility": {
      "best": ["ENTJ", "ESTJ"],
      "similar": ["INTJ", "INFP"],
      "challenging": ["ESFJ", "ESTJ"]
    },
    "celebrities": [
      { "name": "爱因斯坦", "role": "物理学家" },
      { "name": "苏格拉底", "role": "哲学家" }
    ],
    "growth": ["培养执行力", "增强情感意识", "学会关注他人", "接受不完美"],
    "source": "16Personalities"
  },
  {
    "type": "ENTJ",
    "name": "指挥官",
    "nameEn": "Commander",
    "group": "analyst",
    "dimensions": {
      "EI": { "label": "外向", "value": "E" },
      "SN": { "label": "直觉", "value": "N" },
      "TF": { "label": "思考", "value": "T" },
      "JP": { "label": "判断", "value": "J" }
    },
    "tagline": "大胆、富有想象力且意志强大的领导者",
    "description": "指挥官型人格天生就是领导者，他们拥有魅力、自信和权威，能够激励他人为共同目标而努力。",
    "traits": ["领导力", "自信", "战略", "果断", "野心"],
    "strengths": ["领导能力", "战略思维", "高效执行", "目标导向", "自信果断"],
    "weaknesses": ["过于强势", "缺乏耐心", "不容忍失败", "情感淡漠", "控制欲强"],
    "careers": ["CEO", "管理顾问", "律师", "政治家", "企业家", "项目经理"],
    "compatibility": {
      "best": ["INFP", "INTP"],
      "similar": ["ENTP", "INTJ"],
      "challenging": ["ISFP", "INFP"]
    },
    "celebrities": [
      { "name": "史蒂夫·乔布斯", "role": "企业家" },
      { "name": "玛格丽特·撒切尔", "role": "政治家" }
    ],
    "growth": ["培养同理心", "学会倾听", "放松控制", "欣赏多样性"],
    "source": "16Personalities"
  },
  {
    "type": "ENTP",
    "name": "辩论家",
    "nameEn": "Debater",
    "group": "analyst",
    "dimensions": {
      "EI": { "label": "外向", "value": "E" },
      "SN": { "label": "直觉", "value": "N" },
      "TF": { "label": "思考", "value": "T" },
      "JP": { "label": "感知", "value": "P" }
    },
    "tagline": "聪明好奇的思想者，无法抗拒智力上的挑战",
    "description": "辩论家型人格是真正的魔鬼代言人，他们以拆解和重建想法、观念、方法和人为乐，无论是为了娱乐还是为了实现某种更深层的目标。",
    "traits": ["机智", "创新", "好奇", "灵活", "善辩"],
    "strengths": ["知识渊博", "思维敏捷", "原创性强", "魅力十足", "精力充沛"],
    "weaknesses": ["好辩", "注意力分散", "难以专注", "不敏感", "不耐烦"],
    "careers": ["律师", "顾问", "记者", "创业者", "投资分析师", "市场营销"],
    "compatibility": {
      "best": ["INFJ", "INTJ"],
      "similar": ["ENTJ", "INTP"],
      "challenging": ["ISFJ", "ISTJ"]
    },
    "celebrities": [
      { "name": "马克·吐温", "role": "作家" },
      { "name": "本杰明·富兰克林", "role": "发明家" }
    ],
    "growth": ["培养专注力", "学会倾听", "控制好辩冲动", "重视他人情感"],
    "source": "16Personalities"
  },
  {
    "type": "INFJ",
    "name": "提倡者",
    "nameEn": "Advocate",
    "group": "diplomat",
    "dimensions": {
      "EI": { "label": "内向", "value": "I" },
      "SN": { "label": "直觉", "value": "N" },
      "TF": { "label": "情感", "value": "F" },
      "JP": { "label": "判断", "value": "J" }
    },
    "tagline": "安静而神秘，鼓舞人心且不知疲倦的理想主义者",
    "description": "提倡者型人格有着深刻的思想和强烈的信念，这赋予了他们实现目标的创造力、想象力和决心。",
    "traits": ["理想主义", "洞察力", "富有同情心", "有原则", "深思"],
    "strengths": ["洞察力强", "有原则", "富有同情心", "创造力", "利他主义"],
    "weaknesses": ["过度敏感", "追求完美", "容易倦怠", "过于私密", "难以接受批评"],
    "careers": ["心理咨询师", "作家", "非营利组织", "人力资源", "教育工作者", "社会工作者"],
    "compatibility": {
      "best": ["ENTP", "ENFP"],
      "similar": ["INTJ", "INFP"],
      "challenging": ["ESTP", "ESTJ"]
    },
    "celebrities": [
      { "name": "甘地", "role": "政治家" },
      { "name": "马丁·路德·金", "role": "民权领袖" },
      { "name": "柏拉图", "role": "哲学家" }
    ],
    "growth": ["设定边界", "学会接受不完美", "关注自我照顾", "更开放地表达"],
    "source": "16Personalities"
  },
  {
    "type": "INFP",
    "name": "调停者",
    "nameEn": "Mediator",
    "group": "diplomat",
    "dimensions": {
      "EI": { "label": "内向", "value": "I" },
      "SN": { "label": "直觉", "value": "N" },
      "TF": { "label": "情感", "value": "F" },
      "JP": { "label": "感知", "value": "P" }
    },
    "tagline": "诗意、善良的利他主义者，总是热情地为正义事业提供帮助",
    "description": "调停者型人格是真正的理想主义者，他们总是从最坏的人和事中寻找一丝善意，寻求让事情变得更好的方法。",
    "traits": ["理想主义", "忠诚", "适应性", "好奇", "富有创造力"],
    "strengths": ["富有同情心", "创造力强", "开放思想", "灵活适应", "热情洋溢"],
    "weaknesses": ["过于理想化", "难以处理实际", "自我批评", "难以处理冲突", "情绪化"],
    "careers": ["艺术家", "作家", "心理咨询师", "教师", "社会工作者", "平面设计师"],
    "compatibility": {
      "best": ["ENFJ", "ENTJ"],
      "similar": ["INFJ", "ISFP"],
      "challenging": ["ESTJ", "ESTP"]
    },
    "celebrities": [
      { "name": "莎士比亚", "role": "作家" },
      { "name": "J.R.R. 托尔金", "role": "作家" },
      { "name": "约翰·列侬", "role": "音乐家" }
    ],
    "growth": ["培养现实感", "学会接受批评", "增强行动力", "设定现实目标"],
    "source": "16Personalities"
  },
  {
    "type": "ENFJ",
    "name": "主人公",
    "nameEn": "Protagonist",
    "group": "diplomat",
    "dimensions": {
      "EI": { "label": "外向", "value": "E" },
      "SN": { "label": "直觉", "value": "N" },
      "TF": { "label": "情感", "value": "F" },
      "JP": { "label": "判断", "value": "J" }
    },
    "tagline": "有魅力、鼓舞人心的领导者，有着令听众着迷的能力",
    "description": "主人公型人格是天生的领导者，充满激情和魅力，他们善于激励他人，并为共同的目标而努力。",
    "traits": ["魅力", "利他", "可靠", "领导力", "天生领袖"],
    "strengths": ["领导能力", "富有同情心", "善于沟通", "热情洋溢", "值得信赖"],
    "weaknesses": ["过于理想化", "无私到 detriment", "难以做艰难决定", "易受批评影响", "过于敏感"],
    "careers": ["教师", "人力资源总监", "非营利组织领导", "政治家", "教练", "顾问"],
    "compatibility": {
      "best": ["INFP", "ISFP"],
      "similar": ["ENFP", "INFJ"],
      "challenging": ["ISTP", "INTP"]
    },
    "celebrities": [
      { "name": "奥普拉·温弗瑞", "role": "媒体人" },
      { "name": "巴拉克·奥巴马", "role": "政治家" }
    ],
    "growth": ["学会说不", "关注自我需求", "接受不完美", "管理批评"],
    "source": "16Personalities"
  },
  {
    "type": "ENFP",
    "name": "竞选者",
    "nameEn": "Campaigner",
    "group": "diplomat",
    "dimensions": {
      "EI": { "label": "外向", "value": "E" },
      "SN": { "label": "直觉", "value": "N" },
      "TF": { "label": "情感", "value": "F" },
      "JP": { "label": "感知", "value": "P" }
    },
    "tagline": "充满热情、有创造力的自由主义者，总是能找到理由微笑",
    "description": "竞选者型人格是真正自由的精神，他们通常是聚会的焦点，但他们对社交和娱乐的兴趣不如对与他人建立情感联系的享受。",
    "traits": ["热情", "创造力", "社交", "自由精神", "好奇"],
    "strengths": ["富有好奇心", "善于观察", "精力充沛", "优秀沟通者", "易于相处"],
    "weaknesses": ["注意力分散", "难以专注", "思绪飞扬", "情绪化", "压力下表现不佳"],
    "careers": ["记者", "演员", "顾问", "公关专员", "活动家", "创业者"],
    "compatibility": {
      "best": ["INTJ", "INFJ"],
      "similar": ["ENFJ", "INFP"],
      "challenging": ["ISTJ", "ISFJ"]
    },
    "celebrities": [
      { "name": "罗宾·威廉姆斯", "role": "演员" },
      { "name": "威尔·史密斯", "role": "演员" },
      { "name": "马克·吐温", "role": "作家" }
    ],
    "growth": ["培养专注力", "学会管理时间", "接受结构", "增强执行力"],
    "source": "16Personalities"
  },
  {
    "type": "ISTJ",
    "name": "物流师",
    "nameEn": "Logistician",
    "group": "sentinel",
    "dimensions": {
      "EI": { "label": "内向", "value": "I" },
      "SN": { "label": "实感", "value": "S" },
      "TF": { "label": "思考", "value": "T" },
      "JP": { "label": "判断", "value": "J" }
    },
    "tagline": "实际且注重事实的个人，可靠性不容怀疑",
    "description": "物流师型人格被认为是数量最多、最常见的类型，他们构成了社会的基础，因为他们值得信赖、注重事实、坚韧不拔。",
    "traits": ["可靠", "务实", "注重事实", "忠诚", "有组织"],
    "strengths": ["诚实直接", "意志坚定", "负责任", "务实冷静", "注重秩序"],
    "weaknesses": ["固执己见", "不善判断", "难以适应变化", "过于严厉", "自责"],
    "careers": ["会计师", "审计师", "数据分析师", "法官", "警官", "军官"],
    "compatibility": {
      "best": ["ESFP", "ESTP"],
      "similar": ["ISFJ", "INTJ"],
      "challenging": ["ENFP", "ENTP"]
    },
    "celebrities": [
      { "name": "乔治·华盛顿", "role": "政治家" },
      { "name": "沃伦·巴菲特", "role": "投资家" }
    ],
    "growth": ["培养灵活性", "学会表达情感", "接受变化", "放松完美主义"],
    "source": "16Personalities"
  },
  {
    "type": "ISFJ",
    "name": "守卫者",
    "nameEn": "Defender",
    "group": "sentinel",
    "dimensions": {
      "EI": { "label": "内向", "value": "I" },
      "SN": { "label": "实感", "value": "S" },
      "TF": { "label": "情感", "value": "F" },
      "JP": { "label": "判断", "value": "J" }
    },
    "tagline": "非常专注而温暖的保护者，时刻准备着保护爱着的人们",
    "description": "守卫者型人格是真正利他的人格类型，他们以热情和保护的态度对待他人，但可能在社交场合感到疲惫。",
    "traits": ["支持", "耐心", "可靠", "观察力", "温暖"],
    "strengths": ["支持性强", "可靠值得信赖", "观察敏锐", "热情友好", "负责任"],
    "weaknesses": ["过度谦虚", "情感压抑", "难以接受批评", "过度负荷", "不愿改变"],
    "careers": ["护士", "行政助理", "咨询师", "小学教师", "社会工作者", "办公室经理"],
    "compatibility": {
      "best": ["ESTP", "ESFP"],
      "similar": ["ISTJ", "INFJ"],
      "challenging": ["ENTP", "ENTJ"]
    },
    "celebrities": [
      { "name": "特蕾莎修女", "role": "慈善家" },
      { "name": "金·卡戴珊", "role": "名人" }
    ],
    "growth": ["学会说不", "表达自我需求", "接受赞扬", "拥抱改变"],
    "source": "16Personalities"
  },
  {
    "type": "ESTJ",
    "name": "总经理",
    "nameEn": "Executive",
    "group": "sentinel",
    "dimensions": {
      "EI": { "label": "外向", "value": "E" },
      "SN": { "label": "实感", "value": "S" },
      "TF": { "label": "思考", "value": "T" },
      "JP": { "label": "判断", "value": "J" }
    },
    "tagline": "出色的管理者，在管理事情或人的时候无与伦比",
    "description": "总经理型人格代表了传统和秩序，他们利用自己对是非、对错的理解来团结家庭和社区。",
    "traits": ["专注", "传统", "有组织", "果断", "诚实"],
    "strengths": ["专注目标", "意志坚定", "诚实直接", "忠诚可靠", "有条不紊"],
    "weaknesses": ["固执己见", "不容忍失败", "难以表达情感", "过于严厉", "不耐烦"],
    "careers": ["军官", "法官", "学校校长", "项目经理", "银行经理", "警官"],
    "compatibility": {
      "best": ["ISFP", "INFP"],
      "similar": ["ESFJ", "ISTJ"],
      "challenging": ["INTP", "INFP"]
    },
    "celebrities": [
      { "name": "哈里·杜鲁门", "role": "政治家" },
      { "name": "阿诺·施瓦辛格", "role": "演员/政治家" }
    ],
    "growth": ["培养同理心", "接受不同方式", "放松控制", "倾听他人"],
    "source": "16Personalities"
  },
  {
    "type": "ESFJ",
    "name": "执政官",
    "nameEn": "Consul",
    "group": "sentinel",
    "dimensions": {
      "EI": { "label": "外向", "value": "E" },
      "SN": { "label": "实感", "value": "S" },
      "TF": { "label": "情感", "value": "F" },
      "JP": { "label": "判断", "value": "J" }
    },
    "tagline": "极度关心他人、社交能力强、总是热心帮助",
    "description": "执政官型人格对他人的关注发自内心，他们以极大的热情和精力来帮助他人，总是为他人着想。",
    "traits": ["社交", "传统", "支持", "可靠", "热情"],
    "strengths": ["实用性强", "社交活跃", "有责任感", "忠诚可靠", "耐心细致"],
    "weaknesses": ["过于在意他人看法", "难以创新", "脆弱敏感", "回避冲突", "自私自利"],
    "careers": ["教师", "人力资源专员", "公关专员", "办公室行政", "咨询师", "活动策划"],
    "compatibility": {
      "best": ["ISFP", "INFP"],
      "similar": ["ESTJ", "ENFJ"],
      "challenging": ["INTP", "INTJ"]
    },
    "celebrities": [
      { "name": "泰勒·斯威夫特", "role": "歌手" },
      { "name": "比尔·克林顿", "role": "政治家" }
    ],
    "growth": ["培养独立性", "学会接受批评", "关注自我需求", "拥抱变化"],
    "source": "16Personalities"
  },
  {
    "type": "ISTP",
    "name": "鉴赏家",
    "nameEn": "Virtuoso",
    "group": "explorer",
    "dimensions": {
      "EI": { "label": "内向", "value": "I" },
      "SN": { "label": "实感", "value": "S" },
      "TF": { "label": "思考", "value": "T" },
      "JP": { "label": "感知", "value": "P" }
    },
    "tagline": "大胆而实际的实验家，擅长使用各种工具",
    "description": "鉴赏家型人格通常是天生的制造者，他们从学习事物是如何运作的过程中获得乐趣，他们会用双手和眼睛拆解并重建一切。",
    "traits": ["好奇", "实用", "放松", "灵活", "解决问题"],
    "strengths": ["乐观活力", "创造力强", "实际理性", "突发状况处理", "适应力强"],
    "weaknesses": ["情感淡漠", "容易厌倦", "冒险行为", "隐私过度", "承诺困难"],
    "careers": ["工程师", "技师", "飞行员", "警官", "消防员", "运动员"],
    "compatibility": {
      "best": ["ESFJ", "ESTJ"],
      "similar": ["ISFP", "INTP"],
      "challenging": ["ENFJ", "INFJ"]
    },
    "celebrities": [
      { "name": "汤姆·克鲁斯", "role": "演员" },
      { "name": "熊格里尔斯", "role": "探险家" }
    ],
    "growth": ["培养长期规划", "表达情感", "建立承诺", "考虑他人"],
    "source": "16Personalities"
  },
  {
    "type": "ISFP",
    "name": "探险家",
    "nameEn": "Adventurer",
    "group": "explorer",
    "dimensions": {
      "EI": { "label": "内向", "value": "I" },
      "SN": { "label": "实感", "value": "S" },
      "TF": { "label": "情感", "value": "F" },
      "JP": { "label": "感知", "value": "P" }
    },
    "tagline": "灵活有魅力的艺术家，时刻准备着探索和体验新事物",
    "description": "探险家型人格是真正的艺术家，但不一定是典型意义上的画家。他们利用自己的审美和设计来创造令人惊叹的事物。",
    "traits": ["艺术", "敏感", "友善", "谦逊", "现实"],
    "strengths": ["富有魅力", "想象力丰富", "创造力强", "热情洋溢", "善解人意"],
    "weaknesses": ["过于敏感", "缺乏长期规划", "难以预测", "独立倾向", "情感波动"],
    "careers": ["艺术家", "设计师", "音乐家", "摄影师", "时装设计师", "景观建筑师"],
    "compatibility": {
      "best": ["ESTJ", "ESFJ"],
      "similar": ["ISTP", "INFP"],
      "challenging": ["ENTJ", "ESTJ"]
    },
    "celebrities": [
      { "name": "鲍勃·迪伦", "role": "音乐家" },
      { "name": "约翰尼·德普", "role": "演员" },
      { "name": "迈克尔·杰克逊", "role": "音乐家" }
    ],
    "growth": ["培养长期目标", "增强自信", "学会表达需求", "减少敏感性"],
    "source": "16Personalities"
  },
  {
    "type": "ESTP",
    "name": "企业家",
    "nameEn": "Entrepreneur",
    "group": "explorer",
    "dimensions": {
      "EI": { "label": "外向", "value": "E" },
      "SN": { "label": "实感", "value": "S" },
      "TF": { "label": "思考", "value": "T" },
      "JP": { "label": "感知", "value": "P" }
    },
    "tagline": "聪明精力充沛的感知者，真心享受生活在边缘",
    "description": "企业家型人格总是对周围环境产生影响，他们以行动为导向，善于发现机会并快速行动。",
    "traits": ["大胆", "直接", "感知敏锐", "实用", "精力充沛"],
    "strengths": ["观察力敏锐", "适应力强", "精力充沛", "实用主义", "不怕冒险"],
    "weaknesses": ["冲动", "缺乏耐心", "不善规划", "可能冒险", "情感淡漠"],
    "careers": ["销售代表", "企业家", "警察", "股票经纪人", "消防员", "公关"],
    "compatibility": {
      "best": ["ISFJ", "ISTJ"],
      "similar": ["ESFP", "ISTP"],
      "challenging": ["INFJ", "INTJ"]
    },
    "celebrities": [
      { "name": "唐纳德·特朗普", "role": "政治家/商人" },
      { "name": "麦当娜", "role": "歌手" },
      { "name": "埃迪·墨菲", "role": "演员" }
    ],
    "growth": ["培养长远思考", "学习规划", "关注他人感受", "培养耐心"],
    "source": "16Personalities"
  },
  {
    "type": "ESFP",
    "name": "表演者",
    "nameEn": "Entertainer",
    "group": "explorer",
    "dimensions": {
      "EI": { "label": "外向", "value": "E" },
      "SN": { "label": "实感", "value": "S" },
      "TF": { "label": "情感", "value": "F" },
      "JP": { "label": "感知", "value": "P" }
    },
    "tagline": "自然的表演者，生活充满激情和乐趣",
    "description": "表演者型人格总是聚会的焦点，他们以娱乐他人为乐，周围的人总能感受到他们的热情和乐观。",
    "traits": ["热情", "社交", "自发", "务实", "观察力"],
    "strengths": ["大胆原创", "美学感知", "表演能力", "实用务实", "观察敏锐"],
    "weaknesses": ["敏感", "厌恶冲突", "缺乏长期规划", "难以集中", "容易厌倦"],
    "careers": ["演员", "销售", "咨询师", "儿童教育", "活动策划", "公关"],
    "compatibility": {
      "best": ["ISFJ", "ISTJ"],
      "similar": ["ESTP", "ISFP"],
      "challenging": ["INTJ", "INFJ"]
    },
    "celebrities": [
      { "name": "玛丽莲·梦露", "role": "演员" },
      { "name": "史蒂文·斯皮尔伯格", "role": "导演" },
      { "name": "罗纳德·里根", "role": "政治家/演员" }
    ],
    "growth": ["培养长期目标", "学会专注", "面对冲突", "规划未来"],
    "source": "16Personalities"
  }
]
```

- [ ] **Step 2: 创建数据访问函数**

创建 `lib/data/index.ts`：

```typescript
import { PersonalityType, MBTIType } from '../types';
import typesData from './types.json';

const types: PersonalityType[] = typesData as PersonalityType[];

/**
 * 获取所有人格类型
 */
export function getAllTypes(): PersonalityType[] {
  return types;
}

/**
 * 根据类型代码获取详细信息
 */
export function getTypeByCode(code: MBTIType): PersonalityType | undefined {
  return types.find(t => t.type === code);
}

/**
 * 根据分组获取类型
 */
export function getTypesByGroup(group: 'analyst' | 'diplomat' | 'sentinel' | 'explorer'): PersonalityType[] {
  return types.filter(t => t.group === group);
}

/**
 * 获取类型颜色类名
 */
export function getTypeColorClass(group: PersonalityType['group']): string {
  const colorMap = {
    analyst: 'bg-analyst text-analyst-foreground',
    diplomat: 'bg-diplomat text-diplomat-foreground',
    sentinel: 'bg-sentinel text-sentinel-foreground',
    explorer: 'bg-explorer text-explorer-foreground',
  };
  return colorMap[group];
}
```

- [ ] **Step 3: 提交**

```bash
git add lib/data/
git commit -m "feat: add 16 personality types data with access functions"
```

---

## 阶段 3：题目数据

### Task 8: 创建快速测试题目（12题）

**目标：** 创建快速测试的12道题目

**Files:**

- Create: `lib/questions/quick.ts`

- [ ] **Step 1: 创建快速测试题目**

创建 `lib/questions/quick.ts`：

```typescript
import { Question } from '../types';

export const quickQuestions: Question[] = [
  // E/I 维度 (3题)
  {
    id: 1,
    dimension: 'EI',
    text: "在社交聚会中，你通常会？",
    options: [
      { text: "主动认识新朋友，享受热闹的氛围", value: 1 },
      { text: "和熟悉的朋友聊天，或者静静观察", value: -1 }
    ]
  },
  {
    id: 2,
    dimension: 'EI',
    text: "忙碌了一周后，你更倾向于？",
    options: [
      { text: "和朋友出去玩，放松心情", value: 1 },
      { text: "独自在家休息，充电恢复", value: -1 }
    ]
  },
  {
    id: 3,
    dimension: 'EI',
    text: "在团队讨论中，你通常？",
    options: [
      { text: "积极发言，分享自己的想法", value: 1 },
      { text: "先倾听思考，再选择时机发言", value: -1 }
    ]
  },

  // S/N 维度 (3题)
  {
    id: 4,
    dimension: 'SN',
    text: "你更关注？",
    options: [
      { text: "眼前的现实和具体细节", value: 1 },
      { text: "未来的可能性和整体图景", value: -1 }
    ]
  },
  {
    id: 5,
    dimension: 'SN',
    text: "学习新东西时，你更喜欢？",
    options: [
      { text: "循序渐进，从基础开始", value: 1 },
      { text: "先了解整体概念，再深入细节", value: -1 }
    ]
  },
  {
    id: 6,
    dimension: 'SN',
    text: "你更相信？",
    options: [
      { text: "过往的经验和确凿的事实", value: 1 },
      { text: "直觉和灵感", value: -1 }
    ]
  },

  // T/F 维度 (3题)
  {
    id: 7,
    dimension: 'TF',
    text: "做决定时，你更看重？",
    options: [
      { text: "逻辑分析和客观事实", value: 1 },
      { text: "个人价值观和他人感受", value: -1 }
    ]
  },
  {
    id: 8,
    dimension: 'TF',
    text: "朋友遇到困难，你首先会？",
    options: [
      { text: "分析问题，提供解决方案", value: 1 },
      { text: "表达同情，给予情感支持", value: -1 }
    ]
  },
  {
    id: 9,
    dimension: 'TF',
    text: "你认为更重要的是？",
    options: [
      { text: "公正和真理", value: 1 },
      { text: "和谐和同情", value: -1 }
    ]
  },

  // J/P 维度 (3题)
  {
    id: 10,
    dimension: 'JP',
    text: "处理日常事务时，你倾向于？",
    options: [
      { text: "提前计划，按清单执行", value: 1 },
      { text: "灵活应对，随性而为", value: -1 }
    ]
  },
  {
    id: 11,
    dimension: 'JP',
    text: "面对突如其来的变化，你的反应是？",
    options: [
      { text: "感到不安，希望有准备时间", value: 1 },
      { text: "欣然接受，喜欢新鲜感", value: -1 }
    ]
  },
  {
    id: 12,
    dimension: 'JP',
    text: "你的工作风格更像是？",
    options: [
      { text: "按时完成，不喜欢拖延", value: 1 },
      { text: "在截止日期前冲刺", value: -1 }
    ]
  }
];
```

- [ ] **Step 2: 提交**

```bash
git add lib/questions/quick.ts
git commit -m "feat: add quick test questions (12 questions)"
```

---

### Task 9: 创建完整测试题目（60题）

**目标：** 创建完整测试的60道题目

**Files:**

- Create: `lib/questions/full.ts`

- [ ] **Step 1: 创建完整测试题目**

创建 `lib/questions/full.ts`（包含60道完整题目，每维度15题）：

```typescript
import { Question } from '../types';

export const fullQuestions: Question[] = [
  // E/I 维度 (15题)
  {
    id: 1,
    dimension: 'EI',
    text: "在社交场合中，你通常会？",
    options: [
      { text: "主动介绍自己，积极与人交流", value: 1 },
      { text: "等待他人来交谈，或选择观察", value: -1 }
    ]
  },
  {
    id: 2,
    dimension: 'EI',
    text: "你更喜欢什么样的工作环境？",
    options: [
      { text: "开放热闹，同事频繁互动", value: 1 },
      { text: "安静独立，可以专注工作", value: -1 }
    ]
  },
  {
    id: 3,
    dimension: 'EI',
    text: "周末休息时，你更倾向于？",
    options: [
      { text: "和朋友聚会或参加活动", value: 1 },
      { text: "独自在家做喜欢的事", value: -1 }
    ]
  },
  {
    id: 4,
    dimension: 'EI',
    text: "当你需要精力恢复时，你会？",
    options: [
      { text: "和他人聊天互动", value: 1 },
      { text: "独处充电", value: -1 }
    ]
  },
  {
    id: 5,
    dimension: 'EI',
    text: "在会议上，你通常？",
    options: [
      { text: "积极发言，表达观点", value: 1 },
      { text: "多听少说，深思熟虑后发言", value: -1 }
    ]
  },
  {
    id: 6,
    dimension: 'EI',
    text: "你被认为是？",
    options: [
      { text: "开放健谈的", value: 1 },
      { text: "深沉内敛的", value: -1 }
    ]
  },
  {
    id: 7,
    dimension: 'EI',
    text: "面对陌生人，你会？",
    options: [
      { text: "主动开启话题", value: 1 },
      { text: "等待对方先说话", value: -1 }
    ]
  },
  {
    id: 8,
    dimension: 'EI',
    text: "你的朋友圈？",
    options: [
      { text: "广泛，认识很多人", value: 1 },
      { text: "小而精，几位深交好友", value: -1 }
    ]
  },
  {
    id: 9,
    dimension: 'EI',
    text: "成为注意力的焦点让你感觉？",
    options: [
      { text: "舒适自在", value: 1 },
      { text: "不太自在", value: -1 }
    ]
  },
  {
    id: 10,
    dimension: 'EI',
    text: "你更喜欢？",
    options: [
      { text: "团队合作", value: 1 },
      { text: "独立工作", value: -1 }
    ]
  },
  {
    id: 11,
    dimension: 'EI',
    text: "打电话给你？",
    options: [
      { text: "喜欢通话，感觉更直接", value: 1 },
      { text: "更喜欢发信息，可以思考", value: -1 }
    ]
  },
  {
    id: 12,
    dimension: 'EI',
    text: "在聚会上，你会？",
    options: [
      { text: "四处走动，和不同人聊天", value: 1 },
      { text: "和熟悉的人深入交谈", value: -1 }
    ]
  },
  {
    id: 13,
    dimension: 'EI',
    text: "你如何结识新朋友？",
    options: [
      { text: "经常主动认识新人", value: 1 },
      { text: "通过现有朋友介绍", value: -1 }
    ]
  },
  {
    id: 14,
    dimension: 'EI',
    text: "社交后你感觉？",
    options: [
      { text: "精力充沛，意犹未尽", value: 1 },
      { text: "有些疲惫，需要独处", value: -1 }
    ]
  },
  {
    id: 15,
    dimension: 'EI',
    text: "你被认为是？",
    options: [
      { text: "外向开朗的", value: 1 },
      { text: "安静内向的", value: -1 }
    ]
  },

  // S/N 维度 (15题)
  {
    id: 16,
    dimension: 'SN',
    text: "你更关注？",
    options: [
      { text: "当下的现实和具体细节", value: 1 },
      { text: "未来的可能性和抽象概念", value: -1 }
    ]
  },
  {
    id: 17,
    dimension: 'SN',
    text: "你更相信？",
    options: [
      { text: "确凿的经验和事实", value: 1 },
      { text: "灵感和直觉", value: -1 }
    ]
  },
  {
    id: 18,
    dimension: 'SN',
    text: "学习新技能时，你喜欢？",
    options: [
      { text: "按步骤循序渐进", value: 1 },
      { text: "了解整体概念后再深入", value: -1 }
    ]
  },
  {
    id: 19,
    dimension: 'SN',
    text: "你更擅长？",
    options: [
      { text: "处理实际和具体的事务", value: 1 },
      { text: "构思抽象的理论和想法", value: -1 }
    ]
  },
  {
    id: 20,
    dimension: 'SN',
    text: "听故事时，你更注意？",
    options: [
      { text: "具体的细节和描述", value: 1 },
      { text: "背后的含义和主题", value: -1 }
    ]
  },
  {
    id: 21,
    dimension: 'SN',
    text: "你更喜欢？",
    options: [
      { text: "实用的、有明确结果的", value: 1 },
      { text: "创新的、有想象力的", value: -1 }
    ]
  },
  {
    id: 22,
    dimension: 'SN',
    text: "做计划时，你倾向于？",
    options: [
      { text: "考虑具体的步骤和细节", value: 1 },
      { text: "想象最终的结果和愿景", value: -1 }
    ]
  },
  {
    id: 23,
    dimension: 'SN',
    text: "你更容易记住？",
    options: [
      { text: "发生的事情和细节", value: 1 },
      { text: "事情的含义和感受", value: -1 }
    ]
  },
  {
    id: 24,
    dimension: 'SN',
    text: "你更感兴趣于？",
    options: [
      { text: "事物的现状和运作方式", value: 1 },
      { text: "事物的未来可能性", value: -1 }
    ]
  },
  {
    id: 25,
    dimension: 'SN',
    text: "解决问题时，你倾向于？",
    options: [
      { text: "使用已验证的方法", value: 1 },
      { text: "尝试新的创新方法", value: -1 }
    ]
  },
  {
    id: 26,
    dimension: 'SN',
    text: "你认为自己是？",
    options: [
      { text: "务实的人", value: 1 },
      { text: "有想象力的人", value: -1 }
    ]
  },
  {
    id: 27,
    dimension: 'SN',
    text: "你更喜欢？",
    options: [
      { text: "确定和可预测的", value: 1 },
      { text: "未知和充满可能性的", value: -1 }
    ]
  },
  {
    id: 28,
    dimension: 'SN',
    text: "面对信息，你首先关注？",
    options: [
      { text: "具体的数据和事实", value: 1 },
      { text: "整体的模式和趋势", value: -1 }
    ]
  },
  {
    id: 29,
    dimension: 'SN',
    text: "你更欣赏？",
    options: [
      { text: "脚踏实地的品质", value: 1 },
      { text: "富有创意的思维", value: -1 }
    ]
  },
  {
    id: 30,
    dimension: 'SN',
    text: "在对话中，你更喜欢讨论？",
    options: [
      { text: "具体的、日常的话题", value: 1 },
      { text: "抽象的、理论的想法", value: -1 }
    ]
  },

  // T/F 维度 (15题)
  {
    id: 31,
    dimension: 'TF',
    text: "做决定时，你更依赖？",
    options: [
      { text: "逻辑分析和客观标准", value: 1 },
      { text: "个人价值观和情感", value: -1 }
    ]
  },
  {
    id: 32,
    dimension: 'TF',
    text: "你认为更重要的是？",
    options: [
      { text: "公正和真理", value: 1 },
      { text: "和谐和同情", value: -1 }
    ]
  },
  {
    id: 33,
    dimension: 'TF',
    text: "朋友遇到困难，你会？",
    options: [
      { text: "分析问题，提供解决方案", value: 1 },
      { text: "表达同情，给予情感支持", value: -1 }
    ]
  },
  {
    id: 34,
    dimension: 'TF',
    text: "你更看重？",
    options: [
      { text: "原则和一致性", value: 1 },
      { text: "人际关系和感受", value: -1 }
    ]
  },
  {
    id: 35,
    dimension: 'TF',
    text: "给出反馈时，你会？",
    options: [
      { text: "直接指出问题和不足", value: 1 },
      { text: "委婉表达，顾及对方感受", value: -1 }
    ]
  },
  {
    id: 36,
    dimension: 'TF',
    text: "你更容易被什么说服？",
    options: [
      { text: "逻辑论证和数据", value: 1 },
      { text: "情感诉求和个人故事", value: -1 }
    ]
  },
  {
    id: 37,
    dimension: 'TF',
    text: "处理冲突时，你倾向于？",
    options: [
      { text: "分析问题，寻找解决方案", value: 1 },
      { text: "关注各方感受，寻求和解", value: -1 }
    ]
  },
  {
    id: 38,
    dimension: 'TF',
    text: "你认为更好的称赞是？",
    options: [
      { text: "你很能干、很专业", value: 1 },
      { text: "你很善良、很贴心", value: -1 }
    ]
  },
  {
    id: 39,
    dimension: 'TF',
    text: "做选择时，你更在意？",
    options: [
      { text: "是否合理和正确", value: 1 },
      { text: "对自己和他人的影响", value: -1 }
    ]
  },
  {
    id: 40,
    dimension: 'TF',
    text: "你更倾向于？",
    options: [
      { text: "客观公正，即使可能伤人", value: 1 },
      { text: "友善和谐，避免冲突", value: -1 }
    ]
  },
  {
    id: 41,
    dimension: 'TF',
    text: "你认为自己是？",
    options: [
      { text: "理性的人", value: 1 },
      { text: "感性的人", value: -1 }
    ]
  },
  {
    id: 42,
    dimension: 'TF',
    text: "在团队中，你更看重？",
    options: [
      { text: "效率和成果", value: 1 },
      { text: "团队氛围和关系", value: -1 }
    ]
  },
  {
    id: 43,
    dimension: 'TF',
    text: "面对错误，你会？",
    options: [
      { text: "分析原因，避免再犯", value: 1 },
      { text: "关心犯错者的感受", value: -1 }
    ]
  },
  {
    id: 44,
    dimension: 'TF',
    text: "你更信任？",
    options: [
      { text: "头脑的决定", value: 1 },
      { text: "内心的感受", value: -1 }
    ]
  },
  {
    id: 45,
    dimension: 'TF',
    text: "你认为成功更依赖于？",
    options: [
      { text: "能力和策略", value: 1 },
      { text: "人际关系和运气", value: -1 }
    ]
  },

  // J/P 维度 (15题)
  {
    id: 46,
    dimension: 'JP',
    text: "你的日常风格更像？",
    options: [
      { text: "有计划，按日程行事", value: 1 },
      { text: "灵活随性，顺其自然", value: -1 }
    ]
  },
  {
    id: 47,
    dimension: 'JP',
    text: "面对截止日期，你会？",
    options: [
      { text: "提前完成，预留时间", value: 1 },
      { text: "在压力下冲刺完成", value: -1 }
    ]
  },
  {
    id: 48,
    dimension: 'JP',
    text: "你更喜欢？",
    options: [
      { text: "事情有定论和结果", value: 1 },
      { text: "保持选项开放", value: -1 }
    ]
  },
  {
    id: 49,
    dimension: 'JP',
    text: "计划被打乱时，你会？",
    options: [
      { text: "感到不安，尽快恢复计划", value: 1 },
      { text: "欣然接受，灵活调整", value: -1 }
    ]
  },
  {
    id: 50,
    dimension: 'JP',
    text: "你的工作方式是？",
    options: [
      { text: "分阶段完成，避免最后赶工", value: 1 },
      { text: "最后冲刺，灵感爆发", value: -1 }
    ]
  },
  {
    id: 51,
    dimension: 'JP',
    text: "面对新信息，你会？",
    options: [
      { text: "尽快做出决定", value: 1 },
      { text: "收集更多信息，保持开放", value: -1 }
    ]
  },
  {
    id: 52,
    dimension: 'JP',
    text: "你喜欢？",
    options: [
      { text: "列清单、做计划", value: 1 },
      { text: "随性而为，不喜欢束缚", value: -1 }
    ]
  },
  {
    id: 53,
    dimension: 'JP',
    text: "你的环境通常是？",
    options: [
      { text: "整洁有序", value: 1 },
      { text: "有些混乱但能找到东西", value: -1 }
    ]
  },
  {
    id: 54,
    dimension: 'JP',
    text: "面对变化，你会？",
    options: [
      { text: "希望提前知道，做好准备", value: 1 },
      { text: "喜欢惊喜，随机应变", value: -1 }
    ]
  },
  {
    id: 55,
    dimension: 'JP',
    text: "项目完成后，你会？",
    options: [
      { text: "立即开始下一个计划", value: 1 },
      { text: "享受放松，再考虑下一步", value: -1 }
    ]
  },
  {
    id: 56,
    dimension: 'JP',
    text: "你更喜欢？",
    options: [
      { text: "明确的目标和期限", value: 1 },
      { text: "自由灵活的时间表", value: -1 }
    ]
  },
  {
    id: 57,
    dimension: 'JP',
    text: "做决定时，你会？",
    options: [
      { text: "快速决定，不再犹豫", value: 1 },
      { text: "反复考虑，留有余地", value: -1 }
    ]
  },
  {
    id: 58,
    dimension: 'JP',
    text: "你认为自己是？",
    options: [
      { text: "有组织、有条理的人", value: 1 },
      { text: "灵活、随性的人", value: -1 }
    ]
  },
  {
    id: 59,
    dimension: 'JP',
    text: "面对未完成的任务，你会？",
    options: [
      { text: "感到不安，尽快完成", value: 1 },
      { text: "不太在意，可以等等", value: -1 }
    ]
  },
  {
    id: 60,
    dimension: 'JP',
    text: "你更喜欢？",
    options: [
      { text: "事情按计划进行", value: 1 },
      { text: "顺其自然，享受过程", value: -1 }
    ]
  }
];
```

- [ ] **Step 2: 创建题目导出文件**

创建 `lib/questions/index.ts`：

```typescript
import { Question, TestLength } from '../types';
import { quickQuestions } from './quick';
import { fullQuestions } from './full';

/**
 * 根据测试长度获取题目
 */
export function getQuestions(length: TestLength): Question[] {
  return length === 'quick' ? quickQuestions : fullQuestions;
}

/**
 * 获取题目最大分数（用于计算百分比）
 */
export function getMaxScore(length: TestLength): number {
  return length === 'quick' ? 3 : 15; // 每维度最大得分
}
```

- [ ] **Step 3: 提交**

```bash
git add lib/questions/
git commit -m "feat: add full test questions (60 questions)"
```

---

## 阶段 4：UI 组件

### Task 10: 创建欢迎页组件

**目标：** 创建欢迎页，显示 MBTI 介绍和测试长度选择

**Files:**

- Create: `components/steps/WelcomeStep.tsx`

- [ ] **Step 1: 创建欢迎页组件**

创建 `components/steps/WelcomeStep.tsx`：

```typescript
'use client';

import { TestLength } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Zap } from 'lucide-react';

interface WelcomeStepProps {
  onStart: (length: TestLength) => void;
  hasPreviousResult: boolean;
  onContinuePrevious: () => void;
}

export function WelcomeStep({ onStart, hasPreviousResult, onContinuePrevious }: WelcomeStepProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/标题 */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-analyst via-diplomat to-sentinel bg-clip-text text-transparent">
            MBTI 人格测试
          </h1>
          <p className="text-muted-foreground">
            发现真实的自己
          </p>
        </div>

        {/* 介绍卡片 */}
        <Card className="p-6 border-2 border-dashed">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-diplomat" />
              什么是 MBTI？
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              MBTI 是一种广泛使用的性格测试工具，通过四个维度的分析，
              将人格分为 16 种类型。了解你的性格类型可以帮助你：
            </p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-analyst">•</span>
                <span>发现你的优势和潜力</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-diplomat">•</span>
                <span>了解适合的职业方向</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sentinel">•</span>
                <span>改善人际关系</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-explorer">•</span>
                <span>实现个人成长</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* 测试长度选择 */}
        <div className="space-y-3">
          <h3 className="text-center font-medium">选择测试长度</h3>

          <Button
            onClick={() => onStart('quick')}
            variant="outline"
            className="w-full h-auto py-4 border-2 hover:border-explorer hover:bg-explorer/5 group"
          >
            <div className="flex items-center justify-between w-full">
              <div className="text-left">
                <div className="font-semibold group-hover:text-explorer transition-colors">
                  快速测试
                </div>
                <div className="text-xs text-muted-foreground">
                  12 道题 · 约 2 分钟
                </div>
              </div>
              <Zap className="w-5 h-5 text-explorer" />
            </div>
          </Button>

          <Button
            onClick={() => onStart('full')}
            variant="outline"
            className="w-full h-auto py-4 border-2 hover:border-analyst hover:bg-analyst/5 group"
          >
            <div className="flex items-center justify-between w-full">
              <div className="text-left">
                <div className="font-semibold group-hover:text-analyst transition-colors">
                  完整测试
                </div>
                <div className="text-xs text-muted-foreground">
                  60 道题 · 约 10 分钟
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-analyst" />
            </div>
          </Button>
        </div>

        {/* 恢复上次结果 */}
        {hasPreviousResult && (
          <Button
            onClick={onContinuePrevious}
            variant="ghost"
            className="w-full text-sm text-muted-foreground"
          >
            查看上次的测试结果
          </Button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add components/steps/WelcomeStep.tsx
git commit -m "feat: add WelcomeStep component"
```

---

### Task 11: 创建答题页组件

**目标：** 创建答题页，显示题目、选项和进度条

**Files:**

- Create: `components/steps/QuizStep.tsx`

- [ ] **Step 1: 创建答题页组件**

创建 `components/steps/QuizStep.tsx`：

```typescript
'use client';

import { useState } from 'react';
import { Question, Answers } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface QuizStepProps {
  questions: Question[];
  initialAnswers: Answers;
  onAnswer: (answers: Answers) => void;
  onComplete: (finalAnswers: Answers) => void;
}

export function QuizStep({ questions, initialAnswers, onAnswer, onComplete }: QuizStepProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;
  const canProceed = selectedValue !== null;

  const handleSelect = (value: number) => {
    setSelectedValue(value);
  };

  const handleNext = () => {
    if (selectedValue === null) return;

    // 更新答案
    const newAnswers = {
      ...answers,
      [currentQuestion.dimension]: answers[currentQuestion.dimension] + selectedValue,
    };
    setAnswers(newAnswers);
    onAnswer(newAnswers);

    if (isLastQuestion) {
      onComplete(newAnswers);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedValue(null);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSelectedValue(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-4 animate-in fade-in duration-300">
      {/* 顶部进度条 */}
      <div className="w-full max-w-2xl mx-auto mb-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>问题 {currentIndex + 1}/{questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* 问题卡片 */}
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-2xl p-6 border-2">
          <div className="space-y-6">
            {/* 问题文本 */}
            <h2 className="text-xl font-medium text-center">
              {currentQuestion.text}
            </h2>

            {/* 选项按钮 */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full p-4 text-left rounded-lg border-2 transition-all duration-200 touch-target
                    ${selectedValue === option.value
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }
                  `}
                >
                  <span className="text-base">{option.text}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* 底部导航按钮 */}
      <div className="w-full max-w-2xl mx-auto flex gap-3 mt-6">
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          variant="outline"
          className="flex-1 touch-target"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          上一题
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="flex-1 touch-target"
        >
          {isLastQuestion ? '查看结果' : '下一题'}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add components/steps/QuizStep.tsx
git commit -m "feat: add QuizStep component"
```

---

### Task 12: 创建计算页组件

**目标：** 创建结果计算时的加载动画页

**Files:**

- Create: `components/steps/CalculatingStep.tsx`

- [ ] **Step 1: 创建计算页组件**

创建 `components/steps/CalculatingStep.tsx`：

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalculatingStepProps {
  onComplete: () => void;
}

export function CalculatingStep({ onComplete }: CalculatingStepProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 模拟计算进度
    const duration = 2000; // 2秒
    const interval = 50;
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => onComplete(), 300);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-8">
        {/* 动画图标 */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-analyst via-diplomat to-sentinel rounded-full blur-xl opacity-50 animate-pulse" />
          <Brain
            className={cn(
              "relative w-24 h-24 text-analyst animate-bounce",
              "transition-colors duration-1000"
            )}
            style={{
              animation: 'pulse-color 2s ease-in-out infinite',
            }}
          />
        </div>

        {/* 文字提示 */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">正在分析你的答案...</h2>
          <p className="text-muted-foreground">计算 MBTI 类型中</p>
        </div>

        {/* 进度条 */}
        <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-analyst via-diplomat to-sentinel transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 分析步骤提示 */}
        <div className="space-y-1 text-sm text-muted-foreground">
          {progress > 20 && <p className="animate-in fade-in slide-in-from-bottom-2">✓ 收集答案</p>}
          {progress > 40 && <p className="animate-in fade-in slide-in-from-bottom-2">✓ 分析维度</p>}
          {progress > 60 && <p className="animate-in fade-in slide-in-from-bottom-2">✓ 计算倾向</p>}
          {progress > 80 && <p className="animate-in fade-in slide-in-from-bottom-2">✓ 匹配类型</p>}
          {progress > 95 && <p className="animate-in fade-in slide-in-from-bottom-2">✓ 生成报告</p>}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-color {
          0%, 100% { color: #8B5CF6; }
          25% { color: #F97316; }
          50% { color: #0EA5E9; }
          75% { color: #EAB308; }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add components/steps/CalculatingStep.tsx
git commit -m "feat: add CalculatingStep component with animation"
```

---

### Task 13: 创建结果页组件

**目标：** 创建结果页，展示 MBTI 类型和详细信息

**Files:**

- Create: `components/steps/ResultStep.tsx`

- [ ] **Step 1: 创建结果页组件**

创建 `components/steps/ResultStep.tsx`：

```typescript
'use client';

import { useState } from 'react';
import { MBTIType, Answers, PersonalityType } from '@/lib/types';
import { getTypeByCode } from '@/lib/data';
import { getDimensionPercentages, formatDimensionLabel } from '@/lib/calculateMBTI';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  RefreshCw,
  Sparkles,
  TrendingUp,
  Users,
  Briefcase,
  Lightbulb,
  Star,
  X,
  ChevronDown
} from 'lucide-react';

interface ResultStepProps {
  type: MBTIType;
  answers: Answers;
  maxScore: number;
  onRestart: () => void;
  onViewOtherTypes: () => void;
}

export function ResultStep({ type, answers, maxScore, onRestart, onViewOtherTypes }: ResultStepProps) {
  const [showDetails, setShowDetails] = useState(false);
  const personality = getTypeByCode(type) as PersonalityType;
  const percentages = getDimensionPercentages(answers, maxScore);

  if (!personality) {
    return null;
  }

  const groupColors = {
    analyst: 'from-analyst/20 to-analyst/5 border-analyst/30',
    diplomat: 'from-diplomat/20 to-diplomat/5 border-diplomat/30',
    sentinel: 'from-sentinel/20 to-sentinel/5 border-sentinel/30',
    explorer: 'from-explorer/20 to-explorer/5 border-explorer/30',
  };

  const groupBadgeColors = {
    analyst: 'bg-analyst text-white',
    diplomat: 'bg-diplomat text-white',
    sentinel: 'bg-sentinel text-white',
    explorer: 'bg-explorer text-white',
  };

  return (
    <div className="min-h-screen p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* 结果标题卡片 */}
        <Card className={`overflow-hidden border-2 bg-gradient-to-br ${groupColors[personality.group]}`}>
          <div className="p-6 space-y-4">
            {/* 类型代码 */}
            <div className="text-center space-y-2">
              <Badge className={`text-lg px-4 py-1 ${groupBadgeColors[personality.group]}`}>
                {personality.type}
              </Badge>
              <h1 className="text-3xl font-bold">{personality.name}</h1>
              <p className="text-sm text-muted-foreground">{personality.nameEn}</p>
            </div>

            {/* 标语 */}
            <p className="text-center text-lg font-medium text-primary">
              "{personality.tagline}"
            </p>

            {/* 标签 */}
            <div className="flex flex-wrap justify-center gap-2">
              {personality.traits.map((trait, index) => (
                <Badge key={index} variant="secondary">
                  {trait}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* 维度分析 */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            维度分析
          </h2>
          <div className="space-y-4">
            {(['EI', 'SN', 'TF', 'JP'] as const).map((dim) => {
              const dimension = personality.dimensions[dim as keyof typeof personality.dimensions];
              const percentage = percentages[dim];
              const positiveLabel = dimension.value;
              const negativeLabel = dim === 'EI' ? (positiveLabel === 'E' ? 'I' : 'E') :
                                   dim === 'SN' ? (positiveLabel === 'S' ? 'N' : 'S') :
                                   dim === 'TF' ? (positiveLabel === 'T' ? 'F' : 'T') :
                                   (positiveLabel === 'J' ? 'P' : 'J');

              return (
                <div key={dim} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{formatDimensionLabel(dim as keyof Answers)}</span>
                    <span className="text-muted-foreground">
                      {positiveLabel} {percentage.positive}%
                    </span>
                  </div>
                  <div className="flex h-3 rounded-full overflow-hidden bg-muted">
                    <div
                      className="bg-primary transition-all duration-500"
                      style={{ width: `${percentage.positive}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{negativeLabel} {percentage.negative}%</span>
                    <span>{positiveLabel} {percentage.positive}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 展开/收起详情按钮 */}
        <Button
          onClick={() => setShowDetails(!showDetails)}
          variant="outline"
          className="w-full"
        >
          {showDetails ? (
            <>收起详细信息 <ChevronDown className="w-4 h-4 ml-2 rotate-180" /></>
          ) : (
            <>查看详细信息 <ChevronDown className="w-4 h-4 ml-2" /></>
          )}
        </Button>

        {/* 详细信息 */}
        {showDetails && (
          <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
            {/* 描述 */}
            <Card className="p-6">
              <h3 className="font-semibold mb-2">关于你</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {personality.description}
              </p>
            </Card>

            {/* 优势 */}
            <Card className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-explorer" />
                你的优势
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {personality.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-explorer" />
                    {strength}
                  </div>
                ))}
              </div>
            </Card>

            {/* 劣势 */}
            <Card className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <X className="w-4 h-4 text-destructive" />
                成长空间
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {personality.weaknesses.map((weakness, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted" />
                    {weakness}
                  </div>
                ))}
              </div>
            </Card>

            {/* 职业建议 */}
            <Card className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-sentinel" />
                适合的职业
              </h3>
              <ScrollArea className="h-24">
                <div className="flex flex-wrap gap-2">
                  {personality.careers.map((career, index) => (
                    <Badge key={index} variant="outline">
                      {career}
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            {/* 关系匹配 */}
            <Card className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-diplomat" />
                关系匹配
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">最佳匹配：</span>
                  <span className="ml-2 font-medium text-diplomat">
                    {personality.compatibility.best.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">相似类型：</span>
                  <span className="ml-2">{personality.compatibility.similar.join(', ')}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">需要磨合：</span>
                  <span className="ml-2">{personality.compatibility.challenging.join(', ')}</span>
                </div>
              </div>
            </Card>

            {/* 名人案例 */}
            <Card className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-analyst" />
                同类型名人
              </h3>
              <div className="space-y-2">
                {personality.celebrities.map((celebrity, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{celebrity.name}</span>
                    <span className="text-muted-foreground">{celebrity.role}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* 成长建议 */}
            <Card className="p-6 border-2 border-dashed border-primary/20">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-primary" />
                成长建议
              </h3>
              <ul className="space-y-2">
                {personality.growth.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* 数据来源 */}
            <p className="text-xs text-center text-muted-foreground">
              数据来源：{personality.source}
            </p>
          </div>
        )}

        <Separator />

        {/* 底部按钮 */}
        <div className="flex gap-3">
          <Button onClick={onRestart} variant="outline" className="flex-1">
            <RefreshCw className="w-4 h-4 mr-2" />
            重新测试
          </Button>
          <Button onClick={onViewOtherTypes} className="flex-1">
            查看其他类型
          </Button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add components/steps/ResultStep.tsx
git commit -m "feat: add ResultStep component with detailed information"
```

---

### Task 14: 创建类型详情弹窗组件

**目标：** 创建用于查看其他类型的弹窗组件

**Files:**

- Create: `components/TypeDetailModal.tsx`

- [ ] **Step 1: 创建类型详情弹窗**

创建 `components/TypeDetailModal.tsx`：

```typescript
'use client';

import { useState } from 'react';
import { MBTIType, PersonalityType } from '@/lib/types';
import { getAllTypes, getTypeByCode } from '@/lib/data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';

interface TypeDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialType?: MBTIType;
}

export function TypeDetailModal({ open, onOpenChange, initialType }: TypeDetailModalProps) {
  const [selectedType, setSelectedType] = useState<MBTIType | undefined>(initialType);
  const allTypes = getAllTypes();

  const personality = selectedType ? getTypeByCode(selectedType) : null;

  const groupColors = {
    analyst: 'bg-analyst text-white',
    diplomat: 'bg-diplomat text-white',
    sentinel: 'bg-sentinel text-white',
    explorer: 'bg-explorer text-white',
  };

  const groups = {
    analyst: { label: '分析师', types: allTypes.filter(t => t.group === 'analyst') },
    diplomat: { label: '外交官', types: allTypes.filter(t => t.group === 'diplomat') },
    sentinel: { label: '守护者', types: allTypes.filter(t => t.group === 'sentinel') },
    explorer: { label: '探险家', types: allTypes.filter(t => t.group === 'explorer') },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>查看16型人格</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* 类型列表 */}
          <ScrollArea className="flex-1 md:w-1/3 md:border-r p-4">
            <div className="space-y-4">
              {(Object.entries(groups) as [keyof typeof groups, typeof groups[keyof typeof groups]][]).map(([groupKey, group]) => (
                <div key={groupKey}>
                  <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                    {group.label}
                  </h3>
                  <div className="space-y-1">
                    {group.types.map((type) => (
                      <Button
                        key={type.type}
                        variant={selectedType === type.type ? 'default' : 'ghost'}
                        className={`
                          w-full justify-start font-mono
                          ${selectedType === type.type ? groupColors[type.group] : ''}
                        `}
                        onClick={() => setSelectedType(type.type as MBTIType)}
                      >
                        {type.type}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* 类型详情 */}
          <ScrollArea className="flex-1 md:w-2/3 p-6">
            {personality ? (
              <div className="space-y-6">
                {/* 类型标题 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-lg px-3 py-0 ${groupColors[personality.group]}`}>
                      {personality.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{personality.nameEn}</span>
                  </div>
                  <h2 className="text-2xl font-bold">{personality.name}</h2>
                  <p className="text-primary">"{personality.tagline}"</p>
                </div>

                {/* 描述 */}
                <div>
                  <h3 className="font-semibold mb-2">性格描述</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {personality.description}
                  </p>
                </div>

                {/* 特征标签 */}
                <div>
                  <h3 className="font-semibold mb-2">性格特征</h3>
                  <div className="flex flex-wrap gap-2">
                    {personality.traits.map((trait, index) => (
                      <Badge key={index} variant="secondary">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 优势与劣势 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-sm">优势</h3>
                    <ul className="space-y-1">
                      {personality.strengths.slice(0, 4).map((strength, index) => (
                        <li key={index} className="text-xs flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-green-500" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-sm">成长空间</h3>
                    <ul className="space-y-1">
                      {personality.weaknesses.slice(0, 4).map((weakness, index) => (
                        <li key={index} className="text-xs flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-muted" />
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 职业建议 */}
                <div>
                  <h3 className="font-semibold mb-2">适合职业</h3>
                  <div className="flex flex-wrap gap-1">
                    {personality.careers.slice(0, 6).map((career, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {career}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 数据来源 */}
                <p className="text-xs text-muted-foreground">
                  数据来源：{personality.source}
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                选择一个类型查看详情
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add components/TypeDetailModal.tsx
git commit -m "feat: add TypeDetailModal for browsing all 16 personality types"
```

---

## 阶段 5：主页面集成

### Task 15: 创建主页面，集成所有组件

**目标：** 创建主页面，管理应用状态和流程

**Files:**

- Modify: `app/page.tsx`

- [ ] **Step 1: 创建主页面**

修改 `app/page.tsx`：

```typescript
'use client';

import { useState, useEffect } from 'react';
import { WelcomeStep } from '@/components/steps/WelcomeStep';
import { QuizStep } from '@/components/steps/QuizStep';
import { CalculatingStep } from '@/components/steps/CalculatingStep';
import { ResultStep } from '@/components/steps/ResultStep';
import { TypeDetailModal } from '@/components/TypeDetailModal';
import {
  AppStep,
  TestLength,
  Answers,
  MBTIType,
  AppState
} from '@/lib/types';
import { getQuestions, getMaxScore } from '@/lib/questions';
import {
  getProgress,
  saveProgress,
  getResult,
  saveResult,
  clearProgress
} from '@/lib/storage';

export default function Home() {
  const [state, setState] = useState<AppState>({
    step: 'welcome',
    testLength: null,
    currentQuestion: 0,
    answers: { EI: 0, SN: 0, TF: 0, JP: 0 },
    result: null,
  });

  const [showTypeModal, setShowTypeModal] = useState(false);
  const [previousResult, setPreviousResult] = useState<MBTIType | null>(null);

  // 初始化：检查缓存
  useEffect(() => {
    const savedResult = getResult();
    if (savedResult) {
      setPreviousResult(savedResult.type);
    }
  }, []);

  // 保存进度
  useEffect(() => {
    if (state.step === 'quiz' && state.testLength) {
      saveProgress({
        testLength: state.testLength,
        currentQuestion: state.currentQuestion,
        answers: state.answers,
        timestamp: Date.now(),
      });
    }
  }, [state]);

  const handleStartTest = (length: TestLength) => {
    setState({
      step: 'quiz',
      testLength: length,
      currentQuestion: 0,
      answers: { EI: 0, SN: 0, TF: 0, JP: 0 },
      result: null,
    });
  };

  const handleContinuePrevious = () => {
    if (previousResult) {
      setState({
        step: 'result',
        testLength: null,
        currentQuestion: 0,
        answers: { EI: 0, SN: 0, TF: 0, JP: 0 },
        result: previousResult,
      });
    }
  };

  const handleAnswer = (newAnswers: Answers) => {
    setState(prev => ({
      ...prev,
      answers: newAnswers,
    }));
  };

  const handleCompleteQuiz = (finalAnswers: Answers) => {
    setState(prev => ({
      ...prev,
      answers: finalAnswers,
      step: 'calculating',
    }));
  };

  const handleCalculationComplete = () => {
    // 计算 MBTI 类型
    const { calculateMBTI } = require('@/lib/calculateMBTI');
    const resultType = calculateMBTI(state.answers);

    // 保存结果
    saveResult({
      type: resultType,
      completedAt: Date.now(),
    });

    // 清除进度缓存
    clearProgress();

    setState(prev => ({
      ...prev,
      result: resultType,
      step: 'result',
    }));
  };

  const handleRestart = () => {
    setState({
      step: 'welcome',
      testLength: null,
      currentQuestion: 0,
      answers: { EI: 0, SN: 0, TF: 0, JP: 0 },
      result: null,
    });
  };

  // 渲染当前步骤
  const renderStep = () => {
    switch (state.step) {
      case 'welcome':
        return (
          <WelcomeStep
            onStart={handleStartTest}
            hasPreviousResult={previousResult !== null}
            onContinuePrevious={handleContinuePrevious}
          />
        );

      case 'quiz':
        if (!state.testLength) return null;
        const questions = getQuestions(state.testLength);
        return (
          <QuizStep
            questions={questions}
            initialAnswers={state.answers}
            onAnswer={handleAnswer}
            onComplete={handleCompleteQuiz}
          />
        );

      case 'calculating':
        return <CalculatingStep onComplete={handleCalculationComplete} />;

      case 'result':
        if (!state.result || !state.testLength) return null;
        const maxScore = getMaxScore(state.testLength);
        return (
          <ResultStep
            type={state.result}
            answers={state.answers}
            maxScore={maxScore}
            onRestart={handleRestart}
            onViewOtherTypes={() => setShowTypeModal(true)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {renderStep()}
      <TypeDetailModal
        open={showTypeModal}
        onOpenChange={setShowTypeModal}
        initialType={state.result || undefined}
      />
    </>
  );
}
```

- [ ] **Step 2: 添加导出辅助函数**

修改 `lib/calculateMBTI.ts`，确保导出命名：

```typescript
export function calculateMBTI(answers: Answers): MBTIType {
  // ... 现有代码 ...
}

// 添加命名导出（与默认导出共存）
export { calculateMBTI };
```

- [ ] **Step 3: 测试应用**

运行：

```bash
npm run dev
```

预期：应用启动，可以看到欢迎页，能进行测试流程

- [ ] **Step 4: 提交**

```bash
git add app/page.tsx lib/calculateMBTI.ts
git commit -m "feat: integrate all components in main page"
```

---

## 阶段 6：优化和部署

### Task 16: 添加页面元数据和 SEO 优化

**目标：** 优化页面元数据，添加 SEO 相关配置

**Files:**

- Modify: `app/layout.tsx`

- Create: `app/opengraph-image.tsx`

- Create: `app/twitter-image.tsx`

- [ ] **Step 1: 更新 layout 元数据**

修改 `app/layout.tsx`：

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "MBTI 16型人格测试 - 发现真实的自己",
    template: "%s | MBTI 人格测试",
  },
  description: "免费的 MBTI 16型人格测试，帮助你了解自己的性格类型、优势劣势、职业建议和人际关系匹配。快速测试仅需2分钟，完整测试更加精准。",
  keywords: ["MBTI", "人格测试", "性格测试", "16型人格", "职业规划", "性格分析"],
  authors: [{ name: "MBTI Test" }],
  creator: "MBTI Test",
  publisher: "MBTI Test",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "/",
    title: "MBTI 16型人格测试 - 发现真实的自己",
    description: "免费的 MBTI 16型人格测试，帮助你了解自己的性格类型、优势劣势、职业建议和人际关系匹配。",
    siteName: "MBTI 人格测试",
  },
  twitter: {
    card: "summary_large_image",
    title: "MBTI 16型人格测试 - 发现真实的自己",
    description: "免费的 MBTI 16型人格测试，帮助你了解自己的性格类型、优势劣势、职业建议和人际关系匹配。",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: 创建环境变量文件**

创建 `.env.local`：

```bash
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

- [ ] **Step 3: 提交**

```bash
git add app/layout.tsx .env.local
git commit -m "feat: add SEO metadata and page optimization"
```

---

### Task 17: 添加 robots.txt 和 sitemap

**目标：** 创建搜索引擎优化文件

**Files:**

- Create: `public/robots.txt`

- Create: `app/sitemap.ts`

- [ ] **Step 1: 创建 robots.txt**

创建 `public/robots.txt`：

```txt
User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml
```

- [ ] **Step 2: 创建 sitemap.ts**

创建 `app/sitemap.ts`：

```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
```

- [ ] **Step 3: 提交**

```bash
git add public/robots.txt app/sitemap.ts
git commit -m "feat: add robots.txt and sitemap for SEO"
```

---

### Task 18: 最终测试和优化

**目标：** 全面测试应用功能，修复发现的问题

**Files:**

- Test: 整个应用

- [ ] **Step 1: 运行应用并测试所有流程**

运行：

```bash
npm run dev
```

测试清单：

- [ ] 欢迎页正常显示

- [ ] 快速测试可以正常进行

- [ ] 完整测试可以正常进行

- [ ] 进度保存和恢复功能正常

- [ ] 结果计算正确

- [ ] 结果页显示完整信息

- [ ] 类型详情弹窗正常工作

- [ ] 重新测试功能正常

- [ ] 移动端显示正常

- [ ] **Step 2: 检查控制台错误**

打开浏览器开发者工具，检查是否有错误或警告

- [ ] **Step 3: 测试响应式设计**

在不同屏幕尺寸下测试（手机、平板、桌面）

- [ ] **Step 4: 性能检查**

使用 Lighthouse 检查性能、可访问性、SEO

- [ ] **Step 5: 修复发现的问题**

根据测试结果修复任何问题

- [ ] **Step 6: 提交最终版本**

```bash
git add .
git commit -m "feat: complete MBTI test application with all features"
```

---

### Task 19: 部署到 Vercel

**目标：** 将应用部署到 Vercel

**Files:**

- Deploy: Vercel

- [ ] **Step 1: 安装 Vercel CLI（可选）**

```bash
npm install -g vercel
```

- [ ] **Step 2: 登录 Vercel**

```bash
vercel login
```

- [ ] **Step 3: 部署应用**

```bash
vercel
```

或者直接通过 Vercel 网页连接 GitHub 仓库自动部署

- [ ] **Step 4: 配置环境变量**

在 Vercel 项目设置中添加：

- `NEXT_PUBLIC_BASE_URL` = 你的域名

- [ ] **Step 5: 验证部署**

访问部署的 URL，确认应用正常工作

- [ ] **Step 6: 提交部署标签**

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

---

## 完成检查清单

在宣布完成之前，确保以下所有项目都已完成：

- [ ] Next.js 项目初始化完成
- [ ] shadcn/ui 配置完成
- [ ] 全局样式和主题配置完成
- [ ] 所有 TypeScript 类型定义完成
- [ ] MBTI 计算逻辑实现
- [ ] localStorage 管理器实现
- [ ] 16型人格数据完整
- [ ] 快速测试（12题）完整
- [ ] 完整测试（60题）完整
- [ ] 欢迎页组件实现
- [ ] 答题页组件实现
- [ ] 计算页组件实现
- [ ] 结果页组件实现
- [ ] 类型详情弹窗实现
- [ ] 主页面状态管理集成
- [ ] SEO 元数据配置
- [ ] robots.txt 和 sitemap 创建
- [ ] 全面测试通过
- [ ] Vercel 部署成功

---

## 附录

### 技术参考

- Next.js 文档: https://nextjs.org/docs
- shadcn/ui 文档: https://ui.shadcn.com
- Tailwind CSS 文档: https://tailwindcss.com/docs
- Framer Motion 文档: https://www.framer.com/motion

### 数据来源

本项目的 MBTI 类型数据引用自以下公开资源：

- 16Personalities (https://www.16personalities.com)
- MBTI 官方网站

### 联系和支持

如有问题或建议，请通过以下方式联系：

- GitHub Issues
- 项目文档

---

**实施计划版本:** 1.0
**创建日期:** 2026-03-20
**预计完成时间:** 2-3 小时
