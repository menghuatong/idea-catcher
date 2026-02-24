// 搜索 API 封装

interface BingSearchResult {
  webPages?: {
    value: Array<{
      name: string;
      snippet: string;
      url: string;
      displayUrl: string;
    }>;
  };
}

interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
}

// Bing Search API
export async function searchWithBing(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.BING_API_KEY;
  const endpoint = process.env.BING_ENDPOINT || 'https://api.bing.microsoft.com/v7.0/search';

  if (!apiKey) {
    throw new Error('BING_API_KEY is not configured');
  }

  const params = new URLSearchParams({
    q: query,
    count: '20',
    mkt: 'zh-CN',
    responseFilter: 'Webpages',
  });

  const response = await fetch(`${endpoint}?${params}`, {
    headers: {
      'Ocp-Apim-Subscription-Key': apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Bing API error: ${response.status}`);
  }

  const data: BingSearchResult = await response.json();
  const results = data.webPages?.value || [];

  return results.map((item) => ({
    title: item.name,
    snippet: item.snippet,
    url: item.url,
    source: item.displayUrl,
  }));
}

// Brave Search API (备选)
export async function searchWithBrave(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.BRAVE_API_KEY;
  const endpoint = 'https://api.search.brave.com/res/v1/web/search';

  if (!apiKey) {
    throw new Error('BRAVE_API_KEY is not configured');
  }

  const response = await fetch(`${endpoint}?q=${encodeURIComponent(query)}&count=20`, {
    headers: {
      'Accept': 'application/json',
      'X-Subscription-Token': apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Brave API error: ${response.status}`);
  }

  const data = await response.json();
  const results = data.web?.results || [];

  return results.map((item: any) => ({
    title: item.title,
    snippet: item.description,
    url: item.url,
    source: new URL(item.url).hostname,
  }));
}

// 统一搜索接口
export async function search(query: string): Promise<SearchResult[]> {
  // 优先使用 Bing，备选 Brave
  try {
    if (process.env.BING_API_KEY) {
      return await searchWithBing(query);
    }
    if (process.env.BRAVE_API_KEY) {
      return await searchWithBrave(query);
    }
    throw new Error('No search API configured');
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}

// 格式化搜索结果为文本（用于AI分析）
export function formatSearchResults(results: SearchResult[]): string {
  return results
    .map((r, i) => `${i + 1}. 【${r.title}】\n   ${r.snippet}\n   来源: ${r.source}`)
    .join('\n\n');
}
