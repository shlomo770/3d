import * as THREE from "three";
import { MIN_VIEW_HEIGHT, MIN_VIEW_WIDTH } from "../constants";
import type { FlightChaseViewConfig } from "../types";
import { createOverlayAlignmentDebug } from "./alignmentDebugScene";

export type ChaseScene = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  aircraftHolder: THREE.Group;
  alignmentDebug: THREE.Group | null;
  setAircraft: (model: THREE.Group) => void;
  placeAircraftOnScreen: (x: number, y: number, width: number, height: number) => void;
  resize: (width: number, height: number) => void;
  render: () => void;
  dispose: () => void;
};

export function createChaseScene(
  host: HTMLElement,
  config: FlightChaseViewConfig
): ChaseScene {
  const width = Math.max(host.clientWidth, MIN_VIEW_WIDTH);
  const height = Math.max(host.clientHeight, MIN_VIEW_HEIGHT);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    config.camera.fov,
    width / height,
    0.1,
    500
  );
  camera.position.set(0, config.camera.y, config.camera.z);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 1));
  const sun = new THREE.DirectionalLight(0xffffff, 1.1);
  sun.position.set(4, 8, 6);
  scene.add(sun);

  const aircraftHolder = new THREE.Group();
  scene.add(aircraftHolder);

  const alignmentDebug = config.showAlignmentDebug ? createOverlayAlignmentDebug() : null;
  if (alignmentDebug) scene.add(alignmentDebug);

  const disposeObject3D = (root: THREE.Object3D) => {
    root.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) return;
      node.geometry.dispose();
      const material = node.material;
      if (Array.isArray(material)) material.forEach((m) => m.dispose());
      else material.dispose();
    });
  };

  return {
    scene,
    camera,
    renderer,
    aircraftHolder,
    alignmentDebug,
    setAircraft(model) {
      aircraftHolder.clear();
      aircraftHolder.add(model);
    },
    placeAircraftOnScreen(x, y, w, h) {
      aircraftHolder.position.set(x - w / 2, h / 2 - y, 0);
      camera.lookAt(aircraftHolder.position);
    },
    resize(w, h) {
      const nw = Math.max(w, MIN_VIEW_WIDTH);
      const nh = Math.max(h, MIN_VIEW_HEIGHT);
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    },
    render() {
      renderer.render(scene, camera);
    },
    dispose() {
      disposeObject3D(aircraftHolder);
      if (alignmentDebug) disposeObject3D(alignmentDebug);
      renderer.dispose();
      if (renderer.domElement.parentElement === host) {
        host.removeChild(renderer.domElement);
      }
    },
  };
}
