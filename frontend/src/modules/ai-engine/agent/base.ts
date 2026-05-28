/**
 * Agent 基类
 * Base Agent Class
 */

import type { AgentConfig, AgentResponse, AgentMessage, AgentTool } from './types';
import type { AIConfig } from '../types';
import { BaseAIAdapter } from '../adapters/base';

export class DedicatedAgent {
  protected config: AgentConfig;
  protected adapter: BaseAIAdapter;
  protected messageHistory: AgentMessage[] = [];
  protected tools: Map<string, AgentTool> = new Map();

  constructor(config: AgentConfig, adapter: BaseAIAdapter) {
    this.config = config;
    this.adapter = adapter;
    
    // 注册工具
    config.tools.forEach(tool => {
      this.tools.set(tool.name, tool);
    });
  }

  async execute(input: string, context?: Record<string, any>): Promise<AgentResponse> {
    const startTime = Date.now();
    
    try {
      const messages = this.buildMessages(input, context);
      const response = await this.adapter.stream(messages);
      const executionTime = Date.now() - startTime;
      
      return this.processResponse(response, executionTime);
    } catch (error) {
      console.error(`Agent ${this.config.type} execution failed:`, error);
      throw error;
    }
  }

  async executeWithTool(
    input: string, 
    toolName: string, 
    toolParams: any,
    context?: Record<string, any>
  ): Promise<AgentResponse> {
    const tool = this.tools.get(toolName);
    if (!tool) {
      throw new Error(`Tool ${toolName} not found in agent ${this.config.type}`);
    }

    try {
      // 先执行工具
      const toolResult = await tool.execute(toolParams);
      
      // 将工具结果添加到输入
      const enhancedInput = `${input}\n\n工具执行结果：\n${JSON.stringify(toolResult, null, 2)}`;
      
      return this.execute(enhancedInput, context);
    } catch (error) {
      console.error(`Tool ${toolName} execution failed:`, error);
      throw error;
    }
  }

  protected buildMessages(input: string, context?: Record<string, any>): AgentMessage[] {
    const messages: AgentMessage[] = [
      { role: 'system', content: this.config.systemPrompt }
    ];

    // 添加上下文信息
    if (context && Object.keys(context).length > 0) {
      const contextMessage = this.formatContext(context);
      messages.push({
        role: 'system',
        content: `上下文信息：\n${contextMessage}`
      });
    }

    // 添加历史消息
    messages.push(...this.messageHistory);

    // 添加当前输入
    messages.push({ role: 'user', content: input });

    return messages;
  }

  protected formatContext(context: Record<string, any>): string {
    const parts: string[] = [];
    
    for (const [key, value] of Object.entries(context)) {
      if (typeof value === 'string') {
        parts.push(`${key}: ${value}`);
      } else if (typeof value === 'object') {
        parts.push(`${key}: ${JSON.stringify(value, null, 2)}`);
      }
    }
    
    return parts.join('\n\n');
  }

  protected processResponse(response: any, executionTime: number): AgentResponse {
    // 更新消息历史
    this.messageHistory.push(
      { role: 'assistant', content: response.content }
    );

    // 限制历史消息长度（保留最近 10 条）
    if (this.messageHistory.length > 10) {
      this.messageHistory = this.messageHistory.slice(-10);
    }

    return {
      content: response.content,
      metadata: {
        agentType: this.config.type,
        confidence: 0.9,
        executionTime
      }
    };
  }

  // 添加工具
  addTool(tool: AgentTool): void {
    this.tools.set(tool.name, tool);
  }

  // 移除工具
  removeTool(toolName: string): void {
    this.tools.delete(toolName);
  }

  // 清空消息历史
  clearHistory(): void {
    this.messageHistory = [];
  }

  // 获取配置
  getConfig(): AgentConfig {
    return { ...this.config };
  }

  // 获取工具列表
  getTools(): string[] {
    return Array.from(this.tools.keys());
  }
}
