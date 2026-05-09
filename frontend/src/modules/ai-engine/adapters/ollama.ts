import { BaseAIAdapter } from './base';
import type { ChatMessage, AIResponse, StreamResponse, AIConfig } from '../types';

export class OllamaAdapter extends BaseAIAdapter {
  constructor(config: AIConfig) {
    super(config);
  }

  async generate(messages: ChatMessage[]): Promise<AIResponse> {
    this.validateConfig();

    const headers = this.buildHeaders();
    const baseUrl = this.config.baseUrl || 'http://localhost:11434';

    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: this.config.model || 'llama3',
        messages,
        stream: false,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || '请求失败');
    }

    const data = await response.json();
    return {
      content: data.message.content,
      finishReason: 'stop',
    };
  }

  async *stream(messages: ChatMessage[]): AsyncGenerator<StreamResponse> {
    this.validateConfig();

    const headers = this.buildHeaders();
    const baseUrl = this.config.baseUrl || 'http://localhost:11434';

    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: this.config.model || 'llama3',
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || '请求失败');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法获取响应流');
    }

    const decoder = new TextDecoder('utf-8');
    let content = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        yield { content, done: true };
        break;
      }

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter((line) => line.trim());

      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.done) {
            yield { content, done: true };
            return;
          }
          const delta = json.message?.content || '';
          content += delta;
          yield { content, done: false };
        } catch {
          continue;
        }
      }
    }
  }
}