export type LngLat = { lng: number; lat: number; alt?: number };
export type EntityType = "marker" | "line" | "polygon" | "circle" | "ellipse" | "rectangle";

export type EntityBase = {
  id: string;
  name: string;
  type: EntityType;
  color: string;
  opacity: number;
  visible: boolean;
};

export type Entity =
  | (EntityBase & { type: "marker"; position: LngLat })
  | (EntityBase & { type: "line"; coordinates: LngLat[] })
  | (EntityBase & { type: "polygon"; coordinates: LngLat[] })
  | (EntityBase & { type: "circle"; center: LngLat; radiusM: number })
  | (EntityBase & { type: "ellipse"; center: LngLat; radiusXM: number; radiusYM: number; rotationDeg: number })
  | (EntityBase & { type: "rectangle"; center: LngLat; widthM: number; heightM: number; rotationDeg: number });

export type Target = {
  id: string;
  callsign: string;
  type: "Aircraft" | "Drone" | "Vehicle";
  group: string;
  status: "LIVE" | "STALE" | "LOST";
  position: LngLat;
  headingDeg: number;
  pitchDeg: number;
  rollDeg: number;
  speedKts: number;
  altitudeFt: number;
  climbRateFpm: number;
  groundSpeedKts: number;
  verticalSpeedFpm: number;
  lastUpdate: number;
  trail: Array<LngLat & { t: number }>;
};
