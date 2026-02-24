// 搜索API - Tavily集成
import { NextRequest, NextResponse } from 'next/server';
import { SearchResult, SearchResponse } from '@/types';

export const runtime = 'edge';

// Tavily API配置
const TAVILY_API_URL = 'https://api.tavily.com/search';
const TAVILY_API_KEY = process.env.TAVILY_API_KEY || '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';

interface TavilyResult {
  title: string;
  content: string;
  url: string;
  source: string;
}

export async function POST(request: NextRequest) {
  try {
    const { keyword, limit = 10 } = await request.json();

    if (!keyword || keyword.trim().length < 2) {
      return NextResponse.json(
        { error: '请输入有效的搜索关键词' },
        { status: 400 }
      );
    }

    // 调用Tavily API
    const response = await fetch(TAVILY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query: `${keyword} 趋势 机会 市场 产品`,
        max_results: limit,
        include_answer: false,
        include_raw_content: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily API错误: ${response.status}`);
    }

    const data = await response.json();

    // 转换结果格式
    const results: SearchResult[] = (data.results || []).map((item: TavilyResult, index: number) => ({
      id: `result-${index + 1}`,
      title: item.title || '无标题',
      snippet: item.content?.slice(0, 200) || '',
      url: item.url || '',
      source: item.source || extractDomain(item.url),
      selected: index < 3, // 默认选中前3条
    }));

    const searchResponse: SearchResponse = {
      results,
      total: results.length,
    };

    return NextResponse.json(searchResponse);

  } catch (error: any) {
    console.error('搜索错误:', error);
    return NextResponse.json(
      { error: error.message || '搜索失败，请重试' },
      { status: 500 }
    );
  }
}

// 从URL提取域名
function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return domain;
  } catch {
    return '未知来源';
  }
}
