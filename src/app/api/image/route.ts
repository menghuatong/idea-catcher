// 配图生成API
import { NextRequest, NextResponse } from 'next/server';
import { ImageStyle } from '@/types';

export const runtime = 'edge';

// OpenAI API配置
const OPENAI_API_URL = 'https://api.openrelay.org/v1/images/generations';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

const STYLE_PROMPTS: Record<ImageStyle, string> = {
  minimal: 'minimalist style, clean design, simple shapes, white space',
  tech: 'futuristic technology style, digital art, neon accents, dark background',
  warm: 'warm and friendly style, soft colors, organic shapes, inviting atmosphere',
  business: 'professional business style, corporate design, clean lines, blue tones',
};

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { prompt, style = 'minimal' } = await request.json();

    if (!prompt || prompt.trim().length < 5) {
      return NextResponse.json({ error: '请提供有效的描述' }, { status: 400 });
    }

    // 构建完整prompt
    const fullPrompt = `${prompt}, ${STYLE_PROMPTS[style as ImageStyle]}, high quality, product concept illustration`;

    // 调用DALL-E API
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: fullPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || '图片生成失败');
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url || '';

    const duration = Date.now() - startTime;

    return NextResponse.json({
      imageUrl,
      duration,
    });

  } catch (error: any) {
    console.error('图片生成错误:', error);
    
    // 返回占位图
    return NextResponse.json({
      imageUrl: `https://picsum.photos/seed/${Date.now()}/1024/1024`,
      duration: Date.now() - startTime,
      fallback: true,
    });
  }
}
