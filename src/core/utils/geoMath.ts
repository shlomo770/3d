import type { LngLat } from "../../domain/models";

const R = 6371008.8;

export function normalizeHeading(deg: number): number {
  const v = Number.isFinite(deg) ? deg : 0;
  return ((v % 360) + 360) % 360;
}

export function clamp(v: number, min: number, max: number) {
  if (!Number.isFinite(v)) return 0;
  return Math.max(min, Math.min(max, v));
}

export function metersPerDegree(lat: number) {
  const rad = lat * Math.PI / 180;
  const mPerDegLat = 111132.92 - 559.82 * Math.cos(2 * rad) + 1.175 * Math.cos(4 * rad);
  const mPerDegLng = 111412.84 * Math.cos(rad) - 93.5 * Math.cos(3 * rad);
  return { mPerDegLat, mPerDegLng: Math.max(1, Math.abs(mPerDegLng)) };
}

export function distanceM(a: LngLat, b: LngLat): number {
  const p1 = a.lat * Math.PI / 180;
  const p2 = b.lat * Math.PI / 180;
  const dp = (b.lat - a.lat) * Math.PI / 180;
  const dl = (b.lng - a.lng) * Math.PI / 180;
  const s = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export function destination(start: LngLat, bearingDeg: number, distM: number): LngLat {
  const br = bearingDeg * Math.PI / 180;
  const lat1 = start.lat * Math.PI / 180;
  const lng1 = start.lng * Math.PI / 180;
  const d = distM / R;
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(br));
  const lng2 = lng1 + Math.atan2(Math.sin(br) * Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(lat2));
  return { lat: lat2 * 180 / Math.PI, lng: lng2 * 180 / Math.PI, alt: start.alt };
}

export function midpoint(a: LngLat, b: LngLat): LngLat {
  return { lng: (a.lng + b.lng) / 2, lat: (a.lat + b.lat) / 2 };
}

export function circleToRing(center: LngLat, radiusM: number, steps = 96): LngLat[] {
  return Array.from({ length: steps }, (_, i) => destination(center, i / steps * 360, radiusM));
}

export function ellipseToRing(center: LngLat, radiusXM: number, radiusYM: number, rotationDeg = 0, steps = 128): LngLat[] {
  const { mPerDegLat, mPerDegLng } = metersPerDegree(center.lat);
  const rot = rotationDeg * Math.PI / 180;
  return Array.from({ length: steps }, (_, i) => {
    const t = i / steps * Math.PI * 2;
    const x = Math.cos(t) * radiusXM;
    const y = Math.sin(t) * radiusYM;
    const xr = x * Math.cos(rot) - y * Math.sin(rot);
    const yr = x * Math.sin(rot) + y * Math.cos(rot);
    return { lng: center.lng + xr / mPerDegLng, lat: center.lat + yr / mPerDegLat };
  });
}

export function rectangleToRing(center: LngLat, widthM: number, heightM: number): LngLat[] {
  const { mPerDegLat, mPerDegLng } = metersPerDegree(center.lat);
  const dx = widthM / 2 / mPerDegLng;
  const dy = heightM / 2 / mPerDegLat;
  return [
    { lng: center.lng - dx, lat: center.lat - dy },
    { lng: center.lng + dx, lat: center.lat - dy },
    { lng: center.lng + dx, lat: center.lat + dy },
    { lng: center.lng - dx, lat: center.lat + dy }
  ];
}

export function closeRing(coords: LngLat[]): number[][] {
  if (!coords.length) return [];
  const arr = coords.map((p) => [p.lng, p.lat]);
  const first = arr[0];
  const last = arr[arr.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) arr.push([...first]);
  return arr;
}
