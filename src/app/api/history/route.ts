// 历史记录API
import { NextRequest, NextResponse } from 'next/server';
import { HistoryRecord } from '@/types';

// 简单的内存存储（生产环境应使用数据库）
let historyStore: HistoryRecord[] = [];

// 获取历史记录
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  const records = historyStore
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(offset, offset + limit);

  return NextResponse.json({
    records,
    total: historyStore.length,
  });
}

// 保存历史记录
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const record: HistoryRecord = {
      id: `history-${Date.now()}`,
      topic: data.topic || '',
      entryType: data.entryType,
      templateId: data.templateId,
      templateName: data.templateName,
      content: data.content,
      imageUrl: data.imageUrl,
      cardSpec: data.cardSpec,
      createdAt: new Date().toISOString(),
    };

    historyStore.unshift(record);

    // 限制存储数量
    if (historyStore.length > 100) {
      historyStore = historyStore.slice(0, 100);
    }

    return NextResponse.json({ success: true, id: record.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 删除历史记录
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: '缺少记录ID' }, { status: 400 });
    }

    historyStore = historyStore.filter(r => r.id !== id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
