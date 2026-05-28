# MCP 服务器更新说明

## 最新更新 (2026-05-28)

### 端口统一为 8004

经过整理，项目端口现已**统一使用 8004**：

| 组件 | 端口 |
|------|------|
| MCP Server | 8004 |
| 后端 API | 8000 |

### 更新的文件

- `mcp_server.py` - 端口 8004
- `start_mcp_http.bat` - 端口 8004
- `NEXENT_MCP_CONFIG_GUIDE.md` - 所有端口引用已更新
- `LOCAL_NEXENT_MCP_SOLUTION.md` - 所有端口引用已更新

---

## 历史更新记录

### 2026-05-27: URL 输入支持

#### 更新内容

#### 1. 支持 URL 输入
MCP 服务器现在支持从 URL 下载并解析文件：
- ✅ HTTP/HTTPS URL
- ✅ 本地文件路径
- ️ S3 URL（需要转换为 HTTP URL）

#### 2. 端口变更
- **旧端口**: 8001（已被占用）
- **新端口**: 8002

#### 3. 代码改进
- 添加了 `_download_file_from_url()` 函数
- 自动检测输入是 URL 还是本地路径
- 支持临时文件自动清理
- 更好的错误处理

### 在 Nexent 中更新配置

#### 步骤 1：修改服务器 URL

在 Nexent 的 MCP 服务器配置中，将 URL 从：
```
http://192.168.2.1:8004/sse
```

改为：
```
http://192.168.2.1:8004/sse
```

#### 步骤 2：重新添加服务器

1. 删除旧的 MCP 服务器配置
2. 添加新的服务器：
   - **服务器名称**: `math-modeling-paper-reviewer`
   - **服务器 URL**: `http://192.168.2.1:8004/sse`
   - **服务器 Bearer Token**: （留空）

#### 步骤 3：测试连接

在 Nexent 中重新上传论文文件进行测试。

---

## 当前仍然存在的问题

### 问题：Nexent 传递的 URL 是 localhost

从日志看到，Nexent 传递的 presigned_url 是：
```
http://localhost:5013/api/nb/v1/file/fetch?presigned_url=...
```

这个 `localhost:5013` 是 Nexent 内部的代理地址，**MCP 服务器无法访问**。

### 解决方案

#### 方案 1：让 Nexent 使用真实的 IP 地址

Nexent 需要配置为使用真实的 IP 地址而不是 localhost。

#### 方案 2：使用 S3 URL（需要修改代码）

如果你能让 Nexent 传递 S3 URL 而不是 HTTP URL，我可以修改代码来处理。

#### 方案 3：临时解决方案 - 手动下载

暂时你可以：
1. 从 Nexent 下载论文文件到本地
2. 将文件放到 MCP 服务器的工作目录
3. 使用本地文件路径调用工具

---

## 服务器状态

- **状态**: ✅ 运行中
- **端口**: 8004
- **地址**: http://0.0.0.0:8004/sse
- **测试**: http://localhost:8004/sse

## 日志位置

服务器日志会显示在运行 `python mcp_server.py` 的终端中。
