import { designTokens } from "./designTokens";

export function applyDesignTokensToDocument(root: HTMLElement = document.documentElement) {
  root.style.setProperty("--bg", designTokens.colors.background);
  root.style.setProperty("--panel", designTokens.colors.panel);
  root.style.setProperty("--panel2", designTokens.colors.panelSoft);
  root.style.setProperty("--border", designTokens.colors.border);
  root.style.setProperty("--border2", designTokens.colors.borderStrong);
  root.style.setProperty("--text", designTokens.colors.text);
  root.style.setProperty("--muted", designTokens.colors.muted);
  root.style.setProperty("--blue", designTokens.colors.primary);
  root.style.setProperty("--cyan", designTokens.colors.cyan);
  root.style.setProperty("--green", designTokens.colors.green);
  root.style.setProperty("--danger", designTokens.colors.danger);
  root.style.setProperty("--orange", designTokens.colors.orange);
  root.style.setProperty("--purple", designTokens.colors.purple);
  root.style.setProperty("--yellow", designTokens.colors.yellow);
  root.style.setProperty("--top", `${designTokens.layout.topBarHeightPx}px`);
  root.style.setProperty("--nav", `${designTokens.layout.sideNavWidthPx}px`);
  root.style.setProperty("--left", `${designTokens.layout.leftPanelWidthPx}px`);
  root.style.setProperty("--right", `${designTokens.layout.rightPanelWidthPx}px`);
}
