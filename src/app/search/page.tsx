'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
    setIsLoading,
    setLoadingMessage,
  } = useAppStore();

  const [isLoading, setIsLoadingLocal] = useState(false);

  // 初始搜索
  useEffect(() => {
    if (searchKeyword) {
      performSearch(searchKeyword);
    }
  }, []);

  // 执行搜索
  const performSearch = async (keyword: string) => {
    setIsLoadingLocal(true);
    setIsLoading(true);
    setLoadingMessage('正在搜索相关数据...');

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, limit: 10 }),
      });

      const data = await response.json();
      
      if (data.results) {
        setSearchResults(data.results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('搜索失败:', error);
      setSearchResults([]);
    } finally {
      setIsLoadingLocal(false);
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // 重新搜索
  const handleResarch = () => {
    if (searchKeyword.trim()) {
      performSearch(searchKeyword);
    }
  };

  // 下一步
  const handleNext = () => {
    const selectedCount = searchResults.filter(r => r.selected).length;
    if (selectedCount === 0) {
      alert('请至少选择一条数据');
      return;
    }
    router.push('/template');
  };

  // 获取选中数量
  const selectedCount = searchResults.filter(r => r.selected).length;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/')} className="text-gray-600 hover:text-gray-900">
            ← 返回
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-medium">
              1
            </div>
            <span className="text-gray-900 font-medium">数据获取</span>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          步骤 1/4
        </div>
      </header>

      {/* 搜索框 */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-2">
          <span className="text-xl pl-2">🔍</span>
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleResarch()}
            placeholder="输入关键词搜索..."
            className="flex-1 bg-transparent py-2 text-gray-900 placeholder-gray-400 outline-none"
          />
          <button
            onClick={handleResarch}
            disabled={isLoading || !searchKeyword.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium disabled:opacity-50"
          >
            {isLoading ? '搜索中...' : '重新搜索'}
          </button>
        </div>
      </div>

      {/* 搜索结果 */}
      <div className="max-w-4xl mx-auto px-6 pb-32">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-gray-500">正在搜索相关数据...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-4">
            {searchResults.map((result) => (
              <div
                key={result.id}
                onClick={() => toggleResultSelection(result.id)}
                className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all ${
                  result.selected
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                    result.selected
                      ? 'border-indigo-600 bg-indigo-600'
                      : 'border-gray-300'
                  }`}>
                    {result.selected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M10.28 2.28L4 8.56 1.72 6.28a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l7-7a.75.75 0 00-1.06-1.06z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{result.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{result.snippet}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>来源：{result.source}</span>
                      {result.url && (
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-indigo-600 hover:underline"
                        >
                          查看原文 →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">🔍</span>
            <p className="text-gray-500">未找到相关数据</p>
            <p className="text-gray-400 text-sm mt-2">请尝试其他关键词</p>
          </div>
        )}
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="text-sm text-gray-500">
            已选择 <span className="font-medium text-indigo-600">{selectedCount}</span> 条数据
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
            >
              上一步
            </button>
            <button
              onClick={handleNext}
              disabled={selectedCount === 0}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium disabled:opacity-50"
            >
              下一步：选择模板
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
