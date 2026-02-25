'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Trash2, 
  RotateCcw, 
  Plus,
  Search,
  FileX,
  Calendar
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { HistoryRecord } from '@/types';

export default function HistoryPage() {
  const router = useRouter();
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    setMounted(true);
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/history?limit=50');
      const data = await response.json();
      setRecords(data.records || []);
    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = (record: HistoryRecord) => {
    sessionStorage.setItem('restoreRecord', JSON.stringify(record));
    router.push('/result?restore=true');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条记录吗？')) return;
    try {
      await fetch(`/api/history?id=${id}`, { method: 'DELETE' });
      setRecords(records.filter(r => r.id !== id));
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredRecords = records.filter(record => {
    if (searchQuery && !record.topic?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-background">
      {/* 背景 */}
      <div className="fixed inset-0 grid-bg" />
      <div className="fixed top-1/3 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />

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
          <div>
            <h1 className="text-lg font-bold text-foreground">历史记录</h1>
            <p className="text-xs text-muted-foreground">共 {records.length} 条记录</p>
          </div>
        </div>
      </header>

      {/* 筛选区 */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索主题..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="时间筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="today">今天</SelectItem>
              <SelectItem value="week">最近7天</SelectItem>
              <SelectItem value="month">最近30天</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 列表 */}
      <ScrollArea className="relative z-10 max-w-4xl mx-auto px-6 h-[calc(100vh-220px)]">
        {isLoading ? (
          <div className="space-y-4 pb-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4 flex gap-4">
                  <Skeleton className="w-24 h-24 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredRecords.length > 0 ? (
          <div className="space-y-4 pb-6">
            {filteredRecords.map((record) => (
              <Card 
                key={record.id}
                className="hover:border-primary/50 transition-colors overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="flex">
                    {/* 缩略图 */}
                    <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-purple-500/20 flex-shrink-0 relative overflow-hidden">
                      {record.imageUrl ? (
                        <img src={record.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                          无图
                        </div>
                      )}
                    </div>

                    {/* 内容 */}
                    <div className="flex-1 p-4">
                      <div className="mb-3">
                        <h3 className="font-semibold text-card-foreground text-lg mb-2">
                          {record.topic || '未命名'}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary">
                            {record.templateName}
                          </Badge>
                          <span>•</span>
                          <span>{formatDate(record.createdAt)}</span>
                        </div>
                      </div>

                      {record.content && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {Object.values(record.content).slice(0, 2).join(' | ')}
                        </p>
                      )}

                      {/* 操作按钮 */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleRestore(record)}
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          恢复
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(record.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          删除
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <FileX className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">暂无历史记录</h3>
            <p className="text-muted-foreground mb-8">开始创建你的第一个概念卡片吧</p>
            <Button
              onClick={() => router.push('/')}
            >
              <Plus className="h-4 w-4 mr-2" />
              开始创建
            </Button>
          </div>
        )}
      </ScrollArea>
    </main>
  );
}
