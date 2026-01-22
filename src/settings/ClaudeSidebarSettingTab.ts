import { App, PluginSettingTab, Setting } from "obsidian";
import type ClaudeSidebarPlugin from "../plugin";
import type { AssistantPreset, ClaudeEdition, Language } from "../types";
import { DEFAULT_CLAUDE_MODELS, THINKING_BUDGETS, DEFAULT_THINKING_BUDGET } from "../models";
import type { ThinkingBudget } from "../models";
import { PathHelpModal } from "./PathHelpModal";

export class ClaudeSidebarSettingTab extends PluginSettingTab {
  plugin: ClaudeSidebarPlugin;

  constructor(app: App, plugin: ClaudeSidebarPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: this.plugin.t("settingTitle") });

    new Setting(containerEl)
      .setName(this.plugin.t("settingLanguageName"))
      .setDesc(this.plugin.t("settingLanguageDesc"))
      .addDropdown((dropdown) =>
        dropdown
          .addOption("zh-CN", "简体中文")
          .addOption("en-US", "English")
          .setValue(this.plugin.settings.language)
          .onChange(async (value) => {
            this.plugin.settings.language = value as Language;
            await this.plugin.saveSettings();
            this.display();
          })
      );

    new Setting(containerEl)
      .setName(this.plugin.t("settingClaudeCommandName"))
      .setDesc(this.plugin.t("settingClaudeCommandDesc"))
      .addText((text) =>
        text
          .setPlaceholder(this.plugin.t("settingClaudeCommandPlaceholder"))
          .setValue(this.plugin.settings.claudeCommand)
          .onChange(async (value) => {
            this.plugin.settings.claudeCommand = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(this.plugin.t("settingClaudePathName"))
      .setDesc(this.plugin.t("settingClaudePathDesc"))
      .addText((text) =>
        text
          .setPlaceholder("C:\\Users\\<name>\\AppData\\Roaming\\npm\\claude.cmd")
          .setValue(this.plugin.settings.claudePath)
          .onChange(async (value) => {
            this.plugin.settings.claudePath = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(this.plugin.t("settingClaudeEditionName"))
      .setDesc(this.plugin.t("settingClaudeEditionDesc"))
      .addDropdown((dropdown) =>
        dropdown
          .addOption("auto", this.plugin.t("editionAuto"))
          .addOption("npm", this.plugin.t("editionNpm"))
          .addOption("native", this.plugin.t("editionNative"))
          .addOption("custom", this.plugin.t("editionCustom"))
          .setValue(this.plugin.settings.claudeEdition)
          .onChange(async (value) => {
            this.plugin.settings.claudeEdition = value as ClaudeEdition;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(this.plugin.t("settingModelName"))
      .setDesc(this.plugin.t("settingModelDesc"))
      .addDropdown((dropdown) => {
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

    new Setting(containerEl)
      .setName(this.plugin.t("settingThinkingBudgetName"))
      .setDesc(this.plugin.t("settingThinkingBudgetDesc"))
      .addDropdown((dropdown) => {
        const currentBudget = this.plugin.settings.thinkingBudget || "off";
        for (const budget of THINKING_BUDGETS) {
          dropdown.addOption(budget.value, budget.label);
        }
        dropdown.setValue(currentBudget).onChange(async (value) => {
          this.plugin.settings.thinkingBudget = value as ThinkingBudget;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName(this.plugin.t("settingNodePathName"))
      .setDesc(this.plugin.t("settingNodePathDesc"))
      .addText((text) =>
        text
          .setPlaceholder("C:\\Program Files\\nodejs\\node.exe")
          .setValue(this.plugin.settings.nodePath)
          .onChange(async (value) => {
            this.plugin.settings.nodePath = value;
            await this.plugin.saveSettings();
          })
      )
      .addButton((button) =>
        button.setButtonText(this.plugin.t("pathHelpButton")).onClick(() => {
          new PathHelpModal(this.app, this.plugin).open();
        })
      );

    new Setting(containerEl)
      .setName(this.plugin.t("settingGitBashPathName"))
      .setDesc(this.plugin.t("settingGitBashPathDesc"))
      .addText((text) =>
        text
          .setPlaceholder("C:\\Program Files\\Git\\bin\\bash.exe")
          .setValue(this.plugin.settings.gitBashPath)
          .onChange(async (value) => {
            this.plugin.settings.gitBashPath = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(this.plugin.t("settingDefaultPromptName"))
      .setDesc(this.plugin.t("settingDefaultPromptDesc"))
      .addTextArea((text) =>
        text
          .setPlaceholder(this.plugin.t("settingDefaultPromptPlaceholder"))
          .setValue(this.plugin.settings.defaultPrompt)
          .onChange(async (value) => {
            this.plugin.settings.defaultPrompt = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(this.plugin.t("settingTaskTrackingName"))
      .setDesc(this.plugin.t("settingTaskTrackingDesc"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableTaskTracking)
          .onChange(async (value) => {
            this.plugin.settings.enableTaskTracking = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(this.plugin.t("settingWorkingDirName"))
      .setDesc(this.plugin.t("settingWorkingDirDesc"))
      .addText((text) =>
        text
          .setPlaceholder("/path/to/vault")
          .setValue(this.plugin.settings.workingDir)
          .onChange(async (value) => {
            this.plugin.settings.workingDir = value;
            await this.plugin.saveSettings();
          })
      );

    containerEl.createEl("h3", {
      text: this.plugin.t("assistantSectionName"),
      cls: "claude-code-about-header",
    });

    containerEl.createEl("p", {
      text: this.plugin.t("assistantSectionDesc"),
      cls: "setting-item-description",
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
          value: assistant.name,
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
            text: this.plugin.t("assistantDelete"),
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
                this.plugin.settings.currentAssistantId =
                  this.plugin.settings.assistantPresets[0].id;
              }
              await this.plugin.saveSettings();
              renderAssistantPresets();
            }
          });
        }

        const promptLabel = assistantItem.createEl("label", {
          text: `${this.plugin.t("assistantSystemPrompt")}:`,
        });
        promptLabel.style.display = "block";
        promptLabel.style.fontSize = "12px";
        promptLabel.style.color = "var(--text-muted)";
        promptLabel.style.marginBottom = "4px";

        const promptTextarea = assistantItem.createEl("textarea", {
          value: assistant.systemPrompt,
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

        let saveTimeout: ReturnType<typeof setTimeout> | null = null;
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

    new Setting(containerEl).addButton((button) =>
      button
        .setButtonText(this.plugin.t("assistantAddNew"))
        .setCta()
        .onClick(async () => {
          const newAssistant: AssistantPreset = {
            id: `assistant_${Date.now()}_${Math.random()
              .toString(36)
              .substring(2, 11)}`,
            name: this.plugin.t("assistantDefaultName"),
            systemPrompt: this.plugin.t("assistantDefaultPrompt"),
          };
          this.plugin.settings.assistantPresets.push(newAssistant);
          await this.plugin.saveSettings();
          renderAssistantPresets();
        })
    );

    containerEl.createEl("h3", {
      text: this.plugin.t("aboutSectionName"),
      cls: "claude-code-about-header",
    });

    const aboutDiv = containerEl.createDiv("claude-code-about-section");

    aboutDiv
      .createEl("p", { cls: "claude-code-about-item" })
      .createEl("span", {
        text: `${this.plugin.t("aboutVersion")}: ${this.plugin.manifest.version}`,
      });

    aboutDiv
      .createEl("p", { cls: "claude-code-about-item" })
      .createEl("span", {
        text: `${this.plugin.t("aboutAuthor")}: ${this.plugin.manifest.author}`,
      });

    const emailDiv = aboutDiv.createEl("p", { cls: "claude-code-about-item" });
    emailDiv.createSpan({
      text: `${this.plugin.t("aboutEmail")}: `,
    });
    emailDiv.createEl("a", {
      text: "sloanenyra@gmail.com",
      href: "mailto:sloanenyra@gmail.com",
      cls: "claude-code-about-link",
    });

    aboutDiv
      .createEl("p", { cls: "claude-code-about-item" })
      .createEl("span", {
        text: `${this.plugin.t("aboutLicense")}: MIT`,
      });

    const repoDiv = aboutDiv.createEl("p", { cls: "claude-code-about-item" });
    repoDiv.createSpan({
      text: `${this.plugin.t("aboutRepository")}: `,
    });
    const githubLink = repoDiv.createEl("a", {
      text: "GitHub",
      href: "https://github.com/KeloYuan/NIki-AI",
      cls: "claude-code-about-link",
    });
    githubLink.setAttribute("target", "_blank");
    repoDiv.createSpan({ text: " / " });
    const gitcodeLink = repoDiv.createEl("a", {
      text: "GitCode",
      href: "https://gitcode.com/KeloYuan/NIki-AI",
      cls: "claude-code-about-link",
    });
    gitcodeLink.setAttribute("target", "_blank");

    aboutDiv
      .createEl("p", { cls: "claude-code-about-desc" })
      .createEl("span", {
        text: this.plugin.t("aboutDescriptionText"),
      });
  }
}
