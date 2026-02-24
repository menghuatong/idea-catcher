'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { HOT_TOPICS, EntryType } from '@/types';

const ENTRY_OPTIONS = [
  { 
    type: 'topic' as EntryType, 
    icon: '💡', 
    title: '输入主题', 
    desc: '输入关键词，AI搜索数据生成概念',
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    iconBg: 'bg-indigo-500/20'
  },
  { 
    type: 'file' as EntryType, 
    icon: '📄', 
    title: '上传资料', 
    desc: '上传PDF/Word，提取要点生成概念',
    gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
    iconBg: 'bg-cyan-500/20'
  },
  { 
    type: 'text' as EntryType, 
    icon: '✨', 
    title: '粘贴文字', 
    desc: '粘贴已有内容，AI优化并配图',
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    iconBg: 'bg-orange-500/20'
  },
  { 
    type: 'image' as EntryType, 
    icon: '🎨', 
    title: '上传图片', 
    desc: '上传图片，AI分析生成匹配文案',
    gradient: 'from-green-500 via-emerald-500 to-cyan-500',
    iconBg: 'bg-green-500/20'
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
    if (type === 'topic') {
      // 保持在首页，显示搜索框
    } else {
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
    <main className="min-h-screen relative overflow-hidden">
      {/* 背景效果 */}
      <div className="fixed inset-0 grid-bg" />
      
      {/* 渐变光晕 */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
      <div className="fixed top-1/2 right-0 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[80px]" />

      {/* 导航栏 */}
      <header className="relative z-50 flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">
            🎯
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">概念大师</h1>
            <p className="text-xs text-gray-400">AI概念卡片生成器</p>
          </div>
        </div>
        
        <nav className="flex items-center gap-2">
          <button 
            onClick={() => router.push('/history')}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            📜 历史记录
          </button>
          <button className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all">
            ⚙️ 设置
          </button>
        </nav>
      </header>

      {/* 主内容区 */}
      <section className="relative z-10 flex flex-col items-center justify-center px-6 pt-12 pb-20 lg:pt-20">
        {/* 标题区 */}
        <div className="text-center mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-sm text-indigo-300">AI驱动的概念卡片生成器</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">给AI一个方向</span>
            <br />
            <span className="text-white">还你一个概念卡片</span>
          </h1>
          
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            从任意起点开始，AI帮你生成结构清晰、图文并茂、可直接投放的概念卡片
          </p>
        </div>

        {/* 入口卡片 */}
        <div className="w-full max-w-5xl mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ENTRY_OPTIONS.map((option, index) => (
              <button
                key={option.type}
                onClick={() => handleEntrySelect(option.type)}
                className="group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-500 card-hover"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* 背景 */}
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-5 group-hover:opacity-20 transition-opacity duration-500`} />
                
                {/* 边框 */}
                <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/20 transition-colors" />
                
                {/* 内容 */}
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-xl ${option.iconBg} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {option.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white transition-colors">
                    {option.title}
                  </h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    {option.desc}
                  </p>
                </div>
                
                {/* 箭头 */}
                <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 搜索框 */}
        <div className="w-full max-w-2xl mb-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="relative flex items-center bg-[#1A1A2E] rounded-xl overflow-hidden border border-white/10 group-hover:border-white/20 transition-colors">
              <span className="text-2xl pl-5 text-gray-400">🔍</span>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="输入你想探索的方向，如：宠物经济、AI工具..."
                className="flex-1 bg-transparent px-4 py-5 text-white placeholder-gray-500 outline-none text-lg"
              />
              <button
                onClick={handleSearch}
                disabled={!topic.trim()}
                className="m-2 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-indigo-500/30 disabled:hover:shadow-none"
              >
                开始生成 →
              </button>
            </div>
          </div>
        </div>

        {/* 热门话题 */}
        <div className="w-full max-w-2xl">
          <p className="text-center text-gray-500 text-sm mb-4">🔥 热门方向，点击快速开始</p>
          <div className="flex flex-wrap justify-center gap-2">
            {HOT_TOPICS.map((t) => (
              <button
                key={t.id}
                onClick={() => handleHotTopic(t.name)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all"
              >
                {t.icon} {t.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 底部 */}
      <footer className="relative z-10 text-center py-6 border-t border-white/5">
        <p className="text-sm text-gray-500">
          概念大师 © 2026 · Made with ❤️ by AI
        </p>
      </footer>
    </main>
  );
}
