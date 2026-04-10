# MBTI 16型人格测试网站 - 设计文档

**日期：** 2026-03-20
**版本：** 1.0

---

## 项目概述

一个移动优先、轻松活泼风格的 MBTI 16型人格测试与查询网站。用户可以通过答题得出自己的 MBTI 类型，并查看详细的类型介绍。

---

## 功能需求

### 核心功能

1. **MBTI 人格测试**
   
   - 支持快速测试（12题）和完整测试（60题）
   - 用户可选测试长度
   - 必答机制（不能跳过题目）
   - 实时进度显示

2. **测试结果展示**
   
   - 显示用户的 MBTI 类型
   - 类型的详细解析
   - 四个维度（E/I, S/N, T/F, J/P）的得分

3. **16种类型查询**
   
   - 超详细的类型介绍
   - 包含：核心特点、优势劣势、职业建议、关系匹配、名人案例、成长建议

4. **数据缓存**
   
   - 使用 localStorage 保存答题进度
   - 保存测试结果历史
   - 支持恢复上次的测试
   - 缓存7天后自动清除

---

## 非功能需求

| 需求   | 说明          |
| ---- | ----------- |
| 移动优先 | 主要针对手机用户优化  |
| 响应式  | 兼容平板和桌面端    |
| 性能   | 首屏加载 < 2秒   |
| 可访问性 | 支持基础无障碍访问   |
| 数据来源 | 引用公开资料并注明来源 |

---

## 技术栈

| 类别    | 技术选型                     |
| ----- | ------------------------ |
| 框架    | Next.js 14+ (App Router) |
| UI 组件 | shadcn/ui                |
| 样式    | Tailwind CSS             |
| 动画    | Framer Motion            |
| 图标    | Lucide React             |
| 部署    | Vercel                   |

---

## 系统架构

### 整体架构（渐进式单页应用）

```
┌─────────────────────────────────────────┐
│  顶部 Logo                              │
├─────────────────────────────────────────┤
│                                          │
│   ┌─────────────────────────────────┐  │
│   │  1. 欢迎页                       │  │
│   │     - MBTI 简介                  │  │
│   │     - 选择测试长度               │  │
│   │     - 开始按钮                   │  │
│   └─────────────────────────────────┘  │
│              ↓                          │
│   ┌─────────────────────────────────┐  │
│   │  2. 测试页                       │  │
│   │     - 单题显示（带进度条）        │  │
│   │     - 选项选择                   │  │
│   │     - 上一题/下一题              │  │
│   └─────────────────────────────────┘  │
│              ↓                          │
│   ┌─────────────────────────────────┐  │
│   │  3. 结果计算页                   │  │
│   │     - 加载动画                   │  │
│   └─────────────────────────────────┘  │
│              ↓                          │
│   ┌─────────────────────────────────┐  │
│   │  4. 结果展示页                   │  │
│   │     - 你的 MBTI 类型             │  │
│   │     - 类型详解                   │  │
│   │     - 重新测试/查看其他类型      │  │
│   └─────────────────────────────────┘  │
│                                          │
└─────────────────────────────────────────┘
```

### 数据流

```
用户答题 → 实时计算四个维度 (E/I, S/N, T/F, J/P)
        → 得出类型 → 查询类型数据 → 渲染结果页
```

---

## 核心模块设计

### 1. 测试模块

#### 题目设计

**快速测试（12题）：** 每个维度 3 题

- E/I（外向/内向）：3 题
- S/N（实感/直觉）：3 题
- T/F（思考/情感）：3 题
- J/P（判断/感知）：3 题

**完整测试（60题）：** 每个维度 15 题

- E/I：15 题
- S/N：15 题
- T/F：15 题
- J/P：15 题

#### 计分逻辑

每题选择对应某一边的加分，最终比较：

- E vs I → E 分高则 E，否则 I
- S vs N → S 分高则 S，否则 N
- T vs F → T 分高则 T，否则 F
- J vs P → J 分高则 J，否则 P

组合得到 16 种类型之一（如 INTJ、ESFP 等）

#### 答题状态管理

```typescript
interface QuizState {
  currentStep: 'welcome' | 'quiz' | 'calculating' | 'result'
  selectedLength: 'quick' | 'full'
  currentQuestion: number
  answers: {
    EI: number  // 正数=E倾向，负数=I倾向
    SN: number  // 正数=S倾向，负数=N倾向
    TF: number  // 正数=T倾向，负数=F倾向
    JP: number  // 正数=J倾向，负数=P倾向
  }
}
```

### 2. 数据模块

#### 16型人格数据结构

