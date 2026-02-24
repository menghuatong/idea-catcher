'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HistoryRecord } from '@/types';

export default function HistoryPage() {
  const router = useRouter();
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

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

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#0F0F23] relative overflow-hidden">
      {/* 背景 */}
      <div className="fixed inset-0 grid-bg" />
      <div className="fixed top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />

      {/* 顶部导航 */}
      <header className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/')} 
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 transition-all"
          >
            ←
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">历史记录</h1>
            <p className="text-xs text-gray-500">共 {records.length} 条记录</p>
          </div>
        </div>
      </header>

      {/* 列表 */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#1A1A2E] rounded-xl p-4 border border-white/5 flex gap-4">
                <div className="skeleton w-24 h-24 rounded-lg" />
                <div className="flex-1">
                  <div className="skeleton h-5 w-1/2 mb-3" />
                  <div className="skeleton h-4 w-1/4 mb-2" />
                  <div className="skeleton h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : records.length > 0 ? (
          <div className="space-y-4">
            {records.map((record) => (
              <div
                key={record.id}
                className="group bg-[#1A1A2E] rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
              >
                <div className="flex">
                  {/* 缩略图 */}
                  <div className="w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex-shrink-0 relative overflow-hidden">
                    {record.imageUrl ? (
                      <img src={record.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                        无图
                      </div>
                    )}
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-white text-lg mb-1">
                          {record.topic || '未命名'}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                            {record.templateName}
                          </span>
                          <span>•</span>
                          <span>{formatDate(record.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {record.content && (
                      <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                        {Object.values(record.content).slice(0, 2).join(' | ')}
                      </p>
                    )}

                    {/* 操作按钮 */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRestore(record)}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                      >
                        恢复
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="px-4 py-2 bg-white/5 text-gray-400 text-sm rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-4xl mx-auto mb-6">
              📜
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">暂无历史记录</h3>
            <p className="text-gray-400 mb-8">开始创建你的第一个概念卡片吧</p>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
            >
              开始创建 ✨
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
