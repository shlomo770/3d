import React, { useMemo, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import "../flight-chase.css";
import { DEFAULT_BUILTIN_MODEL } from "../config";
import { useFlightChaseEngine } from "../hooks/useFlightChaseEngine";
import type { FlightChaseViewProps } from "../types";
import { mergeChaseConfig } from "../utils/mergeChaseConfig";

const DEFAULT_WAITING = "Select a target to view 3D chase";

const FlightChaseView: React.FC<FlightChaseViewProps> = ({
  telemetry,
  model = DEFAULT_BUILTIN_MODEL,
  mapStyle,
  config: configOverride,
  className = "flight-chase-root",
  showTrail = true,
  waitingMessage = DEFAULT_WAITING,
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
      <div data-flight3d-map className="flight-map" />
      <div data-flight3d-three className="flight-three" />
      {!telemetry && <div className="flight-chase-waiting">{waitingMessage}</div>}
    </div>
  );
};

export default FlightChaseView;
