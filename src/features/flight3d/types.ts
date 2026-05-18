import type { StyleSpecification } from "maplibre-gl";
import type * as THREE from "three";

/** מצב טיסה אחיד — אותו מקור לקו מסלול ולמודל */
export type FlightTelemetry = {
  id: string;
  lat: number;
  lng: number;
  altM: number;
  headingDeg: number;
  pitchDeg: number;
  rollDeg: number;
  speed?: number;
  range?: number;
};

/** `missile` — טיל פשוט צבע אחיד (ברירת מחדל); `procedural` — מפורט יותר */
export type BuiltinModelVariant = "missile" | "simple" | "procedural";

export type FlightModelSource =
  | { kind: "builtin"; variant: BuiltinModelVariant }
  | { kind: "gltf"; url: string; scale?: number; yawOffsetDeg?: number }
  | { kind: "registry"; id: string }
  | { kind: "custom"; load: () => Promise<THREE.Group> };

export type FlightChaseViewConfig = {
  mapZoom: number;
  mapPitch: number;
  trailMaxPoints: number;
  trailColor: string;
  trailWidth: number;
  positionMarker: boolean;
  positionMarkerColor: string;
  attitudeGain: number;
  /** finalYaw = trackHeadingDeg + meshYawOffsetDeg (לא משפיע על הקו הכתום) */
  meshYawOffsetDeg: number;
  showAlignmentDebug: boolean;
  debugArrowLengthM: number;
  smooth: { position: number; attitude: number };
  /** מצלמת מרדף (נפרדת מסיבוב המודל) */
  chaseCamera: {
    followDistanceM: number;
    followHeightM: number;
    lookAheadM: number;
    mapPitchDeg: number;
    easeDurationMs: number;
  };
  /** שלב debug: כבה pitch/roll על המודל */
  applyModelPitchRoll: boolean;
  camera: { fov: number; y: number; z: number };
};

export type FlightChaseViewProps = {
  /** נתוני מטרה — null = מצב המתנה */
  telemetry: FlightTelemetry | null;
  /** מודל: builtin / GLB URL / מזהה מרשם / טעינה מותאמת */
  model?: FlightModelSource;
  /** סגנון מפת MapLibre (חובה בסביבה חדשה — העבירו builder משלכם) */
  mapStyle: StyleSpecification;
  config?: Partial<FlightChaseViewConfig>;
  className?: string;
  showHud?: boolean;
  showTrail?: boolean;
  waitingMessage?: string;
  /** טקסט כיול / רמז על גבי ה-HUD */
  calibrationHint?: string;
};
