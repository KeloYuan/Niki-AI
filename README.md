<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:1f2937,100:0d1117&height=220&section=header&text=Niki%20AI&fontSize=55&fontColor=7aa2f7&fontAlignY=40&desc=Obsidian%20%C3%97%20Claude%20Code%20%E2%80%94%20AI-Powered%20Writing%20Companion&descSize=16&descAlignY=60&descAlign=50&animation=fadeIn" width="100%" />
</p>

<p align="center">
  <a href="https://github.com/KeloYuan/Niki-AI/releases/latest"><img src="https://img.shields.io/github/v/release/KeloYuan/Niki-AI?style=for-the-badge&color=7aa2f7&logo=obsidian&logoColor=white" /></a>
  <a href="https://github.com/KeloYuan/Niki-AI/blob/main/LICENSE"><img src="https://img.shields.io/github/license/KeloYuan/Niki-AI?style=for-the-badge&color=9ece6a" /></a>
  <a href="https://github.com/KeloYuan/Niki-AI/stargazers"><img src="https://img.shields.io/github/stars/KeloYuan/Niki-AI?style=for-the-badge&color=e0af68" /></a>
  <a href="https://github.com/KeloYuan/Niki-AI/issues"><img src="https://img.shields.io/github/issues/KeloYuan/Niki-AI?style=for-the-badge&color=f7768e" /></a>
  <a href="https://github.com/KeloYuan/Niki-AI/network/members"><img src="https://img.shields.io/github/forks/KeloYuan/Niki-AI?style=for-the-badge&color=bb9af7" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Obsidian-Plugin-7c3aed?style=flat-square&logo=obsidian&logoColor=white" />
  <img src="https://img.shields.io/badge/Claude%20Code-Powered-d97706?style=flat-square&logo=anthropic&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Platform-Win%20%7C%20Mac%20%7C%20Linux-brightgreen?style=flat-square" />
</p>

<p align="center">
  <b>在 Obsidian 侧边栏中使用 Claude Code，享受流畅的 AI 辅助写作体验。</b><br/>
  <i>Embed Claude Code into your Obsidian sidebar — write, edit, and create with AI.</i>
</p>

---

## 🎯 Why Niki AI?

> **不是又一个 AI 聊天框。** Niki AI 把 Claude Code 的完整能力——文件读写、代码执行、MCP 工具链——**原生嵌入**你的 Obsidian 工作流。AI 不只是回答问题，它直接帮你**改文件**。

<table>
  <tr>
    <td width="25%" align="center"><b>🧬 Deep Integration</b></td>
    <td width="25%" align="center"><b>🔒 Privacy First</b></td>
    <td width="25%" align="center"><b>⚡ Zero Friction</b></td>
    <td width="25%" align="center"><b>🛡️ Safe by Default</b></td>
  </tr>
  <tr>
    <td align="center">直接嵌入 Claude Code CLI<br/>完整 MCP 工具链支持</td>
    <td align="center">数据始终在本地<br/>支持自定义 API 端点</td>
    <td align="center">@ 引用 · 拖拽 · 一键插入<br/>每个交互都精心设计</td>
    <td align="center">AI 改完一键撤销<br/>多文件批量恢复</td>
  </tr>
</table>

---

## ✨ Features

### 🚀 Core Capabilities

| Feature | Description |
|:--------|:------------|
| 🎨 **Sidebar Chat UI** | 原生 Obsidian 界面风格，自动适配你的主题 |
| 📝 **Smart Context** | 自动包含当前笔记，或手动 @ 引用多个文件 |
| ⌨️ **@ File Reference** | 输入 `@` 弹出文件选择器，或直接拖拽文件/文件夹 |
| 🔄 **Undo System** | AI 修改文件后一键撤销，支持多文件批量恢复 |
| 💬 **Multi-Thread** | 创建多个独立对话话题，互不干扰 |
| 📋 **Diff Preview** | 代码块差异可视化，审查后一键应用变更 |
| 🎯 **One-Click Insert** | AI 回复直接插入当前笔记光标位置 |
| ⏹️ **Interrupt** | 发送/停止按钮智能切换，随时中断 AI 回复 |
| 👤 **Multi-Assistant** | 多个 AI 助手预设，独立系统提示词，快速切换 |

### 🔥 Powered by Claude Code

