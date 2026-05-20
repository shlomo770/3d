import React, { useMemo, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { DEFAULT_BUILTIN_MODEL } from "../config";
import { FALLBACK_TELEMETRY } from "../constants";
import { useFlightChaseEngine } from "../hooks/useFlightChaseEngine";
import type { FlightChaseViewProps } from "../types";
import { mergeChaseConfig } from "../utils/mergeChaseConfig";
import FlightHudOverlay from "./FlightHudOverlay";

const DEFAULT_WAITING = "ממתין לנתוני מטרה — העבירו telemetry";

/**
 * תצוגת מרדף 3D לשימוש חוזר.
 *
 * @example
 * ```tsx
 * import { FlightChaseView, registerFlightModel } from "@/components/flight3d";
 *
 * registerFlightModel("hawk", { kind: "gltf", url: "/models/hawk.glb", yawOffsetDeg: 90 });
 *
 * <FlightChaseView mapStyle={style} telemetry={t} model={{ kind: "registry", id: "hawk" }} />
 * ```
 */
const FlightChaseView: React.FC<FlightChaseViewProps> = ({
  telemetry,
  model = DEFAULT_BUILTIN_MODEL,
  mapStyle,
  config: configOverride,
  className = "relative h-full min-h-[400px] w-full overflow-hidden rounded-xl border border-slate-600/80 bg-slate-900",
  showHud = true,
  showTrail = true,
  waitingMessage = DEFAULT_WAITING,
  calibrationHint,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const telemetryRef = useRef(telemetry);
  telemetryRef.current = telemetry;

  const config = useMemo(() => mergeChaseConfig(configOverride), [configOverride]);

  useFlightChaseEngine(containerRef, telemetryRef, mapStyle, model, config, {
    showTrail,
    showPositionMarker: config.positionMarker,
  });

  return (
    <div ref={containerRef} className={className}>
      <div data-flight3d-map className="absolute inset-0 z-0" />
      <div data-flight3d-three className="pointer-events-none absolute inset-0 z-[1]" />
      {showHud && (
        <FlightHudOverlay
          telemetry={telemetry ?? FALLBACK_TELEMETRY}
          calibrationHint={calibrationHint}
        />
      )}
      {!telemetry && (
        <div className="absolute bottom-16 left-1/2 z-20 -translate-x-1/2 rounded-lg border border-amber-500/40 bg-black/70 px-4 py-2 text-xs text-amber-100">
          {waitingMessage}
        </div>
      )}
    </div>
  );
};

export default FlightChaseView;
