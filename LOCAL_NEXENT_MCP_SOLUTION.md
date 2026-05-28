# 本地 Nexent 配置 MCP 服务器解决方案

## 问题原因

当 Nexent 在本地运行时，使用 `localhost` 会导致 Nexent 尝试连接自己，而不是你的 MCP 服务器。

## 解决方案

### 方案 1：使用本地 IP 地址（推荐）⭐

1. **获取你的电脑 IP 地址**：
   ```powershell
   ipconfig | findstr "IPv4"
   ```
   你的 IP 地址：**192.168.2.1** 或 **192.168.78.1** 或 **192.168.43.138**

2. **启动 MCP 服务器**：
   ```bash
   python mcp_server.py
   ```
   或双击运行：`start_mcp_http.bat`

3. **在 Nexent 中配置**：
   - 服务器名称：`math-modeling-paper-reviewer`
   - 服务器 URL：`http://192.168.2.1:8004/mcp` （使用你的实际 IP）
   - Bearer Token：（留空）

### 方案 2：使用 127.0.0.1

如果方案 1 不行，尝试：
- 服务器 URL：`http://127.0.0.1:8004/mcp`

### 方案 3：使用 Docker 网络

如果 Nexent 使用 Docker 运行：
- 服务器 URL：`http://host.docker.internal:8004/mcp`

## 验证步骤

1. **启动 MCP 服务器**：
   ```bash
   python mcp_server.py
   ```
   确认看到：`Uvicorn running on http://0.0.0.0:8004`

2. **测试连接**：
   打开浏览器访问：`http://192.168.2.1:8004/mcp`
   应该能看到 MCP 服务器响应

3. **在 Nexent 中添加**：
   - 使用你的 IP 地址而不是 localhost
   - 确保 MCP 服务器正在运行

## 常见问题

### Q: 如何知道应该用哪个 IP？

A: 尝试所有列出的 IP 地址，通常第一个（192.168.2.1）是最常用的。

### Q: 防火墙阻止连接怎么办？

A: 允许 Python 通过防火墙，或临时关闭防火墙测试。

### Q: Nexent 在哪里运行？

A: 检查 Nexent 是通过桌面应用、浏览器还是 Docker 运行的，这决定了使用哪个方案。

## 快速测试命令

```bash
# 启动 MCP 服务器
python mcp_server.py

# 在另一个终端测试连接
curl http://192.168.2.1:8004/mcp
```
