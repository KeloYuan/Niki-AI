import { App, Modal } from "obsidian";
import type ClaudeSidebarPlugin from "../plugin";

export class PathHelpModal extends Modal {
  plugin: ClaudeSidebarPlugin;

  constructor(app: App, plugin: ClaudeSidebarPlugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h3", { text: this.plugin.t("pathHelpTitle") });
    contentEl.createEl("pre", { text: this.plugin.t("pathHelpBody") });
  }

  onClose(): void {
    this.contentEl.empty();
  }
}
