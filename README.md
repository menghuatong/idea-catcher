# 概念大师 v2.0

AI驱动的概念卡片生成器

## 功能特性

- 🎯 4种入口：主题/资料/文字/图片
- 📋 5套模板：产品概念/营销创意/品牌故事/功能介绍/对比评测
- 🎨 AI配图生成
- 📱 多规格卡片：小红书/朋友圈/公众号/海报
- 💾 历史记录

## 技术栈

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Zustand

## 本地开发

```bash
npm install
npm run dev
```

## 环境变量

创建 `.env.local` 文件：

```
OPENAI_API_KEY=your-key
TAVILY_API_KEY=your-key
```

## 部署到 Vercel

### 方法1：一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/idea-catcher)

### 方法2：CLI部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel
```

### 方法3：GitHub + Vercel

1. 将代码推送到 GitHub
2. 在 Vercel 导入 GitHub 仓库
3. 配置环境变量
4. 自动部署

## 环境变量配置

在 Vercel Dashboard 中设置：

| 变量名 | 说明 |
|--------|------|
| OPENAI_API_KEY | OpenAI API密钥 |
| TAVILY_API_KEY | Tavily搜索API密钥 |

## License

MIT
