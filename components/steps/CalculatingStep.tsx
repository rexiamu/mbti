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
