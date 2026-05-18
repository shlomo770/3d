import type maplibregl from "maplibre-gl";

export class MapInteractionLock {
  private locked = false;
  constructor(private map: maplibregl.Map) {}

  lock() {
    if (this.locked) return;
    this.locked = true;
    this.map.dragPan.disable();
    this.map.scrollZoom.disable();
    this.map.doubleClickZoom.disable();
    this.map.touchZoomRotate.disable();
    this.map.boxZoom.disable();
  }

  unlock() {
    if (!this.locked) return;
    this.locked = false;
    this.map.dragPan.enable();
    this.map.scrollZoom.enable();
    this.map.doubleClickZoom.enable();
    this.map.touchZoomRotate.enable();
    this.map.boxZoom.enable();
  }
}
