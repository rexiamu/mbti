import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "MBTI 16型人格测试 - 发现真实的自己",
    template: "%s | MBTI 人格测试",
  },
  description: "免费的 MBTI 16型人格测试，帮助你了解自己的性格类型、优势劣势、职业建议和人际关系匹配。快速测试仅需2分钟，完整测试更加精准。",
  keywords: ["MBTI", "人格测试", "性格测试", "16型人格", "职业规划", "性格分析"],
  authors: [{ name: "MBTI Test" }],
  creator: "MBTI Test",
  publisher: "MBTI Test",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "/",
    title: "MBTI 16型人格测试 - 发现真实的自己",
    description: "免费的 MBTI 16型人格测试，帮助你了解自己的性格类型、优势劣势、职业建议和人际关系匹配。",
    siteName: "MBTI 人格测试",
  },
  twitter: {
    card: "summary_large_image",
    title: "MBTI 16型人格测试 - 发现真实的自己",
    description: "免费的 MBTI 16型人格测试，帮助你了解自己的性格类型、优势劣势、职业建议和人际关系匹配。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
