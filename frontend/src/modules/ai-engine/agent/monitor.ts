/**
 * Agent 性能监控器
 * Agent Performance Monitor - Tracks and analyzes agent execution metrics
 */

import type { AgentType, AgentPerformance } from '../agent/types';

export class AgentMonitor {
  private performanceData = new Map<AgentType, AgentPerformance>();

  /**
   * 记录 Agent 执行
   * @param agentType Agent 类型
   * @param executionTime 执行时间（毫秒）
   * @param tokenUsage Token 使用量
   * @param success 是否成功
   */
  recordExecution(
    agentType: AgentType,
    executionTime: number,
    tokenUsage?: { prompt: number; completion: number; total: number },
    success: boolean = true
  ): void {
    let perf = this.performanceData.get(agentType);
    
    if (!perf) {
      perf = {
        agentType,
        totalCalls: 0,
        totalTokens: 0,
        averageExecutionTime: 0,
        errorCount: 0
      };
      this.performanceData.set(agentType, perf);
    }
    
    // 更新统计数据
    perf.totalCalls += 1;
    perf.lastExecutionTime = executionTime;
    
    if (tokenUsage) {
      perf.totalTokens += tokenUsage.total;
    }
    
    // 重新计算平均执行时间
    const totalTime = (perf.averageExecutionTime * (perf.totalCalls - 1)) + executionTime;
    perf.averageExecutionTime = totalTime / perf.totalCalls;
    
    if (!success) {
      perf.errorCount += 1;
    }
  }

  /**
   * 获取特定 Agent 的性能数据
   * @param agentType Agent 类型
   * @returns 性能数据（如果存在）
   */
  getPerformance(agentType: AgentType): AgentPerformance | undefined {
    return this.performanceData.get(agentType);
  }

  /**
   * 获取所有 Agent 的性能数据
   * @returns 性能数据数组
   */
  getAllPerformance(): AgentPerformance[] {
    return Array.from(this.performanceData.values());
  }

  /**
   * 获取性能报告
   * @returns 格式化的性能报告
   */
  generateReport(): {
    summary: {
      totalAgents: number;
      totalCalls: number;
      totalTokens: number;
      overallAverageTime: number;
      totalErrors: number;
    };
    agents: AgentPerformance[];
    recommendations: string[];
  } {
    const allPerf = this.getAllPerformance();
    const totalCalls = allPerf.reduce((sum, p) => sum + p.totalCalls, 0);
    const totalTokens = allPerf.reduce((sum, p) => sum + p.totalTokens, 0);
    const totalErrors = allPerf.reduce((sum, p) => sum + p.errorCount, 0);
    
    // 计算整体平均执行时间
    const overallAverageTime = totalCalls > 0
      ? allPerf.reduce((sum, p) => sum + (p.averageExecutionTime * p.totalCalls), 0) / totalCalls
      : 0;
    
    // 生成建议
    const recommendations = this.generateRecommendations(allPerf);
    
    return {
      summary: {
        totalAgents: allPerf.length,
        totalCalls,
        totalTokens,
        overallAverageTime,
        totalErrors
      },
      agents: allPerf,
      recommendations
    };
  }

  /**
   * 生成优化建议
   * @param performances 性能数据数组
   * @returns 建议列表
   */
  private generateRecommendations(performances: AgentPerformance[]): string[] {
    const recommendations: string[] = [];
    
    performances.forEach(perf => {
      // 检查高错误率
      if (perf.totalCalls > 0) {
        const errorRate = perf.errorCount / perf.totalCalls;
        if (errorRate > 0.1) {
          recommendations.push(
            `${perf.agentType} 的错误率较高 (${(errorRate * 100).toFixed(1)}%)，建议检查提示词或模型配置`
          );
        }
      }
      
      // 检查高执行时间
      if (perf.averageExecutionTime > 10000) {
        recommendations.push(
          `${perf.agentType} 的平均执行时间较长 (${(perf.averageExecutionTime / 1000).toFixed(1)}s)，考虑优化提示词或使用更快的模型`
        );
      }
      
      // 检查高 Token 消耗
      if (perf.totalCalls > 0) {
        const avgTokens = perf.totalTokens / perf.totalCalls;
        if (avgTokens > 3000) {
          recommendations.push(
            `${perf.agentType} 的平均 Token 消耗较高 (${avgTokens.toFixed(0)})，建议简化输出格式或减少 maxTokens`
          );
        }
      }
    });
    
    if (recommendations.length === 0) {
      recommendations.push('所有 Agent 性能良好，暂无优化建议');
    }
    
    return recommendations;
  }

  /**
   * 清空性能数据
   */
  reset(): void {
    this.performanceData.clear();
  }

  /**
   * 导出性能数据为 JSON
   * @returns JSON 字符串
   */
  exportToJSON(): string {
    const report = this.generateReport();
    return JSON.stringify(report, null, 2);
  }

  /**
   * 获取最慢的 Agent
   * @returns 最慢的 Agent 性能数据
   */
  getSlowestAgent(): AgentPerformance | undefined {
    const allPerf = this.getAllPerformance();
    if (allPerf.length === 0) return undefined;
    
    return allPerf.reduce((slowest, current) => 
      current.averageExecutionTime > slowest.averageExecutionTime ? current : slowest
    );
  }

  /**
   * 获取最快的 Agent
   * @returns 最快的 Agent 性能数据
   */
  getFastestAgent(): AgentPerformance | undefined {
    const allPerf = this.getAllPerformance();
    if (allPerf.length === 0) return undefined;
    
    return allPerf.reduce((fastest, current) => 
      current.averageExecutionTime < fastest.averageExecutionTime ? current : fastest
    );
  }

  /**
   * 获取错误最多的 Agent
   * @returns 错误最多的 Agent 性能数据
   */
  getMostErrorProneAgent(): AgentPerformance | undefined {
    const allPerf = this.getAllPerformance();
    if (allPerf.length === 0) return undefined;
    
    return allPerf.reduce((mostErrors, current) => 
      current.errorCount > mostErrors.errorCount ? current : mostErrors
    );
  }
}

// 创建全局监控器实例
export const globalAgentMonitor = new AgentMonitor();
