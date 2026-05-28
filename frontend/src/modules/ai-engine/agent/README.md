# Agent 集群架构文档
# Agent Cluster Architecture Documentation

## 概述 (Overview)

本模块实现了基于 **Agent 集群** 的数学建模论文写作辅助系统，将原有的单体 AI 调用架构改造为多个专用 Agent 协同工作的分布式架构。

This module implements an **Agent Cluster** based mathematical modeling paper writing assistance system, transforming the original monolithic AI calling architecture into a distributed architecture where multiple specialized agents work collaboratively.

---

## 架构设计 (Architecture Design)

### 原有架构 (Original Architecture)
```
前端 Step1-5 → 单个 AI Adapter → 不同 Prompts
```

### 新架构 (New Architecture)
```
前端 Step1-5 → Agent Coordinator → 5个专用 Agent
                                      ├─ ProblemAnalyzer (选题分析)
                                      ├─ ModelDesigner (建模设计)
                                      ├─ CodeGenerator (代码生成)
                                      ├─ PaperWriter (论文写作)
                                      └─ Optimizer (结果优化)
```

---

## 核心组件 (Core Components)

### 1. Agent 类型系统 (Agent Type System)
**文件**: `types.ts`

定义了 5 种 Agent 类型和相关数据结构：
- `AgentType`: 枚举类型，定义 5 种专用 Agent
- `AgentConfig`: Agent 配置接口
- `AgentResponse`: Agent 响应接口
- `AgentPerformance`: 性能监控数据结构

### 2. Agent 基类 (Base Agent Class)
**文件**: `base.ts`

所有专用 Agent 的基类，提供：
- 消息历史管理
- 上下文注入
- 工具注册和执行
- 响应处理

### 3. Agent 工厂 (Agent Factory)
**文件**: `factory.ts`

负责创建和配置 Agent 实例：
- `createAgent(type)`: 创建指定类型的 Agent
- `getAgentConfig(type)`: 获取 Agent 配置
- `customizePrompt(type, prompt)`: 自定义提示词
- `updateAgentConfig(type, updates)`: 更新配置

### 4. Agent 协调器 (Agent Coordinator)
**文件**: `coordinator.ts`

管理工作流执行和 Agent 间协作：
- `executeStep(step, input)`: 执行单个步骤
- `executeFullWorkflow(input)`: 执行完整工作流
- `buildContext(step)`: 构建跨步骤上下文
- `getWorkflowStats()`: 获取工作流统计

### 5. 性能监控器 (Performance Monitor)
**文件**: `monitor.ts`

追踪和分析 Agent 执行性能：
- `recordExecution(...)`: 记录执行数据
- `generateReport()`: 生成性能报告
- `exportToJSON()`: 导出 JSON 格式报告
- `getSlowestAgent()`: 获取最慢的 Agent

---

## 5 个专用 Agent (5 Dedicated Agents)

### 1. ProblemAnalyzer (选题分析专家)
**提示词文件**: `prompts/agents/problem-analyzer.ts`

**职责**:
- 识别题目类型（优化/预测/评价/统计/综合）
- 提取关键要素（目标、约束、已知条件、未知量）
- 分析难点和易错点
- 提取关键词（5-8 个）
- 给出初步建模建议

**输出格式**: JSON 结构化数据

### 2. ModelDesigner (建模设计专家)
**提示词文件**: `prompts/agents/model-designer.ts`

**职责**:
- 推荐 2-3 个合适的数学模型
- 生成模型假设（5-8 条）
- 设计符号说明表
- 建立数学模型（方程/公式）
- 设计求解策略

**支持模型库**:
- 优化类：LP, IP, NLP, DP, 遗传算法等
- 预测类：ARIMA, 回归, GM(1,1), LSTM 等
- 评价类：AHP, TOPSIS, 模糊综合评价等
- 统计类：聚类, PCA, 因子分析等

**输出格式**: JSON 结构化数据

### 3. CodeGenerator (代码生成专家)
**提示词文件**: `prompts/agents/code-generator.ts`

**职责**:
- 生成完整的求解代码（Python/MATLAB）
- 包含数据预处理、模型实现、可视化
- 添加详细中文注释
- 提供依赖包列表和使用说明
- 确保代码可直接运行

**代码结构**:
```python
- 导入依赖库
- 配置参数
- 数据预处理
- 模型定义
- 求解过程
- 可视化
```

**输出格式**: JSON 包含代码字符串和元数据

### 4. PaperWriter (论文写作专家)
**提示词文件**: `prompts/agents/paper-writer.ts`

**职责**:
- 撰写符合竞赛规范的论文章节
- 生成 LaTeX 格式的公式和表格
- 提供写作质量评估
- 确保学术化、规范化语言

**章节包括**:
- 摘要（300-500 字）
- 问题重述
- 模型假设
- 符号说明
- 模型建立与求解
- 结果分析
- 模型评价
- 参考文献

**输出格式**: JSON 包含 Markdown 内容和 LaTeX 代码

### 5. Optimizer (结果优化专家)
**提示词文件**: `prompts/agents/optimizer.ts`

**职责**:
- 分析求解结果的合理性
- 进行敏感性分析
- 评估模型优缺点
- 提出改进建议
- 讨论推广价值

**分析方法**:
- 数量级检查
- 极限情况检验
- 对比验证
- 单因素/多因素敏感性分析

**输出格式**: JSON 结构化分析报告

