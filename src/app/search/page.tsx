'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Search, 
  ExternalLink, 
  Check,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/store/useAppStore';
import { SearchResult } from '@/types';

export default function SearchPage() {
  const router = useRouter();
  const {
    searchKeyword,
    setSearchKeyword,
    searchResults,
    setSearchResults,
    toggleResultSelection,
  } = useAppStore();

  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (searchKeyword) {
      performSearch(searchKeyword);
    }
  }, []);

  const performSearch = async (keyword: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, limit: 10 }),
      });
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('搜索失败:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResarch = () => {
    if (searchKeyword.trim()) {
      performSearch(searchKeyword);
    }
  };

  const handleNext = () => {
    const selectedCount = searchResults.filter(r => r.selected).length;
    if (selectedCount === 0) {
      alert('请至少选择一条数据');
      return;
    }
    router.push('/template');
  };

  const selectedCount = searchResults.filter(r => r.selected).length;

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* 背景效果 */}
      <div className="fixed inset-0 grid-bg" />
      <div className="fixed top-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />

      {/* 顶部导航 */}
      <header className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          {/* 步骤指示器 */}
          <div className="flex items-center gap-2">
            {['数据获取', '选择模板', '生成结果'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i === 0 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {i + 1}
                </div>
                <span className={`text-sm hidden sm:inline ${i === 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step}
                </span>
                {i < 2 && <div className="w-8 h-px bg-border hidden sm:block" />}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Progress value={25} className="w-24 hidden sm:flex" />
          <span className="text-sm text-muted-foreground hidden sm:inline">步骤 1/4</span>
        </div>
      </header>

      {/* 搜索框 */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 bg-card rounded-xl p-2 border border-border">
          <Search className="h-5 w-5 ml-3 text-muted-foreground" />
          <Input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleResarch()}
            placeholder="输入关键词搜索..."
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button
            onClick={handleResarch}
            disabled={isLoading || !searchKeyword.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                搜索中
              </>
            ) : (
              '重新搜索'
            )}
          </Button>
        </div>
      </div>

      {/* 搜索结果 */}
      <ScrollArea className="relative z-10 max-w-3xl mx-auto px-6 h-[calc(100vh-280px)]">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border">
                <CardContent className="p-5">
                  <Skeleton className="h-5 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-3 pb-4">
            {searchResults.map((result) => (
              <Card
                key={result.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                  result.selected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => toggleResultSelection(result.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* 选择框 */}
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all border ${
                      result.selected
                        ? 'bg-primary border-primary'
                        : 'bg-muted border-border'
                    }`}>
                      {result.selected && (
                        <Check className="h-4 w-4 text-primary-foreground" />
                      )}
                    </div>
                    
                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground mb-2">
                        {result.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {result.snippet}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                          {result.source}
                        </Badge>
                        {result.url && (
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            查看原文
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-muted-foreground text-lg mb-2">未找到相关数据</p>
            <p className="text-muted-foreground/70 text-sm">请尝试其他关键词</p>
          </div>
        )}
      </ScrollArea>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-t border-border px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">已选择</span>
            <Badge variant="secondary" className="font-medium">
              {selectedCount} 条
            </Badge>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/')}
            >
              上一步
            </Button>
            <Button
              onClick={handleNext}
              disabled={selectedCount === 0}
              className="bg-primary hover:bg-primary/90"
            >
              下一步：选择模板
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
