# Detachable Modules

## Flight Simulator

קבצים עיקריים:
- `features/tracking3d/FlightSimulator.tsx`
- `core/flight3d/FlightScene3D.ts`
- `core/flight3d/createFlightMap.ts`

המודול תלוי ב:
- `targetsSlice`
- `platformConfig.flight3d`

אפשר להעביר אותו לפרויקט אחר עם אותם contracts.

## Map Entities

קבצים:
- `core/services/EntityRenderService.ts`
- `core/services/EntityEditService.ts`

הם לא תלויים ב־React, ולכן אפשר להעביר אותם לכל פרויקט MapLibre.

## Targets Layer

קובץ:
- `core/services/TargetsMapService.ts`

מקבל `maplibregl.Map` ו־targets בלבד.
