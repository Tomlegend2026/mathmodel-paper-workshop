# AI 模型配置指南

本文档将帮助你获取各个 AI 平台的 API Key，并正确配置系统。

## 🚀 快速开始（推荐）

### DeepSeek（强烈推荐）
- **优点**：国内访问稳定、性价比极高、性能优秀
- **适用场景**：数模论文、代码生成、逻辑推理
- **注册链接**：https://platform.deepseek.com/
- **API Key 获取**：
  1. 访问 https://platform.deepseek.com/
  2. 注册/登录账号
  3. 进入「API Keys」页面
  4. 点击「创建 API Key」
  5. 复制生成的 API Key

- **推荐模型**：`deepseek-chat`（DeepSeek-V3）
- **价格**：输入 ¥0.2/百万token，输出 ¥0.8/百万token

---

## 📋 各平台详细配置

### 1. DeepSeek 🔍
**官网**：https://platform.deepseek.com/

**配置信息**：
- API 地址：`https://api.deepseek.com/v1`
- 支持模型：
  - `deepseek-chat` - DeepSeek-V3（推荐）
  - `deepseek-coder` - 代码专用
  - `deepseek-reasoner` - 推理模型

**获取步骤**：
1. 注册账号并完成实名认证
2. 充值少量金额（新用户可能有赠送）
3. 在控制台创建 API Key
4. 在系统中选择「DeepSeek」提供商，填入 API Key

---

### 2. 通义千问 💬
**官网**：https://dashscope.aliyun.com/

**配置信息**：
- API 地址：`https://dashscope.aliyuncs.com/compatible-mode/v1`
- 支持模型：
  - `qwen-max` - 最强性能
  - `qwen-plus` - 平衡性能与成本（推荐）
  - `qwen-turbo` - 快速响应

**获取步骤**：
1. 使用阿里云账号登录 DashScope 控制台
2. 开通 DashScope 服务
3. 在「API-KEY管理」中创建 API Key
4. 在系统中选择「通义千问」提供商，填入 API Key

**价格**：新用户有免费额度，后续按量付费

---

### 3. Kimi 🌙
**官网**：https://platform.moonshot.cn/

**配置信息**：
- API 地址：`https://api.moonshot.cn/v1`
- 支持模型：
  - `moonshot-v1-8k` - 8k 上下文
  - `moonshot-v1-32k` - 32k 上下文
  - `moonshot-v1-128k` - 128k 长文本（推荐）

**获取步骤**：
1. 访问月之暗面开放平台
2. 注册/登录账号
3. 在控制台创建 API Key
4. 在系统中选择「Kimi」提供商，填入 API Key

**特点**：长文本处理能力极强，适合处理大量文献

---

### 4. 智谱 AI 🧠
**官网**：https://open.bigmodel.cn/

**配置信息**：
- API 地址：`https://open.bigmodel.cn/api/paas/v4`
- 支持模型：
  - `glm-4` - 最强性能
  - `glm-4-plus` - 增强版本（推荐）
  - `glm-4-air` - 轻量快速
  - `glm-4-flash` - 极速响应

**获取步骤**：
1. 注册智谱 AI 开放平台账号
2. 完成实名认证
3. 在控制台创建 API Key
4. 在系统中选择「智谱 AI」提供商，填入 API Key

**价格**：新用户有免费额度

---

### 5. OpenAI 🌐
**官网**：https://platform.openai.com/

**配置信息**：
- API 地址：`https://api.openai.com/v1`
- 支持模型：
  - `gpt-4o` - 最强性能
  - `gpt-4o-mini` - 性价比高（推荐）
  - `gpt-3.5-turbo` - 经济实惠

**获取步骤**：
1. 注册 OpenAI 账号（需要海外手机号验证）
2. 绑定信用卡或借记卡
3. 在 API Keys 页面创建密钥
4. 在系统中选择「OpenAI」提供商，填入 API Key

**注意**：需要科学上网才能访问

---

### 6. Ollama（本地部署）🤖
**官网**：https://ollama.com/

**配置信息**：
- API 地址：`http://localhost:11434`（默认）
- 无需 API Key
- 完全免费，数据本地处理

**安装步骤**：
1. 下载并安装 Ollama：https://ollama.com/download
2. 打开终端，运行以下命令下载模型：
   ```bash
   # 推荐模型
   ollama pull qwen2.5:7b
   
   # 其他可选模型
   ollama pull llama3.1
   ollama pull deepseek-r1:14b
   ```
3. 启动 Ollama 服务（安装后自动运行）
4. 在系统中选择「Ollama」提供商，选择已下载的模型

**系统要求**：
- Windows/macOS/Linux
- 至少 8GB RAM（推荐 16GB+）
- 建议有独立显卡

---

### 7. WebLLM（浏览器运行）🌐
**特点**：
- 完全在浏览器中运行
- 无需服务器，无需 API Key
- 完全免费
- 数据完全本地化

**使用方法**：
1. 在系统中选择「WebLLM」提供商
2. 选择一个模型
3. 首次使用时会下载模型文件（较大，需等待）
4. 之后可直接使用

**注意**：对浏览器性能要求较高，建议使用 Chrome/Edge 最新版

---

## 💡 配置建议

### 数模论文场景推荐

| 优先级 | 提供商 | 模型 | 理由 |
|--------|--------|------|------|
| ⭐⭐⭐⭐⭐ | DeepSeek | deepseek-chat | 性价比高，中文理解好，推理能力强 |
| ⭐⭐⭐⭐ | 通义千问 | qwen-plus | 阿里云服务稳定，中文优化好 |
| ⭐⭐⭐⭐ | 智谱 AI | glm-4-plus | GLM 系列性能优秀 |
| ⭐⭐⭐ | Kimi | moonshot-v1-128k | 长文本处理能力强，适合大量文献 |
| ⭐⭐ | Ollama | qwen2.5:7b | 完全免费，数据私密，但需要本地硬件 |

### 预算考虑

- **零预算**：使用 Ollama 或 WebLLM（完全免费）
- **低预算**（¥10-50/月）：DeepSeek、通义千问、智谱 AI
- **中等预算**（$10-50/月）：OpenAI GPT-4o Mini
- **高预算**（$50+/月）：OpenAI GPT-4o

---

## 🔧 测试连接

配置完成后，点击「测试连接」按钮验证配置是否正确：

✅ **成功**：显示绿色提示「AI 服务连接正常」
❌ **失败**：检查以下内容
- API Key 是否正确
- API 地址是否正确
- 网络连接是否正常
- 账户是否有余额/额度

---

## ❓ 常见问题

### Q: API Key 安全吗？
A: API Key 仅保存在浏览器本地存储中，不会上传到我们的服务器。建议定期更换 API Key。

### Q: 可以切换不同的 AI 提供商吗？
A: 可以！你可以随时在设置中切换不同的提供商和模型。

### Q: 哪个模型最适合数模论文？
A: 推荐使用 DeepSeek-V3 或通义千问 Plus，它们在中文理解、逻辑推理和数学计算方面表现优秀。

### Q: 为什么连接测试失败？
A: 请检查：
1. API Key 是否正确复制（不要有多余空格）
2. API 地址是否正确
3. 账户是否有余额或免费额度
4. 网络连接是否正常

### Q: Ollama 下载模型很慢怎么办？
A: 可以使用国内镜像源，或者选择较小的模型（如 7B 参数量的模型）。

---

## 📞 需要帮助？

如果遇到问题，可以：
1. 查看各平台的官方文档
2. 在项目的 Issues 中提问
3. 联系技术支持

祝你使用愉快！🎉
