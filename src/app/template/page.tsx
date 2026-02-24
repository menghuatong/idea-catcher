'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore, TEMPLATES } from '@/store/useAppStore';
import { Template } from '@/types';

export default function TemplatePage() {
  const router = useRouter();
  const { selectedTemplate, setSelectedTemplate } = useAppStore();
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  // 选择模板
  const handleSelect = (template: Template) => {
    setSelectedTemplate(template);
  };

  // 下一步
  const handleNext = () => {
    if (!selectedTemplate) {
      alert('请选择一个模板');
      return;
    }
    router.push('/result');
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/search')} className="text-gray-600 hover:text-gray-900">
            ← 返回
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-medium">
              2
            </div>
            <span className="text-gray-900 font-medium">选择模板</span>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          步骤 2/4
        </div>
      </header>

      {/* 标题 */}
      <div className="max-w-4xl mx-auto px-6 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">选择一个模板</h1>
        <p className="text-gray-600">根据你的需求选择合适的概念卡片模板</p>
      </div>

      {/* 模板卡片 */}
      <div className="max-w-5xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              onClick={() => handleSelect(template)}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
              className={`bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                selectedTemplate?.id === template.id
                  ? 'border-indigo-500 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {/* 模板头部 */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{template.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-500">{template.scenario}</p>
                </div>
              </div>

              {/* 模板描述 */}
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>

              {/* 字段列表 */}
              <div className="space-y-2">
                {template.structure.slice(0, 4).map((field) => (
                  <div key={field.key} className="flex items-center gap-2 text-sm">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      selectedTemplate?.id === template.id ? 'bg-indigo-500' : 'bg-gray-300'
                    }`} />
                    <span className="text-gray-600">{field.label}</span>
                  </div>
                ))}
                {template.structure.length > 4 && (
                  <div className="text-xs text-gray-400">
                    +{template.structure.length - 4} 个字段
                  </div>
                )}
              </div>

              {/* 选中标记 */}
              {selectedTemplate?.id === template.id && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    ✓
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 模板预览 */}
      {selectedTemplate && (
        <div className="max-w-4xl mx-auto px-6 pb-32">
          <div className="bg-indigo-50 rounded-xl p-6">
            <h3 className="font-semibold text-indigo-900 mb-3">
              {selectedTemplate.icon} {selectedTemplate.name} - 字段说明
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {selectedTemplate.structure.map((field) => (
                <div key={field.key} className="bg-white rounded-lg p-3">
                  <div className="font-medium text-gray-900">{field.label}</div>
                  <div className="text-sm text-gray-500">{field.placeholder}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {selectedTemplate ? (
              <>已选择：<span className="font-medium text-indigo-600">{selectedTemplate.name}</span></>
            ) : (
              '请选择一个模板'
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/search')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
            >
              上一步
            </button>
            <button
              onClick={handleNext}
              disabled={!selectedTemplate}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium disabled:opacity-50"
            >
              生成概念
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
