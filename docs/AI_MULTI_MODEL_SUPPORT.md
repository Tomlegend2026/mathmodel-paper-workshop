# AI 多模型支持功能说明

## 📋 功能概述

本项目现已支持多种主流 AI 大模型提供商，用户可以根据自身需求自由选择最适合的 AI 服务。系统采用统一的适配器模式，确保不同提供商之间的无缝切换。

---

## ✨ 核心特性

### 1. 多提供商支持
支持以下 7 种 AI 服务提供商：

| 提供商 | 类型 | 特点 | 适用场景 |
|--------|------|------|----------|
| **DeepSeek** 🔍 | 云端 API | 国内访问稳定，性价比极高 | 数模论文、代码生成 |
| **通义千问** 💬 | 云端 API | 阿里云服务，中文优化好 | 通用场景 |
| **Kimi** 🌙 | 云端 API | 长文本处理能力强 | 文献分析、长篇写作 |
| **智谱 AI** 🧠 | 云端 API | GLM 系列，性能优秀 | 逻辑推理、数学计算 |
| **OpenAI** 🌐 | 云端 API | 全球领先，功能全面 | 需要科学上网 |
| **Ollama** 🤖 | 本地部署 | 完全免费，数据私密 | 对隐私要求高 |
| **WebLLM** 🌐 | 浏览器运行 | 无需服务器，完全免费 | 轻量级使用 |

### 2. 智能推荐配置
系统预置了 4 种推荐配置，帮助用户快速上手：
- ⭐ **DeepSeek（推荐）** - 适合数模论文场景
- 🔵 **通义千问** - 稳定可靠
- 🟢 **智谱 AI** - 性能优秀
- 🔷 **本地部署** - 完全免费

### 3. 动态模型选择
根据选择的提供商，自动显示对应的可用模型列表，每个模型包含：
- 模型名称
- 模型描述
- 是否免费标识

### 4. 连接测试功能
提供「测试连接」按钮，用户可以：
- 验证 API Key 是否正确
- 检查网络连接状态
- 确认 AI 服务可用性

### 5. 一键快速配置
点击推荐配置卡片即可自动填充对应提供商的配置信息，简化设置流程。

---

## 🏗️ 技术架构

### 适配器模式
```
┌─────────────────────────────────────┐
│         AISettingsPanel             │
│      (用户界面 - 设置面板)           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│       createAIAdapter()             │
│      (工厂函数 - 创建适配器)         │
└──────┬──────────┬──────────┬────────┘
       │          │          │
       ▼          ▼          ▼
  ┌────────┐ ┌────────┐ ┌────────┐
  │OpenAI  │ │Ollama  │ │WebLLM  │
  │Adapter │ │Adapter │ │Adapter │
  └────────┘ └────────┘ └────────┘
       ↑          ↑          ↑
       │          │          │
  DeepSeek   本地部署    浏览器运行
  通义千问
  Kimi
  智谱 AI
```

### 核心文件结构

```
frontend/src/modules/ai-engine/
├── config/
│   └── providers.ts          # 提供商配置和模型列表
├── adapters/
│   ├── base.ts               # 基础适配器抽象类
│   ├── openai.ts             # OpenAI 适配器（兼容多家）
│   ├── ollama.ts             # Ollama 适配器
│   ├── webllm.ts             # WebLLM 适配器
│   └── index.ts              # 适配器工厂函数
├── components/
│   ├── AISettingsPanel.tsx   # AI 设置面板组件
│   └── StreamOutput.tsx      # 流式输出组件
├── store.ts                  # Zustand 状态管理
├── types.ts                  # TypeScript 类型定义
└── index.ts                  # 模块导出入口
```

---

## 📝 使用方法

### 1. 打开 AI 设置
在应用右上角或侧边栏找到「AI 设置」入口。

### 2. 选择配置方式

#### 方式一：快速配置（推荐新手）
1. 查看「快速开始」区域的推荐配置卡片
2. 点击任意一个推荐配置（如「DeepSeek（推荐）」）
3. 系统自动填充提供商、API 地址和默认模型
4. 填入你的 API Key
5. 点击「测试连接」验证配置
6. 点击「保存配置」完成设置

#### 方式二：自定义配置
1. 在「选择 AI 服务商」下拉框中选择提供商
2. 根据提示填写 API Key 和 API 地址
3. 在「模型选择」中选择合适的模型
4. 点击「测试连接」验证
5. 点击「保存配置」完成

### 3. 使用 AI 功能
配置完成后，在各个步骤页面（问题分析、模型建立、论文写作等）中：
- 点击「AI 分析」按钮
- 系统会自动使用配置的 AI 服务
- 实时显示 AI 生成的内容

---

## 🔑 获取 API Key

详细指南请查看：[AI_CONFIG_GUIDE.md](./AI_CONFIG_GUIDE.md)

