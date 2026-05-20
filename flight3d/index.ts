export { default as FlightChaseView } from "./components/FlightChaseView";
export { default as Missile3DViewer } from "./components/Missile3DViewer";
/** @deprecated Use Missile3DViewer or FlightChaseView */
export { default as Flight3DView } from "./components/Missile3DViewer";

export {
  registerFlightModel,
  unregisterFlightModel,
  getRegisteredFlightModel,
  listRegisteredFlightModels,
} from "./models/registry";

export { loadAircraftModel } from "./models/loadAircraftModel";
export { DEFAULT_FLIGHT_CHASE_CONFIG, DEFAULT_BUILTIN_MODEL } from "./config";
export { mergeChaseConfig } from "./utils/mergeChaseConfig";

export type {
  FlightTelemetry,
  FlightModelSource,
  FlightChaseViewConfig,
  FlightChaseViewProps,
  BuiltinModelVariant,
} from "./types";

export type { Missile3DViewerProps } from "./components/Missile3DViewer";
