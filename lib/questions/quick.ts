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