```typescript
interface MBTIType {
  type: string           // 四字母代码，如 "INTJ"
  name: string           // 中文名称，如 "建筑师"
  nameEn: string         // 英文名称，如 "Architect"

  // 四个维度
  dimensions: {
    EI: { label: string; value: string }
    SN: { label: string; value: string }
    TF: { label: string; value: string }
    JP: { label: string; value: string }
  }

  // 核心描述
  tagline: string        // 一句话描述
  description: string    // 详细描述

  // 性格特征
  traits: string[]       // 特征标签

  // 优势与劣势
  strengths: string[]
  weaknesses: string[]

  // 职业建议
  careers: string[]

  // 关系匹配
  compatibility: {
    best: string[]       // 最佳匹配
    similar: string[]    // 相似类型
    challenging: string[] // 需要磨合
  }

  // 名人案例
  celebrities: Array<{
    name: string
    role: string
  }>

  // 成长建议
  growth: string[]

  // 数据来源
  source: string
}
```

#### 16种类型分类

```
分析师 (NT): INTJ, INTP, ENTJ, ENTP
外交官 (NF): INFJ, INFP, ENFJ, ENFP
守护者 (SJ): ISTJ, ISFJ, ESTJ, ESFJ
探险家 (SP): ISTP, ISFP, ESTP, ESFP
```

### 3. 缓存模块

#### localStorage 缓存结构

```typescript
interface StorageData {
  mbit_progress: {
    testLength: 'quick' | 'full'
    currentQuestion: number
    answers: { EI: number; SN: number; TF: number; JP: number }
    timestamp: number
  }

  mbit_result: {
    type: string
    completedAt: number
  }
}
```

#### 缓存策略

- 答题进度：实时保存，每题一存
- 测试结果：完成后保存，可随时查看
- 缓存过期：7 天后自动清除

#### 恢复机制

- 用户再次访问 → 检测缓存，提示"继续上次的测试？"
- 已完成用户 → 直接显示历史结果

---

## UI 设计

### 设计风格

**轻松活泼的年轻化风格**

### 色彩方案

#### 主色调（每种人格类型的代表色）

```
分析师 (NT): 蓝紫色系 #8B5CF6
外交官 (NF): 粉橙色系 #F97316
守护者 (SJ): 蓝绿色系 #0EA5E9
探险家 (SP): 黄绿色系 #EAB308
```

#### 通用色彩

- 背景：渐变柔和背景 `from-indigo-50 via-purple-50 to-pink-50`
- 卡片：白色 + 轻阴影
- 文字：深灰 `text-slate-700`
- 按钮：渐变按钮 + 圆角 `rounded-full`

### 字体

- 中文：`'Noto Sans SC', sans-serif` 或系统字体
- 英文：`'Inter', sans-serif`

### 移动端设计要点

- 单列布局，内容宽度占满
- 大按钮（至少 44px 高度）
- 触摸友好的间距
- 底部导航（查看其他类型时）

### 动画效果

- 页面切换：淡入淡出 + 轻微位移
- 选项选择：缩放反馈
- 结果展示：逐步揭示动画
- 进度条：平滑过渡

---

## 错误处理

### 答题过程

- **不能跳过题目** → 必须选择才能进入下一题，未选时禁用"下一题"按钮
- 中途退出 → 缓存答题进度到 localStorage，下次访问可继续
- 切换测试长度 → 清除缓存，重新开始

### 计算结果

- 平分情况 → 默认选择第一个字母（如 E=I 则选 E）

### 外部数据

- 类型数据加载失败 → 显示占位内容 + 错误提示
- 图片加载失败 → 隐藏图片或显示默认图标

---

## 性能优化

- 题目数据预加载
- 类型数据按需加载
- 图片懒加载
- 结果页面缓存

---

## 项目结构

```
mbit/
├── app/
│   ├── page.tsx              # 主页（入口）
│   ├── layout.tsx            # 全局布局
│   └── globals.css           # 全局样式
│
├── components/
│   ├── steps/
│   │   ├── WelcomeStep.tsx   # 欢迎页
│   │   ├── QuizStep.tsx      # 答题页
│   │   ├── CalculatingStep.tsx # 计算页
│   │   └── ResultStep.tsx    # 结果页
│   │
│   ├── ui/                   # shadcn/ui 组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── progress.tsx
│   │   └── ...
│   │
│   └── TypeDetailModal.tsx   # 类型详情弹窗
│
├── lib/
│   ├── questions/
│   │   ├── quick.ts          # 快速测试题目
│   │   └── full.ts           # 完整测试题目
│   │
│   ├── types.ts              # 类型定义
│   ├── calculateMBTI.ts      # 计算逻辑
│   ├── storage.ts            # localStorage 管理
│   └── data/
│       └── types.json        # 16型人格数据
│
├── public/
│   └── types/                # 类型图片/图标
│
└── package.json
```

---

## 数据来源说明

所有 MBTI 类型内容将引用公开资料，并在页面中注明来源。建议来源：

- 16Personalities
- MBTI 官方网站

---

## 下一步

本设计文档完成后，将进入实施计划阶段：

1. 创建详细的实施计划
2. 设置项目脚手架
3. 实现各模块功能
4. 测试与优化
5. 部署上线

---

**文档版本历史**

- v1.0 (2026-03-20): 初始设计文档
