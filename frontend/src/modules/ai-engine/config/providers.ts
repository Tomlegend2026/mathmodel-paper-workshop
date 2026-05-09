import type { AIModel } from '../types';

// 主流 AI 模型提供商配置
export const AI_PROVIDERS = {
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    description: '全球领先的 AI 模型，支持 GPT-4、GPT-4o 等',
    requiresApiKey: true,
    requiresBaseUrl: true,
    logo: '🌐',
  },
  deepseek: {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    description: '国内领先的 AI 模型，支持深度推理，性价比极高',
    requiresApiKey: true,
    requiresBaseUrl: true,
    logo: '🔍',
  },
  tongyi: {
    name: '通义千问',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    description: '阿里云推出，国内访问稳定，支持多种场景',
    requiresApiKey: true,
    requiresBaseUrl: true,
    logo: '💬',
  },
  kimi: {
    name: 'Kimi',
    baseUrl: 'https://api.moonshot.cn/v1',
    description: '月之暗面出品，长文本处理能力强',
    requiresApiKey: true,
    requiresBaseUrl: true,
    logo: '🌙',
  },
  glm: {
    name: '智谱 AI',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    description: '智谱华章推出，GLM 系列模型，性能优秀',
    requiresApiKey: true,
    requiresBaseUrl: true,
    logo: '🧠',
  },
  ollama: {
    name: 'Ollama',
    baseUrl: 'http://localhost:11434',
    description: '本地部署大模型，无需 API Key，数据私密',
    requiresApiKey: false,
    requiresBaseUrl: true,
    logo: '️',
  },
  webllm: {
    name: 'WebLLM',
    baseUrl: '',
    description: '浏览器端运行，完全免费，无需服务器',
    requiresApiKey: false,
    requiresBaseUrl: false,
    logo: '🌐',
  },
};

// 各提供商的模型列表
export const MODELS_BY_PROVIDER: Record<string, AIModel[]> = {
  openai: [
    { name: 'GPT-4o', value: 'gpt-4o', description: '最强性能，多模态支持', isFree: false },
    { name: 'GPT-4o Mini', value: 'gpt-4o-mini', description: '性价比高，速度快', isFree: false },
    { name: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo', description: '经济实惠，日常使用', isFree: false },
  ],
  deepseek: [
    { name: 'DeepSeek-V3', value: 'deepseek-chat', description: '最新模型，性能卓越', isFree: false },
    { name: 'DeepSeek-Coder', value: 'deepseek-coder', description: '代码专用，编程助手', isFree: false },
    { name: 'DeepSeek-R1', value: 'deepseek-reasoner', description: '推理模型，逻辑分析', isFree: false },
  ],
  tongyi: [
    { name: 'Qwen-Max', value: 'qwen-max', description: '最强性能，复杂任务', isFree: false },
    { name: 'Qwen-Plus', value: 'qwen-plus', description: '平衡性能与成本', isFree: false },
    { name: 'Qwen-Turbo', value: 'qwen-turbo', description: '快速响应，性价比高', isFree: false },
  ],
  kimi: [
    { name: 'Moonshot-V1-8k', value: 'moonshot-v1-8k', description: '8k 上下文', isFree: false },
    { name: 'Moonshot-V1-32k', value: 'moonshot-v1-32k', description: '32k 上下文', isFree: false },
    { name: 'Moonshot-V1-128k', value: 'moonshot-v1-128k', description: '128k 长文本', isFree: false },
  ],
  glm: [
    { name: 'GLM-4', value: 'glm-4', description: '最强性能', isFree: false },
    { name: 'GLM-4-Plus', value: 'glm-4-plus', description: '增强版本', isFree: false },
    { name: 'GLM-4-Air', value: 'glm-4-air', description: '轻量快速', isFree: false },
    { name: 'GLM-4-Flash', value: 'glm-4-flash', description: '极速响应', isFree: false },
  ],
  ollama: [
    { name: 'Llama 3.1 8B', value: 'llama3.1', description: 'Meta 开源，轻量高效', isFree: true },
    { name: 'Llama 3.1 70B', value: 'llama3.1:70b', description: 'Meta 开源，性能更强', isFree: true },
    { name: 'Qwen 2.5 7B', value: 'qwen2.5:7b', description: '阿里开源，中文友好', isFree: true },
    { name: 'DeepSeek-R1', value: 'deepseek-r1:14b', description: '推理模型，逻辑分析', isFree: true },
    { name: 'Mistral 7B', value: 'mistral', description: '欧洲开源，性能优秀', isFree: true },
  ],
  webllm: [
    { name: 'Qwen 2.5 7B', value: 'Qwen2.5-7B-Instruct-q4f16_1-MLC', description: '浏览器运行，中文优化', isFree: true },
    { name: 'Llama 3.1 8B', value: 'Llama-3.1-8B-Instruct-q4f16_1-MLC', description: '浏览器运行，轻量高效', isFree: true },
    { name: 'Phi-3.5 Mini', value: 'Phi-3.5-mini-instruct-q4f16_1-MLC', description: '微软出品，小巧精悍', isFree: true },
  ],
};

// 推荐配置（适合数模论文场景）
export const RECOMMENDED_CONFIGS = [
  {
    name: 'DeepSeek（推荐）',
    provider: 'deepseek' as const,
    model: 'deepseek-chat',
    description: '国内访问稳定，性价比极高，适合数模论文',
    tag: '推荐',
    tagColor: 'gold',
  },
  {
    name: '通义千问',
    provider: 'tongyi' as const,
    model: 'qwen-plus',
    description: '阿里云服务，访问稳定',
    tag: '稳定',
    tagColor: 'blue',
  },
  {
    name: '智谱 AI',
    provider: 'glm' as const,
    model: 'glm-4-plus',
    description: 'GLM 系列，性能优秀',
    tag: '性能',
    tagColor: 'green',
  },
  {
    name: '本地部署',
    provider: 'ollama' as const,
    model: 'qwen2.5:7b',
    description: '完全免费，数据私密',
    tag: '免费',
    tagColor: 'cyan',
  },
];
