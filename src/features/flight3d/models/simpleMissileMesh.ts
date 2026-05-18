import * as THREE from "three";

/** צבע טיל אחיד — אפור־כסף צבאי */
const MISSILE_COLOR = 0xb8bec8;

function missileMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: MISSILE_COLOR,
    metalness: 0.4,
    roughness: 0.45,
  });
}

/**
 * טיל פרוצדורלי פשוט — חומר אחיד. כיוון אף לאורך +Z (סיבוב ב-aircraftAttitude).
 */
export function createSimpleMissileMesh(): THREE.Group {
  const root = new THREE.Group();
  root.name = "simple-missile";
  const mat = missileMaterial();

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 2.6, 20), mat);
  body.rotation.x = Math.PI / 2;
  body.position.z = 0;
  root.add(body);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.55, 20), mat);
  nose.rotation.x = Math.PI / 2;
  nose.position.z = 1.55;
  root.add(nose);

  const finGeo = new THREE.BoxGeometry(0.06, 0.55, 0.35);
  const finAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
  for (const angle of finAngles) {
    const fin = new THREE.Mesh(finGeo, mat);
    fin.position.set(Math.sin(angle) * 0.22, Math.cos(angle) * 0.22, -1.15);
    fin.rotation.z = angle;
    root.add(fin);
  }

  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.2, 16), mat);
  nozzle.rotation.x = Math.PI / 2;
  nozzle.position.z = -1.35;
  root.add(nozzle);

  root.scale.setScalar(1.3);
  return root;
}
