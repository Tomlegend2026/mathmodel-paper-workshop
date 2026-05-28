/**
 * Agent 集群模块导出
 * Agent Cluster Module Exports
 */

// Types
export type { 
  AgentType, 
  AgentConfig, 
  AgentTool, 
  AgentMessage, 
  AgentResponse,
  AgentPerformance 
} from './types';

// Base classes
export { DedicatedAgent } from './base';

// Factory
export { AgentFactory } from './factory';

// Coordinator
export { AgentCoordinator } from './coordinator';

// Monitor
export { AgentMonitor, globalAgentMonitor } from './monitor';

// Prompts (for customization)
export { PROBLEM_ANALYZER_PROMPT } from '../prompts/agents/problem-analyzer';
export { MODEL_DESIGNER_PROMPT } from '../prompts/agents/model-designer';
export { CODE_GENERATOR_PROMPT } from '../prompts/agents/code-generator';
export { PAPER_WRITER_PROMPT } from '../prompts/agents/paper-writer';
export { OPTIMIZER_PROMPT } from '../prompts/agents/optimizer';