---

## 使用示例 (Usage Examples)

### 示例 1: 执行单个步骤
```typescript
import { AgentCoordinator } from '@/modules/ai-engine/agent';

const coordinator = new AgentCoordinator();

// Step 1: 选题分析
const problemContent = '你的题目内容...';
const response = await coordinator.executeStep(1, problemContent);

console.log('Analysis Result:', response.content);
console.log('Execution Time:', response.metadata.executionTime);
```

### 示例 2: 执行完整工作流
```typescript
const coordinator = new AgentCoordinator();

const results = await coordinator.executeFullWorkflow(problemContent);

console.log('Step 1:', results[1].content);
console.log('Step 2:', results[2].content);
console.log('Step 3:', results[3].content);
console.log('Step 4:', results[4].content);
console.log('Step 5:', results[5].content);

// 获取统计信息
const stats = coordinator.getWorkflowStats();
console.log('Stats:', stats);
```

### 示例 3: 手动创建特定 Agent
```typescript
import { AgentFactory } from '@/modules/ai-engine/agent';

const analyzer = AgentFactory.createAgent('problem-analyzer');
const response = await analyzer.execute(problemContent);

console.log('Result:', response.content);
```

### 示例 4: 性能监控
```typescript
import { globalAgentMonitor } from '@/modules/ai-engine/agent';

// 执行一些步骤后...

const report = globalAgentMonitor.generateReport();
console.log('Total Calls:', report.summary.totalCalls);
console.log('Average Time:', report.summary.overallAverageTime);
console.log('Recommendations:', report.recommendations);

// 导出为 JSON
const jsonReport = globalAgentMonitor.exportToJSON();
```

### 示例 5: 自定义提示词
```typescript
import { AgentFactory } from '@/modules/ai-engine/agent';

const customPrompt = '你的自定义提示词...';
AgentFactory.customizePrompt('problem-analyzer', customPrompt);

const analyzer = AgentFactory.createAgent('problem-analyzer');
const response = await analyzer.execute(problemContent);
```

---

## 文件结构 (File Structure)

```
frontend/src/modules/ai-engine/
├── agent/                          # Agent 集群核心模块
│   ├── types.ts                   # 类型定义
│   ├── base.ts                    # Agent 基类
│   ├── factory.ts                 # Agent 工厂
│   ├── coordinator.ts             # Agent 协调器
│   ├── monitor.ts                 # 性能监控器
│   ├── index.ts                   # 模块导出
│   ├── examples.ts                # 使用示例
│   └── prompts/agents/            # Agent 提示词
│       ├── problem-analyzer.ts
│       ├── model-designer.ts
│       ├── code-generator.ts
│       ├── paper-writer.ts
│       └── optimizer.ts
├── adapters/                      # AI 适配器（现有）
├── components/                    # UI 组件（现有）
├── prompts/                       # 原有提示词（保留向后兼容）
├── store.ts                       # 状态管理
└── types.ts                       # 类型定义
```

---

## 优势 (Advantages)

1. **职责分离 (Separation of Concerns)**
   - 每个 Agent 专注于特定任务，提高专业性
   - 易于维护和调试

2. **可扩展性 (Scalability)**
   - 可轻松添加新的 Agent
   - 可替换现有 Agent 的实现

3. **独立优化 (Independent Optimization)**
   - 可为每个 Agent 单独调优参数
   - 可为不同 Agent 使用不同的 AI 模型

4. **上下文管理 (Context Management)**
   - Coordinator 统一管理跨步骤的上下文
   - 避免信息丢失和不一致

5. **性能监控 (Performance Monitoring)**
   - 追踪每个 Agent 的执行时间
   - 统计 Token 使用量
   - 生成优化建议

6. **向后兼容 (Backward Compatibility)**
   - 保留原有的 prompt 系统
   - 渐进式迁移，不影响现有功能

---

## 下一步计划 (Next Steps)

### Phase 4: 重构前端页面 (Refactor Frontend Pages)
- 更新 `Step1Page.tsx` 使用 `AgentCoordinator`
- 更新 `Step2Page.tsx` - `Step5Page.tsx`
- 添加加载状态和错误处理
- 集成性能监控显示

### Phase 5: 添加配置界面 (Add Configuration Panel)
- 创建 `AgentConfigPanel.tsx`
- 允许用户为每个 Agent 配置参数
- 显示实时性能指标
- 提供提示词编辑器

### Phase 6: 测试和优化 (Test and Optimize)
- 单元测试每个 Agent
- 集成测试完整工作流
- 性能基准测试
- 用户体验优化

---

## 技术栈 (Tech Stack)

- **TypeScript**: 类型安全
- **React**: 前端框架
- **FastMCP**: （可选）MCP 协议支持
- **AI Providers**: OpenAI, DeepSeek, SiliconFlow, Ollama 等

---

## 贡献指南 (Contributing)

1. 新增 Agent 类型时，需要：
   - 在 `types.ts` 中添加类型定义
   - 创建提示词文件
   - 在 `factory.ts` 中注册配置
   - 更新 `coordinator.ts` 的映射关系

2. 修改提示词时：
   - 保持输出格式的一致性
   - 测试不同场景的效果
   - 记录性能变化

3. 优化性能时：
   - 使用 `globalAgentMonitor` 追踪指标
   - 分析瓶颈所在
   - 针对性优化

---

## 许可证 (License)

本项目遵循原仓库的许可证。
