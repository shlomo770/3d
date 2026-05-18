import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "../features/layout/uiSlice";
import entitiesReducer from "../features/panels/entitiesSlice";
import targetsReducer from "../features/targets/targetsSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    entities: entitiesReducer,
    targets: targetsReducer
  },
  devTools: true
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
