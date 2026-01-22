"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => main_default
});
module.exports = __toCommonJS(main_exports);

// src/plugin.ts
var import_obsidian5 = require("obsidian");

// src/constants.ts
var VIEW_TYPE_CLAUDE = "niki-ai-sidebar-view";

// src/i18n.ts
var I18N = {
  "zh-CN": {
    openSidebarCommand: "\u6253\u5F00 Niki AI \u4FA7\u8FB9\u680F",
    sidebarTitle: "Niki AI Sidebar",
    includeCurrentNote: "\u5305\u542B\u5F53\u524D\u7B14\u8BB0",
    send: "\u53D1\u9001",
    clear: "\u6E05\u7A7A",
    inputPlaceholder: "\u5411 Niki AI \u63D0\u95EE...",
    emptyState: "\u5F00\u59CB\u548C Niki AI \u5BF9\u8BDD\u5427\u3002",
    emptyResponse: "(\u65E0\u56DE\u590D)",
    thinkingPending: "Niki \u6B63\u5728\u601D\u8003...",
    thinkingInline: "Niki \u6B63\u5728\u601D\u8003",
    failedRunCommand: "\u8FD0\u884C Claude \u547D\u4EE4\u5931\u8D25\u3002",
    claudeConnectionError: "\u9519\u8BEF\uFF1A\u65E0\u6CD5\u8FDE\u63A5\u5230 Claude CLI\u3002\n\n\u8BF7\u68C0\u67E5\uFF1A\n1. Claude CLI \u662F\u5426\u5DF2\u6B63\u786E\u5B89\u88C5\uFF1A\n   npm install -g @anthropic-ai/claude-code\n2. \u547D\u4EE4\u662F\u5426\u5728\u7EC8\u7AEF\u4E2D\u53EF\u4EE5\u6B63\u5E38\u8FD0\u884C\n3. \u63D2\u4EF6\u8BBE\u7F6E\u4E2D\u7684 Claude command \u914D\u7F6E\n\n\u8BE6\u7EC6\u9519\u8BEF\uFF1A{message}",
    claudeNotFoundNotice: "\u672A\u627E\u5230 Claude CLI\u3002\u8BF7\u5728\u8BBE\u7F6E\u91CC\u586B\u5199 Claude command\uFF0C\u6216\u628A claude \u52A0\u5165 PATH\u3002",
    claudeNotFoundReply: "\u672A\u627E\u5230 Claude CLI\u3002\u8BF7\u5728\u8BBE\u7F6E\u91CC\u586B\u5199 Claude command\uFF0C\u6216\u628A claude \u52A0\u5165 PATH\u3002",
    noActiveNote: "\u5F53\u524D\u6CA1\u6709\u53EF\u63D2\u5165\u7684\u7B14\u8BB0\u3002",
    insertedInto: "\u5DF2\u63D2\u5165\u5230 {path}",
    addedFile: "\u5DF2\u6DFB\u52A0: {name}",
    unsupportedFileType: "\u4E0D\u652F\u6301\u7684\u6587\u4EF6\u7C7B\u578B\u3002\u53EA\u652F\u6301\u6587\u672C\u6587\u4EF6\uFF08\u5982 .md, .txt, .js \u7B49\uFF09\u3002",
    roleYou: "\u4F60",
    roleNiki: "Niki",
    viewChanges: "\u67E5\u770B\u53D8\u66F4",
    changesApplied: "\u5DF2\u5E94\u7528\u53D8\u66F4",
    changesAppliedTo: "\u5DF2\u5E94\u7528\u53D8\u66F4\u5230 {path}",
    applyAllChanges: "\u5E94\u7528\u5168\u90E8\u53D8\u66F4",
    insertToNote: "\u63D2\u5165\u5230\u7B14\u8BB0",
    copy: "\u590D\u5236",
    copied: "\u5DF2\u590D\u5236",
    noTargetFile: "\u6CA1\u6709\u53EF\u5E94\u7528\u53D8\u66F4\u7684\u76EE\u6807\u6587\u4EF6\u3002",
    failedApplyChanges: "\u5E94\u7528\u53D8\u66F4\u5931\u8D25\uFF1A{message}",
    unknownError: "\u672A\u77E5\u9519\u8BEF",
    searchFilesPlaceholder: "\u641C\u7D22\u6587\u4EF6...",
    settingTitle: "Niki AI Sidebar",
    settingClaudeCommandName: "Claude command",
    settingClaudeCommandDesc: "\u7528\u4E8E\u8FD0\u884C Claude Code \u7684\u547D\u4EE4\u3002\u4F7F\u7528 {prompt} \u5185\u8054\u63D0\u793A\u8BCD\uFF0C\u6216\u7559\u7A7A\u4EE5\u901A\u8FC7 stdin \u53D1\u9001\u3002",
    settingClaudeCommandPlaceholder: 'claude -p "{prompt}"',
    settingClaudePathName: "Claude path",
    settingClaudePathDesc: "Claude CLI \u53EF\u6267\u884C\u6587\u4EF6\u7684\u5B8C\u6574\u8DEF\u5F84\uFF08Windows \u53EF\u586B claude.cmd\uFF09\u3002\u7559\u7A7A\u5219\u81EA\u52A8\u68C0\u6D4B\u3002",
    settingNodePathName: "Node path",
    settingNodePathDesc: "Node \u53EF\u6267\u884C\u6587\u4EF6\u7684\u5B8C\u6574\u8DEF\u5F84\uFF08Windows \u53EF\u586B node.exe\uFF09\u3002\u7559\u7A7A\u5219\u81EA\u52A8\u68C0\u6D4B\u3002",
    settingGitBashPathName: "Git Bash path",
    settingGitBashPathDesc: "Git Bash \u53EF\u6267\u884C\u6587\u4EF6\u7684\u5B8C\u6574\u8DEF\u5F84\uFF08Windows \u4F7F\u7528 shell \u6267\u884C\u65F6\u9700\u8981\uFF09\u3002\u7559\u7A7A\u5219\u81EA\u52A8\u68C0\u6D4B\u3002",
    settingClaudeEditionName: "Claude \u7248\u672C\u9009\u62E9",
    settingClaudeEditionDesc: "\u9009\u62E9\u4F7F\u7528\u54EA\u4E2A\u7248\u672C\u7684 Claude CLI\u3002auto=\u81EA\u52A8\u68C0\u6D4B\uFF0Cnpm=npm \u5B89\u88C5\u7248\u672C\uFF0Cnative=\u539F\u751F\u4E8C\u8FDB\u5236\u7248\u672C\uFF0Ccustom=\u81EA\u5B9A\u4E49\u8DEF\u5F84\u3002",
    settingModelName: "\u6A21\u578B\u9009\u62E9",
    settingModelDesc: "\u6307\u5B9A Claude CLI \u4F7F\u7528\u7684\u6A21\u578B\uFF08\u7B49\u4EF7\u4E8E --model\uFF09\u3002",
    settingThinkingBudgetName: "\u601D\u8003\u6DF1\u5EA6",
    settingThinkingBudgetDesc: "\u8BBE\u7F6E\u6269\u5C55\u601D\u8003\u6DF1\u5EA6\uFF08CLI \u4E0D\u652F\u6301\u65F6\u4EC5\u4F5C\u63D0\u793A\uFF09\u3002",
    editionAuto: "\u81EA\u52A8\u68C0\u6D4B",
    editionNpm: "npm \u7248\u672C",
    editionNative: "\u539F\u751F\u7248\u672C",
    editionCustom: "\u81EA\u5B9A\u4E49\u8DEF\u5F84",
    pathHelpButton: "\u5E2E\u52A9",
    pathHelpTitle: "\u8DEF\u5F84\u5E2E\u52A9",
    pathHelpBody: "\u5982\u4F55\u627E\u5230 Claude / Node \u7684\u5B8C\u6574\u8DEF\u5F84\uFF1A\n\nWindows\uFF08\u63A8\u8350\uFF09:\n1) \u6253\u5F00 cmd \u6216 PowerShell\n2) \u8FD0\u884C: where claude\n3) \u8FD0\u884C: where node\n\n\u5982\u679C\u6CA1\u6709\u8F93\u51FA\uFF0C\u53EF\u5C1D\u8BD5\u4EE5\u4E0B\u5E38\u89C1\u8DEF\u5F84\uFF1A\n- %APPDATA%\\npm\\claude.cmd\n- C:\\Program Files\\nodejs\\node.exe\n- C:\\Program Files (x86)\\nodejs\\node.exe\n- %LOCALAPPDATA%\\Programs\\nodejs\\node.exe\n- %NVM_SYMLINK%\\node.exe\n\nmacOS/Linux:\n- \u8FD0\u884C: which claude\n- \u8FD0\u884C: which node",
    settingDefaultPromptName: "Default prompt",
    settingDefaultPromptDesc: "\u6BCF\u6B21\u8BF7\u6C42\u524D\u81EA\u52A8\u9644\u52A0\u7684\u7CFB\u7EDF\u63D0\u793A\u8BCD\u3002",
    settingDefaultPromptPlaceholder: "\u4F60\u662F\u5D4C\u5165 Obsidian \u7684 Claude Code...",
    settingWorkingDirName: "Working directory",
    settingWorkingDirDesc: "Claude \u547D\u4EE4\u7684\u53EF\u9009\u5DE5\u4F5C\u76EE\u5F55\uFF0C\u9ED8\u8BA4\u4E3A vault \u8DEF\u5F84\u3002",
    settingLanguageName: "Language",
    settingLanguageDesc: "\u754C\u9762\u663E\u793A\u8BED\u8A00\u3002",
    settingTaskTrackingName: "\u4EFB\u52A1\u8DDF\u8E2A",
    settingTaskTrackingDesc: "\u5F15\u5BFC Niki \u8F93\u51FA\u7ED3\u6784\u5316\u4EFB\u52A1\u5217\u8868\uFF0C\u4EE5\u66F4\u65B0 Tasks \u9762\u677F\u3002",
    taskTrackingPrompt: '\u5F53\u8BF7\u6C42\u5305\u542B\u591A\u4E2A\u6B65\u9AA4\u65F6\uFF0C\u8BF7\u5728\u56DE\u590D\u672B\u5C3E\u8FFD\u52A0\u4E00\u4E2A\u4EFB\u52A1\u5757\uFF0C\u683C\u5F0F\u5FC5\u987B\u5982\u4E0B\uFF1A\n```todo\n{"todos":[{"content":"...","status":"pending","activeForm":"..."}]}\n```\nstatus \u4EC5\u4F7F\u7528\uFF1Apending\u3001in_progress\u3001completed\u3002\u82E5\u65E0\u9700\u4EFB\u52A1\u5217\u8868\uFF0C\u8BF7\u7701\u7565\u8BE5\u5757\u3002',
    undoChanges: "\u64A4\u9500\u4FEE\u6539",
    undoSuccess: "\u5DF2\u64A4\u9500 {path} \u7684\u4FEE\u6539",
    undoFailed: "\u64A4\u9500\u5931\u8D25\uFF1A{message}",
    aboutSectionName: "\u5173\u4E8E\u672C\u63D2\u4EF6",
    aboutVersion: "\u7248\u672C",
    aboutAuthor: "\u4F5C\u8005",
    aboutEmail: "\u90AE\u7BB1",
    aboutLicense: "\u5F00\u6E90\u534F\u8BAE",
    aboutRepository: "\u4EE3\u7801\u4ED3\u5E93",
    aboutDescription: "\u7B80\u4ECB",
    aboutDescriptionText: "Niki AI \u662F\u4E00\u4E2A Obsidian \u63D2\u4EF6\uFF0C\u96C6\u6210\u4E86 Claude Code CLI \u4F5C\u4E3A\u5BF9\u8BDD\u5F0F AI \u52A9\u624B\u3002\u4F60\u53EF\u4EE5\u5728\u4FA7\u8FB9\u680F\u4E0E Claude \u804A\u5929\uFF0C\u5305\u542B\u5F53\u524D\u7B14\u8BB0\u5185\u5BB9\u4F5C\u4E3A\u4E0A\u4E0B\u6587\uFF0C\u5E76\u5C06\u56DE\u590D\u76F4\u63A5\u63D2\u5165\u5230\u7B14\u8BB0\u4E2D\u3002",
    assistantSectionName: "\u52A9\u624B\u9884\u8BBE",
    assistantSectionDesc: "\u7BA1\u7406\u548C\u5207\u6362\u4E0D\u540C\u7684 AI \u52A9\u624B\uFF0C\u6BCF\u4E2A\u52A9\u624B\u6709\u72EC\u7ACB\u7684\u63D0\u793A\u8BCD\u914D\u7F6E\u3002",
    assistantName: "\u52A9\u624B\u540D\u79F0",
    assistantSystemPrompt: "\u7CFB\u7EDF\u63D0\u793A\u8BCD",
    assistantAddNew: "\u6DFB\u52A0\u65B0\u52A9\u624B",
    assistantDelete: "\u5220\u9664\u52A9\u624B",
    assistantEdit: "\u7F16\u8F91\u52A9\u624B",
    assistantDefaultName: "\u65B0\u52A9\u624B",
    assistantDefaultPrompt: "\u4F60\u662F\u4E00\u4E2A AI \u52A9\u624B\u3002",
    assistantCannotDeleteLast: "\u4E0D\u80FD\u5220\u9664\u6700\u540E\u4E00\u4E2A\u52A9\u624B\u9884\u8BBE",
    currentAssistant: "\u5F53\u524D\u52A9\u624B",
    sendInterrupt: "\u4E2D\u65AD",
    sendSending: "\u53D1\u9001\u4E2D...",
    tasksLabel: "\u4EFB\u52A1",
    tasksExpandAria: "\u5C55\u5F00\u4EFB\u52A1\u5217\u8868 - \u5DF2\u5B8C\u6210 {completed}/{total}",
    tasksCollapseAria: "\u6536\u8D77\u4EFB\u52A1\u5217\u8868 - \u5DF2\u5B8C\u6210 {completed}/{total}",
    thinkingBudgetLabel: "\u601D\u8003:",
    thinkingLabel: "Thought for {duration}s",
    thinkingLabelShort: "Thought",
    thinkingLive: "Thinking {duration}s...",
    thinkingIndicatorHint: "esc to interrupt",
    thinkingBlockAria: "\u6269\u5C55\u601D\u8003\u5185\u5BB9 - \u70B9\u51FB\u5C55\u5F00"
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
    claudeConnectionError: "Error: Unable to connect to Claude CLI.\n\nPlease check:\n1. Claude CLI is installed:\n   npm install -g @anthropic-ai/claude-code\n2. Command works in terminal\n3. Claude command in settings\n\nDetails: {message}",
    claudeNotFoundNotice: "Claude CLI not found. Configure Claude command or add claude to PATH.",
    claudeNotFoundReply: "Claude CLI not found. Configure Claude command or add claude to PATH.",
    noActiveNote: "No active note to insert into.",
    insertedInto: "Inserted into {path}",
    addedFile: "Added: {name}",
    unsupportedFileType: "Unsupported file type. Only text files are supported (e.g., .md, .txt, .js, etc.).",
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
    settingClaudeCommandDesc: "Command to run Claude Code. Use {prompt} to inline the prompt, or leave it out to send via stdin.",
    settingClaudeCommandPlaceholder: 'claude -p "{prompt}"',
    settingClaudePathName: "Claude path",
    settingClaudePathDesc: "Full path to the Claude CLI executable (on Windows, use claude.cmd). Leave empty to auto-detect.",
    settingNodePathName: "Node path",
    settingNodePathDesc: "Full path to the Node executable (on Windows, use node.exe). Leave empty to auto-detect.",
    settingGitBashPathName: "Git Bash path",
    settingGitBashPathDesc: "Full path to the Git Bash executable (needed for shell execution on Windows). Leave empty to auto-detect.",
    settingClaudeEditionName: "Claude Edition",
    settingClaudeEditionDesc: "Choose which Claude CLI version to use. auto=auto-detect, npm=npm installed version, native=native binary, custom=custom path.",
    settingModelName: "Model",
    settingModelDesc: "Model to use for Claude CLI (equivalent to --model).",
    settingThinkingBudgetName: "Thinking depth",
    settingThinkingBudgetDesc: "Controls extended thinking budget (hint only when CLI doesn't support it).",
    editionAuto: "Auto-detect",
    editionNpm: "npm version",
    editionNative: "Native version",
    editionCustom: "Custom path",
    pathHelpButton: "Help",
    pathHelpTitle: "Path Help",
    pathHelpBody: "How to find the full paths for Claude / Node:\n\nWindows (recommended):\n1) Open cmd or PowerShell\n2) Run: where claude\n3) Run: where node\n\nIf there is no output, try these common locations:\n- %APPDATA%\\npm\\claude.cmd\n- C:\\Program Files\\nodejs\\node.exe\n- C:\\Program Files (x86)\\nodejs\\node.exe\n- %LOCALAPPDATA%\\Programs\\nodejs\\node.exe\n- %NVM_SYMLINK%\\node.exe\n\nmacOS/Linux:\n- Run: which claude\n- Run: which node",
    settingDefaultPromptName: "Default prompt",
    settingDefaultPromptDesc: "Prepended to every request.",
    settingDefaultPromptPlaceholder: "You are Claude Code embedded in Obsidian...",
    settingWorkingDirName: "Working directory",
    settingWorkingDirDesc: "Optional cwd for the Claude command. Defaults to vault path.",
    settingLanguageName: "Language",
    settingLanguageDesc: "Language for the UI.",
    settingTaskTrackingName: "Task tracking",
    settingTaskTrackingDesc: "Ask Niki to output a structured task list so the Tasks panel can update.",
    taskTrackingPrompt: 'When the request has multiple steps, append a task block at the end of your reply using this exact format:\n```todo\n{"todos":[{"content":"...","status":"pending","activeForm":"..."}]}\n```\nUse status values: pending, in_progress, completed. Omit the block if no task list is needed.',
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
    aboutDescriptionText: "Niki AI is an Obsidian plugin that integrates Claude Code CLI as a conversational AI assistant. You can chat with Claude in the sidebar, include current note content as context, and insert responses directly into your notes.",
    assistantSectionName: "Assistant Presets",
    assistantSectionDesc: "Manage and switch between different AI assistants, each with independent prompt configuration.",
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
    thinkingBlockAria: "Extended thinking - click to expand"
  }
};
function t(language, key) {
  var _a, _b;
  return (_b = ((_a = I18N[language]) != null ? _a : I18N["zh-CN"])[key]) != null ? _b : I18N["zh-CN"][key];
}
function format(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    var _a;
    return (_a = vars[key]) != null ? _a : "";
  });
}

