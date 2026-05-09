export const problemAnalysisPrompt = (problemContent: string): string => {
  return `
请分析以下数学建模竞赛题目，并给出详细的解读：

题目内容：
${problemContent}

请从以下几个方面进行分析：
1. **问题背景**：简要描述题目所涉及的领域和实际背景
2. **核心问题**：明确题目要求解决的核心问题是什么
3. **关键数据**：识别题目中给出的关键数据和约束条件
4. **可能的建模方向**：给出几种可能的数学建模方法或思路
5. **难点分析**：分析解决该问题可能遇到的难点

请用中文回答，语言简洁明了。
`;
};

export const keywordExtractionPrompt = (problemContent: string): string => {
  return `
请从以下数学建模题目中提取关键词：

题目内容：
${problemContent}

请列出5-10个最关键的关键词，用逗号分隔。
`;
};

export const objectiveAnalysisPrompt = (problemContent: string): string => {
  return `
请分析以下数学建模题目的目标和约束：

题目内容：
${problemContent}

请分别列出：
1. **目标函数**：题目要求优化或达到的目标
2. **约束条件**：题目中给出的限制条件
3. **假设条件**：为解决问题可能需要做出的合理假设

请用中文回答，条理清晰。
`;
};