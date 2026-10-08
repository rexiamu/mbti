import { Answers, PersonalityType } from './types';

/**
 * 各人格分组的主题色（与 globals.css 中的 --color-* 保持一致）。
 */
const GROUP_COLORS: Record<PersonalityType['group'], string> = {
  analyst: '#8B5CF6',
  diplomat: '#F97316',
  sentinel: '#0EA5E9',
  explorer: '#EAB308',
};

const GROUP_LABELS: Record<PersonalityType['group'], string> = {
  analyst: '分析师',
  diplomat: '外交官',
  sentinel: '守护者',
  explorer: '探险家',
};

const DIMENSIONS = ['EI', 'SN', 'TF', 'JP'] as const;

const DIMENSION_LABELS: Record<keyof Answers, string> = {
  EI: '外向 / 内向',
  SN: '实感 / 直觉',
  TF: '思考 / 情感',
  JP: '判断 / 感知',
};

type Percentages = Record<keyof Answers, { positive: number; negative: number }>;

/**
 * 拼接用于分享的纯文本，例如用于复制到剪贴板或分享到聊天工具。
 */
export function buildShareText(
  personality: PersonalityType,
  percentages: Percentages,
  testLength: 'quick' | 'full' = 'full'
): string {
  const dimensionLines = DIMENSIONS.map((dim) => {
    const letter = personality.dimensions[dim].value;
    return `· ${DIMENSION_LABELS[dim]} ${letter}：${percentages[dim].positive}%`;
  });

  return [
    `我的 MBTI 人格类型是 ${personality.type} · ${personality.name}`,
    `「${personality.tagline}」`,
    '',
    '维度倾向：',
    ...dimensionLines,
    '',
    testLength === 'quick'
      ? '来自 MBTI 16型人格测试（快速版）'
      : '来自 MBTI 16型人格测试（完整版）',
  ].join('\n');
}

/**
 * 分享链接（静态站点，默认指向首页）。
 */
export function getShareUrl(): string {
  const base =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL || '';
  return `${base.replace(/\/$/, '')}/`;
}

/** 根据分组获取主题色，供 UI 复用。 */
export function getGroupColor(group: PersonalityType['group']): string {
  return GROUP_COLORS[group];
}

/**
 * 生成分享图片（PNG Blob）。全部在浏览器端用 Canvas 绘制，
 * 因此可以在静态导出的站点上离线使用，无需服务端参与。
 */
export async function generateShareImage(
  personality: PersonalityType,
  percentages: Percentages
): Promise<Blob> {
  const scale = 2;
  const width = 640;
  const height = 960;

  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('当前浏览器不支持 Canvas，无法生成分享图');
  }
  ctx.scale(scale, scale);

  // 等待网页字体加载完成，避免中文/英文回退导致排版跳动。
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // 字体加载失败时继续使用系统字体。
    }
  }

  const accent = GROUP_COLORS[personality.group];
  const fontFamily =
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', sans-serif";

  // 背景渐变
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#FFFFFF');
  bg.addColorStop(1, hexToRgba(accent, 0.16));
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // 顶部装饰色块
  ctx.fillStyle = accent;
  roundRect(ctx, 48, 56, width - 96, 6, 3);
  ctx.fill();

  ctx.textAlign = 'center';

  // 分组标签
  ctx.fillStyle = hexToRgba(accent, 0.9);
  ctx.font = `600 20px ${fontFamily}`;
  ctx.fillText(`${GROUP_LABELS[personality.group]} · ${personality.nameEn}`, width / 2, 122);

  // 类型代码
  ctx.fillStyle = accent;
  ctx.font = `800 104px ${fontFamily}`;
  ctx.textBaseline = 'middle';
  ctx.fillText(personality.type, width / 2, 192);

  // 中文名称
  ctx.fillStyle = '#1B1B1F';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `700 40px ${fontFamily}`;
  ctx.fillText(personality.name, width / 2, 272);

  // 标语（自动换行）
  ctx.fillStyle = '#6B7280';
  ctx.font = `400 22px ${fontFamily}`;
  const taglineLines = wrapText(ctx, `“${personality.tagline}”`, width - 160);
  taglineLines.slice(0, 3).forEach((line, index) => {
    ctx.fillText(line, width / 2, 322 + index * 32);
  });

  // 分隔线
  const dividerY = 322 + Math.min(taglineLines.length, 3) * 32 + 16;
  ctx.strokeStyle = hexToRgba(accent, 0.25);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, dividerY);
  ctx.lineTo(width - 80, dividerY);
  ctx.stroke();

  // 维度条形图
  let cursorY = dividerY + 56;
  DIMENSIONS.forEach((dim) => {
    const detail = personality.dimensions[dim];
    const percent = percentages[dim].positive;

    ctx.textAlign = 'left';
    ctx.fillStyle = '#1B1B1F';
    ctx.font = `600 24px ${fontFamily}`;
    ctx.fillText(detail.label, 80, cursorY);

    ctx.textAlign = 'right';
    ctx.fillStyle = accent;
    ctx.font = `700 24px ${fontFamily}`;
    ctx.fillText(`${detail.value}  ${percent}%`, width - 80, cursorY);

    const barY = cursorY + 18;
    ctx.fillStyle = '#EDEDF2';
    roundRect(ctx, 80, barY, width - 160, 14, 7);
    ctx.fill();

    ctx.fillStyle = accent;
    const fillWidth = Math.max(14, ((width - 160) * percent) / 100);
    roundRect(ctx, 80, barY, fillWidth, 14, 7);
    ctx.fill();

    cursorY = barY + 66;
  });

  // 底部信息
  ctx.textAlign = 'center';
  ctx.fillStyle = hexToRgba(accent, 0.95);
  ctx.font = `700 26px ${fontFamily}`;
  ctx.fillText('MBTI 16型人格测试', width / 2, height - 96);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = `400 20px ${fontFamily}`;
  ctx.fillText('发现真实的自己 · 测出你的人格类型', width / 2, height - 62);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('生成分享图失败，请重试'));
      }
    }, 'image/png');
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, h / 2, w / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let current = '';

  for (const char of Array.from(text)) {
    const next = current + char;
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current);
      current = char;
    } else {
      current = next;
    }
  }
  if (current) {
    lines.push(current);
  }
  return lines;
}

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export { DIMENSIONS, DIMENSION_LABELS, GROUP_COLORS };
