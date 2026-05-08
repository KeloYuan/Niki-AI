<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:1f2937,100:0d1117&height=200&section=header&text=Niki%20AI&fontSize=50&fontColor=7aa2f7&fontAlignY=40&desc=Obsidian%20×%20Claude%20Code%20%E2%80%94%20AI-Powered%20Writing%20Companion&descSize=16&descAlignY=60&descAlign=50&animation=fadeIn" width="100%" />
</p>

<p align="center">
  <a href="https://github.com/KeloYuan/Niki-AI/releases"><img src="https://img.shields.io/github/v/release/KeloYuan/Niki-AI?style=for-the-badge&color=7aa2f7" /></a>
  <a href="https://github.com/KeloYuan/Niki-AI/blob/main/LICENSE"><img src="https://img.shields.io/github/license/KeloYuan/Niki-AI?style=for-the-badge&color=9ece6a" /></a>
  <a href="https://github.com/KeloYuan/Niki-AI/stargazers"><img src="https://img.shields.io/github/stars/KeloYuan/Niki-AI?style=for-the-badge&color=e0af68" /></a>
  <a href="https://github.com/KeloYuan/Niki-AI/issues"><img src="https://img.shields.io/github/issues/KeloYuan/Niki-AI?style=for-the-badge&color=f7768e" /></a>
  <a href="https://github.com/KeloYuan/Niki-AI/network/members"><img src="https://img.shields.io/github/forks/KeloYuan/Niki-AI?style=for-the-badge&color=bb9af7" /></a>
  <img src="https://img.shields.io/badge/Obsidian-Plugin-7c3aed?style=for-the-badge&logo=obsidian&logoColor=white" />
  <img src="https://img.shields.io/badge/Claude%20Code-Powered-d97706?style=for-the-badge&logo=anthropic&logoColor=white" />
</p>

<p align="center">
  <b>在 Obsidian 侧边栏中使用 Claude Code，享受流畅的 AI 辅助写作体验。</b><br/>
  <i>Embed Claude Code into your Obsidian sidebar — write, edit, and create with AI assistance.</i>
</p>

---

## 🎯 Why Niki AI?

<table>
  <tr>
    <td width="50%">
      <h3>🧬 Deep Integration</h3>
      <p>不是简单的 API 调用 —— 直接将 Claude Code CLI 嵌入 Obsidian 侧边栏，获得完整的 AI 编码能力。</p>
    </td>
    <td width="50%">
      <h3>🔒 Privacy First</h3>
      <p>数据始终在本地，AI 直接操作你的 Vault 文件。支持自定义 API 端点，完全掌控你的数据流。</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>⚡ Zero Friction</h3>
      <p>@ 引用文件、拖拽添加上下文、一键插入回复、代码差异预览 —— 每个交互都经过精心设计。</p>
    </td>
    <td width="50%">
      <h3>🛡️ Safe by Default</h3>
      <p>AI 修改文件后一键撤销，多文件批量恢复。你永远有后悔药。</p>
    </td>
  </tr>
</table>

---

## ✨ Features

### Core Capabilities
| Feature | Description |
|---------|-------------|
| 🎨 **Sidebar Chat UI** | 原生 Obsidian 界面风格，无缝融入你的工作流 |
| 📝 **Smart Context** | 自动包含当前笔记或指定文件内容作为上下文 |
| ⌨️ **@ File Reference** | 输入 `@` 或拖拽文件，快速添加多文件上下文 |
| 🔄 **Undo Support** | AI 修改文件后一键恢复，支持多文件批量撤销 |
| 💬 **Multi-Thread** | 创建多个独立对话话题，管理工作互不干扰 |
| 📋 **Diff Preview** | 代码块差异可视化，审查后一键应用变更 |
| 🎯 **One-Click Insert** | 将 AI 回复直接插入当前笔记光标位置 |

