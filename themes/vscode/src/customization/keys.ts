// Keep active-item indicators hidden and clear accent overrides written by older releases.
export const HIDDEN_ACTIVE_INDICATOR_KEYS = Object.freeze([
  "activityBar.activeBorder",
  "activityBar.activeFocusBorder",
  "panelTitle.activeBorder",
  "tab.activeBorder",
]) as readonly string[];

// Popup surfaces share the transparency treatment so menus/widgets stay visually aligned.
export const POPUP_BACKGROUND_KEYS = Object.freeze([
  "debugExceptionWidget.background",
  "dropdown.background",
  "dropdown.listBackground",
  "editorHoverWidget.background",
  "editorSuggestWidget.background",
  "editorWidget.background",
  "menu.background",
  "menu.separatorBackground",
  "quickInput.background",
]) as readonly string[];

// Hover status bar mirrors the main hover surface so the footer does not fall back to a different palette role.
export const HOVER_WIDGET_SYNC_KEYS = Object.freeze([
  "editorHoverWidget.statusBarBackground",
]) as readonly string[];

// Terminal background follows its host area (panel, sidebar, or editor) when the user opts in.
export const TERMINAL_MATCH_KEYS = Object.freeze(["terminal.background"]) as readonly string[];

// colorCustomizations value that discards the theme color and uses VS Code's built-in default (VS Code 1.91+).
export const DEFAULT_COLOR_VALUE = "default";

// Accent keys written by the removed zenkai.accentPreset setting; still pruned from older settings.
export const LEGACY_ACCENT_KEYS = Object.freeze([
  "activityBar.foreground",
  "activityBarBadge.background",
  "activityBarTop.foreground",
  "checkbox.foreground",
  "debugConsoleInputIcon.foreground",
  "debugIcon.breakpointCurrentStackframeForeground",
  "debugView.valueChangedHighlight",
  "editor.findMatchBackground",
  "editor.findMatchBorder",
  "editor.findMatchHighlightBackground",
  "editorLightBulb.foreground",
  "editorLightBulbAi.foreground",
  "gitDecoration.modifiedResourceForeground",
  "gitDecoration.stageModifiedResourceForeground",
  "list.activeSelectionBackground",
  "list.activeSelectionForeground",
  "list.inactiveSelectionBackground",
  "list.inactiveSelectionForeground",
  "menu.selectionForeground",
  "notificationLink.foreground",
  "panelTitle.activeForeground",
  "panelTitleBadge.background",
  "radio.activeForeground",
  "settings.checkboxForeground",
  "settings.headerForeground",
  "settings.modifiedItemIndicator",
  "tab.activeForeground",
  "testing.runAction",
  "textLink.foreground",
]) as readonly string[];

// Workbench keys that hold the bundled accent in every Zenkai theme (identical across variants).
// Opaque keys take the accent color directly.
export const ACCENT_COLOR_KEYS = Object.freeze([
  "activityBar.dropBorder",
  "activityBarTop.dropBorder",
  "agentSessionSelectedBadge.border",
  "agentStatusIndicator.background",
  "agentsGradient.tintColor",
  "chat.editedFileForeground",
  "chat.inputWorkingBorderColor1",
  "chat.slashCommandForeground",
  "commentsView.unresolvedIcon",
  "debugConsoleInputIcon.foreground",
  "debugIcon.breakpointCurrentStackframeForeground",
  "debugView.valueChangedHighlight",
  "editor.compositionBorder",
  "editor.findMatchBorder",
  "editor.snippetFinalTabstopHighlightBorder",
  "editorCommentsWidget.unresolvedBorder",
  "editorGutter.commentUnresolvedGlyphForeground",
  "editorLightBulb.foreground",
  "editorLightBulbAi.foreground",
  "editorOverviewRuler.commentUnresolvedForeground",
  "editorSuggestWidget.focusHighlightForeground",
  "extensionIcon.starForeground",
  "gauge.foreground",
  "inlineEdit.gutterIndicator.secondaryForeground",
  "list.activeSelectionForeground",
  "list.activeSelectionIconForeground",
  "list.dropBetweenBackground",
  "list.focusHighlightForeground",
  "list.inactiveSelectionForeground",
  "list.inactiveSelectionIconForeground",
  "mcpIcon.starForeground",
  "menu.selectionForeground",
  "panel.dropBorder",
  "panelTitle.activeForeground",
  "quickInputList.focusForeground",
  "quickInputList.focusIconForeground",
  "tab.activeForeground",
  "tab.dragAndDropBorder",
  "terminal.findMatchBorder",
  "terminal.tab.activeBorder",
  "terminalSymbolIcon.branchForeground",
  "terminalSymbolIcon.pullRequestForeground",
]) as readonly string[];

