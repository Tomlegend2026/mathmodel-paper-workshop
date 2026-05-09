import { createAIAdapter } from './adapters';

export { useAIStore } from './store';
export { OpenAIAdapter } from './adapters/openai';
export { OllamaAdapter } from './adapters/ollama';
export { WebLLMAdapter } from './adapters/webllm';
export { createAIAdapter } from './adapters';
export { default as AISettingsPanel } from './components/AISettingsPanel';
export { default as StreamOutput } from './components/StreamOutput';
export * from './types';
export * from './prompts';

// 导出配置
export { AI_PROVIDERS, MODELS_BY_PROVIDER, RECOMMENDED_CONFIGS } from './config/providers';

// 向后兼容的旧 API（已废弃，请使用 createAIAdapter）
/** @deprecated */
export const getAIAdapter = (config: {
  provider: 'openai' | 'ollama' | 'webllm';
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}) => {
  return createAIAdapter(config as any);
};