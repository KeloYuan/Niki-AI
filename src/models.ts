export type ClaudeModel = "haiku" | "sonnet" | "opus" | string;

export const DEFAULT_CLAUDE_MODELS: {
  value: ClaudeModel;
  label: string;
  description: string;
}[] = [
  { value: "haiku", label: "Haiku", description: "Fast and efficient" },
  { value: "sonnet", label: "Sonnet", description: "Balanced performance" },
  { value: "opus", label: "Opus", description: "Most capable" },
];

export type ThinkingBudget = "off" | "low" | "medium" | "high" | "xhigh";

export const THINKING_BUDGETS: {
  value: ThinkingBudget;
  label: string;
  tokens: number;
}[] = [
  { value: "off", label: "Off", tokens: 0 },
  { value: "low", label: "Low", tokens: 4000 },
  { value: "medium", label: "Med", tokens: 8000 },
  { value: "high", label: "High", tokens: 16000 },
  { value: "xhigh", label: "Ultra", tokens: 32000 },
];

export const DEFAULT_THINKING_BUDGET: Record<string, ThinkingBudget> = {
  haiku: "off",
  sonnet: "low",
  opus: "medium",
};
