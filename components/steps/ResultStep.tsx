'use client';

import { useState } from 'react';
import { MBTIType, Answers, PersonalityType } from '@/lib/types';
import { getTypeByCode } from '@/lib/data';
import { getDimensionPercentages, formatDimensionLabel } from '@/lib/calculateMBTI';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  RefreshCw,
  Sparkles,
  TrendingUp,
  Users,
  Briefcase,
  Lightbulb,
  Star,
  X,
  ChevronDown
} from 'lucide-react';

interface ResultStepProps {
  type: MBTIType;
  answers: Answers;
  maxScores: Record<keyof Answers, number>;
  onRestart: () => void;
  onViewOtherTypes: () => void;
}

export function ResultStep({ type, answers, maxScores, onRestart, onViewOtherTypes }: ResultStepProps) {
  const [showDetails, setShowDetails] = useState(false);
  const personality = getTypeByCode(type) as PersonalityType;
  const percentages = getDimensionPercentages(answers, maxScores);

  const getTendencyHint = (dim: keyof Answers, positiveLabel: string, negativeLabel: string) => {
    const maxScore = maxScores[dim];
    const score = Math.abs(answers[dim]);
    const ratio = maxScore > 0 ? score / maxScore : 0;

    if (ratio < 0.2) {
      return `该维度倾向较弱，可能在 ${positiveLabel}/${negativeLabel} 间波动`;
    }
    if (ratio < 0.5) {
      return `该维度为中等倾向，当前更偏向 ${positiveLabel}`;
    }
    return `该维度倾向明显，稳定偏向 ${positiveLabel}`;
  };

  if (!personality) {
    return null;
  }

  const groupColors = {
    analyst: 'from-analyst/20 to-analyst/5 border-analyst/30',
    diplomat: 'from-diplomat/20 to-diplomat/5 border-diplomat/30',
    sentinel: 'from-sentinel/20 to-sentinel/5 border-sentinel/30',
    explorer: 'from-explorer/20 to-explorer/5 border-explorer/30',
  };

  const groupBadgeColors = {
    analyst: 'bg-analyst text-white',
    diplomat: 'bg-diplomat text-white',
    sentinel: 'bg-sentinel text-white',
    explorer: 'bg-explorer text-white',
  };

  return (
    <div className="min-h-screen p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* 结果标题卡片 */}
        <Card className={`overflow-hidden border-2 bg-gradient-to-br ${groupColors[personality.group]}`}>
          <div className="p-6 space-y-4">
            {/* 类型代码 */}
            <div className="text-center space-y-2">
              <Badge className={`text-lg px-4 py-1 ${groupBadgeColors[personality.group]}`}>
                {personality.type}
              </Badge>
              <h1 className="text-3xl font-bold">{personality.name}</h1>
              <p className="text-sm text-muted-foreground">{personality.nameEn}</p>
            </div>

            {/* 标语 */}
            <p className="text-center text-lg font-medium text-primary">
              &quot;{personality.tagline}&quot;
            </p>

            {/* 标签 */}
            <div className="flex flex-wrap justify-center gap-2">
              {personality.traits.map((trait, index) => (
                <Badge key={index} variant="secondary">
                  {trait}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* 维度分析 */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            维度分析
          </h2>
          <div className="space-y-4">
            {(['EI', 'SN', 'TF', 'JP'] as const).map((dim) => {
              const dimension = personality.dimensions[dim as keyof typeof personality.dimensions];
              const percentage = percentages[dim];
              const positiveLabel = dimension.value;
              const negativeLabel = dim === 'EI' ? (positiveLabel === 'E' ? 'I' : 'E') :
                                   dim === 'SN' ? (positiveLabel === 'S' ? 'N' : 'S') :
                                   dim === 'TF' ? (positiveLabel === 'T' ? 'F' : 'T') :
                                   (positiveLabel === 'J' ? 'P' : 'J');

              return (
                <div key={dim} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{formatDimensionLabel(dim as keyof Answers)}</span>
                    <span className="text-muted-foreground">
                      {positiveLabel} {percentage.positive}%
                    </span>
                  </div>
                  <div className="flex h-3 rounded-full overflow-hidden bg-muted">
                    <div
                      className="bg-primary transition-all duration-500"
                      style={{ width: `${percentage.positive}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{negativeLabel} {percentage.negative}%</span>
                    <span>{positiveLabel} {percentage.positive}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {getTendencyHint(dim, positiveLabel, negativeLabel)}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 展开/收起详情按钮 */}
        <Button
          onClick={() => setShowDetails(!showDetails)}
          variant="outline"
          className="w-full"
        >
          {showDetails ? (
            <>收起详细信息 <ChevronDown className="w-4 h-4 ml-2 rotate-180" /></>
          ) : (
            <>查看详细信息 <ChevronDown className="w-4 h-4 ml-2" /></>
          )}
        </Button>

        {/* 详细信息 */}
        {showDetails && (
          <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
            {/* 描述 */}
            <Card className="p-6">
              <h3 className="font-semibold mb-2">关于你</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {personality.description}
              </p>
            </Card>

            {/* 优势 */}
            <Card className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-explorer" />
                你的优势
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {personality.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-explorer" />
                    {strength}
                  </div>
                ))}
              </div>
            </Card>

            {/* 劣势 */}
            <Card className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <X className="w-4 h-4 text-destructive" />
                成长空间
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {personality.weaknesses.map((weakness, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted" />
                    {weakness}
                  </div>
                ))}
              </div>
            </Card>

            {/* 职业建议 */}
            <Card className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-sentinel" />
                适合的职业
              </h3>
              <ScrollArea className="h-24">
                <div className="flex flex-wrap gap-2">
                  {personality.careers.map((career, index) => (
                    <Badge key={index} variant="outline">
                      {career}
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            {/* 关系匹配 */}
            <Card className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-diplomat" />
                关系匹配
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">最佳匹配：</span>
                  <span className="ml-2 font-medium text-diplomat">
                    {personality.compatibility.best.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">相似类型：</span>
                  <span className="ml-2">{personality.compatibility.similar.join(', ')}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">需要磨合：</span>
                  <span className="ml-2">{personality.compatibility.challenging.join(', ')}</span>
                </div>
              </div>
            </Card>

            {/* 名人案例 */}
            <Card className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-analyst" />
                同类型名人
              </h3>
              <div className="space-y-2">
                {personality.celebrities.map((celebrity, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{celebrity.name}</span>
                    <span className="text-muted-foreground">{celebrity.role}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* 成长建议 */}
            <Card className="p-6 border-2 border-dashed border-primary/20">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-primary" />
                成长建议
              </h3>
              <ul className="space-y-2">
                {personality.growth.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* 数据来源 */}
            <p className="text-xs text-center text-muted-foreground">
              数据来源：{personality.source}
            </p>
          </div>
        )}

        <Separator />

        {/* 底部按钮 */}
        <div className="flex gap-3">
          <Button onClick={onRestart} variant="outline" className="flex-1">
            <RefreshCw className="w-4 h-4 mr-2" />
            重新测试
          </Button>
          <Button onClick={onViewOtherTypes} className="flex-1">
            查看其他类型
          </Button>
        </div>
      </div>
    </div>
  );
}
