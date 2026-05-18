# PRO GIS PLATFORM v10 Architecture

## Visual goal

Implementation aimed at the provided mock:
- left dark entity/layer panel
- center 2D satellite map
- right 3D flight simulator
- telemetry cards
- HUD overlay

## Detachable modules

```txt
StatusBar
SideNav
LeftPanel
MainMap
RightPanel
FlightSimulator
FlightScene3D
TargetsSimulator
EntityRenderService
EntityEditService
TargetsMapService
```

## 3D composition

```txt
FlightSimulator
  flight-map: MapLibre pitched satellite/terrain map
  flight-three: Three.js transparent overlay, aircraft in center
  flight-hud: React HUD overlay
```

This gives the visual effect of a chase camera: the map moves under the aircraft, and the aircraft stays visible in frame.

## Server message flow

```txt
server message
  -> normalizeTargetMessage
  -> targetsSlice.upsertTarget
  -> TargetsMapService.setTargets
  -> FlightSimulator / FlightScene3D / HUD
```
