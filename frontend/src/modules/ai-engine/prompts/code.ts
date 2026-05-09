export const codeGenerationPrompt = (problemContent: string, modelType: string): string => {
  return `
请为以下数学建模问题生成Python求解代码：

问题描述：
${problemContent}
模型类型：${modelType}

要求：
1. 使用Python语言
2. 使用合适的库（如numpy, scipy, pandas, matplotlib等）
3. 代码结构清晰，有注释
4. 包含数据输入、模型求解、结果输出和可视化

请直接输出完整的代码。
`;
};

export const visualizationPrompt = (dataDescription: string): string => {
  return `
请为以下数据生成可视化代码：

数据描述：
${dataDescription}

要求：
1. 使用Python和matplotlib/seaborn
2. 生成合适的图表类型（折线图、柱状图、散点图等）
3. 代码完整可运行

请直接输出代码。
`;
};

export const dataProcessingPrompt = (dataDescription: string): string => {
  return `
请为以下数据处理需求生成Python代码：

数据描述：
${dataDescription}

要求：
1. 使用pandas进行数据处理
2. 包含数据清洗、缺失值处理、特征工程
3. 代码清晰有注释

请直接输出代码。
`;
};