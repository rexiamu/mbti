import { QuizProgress, QuizResult } from './types';

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
