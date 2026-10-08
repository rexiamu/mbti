'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Answers, PersonalityType } from '@/lib/types';
import { buildShareText, DIMENSIONS, generateShareImage, getShareUrl } from '@/lib/share';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Copy, Download, ImageUp, Loader2, Share2, Link2 } from 'lucide-react';

type Percentages = Record<keyof Answers, { positive: number; negative: number }>;

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personality: PersonalityType;
  percentages: Percentages;
  testLength: 'quick' | 'full';
}

export function ShareDialog({
  open,
  onOpenChange,
  personality,
  percentages,
  testLength,
}: ShareDialogProps) {
  const [image, setImage] = useState<{ key: string; url: string; blob: Blob } | null>(null);
  const [errorState, setErrorState] = useState<{ key: string; message: string } | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const generatedKeyRef = useRef<string | null>(null);

  const percentKey = DIMENSIONS.map((dim) => percentages[dim].positive).join('-');
  const resultKey = `${personality.type}:${percentKey}`;
  const shareUrl = getShareUrl();
  const shareText = buildShareText(personality, percentages, testLength);

  const imageUrl = image?.key === resultKey ? image.url : null;
  const imageError = errorState?.key === resultKey ? errorState.message : null;
  const isGenerating = open && !imageUrl && !imageError;

  // 生成分享图（同一结果只生成一次，避免重复绘制）
  useEffect(() => {
    if (!open) return;
    if (generatedKeyRef.current === resultKey) return;
    generatedKeyRef.current = resultKey;

    let cancelled = false;
    let settled = false;

    generateShareImage(personality, percentages, { shareUrl })
      .then((blob) => {
        settled = true;
        if (cancelled) return;
        setImage({ key: resultKey, url: URL.createObjectURL(blob), blob });
      })
      .catch((error: unknown) => {
        settled = true;
        if (cancelled) return;
        generatedKeyRef.current = null;
        setErrorState({
          key: resultKey,
          message: error instanceof Error ? error.message : '生成分享图失败，请重试',
        });
      });

    return () => {
      cancelled = true;
      // 尚未完成就被中断时，允许下次重新生成。
      if (!settled) generatedKeyRef.current = null;
    };
  }, [open, resultKey, personality, percentages, shareUrl]);

  // 组件卸载 / 图片切换时释放 ObjectURL
  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image.url);
    };
  }, [image]);

  // 提示信息自动消失
  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 2000);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  // 分享图片文件（支持 Web Share Level 2 的浏览器可直接把 PNG 发给 App）
  const imageFile = useMemo(() => {
    if (typeof File === 'undefined') return null;
    if (!image || image.key !== resultKey) return null;
    return new File([image.blob], `MBTI-${personality.type}.png`, { type: 'image/png' });
  }, [image, resultKey, personality.type]);

  const canShareImage =
    imageFile !== null &&
    typeof navigator !== 'undefined' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [imageFile] });

  const shareImageFile = async () => {
    if (!imageFile) return;
    try {
      await navigator.share({
        files: [imageFile],
        title: `我的 MBTI 人格类型是 ${personality.type} · ${personality.name}`,
        text: shareText,
      });
    } catch {
      // 用户取消分享，无需提示
    }
  };

  const copyText = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setFeedback('文案已复制');
    } catch {
      setFeedback('复制失败，请手动选择文本');
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${getShareUrl()}`);
      setFeedback('链接与文案已复制');
    } catch {
      setFeedback('复制失败，请手动复制');
    }
  };

  const canNativeShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const shareNative = async () => {
    if (!canNativeShare) return;
    try {
      await navigator.share({
        title: `我的 MBTI 人格类型是 ${personality.type} · ${personality.name}`,
        text: shareText,
        url: getShareUrl(),
      });
    } catch {
      // 用户取消分享，无需提示
    }
  };

  const downloadImage = () => {
    if (!image || image.key !== resultKey) return;
    const url = URL.createObjectURL(image.blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `MBTI-${personality.type}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    setFeedback('分享图已保存');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-primary" />
            分享测试结果
          </DialogTitle>
          <DialogDescription>
            把「{personality.type} · {personality.name}」分享给朋友，或保存成图片发到社交平台。
          </DialogDescription>
        </DialogHeader>

        {/* 分享图预览 */}
        <div className="relative overflow-hidden rounded-lg border bg-muted/40">
          {isGenerating && (
            <div className="flex h-80 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              正在生成分享图…
            </div>
          )}

          {!isGenerating && imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={`${personality.type} 结果分享图`}
              className="mx-auto max-h-80 w-auto"
            />
          )}

          {!isGenerating && imageError && (
            <div className="flex h-40 items-center justify-center px-6 text-center text-sm text-destructive">
              {imageError}
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="grid grid-cols-2 gap-2">
          {canShareImage && (
            <Button onClick={shareImageFile} className="col-span-2">
              <ImageUp className="w-4 h-4 mr-2" />
              分享图片
            </Button>
          )}
          {canNativeShare && (
            <Button
              onClick={shareNative}
              variant={canShareImage ? 'outline' : 'default'}
              className="col-span-2"
            >
              <Share2 className="w-4 h-4 mr-2" />
              分享文案与链接
            </Button>
          )}
          <Button variant="outline" onClick={copyText}>
            <Copy className="w-4 h-4 mr-2" />
            复制文案
          </Button>
          <Button variant="outline" onClick={copyLink}>
            <Link2 className="w-4 h-4 mr-2" />
            复制链接
          </Button>
          <Button
            variant="outline"
            onClick={downloadImage}
            disabled={!imageUrl}
            className="col-span-2"
          >
            <Download className="w-4 h-4 mr-2" />
            保存分享图
          </Button>
        </div>

        <p className="flex min-h-5 items-center justify-center gap-1 text-center text-xs text-muted-foreground">
          {feedback && (
            <>
              <Check className="w-3.5 h-3.5 text-primary" />
              {feedback}
            </>
          )}
        </p>
      </DialogContent>
    </Dialog>
  );
}
