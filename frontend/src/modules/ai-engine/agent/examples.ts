/**
 * Agent 集群使用示例
 * Agent Cluster Usage Examples
 */

import { AgentCoordinator, AgentFactory, globalAgentMonitor } from './index';

/**
 * 示例 1: 使用 Coordinator 执行单个步骤
 */
export async function example1_SingleStep() {
  const coordinator = new AgentCoordinator();
  
  // Step 1: 选题分析
  const problemContent = `
    题目：某城市交通流量优化问题
    
    随着城市化进程加快，交通拥堵成为制约城市发展的重要因素。
    请建立数学模型，优化该城市的交通信号灯配时方案，使得：
    1. 主要道路的通行效率最高
    2. 平均等待时间最短
    3. 碳排放量最小
    
    已知数据：
    - 道路网络拓扑结构
    - 各时段车流量统计
    - 现有信号灯配时方案
  `;
  
  try {
    const response = await coordinator.executeStep(1, problemContent);
    console.log('Step 1 Result:', response.content);
    console.log('Execution Time:', response.metadata.executionTime, 'ms');
  } catch (error) {
    console.error('Step 1 failed:', error);
  }
}

/**
 * 示例 2: 执行完整工作流
 */
export async function example2_FullWorkflow() {
  const coordinator = new AgentCoordinator();
  
  const problemContent = `
    题目：全国大学生数学建模竞赛 2024年 A题
    
    [完整的题目内容...]
  `;
  
  try {
    console.log('Starting full workflow...');
    const results = await coordinator.executeFullWorkflow(problemContent);
    
    console.log('Workflow completed!');
    console.log('Step 1 (Problem Analysis):', results[1].content.substring(0, 200));
    console.log('Step 2 (Model Design):', results[2].content.substring(0, 200));
    console.log('Step 3 (Code Generation):', results[3].content.substring(0, 200));
    console.log('Step 4 (Paper Writing):', results[4].content.substring(0, 200));
    console.log('Step 5 (Optimization):', results[5].content.substring(0, 200));
    
    // 获取工作流统计
    const stats = coordinator.getWorkflowStats();
    console.log('Workflow Stats:', stats);
    
    // 导出性能报告
    const report = globalAgentMonitor.generateReport();
    console.log('Performance Report:', report);
  } catch (error) {
    console.error('Workflow failed:', error);
  }
}

/**
 * 示例 3: 手动创建和使用特定 Agent
 */
export async function example3_CustomAgent() {
  // 创建问题分析师 Agent
  const analyzer = AgentFactory.createAgent('problem-analyzer');
  
  const problemContent = '你的题目内容...';
  
  try {
    const response = await analyzer.execute(problemContent);
    console.log('Analysis Result:', response.content);
    
    // 记录性能数据
    globalAgentMonitor.recordExecution(
      'problem-analyzer',
      response.metadata.executionTime || 0
    );
  } catch (error) {
    console.error('Analysis failed:', error);
    globalAgentMonitor.recordExecution(
      'problem-analyzer',
      0,
      undefined,
      false
    );
  }
}

/**
 * 示例 4: 自定义 Agent 提示词
 */
export async function example4_CustomizePrompt() {
  const customPrompt = `
    你是一个简化的问题分析助手。
    请用简洁的语言分析以下数学建模题目。
    输出格式：
    1. 问题类型
    2. 关键要素
    3. 建议方法
  `;
  
  // 自定义提示词
  AgentFactory.customizePrompt('problem-analyzer', customPrompt);
  
  const analyzer = AgentFactory.createAgent('problem-analyzer');
  const response = await analyzer.execute('题目内容...');
  
  console.log('Custom Prompt Result:', response.content);
}

/**
 * 示例 5: 监控和性能分析
 */
export async function example5_Monitoring() {
  const coordinator = new AgentCoordinator();
  
  // 执行一些步骤...
  await coordinator.executeStep(1, '题目1');
  await coordinator.executeStep(2, '基于分析设计模型');
  
  // 获取性能报告
  const report = globalAgentMonitor.generateReport();
  console.log('=== Performance Report ===');
  console.log('Total Calls:', report.summary.totalCalls);
  console.log('Total Tokens:', report.summary.totalTokens);
  console.log('Average Time:', report.summary.overallAverageTime, 'ms');
  console.log('Total Errors:', report.summary.totalErrors);
  console.log('\nRecommendations:');
  report.recommendations.forEach(rec => console.log('-', rec));
  
  // 导出为 JSON
  const jsonReport = globalAgentMonitor.exportToJSON();
  console.log('\nJSON Report:', jsonReport);
}

/**
 * 示例 6: 在 React 组件中使用
 */
export function example6_ReactComponent() {
  // 这是一个伪代码示例，展示如何在 React 组件中使用
  
  /*
  import { useState } from 'react';
  import { AgentCoordinator } from '@/modules/ai-engine/agent';
  
  function Step1Page() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const coordinator = new AgentCoordinator();
    
    const handleAnalyze = async (problemContent: string) => {
      setLoading(true);
      try {
        const response = await coordinator.executeStep(1, problemContent);
        setResult(response.content);
      } catch (error) {
        console.error('Analysis failed:', error);
      } finally {
        setLoading(false);
      }
    };
    
    return (
      <div>
        <button onClick={() => handleAnalyze('题目内容')} disabled={loading}>
          {loading ? '分析中...' : '开始分析'}
        </button>
        {result && <div>{result}</div>}
      </div>
    );
  }
  */
}

// 导出所有示例
export const examples = {
  singleStep: example1_SingleStep,
  fullWorkflow: example2_FullWorkflow,
  customAgent: example3_CustomAgent,
  customizePrompt: example4_CustomizePrompt,
  monitoring: example5_Monitoring,
  reactComponent: example6_ReactComponent
};
