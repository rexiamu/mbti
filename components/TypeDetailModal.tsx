'use client';

import { useState } from 'react';
import { MBTIType } from '@/lib/types';
import { getAllTypes, getTypeByCode } from '@/lib/data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TypeDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialType?: MBTIType;
}

export function TypeDetailModal({ open, onOpenChange, initialType }: TypeDetailModalProps) {
  const [selectedType, setSelectedType] = useState<MBTIType | undefined>(initialType);
  const allTypes = getAllTypes();

  const personality = selectedType ? getTypeByCode(selectedType) : null;

  const groupColors = {
    analyst: 'bg-analyst text-white',
    diplomat: 'bg-diplomat text-white',
    sentinel: 'bg-sentinel text-white',
    explorer: 'bg-explorer text-white',
  };

  const groups = {
    analyst: { label: '分析师', types: allTypes.filter(t => t.group === 'analyst') },
    diplomat: { label: '外交官', types: allTypes.filter(t => t.group === 'diplomat') },
    sentinel: { label: '守护者', types: allTypes.filter(t => t.group === 'sentinel') },
    explorer: { label: '探险家', types: allTypes.filter(t => t.group === 'explorer') },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>查看16型人格</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* 类型列表 */}
          <ScrollArea className="flex-1 md:w-1/3 md:border-r p-4">
            <div className="space-y-4">
              {(Object.entries(groups) as [keyof typeof groups, typeof groups[keyof typeof groups]][]).map(([groupKey, group]) => (
                <div key={groupKey}>
                  <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                    {group.label}
                  </h3>
                  <div className="space-y-1">
                    {group.types.map((type) => (
                      <Button
                        key={type.type}
                        variant={selectedType === type.type ? 'default' : 'ghost'}
                        className={`
                          w-full justify-start font-mono
                          ${selectedType === type.type ? groupColors[type.group] : ''}
                        `}
                        onClick={() => setSelectedType(type.type as MBTIType)}
                      >
                        {type.type}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* 类型详情 */}
          <ScrollArea className="flex-1 md:w-2/3 p-6">
            {personality ? (
              <div className="space-y-6">
                {/* 类型标题 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-lg px-3 py-0 ${groupColors[personality.group]}`}>
                      {personality.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{personality.nameEn}</span>
                  </div>
                  <h2 className="text-2xl font-bold">{personality.name}</h2>
                  <p className="text-primary">&quot;{personality.tagline}&quot;</p>
                </div>

                {/* 描述 */}
                <div>
                  <h3 className="font-semibold mb-2">性格描述</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {personality.description}
                  </p>
                </div>

                {/* 特征标签 */}
                <div>
                  <h3 className="font-semibold mb-2">性格特征</h3>
                  <div className="flex flex-wrap gap-2">
                    {personality.traits.map((trait, index) => (
                      <Badge key={index} variant="secondary">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 优势与劣势 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-sm">优势</h3>
                    <ul className="space-y-1">
                      {personality.strengths.slice(0, 4).map((strength, index) => (
                        <li key={index} className="text-xs flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-green-500" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-sm">成长空间</h3>
                    <ul className="space-y-1">
                      {personality.weaknesses.slice(0, 4).map((weakness, index) => (
                        <li key={index} className="text-xs flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-muted" />
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 职业建议 */}
                <div>
                  <h3 className="font-semibold mb-2">适合职业</h3>
                  <div className="flex flex-wrap gap-1">
                    {personality.careers.slice(0, 6).map((career, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {career}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 数据来源 */}
                <p className="text-xs text-muted-foreground">
                  数据来源：{personality.source}
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                选择一个类型查看详情
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
