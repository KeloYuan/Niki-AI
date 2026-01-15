# Niki AI

> 在 Obsidian 侧边栏中使用 Claude Code，享受流畅的 AI 辅助写作体验。

![GitHub release](https://img.shields.io/github/v/release/KeloYuan/NIki-AI)
![License](https://img.shields.io/github/license/KeloYuan/NIki-AI)

## ✨ 功能亮点

### 核心功能
- 🎨 **侧边栏原生对话 UI** - 无缝集成 Obsidian 界面
- 📝 **智能上下文** - 自动包含当前笔记或指定文件内容
- 🔄 **撤销功能** - AI 修改文件后可一键恢复
- 💬 **多话题管理** - 支持创建多个独立对话话题

### 交互方式
- ⌨️ **@ 文件引用** - 输入 @ 或拖拽文件快速添加上下文
- 📋 **代码块差异** - 可视化预览修改内容
- 🎯 **一键插入** - 将 AI 回复直接插入当前笔记

## 📦 安装

### 方式一：手动安装
1. 下载最新版本的 [Release](https://github.com/KeloYuan/NIki-AI/releases)
2. 将 `main.js`、`manifest.json`、`styles.css` 放入：
   ```
   你的仓库/.obsidian/plugins/niki-ai/
   ```
3. 在 Obsidian 设置中启用 Niki AI 插件

### 方式二：开发构建
```bash
git clone https://github.com/KeloYuan/NIki-AI.git
cd niki-ai
npm install
npm run build
```

## ⚙️ 配置

### 0. Claude Code 安装

在使用插件前，需要先安装 Claude Code CLI。有两种安装方式：

#### 方式一：npm 安装（推荐）

```bash
npm install -g @anthropic-ai/claude-code
```

**特点：**
- ✅ 更新方便：`npm update -g @anthropic-ai/claude-code`
- ✅ 跨平台一致：Windows/macOS/Linux 行为相同
- ✅ Node.js 生态：需要 Node.js 环境
- ✅ 版本管理：可通过 npm 锁定特定版本
- 📍 安装位置：
  - macOS/Linux: `~/.npm-global/bin/claude`
  - Windows: `%APPDATA%\npm\claude.cmd`

#### 方式二：官方脚本安装

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**特点：**
- ✅ 原生二进制：独立运行，不依赖 Node.js
- ✅ 性能更优：启动速度快，内存占用低
- ✅ 自动更新：内置自动更新机制
- ⚠️ 区域限制：某些地区可能无法访问 claude.ai
- 📍 安装位置：
  - macOS/Linux: `~/.claude/bin/claude` → `~/.local/bin/claude`
  - Windows: 不支持

#### 两种方式对比

| 特性 | npm 安装 | 官方脚本 |
|------|----------|----------|
| **依赖** | Node.js | 无 |
| **性能** | 较好 | 最优 |
| **更新方式** | npm update | 自动更新 |
| **跨平台** | 全平台 | Unix-like |
| **安装大小** | ~100MB | ~50MB |
| **推荐场景** | 开发者、Node.js 用户 | 追求性能 |

#### 插件版本选择（v4.0.9+）

插件设置中新增 **"Claude 版本选择"** 选项：

| 选项 | 说明 |
|------|------|
| **自动检测** | 自动查找可用版本（默认） |
| **npm 版本** | 优先使用 npm 安装的版本 |
| **原生版本** | 优先使用官方脚本安装的版本 |
| **自定义路径** | 使用"Claude path"中指定的路径 |

**建议：** 如果你同时安装了两个版本，可以在设置中指定优先使用哪个。

---

### 1. Claude Code 配置（推荐）

在 Claude Code 配置文件（通常位于 `~/.claude/settings.json`）中添加以下内容：

**最简配置**：
```json
{
  "permissions": {
    "defaultMode": "bypassPermissions"
  }
}
```

这样 AI 修改文件时不会弹出确认对话框，修改后插件会显示"撤销修改"按钮。

**完整配置示例**：
```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "你的api key",
    "API_TIMEOUT_MS": "3000000",
    "ANTHROPIC_BASE_URL": "https://api.z.ai/api/anthropic",
    "MCP_TOOL_TIMEOUT": "30000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.6",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-4.7",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-4.7"
  },
  "permissions": {
    "defaultMode": "bypassPermissions"
  },
  "statusLine": {
    "type": "command",
    "command": "cc-statusline"
  },
  "enabledPlugins": {
    "glm-plan-usage@zai-coding-plugins": true,
    "glm-plan-bug@zai-coding-plugins": true
  },
  "alwaysThinkingEnabled": false,
  "model": "opus"
}
```

**配置说明**：
- `permissions.defaultMode`: 设置为 `bypassPermissions` 绕过文件修改确认
- `model`: 使用的 AI 模型（`opus` / `sonnet` / `haiku`）
- `env.API_TIMEOUT_MS`: API 超时时间（毫秒）
- `env.ANTHROPIC_BASE_URL`: API 基础 URL（用于使用自定义 API）
- `statusLine`: 状态栏显示配置
- `enabledPlugins`: 启用的插件列表
- `alwaysThinkingEnabled`: 是否启用始终思考模式

### 2. 插件设置

打开 **Obsidian 设置 → 插件 → Niki AI**：

#### Claude command
用于运行 Claude Code 的命令，支持两种模式：

**内联模式**（推荐）：
```
claude -p "{prompt}"
```

**Stdin 模式**：
```
claude
```
插件会自动将 prompt 写入 stdin。

#### Default prompt
每次请求前自动附加的系统提示词，例如：
```
你是嵌入 Obsidian 的 Claude Code 助手，帮助我编辑 Markdown 笔记。
修改内容时保持风格一致。
```

#### Working directory
Claude 命令的工作目录，默认使用当前 vault 路径。

## 💡 使用技巧

### @ 文件引用
- **输入 @**：自动弹出文件选择器
- **拖拽文件**：直接拖入输入框
- **支持多个**：可同时引用多个文件

### 多话题管理
点击左上角话题下拉菜单：
- **切换话题**：快速切换不同对话
- **新建话题**：点击 `+` 创建新对话
- **删除话题**：点击 `×` 删除当前对话

### 撤销修改
当 AI 修改文件后，会自动显示"撤销修改"按钮：
- 点击即可恢复到修改前的内容
- 支持多文件批量撤销

### 代码块差异
AI 返回代码块时：
- 点击"查看变更"预览差异
- 点击"应用全部变更"写入文件

## ❓ 常见问题

<details>
<summary><b>没有任何输出</b></summary>

请先确认 `Claude command` 是否正确，并在终端中测试该命令是否正常运行。
</details>

<details>
<summary><b>提示找不到命令</b></summary>

请检查命令是否在 PATH 中，或使用绝对路径。常见路径：
- `~/.npm-global/bin/claude`
- `/opt/homebrew/bin/claude`
</details>

<details>
<summary><b>AI 说修改了但文件没变？</b></summary>

请检查 Claude Code 配置中是否添加了 `bypassPermissions`。
</details>

<details>
<summary><b>撤销按钮在哪？</b></summary>

只有当 AI 通过 @ 引用或"包含当前笔记"真正修改了文件后，才会显示"撤销修改"按钮。
</details>

## 🛠️ 开发

```bash
# 安装依赖
npm install

# 开发模式（自动 watch）
npm run dev

# 生产构建
npm run build
```

## 📄 License

MIT License - 详见 [LICENSE](LICENSE)

## ❤️ 支持作者

如果你觉得这个插件有帮助，请考虑：
- ⭐ 给个 Star
- 🐛 提交 Issue 或 PR
- ☕ 请我喝杯咖啡

<div style="display:flex;gap:16px;flex-wrap:wrap;">
  <img src="asset/wx.png" alt="微信赞赏码" width="180" />
  <img src="asset/zfb.jpg" alt="支付宝收款码" width="180" />
</div>

---

Made with ❤️ by [KeloYuan](https://github.com/KeloYuan)
