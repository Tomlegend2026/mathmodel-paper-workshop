// 引导提示配置
// 用于在各个页面添加悬浮提示，帮助用户理解功能

export interface GuideTip {
  id: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';
}

// AI 设置相关提示
export const aiGuideTips: Record<string, GuideTip> = {
  providerSelect: {
    id: 'ai-provider-select',
    title: '选择 AI 提供商',
    content: '选择一个适合您的 AI 模型提供商。DeepSeek 性价比高，通义千问访问稳定，Ollama 完全免费但需要本地运行。',
    placement: 'bottom',
  },
  apiKeyInput: {
    id: 'ai-api-key',
    title: 'API Key',
    content: '输入您的 API Key。对于 Ollama 和 WebLLM 不需要填写。您可以在对应平台的官网获取 API Key。',
    placement: 'bottom',
  },
  modelSelect: {
    id: 'ai-model-select',
    title: '选择模型',
    content: '不同模型有不同的特点。deepseek-chat 适合通用任务，deepseek-reasoner 适合复杂推理，deepseek-coder 适合代码生成。',
    placement: 'bottom',
  },
  testConnection: {
    id: 'ai-test-connection',
    title: '测试连接',
    content: '点击此按钮测试与 AI 服务的连接是否正常。如果连接成功，您就可以开始使用 AI 功能了。',
    placement: 'top',
  },
};

// 步骤1：选题解读相关提示
export const step1GuideTips: Record<string, GuideTip> = {
  problemTitle: {
    id: 'step1-problem-title',
    title: '题目名称',
    content: '输入数模竞赛的题目名称，例如："2024年高教社杯全国大学生数学建模竞赛A题"。',
    placement: 'bottom',
  },
  problemContent: {
    id: 'step1-problem-content',
    title: '题目内容',
    content: '粘贴完整的题目描述。AI 将帮助您分析题目的核心要求和关键信息。',
    placement: 'bottom',
  },
  aiAnalyze: {
    id: 'step1-ai-analyze',
    title: 'AI 分析题目',
    content: 'AI 会自动分析题目的背景、要求、数据类型等信息，帮助您快速理解题目。',
    placement: 'top',
  },
  extractKeywords: {
    id: 'step1-extract-keywords',
    title: '提取关键词',
    content: '从题目中提取关键术语和概念，这些关键词将在后续建模中作为重要参考。',
    placement: 'top',
  },
};

// 步骤2：问题分析相关提示
export const step2GuideTips: Record<string, GuideTip> = {
  objectives: {
    id: 'step2-objectives',
    title: '目标分析',
    content: '明确问题要优化的目标，例如：最小化成本、最大化效率等。可以添加多个目标。',
    placement: 'bottom',
  },
  constraints: {
    id: 'step2-constraints',
    title: '约束条件',
    content: '列出问题的限制条件，例如：资源限制、时间限制、物理限制等。',
    placement: 'bottom',
  },
  assumptions: {
    id: 'step2-assumptions',
    title: '假设条件',
    content: '为了简化问题，需要做出合理的假设。好的假设应该既简化问题又保持真实性。',
    placement: 'bottom',
  },
  aiAnalysis: {
    id: 'step2-ai-analysis',
    title: 'AI 辅助分析',
    content: 'AI 可以帮助您识别目标和约束条件，提供分析建议。',
    placement: 'top',
  },
};

// 步骤3：建模求解相关提示
export const step3GuideTips: Record<string, GuideTip> = {
  modelType: {
    id: 'step3-model-type',
    title: '选择模型类型',
    content: '根据问题特点选择合适的数学模型。线性规划适合优化问题，机器学习适合预测问题，图论适合网络问题等。',
    placement: 'bottom',
  },
  modelDescription: {
    id: 'step3-model-description',
    title: '模型描述',
    content: '详细描述您的建模思路，包括变量定义、关系建立、求解方法等。',
    placement: 'bottom',
  },
  recommendModel: {
    id: 'step3-recommend-model',
    title: 'AI 推荐模型',
    content: 'AI 会根据题目内容为您推荐合适的模型类型，并提供推荐理由。',
    placement: 'top',
  },
  generateEquation: {
    id: 'step3-generate-equation',
    title: 'AI 生成方程',
    content: 'AI 可以根据您选择的模型类型自动生成数学方程和公式。',
    placement: 'top',
  },
  generateCode: {
    id: 'step3-generate-code',
    title: 'AI 生成代码',
    content: 'AI 可以生成 Python 代码实现您的模型，您可以直接运行或修改。',
    placement: 'top',
  },
};

// 步骤4：论文写作相关提示
export const step4GuideTips: Record<string, GuideTip> = {
  abstract: {
    id: 'step4-abstract',
    title: '摘要',
    content: '摘要是论文的精华，应包含问题背景、解决方法、主要结果和结论。AI 可以帮您生成初稿。',
    placement: 'bottom',
  },
  introduction: {
    id: 'step4-introduction',
    title: '引言',
    content: '引言部分介绍问题背景、研究意义和论文结构。',
    placement: 'bottom',
  },
  conclusion: {
    id: 'step4-conclusion',
    title: '结论',
    content: '总结研究成果、创新点和不足之处。',
    placement: 'bottom',
  },
  references: {
    id: 'step4-references',
    title: '参考文献',
    content: '列出引用的文献资料。AI 可以为您推荐相关参考文献。',
    placement: 'bottom',
  },
};

// 步骤5：结果优化相关提示
export const step5GuideTips: Record<string, GuideTip> = {
  results: {
    id: 'step5-results',
    title: '结果分析',
    content: '总结模型的求解结果，用数据和图表展示效果。',
    placement: 'bottom',
  },
  sensitivity: {
    id: 'step5-sensitivity',
    title: '敏感性分析',
    content: '分析模型对参数变化的敏感程度，验证模型的稳定性。',
    placement: 'bottom',
  },
  improvements: {
    id: 'step5-improvements',
    title: '改进方向',
    content: '指出模型的不足和改进空间，体现批判性思维。',
    placement: 'bottom',
  },
  downloadPaper: {
    id: 'step5-download-paper',
    title: '下载论文',
    content: '将所有内容整合成 Markdown 格式的论文文件，可以进一步编辑或转换为 PDF。',
    placement: 'top',
  },
  completeProject: {
    id: 'step5-complete-project',
    title: '完成项目',
    content: '恭喜！完成所有步骤后，您的数模论文就准备好了。',
    placement: 'top',
  },
};

// 新手首次访问提示
export const onboardingTips = [
  {
    step: 1,
    title: '欢迎使用数模论文工坊',
    content: '这是一个帮助您完成数学建模论文的智能平台。我们将从选题到写作全程指导您。',
  },
  {
    step: 2,
    title: '五步完成论文',
    content: '我们的流程分为5个步骤：选题解读 → 问题分析 → 建模求解 → 论文写作 → 结果优化。',
  },
  {
    step: 3,
    title: 'AI 智能助手',
    content: '点击右上角的用户菜单，进入"AI 设置"配置 AI 模型。配置完成后，AI 将在各个步骤为您提供帮助。',
  },
  {
    step: 4,
    title: '开始您的第一个项目',
    content: '点击"新建项目"按钮，输入项目名称，就可以开始您的数模之旅了！',
  },
];
