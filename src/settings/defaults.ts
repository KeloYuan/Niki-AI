import type { ClaudeSidebarSettings } from "../types";

export const DEFAULT_SETTINGS: ClaudeSidebarSettings = {
  claudeCommand: "",
  claudePath: "",
  claudeEdition: "auto",
  nodePath: "",
  gitBashPath: "",
  model: "haiku",
  thinkingBudget: "off",
  defaultPrompt:
    "You are Niki AI embedded in Obsidian (powered by Claude Code). Help me edit Markdown notes.\n" +
    "When you propose changes, be explicit and keep the style consistent.",
  workingDir: "",
  language: "zh-CN",
  includeCurrentNote: false,
  enableTaskTracking: true,
  topics: [],
  currentTopicId: null,
  assistantPresets: [
    {
      id: "assistant_default",
      name: "默认助手",
      systemPrompt:
        "You are Niki AI embedded in Obsidian (powered by Claude Code). Help me edit Markdown notes.\n" +
        "When you propose changes, be explicit and keep the style consistent.",
    },
  ],
  currentAssistantId: "assistant_default",
};
