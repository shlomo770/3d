export const designTokens = {
  themeName: "pro-dark-ops",
  colors: {
    background: "#030712",
    panel: "rgba(7, 16, 31, .95)",
    panelSoft: "rgba(12, 23, 41, .94)",
    border: "rgba(148, 163, 184, .20)",
    borderStrong: "rgba(56, 189, 248, .30)",
    text: "#e5edf8",
    muted: "#8fa3bb",
    primary: "#2f8cff",
    cyan: "#38bdf8",
    green: "#63ff8f",
    danger: "#fb7185",
    orange: "#fb923c",
    purple: "#a855f7",
    yellow: "#facc15"
  },
  layout: {
    topBarHeightPx: 50,
    sideNavWidthPx: 64,
    leftPanelWidthPx: 270,
    /** צר יותר — משאיר מקום למפת 2D במרכז */
    rightPanelWidthPx: 460
  },
  typography: {
    fontFamily: 'Arial, "Segoe UI", sans-serif',
    monoFamily: 'Consolas, "Courier New", monospace'
  },
  hud: {
    color: "#63ff8f",
    glow: "0 0 8px rgba(99,255,143,.85)",
    background: "rgba(2,6,23,.35)"
  }
} as const;
