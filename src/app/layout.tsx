import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '概念大师 - AI概念卡片生成器',
  description: '从任意起点开始，AI帮你生成结构清晰、图文并茂的概念卡片',
  keywords: ['AI', '概念卡片', '产品概念', '营销创意', '内容生成'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
