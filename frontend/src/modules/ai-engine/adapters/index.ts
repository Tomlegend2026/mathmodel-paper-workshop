export { BaseAIAdapter } from './base';
export { OpenAIAdapter } from './openai';
export { OllamaAdapter } from './ollama';
export { WebLLMAdapter } from './webllm';

// 导出适配器工厂函数
import type { AIConfig, AIProvider } from '../types';
import { OpenAIAdapter } from './openai';
import { OllamaAdapter } from './ollama';
import { WebLLMAdapter } from './webllm';

export function createAIAdapter(config: AIConfig) {
  switch (config.provider) {
    case 'openai':
    case 'deepseek':
    case 'tongyi':
    case 'kimi':
    case 'glm':
      return new OpenAIAdapter(config);
    case 'ollama':
      return new OllamaAdapter(config);
    case 'webllm':
      return new WebLLMAdapter(config);
    default:
      throw new Error(`不支持的 AI 提供商: ${config.provider}`);
  }
}