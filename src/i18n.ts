import type { Language } from "./types";

const I18N = {
  "zh-CN": {
    openSidebarCommand: "打开 Niki AI 侧边栏",
    sidebarTitle: "Niki AI Sidebar",
    includeCurrentNote: "包含当前笔记",
    send: "发送",
    clear: "清空",
    inputPlaceholder: "向 Niki AI 提问...",
    emptyState: "开始和 Niki AI 对话吧。",
    emptyResponse: "(无回复)",
    thinkingPending: "Niki 正在思考...",
    thinkingInline: "Niki 正在思考",
    failedRunCommand: "运行 Claude 命令失败。",
    claudeConnectionError:
      "错误：无法连接到 Claude CLI。\n\n请检查：\n1. Claude CLI 是否已正确安装：\n   npm install -g @anthropic-ai/claude-code\n2. 命令是否在终端中可以正常运行\n3. 插件设置中的 Claude command 配置\n\n详细错误：{message}",
    claudeNotFoundNotice:
      "未找到 Claude CLI。请在设置里填写 Claude command，或把 claude 加入 PATH。",
    claudeNotFoundReply:
      "未找到 Claude CLI。请在设置里填写 Claude command，或把 claude 加入 PATH。",
    noActiveNote: "当前没有可插入的笔记。",
    insertedInto: "已插入到 {path}",
    addedFile: "已添加: {name}",
    unsupportedFileType: "不支持的文件类型。只支持文本文件（如 .md, .txt, .js 等）。",
    roleYou: "你",
    roleNiki: "Niki",
    viewChanges: "查看变更",
    changesApplied: "已应用变更",
    changesAppliedTo: "已应用变更到 {path}",
    applyAllChanges: "应用全部变更",
    insertToNote: "插入到笔记",
    copy: "复制",
    copied: "已复制",
    noTargetFile: "没有可应用变更的目标文件。",
    failedApplyChanges: "应用变更失败：{message}",
    unknownError: "未知错误",
    searchFilesPlaceholder: "搜索文件...",
    settingTitle: "Niki AI Sidebar",
    settingClaudeCommandName: "Claude command",
    settingClaudeCommandDesc:
      "用于运行 Claude Code 的命令。使用 {prompt} 内联提示词，或留空以通过 stdin 发送。",
    settingClaudeCommandPlaceholder: "claude -p \"{prompt}\"",
    settingClaudePathName: "Claude path",
    settingClaudePathDesc:
      "Claude CLI 可执行文件的完整路径（Windows 可填 claude.cmd）。留空则自动检测。",
    settingNodePathName: "Node path",
    settingNodePathDesc:
      "Node 可执行文件的完整路径（Windows 可填 node.exe）。留空则自动检测。",
    settingGitBashPathName: "Git Bash path",
    settingGitBashPathDesc:
      "Git Bash 可执行文件的完整路径（Windows 使用 shell 执行时需要）。留空则自动检测。",
    settingClaudeEditionName: "Claude 版本选择",
    settingClaudeEditionDesc:
      "选择使用哪个版本的 Claude CLI。auto=自动检测，npm=npm 安装版本，native=原生二进制版本，custom=自定义路径。",
    settingModelName: "模型选择",
    settingModelDesc: "指定 Claude CLI 使用的模型（等价于 --model）。",
    settingThinkingBudgetName: "思考深度",
    settingThinkingBudgetDesc: "设置扩展思考深度（CLI 不支持时仅作提示）。",
    editionAuto: "自动检测",
    editionNpm: "npm 版本",
    editionNative: "原生版本",
    editionCustom: "自定义路径",
    pathHelpButton: "帮助",
    pathHelpTitle: "路径帮助",
    pathHelpBody:
      "如何找到 Claude / Node 的完整路径：\n\n" +
      "Windows（推荐）:\n" +
      "1) 打开 cmd 或 PowerShell\n" +
      "2) 运行: where claude\n" +
      "3) 运行: where node\n\n" +
      "如果没有输出，可尝试以下常见路径：\n" +
      "- %APPDATA%\\npm\\claude.cmd\n" +
      "- C:\\Program Files\\nodejs\\node.exe\n" +
      "- C:\\Program Files (x86)\\nodejs\\node.exe\n" +
      "- %LOCALAPPDATA%\\Programs\\nodejs\\node.exe\n" +
      "- %NVM_SYMLINK%\\node.exe\n\n" +
      "macOS/Linux:\n" +
      "- 运行: which claude\n" +
      "- 运行: which node",
    settingDefaultPromptName: "Default prompt",
    settingDefaultPromptDesc: "每次请求前自动附加的系统提示词。",
    settingDefaultPromptPlaceholder: "你是嵌入 Obsidian 的 Claude Code...",
    settingWorkingDirName: "Working directory",
    settingWorkingDirDesc: "Claude 命令的可选工作目录，默认为 vault 路径。",
    settingLanguageName: "Language",
    settingLanguageDesc: "界面显示语言。",
    settingTaskTrackingName: "任务跟踪",
    settingTaskTrackingDesc: "引导 Niki 输出结构化任务列表，以更新 Tasks 面板。",
    taskTrackingPrompt:
      "当请求包含多个步骤时，请在回复末尾追加一个任务块，格式必须如下：\n" +
      "```todo\n" +
      "{\"todos\":[{\"content\":\"...\",\"status\":\"pending\",\"activeForm\":\"...\"}]}\n" +
      "```\n" +
      "status 仅使用：pending、in_progress、completed。若无需任务列表，请省略该块。",
    undoChanges: "撤销修改",
    undoSuccess: "已撤销 {path} 的修改",
    undoFailed: "撤销失败：{message}",
    aboutSectionName: "关于本插件",
    aboutVersion: "版本",
    aboutAuthor: "作者",
    aboutEmail: "邮箱",
    aboutLicense: "开源协议",
    aboutRepository: "代码仓库",
    aboutDescription: "简介",
    aboutDescriptionText:
      "Niki AI 是一个 Obsidian 插件，集成了 Claude Code CLI 作为对话式 AI 助手。你可以在侧边栏与 Claude 聊天，包含当前笔记内容作为上下文，并将回复直接插入到笔记中。",
    assistantSectionName: "助手预设",
    assistantSectionDesc: "管理和切换不同的 AI 助手，每个助手有独立的提示词配置。",
    assistantName: "助手名称",
    assistantSystemPrompt: "系统提示词",
    assistantAddNew: "添加新助手",
    assistantDelete: "删除助手",
    assistantEdit: "编辑助手",
    assistantDefaultName: "新助手",
    assistantDefaultPrompt: "你是一个 AI 助手。",
    assistantCannotDeleteLast: "不能删除最后一个助手预设",
    currentAssistant: "当前助手",
    sendInterrupt: "中断",
    sendSending: "发送中...",
    tasksLabel: "任务",
    tasksExpandAria: "展开任务列表 - 已完成 {completed}/{total}",
    tasksCollapseAria: "收起任务列表 - 已完成 {completed}/{total}",
    thinkingBudgetLabel: "思考:",
    thinkingLabel: "Thought for {duration}s",
    thinkingLabelShort: "Thought",
    thinkingLive: "Thinking {duration}s...",
    thinkingIndicatorHint: "esc to interrupt",
    thinkingBlockAria: "扩展思考内容 - 点击展开",
  },
  "en-US": {
    openSidebarCommand: "Open Niki AI Sidebar",
    sidebarTitle: "Niki AI Sidebar",
    includeCurrentNote: "Include current note",
    send: "Send",
    clear: "Clear",
    inputPlaceholder: "Ask Niki AI...",
    emptyState: "Start a conversation with Niki AI.",
    emptyResponse: "(empty response)",
    thinkingPending: "Niki is thinking...",
    thinkingInline: "Niki is thinking",
    failedRunCommand: "Failed to run Claude command.",
    claudeConnectionError:
      "Error: Unable to connect to Claude CLI.\n\nPlease check:\n1. Claude CLI is installed:\n   npm install -g @anthropic-ai/claude-code\n2. Command works in terminal\n3. Claude command in settings\n\nDetails: {message}",
    claudeNotFoundNotice:
      "Claude CLI not found. Configure Claude command or add claude to PATH.",
    claudeNotFoundReply:
      "Claude CLI not found. Configure Claude command or add claude to PATH.",
    noActiveNote: "No active note to insert into.",
    insertedInto: "Inserted into {path}",
    addedFile: "Added: {name}",
    unsupportedFileType:
      "Unsupported file type. Only text files are supported (e.g., .md, .txt, .js, etc.).",
    roleYou: "You",
    roleNiki: "Niki",
    viewChanges: "View changes",
    changesApplied: "Changes applied",
    changesAppliedTo: "Changes applied to {path}",
    applyAllChanges: "Apply all changes",
    insertToNote: "Insert to note",
    copy: "Copy",
    copied: "Copied",
    noTargetFile: "No target file to apply changes to.",
    failedApplyChanges: "Failed to apply changes: {message}",
    unknownError: "Unknown error",
    searchFilesPlaceholder: "Search files...",
    settingTitle: "Niki AI Sidebar",
    settingClaudeCommandName: "Claude command",
    settingClaudeCommandDesc:
      "Command to run Claude Code. Use {prompt} to inline the prompt, or leave it out to send via stdin.",
    settingClaudeCommandPlaceholder: "claude -p \"{prompt}\"",
    settingClaudePathName: "Claude path",
    settingClaudePathDesc:
      "Full path to the Claude CLI executable (on Windows, use claude.cmd). Leave empty to auto-detect.",
    settingNodePathName: "Node path",
    settingNodePathDesc:
      "Full path to the Node executable (on Windows, use node.exe). Leave empty to auto-detect.",
    settingGitBashPathName: "Git Bash path",
    settingGitBashPathDesc:
      "Full path to the Git Bash executable (needed for shell execution on Windows). Leave empty to auto-detect.",
    settingClaudeEditionName: "Claude Edition",
    settingClaudeEditionDesc:
      "Choose which Claude CLI version to use. auto=auto-detect, npm=npm installed version, native=native binary, custom=custom path.",
    settingModelName: "Model",
    settingModelDesc: "Model to use for Claude CLI (equivalent to --model).",
    settingThinkingBudgetName: "Thinking depth",
    settingThinkingBudgetDesc:
      "Controls extended thinking budget (hint only when CLI doesn't support it).",
    editionAuto: "Auto-detect",
    editionNpm: "npm version",
    editionNative: "Native version",
    editionCustom: "Custom path",
    pathHelpButton: "Help",
    pathHelpTitle: "Path Help",
    pathHelpBody:
      "How to find the full paths for Claude / Node:\n\n" +
      "Windows (recommended):\n" +
      "1) Open cmd or PowerShell\n" +
      "2) Run: where claude\n" +
      "3) Run: where node\n\n" +
      "If there is no output, try these common locations:\n" +
      "- %APPDATA%\\npm\\claude.cmd\n" +
      "- C:\\Program Files\\nodejs\\node.exe\n" +
      "- C:\\Program Files (x86)\\nodejs\\node.exe\n" +
      "- %LOCALAPPDATA%\\Programs\\nodejs\\node.exe\n" +
      "- %NVM_SYMLINK%\\node.exe\n\n" +
      "macOS/Linux:\n" +
      "- Run: which claude\n" +
      "- Run: which node",
    settingDefaultPromptName: "Default prompt",
    settingDefaultPromptDesc: "Prepended to every request.",
    settingDefaultPromptPlaceholder: "You are Claude Code embedded in Obsidian...",
    settingWorkingDirName: "Working directory",
    settingWorkingDirDesc:
      "Optional cwd for the Claude command. Defaults to vault path.",
    settingLanguageName: "Language",
    settingLanguageDesc: "Language for the UI.",
    settingTaskTrackingName: "Task tracking",
    settingTaskTrackingDesc:
      "Ask Niki to output a structured task list so the Tasks panel can update.",
    taskTrackingPrompt:
      "When the request has multiple steps, append a task block at the end of your reply using this exact format:\n" +
      "```todo\n" +
      "{\"todos\":[{\"content\":\"...\",\"status\":\"pending\",\"activeForm\":\"...\"}]}\n" +
      "```\n" +
      "Use status values: pending, in_progress, completed. Omit the block if no task list is needed.",
    undoChanges: "Undo changes",
    undoSuccess: "Undone changes to {path}",
    undoFailed: "Undo failed: {message}",
    aboutSectionName: "About",
    aboutVersion: "Version",
    aboutAuthor: "Author",
    aboutEmail: "Email",
    aboutLicense: "License",
    aboutRepository: "Repository",
    aboutDescription: "Description",
    aboutDescriptionText:
      "Niki AI is an Obsidian plugin that integrates Claude Code CLI as a conversational AI assistant. You can chat with Claude in the sidebar, include current note content as context, and insert responses directly into your notes.",
    assistantSectionName: "Assistant Presets",
    assistantSectionDesc:
      "Manage and switch between different AI assistants, each with independent prompt configuration.",
    assistantName: "Assistant Name",
    assistantSystemPrompt: "System Prompt",
    assistantAddNew: "Add New Assistant",
    assistantDelete: "Delete Assistant",
    assistantEdit: "Edit Assistant",
    assistantDefaultName: "New Assistant",
    assistantDefaultPrompt: "You are an AI assistant.",
    assistantCannotDeleteLast: "Cannot delete the last assistant preset",
    currentAssistant: "Current Assistant",
    sendInterrupt: "Stop",
    sendSending: "Sending...",
    tasksLabel: "Tasks",
    tasksExpandAria: "Expand task list - {completed} of {total} completed",
    tasksCollapseAria: "Collapse task list - {completed} of {total} completed",
    thinkingBudgetLabel: "Thinking:",
    thinkingLabel: "Thought for {duration}s",
    thinkingLabelShort: "Thought",
    thinkingLive: "Thinking {duration}s...",
    thinkingIndicatorHint: "esc to interrupt",
    thinkingBlockAria: "Extended thinking - click to expand",
  },
} as const;

export type I18nKey = keyof typeof I18N["zh-CN"];

export function t(language: Language, key: I18nKey): string {
  return (I18N[language] ?? I18N["zh-CN"])[key] ?? I18N["zh-CN"][key];
}

export function format(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
}
