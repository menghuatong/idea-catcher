// OpenAI API 封装

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

// 分析信息
export async function analyzeInformation(
  topic: string,
  searchResults: string
): Promise<{
  trends: string[];
  painPoints: string[];
  opportunities: string[];
  competitors: string[];
  marketSize: string;
}> {
  const prompt = `你是一个产品市场分析专家。请分析以下关于「${topic}」的网络信息，提取关键洞察。

信息内容：
${searchResults}

请从以下维度分析，输出JSON格式（不要包含markdown代码块标记）：

{
  "trends": ["识别到的3-5个趋势"],
  "painPoints": ["用户提到的3-5个痛点"],
  "opportunities": ["发现的3-5个机会点"],
  "competitors": ["现有解决方案简要描述"],
  "marketSize": "市场规模估计（如有数据）"
}

注意：
1. 基于提供的信息分析，不要编造
2. 聚焦有数据支撑的观点
3. 突出差异化和创新点
4. 直接输出JSON，不要包含\`\`\`json标记`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content || '{}';
  return JSON.parse(content);
}

// 生成产品概念
export async function generateConcepts(
  topic: string,
  insights: {
    trends: string[];
    painPoints: string[];
    opportunities: string[];
    competitors: string[];
    marketSize: string;
  },
  count: number = 3
): Promise<Array<{
  name: string;
  tagline: string;
  targetUser: string;
  coreFeatures: string[];
  differentiation: string;
  businessModel: string;
  risks: string[];
  nextSteps: string[];
}>> {
  const prompt = `你是一个产品创意专家。基于以下分析结果，生成${count}个有差异化的产品概念。

主题：${topic}

市场分析：
- 趋势：${insights.trends.join('、')}
- 痛点：${insights.painPoints.join('、')}
- 机会：${insights.opportunities.join('、')}
- 竞品：${insights.competitors.join('、')}
- 市场规模：${insights.marketSize}

请生成${count}个产品概念，直接输出JSON格式（不要包含markdown代码块标记）：

{
  "concepts": [
    {
      "name": "产品名称（简洁有记忆点，2-4个字）",
      "tagline": "一句话定位（描述产品是什么、给谁用、解决什么问题）",
      "targetUser": "目标用户描述",
      "coreFeatures": ["核心功能1", "核心功能2", "核心功能3"],
      "differentiation": "与现有方案的差异化点",
      "businessModel": "商业模式建议",
      "risks": ["风险1", "风险2"],
      "nextSteps": ["建议的下一步行动1", "建议的下一步行动2"]
    }
    // ... 共${count}个概念，要有明显差异化
  ]
}

要求：
1. ${count}个概念要有明显差异化（不同细分人群或解决方式）
2. 概念要具体可行，不是空泛的想法
3. 商业模式要现实
4. 用中文回答
5. 直接输出JSON，不要包含\`\`\`json标记`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content || '{"concepts": []}';
  const result = JSON.parse(content);
  return result.concepts || [];
}
