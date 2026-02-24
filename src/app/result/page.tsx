'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { CARD_SPECS, GeneratedContent, Template, ImageStyle } from '@/types';

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
    setIsLoading,
    setLoadingMessage,
    sources,
    setSources,
  } = useAppStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 初始化生成
  useEffect(() => {
    if (!generatedContent && selectedTemplate) {
      generateContent();
    }
  }, []);

  // 生成内容
  const generateContent = async () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    setIsLoading(true);
    setLoadingMessage('正在生成概念内容...');

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
        
        // 自动生成配图
        generateImage();
      } else {
        // 使用默认内容
        const defaultContent: GeneratedContent = {};
        selectedTemplate.structure.forEach(field => {
          defaultContent[field.key] = field.placeholder;
        });
        setGeneratedContent(defaultContent);
      }
    } catch (error) {
      console.error('生成失败:', error);
      // 使用默认内容
      const defaultContent: GeneratedContent = {};
      if (selectedTemplate) {
        selectedTemplate.structure.forEach(field => {
          defaultContent[field.key] = field.placeholder;
        });
        setGeneratedContent(defaultContent);
      }
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // 生成配图
  const generateImage = async () => {
    if (!generatedContent) return;

    setIsGeneratingImage(true);
    setLoadingMessage('正在生成配图...');

    try {
      // 构建图片prompt
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
      // 使用占位图
      setImageUrl(`https://picsum.photos/seed/${Date.now()}/1024/1024`);
    } finally {
      setIsGeneratingImage(false);
      setLoadingMessage('');
    }
  };

  // 重新生成配图
  const handleRegenerateImage = () => {
    generateImage();
  };

  // 开始编辑字段
  const handleStartEdit = (key: string, value: string) => {
    setEditingField(key);
    setEditValue(value);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (editingField && generatedContent) {
      setGeneratedContent({
        ...generatedContent,
        [editingField]: editValue,
      });
    }
    setEditingField(null);
    setEditValue('');
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  // 导出卡片
  const handleExport = async (format: 'png' | 'jpg' | 'pdf') => {
    if (!generatedContent || !selectedTemplate) return;

    // 保存历史记录
    await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: searchKeyword,
        entryType,
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        content: generatedContent,
        imageUrl,
        cardSpec,
      }),
    });

    // 简单的下载提示（实际项目需要用Canvas生成图片）
    alert(`卡片已生成！\n\n格式：${format.toUpperCase()}\n规格：${CARD_SPECS.find(s => s.id === cardSpec)?.name}`);
  };

  // 获取当前规格配置
  const currentSpec = CARD_SPECS.find(s => s.id === cardSpec) || CARD_SPECS[0];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/template')} className="text-gray-600 hover:text-gray-900">
            ← 返回
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-medium">
              3
            </div>
            <span className="text-gray-900 font-medium">生成结果</span>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          步骤 3/4
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：卡片预览 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">卡片预览</h2>
            
            {/* 卡片 */}
            <div 
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              style={{ aspectRatio: `${currentSpec.width}/${currentSpec.height}` }}
            >
              {/* 配图区域 */}
              <div className="h-1/2 bg-gradient-to-br from-indigo-100 to-purple-100 relative">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt="配图" 
                    className="w-full h-full object-cover"
                  />
                ) : isGeneratingImage ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">生成配图中...</span>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">点击"生成配图"</span>
                  </div>
                )}
              </div>

              {/* 内容区域 */}
              <div className="p-6">
                {isGenerating ? (
                  <div className="text-center py-8">
                    <div className="animate-spin text-3xl mb-2">⏳</div>
                    <span className="text-gray-500">生成中...</span>
                  </div>
                ) : generatedContent && selectedTemplate ? (
                  <div className="space-y-3">
                    {selectedTemplate.structure.slice(0, 4).map((field) => (
                      <div key={field.key}>
                        {editingField === field.key ? (
                          <div className="space-y-2">
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-full p-2 border border-indigo-300 rounded-lg text-sm"
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={handleSaveEdit}
                                className="px-3 py-1 bg-indigo-600 text-white text-sm rounded"
                              >
                                保存
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-3 py-1 border border-gray-300 text-sm rounded"
                              >
                                取消
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            onClick={() => handleStartEdit(field.key, generatedContent[field.key] || '')}
                            className="cursor-pointer hover:bg-gray-50 rounded p-1 -m-1"
                          >
                            <div className="text-xs text-gray-500">{field.label}</div>
                            <div className="text-gray-900">{generatedContent[field.key] || '-'}</div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* 数据来源 */}
                    {sources.length > 0 && (
                      <div className="pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-400">
                          数据来源：{sources.join('、')}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <span className="text-gray-400">点击"重新生成"</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：控制面板 */}
          <div className="space-y-6">
            {/* 规格选择 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">卡片规格</h3>
              <div className="grid grid-cols-2 gap-3">
                {CARD_SPECS.map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() => setCardSpec(spec.id)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      cardSpec === spec.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{spec.name}</div>
                    <div className="text-xs text-gray-500">{spec.platform}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 配图风格 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">配图风格</h3>
              <div className="grid grid-cols-2 gap-3">
                {(['minimal', 'tech', 'warm', 'business'] as ImageStyle[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => { setImageStyle(style); handleRegenerateImage(); }}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      imageStyle === style
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900 capitalize">{style}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="space-y-3">
              <button
                onClick={generateContent}
                disabled={isGenerating}
                className="w-full py-3 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {isGenerating ? '生成中...' : '重新生成内容'}
              </button>
              <button
                onClick={handleRegenerateImage}
                disabled={isGeneratingImage}
                className="w-full py-3 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {isGeneratingImage ? '生成中...' : '换张配图'}
              </button>
            </div>

            {/* 导出按钮 */}
            <div className="space-y-3">
              <button
                onClick={() => handleExport('png')}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
              >
                下载 PNG
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => handleExport('jpg')}
                  className="flex-1 py-3 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                >
                  下载 JPG
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="flex-1 py-3 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                >
                  下载 PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 隐藏的Canvas用于导出 */}
      <canvas ref={canvasRef} className="hidden" />
    </main>
  );
}
