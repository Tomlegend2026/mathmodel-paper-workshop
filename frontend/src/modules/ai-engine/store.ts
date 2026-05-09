import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AIConfig, AIProvider } from './types';

interface AIStore {
  config: AIConfig;
  isConfigured: boolean;
  setConfig: (config: AIConfig) => void;
  setProvider: (provider: AIProvider) => void;
  setApiKey: (apiKey: string) => void;
  setBaseUrl: (baseUrl: string) => void;
  setModel: (model: string) => void;
  clearConfig: () => void;
}

export const useAIStore = create<AIStore>()(
  persist(
    (set) => ({
      config: {
        provider: 'openai',
        apiKey: '',
        baseUrl: 'https://api.openai.com/v1',
        model: 'gpt-4o-mini',
      },
      isConfigured: false,
      setConfig: (config: AIConfig) =>
        set({
          config,
          isConfigured: !!config.apiKey || config.provider === 'ollama' || config.provider === 'webllm',
        }),
      setProvider: (provider: AIProvider) =>
        set((state) => ({
          config: { ...state.config, provider },
          isConfigured: provider === 'ollama' || provider === 'webllm' || !!state.config.apiKey,
        })),
      setApiKey: (apiKey: string) =>
        set((state) => ({
          config: { ...state.config, apiKey },
          isConfigured: !!apiKey || state.config.provider === 'ollama' || state.config.provider === 'webllm',
        })),
      setBaseUrl: (baseUrl: string) =>
        set((state) => ({
          config: { ...state.config, baseUrl },
        })),
      setModel: (model: string) =>
        set((state) => ({
          config: { ...state.config, model },
        })),
      clearConfig: () =>
        set({
          config: {
            provider: 'openai',
            apiKey: '',
            baseUrl: 'https://api.openai.com/v1',
            model: 'gpt-4o-mini',
          },
          isConfigured: false,
        }),
    }),
    {
      name: 'ai-config',
    }
  )
);