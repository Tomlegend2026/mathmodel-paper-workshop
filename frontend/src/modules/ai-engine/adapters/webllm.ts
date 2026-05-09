import { BaseAIAdapter } from './base';
import type { ChatMessage, AIResponse, StreamResponse, AIConfig } from '../types';

export class WebLLMAdapter extends BaseAIAdapter {
  private model: any = null;

  constructor(config: AIConfig) {
    super(config);
  }

  private async ensureModel(): Promise<void> {
    if (this.model) return;

    try {
      // 使用动态导入，避免构建时解析错误
      const webllm = await import('@mlc-ai/web-llm');
      const WebLLM = (webllm as any).default || webllm.WebLLM;
      this.model = await WebLLM.createEngine(this.config.model || 'Llama-3-8B-Instruct-q4f32_1');
    } catch (error) {
      throw new Error('WebLLM 加载失败，请确保已安装依赖: npm install @mlc-ai/web-llm');
    }
  }

  async generate(messages: ChatMessage[]): Promise<AIResponse> {
    await this.ensureModel();

    const prompt = messages
      .map((msg) => `${msg.role === 'user' ? 'User: ' : 'Assistant: '}${msg.content}`)
      .join('\n');

    const response = await this.model.generate(prompt);
    return {
      content: response,
      finishReason: 'stop',
    };
  }

  async *stream(messages: ChatMessage[]): AsyncGenerator<StreamResponse> {
    await this.ensureModel();

    let content = '';
    const stream = await this.model.chat.completions.create({
      messages: messages.map((m) => ({ role: m.role as 'user' | 'assistant' | 'system', content: m.content })),
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || '';
      content += delta;
      yield { content, done: false };
    }

    yield { content, done: true };
  }
}