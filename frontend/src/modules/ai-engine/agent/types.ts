/**
 * Agent 集群类型定义
 * Agent Cluster Type Definitions
 */

export type AgentType = 
  | 'problem-analyzer'    // Step 1: 选题分析
  | 'model-designer'      // Step 2: 建模设计
  | 'code-generator'      // Step 3: 代码生成
  | 'paper-writer'        // Step 4: 论文写作
  | 'optimizer';          // Step 5: 结果优化

export interface AgentConfig {
  type: AgentType;
  name: string;
  description: string;
  systemPrompt: string;
  tools: AgentTool[];
  maxTokens: number;
  temperature: number;
}

export interface AgentTool {
  name: string;
  description: string;
  execute: (params: any) => Promise<any>;
}

export interface AgentMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, any>;
}

export interface AgentResponse {
  content: string;
  metadata: {
    agentType: AgentType;
    confidence: number;
    suggestions?: string[];
    executionTime?: number;
    tokenUsage?: {
      prompt: number;
      completion: number;
      total: number;
    };
  };
}

export interface AgentPerformance {
  agentType: AgentType;
  totalCalls: number;
  totalTokens: number;
  averageExecutionTime: number;
  lastExecutionTime?: number;
  errorCount: number;
}
