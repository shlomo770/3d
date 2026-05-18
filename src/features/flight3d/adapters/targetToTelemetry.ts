import type { Target } from "../../../domain/models";
import type { FlightTelemetry } from "../types";

const FT_TO_M = 0.3048;

export function targetToTelemetry(target: Target): FlightTelemetry {
  return {
    id: target.id,
    lat: target.position.lat,
    lng: target.position.lng,
    altM: target.position.alt ?? target.altitudeFt * FT_TO_M,
    headingDeg: target.headingDeg,
    pitchDeg: target.pitchDeg,
    rollDeg: target.rollDeg,
    speed: target.speedKts,
  };
}
