import { Answers, Question, TestLength } from '../types';
import { quickQuestions } from './quick';
import { fullQuestions } from './full';

/**
 * 根据测试长度获取题目
 */
export function getQuestions(length: TestLength): Question[] {
  return length === 'quick' ? quickQuestions : fullQuestions;
}

/**
 * 获取每个维度的最大可能分值（用于计算百分比）
 */
export function getDimensionMaxScores(length: TestLength): Record<keyof Answers, number> {
  const questions = getQuestions(length);
  const scores: Record<keyof Answers, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };

  questions.forEach((question) => {
    const maxAbs = Math.max(...question.options.map(option => Math.abs(option.value)));
    scores[question.dimension] += maxAbs;
  });

  return scores;
}
