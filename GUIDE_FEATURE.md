# 数模论文工坊 - 引导功能说明

## 概述

我们为网站添加了全面的悬浮提示（Tooltip）引导系统，帮助用户更好地理解和使用各个功能。

## 实现的功能

### 1. 新手引导
- **首次访问提示**：用户首次访问时会看到欢迎信息
- **流程介绍**：展示5个步骤的完整流程
- **AI配置引导**：指导用户如何配置AI模型
- **项目创建引导**：指导用户开始第一个项目

### 2. 流程引导（按步骤）

#### 步骤1：选题解读
- 题目名称输入框提示
- 题目内容输入框提示
- AI分析题目按钮提示
- 提取关键词按钮提示

#### 步骤2：问题分析
- 目标分析区域提示
- 约束条件区域提示
- 假设条件区域提示
- AI辅助分析按钮提示

#### 步骤3：建模求解
- 模型类型选择提示
- 模型描述输入提示
- AI推荐模型按钮提示
- AI生成方程按钮提示
- AI生成代码按钮提示

#### 步骤4：论文写作
- 摘要生成提示
- 引言生成提示
- 结论生成提示
- 参考文献推荐提示

#### 步骤5：结果优化
- 结果分析输入提示
- 敏感性分析输入提示
- 改进方向添加提示
- 下载论文按钮提示
- 完成项目按钮提示

### 3. AI功能引导
- AI提供商选择提示
- API Key输入提示
- 模型选择提示
- 测试连接按钮提示

## 技术实现

### 核心文件

1. **引导配置** (`frontend/src/modules/guide/config.ts`)
   - 定义所有引导提示的内容
   - 包含标题、内容和显示位置

2. **工具函数** (`frontend/src/modules/guide/utils.tsx`)
   - `withGuideTip()`: 包装组件添加提示
   - `hasSeenTip()`: 检查用户是否已看过提示
   - `markTipAsSeen()`: 标记提示已查看
   - `resetAllTips()`: 重置所有提示（用于测试）
   - `shouldShowOnboarding()`: 检查是否显示新手引导
   - `markOnboardingComplete()`: 标记新手引导完成

3. **模块导出** (`frontend/src/modules/guide/index.ts`)
   - 统一导出所有引导相关功能

### 工作原理

1. **智能显示**：每个提示只在用户第一次交互时显示
2. **自动标记**：当用户聚焦或悬停在元素上时，自动标记为"已查看"
3. **本地存储**：使用 localStorage 保存用户的查看状态
4. **非侵入式**：提示以悬浮框形式出现，不影响正常使用

### 使用方法

在任何组件中添加引导提示：

```tsx
import { withGuideTip, hasSeenTip, markTipAsSeen } from '../../guide';
import { step1GuideTips } from '../../guide';

// 在 JSX 中使用
{withGuideTip(
  <Button onClick={handleClick}>点击我</Button>,
  step1GuideTips.someTip,
  !hasSeenTip(step1GuideTips.someTip.id)
)}
```

## 用户体验

### 提示触发方式
- **输入框**：获得焦点时显示提示
- **按钮**：鼠标悬停时显示提示
- **下拉框**：获得焦点时显示提示

### 提示样式
- 深色背景 (#2d2d44)
- 最大宽度 300px
- 包含标题和详细说明
- 根据元素位置自动调整显示方向

### 记忆功能
- 用户查看过的提示不会再次显示
- 可以通过清除浏览器数据重置
- 或在控制台运行 `localStorage.removeItem('seenGuideTips')`

## 测试方法

### 查看所有提示
在浏览器控制台运行：
```javascript
localStorage.removeItem('seenGuideTips');
location.reload();
```

### 查看特定提示
```javascript
// 例如查看步骤1的所有提示
const seenTips = JSON.parse(localStorage.getItem('seenGuideTips') || '[]');
console.log(seenTips);
```

## 未来扩展

可以添加的功能：
1. **分步教程模式**：类似产品导览，一步步引导用户
2. **视频教程**：嵌入视频演示
3. **交互式示例**：让用户实际操作一遍
4. **快捷键提示**：显示可用的键盘快捷键
5. **上下文帮助**：根据用户行为动态显示相关提示

## 注意事项

1. 提示内容应该简洁明了
2. 避免过多提示造成干扰
3. 重要功能才添加提示
4. 定期评估提示的有效性
5. 收集用户反馈优化提示内容

---

**开发时间**: 2026年5月9日
**版本**: v1.0
