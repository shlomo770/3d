export { default as FlightChaseView } from "./components/FlightChaseView";
export { targetToTelemetry } from "./adapters/targetToTelemetry";

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
