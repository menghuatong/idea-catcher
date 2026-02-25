'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Lightbulb, 
  FileText, 
  Sparkles, 
  Image as ImageIcon, 
  Search, 
  ArrowRight,
  History,
  Settings,
  Zap
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/store/useAppStore';
import { HOT_TOPICS, EntryType } from '@/types';

const ENTRY_OPTIONS = [
  { 
    type: 'topic' as EntryType, 
    icon: Lightbulb, 
    title: '输入主题', 
    desc: '输入关键词，AI搜索数据生成概念',
    iconColor: 'text-primary',
    cardBg: 'bg-primary/10',
    hoverBg: 'hover:bg-primary/20',
  },
  { 
    type: 'file' as EntryType, 
    icon: FileText, 
    title: '上传资料', 
    desc: '上传PDF/Word，提取要点生成概念',
    iconColor: 'text-cyan-500',
    cardBg: 'bg-cyan-500/10',
    hoverBg: 'hover:bg-cyan-500/20',
  },
  { 
    type: 'text' as EntryType, 
    icon: Sparkles, 
    title: '粘贴文字', 
    desc: '粘贴已有内容，AI优化并配图',
    iconColor: 'text-orange-500',
    cardBg: 'bg-orange-500/10',
    hoverBg: 'hover:bg-orange-500/20',
  },
  { 
    type: 'image' as EntryType, 
    icon: ImageIcon, 
    title: '上传图片', 
    desc: '上传图片，AI分析生成匹配文案',
    iconColor: 'text-emerald-500',
    cardBg: 'bg-emerald-500/10',
    hoverBg: 'hover:bg-emerald-500/20',
  },
];

export default function HomePage() {
  const router = useRouter();
  const { setEntryType, setSearchKeyword } = useAppStore();
  const [topic, setTopic] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEntrySelect = (type: EntryType) => {
    setEntryType(type);
    if (type !== 'topic') {
      router.push(`/upload?type=${type}`);
    }
  };

  const handleSearch = () => {
    if (!topic.trim()) return;
    setEntryType('topic');
    setSearchKeyword(topic);
    router.push('/search');
  };

  const handleHotTopic = (name: string) => {
    setTopic(name);
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-background">
      {/* 背景 */}
      <div className="fixed inset-0 grid-bg" />
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }} />

      {/* 导航栏 */}
      <header className="relative z-50 flex items-center justify-between px-6 py-4 lg:px-12 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-xl text-primary-foreground shadow-lg shadow-primary/30">
            🎯
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">概念大师</h1>
            <p className="text-xs text-muted-foreground">AI概念卡片生成器</p>
          </div>
        </div>
        
        <nav className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/history')}
            className="text-muted-foreground"
          >
            <History className="h-4 w-4 mr-2" />
            历史记录
          </Button>
          <Button variant="ghost" className="text-muted-foreground">
            <Settings className="h-4 w-4 mr-2" />
            设置
          </Button>
        </nav>
      </header>

      {/* 主内容区 */}
      <section className="relative z-10 flex flex-col items-center justify-center px-6 pt-12 pb-20 lg:pt-20">
        {/* 标题区 */}
        <div className="text-center mb-12 max-w-3xl">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Zap className="h-3 w-3 mr-2" />
            AI驱动的概念卡片生成器
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">给AI一个方向</span>
            <br />
            <span className="text-foreground">还你一个概念卡片</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            从任意起点开始，AI帮你生成结构清晰、图文并茂、可直接投放的概念卡片
          </p>
        </div>

        {/* 入口卡片 - 4列网格 */}
        <div className="w-full max-w-5xl mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ENTRY_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <Card 
                  key={option.type}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${option.hoverBg} bg-card border-border`}
                  onClick={() => handleEntrySelect(option.type)}
                >
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-xl ${option.cardBg} flex items-center justify-center mb-4`}>
                      <Icon className={`h-7 w-7 ${option.iconColor}`} />
                    </div>
                    <CardTitle className="text-lg mb-2 text-card-foreground">{option.title}</CardTitle>
                    <CardDescription className="text-sm">{option.desc}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* 搜索框 */}
        <div className="w-full max-w-2xl mb-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="relative flex items-center bg-card rounded-xl border border-border overflow-hidden">
              <Search className="h-5 w-5 ml-5 text-muted-foreground" />
              <Input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="输入你想探索的方向，如：宠物经济、AI工具..."
                className="flex-1 border-0 bg-transparent px-4 py-6 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                onClick={handleSearch}
                disabled={!topic.trim()}
                className="m-2 bg-primary hover:bg-primary/90"
              >
                开始生成
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* 热门话题 */}
        <div className="w-full max-w-2xl">
          <p className="text-center text-muted-foreground text-sm mb-4">🔥 热门方向，点击快速开始</p>
          <div className="flex flex-wrap justify-center gap-2">
            {HOT_TOPICS.map((t) => (
              <Button
                key={t.id}
                variant="outline"
                size="sm"
                onClick={() => handleHotTopic(t.name)}
                className="rounded-full"
              >
                {t.icon} {t.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* 分隔线 */}
      <Separator className="relative z-10" />

      {/* 底部 */}
      <footer className="relative z-10 text-center py-6">
        <p className="text-sm text-muted-foreground">
          概念大师 © 2026 · Made with ❤️ by AI
        </p>
      </footer>
    </main>
  );
}
