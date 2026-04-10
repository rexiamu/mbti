'use client';

import { TestLength } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Zap } from 'lucide-react';

interface WelcomeStepProps {
  onStart: (length: TestLength) => void;
  hasPreviousResult: boolean;
  onContinuePrevious: () => void;
  hasSavedProgress: boolean;
  onContinueSavedProgress: () => void;
  onRestartFromSavedProgress: () => void;
}

export function WelcomeStep({
  onStart,
  hasPreviousResult,
  onContinuePrevious,
  hasSavedProgress,
  onContinueSavedProgress,
  onRestartFromSavedProgress
}: WelcomeStepProps) {
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

        {hasSavedProgress && (
          <Card className="p-4 border-dashed border-primary/40">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">检测到未完成的答题进度</p>
              <div className="flex gap-2">
                <Button onClick={onContinueSavedProgress} className="flex-1">
                  继续上次答题
                </Button>
                <Button onClick={onRestartFromSavedProgress} variant="outline" className="flex-1">
                  重新开始
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
