import { useMemo } from "react";
import { useAppDispatch } from "../../shared/hooks/useAppDispatch";
import { useAppSelector } from "../../shared/hooks/useAppSelector";
import { removeEntity, selectEntity, toggleVisibility } from "./entitiesSlice";
import { selectTarget } from "../targets/targetsSlice";
import {
  setActiveTool,
  setEntityFilter,
  setEntitySearch,
  toggleLayer,
  type LayerKey
} from "../layout/uiSlice";

const layerRows: Array<{ key: LayerKey; label: string }> = [
  { key: "baseMap", label: "Base Map" },
  { key: "satelliteImagery", label: "Satellite Imagery" },
  { key: "roads", label: "Roads" },
  { key: "boundaries", label: "Boundaries" },
  { key: "terrain", label: "Terrain" },
  { key: "buildings", label: "Buildings" },
  { key: "targets", label: "Targets" },
  { key: "trails", label: "Trails" },
  { key: "entities", label: "Entities" }
];

export function LeftPanel() {
  const dispatch = useAppDispatch();
  const entities = useAppSelector(s => s.entities.allIds.map(id => s.entities.byId[id]));
  const targets = useAppSelector(s => s.targets.allIds.map(id => s.targets.byId[id]));
  const selected = useAppSelector(s => s.entities.selectedId);
  const selectedTargetId = useAppSelector(s => s.targets.selectedId);
  const search = useAppSelector(s => s.ui.entitySearch);
  const filter = useAppSelector(s => s.ui.entityFilter);
  const layers = useAppSelector(s => s.ui.layerVisibility);

  const filteredEntities = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entities.filter(e => {
      if (filter === "visible" && !e.visible) return false;
      if (filter === "hidden" && e.visible) return false;
      if (!q) return true;
      return `${e.name} ${e.type}`.toLowerCase().includes(q);
    });
  }, [entities, search, filter]);

  const visibleCount = entities.filter(e => e.visible).length + targets.length;
  const hiddenCount = entities.filter(e => !e.visible).length;

  return (
    <aside className="left-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">ENTITIES</div>
          <div className="panel-sub">חיפוש, סינון, יצירה, שכבות</div>
        </div>
        <button className="btn primary" onClick={() => dispatch(setActiveTool("marker"))}>+ NEW</button>
      </div>
      <div className="panel-body">
        <div className="search-row">
          <input
            className="search-input"
            placeholder="Search entities..."
            value={search}
            onChange={(e) => dispatch(setEntitySearch(e.target.value))}
          />
        </div>
        <div className="tabs">
          <button className={`tab ${filter === "all" ? "active" : ""}`} onClick={() => dispatch(setEntityFilter("all"))}>ALL ({entities.length + targets.length})</button>
          <button className={`tab ${filter === "visible" ? "active" : ""}`} onClick={() => dispatch(setEntityFilter("visible"))}>VISIBLE ({visibleCount})</button>
          <button className={`tab ${filter === "hidden" ? "active" : ""}`} onClick={() => dispatch(setEntityFilter("hidden"))}>HIDDEN ({hiddenCount})</button>
        </div>

        <div className="quick-create">
          <button className="btn" onClick={() => dispatch(setActiveTool("marker"))}>Marker</button>
          <button className="btn" onClick={() => dispatch(setActiveTool("line"))}>Line</button>
          <button className="btn" onClick={() => dispatch(setActiveTool("polygon"))}>Polygon</button>
          <button className="btn" onClick={() => dispatch(setActiveTool("circle"))}>Circle</button>
        </div>

        <div className="entity-list">
          {targets.map(t => (
            <div
              className={`entity-row ${selectedTargetId === t.id ? "selected" : ""}`}
              key={t.id}
              onClick={() => dispatch(selectTarget(t.id))}
            >
              <div className="entity-symbol">✈</div>
              <div><div className="entity-name">{t.id}</div><div className="entity-type">Aircraft</div></div>
              <div className="live-badge">LIVE</div>
              <div className="eye">◉</div>
            </div>
          ))}
          {filteredEntities.map(e => (
            <div className={`entity-row ${selected === e.id ? "selected" : ""}`} key={e.id} onClick={() => dispatch(selectEntity(e.id))}>
              <div className="entity-symbol" style={{ color: e.color }}>{symbol(e.type)}</div>
              <div><div className="entity-name">{e.name}</div><div className="entity-type">{e.type} · {e.visible ? "visible" : "hidden"}</div></div>
              <button className="btn danger" onClick={(ev) => { ev.stopPropagation(); dispatch(removeEntity(e.id)); }}>מחק</button>
              <button className="btn" onClick={(ev) => { ev.stopPropagation(); dispatch(toggleVisibility(e.id)); }}>{e.visible ? "◉" : "⊘"}</button>
            </div>
          ))}
        </div>

        <div className="layers-box">
          <div className="card-name" style={{ marginBottom: 8 }}>LAYERS <span style={{ float: "right" }}>＋</span></div>
          {layerRows.map(({ key, label }) => (
            <button className="layer-row layer-button" key={key} onClick={() => dispatch(toggleLayer(key))}>
              <span className="check">{layers[key] ? "✓" : ""}</span>
              <span>{label}</span>
              <span className="switch" style={{ opacity: layers[key] ? 1 : .28 }} />
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function symbol(t: string) {
  if (t === "polygon") return "▱";
  if (t === "line") return "╱";
  if (t === "circle") return "○";
  if (t === "rectangle") return "□";
  if (t === "ellipse") return "◌";
  return "●";
}
