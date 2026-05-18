import { useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { platformConfig } from "../../core/config/platformConfig";
import { useAppDispatch } from "../../shared/hooks/useAppDispatch";
import { useAppSelector } from "../../shared/hooks/useAppSelector";
import { EntityRenderService } from "../../core/services/EntityRenderService";
import { EntityEditService } from "../../core/services/EntityEditService";
import { TargetsMapService } from "../../core/services/TargetsMapService";
import { addEntity, selectEntity, setEditingId, upsertEntity } from "../panels/entitiesSlice";
import { setActiveTool } from "../layout/uiSlice";
import type { Entity, EntityType, LngLat } from "../../domain/models";

export function MainMap() {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapEl = useRef<HTMLDivElement | null>(null);
  const entityRender = useRef<EntityRenderService | null>(null);
  const entityEdit = useRef<EntityEditService | null>(null);
  const targetsLayer = useRef<TargetsMapService | null>(null);

  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState<Entity | null>(null);
  const [creating, setCreating] = useState<{ type: "line" | "polygon"; points: LngLat[] } | null>(null);

  const dispatch = useAppDispatch();
  const tool = useAppSelector(s => s.ui.activeTool);
  const selectedId = useAppSelector(s => s.entities.selectedId);
  const byId = useAppSelector(s => s.entities.byId);
  const ids = useAppSelector(s => s.entities.allIds);
  const tById = useAppSelector(s => s.targets.byId);
  const tIds = useAppSelector(s => s.targets.allIds);

  const entities = useMemo(() => ids.map(id => byId[id]).filter(Boolean), [ids, byId]);
  const targets = useMemo(() => tIds.map(id => tById[id]).filter(Boolean), [tIds, tById]);
  const layerVisibility = useAppSelector(s => s.ui.layerVisibility);

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: mapEl.current,
      style: platformConfig.map2d.style as any,
      center: platformConfig.map2d.center,
      zoom: platformConfig.map2d.zoom,
      pitch: 0,
      bearing: 0,
      attributionControl: false
    });
    map.addControl(new maplibregl.NavigationControl(), "bottom-right");
    map.doubleClickZoom.disable();

    const resize = () => map.resize();
    const ro = mapEl.current ? new ResizeObserver(resize) : null;
    ro?.observe(mapEl.current);

    map.on("load", () => {
      mapRef.current = map;
      entityRender.current = new EntityRenderService(map);
      entityEdit.current = new EntityEditService(map);
      targetsLayer.current = new TargetsMapService(map);
      entityRender.current.init();
      targetsLayer.current.init();
      setReady(true);
      resize();
    });

    return () => {
      ro?.disconnect();
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    entityRender.current?.setEntities(layerVisibility.entities ? entities : [], draft);
  }, [ready, entities, draft, layerVisibility.entities]);

  useEffect(() => {
    if (!ready) return;
    targetsLayer.current?.setTargets(layerVisibility.targets ? targets : []);
  }, [ready, targets, layerVisibility.targets]);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    safeVisibility(map, "targets-trail-layer", layerVisibility.trails);
    safeVisibility(map, "targets-layer", layerVisibility.targets);
    safeVisibility(map, "entities-fill", layerVisibility.entities);
    safeVisibility(map, "entities-line", layerVisibility.entities);
    safeVisibility(map, "entities-point", layerVisibility.entities);
    safeVisibility(map, "satellite", layerVisibility.baseMap && layerVisibility.satelliteImagery);
  }, [ready, layerVisibility]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    const click = (e: maplibregl.MapMouseEvent) => {
      const p = { lng: e.lngLat.lng, lat: e.lngLat.lat };
      if (tool === "select") return;

      if (tool === "line" || tool === "polygon") {
        setCreating(prev => {
          const next = prev?.type === tool ? { ...prev, points: [...prev.points, p] } : { type: tool, points: [p] };
          setDraft(preview(next.type, next.points));
          return next;
        });
        return;
      }

      dispatch(addEntity(tool as EntityType, p));
      dispatch(setActiveTool("select"));
    };

    const dbl = () => finishCreate();

    map.on("click", click);
    map.on("dblclick", dbl);
    return () => {
      map.off("click", click);
      map.off("dblclick", dbl);
    };
  }, [ready, tool, creating]);

  function finishCreate() {
    if (!creating) return;
    const min = creating.type === "line" ? 2 : 3;
    if (creating.points.length >= min) {
      const id = crypto.randomUUID?.() ?? `entity-${Date.now()}`;
      dispatch(upsertEntity(finalEntity(id, creating.type, creating.points)));
      dispatch(selectEntity(id));
    }
    setCreating(null);
    setDraft(null);
    dispatch(setActiveTool("select"));
  }

  function cancelCreate() {
    setCreating(null);
    setDraft(null);
    dispatch(setActiveTool("select"));
  }

  function startEdit() {
    if (!selectedId) return;
    const e = byId[selectedId];
    if (!e || !e.visible) return;
    dispatch(setEditingId(e.id));
    entityEdit.current?.start(e, {
      onDraftChanged: setDraft,
      onFinish: (updated) => {
        dispatch(upsertEntity(updated));
        dispatch(setEditingId(null));
      },
      onCancel: () => dispatch(setEditingId(null))
    });
  }

  function finishEdit() {
    entityEdit.current?.finish();
  }

  function cancelEdit() {
    entityEdit.current?.cancel();
  }

  return (
    <section className="center-map">
      <div ref={mapEl} className="map-root" />

      <div className="map-toolbar">
        <div className="tool-group">
          {(["select", "marker", "line", "polygon", "circle", "ellipse", "rectangle"] as const).map(t => (
            <button key={t} className={`tool-btn ${tool === t ? "active" : ""}`} onClick={() => dispatch(setActiveTool(t))} title={t}>
              {iconForTool(t)}
            </button>
          ))}
        </div>
        <div className="tool-group">
          <button className="btn primary" disabled={!selectedId} onClick={startEdit}>ערוך נבחר</button>
        </div>
      </div>

      {creating && (
        <div className="edit-floating">
          <b>יצירה: {creating.type}</b>
          <span className="edit-help">נקודות: {creating.points.length}</span>
          <button className="btn primary" onClick={finishCreate}>סיום</button>
          <button className="btn danger" onClick={cancelCreate}>ביטול</button>
        </div>
      )}

      {draft && !creating && (
        <div className="edit-floating">
          <b>מצב עריכה</b>
          <span className="edit-help">גרור נקודות. בקו/פוליגון גרור midpoint להוספה.</span>
          <button className="btn primary" onClick={finishEdit}>סיום</button>
          <button className="btn danger" onClick={cancelEdit}>ביטול</button>
        </div>
      )}

      <div className="map-footer">
        <span>LAT&nbsp;&nbsp;32.08538° N</span>
        <span>LON&nbsp;&nbsp;34.78178° E</span>
        <span>ALT&nbsp;&nbsp;125 m</span>
        <span>ZOOM&nbsp;&nbsp;13.4</span>
        <div className="scale">1 km</div>
      </div>
    </section>
  );
}

function iconForTool(t: string) {
  return t === "select" ? "↖" : t === "marker" ? "⌖" : t === "line" ? "╱" : t === "polygon" ? "⬡" : t === "circle" ? "○" : t === "ellipse" ? "◌" : "▭";
}

function preview(type: "line" | "polygon", points: LngLat[]): Entity {
  if (type === "line") return { id: "__draft__", name: "Draft Line", type, color: "#38bdf8", opacity: .7, visible: true, coordinates: points };
  return { id: "__draft__", name: "Draft Polygon", type, color: "#38bdf8", opacity: .34, visible: true, coordinates: points };
}

function finalEntity(id: string, type: "line" | "polygon", points: LngLat[]): Entity {
  if (type === "line") return { id, name: `Line ${id.slice(0,4)}`, type, color: "#38bdf8", opacity: .75, visible: true, coordinates: points };
  return { id, name: `Polygon ${id.slice(0,4)}`, type, color: "#38bdf8", opacity: .34, visible: true, coordinates: points };
}

function safeVisibility(map: maplibregl.Map, layerId: string, visible: boolean) {
  if (map.getLayer(layerId)) {
    map.setLayoutProperty(layerId, "visibility", visible ? "visible" : "none");
  }
}
