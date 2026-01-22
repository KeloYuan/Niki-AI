import type { TFile } from "obsidian";
import type { ClaudeModel, ThinkingBudget } from "./models";

export type Language = "zh-CN" | "en-US";
export type ClaudeEdition = "auto" | "npm" | "native" | "custom";
export type TaskStatus = "pending" | "in_progress" | "completed";

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  streamContent?: string;
  isError?: boolean;
  isPending?: boolean;
  codeChanges?: CodeChange[];
  originalInput?: string;
  fileModifications?: FileModification[];
  tasks?: TaskItem[];
  thinkingContent?: string;
  thinkingDuration?: number;
  thinkingStartTime?: number;
  flavorText?: string;  // Random flavor text for thinking indicator
  timerInterval?: ReturnType<typeof setInterval>;  // Timer interval reference
  timerElement?: HTMLSpanElement;  // Timer span element for targeted updates
};

export type TaskItem = {
  content: string;
  status: TaskStatus;
  activeForm?: string;
};

export type MentionedItem = {
  type: "file" | "folder";
  name: string;
  path: string;
  files?: TFile[];
};

export type FileModification = {
  filePath: string;
  originalContent: string;
  file: TFile;
  timestamp: number;
};

export type CodeChange = {
  language: string;
  originalContent: string;
  newContent: string;
  blockIndex: number;
  applied?: boolean;
  targetFile?: TFile;
};

export type ChatTopic = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
};

export type AssistantPreset = {
  id: string;
  name: string;
  systemPrompt: string;
};

export interface ClaudeSidebarSettings {
  claudeCommand: string;
  claudePath: string;
  claudeEdition: ClaudeEdition;
  nodePath: string;
  gitBashPath: string;
  model: ClaudeModel;
  thinkingBudget: ThinkingBudget;
  defaultPrompt: string;
  workingDir: string;
  language: Language;
  includeCurrentNote: boolean;
  enableTaskTracking: boolean;
  topics: ChatTopic[];
  currentTopicId: string | null;
  assistantPresets: AssistantPreset[];
  currentAssistantId: string | null;
}

export type DiffResult = {
  changes: DiffChange[];
};

export type DiffChange = {
  type: "added" | "removed" | "unchanged";
  originalLine?: number;
  newLine?: number;
  content: string;
};
