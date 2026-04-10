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
 * @param maxScores - 每个维度的最大可能得分
 */
export function getDimensionPercentages(
  answers: Answers,
  maxScores: Record<keyof Answers, number>
): Record<keyof Answers, { positive: number; negative: number }> {
  const calculatePercentage = (score: number, maxScore: number) => {
    if (maxScore <= 0) {
      return { positive: 50, negative: 50 };
    }
    // 以 50/50 作为中性点，分数绝对值越高，倾向越明显
    const positive = Math.round(50 + (Math.abs(score) / maxScore) * 50);
    const negative = 100 - positive;
    return { positive, negative };
  };

  return {
    EI: calculatePercentage(answers.EI, maxScores.EI),
    SN: calculatePercentage(answers.SN, maxScores.SN),
    TF: calculatePercentage(answers.TF, maxScores.TF),
    JP: calculatePercentage(answers.JP, maxScores.JP),
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
