import maplibregl from "maplibre-gl";
import { platformConfig } from "../config/platformConfig";

export function createFlightMap(container: HTMLElement) {
  const cfg = platformConfig.flight3d;
  const map = new maplibregl.Map({
    container,
    style: cfg.style as any,
    center: cfg.center,
    zoom: cfg.zoom,
    pitch: cfg.pitch,
    bearing: cfg.bearing,
    attributionControl: false,
    maxPitch: 85
  });

  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "bottom-right");

  map.on("load", () => {
    try {
      map.setTerrain(cfg.terrain as any);
    } catch {
      // Terrain is optional. The simulator still works with imagery if DEM tiles are unavailable.
    }
  });

  return map;
}
