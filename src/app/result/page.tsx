'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  RefreshCw, 
  Image as ImageIcon, 
  Download,
  Loader2,
  Check,
  Edit3,
  ArrowRight
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/store/useAppStore';
import { CARD_SPECS, ImageStyle } from '@/types';

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

  return (
    <main className="min-h-screen bg-background">
      {/* 背景 */}
      <div className="fixed inset-0 grid-bg" />
      <div className="fixed top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px]" />
      <div className="fixed bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px]" />

      {/* 顶部导航 */}
      <header className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.push('/template')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          {/* 步骤指示器 */}
          <div className="flex items-center gap-2">
            {['数据获取', '选择模板', '生成结果'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i === 2 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-foreground'
                }`}>
                  {i + 1}
                </div>
                <span className={`text-sm hidden sm:inline ${i === 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step}
                </span>
                {i < 2 && <div className="w-8 h-px bg-border hidden sm:block" />}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Progress value={100} className="w-24 hidden sm:block" />
          <Badge variant="secondary">完成</Badge>
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 卡片预览 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-sm text-primary-foreground">🎴</span>
              </div>
              <h2 className="text-lg font-semibold text-foreground">卡片预览</h2>
            </div>
            
            <Card className="overflow-hidden shadow-xl">
              {/* 配图 */}
              <div className="relative aspect-[3/4] bg-gradient-to-br from-primary/20 to-purple-500/20">
                {imageUrl ? (
                  <img src={imageUrl} alt="配图" className="w-full h-full object-cover" />
                ) : isGeneratingImage ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                      <span className="text-muted-foreground">生成配图中...</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}
                {isGeneratingImage && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="h-12 w-12 animate-spin mx-auto mb-3 text-primary" />
                      <span className="text-white text-sm">AI正在创作...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 内容 */}
              <CardContent className="p-6">
                {isGenerating ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-3 text-primary" />
                    <span className="text-muted-foreground">AI正在生成...</span>
                  </div>
                ) : generatedContent && selectedTemplate ? (
                  <ScrollArea className="max-h-[400px]">
                    <div className="space-y-4 pr-4">
                      {selectedTemplate.structure.map((field) => (
                        <div key={field.key} className="group">
                          {editingField === field.key ? (
                            <div className="space-y-2">
                              <Textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="min-h-[80px]"
                              />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={handleSaveEdit}>
                                  <Check className="h-4 w-4 mr-1" />
                                  保存
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingField(null)}>
                                  取消
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div 
                              onClick={() => handleStartEdit(field.key, generatedContent[field.key] || '')}
                              className="cursor-pointer hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors"
                            >
                              <div className="text-xs text-primary mb-1 flex items-center gap-1">
                                {field.label}
                                <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div className="text-foreground">{generatedContent[field.key] || '-'}</div>
                            </div>
                          )}
                        </div>
                      ))}
                      {sources.length > 0 && (
                        <>
                          <Separator />
                          <div className="text-xs text-muted-foreground">
                            数据来源：{sources.join('、')}
                          </div>
                        </>
                      )}
                    </div>
                  </ScrollArea>
                ) : null}
              </CardContent>
            </Card>
          </div>

          {/* 控制面板 */}
          <div className="space-y-6">
            {/* 规格选择 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">📐 卡片规格</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={cardSpec} onValueChange={(v) => setCardSpec(v as any)}>
                  <TabsList className="grid grid-cols-4 w-full">
                    {CARD_SPECS.map((spec) => (
                      <TabsTrigger key={spec.id} value={spec.id} className="text-xs">
                        {spec.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            {/* 配图风格 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">🎨 配图风格</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {IMAGE_STYLES.map((style) => (
                    <Button
                      key={style.id}
                      variant={imageStyle === style.id ? 'default' : 'outline'}
                      className="h-auto py-4 flex-col"
                      onClick={() => { setImageStyle(style.id); handleRegenerateImage(); }}
                    >
                      <span className="text-2xl mb-1">{style.icon}</span>
                      <span className="text-sm">{style.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={generateContent}
                disabled={isGenerating}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? '生成中...' : '重新生成内容'}
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleRegenerateImage}
                disabled={isGeneratingImage}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                {isGeneratingImage ? '生成中...' : '换张配图'}
              </Button>
            </div>

            {/* 导出按钮 */}
            <div className="space-y-3">
              <Button 
                className="w-full"
                onClick={() => handleExport('png')}
              >
                <Download className="h-4 w-4 mr-2" />
                下载 PNG
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => handleExport('jpg')}>
                  JPG
                </Button>
                <Button variant="outline" onClick={() => handleExport('pdf')}>
                  PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
