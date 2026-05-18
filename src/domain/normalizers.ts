import type { Target } from "./models";
import { clamp, normalizeHeading } from "../core/utils/geoMath";

export type ServerMessage = { name: string; data: any };

export function normalizeTargetMessage(message: ServerMessage, previous?: Target): Target | null {
  if (message.name !== "TARGET_POSITION") return null;
  const d = message.data ?? {};
  const id = String(d.id ?? d.targetId ?? "").trim();
  const lat = Number(d.lat ?? d.latitude ?? d.position?.lat);
  const lng = Number(d.lng ?? d.longitude ?? d.position?.lng);
  if (!id || !Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const now = Date.now();
  const position = { lng, lat, alt: Number(d.alt ?? d.altitude ?? d.position?.alt ?? previous?.position.alt ?? 0) };
  const trail = [...(previous?.trail ?? []), { ...position, t: now }].filter((p) => now - p.t < 45000);

  return {
    id,
    callsign: String(d.callsign ?? previous?.callsign ?? id),
    type: d.type ?? previous?.type ?? "Aircraft",
    group: String(d.group ?? previous?.group ?? "Alpha"),
    status: "LIVE",
    position,
    headingDeg: normalizeHeading(Number(d.heading ?? d.headingDeg ?? previous?.headingDeg ?? 0)),
    pitchDeg: clamp(Number(d.pitch ?? d.pitchDeg ?? previous?.pitchDeg ?? 0), -60, 60),
    rollDeg: clamp(Number(d.roll ?? d.rollDeg ?? previous?.rollDeg ?? 0), -80, 80),
    speedKts: Number(d.speed ?? d.speedKts ?? previous?.speedKts ?? 0),
    altitudeFt: Number(d.altitudeFt ?? d.altitude ?? previous?.altitudeFt ?? 0),
    climbRateFpm: Number(d.climbRateFpm ?? previous?.climbRateFpm ?? 1120),
    groundSpeedKts: Number(d.groundSpeedKts ?? previous?.groundSpeedKts ?? 475),
    verticalSpeedFpm: Number(d.verticalSpeedFpm ?? previous?.verticalSpeedFpm ?? 1120),
    lastUpdate: now,
    trail
  };
}
