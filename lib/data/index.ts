import { PersonalityType, MBTIType } from '../types';
import typesData from './types.json';

const types: PersonalityType[] = typesData as PersonalityType[];

/**
 * 获取所有人格类型
 */
export function getAllTypes(): PersonalityType[] {
  return types;
}

/**
 * 根据类型代码获取详细信息
 */
export function getTypeByCode(code: MBTIType): PersonalityType | undefined {
  return types.find(t => t.type === code);
}

/**
 * 根据分组获取类型
 */
export function getTypesByGroup(group: 'analyst' | 'diplomat' | 'sentinel' | 'explorer'): PersonalityType[] {
  return types.filter(t => t.group === group);
}

/**
 * 获取类型颜色类名
 */
export function getTypeColorClass(group: PersonalityType['group']): string {
  const colorMap = {
    analyst: 'bg-analyst text-analyst-foreground',
    diplomat: 'bg-diplomat text-diplomat-foreground',
    sentinel: 'bg-sentinel text-sentinel-foreground',
    explorer: 'bg-explorer text-explorer-foreground',
  };
  return colorMap[group];
}
