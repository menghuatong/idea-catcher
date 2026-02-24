'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { CARD_SPECS, GeneratedContent, ImageStyle } from '@/types';

const IMAGE_STYLES: { id: ImageStyle; name: string; icon: string }[] = [
  { id: 'minimal', name: '简约', icon: '⚪' },
  { id: 'tech', name: '科技', icon: '🚀' },
  { id: 'warm', name: '温暖', icon: '🌅' },
  { id: 'business', name: '商务', icon: '💼' },
];

export default function ResultPage() {
  const router = useRouter();
  const {
    entryType,
    searchKeyword,
    searchResults,
    uploadedText,
    selectedTemplate,
    generatedContent,
    setGeneratedContent,
    imageUrl,
    setImageUrl,
    imageStyle,
    setImageStyle,
    cardSpec,
    setCardSpec,
    sources,
    setSources,
  } = useAppStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!generatedContent && selectedTemplate) {
      generateContent();
    }
  }, []);

  const generateContent = async () => {
    if (!selectedTemplate) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entryType,
          topic: searchKeyword,
          selectedResults: searchResults.filter(r => r.selected),
          text: uploadedText,
          templateId: selectedTemplate.id,
        }),
      });
      const data = await response.json();
      if (data.content) {
        setGeneratedContent(data.content);
        setSources(data.sources || []);
        generateImage();
      }
    } catch (error) {
      console.error('生成失败:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImage = async () => {
    if (!generatedContent) return;
    setIsGeneratingImage(true);
    try {
      const contentText = Object.values(generatedContent).join(', ');
      const prompt = `${searchKeyword || ''} concept illustration, ${contentText.slice(0, 200)}`;
      const response = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style: imageStyle }),
      });
      const data = await response.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      }
    } catch (error) {
      console.error('配图生成失败:', error);
      setImageUrl(`https://picsum.photos/seed/${Date.now()}/1024/1024`);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleRegenerateImage = () => generateImage();

  const handleStartEdit = (key: string, value: string) => {
    setEditingField(key);
    setEditValue(value);
  };

  const handleSaveEdit = () => {
    if (editingField && generatedContent) {
      setGeneratedContent({ ...generatedContent, [editingField]: editValue });
    }
    setEditingField(null);
    setEditValue('');
  };

  const handleExport = async (format: 'png' | 'jpg' | 'pdf') => {
    await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: searchKeyword,
        entryType,
        templateId: selectedTemplate?.id,
        templateName: selectedTemplate?.name,
        content: generatedContent,
        imageUrl,
        cardSpec,
      }),
    });
    alert(`✨ 卡片已生成！\n\n格式：${format.toUpperCase()}\n规格：${CARD_SPECS.find(s => s.id === cardSpec)?.name}`);
  };

  if (!mounted) return null;

  const currentSpec = CARD_SPECS.find(s => s.id === cardSpec) || CARD_SPECS[0];

  return (
    <main className="min-h-screen bg-[#0F0F23] relative overflow-hidden">
      {/* 背景 */}
      <div className="fixed inset-0 grid-bg" />
      <div className="fixed top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />
      <div className="fixed bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px]" />

      {/* 顶部导航 */}
      <header className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/template')} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 transition-all">
            ←
          </button>
          <div className="flex items-center gap-2">
            {['数据获取', '选择模板', '生成结果'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i === 2 ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                  : 'bg-white/10 text-white'
                }`}>
                  {i + 1}
                </div>
                <span className={`text-sm ${i === 2 ? 'text-white' : 'text-gray-500'}`}>
                  {step}
                </span>
                {i < 2 && <div className="w-8 h-px bg-white/10" />}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 卡片预览 */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-sm">
                🎴
              </span>
              卡片预览
            </h2>
            
            <div className="bg-[#1A1A2E] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              {/* 配图 */}
              <div className="relative aspect-[3/4] bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                {imageUrl ? (
                  <img src={imageUrl} alt="配图" className="w-full h-full object-cover" />
                ) : isGeneratingImage ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2 animate-pulse">🎨</div>
                      <span className="text-gray-400">生成配图中...</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-500">点击生成配图</span>
                  </div>
                )}
                {isGeneratingImage && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <span className="text-white text-sm">AI正在创作...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 内容 */}
              <div className="p-6">
                {isGenerating ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <span className="text-gray-400">AI正在生成...</span>
                  </div>
                ) : generatedContent && selectedTemplate ? (
                  <div className="space-y-4">
                    {selectedTemplate.structure.map((field) => (
                      <div key={field.key} className="group">
                        {editingField === field.key ? (
                          <div className="space-y-2">
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-full p-3 bg-[#252542] border border-indigo-500/50 rounded-lg text-white text-sm outline-none"
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <button onClick={handleSaveEdit} className="px-3 py-1 bg-indigo-500 text-white text-xs rounded">保存</button>
                              <button onClick={() => setEditingField(null)} className="px-3 py-1 bg-white/10 text-gray-400 text-xs rounded">取消</button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            onClick={() => handleStartEdit(field.key, generatedContent[field.key] || '')}
                            className="cursor-pointer hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors"
                          >
                            <div className="text-xs text-indigo-400 mb-1">{field.label}</div>
                            <div className="text-white">{generatedContent[field.key] || '-'}</div>
                          </div>
                        )}
                      </div>
                    ))}
                    {sources.length > 0 && (
                      <div className="pt-4 border-t border-white/10">
                        <div className="text-xs text-gray-500">数据来源：{sources.join('、')}</div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* 控制面板 */}
          <div className="space-y-6">
            {/* 规格选择 */}
            <div className="bg-[#1A1A2E] rounded-2xl p-6 border border-white/10">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                📐 卡片规格
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {CARD_SPECS.map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() => setCardSpec(spec.id)}
                    className={`p-4 rounded-xl text-left transition-all border ${
                      cardSpec === spec.id
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="font-medium text-white">{spec.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{spec.platform}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 配图风格 */}
            <div className="bg-[#1A1A2E] rounded-2xl p-6 border border-white/10">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                🎨 配图风格
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {IMAGE_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => { setImageStyle(style.id); handleRegenerateImage(); }}
                    className={`p-4 rounded-xl text-left transition-all border ${
                      imageStyle === style.id
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="text-2xl mb-1">{style.icon}</div>
                    <div className="font-medium text-white">{style.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="space-y-3">
              <button
                onClick={generateContent}
                disabled={isGenerating}
                className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 disabled:opacity-30 transition-all"
              >
                {isGenerating ? '生成中...' : '🔄 重新生成内容'}
              </button>
              <button
                onClick={handleRegenerateImage}
                disabled={isGeneratingImage}
                className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 disabled:opacity-30 transition-all"
              >
                {isGeneratingImage ? '生成中...' : '🎨 换张配图'}
              </button>
            </div>

            {/* 导出按钮 */}
            <div className="space-y-3">
              <button
                onClick={() => handleExport('png')}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
              >
                ⬇️ 下载 PNG
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handleExport('jpg')} className="py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-all">
                  JPG
                </button>
                <button onClick={() => handleExport('pdf')} className="py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-all">
                  PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
