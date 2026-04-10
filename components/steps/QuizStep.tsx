'use client';

import { useEffect, useRef, useState } from 'react';
import { Question, Answers } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface QuizStepProps {
  questions: Question[];
  initialAnswers: Answers;
  initialQuestion: number;
  initialQuestionSelections: Array<1 | -1 | null>;
  onQuestionChange: (questionIndex: number) => void;
  onAnswer: (answers: Answers, questionSelections: Array<1 | -1 | null>) => void;
  onComplete: (finalAnswers: Answers) => void;
}

export function QuizStep({
  questions,
  initialAnswers,
  initialQuestion,
  initialQuestionSelections,
  onQuestionChange,
  onAnswer,
  onComplete
}: QuizStepProps) {
  const AUTO_ADVANCE_DELAY = 450;
  const [currentIndex, setCurrentIndex] = useState(initialQuestion);
  const [selectedValue, setSelectedValue] = useState<1 | -1 | null>(
    initialQuestionSelections[initialQuestion] ?? null
  );
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [questionSelections, setQuestionSelections] = useState<Array<1 | -1 | null>>(initialQuestionSelections);
  const [pendingAutoAdvance, setPendingAutoAdvance] = useState(false);
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;
  const canProceed = selectedValue !== null;

  const clearAutoAdvance = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    setPendingAutoAdvance(false);
  };

  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, []);

  const submitAnswer = (value: 1 | -1) => {
    clearAutoAdvance();
    setSelectedValue(value);

    const previousValue = questionSelections[currentIndex] ?? 0;
    const delta = value - previousValue;
    const updatedSelections = [...questionSelections];
    updatedSelections[currentIndex] = value;
    setQuestionSelections(updatedSelections);

    // 更新答案
    const newAnswers = {
      ...answers,
      [currentQuestion.dimension]: answers[currentQuestion.dimension] + delta,
    };
    setAnswers(newAnswers);
    onAnswer(newAnswers, updatedSelections);

    if (isLastQuestion) {
      onComplete(newAnswers);
    } else {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      onQuestionChange(nextIndex);
      setSelectedValue(updatedSelections[nextIndex] ?? null);
    }
  };

  const handleSelect = (value: 1 | -1) => {
    setSelectedValue(value);
    setPendingAutoAdvance(true);
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }

    autoAdvanceTimerRef.current = setTimeout(() => {
      submitAnswer(value);
    }, AUTO_ADVANCE_DELAY);
  };

  const handleNext = () => {
    if (selectedValue === null) return;
    submitAnswer(selectedValue);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      clearAutoAdvance();
      const nextIndex = currentIndex - 1;
      setCurrentIndex(nextIndex);
      onQuestionChange(nextIndex);
      setSelectedValue(questionSelections[nextIndex] ?? null);
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
                  onClick={() => handleSelect(option.value as 1 | -1)}
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
            {pendingAutoAdvance && (
              <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2 text-sm">
                <span>已选择，正在自动跳转下一题...</span>
                <button
                  type="button"
                  onClick={clearAutoAdvance}
                  className="font-medium text-primary hover:underline"
                >
                  撤销
                </button>
              </div>
            )}
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
