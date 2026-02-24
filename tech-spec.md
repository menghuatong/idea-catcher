# 技术方案 - 灵感捕手

## 文档信息
- 项目名称：灵感捕手 (Idea Catcher)
- 版本：v0.1 MVP
- 架构师：铸物 ⚒️
- 日期：2026-02-21

---

## 1. 项目概述

### 1.1 背景
AI驱动的产品概念生成工具，核心流程：输入主题 → 搜索信息 → AI分析 → 生成概念

### 1.2 核心功能
- 关键词输入 + 热门推荐
- 调用搜索API收集信息
- 调用LLM分析和生成
- 结果展示 + 导出

---

## 2. 技术选型

### 2.1 前端技术栈

| 技术 | 版本 | 选型理由 |
|-----|------|---------|
| Next.js | 14.x | React全栈框架，SSR/SSG支持，API Routes内置 |
| TypeScript | 5.x | 类型安全，开发体验好 |
| Tailwind CSS | 3.x | 原子化CSS，快速开发 |
| Zustand | 4.x | 轻量状态管理 |
| React Query | 5.x | 数据请求和缓存 |
| Framer Motion | 11.x | 动画库 |

### 2.2 后端技术栈

| 技术 | 版本 | 选型理由 |
|-----|------|---------|
| Next.js API Routes | - | 与前端同仓库，部署简单 |
| Zod | 3.x | 数据验证 |

### 2.3 外部服务

| 服务 | 用途 | 备注 |
|-----|------|------|
| OpenAI API | LLM分析和生成 | GPT-4o-mini 成本较低 |
| Bing Search API | 网络信息搜索 | 或使用 Brave Search |
| Vercel | 部署托管 | 自动CI/CD |

---

## 3. 系统架构

### 3.1 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        用户浏览器                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Next.js 前端 (React)                    │   │
│  │    首页 → 生成页 → 结果页                            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js API Routes                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ /api/search │  │ /api/analyze│  │ /api/generate│        │
│  │  信息收集   │  │  趋势分析   │  │  概念生成    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
         │                  │                  │
         ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Bing Search │    │  OpenAI API │    │  OpenAI API │
│    API      │    │   (分析)    │    │   (生成)    │
└─────────────┘    └─────────────┘    └─────────────┘
```

### 3.2 数据流

```
用户输入主题
    │
    ▼
┌─────────────────┐
│ 1. 搜索信息     │ ← Bing Search API
│    (10-20条)   │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ 2. 信息预处理   │
│    去重/清洗   │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ 3. AI分析      │ ← OpenAI API
│    趋势/痛点   │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ 4. 概念生成    │ ← OpenAI API
│    (3个概念)   │
└─────────────────┘
    │
    ▼
返回结果给前端
```

---

## 4. 目录结构

```
idea-catcher/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # 首页
│   │   ├── generate/
│   │   │   └── page.tsx        # 生成页
│   │   ├── result/
│   │   │   └── page.tsx        # 结果页
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/             # 组件
│   │   ├── ui/                 # 基础UI组件
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Progress.tsx
│   │   │
│   │   ├── home/               # 首页组件
│   │   │   ├── SearchInput.tsx
│   │   │   └── HotTopics.tsx
│   │   │
│   │   ├── generate/           # 生成页组件
│   │   │   ├── ProgressBar.tsx
│   │   │   └── StageIndicator.tsx
│   │   │
│   │   └── result/             # 结果页组件
│   │       ├── ConceptCard.tsx
│   │       └── ConceptDetail.tsx
│   │
│   ├── lib/                    # 工具库
│   │   ├── openai.ts           # OpenAI封装
│   │   ├── search.ts           # 搜索API封装
│   │   └── utils.ts            # 通用工具
│   │
│   ├── hooks/                  # 自定义hooks
│   │   └── useGenerate.ts      # 生成流程hook
│   │
│   ├── types/                  # 类型定义
│   │   └── index.ts
│   │
│   └── prompts/                # AI提示词
│       ├── analyze.ts
│       └── generate.ts
│
├── api/                        # API Routes (App Router内)
│   └── routes/
│       ├── search.ts
│       ├── analyze.ts
│       └── generate.ts
│
├── public/                     # 静态资源
├── .env.local                  # 环境变量
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 5. 核心接口设计

### 5.1 API列表

| 接口 | 方法 | 描述 |
|-----|------|------|
| `/api/generate` | POST | 完整生成流程（搜索→分析→生成） |
| `/api/search` | POST | 单独搜索（调试用） |
| `/api/analyze` | POST | 单独分析（调试用） |