// src/settings/defaults.ts
var DEFAULT_SETTINGS = {
  claudeCommand: "",
  claudePath: "",
  claudeEdition: "auto",
  nodePath: "",
  gitBashPath: "",
  model: "haiku",
  thinkingBudget: "off",
  defaultPrompt: "You are Niki AI embedded in Obsidian (powered by Claude Code). Help me edit Markdown notes.\nWhen you propose changes, be explicit and keep the style consistent.",
  workingDir: "",
  language: "zh-CN",
  includeCurrentNote: false,
  enableTaskTracking: true,
  topics: [],
  currentTopicId: null,
  assistantPresets: [
    {
      id: "assistant_default",
      name: "\u9ED8\u8BA4\u52A9\u624B",
      systemPrompt: "You are Niki AI embedded in Obsidian (powered by Claude Code). Help me edit Markdown notes.\nWhen you propose changes, be explicit and keep the style consistent."
    }
  ],
  currentAssistantId: "assistant_default"
};

// src/view/ClaudeSidebarView.ts
var import_obsidian2 = require("obsidian");
var import_child_process = require("child_process");

// src/utils/claudeCli.ts
var import_fs = __toESM(require("fs"), 1);
var import_os = __toESM(require("os"), 1);
var import_path = __toESM(require("path"), 1);
var ANSI_REGEX = /[\u001B\u009B][[\]()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
function sanitizeStreamOutput(input) {
  return input.replace(ANSI_REGEX, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
function normalizeCommand(command) {
  if (!command) {
    return "";
  }
  const trimmed = command.trim();
  if (!trimmed) {
    return "";
  }
  const firstToken = trimmed.split(/\s+/)[0];
  if (firstToken && isDirectory(firstToken)) {
    const resolved = import_path.default.join(firstToken, "claude");
    return trimmed.replace(firstToken, resolved);
  }
  return trimmed;
}
function findClaudeBinary(preferredPath, edition = "auto") {
  const home = import_os.default.homedir();
  const isWindows = process.platform === "win32";
  if (edition === "custom") {
    if (preferredPath) {
      const candidate = preferredPath.trim();
      if (candidate && isExecutable(candidate)) {
        return candidate;
      }
    }
    return "";
  }
  const npmCandidates = [];
  const nativeCandidates = [];
  if (isWindows) {
    const appData = process.env.APPDATA || import_path.default.join(home, "AppData", "Roaming");
    npmCandidates.push(
      import_path.default.join(appData, "npm", "claude.cmd"),
      import_path.default.join(appData, "npm", "claude")
    );
    nativeCandidates.push(
      import_path.default.join(home, ".claude", "bin", "claude.exe"),
      import_path.default.join(home, ".claude", "bin", "claude.cmd")
    );
  } else {
    npmCandidates.push(import_path.default.join(home, ".npm-global", "bin", "claude"));
    nativeCandidates.push(
      import_path.default.join(home, ".local", "bin", "claude"),
      import_path.default.join(home, ".claude", "bin", "claude")
    );
  }
  nativeCandidates.push(
    "/opt/homebrew/bin/claude",
    "/usr/local/bin/claude",
    "/usr/bin/claude"
  );
  let candidates = [];
  if (edition === "custom") {
    if (preferredPath) {
      const candidate = preferredPath.trim();
      if (candidate && isExecutable(candidate)) {
        return candidate;
      }
    }
    return "";
  } else if (edition === "npm") {
    candidates = [...npmCandidates, ...nativeCandidates];
  } else if (edition === "native") {
    candidates = [...nativeCandidates, ...npmCandidates];
  } else {
    if (preferredPath) {
      const candidate = preferredPath.trim();
      if (candidate && isExecutable(candidate)) {
        return candidate;
      }
    }
    candidates = [...npmCandidates, ...nativeCandidates];
  }
  for (const candidate of candidates) {
    if (isExecutable(candidate)) {
      return candidate;
    }
  }
  return "";
}
function windowsPathToGitBash(windowsPath) {
  const match = windowsPath.match(/^([A-Za-z]):\\(.*)$/);
  if (match) {
    const drive = match[1].toLowerCase();
    const rest = match[2].replace(/\\/g, "/");
    return `/${drive}/${rest}`;
  }
  return windowsPath.replace(/\\/g, "/");
}
function buildEnv(preferredNodePath, gitBashPath) {
  const env = { ...process.env };
  const home = import_os.default.homedir();
  env.HOME = env.HOME || home;
  const nodeBinary = findNodeBinary(preferredNodePath);
  const nodeDir = nodeBinary ? import_path.default.dirname(nodeBinary) : "";
  const isWindows = process.platform === "win32";
  const usingGitBash = isWindows && gitBashPath && gitBashPath.trim();
  let extra = [];
  if (isWindows) {
    const appData = process.env.APPDATA || import_path.default.join(home, "AppData", "Roaming");
    const localAppData = process.env.LOCALAPPDATA || import_path.default.join(home, "AppData", "Local");
    const programFiles = process.env.ProgramFiles || "C:\\Program Files";
    const programFilesX86 = process.env["ProgramFiles(x86)"] || "C:\\Program Files (x86)";
    const nvmHome = process.env.NVM_HOME;
    const nvmSymlink = process.env.NVM_SYMLINK;
    extra = [
      import_path.default.join(appData, "npm"),
      import_path.default.join(programFiles, "nodejs"),
      import_path.default.join(programFilesX86, "nodejs"),
      import_path.default.join(localAppData, "Programs", "nodejs"),
      ...nvmSymlink ? [nvmSymlink] : [],
      ...nvmHome ? [nvmHome] : []
    ];
  } else {
    extra = [
      import_path.default.join(home, ".npm-global", "bin"),
      import_path.default.join(home, ".local", "bin"),
      import_path.default.join(home, ".volta", "bin"),
      import_path.default.join(home, ".asdf", "shims"),
      import_path.default.join(home, ".nvm", "versions", "node"),
      "/opt/homebrew/bin",
      "/usr/local/bin",
      "/usr/bin"
    ];
  }
  const currentPath = env.PATH || "";
  const parts = currentPath.split(import_path.default.delimiter).filter(Boolean);
  const merged = [...nodeDir ? [nodeDir] : [], ...extra, ...parts];
  if (usingGitBash) {
    const convertedPaths = Array.from(new Set(merged)).map(windowsPathToGitBash);
    env.PATH = convertedPaths.join(":");
  } else {
    env.PATH = Array.from(new Set(merged)).join(import_path.default.delimiter);
  }
  return env;
}
function resolveClaudeTimeoutMs(env) {
  const defaultTimeout = 3e5;
  const settingsTimeout = readClaudeSettingsTimeoutMs();
  if (settingsTimeout !== null) {
    return settingsTimeout;
  }
  const envTimeout = parseTimeoutMs(env.API_TIMEOUT_MS);
  return envTimeout != null ? envTimeout : defaultTimeout;
}
function readClaudeSettingsTimeoutMs() {
  var _a;
  const home = import_os.default.homedir();
  const settingsPath = import_path.default.join(home, ".claude", "settings.json");
  try {
    const raw = import_fs.default.readFileSync(settingsPath, "utf8");
    const parsed = JSON.parse(raw);
    const value = (_a = parsed.env) == null ? void 0 : _a.API_TIMEOUT_MS;
    return parseTimeoutMs(value === void 0 ? void 0 : String(value));
  } catch (e) {
    return null;
  }
}
function parseTimeoutMs(value) {
  if (!value) {
    return null;
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}
function isExecutable(target) {
  try {
    if (process.platform === "win32") {
      import_fs.default.accessSync(target, import_fs.default.constants.F_OK);
      return true;
    }
    import_fs.default.accessSync(target, import_fs.default.constants.X_OK);
    return true;
  } catch (e) {
    return false;
  }
}
function isDirectory(target) {
  try {
    return import_fs.default.statSync(target).isDirectory();
  } catch (e) {
    return false;
  }
}
function isNodeScript(target) {
  try {
    const fd = import_fs.default.openSync(target, "r");
    const buffer = Buffer.alloc(200);
    const bytes = import_fs.default.readSync(fd, buffer, 0, buffer.length, 0);
    import_fs.default.closeSync(fd);
    const firstLine = buffer.toString("utf8", 0, bytes).split("\n")[0];
    return firstLine.includes("node");
  } catch (e) {
    return false;
  }
}
function findNodeBinary(preferredPath) {
  if (preferredPath) {
    const candidate = preferredPath.trim();
    if (candidate && isExecutable(candidate)) {
      return candidate;
    }
  }
  const home = import_os.default.homedir();
  const isWindows = process.platform === "win32";
  const localAppData = process.env.LOCALAPPDATA || import_path.default.join(home, "AppData", "Local");
  const programFiles = process.env.ProgramFiles || "C:\\Program Files";
  const programFilesX86 = process.env["ProgramFiles(x86)"] || "C:\\Program Files (x86)";
  const nvmHome = process.env.NVM_HOME;
  const nvmSymlink = process.env.NVM_SYMLINK;
  const direct = isWindows ? [
    nvmSymlink ? import_path.default.join(nvmSymlink, "node.exe") : "",
    nvmHome ? import_path.default.join(nvmHome, "node.exe") : "",
    import_path.default.join(programFiles, "nodejs", "node.exe"),
    import_path.default.join(programFilesX86, "nodejs", "node.exe"),
    import_path.default.join(localAppData, "Programs", "nodejs", "node.exe")
  ].filter(Boolean) : [
    import_path.default.join(home, ".volta", "bin", "node"),
    import_path.default.join(home, ".asdf", "shims", "node"),
    import_path.default.join(home, ".nvm", "versions", "node", "bin", "node"),
    "/opt/homebrew/bin/node",
    "/usr/local/bin/node",
    "/usr/bin/node"
  ];
  for (const candidate of direct) {
    if (isExecutable(candidate)) {
      return candidate;
    }
  }
  if (!isWindows) {
    const nvmRoot = import_path.default.join(home, ".nvm", "versions", "node");
    try {
      const versions = import_fs.default.readdirSync(nvmRoot).map((entry) => import_path.default.join(nvmRoot, entry, "bin", "node")).filter((candidate) => isExecutable(candidate)).sort();
      if (versions.length > 0) {
        return versions[versions.length - 1];
      }
    } catch (e) {
    }
  }
  return "";
}
function replacePlaceholder(command, prompt) {
  if (/"\{prompt\}"/.test(command)) {
    const escaped2 = prompt.replace(/\\/g, "\\\\").replace(/\$/g, "\\$").replace(/`/g, "\\`").replace(/"/g, '\\"').replace(/\n/g, " ").replace(/\r/g, " ");
    return command.replace(/"\{prompt\}"/g, `"${escaped2}"`);
  }
  if (/'\{prompt\}'/.test(command)) {
    const escaped2 = prompt.replace(/'/g, "'\\''");
    return command.replace(/'\{prompt\}'/g, `'${escaped2}'`);
  }
  const escaped = prompt.replace(/'/g, "'\\''");
  return command.replace(/\{prompt\}/g, `'${escaped}'`);
}
function attachStreamBuffers(child, onChunk) {
  const combined = [];
  const append = (chunk) => {
    const sanitized = sanitizeStreamOutput(chunk);
    if (!sanitized) {
      return;
    }
    combined.push(sanitized);
    if (onChunk) {
      onChunk(sanitized);
    }
  };
  if (child.stdout) {
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk) => append(String(chunk)));
  }
  if (child.stderr) {
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk) => append(String(chunk)));
  }
  return {
    getCombined: () => combined.join("")
  };
}

// src/utils/diff.ts
function computeDiff(original, modified) {
  const originalLines = original.split("\n");
  const modifiedLines = modified.split("\n");
  const changes = [];
  const lcs = longestCommonSubsequence(originalLines, modifiedLines);
  let origIdx = 0;
  let modIdx = 0;
  for (const line of lcs) {
    while (origIdx < originalLines.length && originalLines[origIdx] !== line) {
      changes.push({
        type: "removed",
        originalLine: origIdx + 1,
        content: originalLines[origIdx]
      });
      origIdx++;
    }
    while (modIdx < modifiedLines.length && modifiedLines[modIdx] !== line) {
      changes.push({
        type: "added",
        newLine: modIdx + 1,
        content: modifiedLines[modIdx]
      });
      modIdx++;
    }
    if (origIdx < originalLines.length && modIdx < modifiedLines.length) {
      changes.push({
        type: "unchanged",
        originalLine: origIdx + 1,
        newLine: modIdx + 1,
        content: line
      });
      origIdx++;
      modIdx++;
    }
  }
  while (origIdx < originalLines.length) {
    changes.push({
      type: "removed",
      originalLine: origIdx + 1,
      content: originalLines[origIdx]
    });
    origIdx++;
  }
  while (modIdx < modifiedLines.length) {
    changes.push({
      type: "added",
      newLine: modIdx + 1,
      content: modifiedLines[modIdx]
    });
    modIdx++;
  }
  return { changes };
}
function longestCommonSubsequence(arr1, arr2) {
  const m = arr1.length;
  const n = arr2.length;
  const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
  for (let i2 = 1; i2 <= m; i2++) {
    for (let j2 = 1; j2 <= n; j2++) {
      dp[i2][j2] = arr1[i2 - 1] === arr2[j2 - 1] ? dp[i2 - 1][j2 - 1] + 1 : Math.max(dp[i2 - 1][j2], dp[i2][j2 - 1]);
    }
  }
  const lcs = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (arr1[i - 1] === arr2[j - 1]) {
      lcs.unshift(arr1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  return lcs;
}

// src/utils/tasks.ts
var import_obsidian = require("obsidian");
function extractTasksFromReply(reply) {
  const parsed = parseTasksFromText(reply);
  if (parsed.tasks && parsed.block) {
    const cleaned = reply.replace(parsed.block, "").replace(/\n{3,}/g, "\n\n").trim();
    return { content: cleaned, tasks: parsed.tasks };
  }
  return { content: reply.trim(), tasks: parsed.tasks };
}
function parseTasksFromText(text) {
  var _a;
  const codeBlockRegex = /```(todo|tasks|tasklist|json)\s*\n([\s\S]*?)```/gi;
  let match;
  while ((match = codeBlockRegex.exec(text)) !== null) {
    const raw = match[2].trim();
    const tasks = parseTodoJson(raw);
    if (tasks && tasks.length > 0) {
      return { tasks, block: match[0] };
    }
  }
  const tagMatch = text.match(/<tasks>([\s\S]*?)<\/tasks>/i);
  if (tagMatch) {
    const raw = tagMatch[1].trim();
    const tasks = (_a = parseTodoJson(raw)) != null ? _a : parseMarkdownTasks(raw);
    if (tasks && tasks.length > 0) {
      return { tasks, block: tagMatch[0] };
    }
  }
  const markdownTasks = parseMarkdownTasks(text);
  if (markdownTasks.length > 0) {
    return { tasks: markdownTasks };
  }
  return { tasks: null };
}
function renderTaskItems(container, tasks) {
  container.empty();
  for (const task of tasks) {
    const item = container.createDiv({
      cls: `claude-code-task-item claude-code-task-${task.status}`
    });
    const icon = item.createSpan({ cls: "claude-code-task-status-icon" });
    icon.setAttribute("aria-hidden", "true");
    (0, import_obsidian.setIcon)(icon, task.status === "completed" ? "check" : "dot");
    const text = item.createSpan({ cls: "claude-code-task-text" });
    text.setText(task.status === "in_progress" && task.activeForm ? task.activeForm : task.content);
  }
}
function parseTodoJson(raw) {
  var _a, _b, _c, _d, _e;
  const payload = extractJsonPayload(raw);
  let parsed;
  try {
    parsed = JSON.parse(payload);
  } catch (e) {
    return null;
  }
  const items = Array.isArray(parsed) ? parsed : (_b = (_a = parsed.todos) != null ? _a : parsed.tasks) != null ? _b : parsed.items;
  if (!Array.isArray(items)) {
    return null;
  }
  const tasks = [];
  for (const item of items) {
    if (typeof item === "string") {
      const content2 = item.trim();
      if (content2) {
        tasks.push({ content: content2, status: "pending" });
      }
      continue;
    }
    if (!item || typeof item !== "object") {
      continue;
    }
    const record = item;
    const content = String((_e = (_d = (_c = record.content) != null ? _c : record.text) != null ? _d : record.title) != null ? _e : "").trim();
    if (!content) {
      continue;
    }
    const activeForm = typeof record.activeForm === "string" ? record.activeForm : typeof record.active_form === "string" ? record.active_form : void 0;
    const rawStatus = typeof record.status === "string" ? record.status : typeof record.state === "string" ? record.state : void 0;
    const status = normalizeTaskStatus(
      rawStatus,
      record.done === true ? "x" : void 0,
      Boolean(activeForm)
    );
    tasks.push({ content, status, activeForm });
  }
  return tasks.length > 0 ? tasks : null;
}
function extractJsonPayload(raw) {
  const trimmed = raw.trim();
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }
  const firstBracket = trimmed.indexOf("[");
  const lastBracket = trimmed.lastIndexOf("]");
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    return trimmed.slice(firstBracket, lastBracket + 1);
  }
  return trimmed;
}
function normalizeTaskStatus(value, checkbox, hasActiveForm) {
  var _a;
  const normalized = (_a = value == null ? void 0 : value.toLowerCase().replace(/[\s-]+/g, "_")) != null ? _a : "";
  if (normalized === "completed" || normalized === "done" || normalized === "finished") {
    return "completed";
  }
  if (normalized === "in_progress" || normalized === "inprogress" || normalized === "doing" || normalized === "working") {
    return "in_progress";
  }
  if (normalized === "pending" || normalized === "todo" || normalized === "queued") {
    return "pending";
  }
  if (checkbox) {
    if (checkbox.toLowerCase() === "x") {
      return "completed";
    }
    if (checkbox === ">" || checkbox === "~") {
      return "in_progress";
    }
  }
  return hasActiveForm ? "in_progress" : "pending";
}
function parseMarkdownTasks(text) {
  const tasks = [];
  const lines = text.split(/\r?\n/);
  let inCodeBlock = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) {
      continue;
    }
    const match = line.match(/^\s*[-*]\s+\[(.)\]\s+(.*)$/);
    if (!match) {
      continue;
    }
    const content = match[2].trim();
    if (!content) {
      continue;
    }
    tasks.push({
      content,
      status: normalizeTaskStatus(void 0, match[1])
    });
  }
  return tasks;
}

