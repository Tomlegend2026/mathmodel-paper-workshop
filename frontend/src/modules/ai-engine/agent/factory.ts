/**
 * Agent 工厂
 * Agent Factory - Creates dedicated agents with specific configurations
 */

import type { AgentConfig, AgentType } from './types';
import { DedicatedAgent } from './base';
import { useAIStore } from '../store';
import { createAIAdapter } from '../adapters';

// Import agent prompts
import { PROBLEM_ANALYZER_PROMPT } from '../prompts/agents/problem-analyzer';
import { MODEL_DESIGNER_PROMPT } from '../prompts/agents/model-designer';
import { CODE_GENERATOR_PROMPT } from '../prompts/agents/code-generator';
import { PAPER_WRITER_PROMPT } from '../prompts/agents/paper-writer';
import { OPTIMIZER_PROMPT } from '../prompts/agents/optimizer';

export class AgentFactory {
  private static agentConfigs: Record<AgentType, AgentConfig> = {
    'problem-analyzer': {
      type: 'problem-analyzer',
      name: '选题分析专家',
      description: '分析数学建模题目，提取关键信息、识别问题类型、生成初步建模思路',
      systemPrompt: PROBLEM_ANALYZER_PROMPT,
      tools: [],
      maxTokens: 2048,
      temperature: 0.3
    },
    'model-designer': {
      type: 'model-designer',
      name: '建模设计专家',
      description: '根据题目特征推荐合适的数学模型，生成假设、符号说明和模型方程',
      systemPrompt: MODEL_DESIGNER_PROMPT,
      tools: [],
      maxTokens: 3072,
      temperature: 0.4
    },
    'code-generator': {
      type: 'code-generator',
      name: '代码生成专家',
      description: '根据模型生成完整的求解代码（Python/MATLAB），包含数据预处理和可视化',
      systemPrompt: CODE_GENERATOR_PROMPT,
      tools: [],
      maxTokens: 4096,
      temperature: 0.2
    },
    'paper-writer': {
      type: 'paper-writer',
      name: '论文写作专家',
      description: '撰写符合竞赛规范的论文章节，生成 LaTeX 格式的公式和表格',
      systemPrompt: PAPER_WRITER_PROMPT,
      tools: [],
      maxTokens: 4096,
      temperature: 0.5
    },
    'optimizer': {
      type: 'optimizer',
      name: '结果优化专家',
      description: '分析求解结果合理性，进行敏感性分析，评估模型优缺点和改进方向',
      systemPrompt: OPTIMIZER_PROMPT,
      tools: [],
      maxTokens: 2048,
      temperature: 0.4
    }
  };

  /**
   * 创建指定类型的 Agent
   * @param type Agent 类型
   * @returns DedicatedAgent 实例
   */
  static createAgent(type: AgentType): DedicatedAgent {
    const config = this.getAgentConfig(type);
    const aiConfig = useAIStore.getState().config;
    const adapter = createAIAdapter(aiConfig);
    
    return new DedicatedAgent(config, adapter);
  }

  /**
   * 获取 Agent 配置
   * @param type Agent 类型
   * @returns AgentConfig 配置对象
   */
  static getAgentConfig(type: AgentType): AgentConfig {
    const config = this.agentConfigs[type];
    if (!config) {
      throw new Error(`Unknown agent type: ${type}`);
    }
    return { ...config }; // 返回副本以防止修改
  }

  /**
   * 获取所有 Agent 类型列表
   * @returns AgentType 数组
   */
  static getAllAgentTypes(): AgentType[] {
    return Object.keys(this.agentConfigs) as AgentType[];
  }

  /**
   * 更新 Agent 配置
   * @param type Agent 类型
   * @param updates 配置更新项
   */
  static updateAgentConfig(type: AgentType, updates: Partial<AgentConfig>): void {
    if (!this.agentConfigs[type]) {
      throw new Error(`Unknown agent type: ${type}`);
    }
    this.agentConfigs[type] = {
      ...this.agentConfigs[type],
      ...updates
    };
  }

  /**
   * 自定义 Agent 提示词
   * @param type Agent 类型
   * @param customPrompt 自定义系统提示词
   */
  static customizePrompt(type: AgentType, customPrompt: string): void {
    if (!this.agentConfigs[type]) {
      throw new Error(`Unknown agent type: ${type}`);
    }
    this.agentConfigs[type].systemPrompt = customPrompt;
  }
}
