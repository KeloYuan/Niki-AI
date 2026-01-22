import { Plugin } from "obsidian";
import { VIEW_TYPE_CLAUDE } from "./constants";
import { t, format, type I18nKey } from "./i18n";
import type { ClaudeSidebarSettings } from "./types";
import { DEFAULT_SETTINGS } from "./settings/defaults";
import { ClaudeSidebarView } from "./view/ClaudeSidebarView";
import { ClaudeSidebarSettingTab } from "./settings/ClaudeSidebarSettingTab";

export default class ClaudeSidebarPlugin extends Plugin {
  settings: ClaudeSidebarSettings;

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
      callback: () => this.activateView(),
    });

    this.addSettingTab(new ClaudeSidebarSettingTab(this.app, this));
  }

  onunload() {
    // Don't detach leaves - this resets user's custom positioning
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

  t(key: I18nKey) {
    return t(this.settings.language, key);
  }

  tf(key: I18nKey, vars: Record<string, string>) {
    return format(this.t(key), vars);
  }
}