- 支持 **Opus / Sonnet / Haiku** 模型切换
- 完整 **MCP 工具链** 支持
- 自定义 **系统提示词** 和 **工作目录**
- npm 版本 & 原生版本 **自动检测**（v4.0.9+）
- 支持自定义 **API 端点**（兼容第三方代理）
- **Windows / macOS / Linux** 全平台支持

---

## 📦 Installation

### Prerequisites

你需要先安装 **Claude Code CLI**：

<table>
  <tr>
    <td width="50%">

**npm 安装（推荐）**
```bash
npm install -g @anthropic-ai/claude-code
```

✅ 跨平台 · 易更新 · 版本可控

</td>
    <td width="50%">

**官方脚本安装**
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

✅ 无依赖 · 性能更优 · 自动更新

</td>
  </tr>
</table>

<details>
<summary><b>两种安装方式对比</b></summary>

| 特性 | npm 安装 | 官方脚本 |
|------|----------|----------|
| **依赖** | Node.js | 无 |
| **性能** | 较好 | 最优 |
| **更新方式** | `npm update -g` | 自动更新 |
| **跨平台** | ✅ 全平台 | Unix-like |
| **安装大小** | ~100MB | ~50MB |

</details>

### Install Plugin

**方式一：Release 安装（1 分钟）**

