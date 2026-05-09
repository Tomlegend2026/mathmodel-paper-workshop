export const paperOutlinePrompt = (problemContent: string): string => {
  return `
请为以下数学建模问题设计论文大纲：

问题描述：
${problemContent}

要求按照全国大学生数学建模竞赛论文格式输出大纲，包含以下部分：
1. 摘要
2. 问题重述
3. 模型假设
4. 符号说明
5. 模型建立与求解
6. 模型检验与分析
7. 模型优缺点
8. 参考文献

请给出详细的大纲结构。
`;
};

export const abstractWritingPrompt = (problemContent: string, modelType: string): string => {
  return `
请为以下数学建模问题撰写摘要：

问题描述：
${problemContent}
模型类型：${modelType}

要求：
1. 简要描述问题背景
2. 说明使用的模型和方法
3. 给出主要结论和结果
4. 控制在300字左右

请用中文撰写。
`;
};

export const introductionPrompt = (problemContent: string): string => {
  return `
请为以下数学建模问题撰写引言：

问题描述：
${problemContent}

要求：
1. 介绍问题的背景和意义
2. 综述相关研究现状
3. 说明本文的研究方法和结构

请用中文撰写，约500字。
`;
};

export const conclusionPrompt = (problemContent: string, results: string): string => {
  return `
请为以下数学建模问题撰写结论：

问题描述：
${problemContent}
主要结果：
${results}

要求：
1. 总结主要工作
2. 给出结论
3. 提出模型的改进方向

请用中文撰写，约300字。
`;
};

export const referencePrompt = (topic: string): string => {
  return `
请为以下主题推荐参考文献：

主题：${topic}

要求：
1. 推荐5-8篇相关参考文献
2. 按照GB/T 7714格式输出
3. 包含经典文献和近年研究

请直接输出参考文献列表。
`;
};