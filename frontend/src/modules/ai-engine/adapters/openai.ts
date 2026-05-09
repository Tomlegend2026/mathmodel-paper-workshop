import { BaseAIAdapter } from './base';
import type { ChatMessage, AIResponse, StreamResponse, AIConfig } from '../types';

export class OpenAIAdapter extends BaseAIAdapter {
  constructor(config: AIConfig) {
    super(config);
  }

  async generate(messages: ChatMessage[]): Promise<AIResponse> {
    this.validateConfig();
    if (!this.config.apiKey) {
      throw new Error('OpenAI API Key 未设置');
    }

    const headers = this.buildHeaders();
    headers['Authorization'] = `Bearer ${this.config.apiKey}`;

    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: this.config.model || 'gpt-4o-mini',
        messages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || '请求失败');
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      finishReason: data.choices[0].finish_reason,
    };
  }

  async *stream(messages: ChatMessage[]): AsyncGenerator<StreamResponse> {
    this.validateConfig();
    if (!this.config.apiKey) {
      throw new Error('OpenAI API Key 未设置');
    }

    const headers = this.buildHeaders();
    headers['Authorization'] = `Bearer ${this.config.apiKey}`;

    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: this.config.model || 'gpt-4o-mini',
        messages,
        temperature: 0.7,
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
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            yield { content, done: true };
            return;
          }
          try {
            const json = JSON.parse(data);
            const delta = json.choices[0]?.delta?.content || '';
            content += delta;
            yield { content, done: false };
          } catch {
            continue;
          }
        }
      }
    }
  }
}