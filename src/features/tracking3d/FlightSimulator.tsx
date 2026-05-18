import { useMemo } from "react";
import type { StyleSpecification } from "maplibre-gl";
import { platformConfig } from "../../core/config/platformConfig";
import { useAppDispatch } from "../../shared/hooks/useAppDispatch";
import { useAppSelector } from "../../shared/hooks/useAppSelector";
import { targetToTelemetry } from "../flight3d/adapters/targetToTelemetry";
import FlightChaseView from "../flight3d/components/FlightChaseView";
import { mergeChaseConfig } from "../flight3d/utils/mergeChaseConfig";
import { toggleFlightHud } from "../layout/uiSlice";
import type { Target } from "../../domain/models";

export function FlightSimulator() {
  const dispatch = useAppDispatch();
  const hudVisible = useAppSelector((s) => s.ui.flightHudVisible);
  const target = useAppSelector((s) => s.targets.byId[s.targets.selectedId]);

  const mapStyle = useMemo(
    () => platformConfig.flight3d.style as unknown as StyleSpecification,
    []
  );

  const chaseConfig = useMemo(
    () =>
      mergeChaseConfig({
        mapZoom: platformConfig.flight3d.zoom,
        mapPitch: platformConfig.flight3d.pitch,
        meshYawOffsetDeg: platformConfig.flight3d.meshYawOffsetDeg,
      }),
    []
  );

  const telemetry = target ? targetToTelemetry(target) : null;

  return (
    <div className="flight-card">
      <div className="flight-head">
        <div className="flight-title">{platformConfig.flight3d.title}</div>
        <div className="flight-actions">
          <button
            className={`btn ${hudVisible ? "primary" : ""}`}
            onClick={() => dispatch(toggleFlightHud())}
          >
            HUD
          </button>
        </div>
      </div>

      <div className="flight-stage">
        <FlightChaseView
          telemetry={telemetry}
          mapStyle={mapStyle}
          config={chaseConfig}
          showTrail
        />
        {hudVisible && target && <FlightHud target={target} />}
      </div>
    </div>
  );
}

function FlightHud({ target }: { target: Target }) {
  return (
    <div className="flight-hud">
      <div className="hud-heading">
        <div className="heading-tape">
          <span>W</span>
          <span>300</span>
          <span>N</span>
          <span>030</span>
          <span>E</span>
        </div>
        <span className="heading-value">{Math.round(target.headingDeg)}</span>
      </div>

      <div className="hud-box hud-speed">
        <div className="hud-label">CAS</div>
        <div className="hud-big">{Math.round(target.speedKts)}</div>
        <div className="hud-small">KTS</div>
      </div>

      <div className="hud-box hud-alt">
        <div className="hud-label">ALT</div>
        <div className="hud-big">{Math.round(target.altitudeFt).toLocaleString()}</div>
        <div className="hud-small">FT</div>
      </div>

      <div className="hud-center">
        <div className="cross" />
        {[-20, -10, 0, 10, 20].map((p, i) => (
          <div key={p} className="pitch" style={{ top: `${20 + i * 14}%` }}>
            <span>{p}</span>
          </div>
        ))}
      </div>

      <div className="hud-time">
        {target.callsign}
        <br />
        {target.id}
      </div>
      <div className="hud-coords">
        LAT&nbsp; {target.position.lat.toFixed(5)} N
        <br />
        LON&nbsp; {target.position.lng.toFixed(5)} E
      </div>
    </div>
  );
}