// src/models.ts
var DEFAULT_CLAUDE_MODELS = [
  { value: "haiku", label: "Haiku", description: "Fast and efficient" },
  { value: "sonnet", label: "Sonnet", description: "Balanced performance" },
  { value: "opus", label: "Opus", description: "Most capable" }
];
var THINKING_BUDGETS = [
  { value: "off", label: "Off", tokens: 0 },
  { value: "low", label: "Low", tokens: 4e3 },
  { value: "medium", label: "Med", tokens: 8e3 },
  { value: "high", label: "High", tokens: 16e3 },
  { value: "xhigh", label: "Ultra", tokens: 32e3 }
];
var DEFAULT_THINKING_BUDGET = {
  haiku: "off",
  sonnet: "low",
  opus: "medium"
};

// src/view/ClaudeSidebarView.ts
var LOGO_SVG = {
  viewBox: "0 -.01 39.5 39.53",
  width: "18",
  height: "18",
  path: "m7.75 26.27 7.77-4.36.13-.38-.13-.21h-.38l-1.3-.08-4.44-.12-3.85-.16-3.73-.2-.94-.2-.88-1.16.09-.58.79-.53 1.13.1 2.5.17 3.75.26 2.72.16 4.03.42h.64l.09-.26-.22-.16-.17-.16-3.88-2.63-4.2-2.78-2.2-1.6-1.19-.81-.6-.76-.26-1.66 1.08-1.19 1.45.1.37.1 1.47 1.13 3.14 2.43 4.1 3.02.6.5.24-.17.03-.12-.27-.45-2.23-4.03-2.38-4.1-1.06-1.7-.28-1.02c-.1-.42-.17-.77-.17-1.2l1.23-1.67.68-.22 1.64.22.69.6 1.02 2.33 1.65 3.67 2.56 4.99.75 1.48.4 1.37.15.42h.26v-.24l.21-2.81.39-3.45.38-4.44.13-1.25.62-1.5 1.23-.81.96.46.79 1.13-.11.73-.47 3.05-.92 4.78-.6 3.2h.35l.4-.4 1.62-2.15 2.72-3.4 1.2-1.35 1.4-1.49.9-.71h1.7l1.25 1.86-.56 1.92-1.75 2.22-1.45 1.88-2.08 2.8-1.3 2.24.12.18.31-.03 4.7-1 2.54-.46 3.03-.52 1.37.64.15.65-.54 1.33-3.24.8-3.8.76-5.66 1.34-.07.05.08.1 2.55.24 1.09.06h2.67l4.97.37 1.3.86.78 1.05-.13.8-2 1.02-2.7-.64-6.3-1.5-2.16-.54h-.3v.18l1.8 1.76 3.3 2.98 4.13 3.84.21.95-.53.75-.56-.08-3.63-2.73-1.4-1.23-3.17-2.67h-.21v.28l.73 1.07 3.86 5.8.2 1.78-.28.58-1 .35-1.1-.2-2.26-3.17-2.33-3.57-1.88-3.2-.23.13-1.11 11.95-.52.61-1.2.46-1-.76-.53-1.23.53-2.43.64-3.17.52-2.52.47-3.13.28-1.04-.02-.07-.23.03-2.36 3.24-3.59 4.85-2.84 3.04-.68.27-1.18-.61.11-1.09.66-.97 3.93-5 2.37-3.1 1.53-1.79-.01-.26h-.09l-10.44 6.78-1.86.24-.8-.75.1-1.23.38-.4 3.14-2.16z",
  fill: "#d97757"
};
var FLAVOR_TEXTS = [
  // Classic
  "Thinking...",
  "Pondering...",
  "Processing...",
  "Analyzing...",
  "Considering...",
  "Working on it...",
  "One moment...",
  "On it...",
  // Thoughtful
  "Ruminating...",
  "Contemplating...",
  "Reflecting...",
  "Mulling it over...",
  "Let me think...",
  "Hmm...",
  "Cogitating...",
  "Deliberating...",
  "Weighing options...",
  "Gathering thoughts...",
  // Playful
  "Brewing ideas...",
  "Connecting dots...",
  "Assembling thoughts...",
  "Spinning up neurons...",
  "Loading brilliance...",
  "Consulting the oracle...",
  "Summoning knowledge...",
  "Crunching thoughts...",
  "Dusting off neurons...",
  "Wrangling ideas...",
  "Herding thoughts...",
  "Juggling concepts...",
  "Untangling this...",
  "Piecing it together...",
  // Cozy
  "Sipping coffee...",
  "Warming up...",
  "Getting cozy with this...",
  "Settling in...",
  "Making tea...",
  "Grabbing a snack...",
  // Technical
  "Parsing...",
  "Compiling thoughts...",
  "Running inference...",
  "Querying the void...",
  "Defragmenting brain...",
  "Allocating memory...",
  "Optimizing...",
  "Indexing...",
  "Syncing neurons...",
  // Zen
  "Breathing...",
  "Finding clarity...",
  "Channeling focus...",
  "Centering...",
  "Aligning chakras...",
  "Meditating on this...",
  // Whimsical
  "Asking the stars...",
  "Reading tea leaves...",
  "Shaking the magic 8-ball...",
  "Consulting ancient scrolls...",
  "Decoding the matrix...",
  "Communing with the ether...",
  "Peering into the abyss...",
  "Channeling the cosmos...",
  // Action
  "Diving in...",
  "Rolling up sleeves...",
  "Getting to work...",
  "Tackling this...",
  "On the case...",
  "Investigating...",
  "Exploring...",
  "Digging deeper...",
  // Casual
  "Bear with me...",
  "Hang tight...",
  "Just a sec...",
  "Working my magic...",
  "Almost there...",
  "Give me a moment..."
];
var ClaudeSidebarView = class extends import_obsidian2.ItemView {
  // 上次更新时间
  constructor(leaf, plugin) {
    super(leaf);
    this.messages = [];
    this.loaded = false;
    this.mentionedItems = [];
    this.isSending = false;
    this.currentProcess = null;
    this.isTasksExpanded = false;
    this.streamRenderScheduled = false;
    this.streamRenderTimer = null;
    this.boundEscKeyHandler = null;
    this.currentStreamingContentEl = null;
    // 打字机效果相关
    this.typewriterBuffer = [];
    // 待显示的字符队列
    this.typewriterTimer = null;
    this.typewriterLastTime = 0;
    this.handleOutsideClick = (e) => {
      if (this.filePickerEl && !this.filePickerEl.contains(e.target) && !this.inputEl.contains(e.target)) {
        this.hideFilePicker();
      }
    };
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE_CLAUDE;
  }
  getDisplayText() {
    return "Niki AI";
  }
  async onOpen() {
    const container = this.containerEl;
    container.empty();
    container.addClass("claude-code-sidebar");
    const shell = container.createDiv("claude-code-shell");
    const header = shell.createDiv("claude-code-header");
    const titleEl = header.createDiv({ text: "Niki AI" }).addClass("claude-code-title");
    const topicControl = header.createDiv("claude-code-topic-control-inline");
    const topicSelector = topicControl.createDiv("claude-code-topic-selector-inline");
    this.topicSelectEl = topicSelector.createEl("select", {
      cls: "claude-code-topic-select-inline"
    });
    const topicActions = topicControl.createDiv("claude-code-topic-actions-inline");
    this.newTopicBtn = topicActions.createEl("button", {
      text: "+",
      cls: "claude-code-topic-btn-inline claude-code-topic-new"
    });
    this.newTopicBtn.setAttribute("aria-label", "\u65B0\u5EFA\u8BDD\u9898");
    this.deleteTopicBtn = topicActions.createEl("button", {
      text: "\xD7",
      cls: "claude-code-topic-btn-inline claude-code-topic-delete"
    });
    this.deleteTopicBtn.setAttribute("aria-label", "\u5220\u9664\u8BDD\u9898");
    const body = shell.createDiv("claude-code-body");
    const messagesWrapper = body.createDiv("claude-code-messages-wrapper");
    this.messagesEl = messagesWrapper.createDiv("claude-code-messages");
    const composerShell = body.createDiv("claude-code-composer-shell");
    this.composerEl = composerShell.createDiv("claude-code-composer");
    const composer = this.composerEl;
    this.mentionTagsEl = composer.createDiv("claude-code-mention-tags");
    const topRow = composer.createDiv("claude-code-top-row");
    const controls = topRow.createDiv("claude-code-controls");
    const includeNoteWrap = controls.createDiv("claude-code-toggle");
    this.includeNoteEl = includeNoteWrap.createEl("input", {
      type: "checkbox"
    });
    this.includeNoteEl.checked = this.plugin.settings.includeCurrentNote;
    includeNoteWrap.createEl("span", { text: this.plugin.t("includeCurrentNote") });
    const actions = topRow.createDiv("claude-code-actions");
    this.assistantSelectEl = actions.createEl("select", {
      cls: "claude-code-assistant-select"
    });
    this.sendBtn = actions.createEl("button", {
      text: this.plugin.t("send"),
      cls: "mod-cta"
    });
    const clearBtn = actions.createEl("button", { text: this.plugin.t("clear") });
    const toolbarRow = composer.createDiv("claude-code-toolbar");
    this.modelSelectorEl = toolbarRow.createDiv("claude-code-model-selector");
    this.thinkingSelectorEl = toolbarRow.createDiv("claude-code-thinking-selector");
    this.inputEl = composer.createEl("textarea", {
      cls: "claude-code-input",
      attr: { placeholder: this.plugin.t("inputPlaceholder") }
    });
    this.inputEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
        event.preventDefault();
        void this.handleSend();
      }
      if (event.key === "Escape" && this.isSending) {
        event.preventDefault();
        this.interruptSending();
      }
    });
    this.inputEl.addEventListener("input", (event) => {
      const target = event.target;
      const value = target.value;
      const cursorPos = target.selectionStart;
      if (cursorPos > 0 && value[cursorPos - 1] === "@" && (cursorPos === 1 || value[cursorPos - 2] === " ")) {
        const activeFile = this.getActiveFile();
        if (activeFile) {
          this.addMentionedItem({
            type: "file",
            name: activeFile.basename,
            path: activeFile.path
          });
          target.value = value.slice(0, cursorPos - 1) + value.slice(cursorPos);
          target.setSelectionRange(cursorPos - 1, cursorPos - 1);
          this.showFilePicker();
        }
      }
    });
    this.inputEl.addEventListener("dragover", (event) => {
      event.preventDefault();
      this.inputEl.addClass("claude-code-input-dragover");
    });
    this.inputEl.addEventListener("dragleave", () => {
      this.inputEl.removeClass("claude-code-input-dragover");
    });
    this.inputEl.addEventListener("drop", async (event) => {
      var _a;
      event.preventDefault();
      this.inputEl.removeClass("claude-code-input-dragover");
      const transfer = event.dataTransfer;
      if (!transfer)
        return;
      console.debug("Drop event types:", transfer.types);
      const TEXT_EXTENSIONS = /* @__PURE__ */ new Set([
        "md",
        "txt",
        "js",
        "ts",
        "jsx",
        "tsx",
        "py",
        "rs",
        "go",
        "java",
        "c",
        "cpp",
        "h",
        "hpp",
        "cs",
        "php",
        "rb",
        "swift",
        "kt",
        "scala",
        "json",
        "yaml",
        "yml",
        "toml",
        "xml",
        "html",
        "css",
        "scss",
        "less",
        "sh",
        "bash",
        "zsh",
        "fish",
        "ps1",
        "sql",
        "graphql",
        "wsdl",
        "rss"
      ]);
      const isTextFile = (fileName) => {
        var _a2;
        if (!fileName)
          return false;
        const ext = (_a2 = fileName.split(".").pop()) == null ? void 0 : _a2.toLowerCase();
        if (!ext)
          return false;
        return TEXT_EXTENSIONS.has(ext);
      };
      for (const type of transfer.types) {
        try {
          const data = transfer.getData(type);
          console.debug(`Data for type "${type}":`, data);
          if (typeof data === "string" && data.startsWith("obsidian://open?")) {
            try {
              const url = new URL(data);
              const filePath = url.searchParams.get("file");
              if (filePath) {
                const decodedPath = decodeURIComponent(filePath);
                console.debug("Obsidian file path:", decodedPath);
                const fileName = decodedPath.split("/").pop() || decodedPath;
                const file = this.app.vault.getMarkdownFiles().find(
                  (f) => f.basename === fileName || f.path === decodedPath || f.path.endsWith(decodedPath)
                );
                if (file) {
                  this.addMentionedItem({
                    type: "file",
                    name: file.basename,
                    path: file.path
                  });
                  new import_obsidian2.Notice(this.plugin.tf("addedFile", { name: file.basename }));
                  return;
                }
                const allFiles = this.app.vault.getFiles();
                const textFile = allFiles.find(
                  (f) => f.basename === fileName || f.path === decodedPath || f.path.endsWith(decodedPath)
                );
                if (textFile && isTextFile(textFile.path)) {
                  this.addMentionedItem({
                    type: "file",
                    name: textFile.basename,
                    path: textFile.path
                  });
                  new import_obsidian2.Notice(this.plugin.tf("addedFile", { name: textFile.basename }));
                  return;
                }
                console.debug("File not found in vault:", decodedPath);
              }
            } catch (e) {
              console.error("Failed to parse Obsidian URI:", e);
            }
          }
          if (typeof data === "string") {
            const abstractFile = this.app.vault.getAbstractFileByPath(data);
            if (abstractFile && "children" in abstractFile) {
              const folderFiles = this.scanFolder(data);
              if (folderFiles.length > 0) {
                const folderName = data.split("/").pop() || data;
                this.addMentionedItem({
                  type: "folder",
                  name: folderName,
                  path: data,
                  files: folderFiles
                });
                new import_obsidian2.Notice(`\u5DF2\u6DFB\u52A0\u6587\u4EF6\u5939: ${folderName} (${folderFiles.length} \u4E2A\u6587\u4EF6)`);
                return;
              }
              new import_obsidian2.Notice(`\u6587\u4EF6\u5939 ${data} \u4E2D\u6CA1\u6709\u652F\u6301\u7684\u6587\u672C\u6587\u4EF6`);
              return;
            }
            if (data.endsWith(".md") || isTextFile(data)) {
              const fileName = data.split(/[/\\]/).pop() || data;
              const file = this.app.vault.getMarkdownFiles().find(
                (f) => f.path === data || f.path.endsWith(data) || f.basename === fileName.replace(/\.[^/.]+$/, "")
              );
              if (file) {
                this.addMentionedItem({
                  type: "file",
                  name: file.basename,
                  path: file.path
                });
                new import_obsidian2.Notice(this.plugin.tf("addedFile", { name: file.basename }));
                return;
              }
            }
          }
        } catch (e) {
          console.debug(`Cannot read type "${type}":`, e);
        }
      }
      const files = transfer.files;
      console.debug("Files from File API:", files);
      if (files && files.length > 0) {
        for (const file of Array.from(files)) {
          console.debug("Processing file:", file.name);
          if (!isTextFile(file.name)) {
            new import_obsidian2.Notice(this.plugin.t("unsupportedFileType"));
            continue;
          }
          const vaultFile = this.app.vault.getMarkdownFiles().find(
            (f) => f.basename === file.name.replace(/\.[^/.]+$/, "")
          );
          if (vaultFile) {
            this.addMentionedItem({
              type: "file",
              name: vaultFile.basename,
              path: vaultFile.path
            });
            new import_obsidian2.Notice(this.plugin.tf("addedFile", { name: vaultFile.basename }));
          } else {
            new import_obsidian2.Notice(this.plugin.t("unsupportedFileType"));
          }
        }
      }
      if (transfer.items) {
        for (let i = 0; i < transfer.items.length; i++) {
          const item = transfer.items[i];
          if (item.kind === "file") {
            const entry = (_a = item.webkitGetAsEntry) == null ? void 0 : _a.call(item);
            if (entry && entry.isDirectory) {
              const folderName = entry.fullPath.substring(1).split("/")[0];
              const folderPath = folderName;
              const folderFiles = await this.scanFolder(folderPath);
              if (folderFiles.length > 0) {
                this.addMentionedItem({
                  type: "folder",
                  name: folderName,
                  path: folderPath,
                  files: folderFiles
                });
                new import_obsidian2.Notice(`\u5DF2\u6DFB\u52A0\u6587\u4EF6\u5939: ${folderName} (${folderFiles.length} \u4E2A\u6587\u4EF6)`);
              } else {
                new import_obsidian2.Notice(`\u6587\u4EF6\u5939 ${folderName} \u4E2D\u6CA1\u6709\u652F\u6301\u7684\u6587\u672C\u6587\u4EF6`);
              }
              return;
            }
          }
        }
      }
    });
    this.includeNoteEl.addEventListener("change", async () => {
      this.plugin.settings.includeCurrentNote = this.includeNoteEl.checked;
      await this.plugin.saveSettings();
    });
    this.sendBtn.addEventListener("click", () => void this.handleSend());
    clearBtn.addEventListener("click", () => this.clearChat());
    this.assistantSelectEl.addEventListener("change", (e) => {
      void (async () => {
        const target = e.target;
        await this.switchAssistant(target.value);
      })();
    });
    this.topicSelectEl.addEventListener("change", (e) => {
      void (async () => {
        const target = e.target;
        await this.switchTopic(target.value);
      })();
    });
    this.newTopicBtn.addEventListener("click", () => {
      void this.createTopic();
    });
    this.deleteTopicBtn.addEventListener("click", () => {
      void this.deleteTopic();
    });
    if (this.plugin.settings.topics.length === 0) {
      await this.createTopic();
    } else {
      const currentTopicId = this.plugin.settings.currentTopicId;
      if (currentTopicId) {
        const topic = this.plugin.settings.topics.find((t2) => t2.id === currentTopicId);
        if (topic) {
          this.messages = [...topic.messages];
        }
      }
    }
    this.renderAssistantSelector();
    this.renderModelSelector();
    this.renderThinkingSelector();
    this.renderTopicSelector();
    this.loaded = true;
    this.renderMessages();
    this.boundEscKeyHandler = this.handleEscKey.bind(this);
    document.addEventListener("keydown", this.boundEscKeyHandler);
  }
  async onClose() {
    if (this.boundEscKeyHandler) {
      document.removeEventListener("keydown", this.boundEscKeyHandler);
      this.boundEscKeyHandler = null;
    }
    await this.saveCurrentTopic();
    this.stopStreamRenderTimer();
    this.loaded = false;
  }
  /** 处理 ESC 键按下事件 - 打断正在进行的发送 */
  handleEscKey(e) {
    if (e.key === "Escape" && !e.isComposing && this.isSending) {
      e.preventDefault();
      e.stopPropagation();
      this.interruptSending();
    }
  }
  async handleSend() {
    var _a, _b;
    if (this.isSending) {
      this.interruptSending();
      return;
    }
    const content = this.inputEl.value.trim();
    if (!content && this.mentionedItems.length === 0) {
      return;
    }
    this.inputEl.value = "";
    this.isSending = true;
    this.updateSendButtonState();
    let messageContent = content;
    if (this.mentionedItems.length > 0) {
      const itemList = this.mentionedItems.map((item) => {
        var _a2;
        if (item.type === "folder") {
          return `@${item.name} (${((_a2 = item.files) == null ? void 0 : _a2.length) || 0} \u4E2A\u6587\u4EF6)`;
        }
        return `@${item.name}`;
      }).join(", ");
      messageContent = `${itemList}

${content}`;
    }
    this.addMessage({
      role: "user",
      content: messageContent,
      originalInput: content
    });
    await this.updateTopicTitle();
    const filesToTrack = [];
    for (const item of this.mentionedItems) {
      if (item.type === "folder" && item.files) {
        filesToTrack.push(...item.files);
      } else if (item.type === "file") {
        const file = this.app.vault.getFiles().find((f) => f.path === item.path);
        if (file)
          filesToTrack.push(file);
      }
    }
    if (this.includeNoteEl.checked) {
      const activeFile = this.getActiveFile();
      if (activeFile && !filesToTrack.some((f) => f.path === activeFile.path)) {
        filesToTrack.push(activeFile);
      }
    }
    const beforeTimestamp = Date.now();
    const fileSnapshots = /* @__PURE__ */ new Map();
    for (const file of filesToTrack) {
      try {
        fileSnapshots.set(file.path, await this.app.vault.read(file));
      } catch (e) {
      }
    }
    const prompt = await this.buildPrompt(content);
    this.clearMentionTags();
    const pendingMessage = {
      role: "assistant",
      content: "",
      streamContent: "",
      isPending: true,
      thinkingStartTime: Date.now(),
      flavorText: FLAVOR_TEXTS[Math.floor(Math.random() * FLAVOR_TEXTS.length)]
    };
    this.messages.push(pendingMessage);
    this.renderMessages();
    this.scrollToBottom();
    this.startStreamRenderTimer();
    try {
      const reply = await this.runClaudeCommand(prompt, (chunk) => {
        if (!pendingMessage.isPending)
          return;
        if (!this.messages.includes(pendingMessage))
          return;
        pendingMessage.streamContent += chunk;
        this.updateStreamingContent(chunk);
      });
      if (pendingMessage.thinkingStartTime) {
        pendingMessage.thinkingDuration = Math.floor(
          (Date.now() - pendingMessage.thinkingStartTime) / 1e3
        );
      }
      const { content: parsedContent, thinking } = this.parseThinkingFromResponse(reply || "");
      const trimmedReply = parsedContent.trim();
      if (!trimmedReply && !thinking) {
        pendingMessage.content = this.plugin.t("emptyResponse");
        pendingMessage.isError = true;
      } else {
        if (thinking) {
          pendingMessage.thinkingContent = thinking;
        }
        const extracted = extractTasksFromReply(trimmedReply);
        const cleanedContent = extracted.content.trim();
        if (!cleanedContent && (!extracted.tasks || extracted.tasks.length === 0)) {
          pendingMessage.content = this.plugin.t("emptyResponse");
          pendingMessage.isError = true;
        } else {
          pendingMessage.content = cleanedContent || this.plugin.t("emptyResponse");
        }
        if (extracted.tasks && extracted.tasks.length > 0) {
          pendingMessage.tasks = extracted.tasks;
        }
      }
      const streamSnapshot = (_b = (_a = pendingMessage.streamContent) == null ? void 0 : _a.trim()) != null ? _b : "";
      if (!pendingMessage.thinkingContent && streamSnapshot) {
        const thinkingSegments = this.extractThinkingSegmentsFromStream(streamSnapshot);
        const rawThinking = thinkingSegments.length ? thinkingSegments.join("\n\n") : this.stripThinkingTagsFromStream(streamSnapshot);
        const cliPrelude = this.extractCliPrelude(rawThinking, pendingMessage.content);
        if (cliPrelude) {
          pendingMessage.thinkingContent = cliPrelude;
        }
      }
      pendingMessage.isPending = false;
      pendingMessage.streamContent = void 0;
      this.currentStreamingContentEl = null;
      this.stopStreamRenderTimer();
      const modifications = [];
      for (const file of filesToTrack) {
        const beforeContent = fileSnapshots.get(file.path);
        if (!beforeContent)
          continue;
        try {
          const afterContent = await this.app.vault.read(file);
          if (afterContent !== beforeContent) {
            modifications.push({
              filePath: file.path,
              originalContent: beforeContent,
              file,
              timestamp: beforeTimestamp
            });
          }
        } catch (e) {
        }
      }
      if (modifications.length > 0) {
        pendingMessage.fileModifications = modifications;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : this.plugin.t("failedRunCommand");
      pendingMessage.content = this.plugin.tf("claudeConnectionError", {
        message
      });
      pendingMessage.isError = true;
      pendingMessage.isPending = false;
      pendingMessage.streamContent = void 0;
      this.currentStreamingContentEl = null;
      this.stopStreamRenderTimer();
    }
    this.renderMessages();
    this.scrollToBottom();
    await this.saveCurrentTopic();
    this.isSending = false;
    this.updateSendButtonState();
  }
  updateSendButtonState() {
    if (this.isSending) {
      this.sendBtn.textContent = this.plugin.t("sendInterrupt");
      this.sendBtn.removeClass("mod-cta");
      this.inputEl.disabled = true;
    } else {
      this.sendBtn.textContent = this.plugin.t("send");
      this.sendBtn.addClass("mod-cta");
      this.inputEl.disabled = false;
    }
  }
  interruptSending() {
    if (this.currentProcess) {
      this.currentProcess.kill("SIGTERM");
      this.currentProcess = null;
    }
    this.currentStreamingContentEl = null;
    this.stopTypewriter();
    this.typewriterBuffer = [];
    const lastMessage = this.messages[this.messages.length - 1];
    if (lastMessage && lastMessage.isPending) {
      this.messages.pop();
      this.renderMessages();
    }
    this.isSending = false;
    this.updateSendButtonState();
    this.stopStreamRenderTimer();
  }
  clearChat() {
    this.messages = [];
    this.renderMessages();
    void this.saveCurrentTopic();
  }
  addMessage(message) {
    this.messages.push(message);
    this.renderMessages();
    this.scrollToBottom();
  }
  scheduleStreamRender() {
    if (this.streamRenderScheduled) {
      return;
    }
    this.streamRenderScheduled = true;
    requestAnimationFrame(() => {
      this.streamRenderScheduled = false;
      void this.renderMessages();
      this.scrollToBottom();
    });
  }
  startStreamRenderTimer() {
    if (this.streamRenderTimer) {
      return;
    }
    this.streamRenderTimer = setInterval(() => {
      if (!this.isSending) {
        this.stopStreamRenderTimer();
        return;
      }
      this.updatePendingMessageTimers();
    }, 1e3);
  }
  stopStreamRenderTimer() {
    if (this.streamRenderTimer) {
      clearInterval(this.streamRenderTimer);
      this.streamRenderTimer = null;
    }
    this.stopTypewriter();
    this.typewriterBuffer = [];
    for (const msg of this.messages) {
      if (msg.isPending && msg.timerInterval) {
        clearInterval(msg.timerInterval);
        msg.timerInterval = void 0;
        msg.timerElement = void 0;
      }
    }
  }
  /** 更新所有 pending 消息的计时器显示（不重新渲染） */
  updatePendingMessageTimers() {
    for (const msg of this.messages) {
      if (!msg.isPending || !msg.thinkingStartTime || !msg.timerElement) {
        continue;
      }
      if (!msg.timerElement.isConnected) {
        if (msg.timerInterval) {
          clearInterval(msg.timerInterval);
          msg.timerInterval = void 0;
          msg.timerElement = void 0;
        }
        continue;
      }
      const elapsedSeconds = Math.floor((Date.now() - msg.thinkingStartTime) / 1e3);
      msg.timerElement.setText(` (${this.plugin.t("thinkingIndicatorHint")} \xB7 ${this.formatDurationMmSs(elapsedSeconds)})`);
    }
  }
  /** 获取或创建流式内容元素（用于打字机效果） */
  getOrCreateStreamingContentEl() {
    const lastMessage = this.messages[this.messages.length - 1];
    if (!lastMessage || !lastMessage.isPending)
      return null;
    const messageEls = this.messagesEl.querySelectorAll(".claude-code-message");
    const lastMsgEl = messageEls[messageEls.length - 1];
    if (!lastMsgEl)
      return null;
    const contentEl = lastMsgEl.querySelector(".claude-code-content");
    if (!contentEl)
      return null;
    const indicator = contentEl.querySelector(".claude-code-thinking-indicator");
    if (indicator) {
      indicator.style.display = "none";
    }
    let streamingEl = contentEl.querySelector(".claude-code-streaming");
    if (!streamingEl) {
      streamingEl = contentEl.createDiv("claude-code-streaming");
    }
    let preEl = streamingEl.querySelector("pre");
    if (!preEl) {
      preEl = streamingEl.createEl("pre");
      preEl.textContent = "";
    }
    return streamingEl;
  }
  /** 更新流式内容（打字机效果，不重新渲染整个消息列表） */
  updateStreamingContent(chunk) {
    console.debug("[Typewriter] Received chunk:", chunk.length, "chars");
    if (!this.currentStreamingContentEl) {
      this.currentStreamingContentEl = this.getOrCreateStreamingContentEl();
      if (!this.currentStreamingContentEl) {
        console.error("[Typewriter] Failed to get streaming element");
        return;
      }
    }
    if (!this.currentStreamingContentEl.isConnected) {
      console.error("[Typewriter] Streaming element disconnected");
      this.currentStreamingContentEl = null;
      return;
    }
    this.typewriterBuffer.push(...chunk.split(""));
    console.debug("[Typewriter] Buffer size:", this.typewriterBuffer.length);
    if (!this.typewriterTimer) {
      console.debug("[Typewriter] Starting timer");
      this.startTypewriter();
    }
  }
  /** 启动打字机效果计时器 */
  startTypewriter() {
    if (this.typewriterTimer)
      return;
    console.debug("[Typewriter] Starting smooth typewriter");
    const typewriterLoop = () => {
      if (this.typewriterBuffer.length === 0) {
        console.debug("[Typewriter] Buffer empty, stopping");
        this.stopTypewriter();
        return;
      }
      if (!this.currentStreamingContentEl || !this.currentStreamingContentEl.isConnected) {
        console.error("[Typewriter] Element disconnected, stopping");
        this.stopTypewriter();
        return;
      }
      const preEl = this.currentStreamingContentEl.querySelector("pre");
      if (!preEl) {
        this.stopTypewriter();
        return;
      }
      const bufferSize = this.typewriterBuffer.length;
      let charsToShow = 1;
      if (bufferSize > 100) {
        charsToShow = 4;
      } else if (bufferSize > 50) {
        charsToShow = 2;
      } else if (bufferSize > 20) {
        charsToShow = 1;
      } else {
        charsToShow = Math.random() > 0.5 ? 1 : 2;
      }
      const chars = this.typewriterBuffer.splice(0, Math.min(charsToShow, bufferSize));
      preEl.textContent += chars.join("");
      const newBufferSize = this.typewriterBuffer.length;
      let nextDelay = 15;
      if (newBufferSize > 100) {
        nextDelay = 10;
      } else if (newBufferSize > 50) {
        nextDelay = 15;
      } else if (newBufferSize > 20) {
        nextDelay = 20;
      } else {
        nextDelay = 25 + Math.random() * 15;
      }
      this.typewriterTimer = setTimeout(typewriterLoop, nextDelay);
      this.scrollToBottom();
    };
    this.typewriterTimer = setTimeout(typewriterLoop, 10);
  }
  /** 停止打字机效果计时器 */
  stopTypewriter() {
    if (this.typewriterTimer) {
      clearTimeout(this.typewriterTimer);
      this.typewriterTimer = null;
    }
  }
  async buildPrompt(userInput) {
    const parts = [];
    const currentAssistant = this.plugin.settings.assistantPresets.find(
      (a) => a.id === this.plugin.settings.currentAssistantId
    );
    const system = ((currentAssistant == null ? void 0 : currentAssistant.systemPrompt) || this.plugin.settings.defaultPrompt).trim();
    const systemParts = [];
    if (system) {
      systemParts.push(system);
    }
    if (this.plugin.settings.enableTaskTracking) {
      const taskPrompt = this.plugin.t("taskTrackingPrompt").trim();
      if (taskPrompt) {
        systemParts.push(taskPrompt);
      }
    }
    const budgetSetting = this.plugin.settings.thinkingBudget;
    const budgetInfo = THINKING_BUDGETS.find((budget) => budget.value === budgetSetting);
    if (budgetInfo && budgetInfo.tokens > 0) {
      systemParts.push(
        `Thinking budget: ${budgetInfo.label} (${budgetInfo.tokens} tokens)`
      );
    }
    if (systemParts.length > 0) {
      parts.push(`[System]
${systemParts.join("\n\n")}`);
    }
    if (this.mentionedItems.length > 0) {
      for (const item of this.mentionedItems) {
        if (item.type === "folder" && item.files) {
          parts.push(`[@ \u6587\u4EF6\u5939: ${item.name} (${item.files.length} \u4E2A\u6587\u4EF6)]`);
          for (const file of item.files) {
            try {
              const content = await this.app.vault.read(file);
              parts.push(`[\u6587\u4EF6: ${file.path}]
${content}`);
            } catch (e) {
              parts.push(`[\u6587\u4EF6: ${file.path}]
(\u65E0\u6CD5\u8BFB\u53D6\u6587\u4EF6)`);
            }
          }
        } else if (item.type === "file") {
          const file = this.app.vault.getFiles().find((f) => f.path === item.path);
          if (file) {
            try {
              const content = await this.app.vault.read(file);
              parts.push(`[@ ${file.path}]
${content}`);
            } catch (e) {
              parts.push(`[@ ${file.path}]
(\u65E0\u6CD5\u8BFB\u53D6\u6587\u4EF6)`);
            }
          }
        }
      }
    }
    if (this.includeNoteEl.checked) {
      const activeFile = this.getActiveFile();
      if (!activeFile) {
        return parts.join("\n\n");
      }
      const alreadyIncluded = this.mentionedItems.some((item) => {
        if (item.type === "file")
          return item.path === activeFile.path;
        if (item.type === "folder" && item.files) {
          return item.files.some((f) => f.path === activeFile.path);
        }
        return false;
      });
      if (!alreadyIncluded) {
        try {
          const noteText = await this.app.vault.read(activeFile);
          parts.push(`[@ Current note: ${activeFile.path}]
${noteText}`);
        } catch (e) {
          parts.push(`[@ Current note: ${activeFile.path}]
(\u65E0\u6CD5\u8BFB\u53D6\u6587\u4EF6)`);
        }
      }
    }
    const history = this.messages.filter((msg) => msg.role !== "system").map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`).join("\n\n");
    if (history) {
      parts.push(`[Conversation]
${history}`);
    }
    parts.push(`[User]
${userInput}`);
    return parts.join("\n\n");
  }
  getSelectedModel() {
    var _a;
    const selected = (_a = this.plugin.settings.model) == null ? void 0 : _a.trim();
    return selected || DEFAULT_CLAUDE_MODELS[0].value;
  }
  injectModelOption(command, model) {
    if (!model) {
      return command;
    }
    if (/(^|\s)--model(?:=|\s)/.test(command)) {
      return command;
    }
    return `${command} --model ${model}`;
  }
  runClaudeCommand(prompt, onChunk) {
    const configured = this.plugin.settings.claudeCommand.trim();
    const preferredClaude = this.plugin.settings.claudePath.trim();
    const edition = this.plugin.settings.claudeEdition;
    const normalized = normalizeCommand(configured);
    const detectedClaude = configured ? "" : findClaudeBinary(preferredClaude, edition);
    const selectedModel = this.getSelectedModel();
    const basePath = this.getVaultBasePath();
    const cwd = this.plugin.settings.workingDir.trim() || basePath || void 0;
    const gitBashPath = this.plugin.settings.gitBashPath.trim();
    const env = buildEnv(this.plugin.settings.nodePath.trim(), gitBashPath);
    const timeoutMs = resolveClaudeTimeoutMs(env);
    console.debug("[Niki AI] Running Claude command:");
    console.debug("  Configured:", configured || "(empty)");
    console.debug("  Claude path:", preferredClaude || "(auto-detect)");
    console.debug("  Claude edition:", edition);
    console.debug("  Node path:", this.plugin.settings.nodePath.trim() || "(auto-detect)");
    console.debug("  Git Bash path:", gitBashPath || "(auto-detect/not set)");
    console.debug("  Detected claude:", detectedClaude || "(not found)");
    console.debug("  Normalized:", normalized || "(empty)");
    console.debug("  Model:", selectedModel || "(default)");
    console.debug("  Working dir:", cwd || "(default)");
    console.debug("  PATH:", env.PATH ? env.PATH.substring(0, 200) + "..." : "(not set)");
    if (normalized) {
      const hasPlaceholder = normalized.includes("{prompt}");
      const finalCommand = hasPlaceholder ? replacePlaceholder(normalized, prompt) : normalized;
      const commandWithModel = this.injectModelOption(finalCommand, selectedModel);
      console.debug("[Niki AI] Using configured command");
      console.debug("  Has placeholder:", hasPlaceholder);
      console.debug(
        "  Final command:",
        commandWithModel.substring(0, 200) + (commandWithModel.length > 200 ? "..." : "")
      );
      const isWindows = process.platform === "win32";
      const firstToken = normalized.trim().split(/\s+/)[0].replace(/^["']|["']$/g, "");
      const isDirectCmdFile = isWindows && (firstToken.toLowerCase().endsWith(".cmd") || firstToken.toLowerCase().endsWith(".bat"));
      const shell = gitBashPath && isDirectCmdFile ? gitBashPath : isDirectCmdFile;
      return new Promise((resolve, reject) => {
        const child = (0, import_child_process.exec)(
          commandWithModel,
          {
            cwd,
            maxBuffer: 1024 * 1024 * 10,
            env,
            timeout: timeoutMs,
            shell
          },
          (error, stdout, stderr) => {
            this.currentProcess = null;
            if (error) {
              console.error("[Niki AI] Command failed:");
              console.error("  Error code:", error.code);
              console.error("  Error message:", error.message);
              console.error("  Signal:", error.signal);
              console.error("  Stderr:", stderr);
              console.error("  Stdout:", stdout ? stdout.substring(0, 500) : "(empty)");
              console.error(
                "  Shell:",
                typeof shell === "string" ? shell : shell ? "(default)" : "(none)"
              );
              reject(new Error(streamBuffers.getCombined() || stderr || error.message));
              return;
            }
            const streamedOutput = streamBuffers.getCombined();
            console.debug(
              "[Niki AI] Command succeeded, output length:",
              (streamedOutput || stdout || stderr).length
            );
            resolve(streamedOutput || sanitizeStreamOutput(stdout || stderr || ""));
          }
        );
        const streamBuffers = attachStreamBuffers(child, onChunk);
        this.currentProcess = child;
        if (!hasPlaceholder && child.stdin) {
          console.debug("[Niki AI] Writing prompt to stdin, length:", prompt.length);
          child.stdin.write(prompt);
          child.stdin.end();
        }
      });
    }
    if (detectedClaude) {
      console.debug("[Niki AI] Using auto-detected Claude:", detectedClaude);
      const isWindows = process.platform === "win32";
      const isCmdFile = detectedClaude.endsWith(".cmd") || detectedClaude.endsWith(".bat");
      if (isWindows && isCmdFile) {
        console.debug("[Niki AI] Windows .cmd file detected, using shell execution");
        return new Promise((resolve, reject) => {
          const commandWithModel = this.injectModelOption(
            `"${detectedClaude}"`,
            selectedModel
          );
          const child = (0, import_child_process.exec)(
            commandWithModel,
            { cwd, maxBuffer: 1024 * 1024 * 10, env, timeout: timeoutMs, shell: true },
            (error, stdout, stderr) => {
              this.currentProcess = null;
              if (error) {
                console.error("[Niki AI] Command failed (Windows .cmd):");
                console.error("  Error code:", error.code);
                console.error("  Error message:", error.message);
                console.error("  Signal:", error.signal);
                console.error("  Stderr:", stderr);
                console.error("  Stdout:", stdout ? stdout.substring(0, 500) : "(empty)");
                reject(new Error(streamBuffers.getCombined() || stderr || error.message));
                return;
              }
              const streamedOutput = streamBuffers.getCombined();
              console.debug(
                "[Niki AI] Command succeeded, output length:",
                (streamedOutput || stdout || stderr).length
              );
              resolve(streamedOutput || sanitizeStreamOutput(stdout || stderr || ""));
            }
          );
          const streamBuffers = attachStreamBuffers(child, onChunk);
          this.currentProcess = child;
          if (child.stdin) {
            child.stdin.write(prompt);
            child.stdin.end();
          }
        });
      }
      const useNodeShim = isNodeScript(detectedClaude);
      if (useNodeShim) {
        console.debug(
          "[Niki AI] Using shell execution for Node.js script (preserves environment)"
        );
        return new Promise((resolve, reject) => {
          const commandWithModel = this.injectModelOption(
            `"${detectedClaude}"`,
            selectedModel
          );
          const child = (0, import_child_process.exec)(
            commandWithModel,
            { cwd, maxBuffer: 1024 * 1024 * 10, env, timeout: timeoutMs, shell: true },
            (error, stdout, stderr) => {
              this.currentProcess = null;
              if (error) {
                console.error("[Niki AI] Command failed (shell exec):");
                console.error("  Error code:", error.code);
                console.error("  Error message:", error.message);
                console.error("  Signal:", error.signal);
                console.error("  Stderr:", stderr);
                console.error("  Stdout:", stdout ? stdout.substring(0, 500) : "(empty)");
                reject(new Error(streamBuffers.getCombined() || stderr || error.message));
                return;
              }
              const streamedOutput = streamBuffers.getCombined();
              console.debug(
                "[Niki AI] Command succeeded, output length:",
                (streamedOutput || stdout || stderr).length
              );
              resolve(streamedOutput || sanitizeStreamOutput(stdout || stderr || ""));
            }
          );
          const streamBuffers = attachStreamBuffers(child, onChunk);
          this.currentProcess = child;
          if (child.stdin) {
            child.stdin.write(prompt);
            child.stdin.end();
          }
        });
      }
      const systemNode = findNodeBinary(this.plugin.settings.nodePath.trim());
      const command = systemNode || process.execPath;
      const args = [detectedClaude];
      if (selectedModel) {
        args.push("--model", selectedModel);
      }
      console.debug("[Niki AI] Execution details:");
      console.debug("  Command:", command);
      console.debug("  Args:", args);
      return new Promise((resolve, reject) => {
        const child = (0, import_child_process.execFile)(
          command,
          args,
          { cwd, maxBuffer: 1024 * 1024 * 10, env, timeout: timeoutMs },
          (error, stdout, stderr) => {
            this.currentProcess = null;
            if (error) {
              console.error("[Niki AI] Command failed (execFile):");
              console.error("  Error code:", error.code);
              console.error("  Error message:", error.message);
              console.error("  Signal:", error.signal);
              console.error("  Stderr:", stderr);
              console.error("  Stdout:", stdout ? stdout.substring(0, 500) : "(empty)");
              reject(new Error(streamBuffers.getCombined() || stderr || error.message));
              return;
            }
            const streamedOutput = streamBuffers.getCombined();
            console.debug(
              "[Niki AI] Command succeeded, output length:",
              (streamedOutput || stdout || stderr).length
            );
            resolve(streamedOutput || sanitizeStreamOutput(stdout || stderr || ""));
          }
        );
        const streamBuffers = attachStreamBuffers(child, onChunk);
        this.currentProcess = child;
        if (child.stdin) {
          child.stdin.write(prompt);
          child.stdin.end();
        }
      });
    }
    console.error("[Niki AI] Claude CLI not found!");
    console.error("  Configured:", configured || "(empty)");
    console.error("  Preferred path:", preferredClaude || "(empty)");
    new import_obsidian2.Notice(this.plugin.t("claudeNotFoundNotice"));
    return Promise.resolve(this.plugin.t("claudeNotFoundReply"));
  }
  getActiveFile() {
    const file = this.app.workspace.getActiveFile();
    return file != null ? file : null;
  }
  getVaultBasePath() {
    var _a;
    const adapter = this.app.vault.adapter;
    if ("getBasePath" in adapter && typeof adapter.getBasePath === "function") {
      return (_a = adapter.getBasePath()) != null ? _a : null;
    }
    return null;
  }
  async insertIntoActiveFile(content) {
    const file = this.getActiveFile();
    if (!file) {
      new import_obsidian2.Notice(this.plugin.t("noActiveNote"));
      return;
    }
    const existing = await this.app.vault.read(file);
    await this.app.vault.modify(file, `${existing}

${content.trim()}
`);
    new import_obsidian2.Notice(this.plugin.tf("insertedInto", { path: file.path }));
  }
  async copyToClipboard(content) {
    var _a;
    if ((_a = navigator == null ? void 0 : navigator.clipboard) == null ? void 0 : _a.writeText) {
      await navigator.clipboard.writeText(content);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = content;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      void document.execCommand("copy");
      textarea.remove();
    }
  }
  async renderMessages() {
    var _a, _b;
    if (!this.loaded) {
      return;
    }
    this.messagesEl.empty();
    if (this.messages.length === 0) {
      const empty = this.messagesEl.createDiv("claude-code-empty");
      empty.createDiv({ text: "Niki AI", cls: "claude-code-empty-title" });
      empty.createDiv({
        text: this.plugin.t("emptyState"),
        cls: "claude-code-empty-subtitle"
      });
      return;
    }
    for (const message of this.messages) {
      const wrapper = this.messagesEl.createDiv("claude-code-message");
      wrapper.addClass(`is-${message.role}`);
      if (message.isError) {
        wrapper.addClass("is-error");
      }
      if (message.isPending) {
        wrapper.addClass("is-pending");
      }
      const contentEl = wrapper.createDiv("claude-code-content");
      if (message.isPending) {
        const streamContent = (_b = (_a = message.streamContent) != null ? _a : message.content) != null ? _b : "";
        const elapsedSeconds = message.thinkingStartTime ? Math.floor((Date.now() - message.thinkingStartTime) / 1e3) : 0;
        const hasStream = streamContent.trim().length > 0;
        if (!hasStream) {
          const indicator = contentEl.createDiv("claude-code-thinking-indicator");
          const logoSpan = indicator.createSpan({ cls: "claude-code-thinking-icon" });
          const logoSvg = logoSpan.createSvg("svg");
          logoSvg.setAttribute("viewBox", LOGO_SVG.viewBox);
          logoSvg.setAttribute("width", LOGO_SVG.width);
          logoSvg.setAttribute("height", LOGO_SVG.height);
          const logoPath = logoSvg.createSvg("path");
          logoPath.setAttribute("d", LOGO_SVG.path);
          logoPath.setAttribute("fill", LOGO_SVG.fill);
          indicator.createSpan({
            cls: "claude-code-thinking-indicator-text",
            text: ` ${message.flavorText || "Thinking..."}`
          });
          const timerSpan = indicator.createSpan({
            cls: "claude-code-thinking-indicator-hint"
          });
          const initialText = ` (${this.plugin.t("thinkingIndicatorHint")} \xB7 ${this.formatDurationMmSs(elapsedSeconds)})`;
          timerSpan.setText(initialText);
          message.timerElement = timerSpan;
          if (message.thinkingStartTime) {
            const updateTimer = () => {
              if (!timerSpan.isConnected) {
                if (message.timerInterval) {
                  clearInterval(message.timerInterval);
                  message.timerInterval = void 0;
                }
                return;
              }
              const elapsed = Math.floor((Date.now() - (message.thinkingStartTime || Date.now())) / 1e3);
              timerSpan.setText(` (${this.plugin.t("thinkingIndicatorHint")} \xB7 ${this.formatDurationMmSs(elapsed)})`);
            };
            updateTimer();
            message.timerInterval = setInterval(updateTimer, 1e3);
          }
        }
        const thinkingSegments = this.extractThinkingSegmentsFromStream(streamContent);
        if (thinkingSegments.length > 0) {
          const thinkingBlock = contentEl.createDiv("claude-code-thinking-block");
          thinkingBlock.addClass("expanded");
          const header = thinkingBlock.createDiv("claude-code-thinking-header");
          header.createSpan({
            cls: "claude-code-thinking-label",
            text: message.flavorText || "Thinking..."
          });
          const thinkingContent = thinkingBlock.createDiv("claude-code-thinking-content");
          void import_obsidian2.MarkdownRenderer.render(
            this.app,
            thinkingSegments.join("\n\n"),
            thinkingContent,
            "",
            this.plugin
          );
        }
        if (hasStream) {
          const streamingEl = contentEl.createDiv("claude-code-streaming");
          streamingEl.createEl("pre", { text: streamContent });
        }
      } else {
        if (message.thinkingContent) {
          this.renderThinkingBlock(contentEl, message);
        }
        try {
          import_obsidian2.MarkdownRenderer.render(this.app, message.content, contentEl, "", this.plugin);
        } catch (error) {
          console.error("Failed to render markdown:", error);
          contentEl.createEl("pre", { text: message.content });
        }
      }
      const actions = wrapper.createDiv("claude-code-message-actions");
      if (message.role === "assistant" && !message.isError && !message.isPending) {
        if (message.fileModifications && message.fileModifications.length > 0) {
          const undoBtn = actions.createEl("button", {
            text: this.plugin.t("undoChanges"),
            cls: "claude-code-undo-btn"
          });
          undoBtn.addEventListener("click", () => {
            void this.undoFileModifications(message);
          });
        }
        if (!message.codeChanges) {
          message.codeChanges = await this.parseCodeChanges(message);
        }
        if (message.codeChanges.length > 0) {
          const viewChangesBtn = actions.createEl("button", {
            text: message.codeChanges.some((c) => c.applied) ? this.plugin.t("changesApplied") : this.plugin.t("viewChanges")
          });
          viewChangesBtn.addEventListener("click", () => {
            void this.toggleDiffView(wrapper, message);
          });
          const hasUnapplied = message.codeChanges.some((c) => !c.applied);
          if (hasUnapplied) {
            const applyBtn = actions.createEl("button", {
              text: this.plugin.t("applyAllChanges"),
              cls: "mod-cta"
            });
            applyBtn.addEventListener("click", () => {
              void this.applyAllChanges(message);
            });
          }
        } else if (!message.fileModifications || message.fileModifications.length === 0) {
          const insertBtn = actions.createEl("button", {
            text: this.plugin.t("insertToNote")
          });
          insertBtn.addEventListener("click", () => {
            void this.insertIntoActiveFile(message.content);
          });
        }
      }
    }
    this.renderTasksPanel();
  }
  renderTasksPanel() {
    const tasks = this.getLatestTasks();
    if (!tasks || tasks.length === 0) {
      return;
    }
    const panel = this.messagesEl.createDiv("claude-code-tasks-panel");
    const header = panel.createDiv("claude-code-tasks-header");
    header.setAttribute("tabindex", "0");
    header.setAttribute("role", "button");
    const completedCount = tasks.filter((task) => task.status === "completed").length;
    const totalCount = tasks.length;
    const currentTask = tasks.find((task) => task.status === "in_progress");
    const icon = header.createSpan("claude-code-tasks-icon");
    (0, import_obsidian2.setIcon)(icon, "list-checks");
    const label = header.createSpan("claude-code-tasks-label");
    label.textContent = `${this.plugin.t("tasksLabel")} (${completedCount}/${totalCount})`;
    const current = header.createSpan("claude-code-tasks-current");
    if (currentTask) {
      current.textContent = currentTask.activeForm || currentTask.content;
    } else {
      current.style.display = "none";
    }
    const status = header.createSpan("claude-code-tasks-status");
    if (completedCount === totalCount && totalCount > 0) {
      status.addClass("is-complete");
      (0, import_obsidian2.setIcon)(status, "check");
    } else {
      status.style.display = "none";
    }
    const content = panel.createDiv("claude-code-tasks-content");
    renderTaskItems(content, tasks);
    const updateCollapsedState = () => {
      const isExpanded = this.isTasksExpanded;
      content.style.display = isExpanded ? "block" : "none";
      current.style.display = isExpanded || !currentTask ? "none" : "inline-flex";
      status.style.display = isExpanded || completedCount !== totalCount ? "none" : "inline-flex";
      const ariaKey = isExpanded ? "tasksCollapseAria" : "tasksExpandAria";
      header.setAttribute(
        "aria-label",
        this.plugin.tf(ariaKey, {
          completed: String(completedCount),
          total: String(totalCount)
        })
      );
    };
    const toggleExpanded = () => {
      this.isTasksExpanded = !this.isTasksExpanded;
      updateCollapsedState();
    };
    header.addEventListener("click", toggleExpanded);
    header.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleExpanded();
      }
    });
    updateCollapsedState();
  }
  getLatestTasks() {
    for (let i = this.messages.length - 1; i >= 0; i--) {
      const message = this.messages[i];
      if (message.role !== "assistant" || message.isPending) {
        continue;
      }
      if (message.tasks && message.tasks.length > 0) {
        return message.tasks;
      }
      const parsed = parseTasksFromText(message.content);
      if (parsed.tasks && parsed.tasks.length > 0) {
        return parsed.tasks;
      }
    }
    return null;
  }
  scrollToBottom() {
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }
  findBestMatchingFile(content) {
    const allFiles = this.app.vault.getMarkdownFiles();
    const contentLines = content.trim().split("\n").slice(0, 50);
    let bestMatch = null;
    let bestScore = 0;
    for (const file of allFiles) {
      try {
        const fileContent = this.app.vault.cachedRead(file);
        if (!fileContent)
          continue;
        const fileLines = fileContent.split("\n").slice(0, 50);
        let matchCount = 0;
        for (const line of contentLines) {
          if (line.trim().length > 5) {
            for (const fileLine of fileLines) {
              if (fileLine.trim() === line.trim()) {
                matchCount++;
                break;
              }
            }
          }
        }
        const score = matchCount / Math.max(contentLines.filter((l) => l.trim().length > 5).length, 1);
        if (score > bestScore && score > 0.3) {
          bestScore = score;
          bestMatch = file;
        }
      } catch (e) {
      }
    }
    return bestMatch;
  }
  async parseCodeChanges(message) {
    const codeChanges = [];
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    let match;
    let blockIndex = 0;
    while ((match = codeBlockRegex.exec(message.content)) !== null) {
      const [, language, content] = match;
      const targetFile = this.findBestMatchingFile(content);
      if (!targetFile)
        continue;
      const originalContent = await this.app.vault.cachedRead(targetFile);
      codeChanges.push({
        language,
        originalContent,
        newContent: content.trim(),
        blockIndex: blockIndex++,
        targetFile
      });
    }
    return codeChanges;
  }
  parseThinkingFromResponse(response) {
    const thinkingMatch = response.match(/<thinking>([\s\S]*?)<\/thinking>/i);
    if (thinkingMatch) {
      const thinking = thinkingMatch[1].trim();
      const content = response.replace(/<thinking>[\s\S]*?<\/thinking>/gi, "").trim();
      return { content, thinking };
    }
    return { content: response };
  }
  extractThinkingSegmentsFromStream(stream) {
    const segments = [];
    const regex = /<thinking>([\s\S]*?)<\/thinking>/gi;
    let match;
    while ((match = regex.exec(stream)) !== null) {
      const segment = match[1].trim();
      if (segment) {
        segments.push(segment);
      }
    }
    const openIndex = stream.lastIndexOf("<thinking>");
    const closeIndex = stream.lastIndexOf("</thinking>");
    if (openIndex !== -1 && openIndex > closeIndex) {
      const partial = stream.slice(openIndex + "<thinking>".length).trim();
      if (partial) {
        segments.push(partial);
      }
    }
    return segments;
  }
  hasOpenThinking(stream) {
    const openIndex = stream.lastIndexOf("<thinking>");
    if (openIndex === -1) {
      return false;
    }
    const closeIndex = stream.lastIndexOf("</thinking>");
    return openIndex > closeIndex;
  }
  stripThinkingTagsFromStream(stream) {
    let cleaned = stream.replace(/<thinking>[\s\S]*?<\/thinking>/gi, "");
    const openIndex = cleaned.lastIndexOf("<thinking>");
    if (openIndex !== -1) {
      cleaned = cleaned.slice(0, openIndex);
    }
    return cleaned.trim();
  }
  extractCliPrelude(stream, finalAnswer) {
    const cleaned = stream.trim();
    if (!cleaned) {
      return "";
    }
    const answer = finalAnswer.trim();
    if (!answer) {
      return cleaned;
    }
    if (cleaned.endsWith(answer)) {
      return cleaned.slice(0, cleaned.length - answer.length).trim();
    }
    const idx = cleaned.lastIndexOf(answer);
    if (idx !== -1) {
      return cleaned.slice(0, idx).trim();
    }
    return cleaned;
  }
  formatDurationMmSs(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins)}:${String(secs).padStart(2, "0")}`;
  }
  setupCollapsible(wrapperEl, headerEl, contentEl, state) {
    const toggleExpand = () => {
      state.isExpanded = !state.isExpanded;
      if (state.isExpanded) {
        wrapperEl.addClass("expanded");
        contentEl.style.display = "block";
        headerEl.setAttribute("aria-expanded", "true");
      } else {
        wrapperEl.removeClass("expanded");
        contentEl.style.display = "none";
        headerEl.setAttribute("aria-expanded", "false");
      }
    };
    headerEl.addEventListener("click", toggleExpand);
    headerEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleExpand();
      }
    });
  }
  renderThinkingBlock(parentEl, message) {
    const wrapperEl = parentEl.createDiv({ cls: "claude-code-thinking-block" });
    const header = wrapperEl.createDiv({ cls: "claude-code-thinking-header" });
    header.setAttribute("tabindex", "0");
    header.setAttribute("role", "button");
    header.setAttribute("aria-expanded", "false");
    const labelEl = header.createSpan({ cls: "claude-code-thinking-label" });
    const duration = message.thinkingDuration ? this.plugin.tf("thinkingLabel", { duration: String(message.thinkingDuration) }) : this.plugin.t("thinkingLabelShort");
    labelEl.setText(duration);
    const contentEl = wrapperEl.createDiv({ cls: "claude-code-thinking-content" });
    void import_obsidian2.MarkdownRenderer.render(this.app, message.thinkingContent || "", contentEl, "", this.plugin);
    const state = { isExpanded: false };
    this.setupCollapsible(wrapperEl, header, contentEl, state);
    return wrapperEl;
  }
  renderDiffView(container, diff, targetFile) {
    const diffContainer = container.createDiv("claude-code-diff-container");
    const header = diffContainer.createDiv("claude-code-diff-header");
    const fileLink = header.createEl("a", {
      text: targetFile.path,
      cls: "claude-code-diff-file"
    });
    fileLink.addEventListener("click", () => {
      this.app.workspace.openLinkText(targetFile.path, "", true);
    });
    fileLink.style.cursor = "pointer";
    fileLink.style.textDecoration = "underline";
    const stats = this.computeDiffStats(diff);
    header.createSpan({
      text: `+${stats.added} -${stats.removed}`,
      cls: "claude-code-diff-stats"
    });
    const diffContent = diffContainer.createDiv("claude-code-diff-content");
    diff.changes.forEach((change) => {
      const lineEl = diffContent.createDiv("claude-code-diff-line");
      lineEl.addClass(`claude-code-diff-${change.type}`);
      const lineNumEl = lineEl.createDiv("claude-code-diff-line-num");
      lineNumEl.setText(
        change.type === "removed" ? `${change.originalLine}` : change.type === "added" ? `${change.newLine}` : `${change.originalLine} \u2192 ${change.newLine}`
      );
      const contentEl = lineEl.createDiv("claude-code-diff-line-content");
      contentEl.setText(change.content);
    });
  }
  computeDiffStats(diff) {
    return diff.changes.reduce(
      (stats, change) => {
        if (change.type === "added")
          stats.added++;
        else if (change.type === "removed")
          stats.removed++;
        return stats;
      },
      { added: 0, removed: 0 }
    );
  }
  toggleDiffView(wrapper, message) {
    let diffContainer = wrapper.querySelector(".claude-code-diff-container");
    if (diffContainer) {
      diffContainer.toggleClass("claude-code-diff-hidden");
      return;
    }
    if (!message.codeChanges || message.codeChanges.length === 0)
      return;
    const codeChange = message.codeChanges[0];
    if (!codeChange.targetFile)
      return;
    const diff = computeDiff(codeChange.originalContent, codeChange.newContent);
    this.renderDiffView(wrapper, diff, codeChange.targetFile);
  }
  async applyCodeChanges(codeChange) {
    const file = codeChange.targetFile;
    if (!file) {
      new import_obsidian2.Notice(this.plugin.t("noTargetFile"));
      return;
    }
    try {
      await this.app.vault.modify(file, codeChange.newContent);
      codeChange.applied = true;
      new import_obsidian2.Notice(this.plugin.tf("changesAppliedTo", { path: file.path }));
      this.renderMessages();
    } catch (error) {
      const message = error instanceof Error ? error.message : this.plugin.t("unknownError");
      new import_obsidian2.Notice(this.plugin.tf("failedApplyChanges", { message }));
    }
  }
  async applyAllChanges(message) {
    if (!message.codeChanges)
      return;
    for (const codeChange of message.codeChanges) {
      if (!codeChange.applied) {
        await this.applyCodeChanges(codeChange);
      }
    }
  }
  async undoFileModifications(message) {
    if (!message.fileModifications || message.fileModifications.length === 0) {
      return;
    }
    for (const mod of message.fileModifications) {
      try {
        await this.app.vault.modify(mod.file, mod.originalContent);
        new import_obsidian2.Notice(this.plugin.tf("undoSuccess", { path: mod.filePath }));
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : this.plugin.t("unknownError");
        new import_obsidian2.Notice(this.plugin.tf("undoFailed", { message: errorMsg }));
      }
    }
    message.fileModifications = [];
    this.renderMessages();
  }
  showFilePicker() {
    var _a;
    if (this.filePickerEl) {
      this.filePickerEl.remove();
    }
    const pickerAnchor = (_a = this.composerEl) != null ? _a : this.containerEl;
    this.filePickerEl = pickerAnchor.createDiv("claude-code-file-picker");
    const files = this.app.vault.getMarkdownFiles();
    const activeFile = this.getActiveFile();
    const searchInput = this.filePickerEl.createEl("input", {
      type: "text",
      placeholder: this.plugin.t("searchFilesPlaceholder"),
      cls: "claude-code-file-search"
    });
    const fileList = this.filePickerEl.createDiv("claude-code-file-list");
    const renderFileList = (filter = "") => {
      fileList.empty();
      const filteredFiles = files.filter(
        (f) => f.path.toLowerCase().includes(filter.toLowerCase())
      );
      for (const file of filteredFiles.slice(0, 10)) {
        const item = fileList.createDiv("claude-code-file-item");
        if (file === activeFile) {
          item.addClass("claude-code-file-active");
        }
        item.createSpan({
          text: file.basename,
          cls: "claude-code-file-name"
        });
        item.createSpan({
          text: file.path,
          cls: "claude-code-file-path"
        });
        item.addEventListener("click", () => {
          this.addMentionedItem({
            type: "file",
            name: file.basename,
            path: file.path
          });
          this.hideFilePicker();
        });
      }
    };
    renderFileList();
    searchInput.addEventListener("input", (e) => {
      const target = e.target;
      renderFileList(target.value);
    });
    setTimeout(() => {
      document.addEventListener("click", this.handleOutsideClick);
    }, 0);
  }
  hideFilePicker() {
    if (this.filePickerEl) {
      this.filePickerEl.remove();
      this.filePickerEl = void 0;
    }
    document.removeEventListener("click", this.handleOutsideClick);
  }
  addMentionedItem(item) {
    const exists = this.mentionedItems.some((i) => i.path === item.path);
    if (exists) {
      return;
    }
    this.mentionedItems.push(item);
    this.renderMentionTags();
    this.inputEl.focus();
  }
  removeMentionedItem(item) {
    this.mentionedItems = this.mentionedItems.filter((i) => i.path !== item.path);
    this.renderMentionTags();
  }
  renderMentionTags() {
    var _a;
    this.mentionTagsEl.empty();
    this.mentionTagsEl.toggleClass("has-tags", this.mentionedItems.length > 0);
    for (const item of this.mentionedItems) {
      const tag = this.mentionTagsEl.createDiv("claude-code-mention-tag");
      const icon = tag.createSpan({ cls: "claude-code-mention-icon" });
      if (item.type === "folder") {
        icon.setText("\u{1F4C1}");
      } else {
        icon.setText("@");
      }
      const displayName = item.type === "folder" ? `${item.name} (${((_a = item.files) == null ? void 0 : _a.length) || 0})` : item.name;
      const name = tag.createSpan({
        text: displayName,
        cls: "claude-code-mention-name"
      });
      name.setAttribute("title", item.path);
      const removeBtn = tag.createSpan({
        text: "\xD7",
        cls: "claude-code-mention-remove"
      });
      removeBtn.addEventListener("click", () => this.removeMentionedItem(item));
    }
  }
  clearMentionTags() {
    this.mentionedItems = [];
    this.renderMentionTags();
  }
  scanFolder(folderPath) {
    var _a;
    const TEXT_EXTENSIONS = /* @__PURE__ */ new Set([
      "md",
      "txt",
      "js",
      "ts",
      "jsx",
      "tsx",
      "py",
      "rs",
      "go",
      "java",
      "c",
      "cpp",
      "h",
      "hpp",
      "cs",
      "php",
      "rb",
      "swift",
      "kt",
      "scala",
      "json",
      "yaml",
      "yml",
      "toml",
      "xml",
      "html",
      "css",
      "scss",
      "less",
      "sh",
      "bash",
      "zsh",
      "fish",
      "ps1",
      "sql",
      "graphql",
      "wsdl",
      "rss"
    ]);
    const files = [];
    const allFiles = this.app.vault.getFiles();
    for (const file of allFiles) {
      if (file.path.startsWith(folderPath) || file.path.startsWith(`${folderPath}/`)) {
        const ext = (_a = file.extension) == null ? void 0 : _a.toLowerCase();
        if (ext && TEXT_EXTENSIONS.has(ext)) {
          files.push(file);
        }
      }
    }
    return files;
  }
  async switchAssistant(assistantId) {
    const assistant = this.plugin.settings.assistantPresets.find((a) => a.id === assistantId);
    if (!assistant)
      return;
    this.plugin.settings.currentAssistantId = assistantId;
    await this.plugin.saveSettings();
    this.renderAssistantSelector();
  }
  getAvailableModels() {
    var _a;
    const models = [...DEFAULT_CLAUDE_MODELS];
    const current = (_a = this.plugin.settings.model) == null ? void 0 : _a.trim();
    if (current && !models.some((model) => model.value === current)) {
      models.unshift({ value: current, label: current, description: "Custom model" });
    }
    return models;
  }
  renderModelSelector() {
    if (!this.modelSelectorEl)
      return;
    this.modelSelectorEl.empty();
    const models = this.getAvailableModels();
    const currentModel = this.plugin.settings.model || models[0].value;
    const currentInfo = models.find((model) => model.value === currentModel) || models[0];
    const button = this.modelSelectorEl.createDiv("claude-code-model-btn");
    button.createSpan({
      cls: "claude-code-model-label",
      text: (currentInfo == null ? void 0 : currentInfo.label) || "Unknown"
    });
    const chevron = button.createSpan({ cls: "claude-code-model-chevron" });
    (0, import_obsidian2.setIcon)(chevron, "chevron-down");
    const dropdown = this.modelSelectorEl.createDiv("claude-code-model-dropdown");
    for (const model of [...models].reverse()) {
      const option = dropdown.createDiv("claude-code-model-option");
      if (model.value === currentModel) {
        option.addClass("selected");
      }
      option.createSpan({ text: model.label });
      if (model.description) {
        option.setAttribute("title", model.description);
      }
      option.addEventListener("click", (event) => {
        event.stopPropagation();
        void (async () => {
          this.plugin.settings.model = model.value;
          const isDefault = DEFAULT_CLAUDE_MODELS.some(
            (candidate) => candidate.value === model.value
          );
          if (isDefault) {
            this.plugin.settings.thinkingBudget = DEFAULT_THINKING_BUDGET[model.value] || "off";
          }
          await this.plugin.saveSettings();
          this.renderModelSelector();
          this.renderThinkingSelector();
        })();
      });
    }
  }
  renderThinkingSelector() {
    if (!this.thinkingSelectorEl)
      return;
    this.thinkingSelectorEl.empty();
    this.thinkingSelectorEl.createSpan({
      cls: "claude-code-thinking-label-text",
      text: this.plugin.t("thinkingBudgetLabel")
    });
    const gears = this.thinkingSelectorEl.createDiv("claude-code-thinking-gears");
    const currentBudget = this.plugin.settings.thinkingBudget || "off";
    const currentInfo = THINKING_BUDGETS.find((budget) => budget.value === currentBudget);
    const currentEl = gears.createDiv("claude-code-thinking-current");
    currentEl.setText((currentInfo == null ? void 0 : currentInfo.label) || "Off");
    const options = gears.createDiv("claude-code-thinking-options");
    for (const budget of [...THINKING_BUDGETS].reverse()) {
      const option = options.createDiv("claude-code-thinking-gear");
      option.setText(budget.label);
      option.setAttribute(
        "title",
        budget.tokens > 0 ? `${budget.tokens.toLocaleString()} tokens` : "Disabled"
      );
      if (budget.value === currentBudget) {
        option.addClass("selected");
      }
      option.addEventListener("click", (event) => {
        event.stopPropagation();
        void (async () => {
          this.plugin.settings.thinkingBudget = budget.value;
          await this.plugin.saveSettings();
          this.renderThinkingSelector();
        })();
      });
    }
  }
  renderAssistantSelector() {
    if (!this.assistantSelectEl)
      return;
    this.assistantSelectEl.empty();
    const assistants = this.plugin.settings.assistantPresets;
    const currentAssistantId = this.plugin.settings.currentAssistantId;
    for (const assistant of assistants) {
      const option = this.assistantSelectEl.createEl("option", {
        value: assistant.id,
        text: assistant.name || "\u672A\u547D\u540D\u52A9\u624B"
      });
      if (assistant.id === currentAssistantId) {
        option.setAttribute("selected", "selected");
      }
    }
  }
  generateTopicId() {
    return `topic_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
  async createTopic() {
    if (this.plugin.settings.currentTopicId) {
      const currentTopic = this.plugin.settings.topics.find(
        (t2) => t2.id === this.plugin.settings.currentTopicId
      );
      if (currentTopic) {
        currentTopic.messages = [...this.messages];
        currentTopic.updatedAt = Date.now();
      }
    }
    const newTopic = {
      id: this.generateTopicId(),
      title: "\u65B0\u8BDD\u9898",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.plugin.settings.topics.push(newTopic);
    this.plugin.settings.currentTopicId = newTopic.id;
    this.messages = [];
    await this.plugin.saveSettings();
    this.renderMessages();
    this.renderTopicSelector();
    this.scrollToBottom();
  }
  async switchTopic(topicId) {
    const topic = this.plugin.settings.topics.find((t2) => t2.id === topicId);
    if (!topic)
      return;
    if (this.plugin.settings.currentTopicId) {
      const currentTopic = this.plugin.settings.topics.find(
        (t2) => t2.id === this.plugin.settings.currentTopicId
      );
      if (currentTopic) {
        currentTopic.messages = [...this.messages];
        currentTopic.updatedAt = Date.now();
      }
    }
    this.plugin.settings.currentTopicId = topicId;
    this.messages = [...topic.messages];
    await this.plugin.saveSettings();
    this.renderMessages();
    this.renderTopicSelector();
    this.scrollToBottom();
  }
  async deleteTopic() {
    const currentTopicId = this.plugin.settings.currentTopicId;
    if (!currentTopicId)
      return;
    const topicIndex = this.plugin.settings.topics.findIndex((t2) => t2.id === currentTopicId);
    if (topicIndex === -1)
      return;
    if (this.plugin.settings.topics.length <= 1) {
      this.messages = [];
      this.plugin.settings.topics[0].messages = [];
      this.plugin.settings.topics[0].title = "\u65B0\u8BDD\u9898";
      this.plugin.settings.topics[0].updatedAt = Date.now();
      await this.plugin.saveSettings();
      this.renderMessages();
      this.renderTopicSelector();
      return;
    }
    this.plugin.settings.topics.splice(topicIndex, 1);
    const nextTopic = this.plugin.settings.topics[Math.max(0, topicIndex - 1)];
    this.plugin.settings.currentTopicId = nextTopic.id;
    this.messages = [...nextTopic.messages];
    await this.plugin.saveSettings();
    this.renderMessages();
    this.renderTopicSelector();
  }
  generateTopicTitle(topic) {
    const firstUserMessage = topic.messages.find((m) => m.role === "user");
    if (!firstUserMessage) {
      return "\u65B0\u8BDD\u9898";
    }
    const content = (firstUserMessage.originalInput || firstUserMessage.content).trim();
    const title = content.length > 30 ? content.substring(0, 30) + "..." : content;
    return title;
  }
  async updateTopicTitle() {
    const currentTopicId = this.plugin.settings.currentTopicId;
    if (!currentTopicId)
      return;
    const topic = this.plugin.settings.topics.find((t2) => t2.id === currentTopicId);
    if (!topic)
      return;
    if (topic.title === "\u65B0\u8BDD\u9898") {
      topic.title = this.generateTopicTitle(topic);
      await this.plugin.saveSettings();
      this.renderTopicSelector();
    }
  }
  async saveCurrentTopic() {
    const currentTopicId = this.plugin.settings.currentTopicId;
    if (!currentTopicId)
      return;
    const topic = this.plugin.settings.topics.find((t2) => t2.id === currentTopicId);
    if (topic) {
      topic.messages = [...this.messages];
      topic.updatedAt = Date.now();
      await this.plugin.saveSettings();
    }
  }
  renderTopicSelector() {
    if (!this.topicSelectEl)
      return;
    this.topicSelectEl.empty();
    const topics = this.plugin.settings.topics;
    const currentTopicId = this.plugin.settings.currentTopicId;
    for (const topic of topics) {
      const option = this.topicSelectEl.createEl("option", {
        value: topic.id,
        text: topic.title || "\u672A\u547D\u540D\u8BDD\u9898"
      });
      if (topic.id === currentTopicId) {
        option.setAttribute("selected", "selected");
      }
    }
    if (this.deleteTopicBtn) {
      this.deleteTopicBtn.disabled = topics.length <= 1;
    }
  }
};

// src/settings/ClaudeSidebarSettingTab.ts
var import_obsidian4 = require("obsidian");

// src/settings/PathHelpModal.ts
var import_obsidian3 = require("obsidian");
var PathHelpModal = class extends import_obsidian3.Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h3", { text: this.plugin.t("pathHelpTitle") });
    contentEl.createEl("pre", { text: this.plugin.t("pathHelpBody") });
  }
  onClose() {
    this.contentEl.empty();
  }
};

// src/settings/ClaudeSidebarSettingTab.ts
var ClaudeSidebarSettingTab = class extends import_obsidian4.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: this.plugin.t("settingTitle") });
    new import_obsidian4.Setting(containerEl).setName(this.plugin.t("settingLanguageName")).setDesc(this.plugin.t("settingLanguageDesc")).addDropdown(
      (dropdown) => dropdown.addOption("zh-CN", "\u7B80\u4F53\u4E2D\u6587").addOption("en-US", "English").setValue(this.plugin.settings.language).onChange(async (value) => {
        this.plugin.settings.language = value;
        await this.plugin.saveSettings();
        this.display();
      })
    );
    new import_obsidian4.Setting(containerEl).setName(this.plugin.t("settingClaudeCommandName")).setDesc(this.plugin.t("settingClaudeCommandDesc")).addText(
      (text) => text.setPlaceholder(this.plugin.t("settingClaudeCommandPlaceholder")).setValue(this.plugin.settings.claudeCommand).onChange(async (value) => {
        this.plugin.settings.claudeCommand = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian4.Setting(containerEl).setName(this.plugin.t("settingClaudePathName")).setDesc(this.plugin.t("settingClaudePathDesc")).addText(
      (text) => text.setPlaceholder("C:\\Users\\<name>\\AppData\\Roaming\\npm\\claude.cmd").setValue(this.plugin.settings.claudePath).onChange(async (value) => {
        this.plugin.settings.claudePath = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian4.Setting(containerEl).setName(this.plugin.t("settingClaudeEditionName")).setDesc(this.plugin.t("settingClaudeEditionDesc")).addDropdown(
      (dropdown) => dropdown.addOption("auto", this.plugin.t("editionAuto")).addOption("npm", this.plugin.t("editionNpm")).addOption("native", this.plugin.t("editionNative")).addOption("custom", this.plugin.t("editionCustom")).setValue(this.plugin.settings.claudeEdition).onChange(async (value) => {
        this.plugin.settings.claudeEdition = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian4.Setting(containerEl).setName(this.plugin.t("settingModelName")).setDesc(this.plugin.t("settingModelDesc")).addDropdown((dropdown) => {
      const models = [...DEFAULT_CLAUDE_MODELS];
      const currentModel = this.plugin.settings.model || models[0].value;
      for (const model of models) {
        dropdown.addOption(model.value, model.label);
      }
      if (!models.some((model) => model.value === currentModel)) {
        dropdown.addOption(currentModel, currentModel);
      }
      dropdown.setValue(currentModel).onChange(async (value) => {
        this.plugin.settings.model = value;
        const isDefault = DEFAULT_CLAUDE_MODELS.some((model) => model.value === value);
        if (isDefault) {
          this.plugin.settings.thinkingBudget = DEFAULT_THINKING_BUDGET[value] || "off";
        }
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian4.Setting(containerEl).setName(this.plugin.t("settingThinkingBudgetName")).setDesc(this.plugin.t("settingThinkingBudgetDesc")).addDropdown((dropdown) => {
      const currentBudget = this.plugin.settings.thinkingBudget || "off";
      for (const budget of THINKING_BUDGETS) {
        dropdown.addOption(budget.value, budget.label);
      }
      dropdown.setValue(currentBudget).onChange(async (value) => {
        this.plugin.settings.thinkingBudget = value;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian4.Setting(containerEl).setName(this.plugin.t("settingNodePathName")).setDesc(this.plugin.t("settingNodePathDesc")).addText(
      (text) => text.setPlaceholder("C:\\Program Files\\nodejs\\node.exe").setValue(this.plugin.settings.nodePath).onChange(async (value) => {
        this.plugin.settings.nodePath = value;
        await this.plugin.saveSettings();
      })
    ).addButton(
      (button) => button.setButtonText(this.plugin.t("pathHelpButton")).onClick(() => {
        new PathHelpModal(this.app, this.plugin).open();
      })
    );
    new import_obsidian4.Setting(containerEl).setName(this.plugin.t("settingGitBashPathName")).setDesc(this.plugin.t("settingGitBashPathDesc")).addText(
      (text) => text.setPlaceholder("C:\\Program Files\\Git\\bin\\bash.exe").setValue(this.plugin.settings.gitBashPath).onChange(async (value) => {
        this.plugin.settings.gitBashPath = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian4.Setting(containerEl).setName(this.plugin.t("settingDefaultPromptName")).setDesc(this.plugin.t("settingDefaultPromptDesc")).addTextArea(
      (text) => text.setPlaceholder(this.plugin.t("settingDefaultPromptPlaceholder")).setValue(this.plugin.settings.defaultPrompt).onChange(async (value) => {
        this.plugin.settings.defaultPrompt = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian4.Setting(containerEl).setName(this.plugin.t("settingTaskTrackingName")).setDesc(this.plugin.t("settingTaskTrackingDesc")).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.enableTaskTracking).onChange(async (value) => {
        this.plugin.settings.enableTaskTracking = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian4.Setting(containerEl).setName(this.plugin.t("settingWorkingDirName")).setDesc(this.plugin.t("settingWorkingDirDesc")).addText(
      (text) => text.setPlaceholder("/path/to/vault").setValue(this.plugin.settings.workingDir).onChange(async (value) => {
        this.plugin.settings.workingDir = value;
        await this.plugin.saveSettings();
      })
    );
    containerEl.createEl("h3", {
      text: this.plugin.t("assistantSectionName"),
      cls: "claude-code-about-header"
    });
    containerEl.createEl("p", {
      text: this.plugin.t("assistantSectionDesc"),
      cls: "setting-item-description"
    });
    const renderAssistantPresets = () => {
      const oldList = containerEl.querySelector(".claude-assistant-list");
      if (oldList) {
        oldList.remove();
      }
      const assistantList = containerEl.createDiv("claude-assistant-list");
      assistantList.style.marginTop = "12px";
      for (const assistant of this.plugin.settings.assistantPresets) {
        const assistantItem = assistantList.createDiv("claude-assistant-item");
        assistantItem.style.padding = "12px";
        assistantItem.style.marginBottom = "8px";
        assistantItem.style.border = "1px solid var(--background-modifier-border)";
        assistantItem.style.borderRadius = "8px";
        assistantItem.style.background = "var(--background-secondary)";
        const nameContainer = assistantItem.createDiv("claude-assistant-name-container");
        nameContainer.style.display = "flex";
        nameContainer.style.alignItems = "center";
        nameContainer.style.justifyContent = "space-between";
        nameContainer.style.marginBottom = "8px";
        const nameInput = nameContainer.createEl("input", {
          type: "text",
          value: assistant.name
        });
        nameInput.style.flex = "1";
        nameInput.style.marginRight = "8px";
        nameInput.style.padding = "6px 10px";
        nameInput.style.border = "1px solid var(--background-modifier-border)";
        nameInput.style.borderRadius = "6px";
        nameInput.style.background = "var(--background-primary)";
        nameInput.style.color = "var(--text-normal)";
        nameInput.addEventListener("input", async () => {
          assistant.name = nameInput.value;
          await this.plugin.saveSettings();
        });
        if (this.plugin.settings.assistantPresets.length > 1) {
          const deleteBtn = nameContainer.createEl("button", {
            text: this.plugin.t("assistantDelete")
          });
          deleteBtn.style.padding = "4px 10px";
          deleteBtn.style.borderRadius = "6px";
          deleteBtn.style.border = "1px solid var(--background-modifier-border)";
          deleteBtn.style.background = "var(--background-modifier-form-field)";
          deleteBtn.style.color = "var(--text-normal)";
          deleteBtn.style.cursor = "pointer";
          deleteBtn.addEventListener("click", async () => {
            const index = this.plugin.settings.assistantPresets.findIndex(
              (a) => a.id === assistant.id
            );
            if (index > -1) {
              this.plugin.settings.assistantPresets.splice(index, 1);
              if (this.plugin.settings.currentAssistantId === assistant.id) {
                this.plugin.settings.currentAssistantId = this.plugin.settings.assistantPresets[0].id;
              }
              await this.plugin.saveSettings();
              renderAssistantPresets();
            }
          });
        }
        const promptLabel = assistantItem.createEl("label", {
          text: `${this.plugin.t("assistantSystemPrompt")}:`
        });
        promptLabel.style.display = "block";
        promptLabel.style.fontSize = "12px";
        promptLabel.style.color = "var(--text-muted)";
        promptLabel.style.marginBottom = "4px";
        const promptTextarea = assistantItem.createEl("textarea", {
          value: assistant.systemPrompt
        });
        promptTextarea.style.width = "100%";
        promptTextarea.style.minHeight = "80px";
        promptTextarea.style.padding = "8px";
        promptTextarea.style.border = "1px solid var(--background-modifier-border)";
        promptTextarea.style.borderRadius = "6px";
        promptTextarea.style.background = "var(--background-primary)";
        promptTextarea.style.color = "var(--text-normal)";
        promptTextarea.style.resize = "vertical";
        promptTextarea.style.fontFamily = "var(--font-monospace)";
        promptTextarea.style.fontSize = "12px";
        let saveTimeout = null;
        promptTextarea.addEventListener("input", () => {
          assistant.systemPrompt = promptTextarea.value;
          if (saveTimeout) {
            clearTimeout(saveTimeout);
          }
          saveTimeout = setTimeout(async () => {
            await this.plugin.saveSettings();
            promptTextarea.style.borderColor = "var(--color-green)";
            setTimeout(() => {
              promptTextarea.style.borderColor = "var(--background-modifier-border)";
            }, 500);
          }, 500);
        });
      }
    };
    renderAssistantPresets();
    new import_obsidian4.Setting(containerEl).addButton(
      (button) => button.setButtonText(this.plugin.t("assistantAddNew")).setCta().onClick(async () => {
        const newAssistant = {
          id: `assistant_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
          name: this.plugin.t("assistantDefaultName"),
          systemPrompt: this.plugin.t("assistantDefaultPrompt")
        };
        this.plugin.settings.assistantPresets.push(newAssistant);
        await this.plugin.saveSettings();
        renderAssistantPresets();
      })
    );
    containerEl.createEl("h3", {
      text: this.plugin.t("aboutSectionName"),
      cls: "claude-code-about-header"
    });
    const aboutDiv = containerEl.createDiv("claude-code-about-section");
    aboutDiv.createEl("p", { cls: "claude-code-about-item" }).createEl("span", {
      text: `${this.plugin.t("aboutVersion")}: ${this.plugin.manifest.version}`
    });
    aboutDiv.createEl("p", { cls: "claude-code-about-item" }).createEl("span", {
      text: `${this.plugin.t("aboutAuthor")}: ${this.plugin.manifest.author}`
    });
    const emailDiv = aboutDiv.createEl("p", { cls: "claude-code-about-item" });
    emailDiv.createSpan({
      text: `${this.plugin.t("aboutEmail")}: `
    });
    emailDiv.createEl("a", {
      text: "sloanenyra@gmail.com",
      href: "mailto:sloanenyra@gmail.com",
      cls: "claude-code-about-link"
    });
    aboutDiv.createEl("p", { cls: "claude-code-about-item" }).createEl("span", {
      text: `${this.plugin.t("aboutLicense")}: MIT`
    });
    const repoDiv = aboutDiv.createEl("p", { cls: "claude-code-about-item" });
    repoDiv.createSpan({
      text: `${this.plugin.t("aboutRepository")}: `
    });
    const githubLink = repoDiv.createEl("a", {
      text: "GitHub",
      href: "https://github.com/KeloYuan/NIki-AI",
      cls: "claude-code-about-link"
    });
    githubLink.setAttribute("target", "_blank");
    repoDiv.createSpan({ text: " / " });
    const gitcodeLink = repoDiv.createEl("a", {
      text: "GitCode",
      href: "https://gitcode.com/KeloYuan/NIki-AI",
      cls: "claude-code-about-link"
    });
    gitcodeLink.setAttribute("target", "_blank");
    aboutDiv.createEl("p", { cls: "claude-code-about-desc" }).createEl("span", {
      text: this.plugin.t("aboutDescriptionText")
    });
  }
};

// src/plugin.ts
var ClaudeSidebarPlugin = class extends import_obsidian5.Plugin {
  async onload() {
    await this.loadSettings();
    this.registerView(VIEW_TYPE_CLAUDE, (leaf) => {
      return new ClaudeSidebarView(leaf, this);
    });
    this.addRibbonIcon("bot", this.t("openSidebarCommand"), () => {
      void this.activateView();
    });
    this.addCommand({
      id: "open-sidebar",
      name: this.t("openSidebarCommand"),
      callback: () => this.activateView()
    });
    this.addSettingTab(new ClaudeSidebarSettingTab(this.app, this));
  }
  onunload() {
  }
  async activateView() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE_CLAUDE)[0];
    if (!leaf) {
      leaf = workspace.getRightLeaf(false);
      await leaf.setViewState({ type: VIEW_TYPE_CLAUDE, active: true });
    }
    void workspace.revealLeaf(leaf);
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  t(key) {
    return t(this.settings.language, key);
  }
  tf(key, vars) {
    return format(this.t(key), vars);
  }
};

// main.ts
var main_default = ClaudeSidebarPlugin;
