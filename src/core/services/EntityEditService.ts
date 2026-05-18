import maplibregl from "maplibre-gl";
import type { Entity, LngLat } from "../../domain/models";
import { distanceM, metersPerDegree, midpoint } from "../utils/geoMath";
import { MapInteractionLock } from "./MapInteractionLock";

type HandleKind = "vertex" | "midpoint" | "center" | "radius" | "axisX" | "axisY" | "corner";
type Handle = { kind: HandleKind; index?: number; afterIndex?: number; cornerIndex?: number; position: LngLat };

type Callbacks = {
  onDraftChanged: (draft: Entity | null) => void;
  onFinish: (entity: Entity) => void;
  onCancel: () => void;
};

export class EntityEditService {
  private draft: Entity | null = null;
  private callbacks: Callbacks | null = null;
  private markers: maplibregl.Marker[] = [];
  private lock: MapInteractionLock;

  constructor(private map: maplibregl.Map) {
    this.lock = new MapInteractionLock(map);
  }

  start(entity: Entity, callbacks: Callbacks) {
    this.cancel(false);
    this.draft = structuredClone(entity);
    this.callbacks = callbacks;
    callbacks.onDraftChanged(structuredClone(this.draft));
    this.render();
  }

  finish() {
    if (!this.draft || !this.callbacks) return;
    const entity = structuredClone(this.draft);
    this.clear();
    this.callbacks.onDraftChanged(null);
    this.callbacks.onFinish(entity);
    this.draft = null;
    this.callbacks = null;
    this.lock.unlock();
  }

  cancel(emit = true) {
    this.clear();
    this.lock.unlock();
    if (emit && this.callbacks) {
      this.callbacks.onDraftChanged(null);
      this.callbacks.onCancel();
    }
    this.draft = null;
    this.callbacks = null;
  }

  private render() {
    this.clear();
    if (!this.draft || !this.draft.visible) return;

    for (const handle of this.handles(this.draft)) {
      const el = document.createElement("div");
      el.className = `handle ${handle.kind === "midpoint" ? "mid" : ""} ${handle.kind}`;
      const marker = new maplibregl.Marker({ element: el, draggable: true, anchor: "center" })
        .setLngLat([handle.position.lng, handle.position.lat])
        .addTo(this.map);

      let active = handle;

      marker.on("dragstart", () => {
        this.lock.lock();
        if (active.kind === "midpoint" && this.draft && (this.draft.type === "line" || this.draft.type === "polygon")) {
          const insertAt = (active.afterIndex ?? 0) + 1;
          const ll = marker.getLngLat();
          this.draft.coordinates.splice(insertAt, 0, { lng: ll.lng, lat: ll.lat });
          active = { kind: "vertex", index: insertAt, position: { lng: ll.lng, lat: ll.lat } };
          this.emit();
        }
      });

      marker.on("drag", () => {
        const ll = marker.getLngLat();
        this.apply(active, { lng: ll.lng, lat: ll.lat });
        this.emit();
      });

      marker.on("dragend", () => {
        const ll = marker.getLngLat();
        this.apply(active, { lng: ll.lng, lat: ll.lat });
        this.emit();
        this.lock.unlock();
        this.render();
      });

      this.markers.push(marker);
    }
  }

  private apply(h: Handle, p: LngLat) {
    if (!this.draft) return;
    switch (this.draft.type) {
      case "marker":
        if (h.kind === "center") this.draft.position = p;
        return;
      case "line":
      case "polygon":
        if (h.kind === "vertex" && h.index != null) this.draft.coordinates[h.index] = p;
        return;
      case "circle":
        if (h.kind === "center") this.draft.center = p;
        if (h.kind === "radius") this.draft.radiusM = Math.max(10, distanceM(this.draft.center, p));
        return;
      case "ellipse":
        if (h.kind === "center") this.draft.center = p;
        if (h.kind === "axisX") this.draft.radiusXM = Math.max(10, distanceM(this.draft.center, p));
        if (h.kind === "axisY") this.draft.radiusYM = Math.max(10, distanceM(this.draft.center, p));
        return;
      case "rectangle":
        if (h.kind === "center") this.draft.center = p;
        if (h.kind === "corner") {
          const { mPerDegLat, mPerDegLng } = metersPerDegree(this.draft.center.lat);
          this.draft.widthM = Math.max(20, Math.abs(p.lng - this.draft.center.lng) * mPerDegLng * 2);
          this.draft.heightM = Math.max(20, Math.abs(p.lat - this.draft.center.lat) * mPerDegLat * 2);
        }
        return;
    }
  }

  private handles(e: Entity): Handle[] {
    switch (e.type) {
      case "marker":
        return [{ kind: "center", position: e.position }];
      case "line":
        return [
          ...e.coordinates.map((position, index) => ({ kind: "vertex" as const, index, position })),
          ...e.coordinates.slice(0, -1).map((p, i) => ({ kind: "midpoint" as const, afterIndex: i, position: midpoint(p, e.coordinates[i+1]) }))
        ];
      case "polygon":
        return [
          ...e.coordinates.map((position, index) => ({ kind: "vertex" as const, index, position })),
          ...e.coordinates.map((p, i) => ({ kind: "midpoint" as const, afterIndex: i, position: midpoint(p, e.coordinates[(i+1)%e.coordinates.length]) }))
        ];
      case "circle":
        return [{ kind: "center", position: e.center }, { kind: "radius", position: offset(e.center, e.radiusM, "x") }];
      case "ellipse":
        return [{ kind: "center", position: e.center }, { kind: "axisX", position: offset(e.center, e.radiusXM, "x") }, { kind: "axisY", position: offset(e.center, e.radiusYM, "y") }];
      case "rectangle": {
        const { mPerDegLat, mPerDegLng } = metersPerDegree(e.center.lat);
        const dx = e.widthM / 2 / mPerDegLng;
        const dy = e.heightM / 2 / mPerDegLat;
        return [
          { kind: "center", position: e.center },
          { kind: "corner", cornerIndex: 0, position: { lng: e.center.lng - dx, lat: e.center.lat - dy } },
          { kind: "corner", cornerIndex: 1, position: { lng: e.center.lng + dx, lat: e.center.lat - dy } },
          { kind: "corner", cornerIndex: 2, position: { lng: e.center.lng + dx, lat: e.center.lat + dy } },
          { kind: "corner", cornerIndex: 3, position: { lng: e.center.lng - dx, lat: e.center.lat + dy } }
        ];
      }
    }
  }

  private emit() {
    if (this.draft && this.callbacks) this.callbacks.onDraftChanged(structuredClone(this.draft));
  }

  private clear() {
    this.markers.forEach(m => m.remove());
    this.markers = [];
  }
}

function offset(center: LngLat, meters: number, axis: "x" | "y"): LngLat {
  const { mPerDegLat, mPerDegLng } = metersPerDegree(center.lat);
  return axis === "x" ? { lng: center.lng + meters / mPerDegLng, lat: center.lat } : { lng: center.lng, lat: center.lat + meters / mPerDegLat };
}
