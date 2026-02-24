// 核心类型定义 - 概念大师 v2.0

// ==================== 入口类型 ====================

export type EntryType = 'topic' | 'file' | 'text' | 'image';

// ==================== 搜索相关 ====================

export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  url: string;
  source: string;
  selected?: boolean;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
}

// ==================== 模板相关 ====================

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  structure: TemplateField[];
  scenario: string;
}

export interface TemplateField {
  key: string;
  label: string;
  placeholder: string;
  required: boolean;
  maxLength?: number;
}

// 预定义模板
export const TEMPLATES: Template[] = [
  {
    id: 'product-concept',
    name: '产品概念卡',
    description: '适用于新产品创意展示',
    icon: '💡',
    scenario: '新产品创意',
    structure: [
      { key: 'name', label: '产品名称', placeholder: '请输入产品名称', required: true, maxLength: 20 },
      { key: 'tagline', label: '一句话介绍', placeholder: '用一句话描述产品价值', required: true, maxLength: 50 },
      { key: 'targetUser', label: '目标用户', placeholder: '描述目标用户群体', required: true, maxLength: 100 },
      { key: 'features', label: '核心功能', placeholder: '列出3-5个核心功能', required: true, maxLength: 200 },
      { key: 'differentiation', label: '差异化优势', placeholder: '与竞品相比的优势', required: false, maxLength: 150 },
    ],
  },
  {
    id: 'marketing-creative',
    name: '营销创意卡',
    description: '适用于营销活动策划',
    icon: '📣',
    scenario: '营销活动',
    structure: [
      { key: 'theme', label: '活动主题', placeholder: '请输入活动主题', required: true, maxLength: 30 },
      { key: 'painPoint', label: '用户痛点', placeholder: '描述用户面临的问题', required: true, maxLength: 100 },
      { key: 'solution', label: '解决方案', placeholder: '你的产品如何解决', required: true, maxLength: 150 },
      { key: 'cta', label: '行动号召', placeholder: '希望用户做什么', required: true, maxLength: 50 },
      { key: 'highlights', label: '卖点提炼', placeholder: '3个核心卖点', required: false, maxLength: 100 },
    ],
  },
  {
    id: 'brand-story',
    name: '品牌故事卡',
    description: '适用于品牌宣传',
    icon: '📖',
    scenario: '品牌宣传',
    structure: [
      { key: 'philosophy', label: '品牌理念', placeholder: '品牌的核心价值观', required: true, maxLength: 100 },
      { key: 'story', label: '创始故事', placeholder: '品牌诞生的故事', required: true, maxLength: 200 },
      { key: 'values', label: '品牌价值观', placeholder: '3个核心价值', required: true, maxLength: 100 },
      { key: 'vision', label: '品牌愿景', placeholder: '未来的目标', required: false, maxLength: 100 },
    ],
  },
  {
    id: 'feature-intro',
    name: '功能介绍卡',
    description: '适用于功能推广',
    icon: '⚡',
    scenario: '功能推广',
    structure: [
      { key: 'featureName', label: '功能名称', placeholder: '请输入功能名称', required: true, maxLength: 20 },
      { key: 'problem', label: '解决问题', placeholder: '该功能解决什么问题', required: true, maxLength: 100 },
      { key: 'usage', label: '使用方法', placeholder: '用户如何使用', required: true, maxLength: 150 },
      { key: 'value', label: '用户价值', placeholder: '用户能获得什么', required: true, maxLength: 100 },
    ],
  },
  {
    id: 'comparison-review',
    name: '对比评测卡',
    description: '适用于产品对比',
    icon: '⚖️',
    scenario: '产品评测',
    structure: [
      { key: 'products', label: '对比产品', placeholder: '列出对比的产品', required: true, maxLength: 100 },
      { key: 'pros', label: '优势分析', placeholder: '各产品的优势', required: true, maxLength: 150 },
      { key: 'cons', label: '劣势分析', placeholder: '各产品的劣势', required: true, maxLength: 150 },
      { key: 'recommendation', label: '推荐建议', placeholder: '你的推荐和理由', required: true, maxLength: 100 },
    ],
  },
];

// ==================== 卡片相关 ====================

export type CardSpec = 'xiaohongshu' | 'moments' | 'wechat' | 'poster';

export interface CardSpecConfig {
  id: CardSpec;
  name: string;
  width: number;
  height: number;
  platform: string;
}

export const CARD_SPECS: CardSpecConfig[] = [
  { id: 'xiaohongshu', name: '小红书', width: 1080, height: 1440, platform: '小红书笔记' },
  { id: 'moments', name: '朋友圈', width: 1080, height: 1080, platform: '微信朋友圈' },
  { id: 'wechat', name: '公众号', width: 900, height: 383, platform: '公众号封面' },
  { id: 'poster', name: '海报', width: 1080, height: 1440, platform: '线下海报' },
];

export interface GeneratedContent {
  [key: string]: string;
}

export interface Card {
  id: string;
  templateId: string;
  spec: CardSpec;
  content: GeneratedContent;
  imageUrl?: string;
  sources?: string[];
  createdAt: string;
}

// ==================== 生成相关 ====================

export interface GenerateRequest {
  entryType: EntryType;
  topic?: string;
  selectedResults?: SearchResult[];
  fileUrl?: string;
  text?: string;
  imageUrl?: string;
  templateId: string;
}

export interface GenerateResponse {
  content: GeneratedContent;
  duration: number;
  sources?: string[];
}

// ==================== 配图相关 ====================

export type ImageStyle = 'minimal' | 'tech' | 'warm' | 'business';

export interface ImageGenerateRequest {
  prompt: string;
  style?: ImageStyle;
}

export interface ImageGenerateResponse {
  imageUrl: string;
  duration: number;
}

// ==================== 历史记录 ====================

export interface HistoryRecord {
  id: string;
  topic: string;
  entryType: EntryType;
  templateId: string;
  templateName: string;
  content: GeneratedContent;
  imageUrl?: string;
  cardSpec: CardSpec;
  thumbnail?: string;
  createdAt: string;
}

// ==================== 用户设置 ====================

export interface UserPreferences {
  defaultTemplate?: string;
  defaultImageStyle?: ImageStyle;
  defaultCardSpec?: CardSpec;
  defaultExportFormat?: 'png' | 'jpg' | 'pdf';
}

// ==================== 流式响应 ====================

export type StreamStage = 'searching' | 'analyzing' | 'generating' | 'imaging' | 'complete' | 'error';

export interface StreamEvent {
  stage: StreamStage;
  message?: string;
  progress?: number;
  data?: any;
  error?: string;
}

// ==================== 热门推荐 ====================

export interface HotTopic {
  id: string;
  name: string;
  icon: string;
}

export const HOT_TOPICS: HotTopic[] = [
  { id: '1', name: 'AI工具', icon: '🤖' },
  { id: '2', name: '健康管理', icon: '💪' },
  { id: '3', name: '知识付费', icon: '📚' },
  { id: '4', name: '效率工具', icon: '⚡' },
  { id: '5', name: '宠物经济', icon: '🐱' },
  { id: '6', name: '银发市场', icon: '👴' },
];
