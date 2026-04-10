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
