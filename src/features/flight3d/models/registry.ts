import type { FlightModelSource } from "../types";

const registry = new Map<string, FlightModelSource>();

export function registerFlightModel(id: string, source: FlightModelSource): void {
  registry.set(id, source);
}

export function unregisterFlightModel(id: string): void {
  registry.delete(id);
}

export function getRegisteredFlightModel(id: string): FlightModelSource | undefined {
  return registry.get(id);
}

export function listRegisteredFlightModels(): string[] {
  return [...registry.keys()];
}

export function resolveFlightModelSource(source: FlightModelSource): FlightModelSource {
  if (source.kind !== "registry") return source;

  const registered = registry.get(source.id);
  if (!registered) {
    console.warn(`[FlightChaseView] model "${source.id}" not registered — using simple builtin`);
    return { kind: "builtin", variant: "missile" };
  }
  return registered;
}
