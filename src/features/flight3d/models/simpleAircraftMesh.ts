import * as THREE from "three";

/** מודל ברירת מחדל — תמיד נראה; אף לאורך +Z */
export function createSimpleAircraftMesh(): THREE.Group {
  const root = new THREE.Group();
  root.name = "simple-aircraft";

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 3),
    new THREE.MeshStandardMaterial({
      color: 0x22ff66,
      emissive: 0x0a4420,
      emissiveIntensity: 0.5,
      metalness: 0.15,
      roughness: 0.45,
    })
  );
  body.position.z = 0.5;
  root.add(body);

  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(0.28, 0.7, 12),
    new THREE.MeshStandardMaterial({ color: 0xffee44, emissive: 0x443300 })
  );
  nose.rotation.x = Math.PI / 2;
  nose.position.z = 2.2;
  root.add(nose);

  const wing = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.08, 0.7),
    new THREE.MeshStandardMaterial({ color: 0x44aaff })
  );
  root.add(wing);

  return root;
}
