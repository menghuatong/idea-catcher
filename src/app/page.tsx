'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { HOT_TOPICS, EntryType } from '@/types';

// 入口配置
const ENTRY_OPTIONS: { type: EntryType; icon: string; title: string; desc: string; color: string }[] = [
  { type: 'topic', icon: '📝', title: '输入主题', desc: '输入关键词搜索数据', color: 'from-blue-500 to-indigo-600' },
  { type: 'file', icon: '📄', title: '上传资料', desc: '上传PDF/Word等文件', color: 'from-purple-500 to-pink-600' },
  { type: 'text', icon: '✏️', title: '粘贴文字', desc: '粘贴已有的文字内容', color: 'from-orange-500 to-red-600' },
  { type: 'image', icon: '🖼️', title: '上传图片', desc: '上传图片生成文案', color: 'from-green-500 to-teal-600' },
];

export default function HomePage() {
  const router = useRouter();
  const { setEntryType, setSearchKeyword } = useAppStore();
  const [topic, setTopic] = useState('');
  const [isHovering, setIsHovering] = useState<string | null>(null);

  // 处理入口选择
  const handleEntrySelect = (type: EntryType) => {
    setEntryType(type);
    switch (type) {
      case 'topic':
        // 在当前页面输入
        break;
      case 'file':
        router.push('/upload?type=file');
        break;
      case 'text':
        router.push('/upload?type=text');
        break;
      case 'image':
        router.push('/upload?type=image');
        break;
    }
  };

  // 处理主题搜索
  const handleSearch = () => {
    if (!topic.trim()) return;
    setEntryType('topic');
    setSearchKeyword(topic);
    router.push('/search');
  };

  // 处理热门话题点击
  const handleHotTopic = (name: string) => {
    setTopic(name);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200/50 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          <span className="text-xl font-semibold text-gray-900">概念大师</span>
        </div>
        <nav className="flex gap-6">
          <button 
            onClick={() => router.push('/history')}
            className="text-gray-600 hover:text-indigo-600 transition-colors"
          >
            历史
          </button>
          <button className="text-gray-600 hover:text-indigo-600 transition-colors">
            关于
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative">
        {/* 装饰背景 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
        </div>

        {/* 主标题 */}
        <div className="relative z-10 text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              给AI一个方向
            </span>
          </h1>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            还你一个概念卡片
          </h1>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            从任意起点开始，AI帮你生成结构清晰、图文并茂的概念卡片
          </p>
        </div>

        {/* 入口选择区 */}
        <div className="relative z-10 w-full max-w-4xl mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ENTRY_OPTIONS.map((option) => (
              <button
                key={option.type}
                onClick={() => handleEntrySelect(option.type)}
                onMouseEnter={() => setIsHovering(option.type)}
                onMouseLeave={() => setIsHovering(null)}
                className={`relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 ${
                  isHovering === option.type 
                    ? 'scale-105 shadow-xl' 
                    : 'shadow-md hover:shadow-lg'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-90`} />
                <div className="relative z-10 text-white">
                  <span className="text-4xl mb-3 block">{option.icon}</span>
                  <h3 className="font-semibold text-lg mb-1">{option.title}</h3>
                  <p className="text-sm text-white/80">{option.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 搜索框（从主题开始） */}
        <div className="relative z-10 w-full max-w-2xl mb-8">
          <div className="relative group">
            <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <span className="text-xl pl-5">🔍</span>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="输入你想探索的方向..."
                className="flex-1 bg-transparent px-4 py-4 text-gray-900 placeholder-gray-400 outline-none"
              />
              <button
                onClick={handleSearch}
                disabled={!topic.trim()}
                className="m-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                搜索数据 →
              </button>
            </div>
          </div>
        </div>

        {/* 热门推荐 */}
        <div className="relative z-10 w-full max-w-2xl">
          <h2 className="text-center text-gray-500 font-medium mb-4">
            🔥 热门方向
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {HOT_TOPICS.map((t) => (
              <button
                key={t.id}
                onClick={() => handleHotTopic(t.name)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full hover:border-indigo-300 hover:bg-indigo-50 transition-all"
              >
                <span>{t.icon}</span>
                <span className="text-gray-700">{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm border-t border-gray-200/50">
        <p>概念大师 © 2026 · AI驱动的概念卡片生成器</p>
      </footer>
    </main>
  );
}
