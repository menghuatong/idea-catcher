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
    <main className="min-h-screen bg-[#0F0F23] relative overflow-hidden">
      {/* 背景效果 */}
      <div className="fixed inset-0 grid-bg" />
      <div className="fixed top-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />

      {/* 顶部导航 */}
      <header className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/')} 
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all"
          >
            ←
          </button>
          
          {/* 步骤指示器 */}
          <div className="flex items-center gap-2">
            {['数据获取', '选择模板', '生成结果'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i === 0 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                    : 'bg-white/5 text-gray-500'
                }`}>
                  {i + 1}
                </div>
                <span className={`text-sm ${i === 0 ? 'text-white' : 'text-gray-500'}`}>
                  {step}
                </span>
                {i < 2 && <div className="w-8 h-px bg-white/10" />}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 搜索框 */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 bg-[#1A1A2E] rounded-xl p-2 border border-white/10">
          <span className="text-xl pl-3 text-gray-400">🔍</span>
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleResarch()}
            placeholder="输入关键词搜索..."
            className="flex-1 bg-transparent py-3 text-white placeholder-gray-500 outline-none"
          />
          <button
            onClick={handleResarch}
            disabled={isLoading || !searchKeyword.trim()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium disabled:opacity-30 transition-all"
          >
            {isLoading ? '搜索中...' : '重新搜索'}
          </button>
        </div>
      </div>

      {/* 搜索结果 */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 pb-32">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#1A1A2E] rounded-xl p-4 border border-white/5">
                <div className="skeleton h-5 w-3/4 mb-3" />
                <div className="skeleton h-4 w-full mb-2" />
                <div className="skeleton h-3 w-1/4" />
              </div>
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-3">
            {searchResults.map((result) => (
              <div
                key={result.id}
                onClick={() => toggleResultSelection(result.id)}
                className={`group relative bg-[#1A1A2E] rounded-xl p-5 cursor-pointer transition-all duration-300 border ${
                  result.selected
                    ? 'border-indigo-500/50 bg-indigo-500/10'
                    : 'border-white/5 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* 选择框 */}
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    result.selected
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600'
                      : 'bg-white/10 group-hover:bg-white/20'
                  }`}>
                    {result.selected && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  
                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white mb-2 group-hover:text-indigo-300 transition-colors">
                      {result.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                      {result.snippet}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="px-2 py-1 rounded bg-white/5">
                        📎 {result.source}
                      </span>
                      {result.url && (
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-indigo-400 hover:text-indigo-300 transition-colors"
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
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg mb-2">未找到相关数据</p>
            <p className="text-gray-500 text-sm">请尝试其他关键词</p>
          </div>
        )}
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0F0F23]/90 backdrop-blur-lg border-t border-white/5 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">已选择</span>
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-medium">
              {selectedCount} 条
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-all"
            >
              上一步
            </button>
            <button
              onClick={handleNext}
              disabled={selectedCount === 0}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium disabled:opacity-30 transition-all hover:shadow-lg hover:shadow-indigo-500/30"
            >
              下一步：选择模板 →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
