const DEG = Math.PI / 180;
const M_PER_DEG_LAT = 111_320;

/** כיוון גיאוגרפי 0°=צפון, 90°=מזרח בין שתי נקודות */
export function geographicBearingDeg(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): number {
  const φ1 = from.lat * DEG;
  const φ2 = to.lat * DEG;
  const Δλ = (to.lng - from.lng) * DEG;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (Math.atan2(y, x) / DEG + 360) % 360;
}

/** משיק המסלול: נקודה קודמת → נוכחית (אותן נקודות כמו הקו הכתום) */
export function headingFromTrailPoints(
  points: readonly { lat: number; lng: number }[],
  fallbackHeadingDeg: number
): number {
  if (points.length >= 2) {
    const prev = points[points.length - 2]!;
    const curr = points[points.length - 1]!;
    return geographicBearingDeg(prev, curr);
  }
  return fallbackHeadingDeg;
}

/** נקודת יעד לפי bearing ומרחק במטרים (לחץ כיוון debug על המפה) */
export function destinationPoint(
  lat: number,
  lng: number,
  bearingDeg: number,
  distanceM: number
): { lat: number; lng: number } {
  const R = 6371000;
  const δ = distanceM / R;
  const θ = bearingDeg * DEG;
  const φ1 = lat * DEG;
  const λ1 = lng * DEG;
  const φ2 = Math.asin(Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ));
  const λ2 =
    λ1 +
    Math.atan2(
      Math.sin(θ) * Math.sin(δ) * Math.cos(φ1),
      Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2)
    );
  return { lat: φ2 / DEG, lng: λ2 / DEG };
}

export function metersPerDegreeLng(lat: number): number {
  return M_PER_DEG_LAT * Math.cos(lat * DEG);
}
