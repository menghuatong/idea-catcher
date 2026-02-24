# 部署指南

## 本地开发

### 1. 安装依赖
```bash
cd dev
npm install
```

### 2. 配置环境变量
```bash
cp .env.example .env.local
# 编辑 .env.local 填入你的 API Key
```

### 3. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000

---

## Vercel 部署

### 1. 安装 Vercel CLI
```bash
npm i -g vercel
```

### 2. 登录
```bash
vercel login
```

### 3. 部署
```bash
cd dev
vercel
```

### 4. 配置环境变量
在 Vercel Dashboard 中设置：
- `OPENAI_API_KEY`
- `BING_API_KEY`

### 5. 生产部署
```bash
vercel --prod
```

---

## API Key 获取

### OpenAI API Key
1. 访问 https://platform.openai.com/api-keys
2. 创建新的 API Key
3. 复制到 `.env.local` 的 `OPENAI_API_KEY`

### Bing Search API Key
1. 访问 https://portal.azure.com
2. 创建 "Bing Search v7" 资源
3. 获取 Key 1 或 Key 2
4. 复制到 `.env.local` 的 `BING_API_KEY`

---

## 目录结构

```
dev/
├── src/
│   ├── app/              # Next.js App Router 页面
│   │   ├── page.tsx      # 首页
│   │   ├── generate/     # 生成页
│   │   ├── result/       # 结果页
│   │   └── api/          # API Routes
│   ├── components/       # React 组件
│   ├── lib/              # 工具库
│   ├── hooks/            # 自定义 Hooks
│   └── types/            # TypeScript 类型
├── public/               # 静态资源
├── .env.local            # 环境变量
├── next.config.js        # Next.js 配置
├── tailwind.config.js    # Tailwind 配置
├── tsconfig.json         # TypeScript 配置
└── package.json          # 依赖配置
```

---

## 开发命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run start    # 启动生产服务器
npm run lint     # 代码检查
```

---

## 注意事项

1. **API 成本**：每次生成约消耗 $0.03，注意控制使用频率
2. **速率限制**：OpenAI 有速率限制，高频使用需要处理
3. **缓存策略**：可考虑对相同主题的结果进行缓存
