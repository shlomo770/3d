import * as THREE from "three";

function hullMat(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: 0xc5d0dc,
    metalness: 0.55,
    roughness: 0.38,
  });
}

function accentMat(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: 0xe86a1a,
    metalness: 0.35,
    roughness: 0.5,
    emissive: 0x2a1200,
    emissiveIntensity: 0.2,
  });
}

function darkMat(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: 0x3a4d62,
    metalness: 0.45,
    roughness: 0.55,
  });
}

/** מודל פרוצדורלי — אופקי לאורך +X (אף מחודד) */
export function buildProceduralMissileMesh(): THREE.Group {
  const root = new THREE.Group();
  root.name = "procedural-missile";
  const hull = hullMat();
  const accent = accentMat();
  const dark = darkMat();

  const profile: THREE.Vector2[] = [];
  const segments = 28;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const axial = -1.55 + t * 3.1;
    const radius =
      0.05 +
      0.16 * Math.pow(Math.sin(t * Math.PI), 0.9) * (1 - 0.15 * Math.abs(t - 0.55));
    profile.push(new THREE.Vector2(radius, axial));
  }

  const fuselage = new THREE.Mesh(new THREE.LatheGeometry(profile, 36), hull);
  fuselage.rotation.x = Math.PI / 2;
  root.add(fuselage);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.55, 20), hull);
  nose.rotation.z = -Math.PI / 2;
  nose.position.x = 1.82;
  root.add(nose);

  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.14, 20), accent);
  band.rotation.z = Math.PI / 2;
  band.position.x = 0.35;
  root.add(band);

  const wingGeo = new THREE.BoxGeometry(0.52, 0.07, 1.75);
  [-1, 1].forEach((side) => {
    const wing = new THREE.Mesh(wingGeo, dark);
    wing.position.set(0.02, 0.02 * side, side * 0.78);
    root.add(wing);
  });

  const hStab = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.05, 0.38), dark);
  hStab.position.set(-1.28, 0, 0);
  root.add(hStab);

  const vStabGeo = new THREE.BoxGeometry(0.32, 0.52, 0.06);
  [-1, 1].forEach((side) => {
    const stab = new THREE.Mesh(vStabGeo, dark);
    stab.position.set(-1.35, side * 0.22, 0);
    root.add(stab);
  });

  const exhaust = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.12, 0.22, 14),
    new THREE.MeshStandardMaterial({
      color: 0x667788,
      emissive: 0x3399ff,
      emissiveIntensity: 0.45,
      metalness: 0.2,
      roughness: 0.4,
    })
  );
  exhaust.rotation.z = Math.PI / 2;
  exhaust.position.x = -1.68;
  root.add(exhaust);

  root.scale.setScalar(1.05);
  return root;
}
