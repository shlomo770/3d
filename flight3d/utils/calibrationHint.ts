import { isFlight3dCalibrationMode } from "../../../config/appFlags";
import { CARDINAL_LABELS } from "./cardinalLabels";
import type { FlightTelemetry } from "../types";

export function buildCalibrationHint(telemetry: FlightTelemetry): string | undefined {
  if (!isFlight3dCalibrationMode) return undefined;

  if (telemetry.pitchDeg === 0 && telemetry.rollDeg === 0) {
    const h = Math.round(telemetry.headingDeg);
    const label = CARDINAL_LABELS[h] ?? "?";
    return `כיול: HDG ${h}° — אף ל${label}`;
  }

  if (telemetry.rollDeg === 0) {
    const sign = telemetry.pitchDeg > 0 ? "+" : "";
    return `כיול pitch ${sign}${telemetry.pitchDeg.toFixed(0)}°`;
  }

  const sign = telemetry.rollDeg > 0 ? "+" : "";
  return `כיול roll ${sign}${telemetry.rollDeg.toFixed(0)}°`;
}
