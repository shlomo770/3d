import { useEffect, useState } from "react";
import { useAppSelector } from "../../shared/hooks/useAppSelector";
import { platformConfig } from "../../core/config/platformConfig";

export function StatusBar() {
  const [time, setTime] = useState(new Date());
  const target = useAppSelector(s => s.targets.byId[s.targets.selectedId]);

  useEffect(() => {
    const t = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);

  if (!platformConfig.layout.topBar.visible) return null;

  return (
    <header className="topbar">
      <div className="logo">
        <div className="logo-badge">◇</div>
        {platformConfig.app.name}
        <span className="version">{platformConfig.app.version}</span>
      </div>
      <div className="top-spacer" />
      {platformConfig.statusBar.items.filter(i => i.enabled).map(item => {
        if (item.type === "clock") return <div key={item.id} className="top-pill">{item.label}: {time.toLocaleTimeString("en-GB")} UTC</div>;
        if (item.type === "selectedTarget") return <div key={item.id} className="top-pill">{item.label}: {target?.id ?? "-"}</div>;
        if (item.type === "status") return <div key={item.id} className="top-pill"><span className="status-dot" /> {item.label}</div>;
        return <div key={item.id} className="top-pill">{item.label}</div>;
      })}
    </header>
  );
}
