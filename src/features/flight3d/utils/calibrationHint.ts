import type { FlightTelemetry } from "../types";

/** Pro GIS — no calibration mode by default */
export function buildCalibrationHint(_telemetry: FlightTelemetry): string | undefined {
  return undefined;
}
