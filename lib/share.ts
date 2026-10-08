import QRCode from 'qrcode';
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

const FONT_FAMILY =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', sans-serif";

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

export interface ShareImageOptions {
  /** 分享链接，提供时会在图片底部绘制二维码。 */
  shareUrl?: string;
}

/**
 * 生成分享图片（PNG Blob）。全部在浏览器端用 Canvas 绘制，
 * 因此可以在静态导出的站点上离线使用，无需服务端参与。
 */
export async function generateShareImage(
  personality: PersonalityType,
  percentages: Percentages,
  options: ShareImageOptions = {}
): Promise<Blob> {
  const scale = 2;
  const width = 640;
  const paddingX = 80;
  const barBlockHeight = 66;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('当前浏览器不支持 Canvas，无法生成分享图');
  }

  // 等待网页字体加载完成，避免中文/英文回退导致排版跳动。
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // 字体加载失败时继续使用系统字体。
    }
  }

  // 先测量标语行数，据此决定画布高度。
  ctx.font = `400 22px ${FONT_FAMILY}`;
  const taglineLines = wrapText(ctx, `“${personality.tagline}”`, width - paddingX * 2).slice(0, 3);

  const hasQr = Boolean(options.shareUrl);
  const topRuleY = 56;
  const groupLabelY = 122;
  const typeCodeY = 192;
  const nameY = 272;
  const taglineStartY = 322;
  const taglineStep = 32;
  const dividerY = taglineStartY + taglineLines.length * taglineStep + 16;
  const barsStartY = dividerY + 56;
  const barsEndY = barsStartY + DIMENSIONS.length * barBlockHeight;
  const qrCardSize = 136;
  const qrCardY = barsEndY + 20;
  const qrCaptionY = qrCardY + qrCardSize + 30;
  const brandY = (hasQr ? qrCaptionY : barsEndY + 20) + 34;
  const subtitleY = brandY + 30;
  const height = subtitleY + 56;

  canvas.width = width * scale;
  canvas.height = height * scale;
  ctx.scale(scale, scale);

  const accent = GROUP_COLORS[personality.group];

  // 背景渐变
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#FFFFFF');
  bg.addColorStop(1, hexToRgba(accent, 0.16));
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // 顶部装饰色块
  ctx.fillStyle = accent;
  roundRect(ctx, 48, topRuleY, width - 96, 6, 3);
  ctx.fill();

  ctx.textAlign = 'center';

  // 分组标签
  ctx.fillStyle = hexToRgba(accent, 0.9);
  ctx.font = `600 20px ${FONT_FAMILY}`;
  ctx.fillText(`${GROUP_LABELS[personality.group]} · ${personality.nameEn}`, width / 2, groupLabelY);

  // 类型代码
  ctx.fillStyle = accent;
  ctx.font = `800 104px ${FONT_FAMILY}`;
  ctx.textBaseline = 'middle';
  ctx.fillText(personality.type, width / 2, typeCodeY);

  // 中文名称
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#1B1B1F';
  ctx.font = `700 40px ${FONT_FAMILY}`;
  ctx.fillText(personality.name, width / 2, nameY);

  // 标语（自动换行）
  ctx.fillStyle = '#6B7280';
  ctx.font = `400 22px ${FONT_FAMILY}`;
  taglineLines.forEach((line, index) => {
    ctx.fillText(line, width / 2, taglineStartY + index * taglineStep);
  });

  // 分隔线
  ctx.strokeStyle = hexToRgba(accent, 0.25);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(paddingX, dividerY);
  ctx.lineTo(width - paddingX, dividerY);
  ctx.stroke();

  // 维度条形图
  DIMENSIONS.forEach((dim, index) => {
    const detail = personality.dimensions[dim];
    const percent = percentages[dim].positive;
    const labelY = barsStartY + index * barBlockHeight;

    ctx.textAlign = 'left';
    ctx.fillStyle = '#1B1B1F';
    ctx.font = `600 24px ${FONT_FAMILY}`;
    ctx.fillText(detail.label, paddingX, labelY);

    ctx.textAlign = 'right';
    ctx.fillStyle = accent;
    ctx.font = `700 24px ${FONT_FAMILY}`;
    ctx.fillText(`${detail.value}  ${percent}%`, width - paddingX, labelY);

    const barY = labelY + 18;
    ctx.fillStyle = '#EDEDF2';
    roundRect(ctx, paddingX, barY, width - paddingX * 2, 14, 7);
    ctx.fill();

    ctx.fillStyle = accent;
    const fillWidth = Math.max(14, ((width - paddingX * 2) * percent) / 100);
    roundRect(ctx, paddingX, barY, fillWidth, 14, 7);
    ctx.fill();
  });

  // 二维码
  if (options.shareUrl) {
    const qrImage = await createQrImage(options.shareUrl);
    if (qrImage) {
      const cardX = (width - qrCardSize) / 2;
      ctx.fillStyle = '#FFFFFF';
      roundRect(ctx, cardX, qrCardY, qrCardSize, qrCardSize, 20);
      ctx.fill();

      const qrInset = 14;
      const qrSize = qrCardSize - qrInset * 2;
      ctx.drawImage(qrImage, cardX + qrInset, qrCardY + qrInset, qrSize, qrSize);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#6B7280';
      ctx.font = `500 20px ${FONT_FAMILY}`;
      ctx.fillText('扫码测一测你的人格类型', width / 2, qrCaptionY);
    }
  }

  // 底部信息
  ctx.textAlign = 'center';
  ctx.fillStyle = hexToRgba(accent, 0.95);
  ctx.font = `700 26px ${FONT_FAMILY}`;
  ctx.fillText('MBTI 16型人格测试', width / 2, brandY);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = `400 20px ${FONT_FAMILY}`;
  ctx.fillText('发现真实的自己 · 测出你的人格类型', width / 2, subtitleY);

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

async function createQrImage(url: string): Promise<HTMLImageElement | null> {
  try {
    const dataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 480,
      color: { dark: '#1B1B1F', light: '#FFFFFF' },
    });
    return await loadImage(dataUrl);
  } catch {
    // 二维码生成失败时不影响整体分享图。
    return null;
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('图片加载失败'));
    image.src = src;
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

