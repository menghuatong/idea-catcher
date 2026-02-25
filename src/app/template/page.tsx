'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check,
  LayoutTemplate,
  Megaphone,
  BookOpen,
  Settings,
  GitCompare,
  Sparkles
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppStore, TEMPLATES } from '@/store/useAppStore';
import { Template } from '@/types';

const TEMPLATE_CONFIG: Record<string, { 
  icon: React.ElementType; 
  iconColor: string; 
  cardBg: string;
  borderColor: string;
}> = {
  'product-concept': { 
    icon: LayoutTemplate, 
    iconColor: 'text-primary',
    cardBg: 'bg-primary/10',
    borderColor: 'border-primary/50',
  },
  'marketing-creative': { 
    icon: Megaphone, 
    iconColor: 'text-orange-500',
    cardBg: 'bg-orange-500/10',
    borderColor: 'border-orange-500/50',
  },
  'brand-story': { 
    icon: BookOpen, 
    iconColor: 'text-pink-500',
    cardBg: 'bg-pink-500/10',
    borderColor: 'border-pink-500/50',
  },
  'feature-intro': { 
    icon: Settings, 
    iconColor: 'text-cyan-500',
    cardBg: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/50',
  },
  'comparison-review': { 
    icon: GitCompare, 
    iconColor: 'text-emerald-500',
    cardBg: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/50',
  },
};

export default function TemplatePage() {
  const router = useRouter();
  const { selectedTemplate, setSelectedTemplate } = useAppStore();
  const [mounted, setMounted] = useState(false);

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
    <main className="min-h-screen bg-background">
      {/* 背景效果 */}
      <div className="fixed inset-0 grid-bg" />
      <div className="fixed top-1/3 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />

      {/* 顶部导航 */}
      <header className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.push('/search')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          {/* 步骤指示器 */}
          <div className="flex items-center gap-2">
            {['数据获取', '选择模板', '生成结果'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i === 1 
                    ? 'bg-primary text-primary-foreground' 
                    : i < 1 ? 'bg-muted text-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {i + 1}
                </div>
                <span className={`text-sm hidden sm:inline ${i === 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step}
                </span>
                {i < 2 && <div className="w-8 h-px bg-border hidden sm:block" />}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Progress value={50} className="w-24 hidden sm:block" />
          <span className="text-sm text-muted-foreground hidden sm:inline">步骤 2/4</span>
        </div>
      </header>

      {/* 标题 */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-3">选择一个模板</h1>
        <p className="text-muted-foreground">根据你的需求选择合适的概念卡片模板</p>
      </div>

      {/* 模板网格 */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map((template) => {
            const config = TEMPLATE_CONFIG[template.id] || TEMPLATE_CONFIG['product-concept'];
            const Icon = config.icon;
            const isSelected = selectedTemplate?.id === template.id;
            
            return (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                  isSelected 
                    ? `${config.borderColor} border-2 bg-primary/5` 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => handleSelect(template)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-xl ${config.cardBg} flex items-center justify-center`}>
                      <Icon className={`h-7 w-7 ${config.iconColor}`} />
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <CardTitle className="mt-4">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {template.structure.slice(0, 4).map((field) => (
                      <div key={field.key} className="flex items-center gap-2 text-sm">
                        <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-primary' : 'bg-muted-foreground'}`} />
                        <span className={isSelected ? 'text-foreground' : 'text-muted-foreground'}>
                          {field.label}
                        </span>
                      </div>
                    ))}
                    {template.structure.length > 4 && (
                      <div className="text-xs text-muted-foreground">
                        +{template.structure.length - 4} 个字段
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">适用场景：</span>
                      {template.scenario}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="text-muted-foreground">
            {selectedTemplate ? (
              <div className="flex items-center gap-2">
                <span>已选择</span>
                <Badge>
                  {selectedTemplate.name}
                </Badge>
              </div>
            ) : (
              '请选择一个模板'
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/search')}
            >
              上一步
            </Button>
            <Button
              onClick={handleNext}
              disabled={!selectedTemplate}
            >
              生成概念
              <Sparkles className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
