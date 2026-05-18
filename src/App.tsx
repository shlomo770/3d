import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { StatusBar } from "./features/layout/StatusBar";
import { SideNav } from "./features/layout/SideNav";
import { LeftPanel } from "./features/panels/LeftPanel";
import { MainMap } from "./features/map/MainMap";
import { RightPanel } from "./features/panels/RightPanel";
import { TargetsSimulator } from "./features/targets/TargetsSimulator";
import { platformConfig } from "./core/config/platformConfig";
import { applyDesignTokensToDocument } from "./core/config/applyDesignTokens";
import "./shared/styles/global.css";

function AppInner() {
  useEffect(() => {
    applyDesignTokensToDocument();
  }, []);

  return (
    <div
      className="app"
      style={{
        "--top": `${platformConfig.layout.topBar.heightPx}px`,
        "--nav": platformConfig.layout.sideNav.visible ? `${platformConfig.layout.sideNav.widthPx}px` : "0px",
        "--left": platformConfig.layout.leftPanel.visible ? `${platformConfig.layout.leftPanel.widthPx}px` : "0px",
        "--right": platformConfig.layout.rightPanel.visible ? `${platformConfig.layout.rightPanel.widthPx}px` : "0px"
      } as React.CSSProperties}
    >
      <StatusBar />
      <main className="shell">
        <SideNav />
        {platformConfig.layout.leftPanel.visible ? <LeftPanel /> : <div />}
        <MainMap />
        {platformConfig.layout.rightPanel.visible ? <RightPanel /> : <div />}
      </main>
      <TargetsSimulator />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}
