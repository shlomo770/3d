import type { FlightTelemetry } from "./types";

export const FLIGHT3D_MAP_SELECTOR = "[data-flight3d-map]";
export const FLIGHT3D_THREE_SELECTOR = "[data-flight3d-three]";

export const TRAIL_SOURCE_ID = "flight3d-trail";
export const TRAIL_LAYER_ID = "flight3d-trail-line";
export const POSITION_SOURCE_ID = "flight3d-position";
export const POSITION_LAYER_ID = "flight3d-position";

export const DEBUG_POINT_SOURCE_ID = "flight3d-debug-point";
export const DEBUG_POINT_LAYER_ID = "flight3d-debug-point";
export const DEBUG_HEADING_SOURCE_ID = "flight3d-debug-heading";
export const DEBUG_HEADING_LAYER_ID = "flight3d-debug-heading-line";

export const MIN_VIEW_WIDTH = 320;
export const MIN_VIEW_HEIGHT = 280;
export const TRAIL_MIN_DELTA_DEG = 0.00003;

export const FALLBACK_TELEMETRY: FlightTelemetry = {
  id: "—",
  lat: 31.92,
  lng: 34.82,
  altM: 1500,
  headingDeg: 0,
  pitchDeg: 0,
  rollDeg: 0,
};
