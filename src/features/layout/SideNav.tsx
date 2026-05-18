import { platformConfig } from "../../core/config/platformConfig";

export function SideNav() {
  if (!platformConfig.layout.sideNav.visible) return null;

  return (
    <nav className="side-nav">
      {platformConfig.navigation.items.filter(i => i.enabled).map(item => (
        <div className={`nav-item ${item.id === platformConfig.navigation.active ? "active" : ""}`} key={item.id}>
          <div className="nav-icon">{item.icon}</div>
          <div>{item.label}</div>
        </div>
      ))}
    </nav>
  );
}
