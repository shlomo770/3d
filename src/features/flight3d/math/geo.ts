const METERS_PER_DEG_LAT = 111_320;

export function metersPerDegreeLng(lat: number): number {
  return METERS_PER_DEG_LAT * Math.cos((lat * Math.PI) / 180);
}
