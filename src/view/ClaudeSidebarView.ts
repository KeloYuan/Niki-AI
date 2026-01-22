import {
  ItemView,
  MarkdownRenderer,
  Notice,
  WorkspaceLeaf,
  setIcon,
  TFile,
} from "obsidian";
import { exec, execFile } from "child_process";
import type ClaudeSidebarPlugin from "../plugin";
import { VIEW_TYPE_CLAUDE } from "../constants";
import type {
  ChatMessage,
  CodeChange,
  DiffResult,
  FileModification,
  MentionedItem,
  TaskItem,
  ChatTopic,
} from "../types";
import {
  attachStreamBuffers,
  buildEnv,
  findClaudeBinary,
  findNodeBinary,
  isNodeScript,
  normalizeCommand,
  replacePlaceholder,
  resolveClaudeTimeoutMs,
  sanitizeStreamOutput,
} from "../utils/claudeCli";
import { computeDiff } from "../utils/diff";
import {
  extractTasksFromReply,
  parseTasksFromText,
  renderTaskItems,
} from "../utils/tasks";
import {
  DEFAULT_CLAUDE_MODELS,
  DEFAULT_THINKING_BUDGET,
  THINKING_BUDGETS,
} from "../models";

/** Claudian logo SVG configuration (from Claudian). */
const LOGO_SVG = {
  viewBox: '0 -.01 39.5 39.53',
  width: '18',
  height: '18',
  path: 'm7.75 26.27 7.77-4.36.13-.38-.13-.21h-.38l-1.3-.08-4.44-.12-3.85-.16-3.73-.2-.94-.2-.88-1.16.09-.58.79-.53 1.13.1 2.5.17 3.75.26 2.72.16 4.03.42h.64l.09-.26-.22-.16-.17-.16-3.88-2.63-4.2-2.78-2.2-1.6-1.19-.81-.6-.76-.26-1.66 1.08-1.19 1.45.1.37.1 1.47 1.13 3.14 2.43 4.1 3.02.6.5.24-.17.03-.12-.27-.45-2.23-4.03-2.38-4.1-1.06-1.7-.28-1.02c-.1-.42-.17-.77-.17-1.2l1.23-1.67.68-.22 1.64.22.69.6 1.02 2.33 1.65 3.67 2.56 4.99.75 1.48.4 1.37.15.42h.26v-.24l.21-2.81.39-3.45.38-4.44.13-1.25.62-1.5 1.23-.81.96.46.79 1.13-.11.73-.47 3.05-.92 4.78-.6 3.2h.35l.4-.4 1.62-2.15 2.72-3.4 1.2-1.35 1.4-1.49.9-.71h1.7l1.25 1.86-.56 1.92-1.75 2.22-1.45 1.88-2.08 2.8-1.3 2.24.12.18.31-.03 4.7-1 2.54-.46 3.03-.52 1.37.64.15.65-.54 1.33-3.24.8-3.8.76-5.66 1.34-.07.05.08.1 2.55.24 1.09.06h2.67l4.97.37 1.3.86.78 1.05-.13.8-2 1.02-2.7-.64-6.3-1.5-2.16-.54h-.3v.18l1.8 1.76 3.3 2.98 4.13 3.84.21.95-.53.75-.56-.08-3.63-2.73-1.4-1.23-3.17-2.67h-.21v.28l.73 1.07 3.86 5.8.2 1.78-.28.58-1 .35-1.1-.2-2.26-3.17-2.33-3.57-1.88-3.2-.23.13-1.11 11.95-.52.61-1.2.46-1-.76-.53-1.23.53-2.43.64-3.17.52-2.52.47-3.13.28-1.04-.02-.07-.23.03-2.36 3.24-3.59 4.85-2.84 3.04-.68.27-1.18-.61.11-1.09.66-.97 3.93-5 2.37-3.1 1.53-1.79-.01-.26h-.09l-10.44 6.78-1.86.24-.8-.75.1-1.23.38-.4 3.14-2.16z',
  fill: '#d97757',
} as const;

/** Random flavor texts shown while Claude is thinking (from Claudian). */
const FLAVOR_TEXTS = [
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
  "Give me a moment...",
];

export class ClaudeSidebarView extends ItemView {
  plugin: ClaudeSidebarPlugin;
  messages: ChatMessage[] = [];
  messagesEl: HTMLDivElement;
  private composerEl: HTMLDivElement;
  inputEl: HTMLTextAreaElement;
  includeNoteEl: HTMLInputElement;
  private loaded = false;
  private mentionedItems: MentionedItem[] = [];
  private mentionTagsEl: HTMLDivElement;
  private filePickerEl: HTMLDivElement;
  private topicSelectEl: HTMLSelectElement;
  private newTopicBtn: HTMLButtonElement;
  private deleteTopicBtn: HTMLButtonElement;
  private assistantSelectEl: HTMLSelectElement;
  private modelSelectorEl: HTMLDivElement;
  private thinkingSelectorEl: HTMLDivElement;
  private isSending = false;
  private sendBtn: HTMLButtonElement;
  private currentProcess: { kill: (signal?: NodeJS.Signals) => void } | null = null;
  private isTasksExpanded = false;
  private streamRenderScheduled = false;
  private streamRenderTimer: ReturnType<typeof setInterval> | null = null;
  private boundEscKeyHandler: ((e: KeyboardEvent) => void) | null = null;
  private currentStreamingContentEl: HTMLElement | null = null;
  // 打字机效果相关
  private typewriterBuffer: string[] = [];  // 待显示的字符队列
  private typewriterTimer: ReturnType<typeof setTimeout> | null = null;
  private typewriterLastTime = 0;  // 上次更新时间

