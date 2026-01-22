import { setIcon } from "obsidian";
import type { TaskItem, TaskStatus } from "../types";

type ParsedTasks = {
  tasks: TaskItem[] | null;
  block?: string;
};

export function extractTasksFromReply(
  reply: string
): { content: string; tasks: TaskItem[] | null } {
  const parsed = parseTasksFromText(reply);
  if (parsed.tasks && parsed.block) {
    const cleaned = reply.replace(parsed.block, "").replace(/\n{3,}/g, "\n\n").trim();
    return { content: cleaned, tasks: parsed.tasks };
  }
  return { content: reply.trim(), tasks: parsed.tasks };
}

export function parseTasksFromText(text: string): ParsedTasks {
  const codeBlockRegex = /```(todo|tasks|tasklist|json)\s*\n([\s\S]*?)```/gi;
  let match: RegExpExecArray | null;
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
    const tasks = parseTodoJson(raw) ?? parseMarkdownTasks(raw);
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

export function renderTaskItems(container: HTMLElement, tasks: TaskItem[]): void {
  container.empty();
  for (const task of tasks) {
    const item = container.createDiv({
      cls: `claude-code-task-item claude-code-task-${task.status}`,
    });
    const icon = item.createSpan({ cls: "claude-code-task-status-icon" });
    icon.setAttribute("aria-hidden", "true");
    setIcon(icon, task.status === "completed" ? "check" : "dot");
    const text = item.createSpan({ cls: "claude-code-task-text" });
    text.setText(task.status === "in_progress" && task.activeForm ? task.activeForm : task.content);
  }
}

function parseTodoJson(raw: string): TaskItem[] | null {
  const payload = extractJsonPayload(raw);
  let parsed: unknown;
  try {
    parsed = JSON.parse(payload);
  } catch {
    return null;
  }

  const items = Array.isArray(parsed)
    ? parsed
    : (parsed as { todos?: unknown; tasks?: unknown; items?: unknown }).todos ??
      (parsed as { tasks?: unknown }).tasks ??
      (parsed as { items?: unknown }).items;

  if (!Array.isArray(items)) {
    return null;
  }

  const tasks: TaskItem[] = [];
  for (const item of items) {
    if (typeof item === "string") {
      const content = item.trim();
      if (content) {
        tasks.push({ content, status: "pending" });
      }
      continue;
    }
    if (!item || typeof item !== "object") {
      continue;
    }
    const record = item as Record<string, unknown>;
    const content = String(record.content ?? record.text ?? record.title ?? "").trim();
    if (!content) {
      continue;
    }
    const activeForm =
      typeof record.activeForm === "string"
        ? record.activeForm
        : typeof record.active_form === "string"
          ? record.active_form
          : undefined;
    const rawStatus =
      typeof record.status === "string"
        ? record.status
        : typeof record.state === "string"
          ? record.state
          : undefined;
    const status = normalizeTaskStatus(
      rawStatus,
      record.done === true ? "x" : undefined,
      Boolean(activeForm)
    );
    tasks.push({ content, status, activeForm });
  }

  return tasks.length > 0 ? tasks : null;
}

function extractJsonPayload(raw: string): string {
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

function normalizeTaskStatus(
  value?: string,
  checkbox?: string,
  hasActiveForm?: boolean
): TaskStatus {
  const normalized = value?.toLowerCase().replace(/[\s-]+/g, "_") ?? "";
  if (normalized === "completed" || normalized === "done" || normalized === "finished") {
    return "completed";
  }
  if (
    normalized === "in_progress" ||
    normalized === "inprogress" ||
    normalized === "doing" ||
    normalized === "working"
  ) {
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

function parseMarkdownTasks(text: string): TaskItem[] {
  const tasks: TaskItem[] = [];
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
      status: normalizeTaskStatus(undefined, match[1]),
    });
  }
  return tasks;
}
