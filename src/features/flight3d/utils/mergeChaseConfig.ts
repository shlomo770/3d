import { DEFAULT_FLIGHT_CHASE_CONFIG } from "../config";
import type { FlightChaseViewConfig } from "../types";

export function mergeChaseConfig(
  override?: Partial<FlightChaseViewConfig>
): FlightChaseViewConfig {
  if (!override) return DEFAULT_FLIGHT_CHASE_CONFIG;
  return {
    ...DEFAULT_FLIGHT_CHASE_CONFIG,
    ...override,
    smooth: { ...DEFAULT_FLIGHT_CHASE_CONFIG.smooth, ...override.smooth },
    chaseCamera: { ...DEFAULT_FLIGHT_CHASE_CONFIG.chaseCamera, ...override.chaseCamera },
    camera: { ...DEFAULT_FLIGHT_CHASE_CONFIG.camera, ...override.camera },
  };
}
