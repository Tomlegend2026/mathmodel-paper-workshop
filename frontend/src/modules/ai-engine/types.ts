export type AIProvider = 'openai' | 'deepseek' | 'tongyi' | 'kimi' | 'glm' | 'ollama' | 'webllm';

export interface AIModel {
  name: string;
  value: string;
  description: string;
  isFree?: boolean;
}

export interface AIConfig {
  provider: AIProvider;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  finishReason: string;
}

export interface StreamResponse {
  content: string;
  done: boolean;
}