  constructor(leaf: WorkspaceLeaf, plugin: ClaudeSidebarPlugin) {
    super(leaf);
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

    // 话题控制区域（放在标题右边）
    const topicControl = header.createDiv("claude-code-topic-control-inline");

    const topicSelector = topicControl.createDiv("claude-code-topic-selector-inline");
    this.topicSelectEl = topicSelector.createEl("select", {
      cls: "claude-code-topic-select-inline",
    });

    const topicActions = topicControl.createDiv("claude-code-topic-actions-inline");

    this.newTopicBtn = topicActions.createEl("button", {
      text: "+",
      cls: "claude-code-topic-btn-inline claude-code-topic-new",
    });
    this.newTopicBtn.setAttribute("aria-label", "新建话题");

    this.deleteTopicBtn = topicActions.createEl("button", {
      text: "×",
      cls: "claude-code-topic-btn-inline claude-code-topic-delete",
    });
    this.deleteTopicBtn.setAttribute("aria-label", "删除话题");

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
      type: "checkbox",
    });
    this.includeNoteEl.checked = this.plugin.settings.includeCurrentNote;
    includeNoteWrap.createEl("span", { text: this.plugin.t("includeCurrentNote") });

    const actions = topRow.createDiv("claude-code-actions");

    this.assistantSelectEl = actions.createEl("select", {
      cls: "claude-code-assistant-select",
    });

    this.sendBtn = actions.createEl("button", {
      text: this.plugin.t("send"),
      cls: "mod-cta",
    });
    const clearBtn = actions.createEl("button", { text: this.plugin.t("clear") });

    const toolbarRow = composer.createDiv("claude-code-toolbar");
    this.modelSelectorEl = toolbarRow.createDiv("claude-code-model-selector");
    this.thinkingSelectorEl = toolbarRow.createDiv("claude-code-thinking-selector");

    this.inputEl = composer.createEl("textarea", {
      cls: "claude-code-input",
      attr: { placeholder: this.plugin.t("inputPlaceholder") },
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
      const target = event.target as HTMLTextAreaElement;
      const value = target.value;
      const cursorPos = target.selectionStart;

      if (
        cursorPos > 0 &&
        value[cursorPos - 1] === "@" &&
        (cursorPos === 1 || value[cursorPos - 2] === " ")
      ) {
        const activeFile = this.getActiveFile();
        if (activeFile) {
          this.addMentionedItem({
            type: "file",
            name: activeFile.basename,
            path: activeFile.path,
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
      event.preventDefault();
      this.inputEl.removeClass("claude-code-input-dragover");

      const transfer = event.dataTransfer;
      if (!transfer) return;

      console.debug("Drop event types:", transfer.types);

      const TEXT_EXTENSIONS = new Set([
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
        "rss",
      ]);

      const isTextFile = (fileName: string): boolean => {
        if (!fileName) return false;
        const ext = fileName.split(".").pop()?.toLowerCase();
        if (!ext) return false;
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
                  (f) =>
                    f.basename === fileName ||
                    f.path === decodedPath ||
                    f.path.endsWith(decodedPath)
                );

                if (file) {
                  this.addMentionedItem({
                    type: "file",
                    name: file.basename,
                    path: file.path,
                  });
                  new Notice(this.plugin.tf("addedFile", { name: file.basename }));
                  return;
                }

                const allFiles = this.app.vault.getFiles();
                const textFile = allFiles.find(
                  (f) =>
                    f.basename === fileName ||
                    f.path === decodedPath ||
                    f.path.endsWith(decodedPath)
                );

                if (textFile && isTextFile(textFile.path)) {
                  this.addMentionedItem({
                    type: "file",
                    name: textFile.basename,
                    path: textFile.path,
                  });
                  new Notice(this.plugin.tf("addedFile", { name: textFile.basename }));
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
                  files: folderFiles,
                });
                new Notice(`已添加文件夹: ${folderName} (${folderFiles.length} 个文件)`);
                return;
              }
              new Notice(`文件夹 ${data} 中没有支持的文本文件`);
              return;
            }

            if (data.endsWith(".md") || isTextFile(data)) {
              const fileName = data.split(/[/\\]/).pop() || data;
              const file = this.app.vault.getMarkdownFiles().find(
                (f) =>
                  f.path === data ||
                  f.path.endsWith(data) ||
                  f.basename === fileName.replace(/\.[^/.]+$/, "")
              );

              if (file) {
                this.addMentionedItem({
                  type: "file",
                  name: file.basename,
                  path: file.path,
                });
                new Notice(this.plugin.tf("addedFile", { name: file.basename }));
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
            new Notice(this.plugin.t("unsupportedFileType"));
            continue;
          }

          const vaultFile = this.app.vault.getMarkdownFiles().find(
            (f) => f.basename === file.name.replace(/\.[^/.]+$/, "")
          );

          if (vaultFile) {
            this.addMentionedItem({
              type: "file",
              name: vaultFile.basename,
              path: vaultFile.path,
            });
            new Notice(this.plugin.tf("addedFile", { name: vaultFile.basename }));
          } else {
            new Notice(this.plugin.t("unsupportedFileType"));
          }
        }
      }

      if (transfer.items) {
        for (let i = 0; i < transfer.items.length; i++) {
          const item = transfer.items[i];

          if (item.kind === "file") {
            const entry = item.webkitGetAsEntry?.();
            if (entry && entry.isDirectory) {
              const folderName = entry.fullPath.substring(1).split("/")[0];
              const folderPath = folderName;

              const folderFiles = await this.scanFolder(folderPath);

              if (folderFiles.length > 0) {
                this.addMentionedItem({
                  type: "folder",
                  name: folderName,
                  path: folderPath,
                  files: folderFiles,
                });
                new Notice(`已添加文件夹: ${folderName} (${folderFiles.length} 个文件)`);
              } else {
                new Notice(`文件夹 ${folderName} 中没有支持的文本文件`);
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
        const target = e.target as HTMLSelectElement;
        await this.switchAssistant(target.value);
      })();
    });

    this.topicSelectEl.addEventListener("change", (e) => {
      void (async () => {
        const target = e.target as HTMLSelectElement;
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
        const topic = this.plugin.settings.topics.find((t) => t.id === currentTopicId);
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

    // 注册文档级 ESC 键监听器（用于打断流式输出）
    this.boundEscKeyHandler = this.handleEscKey.bind(this);
    document.addEventListener('keydown', this.boundEscKeyHandler);
  }

  async onClose() {
    // 清理 ESC 键监听器
    if (this.boundEscKeyHandler) {
      document.removeEventListener('keydown', this.boundEscKeyHandler);
      this.boundEscKeyHandler = null;
    }
    await this.saveCurrentTopic();
    this.stopStreamRenderTimer();
    this.loaded = false;
  }

  /** 处理 ESC 键按下事件 - 打断正在进行的发送 */
  private handleEscKey(e: KeyboardEvent): void {
    if (e.key === 'Escape' && !e.isComposing && this.isSending) {
      e.preventDefault();
      e.stopPropagation();
      this.interruptSending();
    }
  }

  async handleSend() {
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
      const itemList = this.mentionedItems
        .map((item) => {
          if (item.type === "folder") {
            return `@${item.name} (${item.files?.length || 0} 个文件)`;
          }
          return `@${item.name}`;
        })
        .join(", ");
      messageContent = `${itemList}\n\n${content}`;
    }

    this.addMessage({
      role: "user",
      content: messageContent,
      originalInput: content,
    });

    await this.updateTopicTitle();

    const filesToTrack: TFile[] = [];
    for (const item of this.mentionedItems) {
      if (item.type === "folder" && item.files) {
        filesToTrack.push(...item.files);
      } else if (item.type === "file") {
        const file = this.app.vault.getFiles().find((f) => f.path === item.path);
        if (file) filesToTrack.push(file);
      }
    }
    if (this.includeNoteEl.checked) {
      const activeFile = this.getActiveFile();
      if (activeFile && !filesToTrack.some((f) => f.path === activeFile.path)) {
        filesToTrack.push(activeFile);
      }
    }
    const beforeTimestamp = Date.now();
    const fileSnapshots = new Map<string, string>();
    for (const file of filesToTrack) {
      try {
        fileSnapshots.set(file.path, await this.app.vault.read(file));
      } catch {
        // ignore
      }
    }

    const prompt = await this.buildPrompt(content);

    this.clearMentionTags();
    const pendingMessage: ChatMessage = {
      role: "assistant",
      content: "",
      streamContent: "",
      isPending: true,
      thinkingStartTime: Date.now(),
      flavorText: FLAVOR_TEXTS[Math.floor(Math.random() * FLAVOR_TEXTS.length)],
    };
    this.messages.push(pendingMessage);
    this.renderMessages();
    this.scrollToBottom();
    this.startStreamRenderTimer();

    try {
      const reply = await this.runClaudeCommand(prompt, (chunk) => {
        if (!pendingMessage.isPending) return;
        if (!this.messages.includes(pendingMessage)) return;
        pendingMessage.streamContent += chunk;
        // 使用打字机效果更新流式内容（不重新渲染整个消息列表）
        this.updateStreamingContent(chunk);
      });

      if (pendingMessage.thinkingStartTime) {
        pendingMessage.thinkingDuration = Math.floor(
          (Date.now() - pendingMessage.thinkingStartTime) / 1000
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
      const streamSnapshot = pendingMessage.streamContent?.trim() ?? "";
      if (!pendingMessage.thinkingContent && streamSnapshot) {
        const thinkingSegments = this.extractThinkingSegmentsFromStream(streamSnapshot);
        const rawThinking = thinkingSegments.length
          ? thinkingSegments.join("\n\n")
          : this.stripThinkingTagsFromStream(streamSnapshot);
        const cliPrelude = this.extractCliPrelude(rawThinking, pendingMessage.content);
        if (cliPrelude) {
          pendingMessage.thinkingContent = cliPrelude;
        }
      }
      pendingMessage.isPending = false;
      pendingMessage.streamContent = undefined;
      this.currentStreamingContentEl = null;  // 清理流式内容元素引用
      this.stopStreamRenderTimer();

      const modifications: FileModification[] = [];
      for (const file of filesToTrack) {
        const beforeContent = fileSnapshots.get(file.path);
        if (!beforeContent) continue;

        try {
          const afterContent = await this.app.vault.read(file);
          if (afterContent !== beforeContent) {
            modifications.push({
              filePath: file.path,
              originalContent: beforeContent,
              file,
              timestamp: beforeTimestamp,
            });
          }
        } catch {
          // ignore
        }
      }

      if (modifications.length > 0) {
        pendingMessage.fileModifications = modifications;
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : this.plugin.t("failedRunCommand");
      pendingMessage.content = this.plugin.tf("claudeConnectionError", {
        message,
      });
      pendingMessage.isError = true;
      pendingMessage.isPending = false;
      pendingMessage.streamContent = undefined;
      this.currentStreamingContentEl = null;  // 清理流式内容元素引用
      this.stopStreamRenderTimer();
    }
    this.renderMessages();
    this.scrollToBottom();

    await this.saveCurrentTopic();

    this.isSending = false;
    this.updateSendButtonState();
  }

  private updateSendButtonState() {
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

  private interruptSending() {
    if (this.currentProcess) {
      this.currentProcess.kill("SIGTERM");
      this.currentProcess = null;
    }

    // 清理流式内容元素引用
    this.currentStreamingContentEl = null;
    // 清理打字机效果
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

  addMessage(message: ChatMessage) {
    this.messages.push(message);
    this.renderMessages();
    this.scrollToBottom();
  }

  private scheduleStreamRender(): void {
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

  private startStreamRenderTimer(): void {
    if (this.streamRenderTimer) {
      return;
    }
    this.streamRenderTimer = setInterval(() => {
      if (!this.isSending) {
        this.stopStreamRenderTimer();
        return;
      }
      // 只更新计时器，不重新渲染整个消息
      this.updatePendingMessageTimers();
    }, 1000);
  }

  private stopStreamRenderTimer(): void {
    if (this.streamRenderTimer) {
      clearInterval(this.streamRenderTimer);
      this.streamRenderTimer = null;
    }
    // 清理打字机效果
    this.stopTypewriter();
    this.typewriterBuffer = [];
    // 清理所有 pending 消息的计时器
    for (const msg of this.messages) {
      if (msg.isPending && msg.timerInterval) {
        clearInterval(msg.timerInterval);
        msg.timerInterval = undefined;
        msg.timerElement = undefined;
      }
    }
  }

  /** 更新所有 pending 消息的计时器显示（不重新渲染） */
  private updatePendingMessageTimers(): void {
    for (const msg of this.messages) {
      if (!msg.isPending || !msg.thinkingStartTime || !msg.timerElement) {
        continue;
      }
      // 检查元素是否还在 DOM 中
      if (!msg.timerElement.isConnected) {
        if (msg.timerInterval) {
          clearInterval(msg.timerInterval);
          msg.timerInterval = undefined;
          msg.timerElement = undefined;
        }
        continue;
      }
      const elapsedSeconds = Math.floor((Date.now() - msg.thinkingStartTime) / 1000);
      msg.timerElement.setText(` (${this.plugin.t("thinkingIndicatorHint")} · ${this.formatDurationMmSs(elapsedSeconds)})`);
    }
  }

  /** 获取或创建流式内容元素（用于打字机效果） */
  private getOrCreateStreamingContentEl(): HTMLElement | null {
    // 找到最后一条消息（正在发送的消息）
    const lastMessage = this.messages[this.messages.length - 1];
    if (!lastMessage || !lastMessage.isPending) return null;

    // 查找对应的消息元素
    const messageEls = this.messagesEl.querySelectorAll('.claude-code-message');
    const lastMsgEl = messageEls[messageEls.length - 1];
    if (!lastMsgEl) return null;

    const contentEl = lastMsgEl.querySelector('.claude-code-content') as HTMLElement;
    if (!contentEl) return null;

    // 隐藏思考指示器
    const indicator = contentEl.querySelector('.claude-code-thinking-indicator') as HTMLElement;
    if (indicator) {
      indicator.style.display = 'none';
    }

    // 查找或创建流式内容容器
    let streamingEl = contentEl.querySelector('.claude-code-streaming') as HTMLElement;
    if (!streamingEl) {
      streamingEl = contentEl.createDiv('claude-code-streaming');
    }

    // 查找或创建 pre 元素（只创建一次）
    let preEl = streamingEl.querySelector('pre') as HTMLElement;
    if (!preEl) {
      preEl = streamingEl.createEl('pre');
      preEl.textContent = '';
    }

    return streamingEl;
  }

  /** 更新流式内容（打字机效果，不重新渲染整个消息列表） */
  private updateStreamingContent(chunk: string): void {
    console.debug('[Typewriter] Received chunk:', chunk.length, 'chars');

    if (!this.currentStreamingContentEl) {
      this.currentStreamingContentEl = this.getOrCreateStreamingContentEl();
      if (!this.currentStreamingContentEl) {
        console.error('[Typewriter] Failed to get streaming element');
        return;
      }
    }

    // 检查元素是否还在 DOM 中
    if (!this.currentStreamingContentEl.isConnected) {
      console.error('[Typewriter] Streaming element disconnected');
      this.currentStreamingContentEl = null;
      return;
    }

    // 将 chunk 添加到打字机缓冲区
    this.typewriterBuffer.push(...chunk.split(''));
    console.debug('[Typewriter] Buffer size:', this.typewriterBuffer.length);

    // 如果打字机计时器没有运行，启动它
    if (!this.typewriterTimer) {
      console.debug('[Typewriter] Starting timer');
      this.startTypewriter();
    }
  }

  /** 启动打字机效果计时器 */
  private startTypewriter(): void {
    if (this.typewriterTimer) return;

    console.debug('[Typewriter] Starting smooth typewriter');

    const typewriterLoop = () => {
      if (this.typewriterBuffer.length === 0) {
        // 缓冲区为空，停止计时器
        console.debug('[Typewriter] Buffer empty, stopping');
        this.stopTypewriter();
        return;
      }

      if (!this.currentStreamingContentEl || !this.currentStreamingContentEl.isConnected) {
        console.error('[Typewriter] Element disconnected, stopping');
        this.stopTypewriter();
        return;
      }

      const preEl = this.currentStreamingContentEl.querySelector('pre') as HTMLElement;
      if (!preEl) {
        this.stopTypewriter();
        return;
      }

      // 动态速度：根据缓冲区大小调整
      // 缓冲区越大，每次显示越多；缓冲区越小，每次显示越少
      const bufferSize = this.typewriterBuffer.length;
      let charsToShow = 1;

      if (bufferSize > 100) {
        charsToShow = 4;  // 缓冲区多时加快
      } else if (bufferSize > 50) {
        charsToShow = 2;
      } else if (bufferSize > 20) {
        charsToShow = 1;
      } else {
        // 缓冲区少时，随机显示 1-2 个字符，让效果更自然
        charsToShow = Math.random() > 0.5 ? 1 : 2;
      }

      // 从缓冲区取出字符
      const chars = this.typewriterBuffer.splice(0, Math.min(charsToShow, bufferSize));
      preEl.textContent += chars.join('');

      // 动态间隔：缓冲区多时加快，缓冲区少时稍慢
      const newBufferSize = this.typewriterBuffer.length;
      let nextDelay = 15;  // 基础延迟

      if (newBufferSize > 100) {
        nextDelay = 10;  // 快
      } else if (newBufferSize > 50) {
        nextDelay = 15;
      } else if (newBufferSize > 20) {
        nextDelay = 20;
      } else {
        // 缓冲区少时，添加随机延迟让打字更自然
        nextDelay = 25 + Math.random() * 15;  // 25-40ms
      }

      // 继续下一次循环
      this.typewriterTimer = setTimeout(typewriterLoop, nextDelay);

      // 自动滚动到底部
      this.scrollToBottom();
    };

    // 开始循环
    this.typewriterTimer = setTimeout(typewriterLoop, 10);
  }

  /** 停止打字机效果计时器 */
  private stopTypewriter(): void {
    if (this.typewriterTimer) {
      clearTimeout(this.typewriterTimer);
      this.typewriterTimer = null;
    }
  }

  async buildPrompt(userInput: string) {
    const parts: string[] = [];
    const currentAssistant = this.plugin.settings.assistantPresets.find(
      (a) => a.id === this.plugin.settings.currentAssistantId
    );
    const system = (
      currentAssistant?.systemPrompt || this.plugin.settings.defaultPrompt
    ).trim();
    const systemParts: string[] = [];
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
      parts.push(`[System]\n${systemParts.join("\n\n")}`);
    }

    if (this.mentionedItems.length > 0) {
      for (const item of this.mentionedItems) {
        if (item.type === "folder" && item.files) {
          parts.push(`[@ 文件夹: ${item.name} (${item.files.length} 个文件)]`);
          for (const file of item.files) {
            try {
              const content = await this.app.vault.read(file);
              parts.push(`[文件: ${file.path}]\n${content}`);
            } catch {
              parts.push(`[文件: ${file.path}]\n(无法读取文件)`);
            }
          }
        } else if (item.type === "file") {
          const file = this.app.vault.getFiles().find((f) => f.path === item.path);
          if (file) {
            try {
              const content = await this.app.vault.read(file);
              parts.push(`[@ ${file.path}]\n${content}`);
            } catch {
              parts.push(`[@ ${file.path}]\n(无法读取文件)`);
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
        if (item.type === "file") return item.path === activeFile.path;
        if (item.type === "folder" && item.files) {
          return item.files.some((f) => f.path === activeFile.path);
        }
        return false;
      });
      if (!alreadyIncluded) {
        try {
          const noteText = await this.app.vault.read(activeFile);
          parts.push(`[@ Current note: ${activeFile.path}]\n${noteText}`);
        } catch {
          parts.push(`[@ Current note: ${activeFile.path}]\n(无法读取文件)`);
        }
      }
    }

    const history = this.messages
      .filter((msg) => msg.role !== "system")
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n\n");
    if (history) {
      parts.push(`[Conversation]\n${history}`);
    }

    parts.push(`[User]\n${userInput}`);
    return parts.join("\n\n");
  }

  private getSelectedModel(): string {
    const selected = this.plugin.settings.model?.trim();
    return selected || DEFAULT_CLAUDE_MODELS[0].value;
  }

  private injectModelOption(command: string, model?: string): string {
    if (!model) {
      return command;
    }
    if (/(^|\s)--model(?:=|\s)/.test(command)) {
      return command;
    }
    return `${command} --model ${model}`;
  }

  runClaudeCommand(prompt: string, onChunk?: (chunk: string) => void): Promise<string> {
    const configured = this.plugin.settings.claudeCommand.trim();
    const preferredClaude = this.plugin.settings.claudePath.trim();
    const edition = this.plugin.settings.claudeEdition;
    const normalized = normalizeCommand(configured);
    const detectedClaude = configured ? "" : findClaudeBinary(preferredClaude, edition);
    const selectedModel = this.getSelectedModel();

    const basePath = this.getVaultBasePath();
    const cwd = this.plugin.settings.workingDir.trim() || basePath || undefined;
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
        commandWithModel.substring(0, 200) +
          (commandWithModel.length > 200 ? "..." : "")
      );

      const isWindows = process.platform === "win32";
      const firstToken = normalized.trim().split(/\s+/)[0].replace(/^["']|["']$/g, "");
      const isDirectCmdFile =
        isWindows &&
        (firstToken.toLowerCase().endsWith(".cmd") ||
          firstToken.toLowerCase().endsWith(".bat"));

      const shell: boolean | string = gitBashPath && isDirectCmdFile ? gitBashPath : isDirectCmdFile;

      return new Promise((resolve, reject) => {
        const child = exec(
          commandWithModel,
          {
            cwd,
            maxBuffer: 1024 * 1024 * 10,
            env,
            timeout: timeoutMs,
            shell: shell,
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
          const child = exec(
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
          const child = exec(
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
        const child = execFile(
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

    new Notice(this.plugin.t("claudeNotFoundNotice"));
    return Promise.resolve(this.plugin.t("claudeNotFoundReply"));
  }

  getActiveFile(): TFile | null {
    const file = this.app.workspace.getActiveFile();
    return file ?? null;
  }

  getVaultBasePath(): string | null {
    const adapter = this.app.vault.adapter;
    if ("getBasePath" in adapter && typeof adapter.getBasePath === "function") {
      return (adapter as { getBasePath: () => string }).getBasePath() ?? null;
    }
    return null;
  }

  async insertIntoActiveFile(content: string) {
    const file = this.getActiveFile();
    if (!file) {
      new Notice(this.plugin.t("noActiveNote"));
      return;
    }
    const existing = await this.app.vault.read(file);
    await this.app.vault.modify(file, `${existing}\n\n${content.trim()}\n`);
    new Notice(this.plugin.tf("insertedInto", { path: file.path }));
  }

  private async copyToClipboard(content: string): Promise<void> {
    if (navigator?.clipboard?.writeText) {
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
    if (!this.loaded) {
      return;
    }

    this.messagesEl.empty();
    if (this.messages.length === 0) {
      const empty = this.messagesEl.createDiv("claude-code-empty");
      empty.createDiv({ text: "Niki AI", cls: "claude-code-empty-title" });
      empty.createDiv({
        text: this.plugin.t("emptyState"),
        cls: "claude-code-empty-subtitle",
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
      // 不显示角色标签，让气泡更简洁

      const contentEl = wrapper.createDiv("claude-code-content");
      if (message.isPending) {
        const streamContent = message.streamContent ?? message.content ?? "";
        const elapsedSeconds = message.thinkingStartTime
          ? Math.floor((Date.now() - message.thinkingStartTime) / 1000)
          : 0;
        const hasStream = streamContent.trim().length > 0;

        if (!hasStream) {
          const indicator = contentEl.createDiv("claude-code-thinking-indicator");

          // 添加 Claude 图标
          const logoSpan = indicator.createSpan({ cls: "claude-code-thinking-icon" });
          const logoSvg = logoSpan.createSvg("svg");
          logoSvg.setAttribute("viewBox", LOGO_SVG.viewBox);
          logoSvg.setAttribute("width", LOGO_SVG.width);
          logoSvg.setAttribute("height", LOGO_SVG.height);
          const logoPath = logoSvg.createSvg("path");
          logoPath.setAttribute("d", LOGO_SVG.path);
          logoPath.setAttribute("fill", LOGO_SVG.fill);

          // 趣味文字
          indicator.createSpan({
            cls: "claude-code-thinking-indicator-text",
            text: ` ${message.flavorText || "Thinking..."}`,
          });

          // 计时器（保存引用以便后续更新）
          const timerSpan = indicator.createSpan({
            cls: "claude-code-thinking-indicator-hint",
          });
          const initialText = ` (${this.plugin.t("thinkingIndicatorHint")} · ${this.formatDurationMmSs(elapsedSeconds)})`;
          timerSpan.setText(initialText);

          // 保存引用
          message.timerElement = timerSpan;

          // 创建计时器更新函数
          if (message.thinkingStartTime) {
            const updateTimer = () => {
              if (!timerSpan.isConnected) {
                // 元素已被移除，清理 interval
                if (message.timerInterval) {
                  clearInterval(message.timerInterval);
                  message.timerInterval = undefined;
                }
                return;
              }
              const elapsed = Math.floor((Date.now() - (message.thinkingStartTime || Date.now())) / 1000);
              timerSpan.setText(` (${this.plugin.t("thinkingIndicatorHint")} · ${this.formatDurationMmSs(elapsed)})`);
            };
            updateTimer(); // 初始更新

            // 保存到 message
            message.timerInterval = setInterval(updateTimer, 1000);
          }
        }

        const thinkingSegments = this.extractThinkingSegmentsFromStream(streamContent);
        if (thinkingSegments.length > 0) {
          const thinkingBlock = contentEl.createDiv("claude-code-thinking-block");
          thinkingBlock.addClass("expanded");

          const header = thinkingBlock.createDiv("claude-code-thinking-header");
          header.createSpan({
            cls: "claude-code-thinking-label",
            text: message.flavorText || "Thinking...",
          });

          const thinkingContent = thinkingBlock.createDiv("claude-code-thinking-content");
          void MarkdownRenderer.render(
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
          MarkdownRenderer.render(this.app, message.content, contentEl, "", this.plugin);
        } catch (error) {
          console.error("Failed to render markdown:", error);
          contentEl.createEl("pre", { text: message.content });
        }
      }

      // 只为助手消息添加操作按钮（不包括复制按钮）
      const actions = wrapper.createDiv("claude-code-message-actions");

      if (message.role === "assistant" && !message.isError && !message.isPending) {
        if (message.fileModifications && message.fileModifications.length > 0) {
          const undoBtn = actions.createEl("button", {
            text: this.plugin.t("undoChanges"),
            cls: "claude-code-undo-btn",
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
            text: message.codeChanges.some((c) => c.applied)
              ? this.plugin.t("changesApplied")
              : this.plugin.t("viewChanges"),
          });
          viewChangesBtn.addEventListener("click", () => {
            void this.toggleDiffView(wrapper, message);
          });

          const hasUnapplied = message.codeChanges.some((c) => !c.applied);
          if (hasUnapplied) {
            const applyBtn = actions.createEl("button", {
              text: this.plugin.t("applyAllChanges"),
              cls: "mod-cta",
            });
            applyBtn.addEventListener("click", () => {
              void this.applyAllChanges(message);
            });
          }
        } else if (!message.fileModifications || message.fileModifications.length === 0) {
          const insertBtn = actions.createEl("button", {
            text: this.plugin.t("insertToNote"),
          });
          insertBtn.addEventListener("click", () => {
            void this.insertIntoActiveFile(message.content);
          });
        }
      }
    }

    this.renderTasksPanel();
  }

  private renderTasksPanel(): void {
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
    setIcon(icon, "list-checks");

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
      setIcon(status, "check");
    } else {
      status.style.display = "none";
    }

    const content = panel.createDiv("claude-code-tasks-content");
    renderTaskItems(content, tasks);

    const updateCollapsedState = () => {
      const isExpanded = this.isTasksExpanded;
      content.style.display = isExpanded ? "block" : "none";
      current.style.display = isExpanded || !currentTask ? "none" : "inline-flex";
      status.style.display =
        isExpanded || completedCount !== totalCount ? "none" : "inline-flex";
      const ariaKey = isExpanded ? "tasksCollapseAria" : "tasksExpandAria";
      header.setAttribute(
        "aria-label",
        this.plugin.tf(ariaKey, {
          completed: String(completedCount),
          total: String(totalCount),
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

  private getLatestTasks(): TaskItem[] | null {
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

  private findBestMatchingFile(content: string): TFile | null {
    const allFiles = this.app.vault.getMarkdownFiles();
    const contentLines = content.trim().split("\n").slice(0, 50);
    let bestMatch: TFile | null = null;
    let bestScore = 0;

    for (const file of allFiles) {
      try {
        const fileContent = this.app.vault.cachedRead(file);
        if (!fileContent) continue;

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

        const score =
          matchCount / Math.max(contentLines.filter((l) => l.trim().length > 5).length, 1);

        if (score > bestScore && score > 0.3) {
          bestScore = score;
          bestMatch = file;
        }
      } catch {
        // ignore
      }
    }

    return bestMatch;
  }

  private async parseCodeChanges(message: ChatMessage): Promise<CodeChange[]> {
    const codeChanges: CodeChange[] = [];
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    let match;
    let blockIndex = 0;

    while ((match = codeBlockRegex.exec(message.content)) !== null) {
      const [, language, content] = match;

      const targetFile = this.findBestMatchingFile(content);
      if (!targetFile) continue;

      const originalContent = await this.app.vault.cachedRead(targetFile);
      codeChanges.push({
        language,
        originalContent,
        newContent: content.trim(),
        blockIndex: blockIndex++,
        targetFile,
      });
    }
    return codeChanges;
  }

  private parseThinkingFromResponse(response: string): { content: string; thinking?: string } {
    const thinkingMatch = response.match(/<thinking>([\s\S]*?)<\/thinking>/i);
    if (thinkingMatch) {
      const thinking = thinkingMatch[1].trim();
      const content = response.replace(/<thinking>[\s\S]*?<\/thinking>/gi, "").trim();
      return { content, thinking };
    }

    return { content: response };
  }

  private extractThinkingSegmentsFromStream(stream: string): string[] {
    const segments: string[] = [];
    const regex = /<thinking>([\s\S]*?)<\/thinking>/gi;
    let match: RegExpExecArray | null;
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

  private hasOpenThinking(stream: string): boolean {
    const openIndex = stream.lastIndexOf("<thinking>");
    if (openIndex === -1) {
      return false;
    }
    const closeIndex = stream.lastIndexOf("</thinking>");
    return openIndex > closeIndex;
  }

  private stripThinkingTagsFromStream(stream: string): string {
    let cleaned = stream.replace(/<thinking>[\s\S]*?<\/thinking>/gi, "");
    const openIndex = cleaned.lastIndexOf("<thinking>");
    if (openIndex !== -1) {
      cleaned = cleaned.slice(0, openIndex);
    }
    return cleaned.trim();
  }

  private extractCliPrelude(stream: string, finalAnswer: string): string {
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

  private formatDurationMmSs(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins)}:${String(secs).padStart(2, "0")}`;
  }

  private setupCollapsible(
    wrapperEl: HTMLElement,
    headerEl: HTMLElement,
    contentEl: HTMLElement,
    state: { isExpanded: boolean }
  ): void {
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

  private renderThinkingBlock(parentEl: HTMLElement, message: ChatMessage): HTMLElement {
    const wrapperEl = parentEl.createDiv({ cls: "claude-code-thinking-block" });

    const header = wrapperEl.createDiv({ cls: "claude-code-thinking-header" });
    header.setAttribute("tabindex", "0");
    header.setAttribute("role", "button");
    header.setAttribute("aria-expanded", "false");

    const labelEl = header.createSpan({ cls: "claude-code-thinking-label" });
    const duration = message.thinkingDuration
      ? this.plugin.tf("thinkingLabel", { duration: String(message.thinkingDuration) })
      : this.plugin.t("thinkingLabelShort");
    labelEl.setText(duration);

    const contentEl = wrapperEl.createDiv({ cls: "claude-code-thinking-content" });
    void MarkdownRenderer.render(this.app, message.thinkingContent || "", contentEl, "", this.plugin);

    const state = { isExpanded: false };
    this.setupCollapsible(wrapperEl, header, contentEl, state);

    return wrapperEl;
  }

  private renderDiffView(container: HTMLElement, diff: DiffResult, targetFile: TFile): void {
    const diffContainer = container.createDiv("claude-code-diff-container");

    const header = diffContainer.createDiv("claude-code-diff-header");

    const fileLink = header.createEl("a", {
      text: targetFile.path,
      cls: "claude-code-diff-file",
    });
    fileLink.addEventListener("click", () => {
      this.app.workspace.openLinkText(targetFile.path, "", true);
    });
    fileLink.style.cursor = "pointer";
    fileLink.style.textDecoration = "underline";

    const stats = this.computeDiffStats(diff);
    header.createSpan({
      text: `+${stats.added} -${stats.removed}`,
      cls: "claude-code-diff-stats",
    });

    const diffContent = diffContainer.createDiv("claude-code-diff-content");
    diff.changes.forEach((change) => {
      const lineEl = diffContent.createDiv("claude-code-diff-line");
      lineEl.addClass(`claude-code-diff-${change.type}`);

      const lineNumEl = lineEl.createDiv("claude-code-diff-line-num");
      lineNumEl.setText(
        change.type === "removed"
          ? `${change.originalLine}`
          : change.type === "added"
            ? `${change.newLine}`
            : `${change.originalLine} → ${change.newLine}`
      );

      const contentEl = lineEl.createDiv("claude-code-diff-line-content");
      contentEl.setText(change.content);
    });
  }

  private computeDiffStats(diff: DiffResult): { added: number; removed: number } {
    return diff.changes.reduce(
      (stats, change) => {
        if (change.type === "added") stats.added++;
        else if (change.type === "removed") stats.removed++;
        return stats;
      },
      { added: 0, removed: 0 }
    );
  }

  private toggleDiffView(wrapper: HTMLElement, message: ChatMessage): void {
    let diffContainer = wrapper.querySelector(".claude-code-diff-container") as HTMLElement;

    if (diffContainer) {
      diffContainer.toggleClass("claude-code-diff-hidden");
      return;
    }

    if (!message.codeChanges || message.codeChanges.length === 0) return;

    const codeChange = message.codeChanges[0];
    if (!codeChange.targetFile) return;

    const diff = computeDiff(codeChange.originalContent, codeChange.newContent);
    this.renderDiffView(wrapper, diff, codeChange.targetFile);
  }

  private async applyCodeChanges(codeChange: CodeChange): Promise<void> {
    const file = codeChange.targetFile;
    if (!file) {
      new Notice(this.plugin.t("noTargetFile"));
      return;
    }

    try {
      await this.app.vault.modify(file, codeChange.newContent);
      codeChange.applied = true;
      new Notice(this.plugin.tf("changesAppliedTo", { path: file.path }));
      this.renderMessages();
    } catch (error) {
      const message = error instanceof Error ? error.message : this.plugin.t("unknownError");
      new Notice(this.plugin.tf("failedApplyChanges", { message }));
    }
  }

  private async applyAllChanges(message: ChatMessage): Promise<void> {
    if (!message.codeChanges) return;
    for (const codeChange of message.codeChanges) {
      if (!codeChange.applied) {
        await this.applyCodeChanges(codeChange);
      }
    }
  }

  private async undoFileModifications(message: ChatMessage): Promise<void> {
    if (!message.fileModifications || message.fileModifications.length === 0) {
      return;
    }

    for (const mod of message.fileModifications) {
      try {
        await this.app.vault.modify(mod.file, mod.originalContent);
        new Notice(this.plugin.tf("undoSuccess", { path: mod.filePath }));
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : this.plugin.t("unknownError");
        new Notice(this.plugin.tf("undoFailed", { message: errorMsg }));
      }
    }

    message.fileModifications = [];
    this.renderMessages();
  }

  private showFilePicker(): void {
    if (this.filePickerEl) {
      this.filePickerEl.remove();
    }

    const pickerAnchor = this.composerEl ?? this.containerEl;
    this.filePickerEl = pickerAnchor.createDiv("claude-code-file-picker");

    const files = this.app.vault.getMarkdownFiles();
    const activeFile = this.getActiveFile();

    const searchInput = this.filePickerEl.createEl("input", {
      type: "text",
      placeholder: this.plugin.t("searchFilesPlaceholder"),
      cls: "claude-code-file-search",
    });

    const fileList = this.filePickerEl.createDiv("claude-code-file-list");

    const renderFileList = (filter: string = "") => {
      fileList.empty();
      const filteredFiles = files.filter((f) =>
        f.path.toLowerCase().includes(filter.toLowerCase())
      );

      for (const file of filteredFiles.slice(0, 10)) {
        const item = fileList.createDiv("claude-code-file-item");
        if (file === activeFile) {
          item.addClass("claude-code-file-active");
        }

        item.createSpan({
          text: file.basename,
          cls: "claude-code-file-name",
        });
        item.createSpan({
          text: file.path,
          cls: "claude-code-file-path",
        });

        item.addEventListener("click", () => {
          this.addMentionedItem({
            type: "file",
            name: file.basename,
            path: file.path,
          });
          this.hideFilePicker();
        });
      }
    };

    renderFileList();

    searchInput.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      renderFileList(target.value);
    });

    setTimeout(() => {
      document.addEventListener("click", this.handleOutsideClick);
    }, 0);
  }

  private hideFilePicker(): void {
    if (this.filePickerEl) {
      this.filePickerEl.remove();
      this.filePickerEl = undefined;
    }
    document.removeEventListener("click", this.handleOutsideClick);
  }

  private handleOutsideClick = (e: MouseEvent): void => {
    if (
      this.filePickerEl &&
      !this.filePickerEl.contains(e.target as Node) &&
      !this.inputEl.contains(e.target as Node)
    ) {
      this.hideFilePicker();
    }
  };

  private addMentionedItem(item: MentionedItem): void {
    const exists = this.mentionedItems.some((i) => i.path === item.path);
    if (exists) {
      return;
    }
    this.mentionedItems.push(item);
    this.renderMentionTags();
    this.inputEl.focus();
  }

  private removeMentionedItem(item: MentionedItem): void {
    this.mentionedItems = this.mentionedItems.filter((i) => i.path !== item.path);
    this.renderMentionTags();
  }

  private renderMentionTags(): void {
    this.mentionTagsEl.empty();
    this.mentionTagsEl.toggleClass("has-tags", this.mentionedItems.length > 0);

    for (const item of this.mentionedItems) {
      const tag = this.mentionTagsEl.createDiv("claude-code-mention-tag");

      const icon = tag.createSpan({ cls: "claude-code-mention-icon" });
      if (item.type === "folder") {
        icon.setText("📁");
      } else {
        icon.setText("@");
      }

      const displayName =
        item.type === "folder" ? `${item.name} (${item.files?.length || 0})` : item.name;

      const name = tag.createSpan({
        text: displayName,
        cls: "claude-code-mention-name",
      });
      name.setAttribute("title", item.path);

      const removeBtn = tag.createSpan({
        text: "×",
        cls: "claude-code-mention-remove",
      });
      removeBtn.addEventListener("click", () => this.removeMentionedItem(item));
    }
  }

  private clearMentionTags(): void {
    this.mentionedItems = [];
    this.renderMentionTags();
  }

  private scanFolder(folderPath: string): TFile[] {
    const TEXT_EXTENSIONS = new Set([
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
      "rss",
    ]);

    const files: TFile[] = [];
    const allFiles = this.app.vault.getFiles();

    for (const file of allFiles) {
      if (file.path.startsWith(folderPath) || file.path.startsWith(`${folderPath}/`)) {
        const ext = file.extension?.toLowerCase();
        if (ext && TEXT_EXTENSIONS.has(ext)) {
          files.push(file);
        }
      }
    }

    return files;
  }

  private async switchAssistant(assistantId: string): Promise<void> {
    const assistant = this.plugin.settings.assistantPresets.find((a) => a.id === assistantId);
    if (!assistant) return;

    this.plugin.settings.currentAssistantId = assistantId;
    await this.plugin.saveSettings();
    this.renderAssistantSelector();
  }

  private getAvailableModels(): { value: string; label: string; description: string }[] {
    const models = [...DEFAULT_CLAUDE_MODELS];
    const current = this.plugin.settings.model?.trim();
    if (current && !models.some((model) => model.value === current)) {
      models.unshift({ value: current, label: current, description: "Custom model" });
    }
    return models;
  }

  private renderModelSelector(): void {
    if (!this.modelSelectorEl) return;

    this.modelSelectorEl.empty();
    const models = this.getAvailableModels();
    const currentModel = this.plugin.settings.model || models[0].value;
    const currentInfo = models.find((model) => model.value === currentModel) || models[0];

    const button = this.modelSelectorEl.createDiv("claude-code-model-btn");
    button.createSpan({
      cls: "claude-code-model-label",
      text: currentInfo?.label || "Unknown",
    });
    const chevron = button.createSpan({ cls: "claude-code-model-chevron" });
    setIcon(chevron, "chevron-down");

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
            this.plugin.settings.thinkingBudget =
              DEFAULT_THINKING_BUDGET[model.value] || "off";
          }
          await this.plugin.saveSettings();
          this.renderModelSelector();
          this.renderThinkingSelector();
        })();
      });
    }
  }

  private renderThinkingSelector(): void {
    if (!this.thinkingSelectorEl) return;

    this.thinkingSelectorEl.empty();
    this.thinkingSelectorEl.createSpan({
      cls: "claude-code-thinking-label-text",
      text: this.plugin.t("thinkingBudgetLabel"),
    });

    const gears = this.thinkingSelectorEl.createDiv("claude-code-thinking-gears");
    const currentBudget = this.plugin.settings.thinkingBudget || "off";
    const currentInfo = THINKING_BUDGETS.find((budget) => budget.value === currentBudget);

    const currentEl = gears.createDiv("claude-code-thinking-current");
    currentEl.setText(currentInfo?.label || "Off");

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

  private renderAssistantSelector(): void {
    if (!this.assistantSelectEl) return;

    this.assistantSelectEl.empty();

    const assistants = this.plugin.settings.assistantPresets;
    const currentAssistantId = this.plugin.settings.currentAssistantId;

    for (const assistant of assistants) {
      const option = this.assistantSelectEl.createEl("option", {
        value: assistant.id,
        text: assistant.name || "未命名助手",
      });

      if (assistant.id === currentAssistantId) {
        option.setAttribute("selected", "selected");
      }
    }
  }

  private generateTopicId(): string {
    return `topic_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  private async createTopic(): Promise<void> {
    if (this.plugin.settings.currentTopicId) {
      const currentTopic = this.plugin.settings.topics.find(
        (t) => t.id === this.plugin.settings.currentTopicId
      );
      if (currentTopic) {
        currentTopic.messages = [...this.messages];
        currentTopic.updatedAt = Date.now();
      }
    }

    const newTopic: ChatTopic = {
      id: this.generateTopicId(),
      title: "新话题",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.plugin.settings.topics.push(newTopic);
    this.plugin.settings.currentTopicId = newTopic.id;

    this.messages = [];

    await this.plugin.saveSettings();
    this.renderMessages();
    this.renderTopicSelector();
    this.scrollToBottom();
  }

  private async switchTopic(topicId: string): Promise<void> {
    const topic = this.plugin.settings.topics.find((t) => t.id === topicId);
    if (!topic) return;

    if (this.plugin.settings.currentTopicId) {
      const currentTopic = this.plugin.settings.topics.find(
        (t) => t.id === this.plugin.settings.currentTopicId
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

  private async deleteTopic(): Promise<void> {
    const currentTopicId = this.plugin.settings.currentTopicId;
    if (!currentTopicId) return;

    const topicIndex = this.plugin.settings.topics.findIndex((t) => t.id === currentTopicId);
    if (topicIndex === -1) return;

    if (this.plugin.settings.topics.length <= 1) {
      this.messages = [];
      this.plugin.settings.topics[0].messages = [];
      this.plugin.settings.topics[0].title = "新话题";
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

  private generateTopicTitle(topic: ChatTopic): string {
    const firstUserMessage = topic.messages.find((m) => m.role === "user");
    if (!firstUserMessage) {
      return "新话题";
    }

    const content = (firstUserMessage.originalInput || firstUserMessage.content).trim();
    const title = content.length > 30 ? content.substring(0, 30) + "..." : content;

    return title;
  }

  private async updateTopicTitle(): Promise<void> {
    const currentTopicId = this.plugin.settings.currentTopicId;
    if (!currentTopicId) return;

    const topic = this.plugin.settings.topics.find((t) => t.id === currentTopicId);
    if (!topic) return;

    if (topic.title === "新话题") {
      topic.title = this.generateTopicTitle(topic);
      await this.plugin.saveSettings();
      this.renderTopicSelector();
    }
  }

  private async saveCurrentTopic(): Promise<void> {
    const currentTopicId = this.plugin.settings.currentTopicId;
    if (!currentTopicId) return;

    const topic = this.plugin.settings.topics.find((t) => t.id === currentTopicId);
    if (topic) {
      topic.messages = [...this.messages];
      topic.updatedAt = Date.now();
      await this.plugin.saveSettings();
    }
  }

  private renderTopicSelector(): void {
    if (!this.topicSelectEl) return;

    this.topicSelectEl.empty();

    const topics = this.plugin.settings.topics;
    const currentTopicId = this.plugin.settings.currentTopicId;

    for (const topic of topics) {
      const option = this.topicSelectEl.createEl("option", {
        value: topic.id,
        text: topic.title || "未命名话题",
      });

      if (topic.id === currentTopicId) {
        option.setAttribute("selected", "selected");
      }
    }

    if (this.deleteTopicBtn) {
      this.deleteTopicBtn.disabled = topics.length <= 1;
    }
  }
}
