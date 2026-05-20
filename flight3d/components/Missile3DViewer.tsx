import React, { useMemo } from "react";
import type { StyleSpecification } from "maplibre-gl";
import { buildPublicRasterMapStyle } from "../../../config/publicMapTiles";
import type { FlightModelSource, FlightTelemetry } from "../types";
import { buildCalibrationHint } from "../utils/calibrationHint";
import FlightChaseView from "./FlightChaseView";

export type Missile3DViewerProps = {
  telemetry: FlightTelemetry | null;
  modelUrl?: string;
  modelRegistryId?: string;
};

/** עטיפת MAP — מפת לוויין מובנית + FlightChaseView */
const Missile3DViewer: React.FC<Missile3DViewerProps> = ({
  telemetry,
  modelUrl,
  modelRegistryId,
}) => {
  const mapStyle = useMemo(
    () => buildPublicRasterMapStyle("satellite-raster") as StyleSpecification,
    []
  );

  const model = useMemo((): FlightModelSource | undefined => {
    if (modelRegistryId) return { kind: "registry", id: modelRegistryId };
    if (modelUrl) return { kind: "gltf", url: modelUrl };
    return undefined;
  }, [modelRegistryId, modelUrl]);

  return (
    <FlightChaseView
      telemetry={telemetry}
      mapStyle={mapStyle}
      model={model}
      calibrationHint={telemetry ? buildCalibrationHint(telemetry) : undefined}
      waitingMessage="ממתין לנתוני מטרה — בחרו מטרה מהרשימה"
    />
  );
};

export default Missile3DViewer;
