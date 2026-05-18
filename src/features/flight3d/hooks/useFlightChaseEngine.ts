import { useEffect, type RefObject } from "react";
import maplibregl from "maplibre-gl";
import type * as THREE from "three";
import {
  FALLBACK_TELEMETRY,
  FLIGHT3D_MAP_SELECTOR,
  FLIGHT3D_THREE_SELECTOR,
} from "../constants";
import { applyOverlayAircraftRotation } from "../engine/aircraftAttitude";
import { applyChaseMapCamera, tryApplyFreeChaseCamera } from "../engine/chaseMapCamera";
import { createChaseScene } from "../engine/ChaseScene";
import { FlightMapOverlay } from "../engine/FlightMapOverlay";
import { TelemetrySmoother } from "../engine/telemetrySmoother";
import { lerpAngleDeg } from "../math/attitude";
import { loadAircraftModel } from "../models/loadAircraftModel";
import { createSimpleMissileMesh } from "../models/simpleMissileMesh";
import type { FlightChaseViewConfig, FlightModelSource, FlightTelemetry } from "../types";

function readTelemetry(ref: RefObject<FlightTelemetry | null>): FlightTelemetry {
  return ref.current ?? FALLBACK_TELEMETRY;
}

export function useFlightChaseEngine(
  containerRef: RefObject<HTMLDivElement | null>,
  telemetryRef: RefObject<FlightTelemetry | null>,
  mapStyle: maplibregl.StyleSpecification,
  modelSource: FlightModelSource,
  config: FlightChaseViewConfig,
  options: { showTrail: boolean; showPositionMarker: boolean }
): void {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mapHost = container.querySelector(FLIGHT3D_MAP_SELECTOR) as HTMLDivElement | null;
    const threeHost = container.querySelector(FLIGHT3D_THREE_SELECTOR) as HTMLDivElement | null;
    if (!mapHost || !threeHost) return;

    const initial = readTelemetry(telemetryRef);
    let disposed = false;
    let raf = 0;
    let mapReady = false;
    let aircraft: THREE.Group | null = null;
    let trackHeadingDeg = initial.headingDeg;
    const chaseCfg = config.chaseCamera;

    const map = new maplibregl.Map({
      container: mapHost,
      style: mapStyle,
      center: [initial.lng, initial.lat],
      zoom: config.mapZoom,
      bearing: initial.headingDeg,
      pitch: chaseCfg.mapPitchDeg,
      interactive: false,
      attributionControl: false,
      fadeDuration: 0,
    });

    const overlay = new FlightMapOverlay(map, config, options);
    const smoother = new TelemetrySmoother(initial, config.smooth);
    const chaseScene = createChaseScene(threeHost, config);

    void loadAircraftModel(modelSource)
      .then((model) => {
        if (disposed) return;
        aircraft = model;
        chaseScene.setAircraft(model);
      })
      .catch((err) => {
        console.error("[FlightChaseView] model load failed", err);
        if (disposed) return;
        const fallback = createSimpleMissileMesh();
        aircraft = fallback;
        chaseScene.setAircraft(fallback);
      });

    map.on("load", () => {
      if (disposed) return;
      overlay.install();
      overlay.seedTrailPoint(initial.lat, initial.lng);
      mapReady = true;
      map.resize();
    });

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const telemetry = readTelemetry(telemetryRef);
      const smoothed = smoother.step(telemetry);
      const pose = overlay.update(
        { lat: smoothed.lat, lng: smoothed.lng },
        telemetry.headingDeg
      );

      trackHeadingDeg = lerpAngleDeg(trackHeadingDeg, pose.trackHeadingDeg, config.smooth.attitude);

      const w = threeHost.clientWidth;
      const h = threeHost.clientHeight;

      if (mapReady) {
        const camPose = {
          lng: pose.lng,
          lat: pose.lat,
          altM: telemetry.altM,
          headingDeg: trackHeadingDeg,
        };

        const usedFree = tryApplyFreeChaseCamera(map, camPose, chaseCfg);
        let projected: { x: number; y: number };
        if (!usedFree) {
          projected = applyChaseMapCamera(map, camPose, chaseCfg);
        } else {
          projected = map.project([pose.lng, pose.lat]);
        }

        chaseScene.placeAircraftOnScreen(projected.x, projected.y, w, h);
      }

      if (aircraft) {
        applyOverlayAircraftRotation(
          aircraft,
          trackHeadingDeg,
          smoothed.pitchDeg,
          smoothed.rollDeg,
          config.attitudeGain,
          config.meshYawOffsetDeg,
          config.applyModelPitchRoll
        );
      }

      chaseScene.render();
    };
    tick();

    const onResize = () => {
      chaseScene.resize(threeHost.clientWidth, threeHost.clientHeight);
      map.resize();
    };
    const observer = new ResizeObserver(onResize);
    observer.observe(threeHost);
    observer.observe(mapHost);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      map.remove();
      chaseScene.dispose();
    };
  }, [containerRef, mapStyle, modelSource, config, options.showTrail, options.showPositionMarker]);
}
