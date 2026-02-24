// 全局状态管理
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  EntryType, 
  SearchResult, 
  Template, 
  GeneratedContent, 
  CardSpec, 
  ImageStyle,
  TEMPLATES,
  CARD_SPECS 
} from '@/types';

interface AppState {
  // 当前步骤
  currentStep: number;
  setStep: (step: number) => void;

  // 入口类型
  entryType: EntryType | null;
  setEntryType: (type: EntryType) => void;

  // 搜索相关
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
  searchResults: SearchResult[];
  setSearchResults: (results: SearchResult[]) => void;
  toggleResultSelection: (id: string) => void;

  // 文件上传
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  uploadedText: string;
  setUploadedText: (text: string) => void;
  uploadedImageUrl: string;
  setUploadedImageUrl: (url: string) => void;

  // 模板选择
  selectedTemplate: Template | null;
  setSelectedTemplate: (template: Template) => void;

  // 生成内容
  generatedContent: GeneratedContent | null;
  setGeneratedContent: (content: GeneratedContent) => void;

  // 配图
  imageUrl: string | null;
  setImageUrl: (url: string | null) => void;
  imageStyle: ImageStyle;
  setImageStyle: (style: ImageStyle) => void;

  // 卡片规格
  cardSpec: CardSpec;
  setCardSpec: (spec: CardSpec) => void;

  // 加载状态
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadingMessage: string;
  setLoadingMessage: (message: string) => void;

  // 数据来源
  sources: string[];
  setSources: (sources: string[]) => void;

  // 重置
  reset: () => void;
}

const initialState = {
  currentStep: 0,
  entryType: null,
  searchKeyword: '',
  searchResults: [],
  uploadedFile: null,
  uploadedText: '',
  uploadedImageUrl: '',
  selectedTemplate: null,
  generatedContent: null,
  imageUrl: null,
  imageStyle: 'minimal' as ImageStyle,
  cardSpec: 'xiaohongshu' as CardSpec,
  isLoading: false,
  loadingMessage: '',
  sources: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      setStep: (step) => set({ currentStep: step }),
      setEntryType: (type) => set({ entryType: type }),
      setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
      setSearchResults: (results) => set({ searchResults: results }),
      
      toggleResultSelection: (id) =>
        set((state) => ({
          searchResults: state.searchResults.map((r) =>
            r.id === id ? { ...r, selected: !r.selected } : r
          ),
        })),

      setUploadedFile: (file) => set({ uploadedFile: file }),
      setUploadedText: (text) => set({ uploadedText: text }),
      setUploadedImageUrl: (url) => set({ uploadedImageUrl: url }),

      setSelectedTemplate: (template) => set({ selectedTemplate: template }),

      setGeneratedContent: (content) => set({ generatedContent: content }),

      setImageUrl: (url) => set({ imageUrl: url }),
      setImageStyle: (style) => set({ imageStyle: style }),

      setCardSpec: (spec) => set({ cardSpec: spec }),

      setIsLoading: (loading) => set({ isLoading: loading }),
      setLoadingMessage: (message) => set({ loadingMessage: message }),

      setSources: (sources) => set({ sources }),

      reset: () => set(initialState),
    }),
    {
      name: 'idea-catcher-storage',
      partialize: (state) => ({
        entryType: state.entryType,
        cardSpec: state.cardSpec,
        imageStyle: state.imageStyle,
      }),
    }
  )
);

// 导出常量供组件使用
export { TEMPLATES, CARD_SPECS };