### Powered by Claude Code
- 支持 **Opus / Sonnet / Haiku** 模型切换
- 完整的 **MCP 工具链** 支持
- 自定义 **系统提示词** 和 **工作目录**
- npm 版本 & 原生版本 **自动检测**
- 支持自定义 **API 端点**（兼容第三方代理）

---

## 📦 Installation

<details>
<summary><b>方式一：从 Release 安装（推荐）</b></summary>

1. 下载 [最新 Release](https://github.com/KeloYuan/Niki-AI/releases)
2. 解压到你的 Vault：
   ```
   <your-vault>/.obsidian/plugins/niki-ai/
   ```
3. 重启 Obsidian → 设置 → 第三方插件 → 启用 **Niki AI**
</details>

<details>
<summary><b>方式二：从源码构建</b></summary>

```bash
git clone https://github.com/KeloYuan/Niki-AI.git
cd Niki-AI
npm install
npm run dev    # 开发模式
npm run build  # 生产构建
```
</details>

<details>
<summary><b>前置要求：安装 Claude Code CLI</b></summary>

**npm 安装（推荐）：**
```bash
npm install -g @anthropic-ai/claude-code
```

**官方脚本安装：**
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

| 特性 | npm 安装 | 官方脚本 |
|------|---------|---------|
| 依赖 | Node.js | 无 |
| 性能 | 较好 | 最优 |
| 更新方式 | `npm update` | 自动更新 |
| 跨平台 | ✅ 全平台 | Unix-like |
| 安装大小 | ~100MB | ~50MB |
</details>

---

## ⚙️ Configuration

### Claude Code 配置

编辑 `~/.claude/settings.json`：

```json
{
  "permissions": {
    "defaultMode": "bypassPermissions"
  }
}
```

<details>
<summary><b>完整配置示例（含自定义 API）</b></summary>

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your-api-key",
    "API_TIMEOUT_MS": "3000000",
    "ANTHROPIC_BASE_URL": "https://your-api-endpoint.com"
  },
  "permissions": {
    "defaultMode": "bypassPermissions"
  },
  "model": "opus"
}
```
</details>

### 插件设置

**Obsidian → 设置 → 插件 → Niki AI**

| 设置项 | 说明 | 默认值 |
|--------|------|--------|
| Claude command | CLI 命令模板 | `claude -p "{prompt}"` |
| Default prompt | 系统提示词 | _(空)_ |
| Working directory | 工作目录 | 当前 Vault 路径 |
| Claude 版本选择 | CLI 版本检测策略 | 自动检测 |

---

## 💡 Tips & Tricks

```
@ 引用文件     → 输入 @ 弹出文件选择器
拖拽文件       → 直接拖入输入框添加上下文
多话题管理     → 左上角下拉切换/新建/删除话题
撤销修改       → AI 改完文件后点击"撤销"一键恢复
代码差异       → 点击"查看变更"审查后"应用全部"
一键插入       → AI 回复直接插入当前笔记光标处
```

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
├── styles.css           # 样式
├── manifest.json        # 插件清单
└── esbuild.config.mjs   # 构建配置
```

```bash
npm install        # 安装依赖
npm run dev        # 开发模式（自动 watch）
npm run build      # 生产构建
```

---

## ❓ FAQ

<details>
<summary><b>没有任何输出？</b></summary>

确认 `Claude command` 设置正确，并在终端中测试命令是否可用。
</details>

<details>
<summary><b>提示找不到命令？</b></summary>

检查 PATH 或使用绝对路径，常见位置：
- `~/.npm-global/bin/claude`
- `/opt/homebrew/bin/claude`
</details>

<details>
<summary><b>AI 说修改了但文件没变？</b></summary>

确保 Claude Code 配置中设置了 `"defaultMode": "bypassPermissions"`。
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

## 📄 License

[MIT](LICENSE) © [KeloYuan](https://github.com/KeloYuan)

---

<p align="center">
  <i>If you find this plugin helpful, consider giving it a ⭐ — it means a lot!</i>
</p>
