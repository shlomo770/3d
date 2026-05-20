import * as THREE from "three";

const BASE_PITCH_ALIGN = -Math.PI / 2;

/** סיבוב yaw קבוע על המודל: finalYawDeg = trackHeadingDeg + MODEL_YAW_OFFSET_DEG */
export const MODEL_YAW_OFFSET_DEG = 180;
export const MODEL_YAW_OFFSET_RAD = Math.PI;

/**
 * סיבוב overlay למודל בלבד — לא משנה מפה, מסלול, או trackHeading.
 */
export function applyOverlayAircraftRotation(
  aircraft: THREE.Object3D,
  trackHeadingDeg: number,
  pitchDeg: number,
  rollDeg: number,
  attitudeGain: number,
  meshYawOffsetDeg: number,
  applyPitchRoll: boolean
): void {
  const pitch = applyPitchRoll ? THREE.MathUtils.degToRad(pitchDeg * attitudeGain) : 0;
  const roll = applyPitchRoll ? THREE.MathUtils.degToRad(rollDeg * attitudeGain) : 0;
  const finalYawDeg = trackHeadingDeg + meshYawOffsetDeg;

  aircraft.rotation.set(
    BASE_PITCH_ALIGN + pitch,
    THREE.MathUtils.degToRad(finalYawDeg),
    roll,
    "YXZ"
  );
}
