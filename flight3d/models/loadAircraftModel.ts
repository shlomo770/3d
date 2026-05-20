import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { FlightModelSource } from "../types";
import { buildProceduralMissileMesh } from "./proceduralMissileMesh";
import { resolveFlightModelSource } from "./registry";
import { createSimpleAircraftMesh } from "./simpleAircraftMesh";
import { createSimpleMissileMesh } from "./simpleMissileMesh";

const DEFAULT_GLB_TARGET_SIZE = 4.6;

function centerPivot(root: THREE.Object3D): void {
  const box = new THREE.Box3().setFromObject(root);
  root.position.sub(box.getCenter(new THREE.Vector3()));
}

function applyYawOffset(root: THREE.Object3D, yawOffsetDeg: number): void {
  if (yawOffsetDeg === 0) return;
  root.rotateY(THREE.MathUtils.degToRad(yawOffsetDeg));
}

async function loadGltf(
  url: string,
  scale?: number,
  yawOffsetDeg = 0
): Promise<THREE.Group> {
  const gltf = await new GLTFLoader().loadAsync(url);
  const root = new THREE.Group();
  root.name = "gltf-aircraft";

  const model = gltf.scene;
  if (scale != null) {
    model.scale.setScalar(scale);
  } else {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 0.001);
    model.scale.setScalar(DEFAULT_GLB_TARGET_SIZE / maxDim);
  }

  centerPivot(model);
  applyYawOffset(model, yawOffsetDeg);
  root.add(model);
  return root;
}

export async function loadAircraftModel(source: FlightModelSource): Promise<THREE.Group> {
  const resolved = resolveFlightModelSource(source);

  switch (resolved.kind) {
    case "builtin": {
      const mesh = (() => {
        switch (resolved.variant) {
          case "procedural":
            return buildProceduralMissileMesh();
          case "missile":
            return createSimpleMissileMesh();
          case "simple":
            return createSimpleAircraftMesh();
          default:
            return createSimpleMissileMesh();
        }
      })();
      centerPivot(mesh);
      return mesh;
    }
    case "gltf":
      return loadGltf(resolved.url, resolved.scale, resolved.yawOffsetDeg ?? 0);
    case "custom":
      return resolved.load();
    case "registry":
      return loadAircraftModel(resolved);
    default:
      return createSimpleMissileMesh();
  }
}
