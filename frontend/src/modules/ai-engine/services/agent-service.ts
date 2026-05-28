/**
 * Agent 集成服务层
 * 提供向后兼容的 API，同时支持新的 Agent 集群架构
 */

import { AgentCoordinator } from '../agent/coordinator';
import { globalAgentMonitor } from '../agent/monitor';
import type { AgentResponse } from '../agent/types';

/**
 * Agent 服务类
 * 封装 Agent Coordinator，提供更简洁的 API
 */
export class AgentService {
  private coordinator: AgentCoordinator;
  private projectId?: number;

  constructor(projectId?: number) {
    this.coordinator = new AgentCoordinator();
    this.projectId = projectId;
  }

  /**
   * Step 1: 选题分析
   * @param problemContent 题目内容
   * @returns 分析结果
   */
  async analyzeProblem(problemContent: string): Promise<AgentResponse> {
    console.log('[AgentService] Step 1: Analyzing problem...');
    const response = await this.coordinator.executeStep(1, problemContent);
    
    // 记录性能数据
    if (response.metadata.executionTime) {
      globalAgentMonitor.recordExecution(
        'problem-analyzer',
        response.metadata.executionTime
      );
    }
    
    return response;
  }

  /**
   * Step 2: 建模设计
   * @param problemAnalysis Step 1 的分析结果
   * @returns 模型设计方案
   */
  async designModel(problemAnalysis: string): Promise<AgentResponse> {
    console.log('[AgentService] Step 2: Designing model...');
    const input = `基于以下题目分析结果，请设计合适的数学模型：\n\n${problemAnalysis}`;
    const response = await this.coordinator.executeStep(2, input);
    
    if (response.metadata.executionTime) {
      globalAgentMonitor.recordExecution('model-designer', response.metadata.executionTime);
    }
    
    return response;
  }

  /**
   * Step 3: 代码生成
   * @param modelDesign Step 2 的模型设计
   * @returns 生成的代码
   */
  async generateCode(modelDesign: string): Promise<AgentResponse> {
    console.log('[AgentService] Step 3: Generating code...');
    const input = `根据以下模型设计，生成完整的求解代码：\n\n${modelDesign}`;
    const response = await this.coordinator.executeStep(3, input);
    
    if (response.metadata.executionTime) {
      globalAgentMonitor.recordExecution('code-generator', response.metadata.executionTime);
    }
    
    return response;
  }

  /**
   * Step 4: 论文写作
   * @param context 前面步骤的完整上下文
   * @param section 要撰写的章节（可选）
   * @returns 论文章节内容
   */
  async writePaper(context: string, section?: string): Promise<AgentResponse> {
    console.log('[AgentService] Step 4: Writing paper...');
    let input = `基于以下分析和建模结果，撰写论文章节：\n\n${context}`;
    
    if (section) {
      input += `\n\n请重点撰写：${section} 章节`;
    }
    
    const response = await this.coordinator.executeStep(4, input);
    
    if (response.metadata.executionTime) {
      globalAgentMonitor.recordExecution('paper-writer', response.metadata.executionTime);
    }
    
    return response;
  }

  /**
   * Step 5: 结果优化
   * @param results 求解结果和论文草稿
   * @returns 优化建议和分析报告
   */
  async optimizeResults(results: string): Promise<AgentResponse> {
    console.log('[AgentService] Step 5: Optimizing results...');
    const input = `对以下求解结果进行分析和优化：\n\n${results}`;
    const response = await this.coordinator.executeStep(5, input);
    
    if (response.metadata.executionTime) {
      globalAgentMonitor.recordExecution('optimizer', response.metadata.executionTime);
    }
    
    return response;
  }

  /**
   * 执行完整工作流
   * @param problemContent 题目内容
   * @returns 所有步骤的结果
   */
  async executeFullWorkflow(problemContent: string): Promise<Record<number, AgentResponse>> {
    console.log('[AgentService] Executing full workflow...');
    const results = await this.coordinator.executeFullWorkflow(problemContent);
    
    // 记录所有步骤的性能
    Object.entries(results).forEach(([step, response]) => {
      const agentType = this.getAgentTypeForStep(parseInt(step));
      if (agentType && response.metadata.executionTime) {
        globalAgentMonitor.recordExecution(agentType, response.metadata.executionTime);
      }
    });
    
    return results;
  }

  /**
   * 获取工作流统计信息
   */
  getWorkflowStats() {
    return this.coordinator.getWorkflowStats();
  }

  /**
   * 获取特定步骤的结果
   */
  getStepResult(step: number): AgentResponse | undefined {
    return this.coordinator.getStepResult(step);
  }

  /**
   * 重置工作流
   */
  reset() {
    this.coordinator.reset();
  }

  /**
   * 导出性能报告
   */
  exportPerformanceReport(): string {
    return globalAgentMonitor.exportToJSON();
  }

  /**
   * 根据步骤编号获取 Agent 类型
   */
  private getAgentTypeForStep(step: number) {
    const mapping: Record<number, any> = {
      1: 'problem-analyzer',
      2: 'model-designer',
      3: 'code-generator',
      4: 'paper-writer',
      5: 'optimizer'
    };
    return mapping[step];
  }
}

/**
 * 创建 Agent 服务的工厂函数
 * @param projectId 项目 ID（可选）
 * @returns AgentService 实例
 */
export function createAgentService(projectId?: number): AgentService {
  return new AgentService(projectId);
}
