'use client';

import { useEffect, useState } from 'react';
import { WelcomeStep } from '@/components/steps/WelcomeStep';
import { QuizStep } from '@/components/steps/QuizStep';
import { CalculatingStep } from '@/components/steps/CalculatingStep';
import { ResultStep } from '@/components/steps/ResultStep';
import {
  TestLength,
  Answers,
  AppState,
  QuizProgress,
  QuizResult
} from '@/lib/types';
import { getDimensionMaxScores, getQuestions } from '@/lib/questions';
import { calculateMBTI } from '@/lib/calculateMBTI';
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
    questionSelections: [],
    result: null,
  });
  const [isHydrated, setIsHydrated] = useState(false);

  const [previousResult, setPreviousResult] = useState<QuizResult | null>(null);
  const [savedProgress, setSavedProgress] = useState<QuizProgress | null>(null);

  // Client-only restoration from localStorage must happen after hydration.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const savedResult = getResult();
    setPreviousResult(savedResult);

    const progress = getProgress();
    if (!progress) {
      setIsHydrated(true);
      return;
    }

    const questions = getQuestions(progress.testLength);
    const totalQuestions = questions.length;
    const clampedQuestion = Math.min(
      Math.max(progress.currentQuestion, 0),
      Math.max(totalQuestions - 1, 0)
    );
    const restoredSelections = Array.from({ length: totalQuestions }, (_, index) => {
      const value = progress.questionSelections?.[index];
      return value === 1 || value === -1 ? value : null;
    });
    const hasSelectionData = Array.isArray(progress.questionSelections);
    if (!hasSelectionData) {
      clearProgress();
      setIsHydrated(true);
      return;
    }

    const restoredAnswers = questions.reduce<Answers>((acc, question, index) => {
      const value = restoredSelections[index];
      if (value === null) return acc;
      return {
        ...acc,
        [question.dimension]: acc[question.dimension] + value,
      };
    }, { EI: 0, SN: 0, TF: 0, JP: 0 });

    setSavedProgress({
      testLength: progress.testLength,
      currentQuestion: clampedQuestion,
      answers: restoredAnswers,
      questionSelections: restoredSelections,
      timestamp: progress.timestamp,
    });
    setIsHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // 保存进度
  useEffect(() => {
    if (!isHydrated) return;
    if (state.step === 'quiz' && state.testLength) {
      saveProgress({
        testLength: state.testLength,
        currentQuestion: state.currentQuestion,
        answers: state.answers,
        questionSelections: state.questionSelections,
        timestamp: Date.now(),
      });
    }
  }, [state, isHydrated]);

  const handleStartTest = (length: TestLength) => {
    const totalQuestions = getQuestions(length).length;
    clearProgress();
    setSavedProgress(null);
    setState({
      step: 'quiz',
      testLength: length,
      currentQuestion: 0,
      answers: { EI: 0, SN: 0, TF: 0, JP: 0 },
      questionSelections: Array.from({ length: totalQuestions }, () => null),
      result: null,
    });
  };

  const handleContinuePrevious = () => {
    if (previousResult) {
      setState({
        step: 'result',
        testLength: previousResult.testLength ?? 'full',
        currentQuestion: 0,
        answers: previousResult.answers ?? { EI: 0, SN: 0, TF: 0, JP: 0 },
        questionSelections: [],
        result: previousResult.type,
      });
    }
  };

  const handleContinueSavedProgress = () => {
    if (!savedProgress) return;
    setState({
      step: 'quiz',
      testLength: savedProgress.testLength,
      currentQuestion: savedProgress.currentQuestion,
      answers: savedProgress.answers,
      questionSelections: savedProgress.questionSelections ?? [],
      result: null,
    });
  };

  const handleRestartFromSavedProgress = () => {
    if (!savedProgress) return;
    handleStartTest(savedProgress.testLength);
  };

  const handleQuestionChange = (questionIndex: number) => {
    setState(prev => ({
      ...prev,
      currentQuestion: questionIndex,
    }));
  };

  const handleAnswer = (newAnswers: Answers, newQuestionSelections: Array<1 | -1 | null>) => {
    setState(prev => ({
      ...prev,
      answers: newAnswers,
      questionSelections: newQuestionSelections,
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
    const resultType = calculateMBTI(state.answers);

    // 保存结果
    saveResult({
      type: resultType,
      completedAt: Date.now(),
      testLength: state.testLength ?? undefined,
      answers: state.answers,
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
      questionSelections: [],
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
            hasSavedProgress={savedProgress !== null}
            onContinueSavedProgress={handleContinueSavedProgress}
            onRestartFromSavedProgress={handleRestartFromSavedProgress}
          />
        );

      case 'quiz':
        if (!state.testLength) return null;
        const questions = getQuestions(state.testLength);
        return (
          <QuizStep
            questions={questions}
            initialAnswers={state.answers}
            initialQuestion={state.currentQuestion}
            initialQuestionSelections={state.questionSelections}
            onQuestionChange={handleQuestionChange}
            onAnswer={handleAnswer}
            onComplete={handleCompleteQuiz}
          />
        );

      case 'calculating':
        return <CalculatingStep onComplete={handleCalculationComplete} />;

      case 'result':
        if (!state.result) return null;
        const maxScores = getDimensionMaxScores(state.testLength ?? 'full');
        return (
          <ResultStep
            type={state.result}
            answers={state.answers}
            maxScores={maxScores}
            onRestart={handleRestart}
          />
        );

      default:
        return null;
    }
  };

  return renderStep();
}