### 快速链接
- **DeepSeek**: https://platform.deepseek.com/
- **通义千问**: https://dashscope.aliyun.com/
- **Kimi**: https://platform.moonshot.cn/
- **智谱 AI**: https://open.bigmodel.cn/
- **OpenAI**: https://platform.openai.com/
- **Ollama**: https://ollama.com/

---

## 💡 最佳实践

### 数模论文场景推荐

**首选方案**：DeepSeek-V3
- ✅ 中文理解能力强
- ✅ 数学推理表现优秀
- ✅ 性价比高（输入 ¥0.2/百万token）
- ✅ 国内访问稳定

**备选方案**：
- 通义千问 Plus - 阿里云服务稳定
- 智谱 GLM-4-Plus - 逻辑推理能力强
- Kimi 128k - 处理大量文献时优势明显

**零预算方案**：
- Ollama + Qwen2.5:7b - 本地运行，完全免费
- WebLLM - 浏览器运行，无需安装

### 成本控制建议

1. **合理使用模型**：
   - 简单任务使用经济型模型（如 gpt-4o-mini、qwen-turbo）
   - 复杂任务使用高性能模型（如 gpt-4o、qwen-max）

2. **监控用量**：
   - 定期查看各平台的用量统计
   - 设置预算提醒

3. **利用免费额度**：
   - 新用户通常有免费额度
   - 可以注册多个平台轮流使用

---

## 🔧 开发说明

### 添加新的 AI 提供商

1. 在 `config/providers.ts` 中添加提供商配置：
```typescript
export const AI_PROVIDERS = {
  // ... 现有提供商
  newprovider: {
    name: '新提供商',
    baseUrl: 'https://api.newprovider.com/v1',
    description: '描述信息',
    requiresApiKey: true,
    requiresBaseUrl: true,
    logo: '🆕',
  },
};
```

2. 添加对应的模型列表：
```typescript
export const MODELS_BY_PROVIDER: Record<string, AIModel[]> = {
  // ... 现有模型
  newprovider: [
    { name: '模型1', value: 'model-1', description: '描述', isFree: false },
  ],
};
```

3. 如果新提供商兼容 OpenAI API 格式，无需额外代码，自动支持。
   如果不兼容，需要在 `adapters/` 目录下创建新的适配器。

4. 更新 `types.ts` 中的 `AIProvider` 类型：
```typescript
export type AIProvider = 'openai' | 'deepseek' | ... | 'newprovider';
```

### 使用 AI 适配器

```typescript
import { useAIStore, createAIAdapter } from '../ai-engine';

const { config } = useAIStore();

// 创建适配器实例
const adapter = createAIAdapter(config);

// 同步调用
const response = await adapter.generate([
  { role: 'user', content: '你好' }
]);

// 流式调用
for await (const chunk of adapter.stream([
  { role: 'user', content: '你好' }
])) {
  console.log(chunk.content);
}
```

---

## ❓ 常见问题

### Q: 为什么有些提供商不需要 API Key？
A: Ollama 和 WebLLM 是本地运行的解决方案，不需要云端 API，因此无需 API Key。

### Q: 可以随时切换提供商吗？
A: 可以！你可以随时在设置中切换不同的提供商，系统会立即使用新的配置。

### Q: API Key 保存在哪里？
A: API Key 保存在浏览器的 localStorage 中，仅在你的设备上存储，不会上传到任何服务器。

### Q: 如何确保 API Key 安全？
A: 
- 不要将 API Key 分享给他人
- 定期更换 API Key
- 使用完毕后可以在对应平台删除旧的 Key

### Q: 测试连接失败怎么办？
A: 请检查：
1. API Key 是否正确（注意不要复制多余空格）
2. API 地址是否正确
3. 账户是否有余额或免费额度
4. 网络连接是否正常
5. 是否需要科学上网（如 OpenAI）

### Q: 哪个模型最适合我的需求？
A: 参考「最佳实践」部分的推荐，或根据以下原则选择：
- 中文场景优先选择国产模型
- 代码生成选择专门的代码模型
- 长文本选择支持大上下文的模型
- 预算有限选择性价比高的模型

---

## 📊 性能对比

| 指标 | DeepSeek | 通义千问 | Kimi | 智谱 AI | OpenAI | Ollama |
|------|----------|----------|------|---------|--------|--------|
| 中文理解 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 数学推理 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 代码能力 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 响应速度 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 价格 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 稳定性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

*注：Ollama 的性能取决于本地硬件配置*

---

## 🚀 未来规划

- [ ] 支持更多开源模型（如 Llama 3.2、Mistral 等）
- [ ] 添加模型性能基准测试工具
- [ ] 支持多模型并行对比
- [ ] 添加用量统计和成本分析
- [ ] 支持自定义 Prompt 模板
- [ ] 添加 AI 回答历史记录

---

## 📞 技术支持

如有问题或建议，欢迎：
- 提交 Issue
- 参与讨论
- 贡献代码

祝你使用愉快！🎉
