import * as THREE from "three";

/** מפה track-up — המצלמה מסתובב עם כיוון הטיסה */
export function mapBearingFromHeading(headingDeg: number): number {
  return -headingDeg;
}

export function lerpAngleDeg(current: number, target: number, t: number): number {
  const delta = THREE.MathUtils.euclideanModulo(target - current + 180, 360) - 180;
  return current + delta * t;
}
