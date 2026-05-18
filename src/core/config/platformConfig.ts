import { designTokens } from "./designTokens";

export const platformConfig = {
  app: { name: "PRO GIS PLATFORM", version: "v12.0.0", mode: "MISSION" },
  design: designTokens,

  layout: {
    topBar: { visible: true, heightPx: designTokens.layout.topBarHeightPx },
    sideNav: { visible: true, widthPx: designTokens.layout.sideNavWidthPx },
    leftPanel: { visible: true, widthPx: designTokens.layout.leftPanelWidthPx, modules: ["entities", "layers"] },
    rightPanel: { visible: true, widthPx: designTokens.layout.rightPanelWidthPx, modules: ["flightSimulator", "targetInfo", "telemetryHistory"] }
  },

  statusBar: {
    items: [
      { id: "system", label: "SYSTEM ONLINE", type: "status", enabled: true },
      { id: "gps", label: "GPS: 3D FIX", type: "status", enabled: true },
      { id: "mode", label: "MODE: MISSION", type: "text", enabled: true },
      { id: "clock", label: "TIME", type: "clock", enabled: true },
      { id: "target", label: "TARGET", type: "selectedTarget", enabled: true },
      { id: "notifications", label: "🔔", type: "icon", enabled: true },
      { id: "settings", label: "⚙", type: "icon", enabled: true },
      { id: "user", label: "Admin⌄", type: "text", enabled: true }
    ]
  },

  navigation: {
    active: "map",
    items: [
      { id: "map", label: "Map", icon: "🗺", enabled: true },
      { id: "entities", label: "Entities", icon: "⇄", enabled: true },
      { id: "missions", label: "Missions", icon: "▣", enabled: true },
      { id: "targets", label: "Targets", icon: "◎", enabled: true },
      { id: "reports", label: "Reports", icon: "▤", enabled: true },
      { id: "settings", label: "Settings", icon: "⚙", enabled: true },
      { id: "tools", label: "Tools", icon: "⌘", enabled: true }
    ]
  },

  entityPanel: {
    title: "ENTITIES",
    subtitle: "Targets, entities, layers",
    searchEnabled: true,
    tabs: [
      { id: "all", label: "ALL", enabled: true },
      { id: "visible", label: "VISIBLE", enabled: true },
      { id: "hidden", label: "HIDDEN", enabled: true }
    ],
    actions: { newEntity: true, select: true, hide: true, delete: true }
  },

  layersPanel: {
    title: "LAYERS",
    items: [
      { id: "base", label: "Base Map", enabled: true, visible: true },
      { id: "satellite", label: "Satellite Imagery", enabled: true, visible: true },
      { id: "roads", label: "Roads", enabled: true, visible: true },
      { id: "terrain", label: "Terrain", enabled: true, visible: true },
      { id: "buildings", label: "Buildings", enabled: true, visible: true },
      { id: "targets", label: "Targets", enabled: true, visible: true },
      { id: "trails", label: "Trails", enabled: true, visible: true },
      { id: "entities", label: "Entities", enabled: true, visible: true }
    ]
  },

  mapTools: {
    tools: [
      { id: "select", label: "Select", icon: "↖", enabled: true },
      { id: "marker", label: "Marker", icon: "⌖", enabled: true },
      { id: "line", label: "Line", icon: "╱", enabled: true },
      { id: "polygon", label: "Polygon", icon: "⬡", enabled: true },
      { id: "circle", label: "Circle", icon: "○", enabled: true },
      { id: "ellipse", label: "Ellipse", icon: "◌", enabled: true },
      { id: "rectangle", label: "Rectangle", icon: "▭", enabled: true }
    ]
  },

  map2d: {
    center: [34.7818, 32.0853] as [number, number],
    zoom: 13.35,
    style: {
      version: 8 as const,
      sources: {
        satellite: {
          type: "raster" as const,
          tiles: ["https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
          tileSize: 256,
          attribution: "Tiles © Esri"
        }
      },
      layers: [{ id: "satellite", type: "raster" as const, source: "satellite" }]
    }
  },

  flight3d: {
    enabled: true,
    provider: "maplibre-three-overlay",
    title: "3D FLIGHT SIMULATOR",
    center: [34.7818, 32.0853] as [number, number],
    zoom: 13.8,
    pitch: 76,
    bearing: 310,
    chase: { enabled: true, updateDurationMs: 160 },
    hud: { enabled: true, color: designTokens.hud.color },
    style: {
      version: 8 as const,
      sources: {
        satellite: {
          type: "raster" as const,
          tiles: ["https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
          tileSize: 256,
          attribution: "Tiles © Esri"
        },
        terrain: {
          type: "raster-dem" as const,
          tiles: ["https://demotiles.maplibre.org/terrain-tiles/{z}/{x}/{y}.png"],
          tileSize: 256,
          encoding: "terrarium" as const
        }
      },
      layers: [{ id: "satellite", type: "raster" as const, source: "satellite" }],
      sky: {
        "sky-color": "#8fd3ff",
        "sky-horizon-blend": 0.35,
        "horizon-color": "#d8f1ff",
        "horizon-fog-blend": 0.45,
        "fog-color": "#eef7ff",
        "fog-ground-blend": 0.45
      } as any
    },
    terrain: { enabled: true, source: "terrain", exaggeration: 1.45 },
    /** סיבוב מודל בלבד: finalYaw = headingDeg + meshYawOffsetDeg */
    meshYawOffsetDeg: 180
  },

  targets: {
    sourceId: "targets-source",
    layerId: "targets-layer",
    trailSourceId: "targets-trail-source",
    trailLayerId: "targets-trail-layer",
    iconId: "aircraft-top-view"
  },

  targetInfoTabs: [
    { id: "info", label: "TARGET INFO", enabled: true },
    { id: "telemetry", label: "TELEMETRY", enabled: true },
    { id: "systems", label: "SYSTEMS", enabled: true },
    { id: "weapon", label: "WEAPON STATUS", enabled: true },
    { id: "notes", label: "NOTES", enabled: true }
  ]
} as const;
