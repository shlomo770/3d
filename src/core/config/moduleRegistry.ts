export type ModuleSlot = "top" | "left-edge" | "left" | "center" | "right" | "floating";

export type PlatformModuleDefinition = {
  id: string;
  slot: ModuleSlot;
  enabled: boolean;
  detachable: boolean;
  title: string;
  description: string;
};

export const moduleRegistry: PlatformModuleDefinition[] = [
  { id: "statusBar", slot: "top", enabled: true, detachable: true, title: "Status Bar", description: "Top operational status bar." },
  { id: "sideNav", slot: "left-edge", enabled: true, detachable: true, title: "Side Navigation", description: "Config driven project navigation." },
  { id: "entities", slot: "left", enabled: true, detachable: true, title: "Entities Panel", description: "Entity search, visibility and actions." },
  { id: "layers", slot: "left", enabled: true, detachable: true, title: "Layers Panel", description: "Layer toggles." },
  { id: "mainMap2d", slot: "center", enabled: true, detachable: true, title: "Main 2D Map", description: "MapLibre 2D operational map." },
  { id: "flightSimulator3d", slot: "right", enabled: true, detachable: true, title: "3D Flight Simulator", description: "MapLibre + Three.js simulator window." },
  { id: "targetInfo", slot: "right", enabled: true, detachable: true, title: "Target Info", description: "Selected target information and telemetry." }
];

export function getEnabledModules(slot?: ModuleSlot) {
  return moduleRegistry.filter(m => m.enabled && (!slot || m.slot === slot));
}
