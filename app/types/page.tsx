'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { MBTIType } from '@/lib/types';
import { getAllTypes, getTypeByCode } from '@/lib/data';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const MBTI_TYPES = new Set<MBTIType>([
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
]);

type GroupKey = 'analyst' | 'diplomat' | 'sentinel' | 'explorer';

const GROUP_META: Array<{ key: GroupKey; label: string }> = [
  { key: 'analyst', label: '分析师' },
  { key: 'diplomat', label: '外交官' },
  { key: 'sentinel', label: '守护者' },
  { key: 'explorer', label: '探险家' },
];

function parseType(value: string | null): MBTIType | undefined {
  if (!value) return undefined;
  return MBTI_TYPES.has(value as MBTIType) ? (value as MBTIType) : undefined;
}

function TypesPageContent() {
  const searchParams = useSearchParams();
  const allTypes = getAllTypes();
  const initialType = parseType(searchParams.get('current')) ?? allTypes[0]?.type;
  const [selectedType, setSelectedType] = useState<MBTIType | undefined>(initialType);
  const initialGroup = allTypes.find((type) => type.type === initialType)?.group ?? 'analyst';
  const [activeGroup, setActiveGroup] = useState<GroupKey>(initialGroup);
  const typeOrder = allTypes.map((type) => type.type as MBTIType);

  const personality = selectedType ? getTypeByCode(selectedType) : null;
  const groups = {
    analyst: { label: '分析师', types: allTypes.filter(t => t.group === 'analyst') },
    diplomat: { label: '外交官', types: allTypes.filter(t => t.group === 'diplomat') },
    sentinel: { label: '守护者', types: allTypes.filter(t => t.group === 'sentinel') },
    explorer: { label: '探险家', types: allTypes.filter(t => t.group === 'explorer') },
  };

  const groupColors = {
    analyst: 'bg-analyst text-white',
    diplomat: 'bg-diplomat text-white',
    sentinel: 'bg-sentinel text-white',
    explorer: 'bg-explorer text-white',
  };
  const selectedTypeIndex = selectedType ? typeOrder.indexOf(selectedType) : -1;
  const hasPreviousType = selectedTypeIndex > 0;
  const hasNextType = selectedTypeIndex >= 0 && selectedTypeIndex < typeOrder.length - 1;

  const handleAdjacentType = (direction: -1 | 1) => {
    if (selectedTypeIndex < 0) return;
    const nextType = typeOrder[selectedTypeIndex + direction];
    if (nextType) {
      setSelectedType(nextType);
      const nextTypeGroup = getTypeByCode(nextType)?.group;
      if (nextTypeGroup) {
        setActiveGroup(nextTypeGroup);
      }
    }
  };

  return (
    <div className="min-h-screen p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-6xl mx-auto space-y-4">
        <Link href="/" className={`${buttonVariants({ variant: 'ghost' })} pl-2`}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          返回测试结果
        </Link>

        <Card className="overflow-hidden p-0">
          <div className="border-b px-6 py-4">
            <h1 className="text-xl font-semibold">查看16型人格</h1>
            <p className="text-sm text-muted-foreground mt-1">点击左侧类型即可查看详细信息</p>
          </div>

          <div className="space-y-3 border-b p-4 md:hidden">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {GROUP_META.map((group) => (
                <Button
                  key={group.key}
                  type="button"
                  size="sm"
                  variant={activeGroup === group.key ? 'default' : 'outline'}
                  className="shrink-0"
                  onClick={() => setActiveGroup(group.key)}
                >
                  {group.label}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {groups[activeGroup].types.map((type) => (
                <Button
                  key={type.type}
                  type="button"
                  size="sm"
                  variant={selectedType === type.type ? 'default' : 'outline'}
                  className={`font-mono ${selectedType === type.type ? groupColors[type.group] : ''}`}
                  onClick={() => setSelectedType(type.type as MBTIType)}
                >
                  {type.type}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={!hasPreviousType}
                onClick={() => handleAdjacentType(-1)}
              >
                上一类型
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!hasNextType}
                onClick={() => handleAdjacentType(1)}
              >
                下一类型
              </Button>
            </div>
          </div>

          <div className="flex min-h-[70vh] flex-col md:flex-row">
            <ScrollArea className="hidden border-b p-4 md:block md:w-72 md:border-b-0 md:border-r">
              <div className="space-y-4">
                {(Object.entries(groups) as [keyof typeof groups, typeof groups[keyof typeof groups]][]).map(([groupKey, group]) => (
                  <div key={groupKey}>
                    <h2 className="mb-2 text-sm font-semibold text-muted-foreground">{group.label}</h2>
                    <div className="space-y-1">
                      {group.types.map((type) => (
                        <Button
                          key={type.type}
                          variant={selectedType === type.type ? 'default' : 'ghost'}
                          className={`
                            w-full justify-start font-mono
                            ${selectedType === type.type ? groupColors[type.group] : ''}
                          `}
                          onClick={() => {
                            setSelectedType(type.type as MBTIType);
                            setActiveGroup(type.group);
                          }}
                        >
                          {type.type}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <ScrollArea className="flex-1 p-6">
              {personality ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={`px-3 py-0 text-lg ${groupColors[personality.group]}`}>
                        {personality.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{personality.nameEn}</span>
                    </div>
                    <h2 className="text-2xl font-bold">{personality.name}</h2>
                    <p className="text-primary">&quot;{personality.tagline}&quot;</p>
                  </div>

                  <div>
                    <h3 className="mb-2 font-semibold">性格描述</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{personality.description}</p>
                  </div>

                  <div>
                    <h3 className="mb-2 font-semibold">性格特征</h3>
                    <div className="flex flex-wrap gap-2">
                      {personality.traits.map((trait, index) => (
                        <Badge key={index} variant="secondary">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="mb-2 text-sm font-semibold">优势</h3>
                      <ul className="space-y-1">
                        {personality.strengths.slice(0, 6).map((strength, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="mb-2 text-sm font-semibold">成长空间</h3>
                      <ul className="space-y-1">
                        {personality.weaknesses.slice(0, 6).map((weakness, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-semibold">适合职业</h3>
                    <div className="flex flex-wrap gap-2">
                      {personality.careers.map((career, index) => (
                        <Badge key={index} variant="outline">
                          {career}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm">
                    <h3 className="mb-2 font-semibold">关系匹配</h3>
                    <p className="text-muted-foreground">最佳匹配：{personality.compatibility.best.join(', ')}</p>
                    <p className="text-muted-foreground">相似类型：{personality.compatibility.similar.join(', ')}</p>
                    <p className="text-muted-foreground">需要磨合：{personality.compatibility.challenging.join(', ')}</p>
                  </div>

                  <p className="text-xs text-muted-foreground">数据来源：{personality.source}</p>
                </div>
              ) : (
                <div className="flex h-full min-h-[40vh] items-center justify-center text-muted-foreground">
                  选择一个类型查看详情
                </div>
              )}
            </ScrollArea>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function TypesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-4" />}>
      <TypesPageContent />
    </Suspense>
  );
}
