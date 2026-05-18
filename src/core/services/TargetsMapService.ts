import type maplibregl from "maplibre-gl";
import type { Target } from "../../domain/models";
import { platformConfig } from "../config/platformConfig";

export class TargetsMapService {
  private initialized = false;
  constructor(private map: maplibregl.Map) {}

  init() {
    if (this.initialized) return;
    if (!this.map.isStyleLoaded()) {
      this.map.once("load", () => this.init());
      return;
    }
    this.ensureIcon();
    const cfg = platformConfig.targets;

    if (!this.map.getSource(cfg.trailSourceId)) this.map.addSource(cfg.trailSourceId, { type: "geojson", data: fc([]) });
    if (!this.map.getLayer(cfg.trailLayerId)) {
      this.map.addLayer({
        id: cfg.trailLayerId,
        type: "line",
        source: cfg.trailSourceId,
        paint: { "line-color": "#38bdf8", "line-width": 3, "line-opacity": .86 }
      });
    }

    if (!this.map.getSource(cfg.sourceId)) this.map.addSource(cfg.sourceId, { type: "geojson", data: fc([]) });
    if (!this.map.getLayer(cfg.layerId)) {
      this.map.addLayer({
        id: cfg.layerId,
        type: "symbol",
        source: cfg.sourceId,
        layout: {
          "icon-image": ["get", "icon"],
          "icon-size": ["interpolate", ["linear"], ["zoom"], 8, .5, 13, .85, 16, 1.2],
          "icon-rotate": ["get", "heading"],
          "icon-rotation-alignment": "map",
          "icon-pitch-alignment": "map",
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "icon-anchor": "center"
        }
      });
    }
    this.initialized = true;
  }

  setTargets(targets: Target[]) {
    const cfg = platformConfig.targets;
    const source = this.map.getSource(cfg.sourceId) as maplibregl.GeoJSONSource | undefined;
    const trail = this.map.getSource(cfg.trailSourceId) as maplibregl.GeoJSONSource | undefined;
    source?.setData(fc(targets.map(t => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [t.position.lng, t.position.lat] },
      properties: { id: t.id, icon: cfg.iconId, heading: t.headingDeg }
    } as GeoJSON.Feature))));
    trail?.setData(fc(targets.filter(t => t.trail.length > 1).map(t => ({
      type: "Feature",
      geometry: { type: "LineString", coordinates: t.trail.map(p => [p.lng, p.lat]) },
      properties: { id: t.id }
    } as GeoJSON.Feature))));
  }

  private ensureIcon() {
    const id = platformConfig.targets.iconId;
    if (this.map.hasImage(id)) return;
    const size = 128;
    const c = document.createElement("canvas");
    c.width = size; c.height = size;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.translate(size/2, size/2);
    ctx.shadowColor = "rgba(0,0,0,.55)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = "#60a5fa";
    ctx.beginPath();
    ctx.moveTo(0, -56);
    ctx.lineTo(16, 14);
    ctx.lineTo(54, 30);
    ctx.lineTo(48, 42);
    ctx.lineTo(8, 28);
    ctx.lineTo(6, 52);
    ctx.lineTo(24, 66);
    ctx.lineTo(16, 75);
    ctx.lineTo(0, 61);
    ctx.lineTo(-16, 75);
    ctx.lineTo(-24, 66);
    ctx.lineTo(-6, 52);
    ctx.lineTo(-8, 28);
    ctx.lineTo(-48, 42);
    ctx.lineTo(-54, 30);
    ctx.lineTo(-16, 14);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#dbeafe";
    ctx.beginPath();
    ctx.ellipse(0, -20, 6, 28, 0, 0, Math.PI*2);
    ctx.fill();
    const data = ctx.getImageData(0, 0, size, size);
    this.map.addImage(id, { width: size, height: size, data: data.data }, { pixelRatio: 2 });
  }
}

function fc(features: GeoJSON.Feature[]): GeoJSON.FeatureCollection {
  return { type: "FeatureCollection", features };
}
