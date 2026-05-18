import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { Entity, EntityType, LngLat } from "../../domain/models";

type EntitiesState = {
  byId: Record<string, Entity>;
  allIds: string[];
  selectedId: string | null;
  editingId: string | null;
};

const sample: Entity[] = [
  {
    id: "alpha-area",
    name: "Alpha Area",
    type: "polygon",
    color: "#a855f7",
    opacity: 0.32,
    visible: true,
    coordinates: [
      { lng: 34.794, lat: 32.095 },
      { lng: 34.812, lat: 32.088 },
      { lng: 34.806, lat: 32.075 },
      { lng: 34.787, lat: 32.079 }
    ]
  },
  {
    id: "route-bravo",
    name: "Route Bravo",
    type: "line",
    color: "#63ff8f",
    opacity: 0.9,
    visible: true,
    coordinates: [
      { lng: 34.792, lat: 32.048 },
      { lng: 34.785, lat: 32.066 },
      { lng: 34.792, lat: 32.083 },
      { lng: 34.810, lat: 32.100 }
    ]
  },
  {
    id: "circle-zone",
    name: "Circle Zone",
    type: "circle",
    color: "#fb923c",
    opacity: 0.23,
    visible: true,
    center: { lng: 34.798, lat: 32.058 },
    radiusM: 1450
  },
  {
    id: "landing-zone",
    name: "Landing Zone",
    type: "rectangle",
    color: "#facc15",
    opacity: 0.22,
    visible: false,
    center: { lng: 34.770, lat: 32.069 },
    widthM: 1400,
    heightM: 900,
    rotationDeg: 0
  },
  {
    id: "obs-1",
    name: "Observation Point",
    type: "marker",
    color: "#ef4444",
    opacity: 1,
    visible: true,
    position: { lng: 34.779, lat: 32.036 }
  },
  {
    id: "ellipse-area",
    name: "Ellipse Area",
    type: "ellipse",
    color: "#06b6d4",
    opacity: 0.24,
    visible: false,
    center: { lng: 34.825, lat: 32.072 },
    radiusXM: 1200,
    radiusYM: 600,
    rotationDeg: 0
  }
];

const initialState: EntitiesState = {
  byId: Object.fromEntries(sample.map((e) => [e.id, e])),
  allIds: sample.map((e) => e.id),
  selectedId: "alpha-area",
  editingId: null
};

function createDefault(type: EntityType, p: LngLat): Entity {
  const base = { id: nanoid(), name: `${type.toUpperCase()} ${Date.now().toString().slice(-4)}`, type, color: "#38bdf8", opacity: 0.35, visible: true } as const;
  switch (type) {
    case "marker": return { ...base, type, position: p };
    case "line": return { ...base, type, coordinates: [p] };
    case "polygon": return { ...base, type, coordinates: [p] };
    case "circle": return { ...base, type, center: p, radiusM: 900 };
    case "ellipse": return { ...base, type, center: p, radiusXM: 1100, radiusYM: 650, rotationDeg: 0 };
    case "rectangle": return { ...base, type, center: p, widthM: 1400, heightM: 900, rotationDeg: 0 };
  }
}

const slice = createSlice({
  name: "entities",
  initialState,
  reducers: {
    addEntity: {
      reducer(state, action: PayloadAction<Entity>) {
        const e = action.payload;
        state.byId[e.id] = e;
        if (!state.allIds.includes(e.id)) state.allIds.push(e.id);
        state.selectedId = e.id;
      },
      prepare(type: EntityType, point: LngLat) {
        return { payload: createDefault(type, point) };
      }
    },
    upsertEntity(state, action: PayloadAction<Entity>) {
      const e = action.payload;
      state.byId[e.id] = e;
      if (!state.allIds.includes(e.id)) state.allIds.push(e.id);
      state.selectedId = e.id;
    },
    selectEntity(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    removeEntity(state, action: PayloadAction<string>) {
      delete state.byId[action.payload];
      state.allIds = state.allIds.filter((id) => id !== action.payload);
      if (state.selectedId === action.payload) state.selectedId = null;
    },
    toggleVisibility(state, action: PayloadAction<string>) {
      const e = state.byId[action.payload];
      if (e && state.editingId !== e.id) e.visible = !e.visible;
    },
    setEditingId(state, action: PayloadAction<string | null>) {
      state.editingId = action.payload;
    }
  }
});

export const { addEntity, upsertEntity, selectEntity, removeEntity, toggleVisibility, setEditingId } = slice.actions;
export default slice.reducer;
