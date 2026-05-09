export const modelRecommendationPrompt = (problemContent: string): string => {
  return `
请为以下数学建模问题推荐合适的数学模型：

问题描述：
${problemContent}

请从以下方面给出建议：
1. **推荐模型**：推荐2-3种适合该问题的数学模型
2. **模型选择理由**：说明为什么这些模型适合该问题
3. **模型对比**：对比不同模型的优缺点
4. **实现思路**：简要说明如何实现这些模型

请用中文回答，专业但易懂。
`;
};

export const modelEquationPrompt = (problemContent: string, modelType: string): string => {
  return `
请为以下问题设计${modelType}模型的数学方程：

问题描述：
${problemContent}

请输出：
1. **符号定义**：定义所有使用的符号
2. **目标函数**：写出目标函数表达式
3. **约束条件**：列出所有约束条件
4. **数学推导**：简要的推导过程

请用LaTeX格式书写数学公式。
`;
};

export const algorithmSelectionPrompt = (problemContent: string, modelType: string): string => {
  return `
请为以下问题选择合适的求解算法：

问题描述：
${problemContent}
模型类型：${modelType}

请给出：
1. **推荐算法**：推荐适合的求解算法
2. **算法原理**：简要说明算法原理
3. **复杂度分析**：算法的时间复杂度和空间复杂度
4. **实现步骤**：算法的实现步骤

请用中文回答。
`;
};