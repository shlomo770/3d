import * as THREE from "three";

/** נקודה במרכז המסך + חץ כיוון אף המודל (מרחב overlay) */
export function createOverlayAlignmentDebug(): THREE.Group {
  const root = new THREE.Group();
  root.name = "alignment-debug";

  const anchor = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xff00ff, depthTest: false })
  );
  anchor.renderOrder = 999;
  root.add(anchor);

  const noseArrow = new THREE.ArrowHelper(
    new THREE.Vector3(0, 0, -1),
    new THREE.Vector3(0, 0, 0),
    2.8,
    0x00ffff,
    0.35,
    0.22
  );
  noseArrow.line.renderOrder = 998;
  noseArrow.cone.renderOrder = 998;
  root.add(noseArrow);

  return root;
}
