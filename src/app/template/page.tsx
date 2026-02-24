'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore, TEMPLATES } from '@/store/useAppStore';
import { Template } from '@/types';

const TEMPLATE_ICONS: Record<string, { bg: string; border: string }> = {
  'product-concept': { bg: 'from-indigo-500 to-purple-600', border: 'border-indigo-500/30' },
  'marketing-creative': { bg: 'from-orange-500 to-red-600', border: 'border-orange-500/30' },
  'brand-story': { bg: 'from-pink-500 to-rose-600', border: 'border-pink-500/30' },
  'feature-intro': { bg: 'from-cyan-500 to-blue-600', border: 'border-cyan-500/30' },
  'comparison-review': { bg: 'from-emerald-500 to-green-600', border: 'border-emerald-500/30' },
};

export default function TemplatePage() {
  const router = useRouter();
  const { selectedTemplate, setSelectedTemplate } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelect = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleNext = () => {
    if (!selectedTemplate) {
      alert('请选择一个模板');
      return;
    }
    router.push('/result');
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#0F0F23] relative overflow-hidden">
      {/* 背景效果 */}
      <div className="fixed inset-0 grid-bg" />
      <div className="fixed top-1/3 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />

      {/* 顶部导航 */}
      <header className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/search')} 
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all"
          >
            ←
          </button>
          
          <div className="flex items-center gap-2">
            {['数据获取', '选择模板', '生成结果'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i === 1 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                    : i < 1 ? 'bg-white/10 text-white' : 'bg-white/5 text-gray-500'
                }`}>
                  {i + 1}
                </div>
                <span className={`text-sm ${i === 1 ? 'text-white' : 'text-gray-500'}`}>
                  {step}
                </span>
                {i < 2 && <div className="w-8 h-px bg-white/10" />}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 标题 */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-3">选择一个模板</h1>
        <p className="text-gray-400">根据你的需求选择合适的概念卡片模板</p>
      </div>

      {/* 模板网格 */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map((template) => {
            const colors = TEMPLATE_ICONS[template.id] || TEMPLATE_ICONS['product-concept'];
            const isSelected = selectedTemplate?.id === template.id;
            const isHovered = hoveredTemplate === template.id;
            
            return (
              <button
                key={template.id}
                onClick={() => handleSelect(template)}
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
                className={`group relative text-left rounded-2xl p-6 transition-all duration-300 border ${
                  isSelected
                    ? `bg-gradient-to-br ${colors.bg} bg-opacity-10 ${colors.border} border-2`
                    : 'bg-[#1A1A2E] border-white/10 hover:border-white/30'
                }`}
              >
                {/* 选中标记 */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                {/* 图标 */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {template.icon}
                </div>

                {/* 标题 */}
                <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{template.description}</p>

                {/* 字段预览 */}
                <div className="space-y-2">
                  {template.structure.slice(0, 4).map((field, index) => (
                    <div key={field.key} className="flex items-center gap-2 text-sm">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-gray-500'
                      }`} />
                      <span className={isSelected ? 'text-white/80' : 'text-gray-400'}>
                        {field.label}
                      </span>
                    </div>
                  ))}
                  {template.structure.length > 4 && (
                    <div className="text-xs text-gray-500">
                      +{template.structure.length - 4} 个字段
                    </div>
                  )}
                </div>

                {/* 悬浮提示 */}
                {(isHovered || isSelected) && (
                  <div className="absolute inset-x-6 -bottom-2 translate-y-full z-10">
                    <div className="bg-[#252542] rounded-xl p-4 border border-white/10 shadow-xl">
                      <div className="text-xs text-gray-400 mb-2">适用场景</div>
                      <div className="text-sm text-white">{template.scenario}</div>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0F0F23]/90 backdrop-blur-lg border-t border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="text-gray-400">
            {selectedTemplate ? (
              <div className="flex items-center gap-2">
                <span>已选择</span>
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-medium">
                  {selectedTemplate.name}
                </span>
              </div>
            ) : (
              '请选择一个模板'
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/search')}
              className="px-6 py-3 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 transition-all"
            >
              上一步
            </button>
            <button
              onClick={handleNext}
              disabled={!selectedTemplate}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium disabled:opacity-30 transition-all hover:shadow-lg hover:shadow-indigo-500/30"
            >
              生成概念 ✨
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
