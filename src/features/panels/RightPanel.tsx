import { FlightSimulator } from "../tracking3d/FlightSimulator";
import { useAppDispatch } from "../../shared/hooks/useAppDispatch";
import { useAppSelector } from "../../shared/hooks/useAppSelector";
import { setInfoTab } from "../layout/uiSlice";

export function RightPanel() {
  const dispatch = useAppDispatch();
  const target = useAppSelector(s => s.targets.byId[s.targets.selectedId]);
  const tab = useAppSelector(s => s.ui.selectedInfoTab);

  return (
    <aside className="right-panel">
      <FlightSimulator />

      <div className="info-tabs">
        <button className={`info-tab ${tab === "target" ? "active" : ""}`} onClick={() => dispatch(setInfoTab("target"))}>TARGET INFO</button>
        <button className={`info-tab ${tab === "telemetry" ? "active" : ""}`} onClick={() => dispatch(setInfoTab("telemetry"))}>TELEMETRY</button>
        <button className={`info-tab ${tab === "systems" ? "active" : ""}`} onClick={() => dispatch(setInfoTab("systems"))}>SYSTEMS</button>
        <button className={`info-tab ${tab === "weapons" ? "active" : ""}`} onClick={() => dispatch(setInfoTab("weapons"))}>WEAPON STATUS</button>
        <button className={`info-tab ${tab === "notes" ? "active" : ""}`} onClick={() => dispatch(setInfoTab("notes"))}>NOTES</button>
      </div>

      {tab === "target" && <TargetInfo target={target} />}
      {tab === "telemetry" && <TelemetryInfo target={target} />}
      {tab === "systems" && <SystemsInfo />}
      {tab === "weapons" && <WeaponsInfo />}
      {tab === "notes" && <NotesInfo />}
    </aside>
  );
}

function TargetInfo({ target }: { target: any }) {
  return (
    <div className="info-grid">
      <div className="info-card">
        <div className="info-title">✈ {target.id} <span className="live-badge" style={{ marginLeft: 10 }}>LIVE</span></div>
        <div className="card-meta">Type: {target.type}</div>
        <div className="card-meta">Group: {target.group}</div>
        <div className="card-meta">Status: Active</div>
        <div className="card-meta">Callsign: {target.callsign}</div>
      </div>

      <div className="metric-grid">
        <Metric label="SPEED" value={`${Math.round(target.speedKts)} KTS`} />
        <Metric label="ALTITUDE" value={`${Math.round(target.altitudeFt).toLocaleString()} FT`} />
        <Metric label="HEADING" value={`${Math.round(target.headingDeg)}°`} />
        <Metric label="PITCH" value={`${Math.round(target.pitchDeg)}°`} />
        <Metric label="ROLL" value={`${Math.round(target.rollDeg)}°`} />
        <Metric label="CLIMB RATE" value={`${Math.round(target.climbRateFpm)} FT/MIN`} />
        <Metric label="GROUND SPEED" value={`${Math.round(target.groundSpeedKts)} KTS`} />
        <Metric label="VERTICAL SPEED" value={`+${Math.round(target.verticalSpeedFpm)} FT/MIN`} />
      </div>

      <div className="info-card">
        <div className="info-title">COORDINATES</div>
        <div className="card-meta">Latitude: {target.position.lat.toFixed(5)}° N</div>
        <div className="card-meta">Longitude: {target.position.lng.toFixed(5)}° E</div>
        <div className="card-meta">Altitude (MSL): {Math.round(target.altitudeFt).toLocaleString()} ft</div>
      </div>

      <HistoryChart />
    </div>
  );
}

function TelemetryInfo({ target }: { target: any }) {
  return (
    <div className="panel-body">
      <div className="metric-grid">
        <Metric label="LAT" value={target.position.lat.toFixed(5)} />
        <Metric label="LON" value={target.position.lng.toFixed(5)} />
        <Metric label="ALT M" value={`${Math.round(target.position.alt ?? 0)}`} />
        <Metric label="UPDATE" value="LIVE" />
      </div>
      <div className="code-note" style={{ marginTop: 12 }}>{`Telemetry payload is normalized before entering Redux.
Map layers and 3D viewer subscribe to normalized state only.`}</div>
    </div>
  );
}

function SystemsInfo() {
  return <div className="panel-body"><div className="info-card"><div className="info-title">SYSTEMS</div><div className="card-meta">GPS: 3D FIX</div><div className="card-meta">DATALINK: ONLINE</div><div className="card-meta">3D ENGINE: RUNNING</div></div></div>;
}

function WeaponsInfo() {
  return <div className="panel-body"><div className="info-card"><div className="info-title">WEAPON STATUS</div><div className="card-meta">AIM-120D: READY</div><div className="card-meta">AIM-9X: READY</div><div className="card-meta">SAFE MODE: ON</div></div></div>;
}

function NotesInfo() {
  return <div className="panel-body"><textarea className="notes-box" defaultValue="Operational notes..." /></div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="metric"><div className="metric-label">{label}</div><div className="metric-value">{value}</div></div>;
}

function HistoryChart() {
  const ys = [70,28,64,54,46,68,45,28,42,68,56,30];
  const xs = [0,40,85,130,170,220,270,315,360,405,455,500];
  return (
    <div className="history">
      <svg viewBox="0 0 500 100" preserveAspectRatio="none">
        <polyline fill="none" stroke="#60a5fa" strokeWidth="3" points={xs.map((x, i) => `${x},${ys[i]}`).join(" ")} />
        {xs.map((x, i) => <circle key={i} cx={x} cy={ys[i]} r="4" fill="#60a5fa" />)}
      </svg>
    </div>
  );
}
