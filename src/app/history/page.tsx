'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HistoryRecord } from '@/types';

export default function HistoryPage() {
  const router = useRouter();
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 加载历史记录
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/history?limit=50');
      const data = await response.json();
      setRecords(data.records || []);
    } catch (error) {
      console.error('加载历史记录失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 恢复记录
  const handleRestore = (record: HistoryRecord) => {
    // 将记录数据存入session并跳转到结果页
    sessionStorage.setItem('restoreRecord', JSON.stringify(record));
    router.push('/result?restore=true');
  };

  // 删除记录
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条记录吗？')) return;

    try {
      await fetch(`/api/history?id=${id}`, { method: 'DELETE' });
      setRecords(records.filter(r => r.id !== id));
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/')} className="text-gray-600 hover:text-gray-900">
            ← 返回
          </button>
          <h1 className="text-lg font-semibold text-gray-900">历史记录</h1>
        </div>
        <span className="text-sm text-gray-500">
          共 {records.length} 条记录
        </span>
      </header>

      {/* 列表 */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-gray-500">加载中...</p>
          </div>
        ) : records.length > 0 ? (
          <div className="space-y-4">
            {records.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex">
                  {/* 缩略图 */}
                  <div className="w-32 h-32 bg-gray-100 flex-shrink-0">
                    {record.imageUrl ? (
                      <img
                        src={record.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        无图
                      </div>
                    )}
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {record.topic || '未命名'}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <span className="bg-gray-100 px-2 py-0.5 rounded">
                            {record.templateName}
                          </span>
                          <span>•</span>
                          <span>{formatDate(record.createdAt)}</span>
                        </div>
                        {record.content && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {Object.values(record.content).slice(0, 2).join(' | ')}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleRestore(record)}
                        className="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                      >
                        恢复
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="px-4 py-1.5 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50"
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
            <span className="text-6xl mb-4 block">📝</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无历史记录</h3>
            <p className="text-gray-500 mb-6">开始创建你的第一个概念卡片吧</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
            >
              开始创建
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
