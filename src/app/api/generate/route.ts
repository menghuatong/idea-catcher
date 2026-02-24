// 生成API - 模板化概念生成
import { NextRequest, NextResponse } from 'next/server';
import { GenerateRequest, GenerateResponse, TEMPLATES, Template } from '@/types';

export const runtime = 'edge';

// OpenAI API配置
const OPENAI_API_URL = 'https://api.openrelay.org/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const req: GenerateRequest = await request.json();
    const { entryType, templateId, topic, selectedResults, text, imageUrl } = req;

    // 验证参数
    if (!templateId) {
      return NextResponse.json({ error: '请选择模板' }, { status: 400 });
    }

    // 获取模板
    const template = TEMPLATES.find(t => t.id === templateId);
    if (!template) {
      return NextResponse.json({ error: '模板不存在' }, { status: 400 });
    }

    // 构建上下文
    let context = '';
    let sources: string[] = [];

    switch (entryType) {
      case 'topic':
        if (!topic) {
          return NextResponse.json({ error: '请输入主题' }, { status: 400 });
        }
        context = `主题：${topic}\n\n`;
        if (selectedResults && selectedResults.length > 0) {
          context += '参考数据：\n';
          selectedResults.forEach((result, index) => {
            context += `${index + 1}. ${result.title}\n   ${result.snippet}\n   来源：${result.source}\n\n`;
            sources.push(result.source);
          });
        }
        break;

      case 'text':
        if (!text || text.length < 50) {
          return NextResponse.json({ error: '请输入至少50个字符' }, { status: 400 });
        }
        context = `用户提供的内容：\n${text}\n\n`;
        break;

      case 'image':
        if (!imageUrl) {
          return NextResponse.json({ error: '请上传图片' }, { status: 400 });
        }
        context = `用户上传了一张图片，请根据图片内容生成相关概念。\n\n`;
        break;

      case 'file':
        context = `用户上传了一份资料，请根据资料内容生成相关概念。\n\n`;
        break;

      default:
        return NextResponse.json({ error: '无效的入口类型' }, { status: 400 });
    }

    // 构建Prompt
    const prompt = buildPrompt(template, context);

    // 调用AI生成
    const content = await generateContent(prompt, template);

    const duration = Date.now() - startTime;

    // 去重sources
    const uniqueSources = Array.from(new Set(sources));

    const response: GenerateResponse = {
      content,
      duration,
      sources: uniqueSources,
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('生成错误:', error);
    return NextResponse.json(
      { error: error.message || '生成失败，请重试' },
      { status: 500 }
    );
  }
}

// 构建Prompt
function buildPrompt(template: Template, context: string): string {
  const fieldDescriptions = template.structure
    .map(f => `- ${f.label}：${f.placeholder}`)
    .join('\n');

  return `你是一个专业的产品概念生成专家。请根据以下信息生成一个${template.name}。

${context}

请生成以下字段内容：
${fieldDescriptions}

要求：
1. 每个字段内容简洁有力，突出重点
2. 使用专业但不晦涩的语言
3. 内容要有数据支撑，避免空洞
4. 字段内容要相互呼应，形成完整的概念

请以JSON格式返回，格式如下：
{
  "${template.structure[0].key}": "内容",
  "${template.structure[1].key}": "内容",
  ...
}

只返回JSON，不要其他解释。`;
}

// 调用AI生成内容
async function generateContent(prompt: string, template: Template): Promise<Record<string, string>> {
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的产品概念生成专家，擅长将信息转化为结构化的产品概念卡片内容。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API错误: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // 解析JSON
    try {
      // 提取JSON部分
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('JSON解析错误:', parseError);
    }

    // 如果解析失败，返回默认内容
    const defaultContent: Record<string, string> = {};
    template.structure.forEach(field => {
      defaultContent[field.key] = field.placeholder;
    });
    return defaultContent;

  } catch (error) {
    console.error('AI生成错误:', error);
    // 返回默认内容
    const defaultContent: Record<string, string> = {};
    template.structure.forEach(field => {
      defaultContent[field.key] = field.placeholder;
    });
    return defaultContent;
  }
}