### 5.2 `/api/generate` 接口

**请求：**
```typescript
// POST /api/generate
{
  topic: string;        // 用户输入的主题
  options?: {
    count?: number;     // 生成概念数量，默认3
    sources?: string[]; // 信息来源，可选
  }
}
```

**响应（流式）：**
```typescript
// SSE 流式响应
data: {"stage": "searching", "message": "正在收集信息..."}
data: {"stage": "searching", "progress": 30}
data: {"stage": "analyzing", "message": "正在分析趋势..."}
data: {"stage": "generating", "message": "正在生成概念 1/3..."}
data: {"stage": "complete", "result": {...}}
```

**结果结构：**
```typescript
interface GenerateResult {
  topic: string;
  insights: {
    trends: string[];
    painPoints: string[];
    opportunities: string[];
  };
  concepts: Concept[];
  generatedAt: string;
}

interface Concept {
  id: string;
  name: string;
  tagline: string;
  targetUser: string;
  coreFeatures: string[];
  differentiation: string;
  businessModel: string;
  risks: string[];
  nextSteps: string[];
}
```

---

## 6. AI提示词设计

### 6.1 信息分析提示词

```typescript
const ANALYZE_PROMPT = `
你是一个产品市场分析专家。请分析以下关于「${topic}」的网络信息，提取关键洞察。

信息内容：
${searchResults}

请从以下维度分析，输出JSON格式：

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
`;
```

### 6.2 概念生成提示词

```typescript
const GENERATE_PROMPT = `
你是一个产品创意专家。基于以下分析结果，生成3个有差异化的产品概念。

主题：${topic}
市场分析：${JSON.stringify(insights)}

请生成3个产品概念，每个概念包含：

{
  "concepts": [
    {
      "name": "产品名称（简洁有记忆点）",
      "tagline": "一句话定位（描述产品是什么、给谁用、解决什么问题）",
      "targetUser": "目标用户描述",
      "coreFeatures": ["核心功能1", "核心功能2", "核心功能3"],
      "differentiation": "与现有方案的差异化点",
      "businessModel": "商业模式建议",
      "risks": ["风险1", "风险2"],
      "nextSteps": ["建议的下一步行动1", "建议的下一步行动2"]
    }
    // ... 共3个概念
  ]
}

要求：
1. 三个概念要有明显差异化（不同细分人群或解决方式）
2. 概念要具体可行，不是空泛的想法
3. 商业模式要现实
4. 用中文回答
`;
```

---

## 7. 环境变量

```bash
# .env.local

# OpenAI API
OPENAI_API_KEY=sk-xxx
OPENAI_MODEL=gpt-4o-mini

# Bing Search API
BING_API_KEY=xxx
BING_ENDPOINT=https://api.bing.microsoft.com/v7.0/search

# 可选：Brave Search
BRAVE_API_KEY=xxx
```

---

## 8. 部署方案

### 8.1 Vercel部署

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

### 8.2 环境配置

在Vercel Dashboard中配置环境变量：
- `OPENAI_API_KEY`
- `BING_API_KEY`

### 8.3 域名

- 默认：`idea-catcher.vercel.app`
- 自定义：可在Vercel配置

---

## 9. 成本估算

### 9.1 API成本（单次生成）

| API | 调用次数 | 单次成本 | 小计 |
|-----|---------|---------|------|
| Bing Search | 1次 | $0.003 | $0.003 |
| OpenAI (分析) | 1次 | ~$0.01 | $0.01 |
| OpenAI (生成) | 1次 | ~$0.02 | $0.02 |
| **总计** | - | - | **~$0.033** |

### 9.2 月度成本估算

| 日均使用 | 月成本 |
|---------|-------|
| 100次 | $99 |
| 500次 | $495 |
| 1000次 | $990 |

---

## 10. 开发计划

### 10.1 里程碑

| 阶段 | 时间 | 目标 |
|-----|------|------|
| 初始化 | Day 1 | 项目搭建、基础组件 |
| 核心功能 | Day 2-5 | API开发、AI集成 |
| UI开发 | Day 6-8 | 页面开发、交互 |
| 测试优化 | Day 9-10 | 测试、Bug修复 |
| 部署上线 | Day 11-14 | 部署、监控配置 |

### 10.2 技术风险

| 风险 | 应对 |
|-----|------|
| API调用超时 | 添加超时处理，流式响应 |
| 生成质量不稳定 | 优化提示词，多次尝试 |
| 成本超预期 | 添加缓存，限制频率 |

---

*铸物 ⚒️ - 技术方案完成，开始编码实现...*
