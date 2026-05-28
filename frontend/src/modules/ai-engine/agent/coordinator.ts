/**
 * Agent 协调器
 * Agent Coordinator - Manages workflow execution across multiple agents
 */

import type { AgentType, AgentResponse } from './types';
import { AgentFactory } from './factory';
import { DedicatedAgent } from './base';

export class AgentCoordinator {
  private agents = new Map<AgentType, DedicatedAgent>();
  private workflowContext = new Map<string, any>();
  private executionLog: Array<{
    step: number;
    agentType: AgentType;
    timestamp: number;
    executionTime?: number;
    success: boolean;
    error?: string;
  }> = [];

  /**
   * 执行指定步骤的 Agent
   * @param step 步骤编号 (1-5)
   * @param input 输入内容
   * @returns Agent 响应
   */
  async executeStep(step: number, input: string): Promise<AgentResponse> {
    const startTime = Date.now();
    const agentType = this.mapStepToAgent(step);
    
    try {
      // 获取或创建 Agent
      let agent = this.agents.get(agentType);
      if (!agent) {
        agent = AgentFactory.createAgent(agentType);
        this.agents.set(agentType, agent);
      }
      
      // 构建上下文（包含前面步骤的结果）
      const context = this.buildContext(step);
      
      // 执行 Agent
      const response = await agent.execute(input, context);
      const executionTime = Date.now() - startTime;
      
      // 保存结果到上下文
      this.workflowContext.set(`step${step}`, {
        ...response,
        executionTime
      });
      
      // 记录执行日志
      this.executionLog.push({
        step,
        agentType,
        timestamp: startTime,
        executionTime,
        success: true
      });
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // 记录错误日志
      this.executionLog.push({
        step,
        agentType,
        timestamp: startTime,
        success: false,
        error: errorMessage
      });
      
      console.error(`Agent Coordinator: Step ${step} (${agentType}) failed:`, errorMessage);
      throw error;
    }
  }

  /**
   * 执行完整的工作流（所有 5 个步骤）
   * @param initialInput 初始输入（题目内容）
   * @returns 所有步骤的响应
   */
  async executeFullWorkflow(initialInput: string): Promise<Record<number, AgentResponse>> {
    const results: Record<number, AgentResponse> = {};
    
    // Step 1: 选题分析
    console.log('Executing Step 1: Problem Analysis...');
    results[1] = await this.executeStep(1, initialInput);
    
    // Step 2: 建模设计
    console.log('Executing Step 2: Model Design...');
    results[2] = await this.executeStep(2, '基于前面的题目分析，请设计合适的数学模型');
    
    // Step 3: 代码生成
    console.log('Executing Step 3: Code Generation...');
    results[3] = await this.executeStep(3, '根据设计的模型，生成完整的求解代码');
    
    // Step 4: 论文写作
    console.log('Executing Step 4: Paper Writing...');
    results[4] = await this.executeStep(4, '基于前面的分析和结果，撰写论文章节');
    
    // Step 5: 结果优化
    console.log('Executing Step 5: Optimization...');
    results[5] = await this.executeStep(5, '对求解结果进行分析和优化建议');
    
    return results;
  }

  /**
   * 将步骤映射到 Agent 类型
   * @param step 步骤编号
   * @returns Agent 类型
   */
  private mapStepToAgent(step: number): AgentType {
    const mapping: Record<number, AgentType> = {
      1: 'problem-analyzer',
      2: 'model-designer',
      3: 'code-generator',
      4: 'paper-writer',
      5: 'optimizer'
    };
    
    const agentType = mapping[step];
    if (!agentType) {
      throw new Error(`Invalid step number: ${step}. Must be between 1 and 5.`);
    }
    
    return agentType;
  }

  /**
   * 构建上下文（收集前面步骤的结果）
   * @param currentStep 当前步骤
   * @returns 上下文字典
   */
  private buildContext(currentStep: number): Record<string, any> {
    const context: Record<string, any> = {};
    
    // 收集前面所有步骤的结果
    for (let i = 1; i < currentStep; i++) {
      const prevResult = this.workflowContext.get(`step${i}`);
      if (prevResult) {
        context[`step${i}_result`] = prevResult;
        
        // 提取关键信息供后续步骤使用
        if (i === 1 && prevResult.content) {
          // Step 1 的结果：题目分析
          context['problem_analysis'] = prevResult.content;
        } else if (i === 2 && prevResult.content) {
          // Step 2 的结果：模型设计
          context['model_design'] = prevResult.content;
        } else if (i === 3 && prevResult.content) {
          // Step 3 的结果：代码和求解
          context['solution_code'] = prevResult.content;
        } else if (i === 4 && prevResult.content) {
          // Step 4 的结果：论文内容
          context['paper_draft'] = prevResult.content;
        }
      }
    }
    
    return context;
  }

  /**
   * 获取工作流上下文
   * @returns 完整的上下文字典
   */
  getWorkflowContext(): Map<string, any> {
    return new Map(this.workflowContext);
  }

  /**
   * 获取特定步骤的结果
   * @param step 步骤编号
   * @returns 该步骤的响应（如果存在）
   */
  getStepResult(step: number): AgentResponse | undefined {
    return this.workflowContext.get(`step${step}`);
  }

  /**
   * 清空工作流上下文和 Agent 缓存
   */
  reset(): void {
    this.workflowContext.clear();
    this.agents.clear();
    this.executionLog = [];
  }

  /**
   * 获取执行日志
   * @returns 执行日志数组
   */
  getExecutionLog(): typeof this.executionLog {
    return [...this.executionLog];
  }

  /**
   * 获取工作流统计信息
   * @returns 统计信息对象
   */
  getWorkflowStats(): {
    totalSteps: number;
    completedSteps: number;
    failedSteps: number;
    totalExecutionTime: number;
    averageExecutionTime: number;
  } {
    const completed = this.executionLog.filter(log => log.success);
    const failed = this.executionLog.filter(log => !log.success);
    const totalTime = completed.reduce((sum, log) => sum + (log.executionTime || 0), 0);
    
    return {
      totalSteps: this.executionLog.length,
      completedSteps: completed.length,
      failedSteps: failed.length,
      totalExecutionTime: totalTime,
      averageExecutionTime: completed.length > 0 ? totalTime / completed.length : 0
    };
  }

  /**
   * 手动注入上下文数据
   * @param key 键名
   * @param value 值
   */
  setContextValue(key: string, value: any): void {
    this.workflowContext.set(key, value);
  }

  /**
   * 获取特定的上下文值
   * @param key 键名
   * @returns 值（如果存在）
   */
  getContextValue(key: string): any {
    return this.workflowContext.get(key);
  }
}
