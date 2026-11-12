import type { ThemeVariantSource } from "../types";

// Clay follows Claude's dark interface and docs: pure neutral near-black grays,
// warm off-white text, and a muted blue accent. Other syntax colors match Graphite.
export const clayVariant: ThemeVariantSource = {
  id: "clay",
  name: "Zenkai Clay",
  palette: {
    chromeBg: "#191919",
    overlayBg: "#1b1b1b",
    commandCenterBg: "#1c1c1c",
    sidebarBg: "#1d1d1d",
    raisedBg: "#1f1f1f",
    editorBg: "#202020",
    activityBarBorder: "#272727",
    border: "#2e2e2e",
    indentGuideInactive: "#323232",
    surfaceBg: "#2c2c2c",
    chromeBorder: "#343434",
    panelBorder: "#383838",
    interactionBg: "#454545",
    indentGuideActive: "#525252",
    info: "#5ad4e6",
    fgSubtle: "#6d6b67",
    fgStatus: "#7b7974",
    success: "#7bd88f",
    fgMuted: "#898781",
    fgSidebar: "#a5a49a",
    purple: "#948ae3",
    fgSecondary: "#c3c2b7",
    accent: "#6a9bcc",
    fg: "#f0efec",
    error: "#fc618d",
    warning: "#fd9353",
    pureRed: "#ff0000",
    brightFg: "#f9f9f7",
  },
};

export default clayVariant;
