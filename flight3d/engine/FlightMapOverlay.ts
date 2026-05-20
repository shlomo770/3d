import type maplibregl from "maplibre-gl";
import {
  DEBUG_HEADING_LAYER_ID,
  DEBUG_HEADING_SOURCE_ID,
  DEBUG_POINT_LAYER_ID,
  DEBUG_POINT_SOURCE_ID,
  POSITION_LAYER_ID,
  POSITION_SOURCE_ID,
  TRAIL_LAYER_ID,
  TRAIL_MIN_DELTA_DEG,
  TRAIL_SOURCE_ID,
} from "../constants";
import { destinationPoint, headingFromTrailPoints } from "../math/trackHeading";
import type { FlightChaseViewConfig } from "../types";

type TrailPoint = { lat: number; lng: number };

export type TrackPose = {
  lng: number;
  lat: number;
  /** משיק המסלול הכתום (לא heading מטלמטריה) */
  trackHeadingDeg: number;
};

export class FlightMapOverlay {
  private readonly trailPoints: TrailPoint[] = [];

  constructor(
    private readonly map: maplibregl.Map,
    private readonly config: FlightChaseViewConfig,
    private readonly options: { showTrail: boolean; showPositionMarker: boolean }
  ) {}

  install(): void {
    if (!this.map.isStyleLoaded()) return;
    if (this.options.showTrail) this.ensureTrail();
    if (this.options.showPositionMarker) this.ensurePositionMarker();
    if (this.config.showAlignmentDebug) this.ensureDebugLayers();
  }

  seedTrailPoint(lat: number, lng: number): void {
    if (this.trailPoints.length === 0) {
      this.trailPoints.push({ lat, lng });
      if (this.options.showTrail) this.flushTrail();
    }
  }

  /**
   * מעדכן מסלול (ללא שינוי לוגיקת append) ומחזיר מיקום + trackHeading מהמשיק.
   */
  update(smoothed: { lat: number; lng: number }, telemetryHeadingDeg: number): TrackPose {
    this.maybeAppendTrail(smoothed.lat, smoothed.lng);

    const last = this.trailPoints.at(-1) ?? { lat: smoothed.lat, lng: smoothed.lng };
    const trackHeadingDeg = headingFromTrailPoints(this.trailPoints, telemetryHeadingDeg);

    if (this.options.showPositionMarker) {
      this.updatePositionMarker(last.lng, last.lat);
    }
    if (this.config.showAlignmentDebug) {
      this.updateDebugLayers(last.lng, last.lat, trackHeadingDeg);
    }

    return { lng: last.lng, lat: last.lat, trackHeadingDeg };
  }

  private ensureTrail(): void {
    if (this.map.getSource(TRAIL_SOURCE_ID)) return;
    this.map.addSource(TRAIL_SOURCE_ID, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: [] },
      },
    });
    this.map.addLayer({
      id: TRAIL_LAYER_ID,
      type: "line",
      source: TRAIL_SOURCE_ID,
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": this.config.trailColor,
        "line-width": this.config.trailWidth,
        "line-opacity": 0.95,
      },
    });
  }

  private ensurePositionMarker(): void {
    if (this.map.getSource(POSITION_SOURCE_ID)) return;
    this.map.addSource(POSITION_SOURCE_ID, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: { type: "Point", coordinates: [0, 0] },
      },
    });
    this.map.addLayer({
      id: POSITION_LAYER_ID,
      type: "circle",
      source: POSITION_SOURCE_ID,
      paint: {
        "circle-radius": 8,
        "circle-color": this.config.positionMarkerColor,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    });
  }

  private ensureDebugLayers(): void {
    if (!this.map.getSource(DEBUG_POINT_SOURCE_ID)) {
      this.map.addSource(DEBUG_POINT_SOURCE_ID, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "Point", coordinates: [0, 0] },
        },
      });
      this.map.addLayer({
        id: DEBUG_POINT_LAYER_ID,
        type: "circle",
        source: DEBUG_POINT_SOURCE_ID,
        paint: {
          "circle-radius": 5,
          "circle-color": "#ff00ff",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });
    }

    if (!this.map.getSource(DEBUG_HEADING_SOURCE_ID)) {
      this.map.addSource(DEBUG_HEADING_SOURCE_ID, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: [] },
        },
      });
      this.map.addLayer({
        id: DEBUG_HEADING_LAYER_ID,
        type: "line",
        source: DEBUG_HEADING_SOURCE_ID,
        layout: { "line-cap": "round" },
        paint: {
          "line-color": "#22d3ee",
          "line-width": 4,
          "line-opacity": 0.95,
        },
      });
    }
  }

  private updatePositionMarker(lng: number, lat: number): void {
    const src = this.map.getSource(POSITION_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
    if (!src) return;
    src.setData({
      type: "Feature",
      properties: {},
      geometry: { type: "Point", coordinates: [lng, lat] },
    });
  }

  private updateDebugLayers(lng: number, lat: number, trackHeadingDeg: number): void {
    const pointSrc = this.map.getSource(DEBUG_POINT_SOURCE_ID) as
      | maplibregl.GeoJSONSource
      | undefined;
    if (pointSrc) {
      pointSrc.setData({
        type: "Feature",
        properties: {},
        geometry: { type: "Point", coordinates: [lng, lat] },
      });
    }

    const tip = destinationPoint(lat, lng, trackHeadingDeg, this.config.debugArrowLengthM);
    const arrowSrc = this.map.getSource(DEBUG_HEADING_SOURCE_ID) as
      | maplibregl.GeoJSONSource
      | undefined;
    if (arrowSrc) {
      arrowSrc.setData({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [
            [lng, lat],
            [tip.lng, tip.lat],
          ],
        },
      });
    }
  }

  /** לוגיקת המסלול הכתום — ללא שינוי */
  private maybeAppendTrail(lat: number, lng: number): void {
    if (!this.options.showTrail) return;
    const last = this.trailPoints.at(-1);
    if (last && Math.hypot(last.lat - lat, last.lng - lng) <= TRAIL_MIN_DELTA_DEG) return;

    this.trailPoints.push({ lat, lng });
    if (this.trailPoints.length > this.config.trailMaxPoints) {
      this.trailPoints.shift();
    }
    this.flushTrail();
  }

  private flushTrail(): void {
    const src = this.map.getSource(TRAIL_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
    if (!src) return;
    src.setData({
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: this.trailPoints.map((p) => [p.lng, p.lat]),
      },
    });
  }
}
