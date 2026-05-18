import maplibregl, { MercatorCoordinate } from "maplibre-gl";
import { destinationPoint } from "../math/trackHeading";

export type ChaseCameraConfig = {
  followDistanceM: number;
  followHeightM: number;
  lookAheadM: number;
  mapPitchDeg: number;
  easeDurationMs: number;
};

export type ChaseCameraPose = {
  lng: number;
  lat: number;
  altM: number;
  headingDeg: number;
};

/** מיקום מצלמה על הקרקע (נקודה מאחורי המטוס) */
export function chaseCameraGroundPosition(pose: ChaseCameraPose, cfg: ChaseCameraConfig) {
  return destinationPoint(pose.lat, pose.lng, pose.headingDeg + 180, cfg.followDistanceM);
}

/**
 * מצלמת מרדף — המפה לא מסתובבת סביב המטוס במרכז.
 * center = נקודה מאחורי המטוס; bearing = כיוון טיסה; pitch = שיפוע מצלמה.
 */
export function applyChaseMapCamera(
  map: maplibregl.Map,
  pose: ChaseCameraPose,
  cfg: ChaseCameraConfig
): { x: number; y: number } {
  const behind = chaseCameraGroundPosition(pose, cfg);

  map.jumpTo({
    center: [behind.lng, behind.lat],
    bearing: pose.headingDeg,
    pitch: cfg.mapPitchDeg,
  });

  return map.project([pose.lng, pose.lat]);
}

/** נקודת מבט קדימה (לחץ free-camera אם זמין) */
export function chaseLookAheadPosition(pose: ChaseCameraPose, cfg: ChaseCameraConfig) {
  return destinationPoint(pose.lat, pose.lng, pose.headingDeg, cfg.lookAheadM);
}

/** MapLibre 5 — מצלמה חופשית מאחור ומעל (אם נתמך) */
export function tryApplyFreeChaseCamera(
  map: maplibregl.Map,
  pose: ChaseCameraPose,
  cfg: ChaseCameraConfig
): boolean {
  const getFree = (map as maplibregl.Map & { getFreeCameraOptions?: () => unknown }).getFreeCameraOptions;
  if (typeof getFree !== "function") return false;

  const behind = chaseCameraGroundPosition(pose, cfg);
  const lookAt = chaseLookAheadPosition(pose, cfg);
  const cam = getFree.call(map) as {
    position: MercatorCoordinate;
    lookAtPoint: (p: MercatorCoordinate) => void;
  };

  cam.position = MercatorCoordinate.fromLngLat(
    { lng: behind.lng, lat: behind.lat },
    pose.altM + cfg.followHeightM
  );
  cam.lookAtPoint(
    MercatorCoordinate.fromLngLat({ lng: lookAt.lng, lat: lookAt.lat }, pose.altM)
  );

  const setFree = (map as maplibregl.Map & { setFreeCameraOptions?: (c: unknown) => void })
    .setFreeCameraOptions;
  if (typeof setFree === "function") {
    setFree.call(map, cam);
    return true;
  }
  return false;
}
