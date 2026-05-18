import * as THREE from "three";
import type { Target } from "../../domain/models";

export class FlightScene3D {
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(42, 1, 0.1, 5000);
  private renderer: THREE.WebGLRenderer;
  private aircraft: THREE.Group;
  private trail: THREE.Line | null = null;
  private disposed = false;

  constructor(private container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);
    this.renderer.domElement.className = "flight-three";

    this.camera.position.set(0, 8.5, 18);
    this.camera.lookAt(0, 0, 0);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x334155, 1.5);
    this.scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffffff, 2.2);
    sun.position.set(-8, 10, 12);
    this.scene.add(sun);

    this.aircraft = this.createAircraft();
    this.scene.add(this.aircraft);

    this.resize();
    this.animate = this.animate.bind(this);
    this.animate();
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    this.renderer.setSize(rect.width, rect.height);
    this.camera.aspect = Math.max(1, rect.width) / Math.max(1, rect.height);
    this.camera.updateProjectionMatrix();
  }

  update(target: Target) {
    const heading = THREE.MathUtils.degToRad(target.headingDeg);
    const pitch = THREE.MathUtils.degToRad(target.pitchDeg);
    const roll = THREE.MathUtils.degToRad(target.rollDeg);

    this.aircraft.rotation.set(pitch, roll, -heading, "XYZ");
    this.aircraft.position.set(0, -0.1 + Math.sin(Date.now() / 500) * 0.05, 0);

    const pts = target.trail.slice(-18).map((_, i, arr) => {
      const x = (i - arr.length + 1) * -0.55;
      const y = 0.04 * Math.sin(i);
      const z = 3.5 + (arr.length - i) * 0.35;
      return new THREE.Vector3(x, y, z);
    });
    if (pts.length > 1) {
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      if (this.trail) {
        this.trail.geometry.dispose();
        this.trail.geometry = geo;
      } else {
        this.trail = new THREE.Line(
          geo,
          new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.9 })
        );
        this.scene.add(this.trail);
      }
    }
  }

  dispose() {
    this.disposed = true;
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  private animate() {
    if (this.disposed) return;
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  }

  private createAircraft() {
    const root = new THREE.Group();

    const metal = new THREE.MeshStandardMaterial({
      color: 0xb7c7d8,
      metalness: 0.72,
      roughness: 0.26
    });
    const dark = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.7,
      roughness: 0.32
    });
    const glass = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.35,
      metalness: 0.1,
      roughness: 0.06
    });

    const bodyGeo = new THREE.CapsuleGeometry(0.38, 3.2, 10, 28);
    const body = new THREE.Mesh(bodyGeo, metal);
    body.rotation.x = Math.PI / 2;
    body.scale.set(0.9, 1.35, 0.78);
    root.add(body);

    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.38, 1.15, 32), metal);
    nose.position.z = -2.35;
    nose.rotation.x = -Math.PI;
    root.add(nose);

    const wingShape = new THREE.Shape();
    wingShape.moveTo(-3.4, 0);
    wingShape.lineTo(-0.42, -0.72);
    wingShape.lineTo(0.42, -0.72);
    wingShape.lineTo(3.4, 0);
    wingShape.lineTo(2.8, 0.34);
    wingShape.lineTo(0, 0.12);
    wingShape.lineTo(-2.8, 0.34);
    wingShape.closePath();
    const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: .08, bevelEnabled: true, bevelThickness: .03, bevelSize: .03 });
    const wing = new THREE.Mesh(wingGeo, metal);
    wing.rotation.x = Math.PI / 2;
    wing.position.z = -0.35;
    root.add(wing);

    const tail = wing.clone();
    tail.scale.set(.42, .42, .42);
    tail.position.z = 1.55;
    root.add(tail);

    const fin = new THREE.Mesh(new THREE.BoxGeometry(.12, .85, .8), dark);
    fin.position.set(0, .55, 1.75);
    fin.rotation.x = .35;
    root.add(fin);

    const canopy = new THREE.Mesh(new THREE.SphereGeometry(.34, 24, 12), glass);
    canopy.position.set(0, .33, -1.1);
    canopy.scale.set(.8, .34, 1.35);
    root.add(canopy);

    const engine = new THREE.Mesh(new THREE.CylinderGeometry(.32, .42, .55, 24), dark);
    engine.rotation.x = Math.PI / 2;
    engine.position.z = 2.35;
    root.add(engine);

    const flame = new THREE.Mesh(
      new THREE.ConeGeometry(.26, 1.05, 20),
      new THREE.MeshBasicMaterial({ color: 0xff9f1c, transparent: true, opacity: .84 })
    );
    flame.rotation.x = Math.PI;
    flame.position.z = 2.95;
    root.add(flame);

    const glow = new THREE.PointLight(0xff9f1c, 1.6, 12);
    glow.position.z = 3.0;
    root.add(glow);

    root.scale.setScalar(1.45);
    root.rotation.y = Math.PI;
    root.position.set(0, 0, 0);
    return root;
  }
}
