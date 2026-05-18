import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EntityType } from "../../domain/models";

type EntityFilter = "all" | "visible" | "hidden";
type Tool = "select" | EntityType;

export type LayerKey =
  | "baseMap"
  | "satelliteImagery"
  | "roads"
  | "boundaries"
  | "terrain"
  | "buildings"
  | "targets"
  | "trails"
  | "entities";

type UiState = {
  activeTool: Tool;
  activeNav: string;
  entitySearch: string;
  entityFilter: EntityFilter;
  layerVisibility: Record<LayerKey, boolean>;
  flightFollowCamera: boolean;
  flightHudVisible: boolean;
  selectedInfoTab: "target" | "telemetry" | "systems" | "weapons" | "notes";
};

const initialState: UiState = {
  activeTool: "select",
  activeNav: "Map",
  entitySearch: "",
  entityFilter: "all",
  layerVisibility: {
    baseMap: true,
    satelliteImagery: true,
    roads: true,
    boundaries: false,
    terrain: true,
    buildings: true,
    targets: true,
    trails: true,
    entities: true
  },
  flightFollowCamera: true,
  flightHudVisible: true,
  selectedInfoTab: "target"
};

const slice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setActiveTool(state, action: PayloadAction<Tool>) {
      state.activeTool = action.payload;
    },
    setActiveNav(state, action: PayloadAction<string>) {
      state.activeNav = action.payload;
    },
    setEntitySearch(state, action: PayloadAction<string>) {
      state.entitySearch = action.payload;
    },
    setEntityFilter(state, action: PayloadAction<EntityFilter>) {
      state.entityFilter = action.payload;
    },
    toggleLayer(state, action: PayloadAction<LayerKey>) {
      state.layerVisibility[action.payload] = !state.layerVisibility[action.payload];
    },
    setFlightFollowCamera(state, action: PayloadAction<boolean>) {
      state.flightFollowCamera = action.payload;
    },
    toggleFlightFollowCamera(state) {
      state.flightFollowCamera = !state.flightFollowCamera;
    },
    toggleFlightHud(state) {
      state.flightHudVisible = !state.flightHudVisible;
    },
    setInfoTab(state, action: PayloadAction<UiState["selectedInfoTab"]>) {
      state.selectedInfoTab = action.payload;
    }
  }
});

export const {
  setActiveTool,
  setActiveNav,
  setEntitySearch,
  setEntityFilter,
  toggleLayer,
  setFlightFollowCamera,
  toggleFlightFollowCamera,
  toggleFlightHud,
  setInfoTab
} = slice.actions;
export default slice.reducer;