// Accent keys bundled with an alpha suffix; the suffix is preserved when the accent changes.
export const ACCENT_ALPHA_KEYS = Object.freeze([
  "chat.slashCommandBackground",
  "editorCommentsWidget.rangeActiveBackground",
  "editorCommentsWidget.rangeBackground",
  "minimap.chatEditHighlight",
]) as readonly string[];

// Neutral structural borders (separators, widget outlines, input outlines) scaled by zenkai.borderContrast.
// Accent, status, and transparent borders are left alone.
export const BORDER_CONTRAST_KEYS = Object.freeze([
  "agentSessionSelectedUnfocusedBadge.border",
  "agentsChatInput.border",
  "agentsNewSessionButton.border",
  "agentsPanel.border",
  "aiCustomizationManagement.sashBorder",
  "button.border",
  "button.secondaryBorder",
  "chat.requestBorder",
  "chat.requestCodeBorder",
  "chatManagement.sashBorder",
  "checkbox.border",
  "checkbox.selectBorder",
  "commandCenter.activeBorder",
  "commandCenter.border",
  "commandCenter.inactiveBorder",
  "debugExceptionWidget.border",
  "debugToolBar.border",
  "diffEditor.border",
  "dropdown.border",
  "editor.rangeHighlightBorder",
  "editorGroup.border",
  "editorGroup.dropIntoPromptBorder",
  "editorGroup.focusedEmptyBorder",
  "editorHoverWidget.border",
  "editorStickyScroll.border",
  "editorSuggestWidget.border",
  "editorWidget.border",
  "extensionButton.border",
  "gauge.border",
  "inlineChatInput.border",
  "inlineEdit.gutterIndicator.primaryBorder",
  "inlineEdit.gutterIndicator.secondaryBorder",
  "inlineEdit.gutterIndicator.successfulBorder",
  "input.border",
  "inputOption.activeBorder",
  "interactive.inactiveCodeBorder",
  "keybindingLabel.border",
  "keybindingLabel.bottomBorder",
  "menu.border",
  "multiDiffEditor.border",
  "notebook.cellBorderColor",
  "notebook.inactiveFocusedCellBorder",
  "notebook.inactiveSelectedCellBorder",
  "notebook.outputContainerBorderColor",
  "notebook.selectedCellBorder",
  "notificationCenter.border",
  "notificationToast.border",
  "notifications.border",
  "panel.border",
  "panelInput.border",
  "panelSection.border",
  "panelSectionHeader.border",
  "panelStickyScroll.border",
  "peekView.border",
  "profiles.sashBorder",
  "radio.activeBorder",
  "radio.inactiveBorder",
  "searchEditor.textInputBorder",
  "settings.checkboxBorder",
  "settings.dropdownBorder",
  "settings.focusedRowBorder",
  "settings.headerBorder",
  "settings.numberInputBorder",
  "settings.sashBorder",
  "settings.textInputBorder",
  "sideBar.border",
  "sideBarSectionHeader.border",
  "sideBarStickyScroll.border",
  "sideBySideEditor.horizontalBorder",
  "sideBySideEditor.verticalBorder",
  "statusBar.border",
  "statusBar.debuggingBorder",
  "statusBar.focusBorder",
  "statusBar.noFolderBorder",
  "tab.activeModifiedBorder",
  "tab.inactiveModifiedBorder",
  "tab.lastPinnedBorder",
  "tab.selectedBorderTop",
  "tab.unfocusedActiveModifiedBorder",
  "tab.unfocusedInactiveModifiedBorder",
  "terminal.border",
  "terminalOverviewRuler.border",
  "terminalStickyScroll.border",
  "testing.messagePeekBorder",
  "testing.peekBorder",
  "textBlockQuote.border",
  "titleBar.border",
  "tree.tableColumnsBorder",
  "welcomePage.tileBorder",
  "widget.border",
]) as readonly string[];

// Keys the extension no longer writes but must still prune from settings left by older releases.
// (1.0.x briefly pinned panel.background to recolor the terminal tabs container.)
export const LEGACY_MANAGED_KEYS = Object.freeze(["panel.background"]) as readonly string[];

// All keys managed by this extension. Existing values for these keys are cleared before reapplying.
export const MANAGED_COLOR_KEYS = Object.freeze(
  Array.from(
    new Set([
      ...HIDDEN_ACTIVE_INDICATOR_KEYS,
      ...POPUP_BACKGROUND_KEYS,
      ...HOVER_WIDGET_SYNC_KEYS,
      ...TERMINAL_MATCH_KEYS,
      ...ACCENT_COLOR_KEYS,
      ...ACCENT_ALPHA_KEYS,
      ...BORDER_CONTRAST_KEYS,
      ...LEGACY_ACCENT_KEYS,
      ...LEGACY_MANAGED_KEYS,
    ])
  )
) as readonly string[];
