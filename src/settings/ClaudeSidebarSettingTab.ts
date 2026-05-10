import { App, PluginSettingTab, Setting } from "obsidian";
import type ClaudeSidebarPlugin from "../plugin";
import type { AssistantPreset, ClaudeEdition, Language } from "../types";
import { DEFAULT_CLAUDE_MODELS, THINKING_BUDGETS, DEFAULT_THINKING_BUDGET } from "../models";
import type { ClaudeModel, ThinkingBudget } from "../models";
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

    new Setting(containerEl).setName(this.plugin.t("settingTitle")).setHeading();

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
          this.plugin.settings.model = value as ClaudeModel;
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

    new Setting(containerEl).setName(this.plugin.t("assistantSectionName")).setHeading();

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

      for (const assistant of this.plugin.settings.assistantPresets) {
        const assistantItem = assistantList.createDiv("claude-assistant-item");

        const nameContainer = assistantItem.createDiv("claude-assistant-name-container");

        const nameInput = nameContainer.createEl("input", {
          type: "text",
          value: assistant.name,
          cls: "claude-assistant-name-input",
        });

        nameInput.addEventListener("input", () => {
          assistant.name = nameInput.value;
          void this.plugin.saveSettings();
        });

        if (this.plugin.settings.assistantPresets.length > 1) {
          const deleteBtn = nameContainer.createEl("button", {
            text: this.plugin.t("assistantDelete"),
            cls: "claude-assistant-delete-btn",
          });

          deleteBtn.addEventListener("click", () => {
            const index = this.plugin.settings.assistantPresets.findIndex(
              (a) => a.id === assistant.id
            );
            if (index > -1) {
              this.plugin.settings.assistantPresets.splice(index, 1);
              if (this.plugin.settings.currentAssistantId === assistant.id) {
                this.plugin.settings.currentAssistantId =
                  this.plugin.settings.assistantPresets[0].id;
              }
              void this.plugin.saveSettings();
              renderAssistantPresets();
            }
          });
        }

        const promptLabel = assistantItem.createEl("label", {
          text: `${this.plugin.t("assistantSystemPrompt")}:`,
          cls: "claude-assistant-prompt-label",
        });
        void promptLabel;

        const promptTextarea = assistantItem.createEl("textarea", {
          value: assistant.systemPrompt,
          cls: "claude-assistant-prompt-textarea",
        });

        let saveTimeout: ReturnType<typeof setTimeout> | null = null;
        promptTextarea.addEventListener("input", () => {
          assistant.systemPrompt = promptTextarea.value;

          if (saveTimeout) {
            clearTimeout(saveTimeout);
          }
          saveTimeout = setTimeout(async () => {
            await this.plugin.saveSettings();
            promptTextarea.addClass("claude-assistant-prompt-saved");
            setTimeout(() => {
              promptTextarea.removeClass("claude-assistant-prompt-saved");
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

    new Setting(containerEl).setName(this.plugin.t("aboutSectionName")).setHeading();

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
      // eslint-disable-next-line obsidianmd/ui/sentence-case -- email address
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
      text: "Gitcode",
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