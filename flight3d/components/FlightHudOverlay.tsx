import React from "react";
import type { FlightTelemetry } from "../types";

type Props = {
  telemetry: FlightTelemetry;
  calibrationHint?: string;
};

const FlightHudOverlay: React.FC<Props> = ({ telemetry, calibrationHint }) => {
  const pitch = telemetry.pitchDeg;
  const roll = telemetry.rollDeg;
  const heading = telemetry.headingDeg;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 font-mono text-[11px] text-emerald-300">
      <div className="absolute left-1/2 top-2 -translate-x-1/2">
        <div
          className="relative h-[76px] w-[76px] rounded-full border border-sky-500/35 bg-black/45"
          style={{ transform: `rotate(${-heading}deg)` }}
        >
          <span className="absolute left-1/2 top-1 -translate-x-1/2 text-[11px] font-bold text-sky-300">
            N
          </span>
          <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-400">
            E
          </span>
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] text-gray-500">
            S
          </span>
          <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-400">
            W
          </span>
        </div>
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <span className="text-[10px] font-bold text-amber-400">▲</span>
          <span className="text-[8px] text-amber-300/90">טיסה</span>
        </div>
      </div>
      <div className="absolute right-3 top-2 max-w-[180px] rounded bg-black/55 px-2 py-1 text-[9px] leading-snug text-gray-400">
        מרדף 3D · מסלול + מודל מאותו telemetry
      </div>

      {calibrationHint && (
        <div className="absolute left-1/2 top-[88px] z-20 max-w-[92%] -translate-x-1/2 rounded-lg border border-amber-400/50 bg-amber-950/90 px-3 py-2 text-center text-[11px] font-medium text-amber-100 shadow-lg">
          {calibrationHint}
        </div>
      )}

      <div className="absolute left-3 top-3 rounded-md border border-emerald-500/30 bg-black/50 px-2.5 py-1.5 text-xs font-semibold text-emerald-200 backdrop-blur-sm">
        {telemetry.id}
      </div>

      <div className="absolute left-3 top-[92px] rounded-md border border-emerald-400/40 bg-black/50 px-3 py-1.5">
        <div className="text-base font-bold text-white">
          {Math.round(heading).toString().padStart(3, "0")}°
        </div>
        <div className="text-[9px] uppercase text-emerald-400/80">HDG</div>
      </div>

      <div className="absolute left-3 bottom-20">
        <div className="rounded bg-black/45 px-2 py-0.5 text-[9px]">SPD</div>
        <div className="text-lg font-bold text-white">
          {telemetry.speed != null ? Math.round(telemetry.speed) : "—"}
        </div>
        <div className="text-[9px] text-gray-400">KTS</div>
      </div>

      <div className="absolute right-3 bottom-20 text-right">
        <div className="rounded bg-black/45 px-2 py-0.5 text-[9px]">ALT</div>
        <div className="text-lg font-bold text-white">
          {Math.round(telemetry.altM).toLocaleString()}
        </div>
        <div className="text-[9px] text-gray-400">M</div>
      </div>

      <div className="absolute bottom-3 right-3 rounded-md border border-white/10 bg-black/55 px-2.5 py-1.5 text-right text-[10px]">
        <div className="text-emerald-400/80">ATTITUDE</div>
        <div className={Math.abs(pitch) > 8 ? "font-semibold text-amber-300" : ""}>
          PITCH {pitch.toFixed(1)}°
        </div>
        <div className={Math.abs(roll) > 8 ? "font-semibold text-amber-300" : ""}>
          ROLL {roll.toFixed(1)}°
        </div>
      </div>

      <div className="absolute bottom-3 left-3 rounded-md border border-white/10 bg-black/50 px-2.5 py-1.5 text-[10px]">
        <div className="text-emerald-400/80">POSITION</div>
        <div>LAT {telemetry.lat.toFixed(5)}</div>
        <div>LON {telemetry.lng.toFixed(5)}</div>
      </div>
    </div>
  );
};

export default FlightHudOverlay;
