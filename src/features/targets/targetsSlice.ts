import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Target } from "../../domain/models";

const now = Date.now();

const hawk: Target = {
  id: "HAWK-001",
  callsign: "HAWK-001",
  type: "Aircraft",
  group: "Alpha",
  status: "LIVE",
  position: { lng: 34.78178, lat: 32.08538, alt: 2400 },
  headingDeg: 310,
  pitchDeg: -2,
  rollDeg: -1,
  speedKts: 480,
  altitudeFt: 19019,
  climbRateFpm: 1120,
  groundSpeedKts: 475,
  verticalSpeedFpm: 1120,
  lastUpdate: now,
  trail: [
    { lng: 34.770, lat: 32.055, alt: 2100, t: now - 22000 },
    { lng: 34.774, lat: 32.068, alt: 2200, t: now - 15000 },
    { lng: 34.778, lat: 32.078, alt: 2350, t: now - 8000 }
  ]
};

const hawk2: Target = {
  ...hawk,
  id: "HAWK-002",
  callsign: "HAWK-002",
  position: { lng: 34.760, lat: 32.072, alt: 2100 },
  headingDeg: 25,
  pitchDeg: 5,
  rollDeg: 12,
  altitudeFt: 16520,
  speedKts: 390,
  trail: []
};

type TargetsState = {
  byId: Record<string, Target>;
  allIds: string[];
  selectedId: string;
};

const initialState: TargetsState = {
  byId: { [hawk.id]: hawk, [hawk2.id]: hawk2 },
  allIds: [hawk.id, hawk2.id],
  selectedId: hawk.id
};

const slice = createSlice({
  name: "targets",
  initialState,
  reducers: {
    upsertTarget(state, action: PayloadAction<Target>) {
      const t = action.payload;
      state.byId[t.id] = t;
      if (!state.allIds.includes(t.id)) state.allIds.push(t.id);
    },
    selectTarget(state, action: PayloadAction<string>) {
      state.selectedId = action.payload;
    }
  }
});

export const { upsertTarget, selectTarget } = slice.actions;
export default slice.reducer;
