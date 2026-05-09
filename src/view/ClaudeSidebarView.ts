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
    header.createDiv({ text: "Niki AI" }).addClass("claude-code-title");

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

    this.inputEl.addEventListener("drop", (event) => {
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

              const folderFiles = this.scanFolder(folderPath);

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

    this.includeNoteEl.addEventListener("change", () => {
      this.plugin.settings.includeCurrentNote = this.includeNoteEl.checked;
      void this.plugin.saveSettings();
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
    void this.renderMessages();

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
        if (file) file

... [OUTPUT TRUNCATED - 29276 chars omitted out of 79276 total] ...

merSpan.setText(` (${this.plugin.t("thinkingIndicatorHint")} · ${this.formatDurationMmSs(elapsed)})`);
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
            this
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
          void MarkdownRenderer.render(this.app, message.content, contentEl, "", this);
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
      current.addClass("claude-code-hidden");
    }

    const status = header.createSpan("claude-code-tasks-status");
    if (completedCount === totalCount && totalCount > 0) {
      status.addClass("is-complete");
      setIcon(status, "check");
    } else {
      status.addClass("claude-code-hidden");
    }

    const content = panel.createDiv("claude-code-tasks-content");
    renderTaskItems(content, tasks);

    const updateCollapsedState = () => {
      const isExpanded = this.isTasksExpanded;
      if (isExpanded) { content.removeClass("claude-code-hidden"); } else { content.addClass("claude-code-hidden"); }
      if (isExpanded || !currentTask) { current.addClass("claude-code-hidden"); } else { current.removeClass("claude-code-hidden"); }
      if (isExpanded || completedCount !== totalCount) { status.addClass("claude-code-hidden"); } else { status.removeClass("claude-code-hidden"); }
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

  private async findBestMatchingFile(content: string): Promise<TFile | null> {
    const allFiles = this.app.vault.getMarkdownFiles();
    const contentLines = content.trim().split("\n").slice(0, 50);
    let bestMatch: TFile | null = null;
    let bestScore = 0;

    for (const file of allFiles) {
      try {
        const fileContent = await this.app.vault.cachedRead(file);
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

      const targetFile = await this.findBestMatchingFile(content);
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
        contentEl.removeClass("claude-code-hidden");
        headerEl.setAttribute("aria-expanded", "true");
      } else {
        wrapperEl.removeClass("expanded");
        contentEl.addClass("claude-code-hidden");
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
    void MarkdownRenderer.render(this.app, message.thinkingContent || "", contentEl, "", this);

    const state = { isExpanded: false };
    this.setupCollapsible(wrapperEl, header, contentEl, state);

    return wrapperEl;
  }

  private renderDiffView(container: HTMLElement, diff: DiffResult, targetFile: TFile): void {
    const diffContainer = container.createDiv("claude-code-diff-container");

    const header = diffContainer.createDiv("claude-code-diff-header");

    const fileLink = header.createEl("a", {
      text: targetFile.path,
      cls: "claude-code-diff-file claude-code-diff-file-link",
    });
    fileLink.addEventListener("click", () => {
      void this.app.workspace.openLinkText(targetFile.path, "", true);
    });

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
      void this.renderMessages();
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
    void this.renderMessages();
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
    const models: { value: string; label: string; description: string }[] = [...DEFAULT_CLAUDE_MODELS];
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
          this.plugin.settings.model = model.value as import("../models").ClaudeModel;
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
    void this.renderMessages();
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
    void this.renderMessages();
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
      void this.renderMessages();
      this.renderTopicSelector();
      return;
    }

    this.plugin.settings.topics.splice(topicIndex, 1);

    const nextTopic = this.plugin.settings.topics[Math.max(0, topicIndex - 1)];
    this.plugin.settings.currentTopicId = nextTopic.id;
    this.messages = [...nextTopic.messages];

    await this.plugin.saveSettings();
    void this.renderMessages();
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