1. 下载 [最新 Release](https://github.com/KeloYuan/Niki-AI/releases/latest)
2. 将 `main.js`、`manifest.json`、`styles.css` 放入：
   ```
   <your-vault>/.obsidian/plugins/niki-ai/
   ```
3. 重启 Obsidian → 设置 → 第三方插件 → 启用 **Niki AI**

**方式二：源码构建**

```bash
git clone https://github.com/KeloYuan/Niki-AI.git
cd Niki-AI
npm install
npm run dev    # 开发模式（自动 watch）
npm run build  # 生产构建
```

---

## ⚙️ Configuration

### Step 1：Claude Code 配置

编辑 `~/.claude/settings.json`（最简配置）：

```json
{
  "permissions": {
    "defaultMode": "bypassPermissions"
  }
}
```

> 这样 AI 修改文件时不会弹出确认框，修改后插件会显示「撤销修改」按钮。

<details>
<summary><b>完整配置示例（含自定义 API / 模型）</b></summary>

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your-api-key",
    "API_TIMEOUT_MS": "3000000",
    "ANTHROPIC_BASE_URL": "https://your-api-endpoint.com",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  },
  "permissions": {
    "defaultMode": "bypassPermissions"
  },
  "model": "opus",
  "alwaysThinkingEnabled": false
}
```

| 参数 | 说明 |
|------|------|
| `permissions.defaultMode` | `bypassPermissions` 绕过文件修改确认 |
| `model` | 使用的模型（`opus` / `sonnet` / `haiku`） |
| `env.API_TIMEOUT_MS` | API 超时时间（毫秒） |
| `env.ANTHROPIC_BASE_URL` | 自定义 API 端点 |

</details>

### Step 2：插件设置

**Obsidian → 设置 → 插件 → Niki AI**

| 设置项 | 说明 | 默认值 |
|--------|------|--------|
| **Claude command** | CLI 命令模板 | `claude -p "{prompt}"` |
| **Default prompt** | 每次请求附加的系统提示词 | _(空)_ |
| **Working directory** | Claude 工作目录 | 当前 Vault 路径 |
| **Claude 版本选择** | CLI 版本检测策略 (v4.0.9+) | 自动检测 |

> 💡 **Claude command** 支持两种模式：
> - **内联模式**（推荐）：`claude -p "{prompt}"` — 插件自动替换 `{prompt}`
> - **Stdin 模式**：`claude` — 插件通过 stdin 写入 prompt

---

## 💡 Usage

### @ File Reference
```
输入 @          → 弹出文件选择器
拖拽文件        → 直接添加到上下文
拖拽文件夹 📁   → 自动包含文件夹内所有文件（v4.0.3+）
支持多个        → 同时引用多个文件
```

### Multi-Assistant Presets
```
设置 → Niki AI → Assistants → 添加预设
每个预设独立：名称 · 系统提示词 · 身份配置
侧边栏发送按钮旁快速切换
```

### Multi-Thread Chat
```
左上角话题下拉 → 切换 / 新建 / 删除话题
不同话题完全独立，互不干扰
```

### Diff & Apply
```
AI 返回代码块 → 点击「查看变更」→ 审查差异
确认无误 → 点击「应用全部变更」→ 写入文件
后悔了？→ 点击「撤销修改」→ 一键恢复
```

---

## 📋 Changelog

### v4.0.3 — Folder Drag & Drop
- 📁 支持拖拽整个文件夹到聊天窗口
- AI 自动读取文件夹内所有文件作为上下文
- 视觉指示：文件夹图标 + 文件计数

### v4.0.2 — Windows Compatibility
- 🪟 修复 Windows `.cmd` / `.bat` 文件执行错误
- 智能 shell 检测，处理带引号的路径

### v4.0.0 — Multi-Assistant
- 👤 多助手预设系统：独立系统提示词和身份配置
- ⏹️ 发送/停止按钮智能切换
- ⚙️ 设置自动保存（500ms 防抖）

<details>
<summary><b>查看完整更新日志</b></summary>

See [CHANGELOG.md](CHANGELOG.md) for full version history.

</details>

---

## 🛠️ Development

```
Niki-AI/
├── src/
│   ├── main.ts          # 插件入口
│   ├── settings.ts      # 设置面板
│   ├── view.ts          # 聊天视图
│   ├── claude.ts        # Claude Code 集成
│   └── utils/           # 工具函数
├── styles.css           # 样式（跟随 Obsidian 主题）
├── manifest.json        # 插件清单
├── CHANGELOG.md         # 更新日志
└── esbuild.config.mjs   # 构建配置
```

```bash
npm install        # 安装依赖
npm run dev        # 开发模式（自动 watch + 热重载）
npm run build      # 生产构建
```

---

## ❓ FAQ

<details>
<summary><b>没有任何输出？</b></summary>

1. 确认 `Claude command` 设置正确
2. 在终端中测试命令是否可用：`claude -p "hello"`
3. 检查 Claude Code 是否已登录/配置 API Key
</details>

<details>
<summary><b>提示找不到命令？</b></summary>

检查 PATH 或使用绝对路径：
- npm：`~/.npm-global/bin/claude`
- Homebrew：`/opt/homebrew/bin/claude`
- 官方脚本：`~/.claude/bin/claude`
- Windows：`%APPDATA%\npm\claude.cmd`
</details>

<details>
<summary><b>AI 说修改了但文件没变？</b></summary>

确保 Claude Code 配置中设置了 `"defaultMode": "bypassPermissions"`。
没有这个配置，AI 的文件修改会被拦截。
</details>

<details>
<summary><b>撤销按钮在哪？</b></summary>

只有当 AI 真正修改了文件后才会显示「撤销修改」按钮。
仅聊天回复不会触发撤销按钮。
</details>

<details>
<summary><b>支持哪些模型？</b></summary>

通过 Claude Code 支持 **Opus / Sonnet / Haiku**。
也可以通过自定义 `ANTHROPIC_BASE_URL` 使用第三方兼容 API。
</details>

---

## 📊 Star History

<a href="https://star-history.com/#KeloYuan/Niki-AI&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=KeloYuan/Niki-AI&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=KeloYuan/Niki-AI&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=KeloYuan/Niki-AI&type=Date" width="100%" />
  </picture>
</a>

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. 🐛 [Report bugs](https://github.com/KeloYuan/Niki-AI/issues)
2. 💡 [Request features](https://github.com/KeloYuan/Niki-AI/issues)
3. 🔧 [Submit PRs](https://github.com/KeloYuan/Niki-AI/pulls)

```bash
git clone https://github.com/KeloYuan/Niki-AI.git
cd Niki-AI && npm install && npm run dev
```

---

## ❤️ Support

如果这个插件对你有帮助：

- ⭐ **给个 Star** — 这是对我最大的鼓励
- 🐛 **提 Issue** — 帮我做得更好
- ☕ **请我喝杯咖啡**

<div>
  <img src="asset/wx.png" alt="微信赞赏码" width="180" />
  <img src="asset/zfb.jpg" alt="支付宝收款码" width="180" />
</div>

---

## 📄 License

[MIT](LICENSE) © [KeloYuan](https://github.com/KeloYuan)

---

<p align="center">
  <i>Made with ❤️ by <a href="https://github.com/KeloYuan">KeloYuan</a></i><br/>
  <i>AI should work where you work — inside your notes.</i>
</p>
