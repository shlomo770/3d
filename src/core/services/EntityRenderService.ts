import type maplibregl from "maplibre-gl";
import type { Entity } from "../../domain/models";
import { circleToRing, closeRing, ellipseToRing, rectangleToRing } from "../utils/geoMath";

const SOURCE_ID = "entities-source";
const FILL = "entities-fill";
const LINE = "entities-line";
const POINT = "entities-point";

export class EntityRenderService {
  constructor(private map: maplibregl.Map) {}

  init() {
    if (!this.map.isStyleLoaded()) {
      this.map.once("load", () => this.init());
      return;
    }
    if (!this.map.getSource(SOURCE_ID)) this.map.addSource(SOURCE_ID, { type: "geojson", data: fc([]) });
    if (!this.map.getLayer(FILL)) {
      this.map.addLayer({
        id: FILL,
        type: "fill",
        source: SOURCE_ID,
        filter: ["==", ["geometry-type"], "Polygon"],
        paint: { "fill-color": ["get", "color"], "fill-opacity": ["get", "opacity"] }
      });
    }
    if (!this.map.getLayer(LINE)) {
      this.map.addLayer({
        id: LINE,
        type: "line",
        source: SOURCE_ID,
        paint: { "line-color": ["get", "color"], "line-width": 3, "line-opacity": .95 }
      });
    }
    if (!this.map.getLayer(POINT)) {
      this.map.addLayer({
        id: POINT,
        type: "circle",
        source: SOURCE_ID,
        filter: ["==", ["geometry-type"], "Point"],
        paint: {
          "circle-color": ["get", "color"],
          "circle-radius": 5,
          "circle-stroke-color": "#fff",
          "circle-stroke-width": 1.5
        }
      });
    }
  }

  setEntities(entities: Entity[], draft?: Entity | null) {
    const source = this.map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
    if (!source) return;
    const base = entities.filter((e) => e.visible && (!draft || e.id !== draft.id));
    source.setData(fc([...base.flatMap((e) => toFeatures(e, false)), ...(draft ? toFeatures(draft, true) : [])]));
  }
}

function toFeatures(e: Entity, draft: boolean): GeoJSON.Feature[] {
  const props = { id: e.id, type: e.type, color: e.color, opacity: draft ? Math.min(.6, e.opacity + .2) : e.opacity, draft };
  switch (e.type) {
    case "marker":
      return [{ type: "Feature", geometry: { type: "Point", coordinates: [e.position.lng, e.position.lat] }, properties: props } as GeoJSON.Feature];
    case "line":
      return [{ type: "Feature", geometry: { type: "LineString", coordinates: e.coordinates.map(p => [p.lng, p.lat]) }, properties: props } as GeoJSON.Feature];
    case "polygon":
      if (e.coordinates.length < 3) return [{ type: "Feature", geometry: { type: "LineString", coordinates: e.coordinates.map(p => [p.lng, p.lat]) }, properties: props } as GeoJSON.Feature];
      return [{ type: "Feature", geometry: { type: "Polygon", coordinates: [closeRing(e.coordinates)] }, properties: props } as GeoJSON.Feature];
    case "circle":
      return [{ type: "Feature", geometry: { type: "Polygon", coordinates: [closeRing(circleToRing(e.center, e.radiusM))] }, properties: props } as GeoJSON.Feature];
    case "ellipse":
      return [{ type: "Feature", geometry: { type: "Polygon", coordinates: [closeRing(ellipseToRing(e.center, e.radiusXM, e.radiusYM, e.rotationDeg))] }, properties: props } as GeoJSON.Feature];
    case "rectangle":
      return [{ type: "Feature", geometry: { type: "Polygon", coordinates: [closeRing(rectangleToRing(e.center, e.widthM, e.heightM))] }, properties: props } as GeoJSON.Feature];
  }
}

function fc(features: GeoJSON.Feature[]): GeoJSON.FeatureCollection {
  return { type: "FeatureCollection", features };
}
