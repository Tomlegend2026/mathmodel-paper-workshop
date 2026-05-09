import type { ChatMessage, AIResponse, StreamResponse, AIConfig } from '../types';

export abstract class BaseAIAdapter {
  protected config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  abstract generate(messages: ChatMessage[]): Promise<AIResponse>;

  abstract stream(messages: ChatMessage[]): AsyncGenerator<StreamResponse>;

  protected buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    return headers;
  }

  protected validateConfig(): void {
    if (!this.config) {
      throw new Error('AI配置未设置');
    }
  }
}