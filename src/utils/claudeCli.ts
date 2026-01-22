import fs from "fs";
import os from "os";
import path from "path";
import type { ChildProcess } from "child_process";
import type { ClaudeEdition } from "../types";

type StreamBuffers = {
  getCombined: () => string;
};

const ANSI_REGEX =
  /[\u001B\u009B][[\]()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

export function sanitizeStreamOutput(input: string): string {
  return input.replace(ANSI_REGEX, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

export function normalizeCommand(command: string): string {
  if (!command) {
    return "";
  }
  const trimmed = command.trim();
  if (!trimmed) {
    return "";
  }
  const firstToken = trimmed.split(/\s+/)[0];
  if (firstToken && isDirectory(firstToken)) {
    const resolved = path.join(firstToken, "claude");
    return trimmed.replace(firstToken, resolved);
  }
  return trimmed;
}

export function findClaudeBinary(
  preferredPath?: string,
  edition: ClaudeEdition = "auto"
): string {
  const home = os.homedir();
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

  const npmCandidates: string[] = [];
  const nativeCandidates: string[] = [];

  if (isWindows) {
    const appData = process.env.APPDATA || path.join(home, "AppData", "Roaming");
    npmCandidates.push(
      path.join(appData, "npm", "claude.cmd"),
      path.join(appData, "npm", "claude")
    );
    nativeCandidates.push(
      path.join(home, ".claude", "bin", "claude.exe"),
      path.join(home, ".claude", "bin", "claude.cmd")
    );
  } else {
    npmCandidates.push(path.join(home, ".npm-global", "bin", "claude"));
    nativeCandidates.push(
      path.join(home, ".local", "bin", "claude"),
      path.join(home, ".claude", "bin", "claude")
    );
  }

  nativeCandidates.push(
    "/opt/homebrew/bin/claude",
    "/usr/local/bin/claude",
    "/usr/bin/claude"
  );

  let candidates: string[] = [];
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

export function windowsPathToGitBash(windowsPath: string): string {
  const match = windowsPath.match(/^([A-Za-z]):\\(.*)$/);
  if (match) {
    const drive = match[1].toLowerCase();
    const rest = match[2].replace(/\\/g, "/");
    return `/${drive}/${rest}`;
  }
  return windowsPath.replace(/\\/g, "/");
}

export function buildEnv(
  preferredNodePath?: string,
  gitBashPath?: string
): NodeJS.ProcessEnv {
  const env = { ...process.env };
  const home = os.homedir();
  env.HOME = env.HOME || home;
  const nodeBinary = findNodeBinary(preferredNodePath);
  const nodeDir = nodeBinary ? path.dirname(nodeBinary) : "";

  const isWindows = process.platform === "win32";
  const usingGitBash = isWindows && gitBashPath && gitBashPath.trim();
  let extra: string[] = [];

  if (isWindows) {
    const appData = process.env.APPDATA || path.join(home, "AppData", "Roaming");
    const localAppData =
      process.env.LOCALAPPDATA || path.join(home, "AppData", "Local");
    const programFiles = process.env.ProgramFiles || "C:\\Program Files";
    const programFilesX86 =
      process.env["ProgramFiles(x86)"] || "C:\\Program Files (x86)";
    const nvmHome = process.env.NVM_HOME;
    const nvmSymlink = process.env.NVM_SYMLINK;
    extra = [
      path.join(appData, "npm"),
      path.join(programFiles, "nodejs"),
      path.join(programFilesX86, "nodejs"),
      path.join(localAppData, "Programs", "nodejs"),
      ...(nvmSymlink ? [nvmSymlink] : []),
      ...(nvmHome ? [nvmHome] : []),
    ];
  } else {
    extra = [
      path.join(home, ".npm-global", "bin"),
      path.join(home, ".local", "bin"),
      path.join(home, ".volta", "bin"),
      path.join(home, ".asdf", "shims"),
      path.join(home, ".nvm", "versions", "node"),
      "/opt/homebrew/bin",
      "/usr/local/bin",
      "/usr/bin",
    ];
  }

  const currentPath = env.PATH || "";
  const parts = currentPath.split(path.delimiter).filter(Boolean);
  const merged = [...(nodeDir ? [nodeDir] : []), ...extra, ...parts];

  if (usingGitBash) {
    const convertedPaths = Array.from(new Set(merged)).map(windowsPathToGitBash);
    env.PATH = convertedPaths.join(":");
  } else {
    env.PATH = Array.from(new Set(merged)).join(path.delimiter);
  }
  return env;
}

export function resolveClaudeTimeoutMs(env: NodeJS.ProcessEnv): number {
  const defaultTimeout = 300000;
  const settingsTimeout = readClaudeSettingsTimeoutMs();
  if (settingsTimeout !== null) {
    return settingsTimeout;
  }
  const envTimeout = parseTimeoutMs(env.API_TIMEOUT_MS);
  return envTimeout ?? defaultTimeout;
}

export function readClaudeSettingsTimeoutMs(): number | null {
  const home = os.homedir();
  const settingsPath = path.join(home, ".claude", "settings.json");
  try {
    const raw = fs.readFileSync(settingsPath, "utf8");
    const parsed = JSON.parse(raw) as {
      env?: Record<string, string | number>;
    };
    const value = parsed.env?.API_TIMEOUT_MS;
    return parseTimeoutMs(value === undefined ? undefined : String(value));
  } catch {
    return null;
  }
}

export function parseTimeoutMs(value?: string): number | null {
  if (!value) {
    return null;
  }
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

export function isExecutable(target: string): boolean {
  try {
    if (process.platform === "win32") {
      fs.accessSync(target, fs.constants.F_OK);
      return true;
    }
    fs.accessSync(target, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

export function isDirectory(target: string): boolean {
  try {
    return fs.statSync(target).isDirectory();
  } catch {
    return false;
  }
}

export function isNodeScript(target: string): boolean {
  try {
    const fd = fs.openSync(target, "r");
    const buffer = Buffer.alloc(200);
    const bytes = fs.readSync(fd, buffer, 0, buffer.length, 0);
    fs.closeSync(fd);
    const firstLine = buffer.toString("utf8", 0, bytes).split("\n")[0];
    return firstLine.includes("node");
  } catch {
    return false;
  }
}

export function findNodeBinary(preferredPath?: string): string {
  if (preferredPath) {
    const candidate = preferredPath.trim();
    if (candidate && isExecutable(candidate)) {
      return candidate;
    }
  }
  const home = os.homedir();
  const isWindows = process.platform === "win32";
  const localAppData = process.env.LOCALAPPDATA || path.join(home, "AppData", "Local");
  const programFiles = process.env.ProgramFiles || "C:\\Program Files";
  const programFilesX86 =
    process.env["ProgramFiles(x86)"] || "C:\\Program Files (x86)";
  const nvmHome = process.env.NVM_HOME;
  const nvmSymlink = process.env.NVM_SYMLINK;
  const direct = isWindows
    ? [
        nvmSymlink ? path.join(nvmSymlink, "node.exe") : "",
        nvmHome ? path.join(nvmHome, "node.exe") : "",
        path.join(programFiles, "nodejs", "node.exe"),
        path.join(programFilesX86, "nodejs", "node.exe"),
        path.join(localAppData, "Programs", "nodejs", "node.exe"),
      ].filter(Boolean)
    : [
        path.join(home, ".volta", "bin", "node"),
        path.join(home, ".asdf", "shims", "node"),
        path.join(home, ".nvm", "versions", "node", "bin", "node"),
        "/opt/homebrew/bin/node",
        "/usr/local/bin/node",
        "/usr/bin/node",
      ];
  for (const candidate of direct) {
    if (isExecutable(candidate)) {
      return candidate;
    }
  }

  if (!isWindows) {
    const nvmRoot = path.join(home, ".nvm", "versions", "node");
    try {
      const versions = fs
        .readdirSync(nvmRoot)
        .map((entry) => path.join(nvmRoot, entry, "bin", "node"))
        .filter((candidate) => isExecutable(candidate))
        .sort();
      if (versions.length > 0) {
        return versions[versions.length - 1];
      }
    } catch {
      // ignore
    }
  }

  return "";
}

export function replacePlaceholder(command: string, prompt: string): string {
  if (/"\{prompt\}"/.test(command)) {
    const escaped = prompt
      .replace(/\\/g, "\\\\")
      .replace(/\$/g, "\\$")
      .replace(/`/g, "\\`")
      .replace(/"/g, '\\"')
      .replace(/\n/g, " ")
      .replace(/\r/g, " ");
    return command.replace(/"\{prompt\}"/g, `"${escaped}"`);
  }

  if (/'\{prompt\}'/.test(command)) {
    const escaped = prompt.replace(/'/g, "'\\''");
    return command.replace(/'\{prompt\}'/g, `'${escaped}'`);
  }

  const escaped = prompt.replace(/'/g, "'\\''");
  return command.replace(/\{prompt\}/g, `'${escaped}'`);
}

export function attachStreamBuffers(
  child: ChildProcess,
  onChunk?: (chunk: string) => void
): StreamBuffers {
  const combined: string[] = [];

  const append = (chunk: string) => {
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
    getCombined: () => combined.join(""),
  };
}
