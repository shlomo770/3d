import type { BuiltinModelVariant, FlightChaseViewConfig, FlightModelSource } from "./types";

export const DEFAULT_FLIGHT_CHASE_CONFIG: FlightChaseViewConfig = {
  mapZoom: 14.2,
  mapPitch: 32,
  trailMaxPoints: 500,
  trailColor: "#f97316",
  trailWidth: 4,
  positionMarker: true,
  positionMarkerColor: "#3b82f6",
  attitudeGain: 1,
  /** finalYaw = trackHeading + meshYawOffset (רק מודל) */
  meshYawOffsetDeg: 180,
  showAlignmentDebug: true,
  debugArrowLengthM: 150,
  smooth: { position: 0.24, attitude: 0.28 },
  chaseCamera: {
    followDistanceM: 95,
    followHeightM: 120,
    lookAheadM: 90,
    mapPitchDeg: 62,
    easeDurationMs: 120,
  },
  applyModelPitchRoll: false,
  camera: { fov: 40, y: 2.5, z: 6.5 },
};

export const DEFAULT_BUILTIN_MODEL: FlightModelSource = {
  kind: "builtin",
  variant: "missile" satisfies BuiltinModelVariant,
};
