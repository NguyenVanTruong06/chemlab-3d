import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { CameraMode, VesselState } from '../types/chemistry';
import { SHELF_CHEMICALS } from '../engine/ChemistryEngine';

interface VesselMeshGroup {
  id: string;
  root: THREE.Group;
  glassMesh: THREE.Mesh;
  liquidMesh: THREE.Mesh;
  meniscusMesh: THREE.Mesh;
  precipitateMesh: THREE.Mesh;
  solidMesh: THREE.Mesh;
  selectionRing: THREE.Mesh;
  labelSprite: THREE.Sprite;
  basePosition: THREE.Vector3;
   bubbles: THREE.Mesh[];
  steamPuffs: THREE.Mesh[];
  sparks: THREE.Mesh[];
}

interface PourAnimation {
  active: boolean;
  progress: number; // 0..1
  targetIndex: number;
  sourceIndex: number | null; // null means pouring from a reagent bottle
  colorHex: string;
}

export interface LabSceneCallbacks {
  onSelectVessel: (vesselId: string) => void;
  onSelectReagentFrom3D: (formula: string) => void;
  onNearWorkbenchChange: (isNear: boolean) => void;
}

export class LabScene3D {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private orbit: OrbitControls;
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private callbacks: LabSceneCallbacks;

  private vesselGroups: VesselMeshGroup[] = [];
  private clickableMeshes: Map<THREE.Object3D, { type: 'vessel' | 'reagent'; id: string }> =
    new Map();

  // Bunsen burner visuals
  private flameOuter!: THREE.Mesh;
  private flameCore!: THREE.Mesh;
  private burnerLight!: THREE.PointLight;

  // Pouring bottle & stream visuals
  private pourBottleGroup!: THREE.Group;
  private pourBottleBodyMat!: THREE.MeshPhysicalMaterial;
  private pourStreamMesh!: THREE.Mesh;
  private pourStreamMat!: THREE.MeshBasicMaterial;
  private pourAnim: PourAnimation = {
    active: false,
    progress: 0,
    targetIndex: 0,
    sourceIndex: null,
    colorHex: '#38bdf8',
  };

  // Camera & Spatial Walk State
  private cameraMode: CameraMode = 'WORKBENCH_FOCUS';
  private isTransitioningCamera = false;
  private camTransitionTargetPos = new THREE.Vector3();
  private camTransitionLookAt = new THREE.Vector3();

  private playerPos = new THREE.Vector3(0, 1.65, 3.35);
  private playerYaw = 0; // radians, 0 = looking toward -Z (towards workbench)
  private playerPitch = -0.12;
  private keysPressed: Set<string> = new Set();
  private mobileMove = { forward: 0, strafe: 0 };
  private isDraggingLook = false;
  private prevPointer = { x: 0, y: 0 };
  private pointerDownPos = { x: 0, y: 0 };
  private wasNearBench = true;

  private selectedVesselId = 'vessel-1';
  private animFrameId = 0;
  private lastTime = performance.now();

  constructor(container: HTMLElement, callbacks: LabSceneCallbacks) {
    this.container = container;
    this.callbacks = callbacks;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#dce7f2');
    this.scene.fog = new THREE.Fog('#dce7f2', 12, 26);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.08, 50);
    this.camera.position.set(0, 1.62, 2.05);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    container.appendChild(this.renderer.domElement);

    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbit.enableDamping = true;
    this.orbit.dampingFactor = 0.08;
    this.orbit.target.set(0, 1.08, 0);
    this.orbit.minDistance = 0.9;
    this.orbit.maxDistance = 9.5;
    this.orbit.maxPolarAngle = Math.PI / 2 - 0.04;

    this.setupLights();
    this.buildRoomArchitecture();
    this.buildLabFurniture();
    this.buildWorkbenchAndVessels();
    this.buildPouringProps();
    this.attachEvents();

    this.setCameraMode('WORKBENCH_FOCUS');
    this.animate();
  }

  private setupLights(): void {
    const hemi = new THREE.HemisphereLight('#f8fafc', '#cbd5e1', 0.95);
    hemi.position.set(0, 4.2, 0);
    this.scene.add(hemi);

    const sunLight = new THREE.DirectionalLight('#fffbeb', 1.35);
    sunLight.position.set(-5.5, 5.5, 3.5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(2048, 2048);
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 20;
    sunLight.shadow.camera.left = -6;
    sunLight.shadow.camera.right = 6;
    sunLight.shadow.camera.top = 6;
    sunLight.shadow.camera.bottom = -6;
    sunLight.shadow.bias = -0.0005;
    this.scene.add(sunLight);

    const benchSpot = new THREE.PointLight('#f0f9ff', 0.9, 8);
    benchSpot.position.set(0, 3.4, 0.6);
    this.scene.add(benchSpot);

    this.burnerLight = new THREE.PointLight('#38bdf8', 0, 2.4);
    this.burnerLight.position.set(0.68, 1.12, 0);
    this.scene.add(this.burnerLight);
  }

  private createTileFloorTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 0, 256, 256);

    // Subtle two-tone ceramic tiles
    ctx.fillStyle = '#edf2f7';
    ctx.fillRect(4, 4, 120, 120);
    ctx.fillRect(132, 132, 120, 120);
    ctx.fillStyle = '#e6edf5';
    ctx.fillRect(132, 4, 120, 120);
    ctx.fillRect(4, 132, 120, 120);

    // Grout lines
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, 253, 253);
    ctx.beginPath();
    ctx.moveTo(128, 0);
    ctx.lineTo(128, 256);
    ctx.moveTo(0, 128);
    ctx.lineTo(256, 128);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(10, 9);
    return tex;
  }

  private createPosterTexture(title: string, subtitle: string, type: 'periodic' | 'safety'): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 400;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 640, 400);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, 630, 390);

    ctx.fillStyle = type === 'periodic' ? '#0369a1' : '#0f766e';
    ctx.fillRect(10, 10, 620, 64);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(title, 26, 46);
    ctx.font = '15px sans-serif';
    ctx.fillStyle = '#e0f2fe';
    ctx.fillText(subtitle, 26, 66);

    if (type === 'periodic') {
      const cols = ['#ef4444', '#f59e0b', '#0ea5e9', '#10b981', '#eab308', '#14b8a6'];
      const symbols = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Fe', 'Cu', 'Zn', 'Ag', 'Ba', 'Au'];
      let idx = 0;
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 11; c++) {
          if (r === 0 && c > 0 && c < 10) continue;
          if ((r === 1 || r === 2) && c > 1 && c < 5) continue;
          const x = 28 + c * 53;
          const y = 94 + r * 56;
          ctx.fillStyle = cols[(r + c) % cols.length] + '28';
          ctx.fillRect(x, y, 48, 50);
          ctx.strokeStyle = cols[(r + c) % cols.length];
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, 48, 50);
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 17px sans-serif';
          ctx.fillText(symbols[idx % symbols.length], x + 12, y + 31);
          idx++;
        }
      }
    } else {
      const rules = [
        '1. Đọc kỹ nhãn hóa chất và nồng độ mol trước khi pha chế.',
        '2. Không đổ nước trực tiếp vào axit đặc; rót từ từ axit vào nước.',
        '3. Khi đun nóng trên đèn cồn, hướng miệng bình ra phía không có người.',
        '4. Chỉ lấy lượng rất nhỏ kim loại kiềm (Na < 0.2g) khi thử với nước.',
        '5. Quan sát kỹ màu sắc chất chỉ thị, kết tủa và bọt khí sinh ra.',
      ];
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 18px sans-serif';
      rules.forEach((line, i) => {
        ctx.fillStyle = i === 3 ? '#dc2626' : '#1e293b';
        ctx.fillText(line, 28, 125 + i * 52);
      });
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  private createTextSprite(text: string, bgHex = '#0f172a', textHex = '#f8fafc'): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 76;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = bgHex;
    ctx.beginPath();
    ctx.roundRect(8, 8, 304, 60, 14);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = textHex;
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 160, 38);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(0.62, 0.15, 1);
    return sprite;
  }

  private buildRoomArchitecture(): void {
    // Floor (12m x 10m)
    const floorGeo = new THREE.PlaneGeometry(12, 10);
    const floorMat = new THREE.MeshStandardMaterial({
      map: this.createTileFloorTexture(),
      roughness: 0.45,
      metalness: 0.05,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Ceiling
    const ceilMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 10),
      new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.9 })
    );
    ceilMesh.rotation.x = Math.PI / 2;
    ceilMesh.position.y = 4.2;
    this.scene.add(ceilMesh);

    // Ceiling LED light panels
    const ledMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    [-2.5, 2.5].forEach((x) => {
      [-1.8, 1.8].forEach((z) => {
        const panel = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.45), ledMat);
        panel.position.set(x, 4.17, z);
        this.scene.add(panel);
      });
    });

    const wallUpperMat = new THREE.MeshStandardMaterial({ color: '#f1f5f9', roughness: 0.85 });
    const wainscotMat = new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.65 });

    // Back wall (-Z = -4.6)
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(12, 4.2, 0.2), wallUpperMat);
    backWall.position.set(0, 2.1, -4.6);
    backWall.receiveShadow = true;
    this.scene.add(backWall);

    const backWainscot = new THREE.Mesh(new THREE.BoxGeometry(12, 1.15, 0.23), wainscotMat);
    backWainscot.position.set(0, 0.575, -4.6);
    this.scene.add(backWainscot);

    // Front wall (+Z = 5.0)
    const frontWall = new THREE.Mesh(new THREE.BoxGeometry(12, 4.2, 0.2), wallUpperMat);
    frontWall.position.set(0, 2.1, 5.0);
    this.scene.add(frontWall);

    // Left wall (-X = -5.8) with sunlit windows
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.2, 10), wallUpperMat);
    leftWall.position.set(-5.8, 2.1, 0);
    this.scene.add(leftWall);

    [-1.8, 1.6].forEach((zPos) => {
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 1.7, 2.3),
        new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.4 })
      );
      frame.position.set(-5.76, 2.35, zPos);
      this.scene.add(frame);

      const glass = new THREE.Mesh(
        new THREE.BoxGeometry(0.27, 1.52, 2.12),
        new THREE.MeshBasicMaterial({ color: '#bae6fd' })
      );
      glass.position.set(-5.75, 2.35, zPos);
      this.scene.add(glass);
    });

    // Right wall (+X = 5.8)
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.2, 10), wallUpperMat);
    rightWall.position.set(5.8, 2.1, 0);
    this.scene.add(rightWall);

    // Periodic Table Poster on Back Wall
    const periodicPoster = new THREE.Mesh(
      new THREE.PlaneGeometry(2.5, 1.55),
      new THREE.MeshBasicMaterial({
        map: this.createPosterTexture(
          'BẢNG TUẦN HOÀN CÁC NGUYÊN TỐ HÓA HỌC',
          'Phòng Thí Nghiệm Khoa Học Tự Nhiên — ChemLab 3D',
          'periodic'
        ),
      })
    );
    periodicPoster.position.set(0, 2.55, -4.48);
    this.scene.add(periodicPoster);

    // Safety Rules Poster on Right Wall
    const safetyPoster = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 1.4),
      new THREE.MeshBasicMaterial({
        map: this.createPosterTexture(
          'NỘI QUY AN TOÀN PHÒNG THÍ NGHIỆM',
          'Học đi đôi với Hành — Thao tác chuẩn xác & an toàn',
          'safety'
        ),
      })
    );
    safetyPoster.rotation.y = -Math.PI / 2;
    safetyPoster.position.set(5.68, 2.45, -1.2);
    this.scene.add(safetyPoster);
  }

  private buildLabFurniture(): void {
    const woodMat = new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.65 });
    const cabinetMat = new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.5 });
    const darkTopMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.35, metalness: 0.1 });
    const steelMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', roughness: 0.3, metalness: 0.7 });

    // 1. Reagent Cabinet against Back-Left Wall (-3.4, 0, -4.0)
    const shelfGroup = new THREE.Group();
    shelfGroup.position.set(-3.4, 0, -4.05);

    const shelfBack = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 0.08), cabinetMat);
    shelfBack.position.set(0, 1.2, -0.2);
    shelfBack.castShadow = true;
    shelfGroup.add(shelfBack);

    [-1.16, 1.16].forEach((sx) => {
      const side = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.4, 0.48), cabinetMat);
      side.position.set(sx, 1.2, 0);
      shelfGroup.add(side);
    });

    [0.1, 0.85, 1.45, 2.05, 2.4].forEach((sy) => {
      const plank = new THREE.Mesh(new THREE.BoxGeometry(2.36, 0.05, 0.46), woodMat);
      plank.position.set(0, sy, 0);
      plank.receiveShadow = true;
      shelfGroup.add(plank);
    });

    const shelfBanner = this.createTextSprite('TỦ HÓA CHẤT THCS (Click để chọn)', '#0369a1');
    shelfBanner.position.set(0, 2.62, 0.1);
    shelfBanner.scale.set(1.35, 0.3, 1);
    shelfGroup.add(shelfBanner);

    // Populate 3D Reagent Bottles on the cabinet shelves!
    SHELF_CHEMICALS.forEach((chem, idx) => {
      const row = Math.floor(idx / 5);
      const col = idx % 5;
      const bx = -0.88 + col * 0.44;
      const by = 2.08 - row * 0.6;

      const bottleGroup = new THREE.Group();
      bottleGroup.position.set(bx, by, 0.05);

      const bottleMat = new THREE.MeshPhysicalMaterial({
        color: chem.colorHex,
        transparent: true,
        opacity: Math.max(0.55, chem.opacity),
        roughness: 0.15,
        transmission: 0.35,
      });
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.22, 16), bottleMat);
      body.position.y = 0.11;
      body.castShadow = true;
      bottleGroup.add(body);

      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.06, 12),
        new THREE.MeshStandardMaterial({
          color: chem.isHazardous ? '#dc2626' : '#0f172a',
          roughness: 0.4,
        })
      );
      cap.position.y = 0.24;
      bottleGroup.add(cap);

      this.clickableMeshes.set(body, { type: 'reagent', id: chem.formula });
      shelfGroup.add(bottleGroup);
    });

    this.scene.add(shelfGroup);

    // 2. Fume Hood (Tủ Hút Khí Độc) at Back-Right (3.4, 0, -3.9)
    const hoodGroup = new THREE.Group();
    hoodGroup.position.set(3.4, 0, -3.95);
    const hoodBase = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.9, 0.95), cabinetMat);
    hoodBase.position.y = 0.45;
    hoodBase.castShadow = true;
    hoodGroup.add(hoodBase);

    const hoodChamber = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 1.5, 0.9),
      new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.4 })
    );
    hoodChamber.position.set(0, 1.65, -0.02);
    hoodGroup.add(hoodChamber);

    const sashGlass = new THREE.Mesh(
      new THREE.BoxGeometry(1.9, 0.95, 0.03),
      new THREE.MeshPhysicalMaterial({
        color: '#bae6fd',
        transparent: true,
        opacity: 0.32,
        roughness: 0.1,
      })
    );
    sashGlass.position.set(0, 1.55, 0.44);
    hoodGroup.add(sashGlass);

    const duct = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 1.8, 16), steelMat);
    duct.position.set(0, 3.3, -0.1);
    hoodGroup.add(duct);

    const hoodLabel = this.createTextSprite('TỦ HÚT KHÍ ĐỘC', '#0f766e');
    hoodLabel.position.set(0, 2.58, 0.48);
    hoodLabel.scale.set(0.95, 0.22, 1);
    hoodGroup.add(hoodLabel);
    this.scene.add(hoodGroup);

    // 3. Emergency Wash & Sink Station on Right Wall (5.1, 0, 1.2)
    const sinkGroup = new THREE.Group();
    sinkGroup.position.set(5.15, 0, 1.2);
    const sinkCabinet = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 1.5), cabinetMat);
    sinkCabinet.position.y = 0.45;
    sinkCabinet.castShadow = true;
    sinkGroup.add(sinkCabinet);

    const sinkCounter = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.06, 1.56), darkTopMat);
    sinkCounter.position.y = 0.93;
    sinkGroup.add(sinkCounter);

    const faucet = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.022, 10, 20, Math.PI), steelMat);
    faucet.position.set(0.1, 1.12, 0);
    faucet.rotation.y = Math.PI / 2;
    sinkGroup.add(faucet);
    this.scene.add(sinkGroup);

    // 4. Two Secondary Student Lab Tables in the room for realistic classroom depth
    [-3.1, 3.1].forEach((tx) => {
      const sideBench = new THREE.Group();
      sideBench.position.set(tx, 0, 1.8);
      const top = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.07, 1.0), darkTopMat);
      top.position.y = 0.88;
      top.castShadow = true;
      top.receiveShadow = true;
      sideBench.add(top);

      const base = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.84, 0.82), woodMat);
      base.position.y = 0.42;
      base.castShadow = true;
      sideBench.add(base);
      this.scene.add(sideBench);
    });
  }

  private buildWorkbenchAndVessels(): void {
    const darkTopMat = new THREE.MeshStandardMaterial({
      color: '#0f172a',
      roughness: 0.32,
      metalness: 0.12,
    });
    const benchBodyMat = new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      roughness: 0.5,
    });
    const woodTrimMat = new THREE.MeshStandardMaterial({
      color: '#d97706',
      roughness: 0.55,
    });
    const steelMat = new THREE.MeshStandardMaterial({
      color: '#94a3b8',
      roughness: 0.28,
      metalness: 0.78,
    });

    // Main Central Workbench at (0, 0, 0)
    const benchGroup = new THREE.Group();

    const counterTop = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 1.25), darkTopMat);
    counterTop.position.set(0, 0.92, 0);
    counterTop.castShadow = true;
    counterTop.receiveShadow = true;
    benchGroup.add(counterTop);

    const cabinet = new THREE.Mesh(new THREE.BoxGeometry(2.42, 0.88, 1.08), benchBodyMat);
    cabinet.position.set(0, 0.44, 0);
    cabinet.castShadow = true;
    cabinet.receiveShadow = true;
    benchGroup.add(cabinet);

    const trim = new THREE.Mesh(new THREE.BoxGeometry(2.46, 0.06, 1.12), woodTrimMat);
    trim.position.set(0, 0.85, 0);
    benchGroup.add(trim);

    // Tray mat on the workbench
    const tray = new THREE.Mesh(
      new THREE.BoxGeometry(1.95, 0.015, 0.72),
      new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.6 })
    );
    tray.position.set(0, 0.968, 0);
    tray.receiveShadow = true;
    benchGroup.add(tray);

    // Bunsen Burner + Tripod under Vessel 3 (x = +0.68)
    const burnerX = 0.68;
    const burnerBase = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 0.03, 24), steelMat);
    burnerBase.position.set(burnerX, 0.99, 0);
    benchGroup.add(burnerBase);

    const burnerTube = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.028, 0.14, 16), steelMat);
    burnerTube.position.set(burnerX, 1.06, 0);
    benchGroup.add(burnerTube);

    // Tripod Ring + 3 Legs
    const tripodRing = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.012, 12, 32), steelMat);
    tripodRing.rotation.x = Math.PI / 2;
    tripodRing.position.set(burnerX, 1.21, 0);
    benchGroup.add(tripodRing);

    const wireGauze = new THREE.Mesh(
      new THREE.CylinderGeometry(0.155, 0.155, 0.008, 24),
      new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.7, metalness: 0.4 })
    );
    wireGauze.position.set(burnerX, 1.218, 0);
    benchGroup.add(wireGauze);

    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3 + 0.4;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.25, 10), steelMat);
      leg.position.set(
        burnerX + Math.cos(angle) * 0.145,
        1.09,
        Math.sin(angle) * 0.145
      );
      benchGroup.add(leg);
    }

    // Dynamic Bunsen Flame
    this.flameOuter = new THREE.Mesh(
      new THREE.ConeGeometry(0.048, 0.14, 20),
      new THREE.MeshBasicMaterial({ color: '#0ea5e9', transparent: true, opacity: 0.72 })
    );
    this.flameOuter.position.set(burnerX, 1.16, 0);
    this.flameOuter.visible = false;
    benchGroup.add(this.flameOuter);

    this.flameCore = new THREE.Mesh(
      new THREE.ConeGeometry(0.024, 0.075, 16),
      new THREE.MeshBasicMaterial({ color: '#e0f2fe', transparent: true, opacity: 0.95 })
    );
    this.flameCore.position.set(burnerX, 1.14, 0);
    this.flameCore.visible = false;
    benchGroup.add(this.flameCore);

    this.scene.add(benchGroup);

    // Build the 3 Interactive Glass Vessels
    const vesselConfigs = [
      { id: 'vessel-1', label: 'Cốc A (250ml)', x: -0.68, y: 0.98, radius: 0.135, height: 0.32 },
      { id: 'vessel-2', label: 'Cốc B (250ml)', x: 0.0, y: 0.98, radius: 0.135, height: 0.32 },
      { id: 'vessel-3', label: 'Bình Nhiệt C (Đèn cồn)', x: 0.68, y: 1.225, radius: 0.125, height: 0.3 },
    ];

    vesselConfigs.forEach((cfg) => {
      const root = new THREE.Group();
      const basePos = new THREE.Vector3(cfg.x, cfg.y, 0);
      root.position.copy(basePos);

      // Outer Borosilicate Glass Cylinder (open top)
      const glassGeo = new THREE.CylinderGeometry(cfg.radius, cfg.radius, cfg.height, 36, 1, true);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: '#f8fafc',
        transparent: true,
        opacity: 0.28,
        roughness: 0.06,
        metalness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const glassMesh = new THREE.Mesh(glassGeo, glassMat);
      glassMesh.position.y = cfg.height / 2;
      root.add(glassMesh);

      // Glass bottom disc & lip rim
      const glassBottom = new THREE.Mesh(
        new THREE.CylinderGeometry(cfg.radius, cfg.radius, 0.012, 32),
        glassMat
      );
      glassBottom.position.y = 0.006;
      root.add(glassBottom);

      const glassRim = new THREE.Mesh(
        new THREE.TorusGeometry(cfg.radius, 0.007, 10, 36),
        new THREE.MeshPhysicalMaterial({
          color: '#e2e8f0',
          transparent: true,
          opacity: 0.55,
          roughness: 0.1,
        })
      );
      glassRim.rotation.x = Math.PI / 2;
      glassRim.position.y = cfg.height;
      root.add(glassRim);

      // Graduation tick lines on the front of the beaker
      for (let t = 1; t <= 4; t++) {
        const tick = new THREE.Mesh(
          new THREE.BoxGeometry(0.045, 0.004, 0.004),
          new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.7 })
        );
        tick.position.set(0, (cfg.height * t) / 5, cfg.radius + 0.002);
        root.add(tick);
      }

      // Inner Liquid Cylinder
      const liquidGeo = new THREE.CylinderGeometry(
        cfg.radius * 0.93,
        cfg.radius * 0.93,
        1.0,
        32
      );
      const liquidMat = new THREE.MeshPhysicalMaterial({
        color: '#dbeafe',
        transparent: true,
        opacity: 0.3,
        roughness: 0.12,
        clearcoat: 0.6,
      });
      const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
      liquidMesh.visible = false;
      root.add(liquidMesh);

      // Liquid Meniscus Top
      const meniscusMesh = new THREE.Mesh(
        new THREE.CircleGeometry(cfg.radius * 0.93, 32),
        new THREE.MeshBasicMaterial({
          color: '#e0f2fe',
          transparent: true,
          opacity: 0.55,
          side: THREE.DoubleSide,
        })
      );
      meniscusMesh.rotation.x = -Math.PI / 2;
      meniscusMesh.visible = false;
      root.add(meniscusMesh);

      // Settled Precipitate Layer at Bottom
      const precipitateMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(cfg.radius * 0.91, cfg.radius * 0.91, 1.0, 28),
        new THREE.MeshStandardMaterial({
          color: '#ffffff',
          roughness: 0.85,
          transparent: true,
          opacity: 0.95,
        })
      );
      precipitateMesh.visible = false;
      root.add(precipitateMesh);

      // Solid Reactant Chunk (Al, Na, CaCO3, KMnO4)
      const solidMesh = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.036, 1),
        new THREE.MeshStandardMaterial({
          color: '#cbd5e1',
          roughness: 0.35,
          metalness: 0.45,
        })
      );
      solidMesh.position.set(0, 0.035, 0);
      solidMesh.visible = false;
      root.add(solidMesh);

      // Active Selection Ring around Base
      const selectionRing = new THREE.Mesh(
        new THREE.RingGeometry(cfg.radius + 0.022, cfg.radius + 0.048, 36),
        new THREE.MeshBasicMaterial({
          color: '#0ea5e9',
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9,
        })
      );
      selectionRing.rotation.x = -Math.PI / 2;
      selectionRing.position.y = 0.003;
      selectionRing.visible = cfg.id === this.selectedVesselId;
      root.add(selectionRing);

      // Floating Label Sprite
      const labelSprite = this.createTextSprite(cfg.label);
      labelSprite.position.set(0, cfg.height + 0.13, 0);
      root.add(labelSprite);

      // Hitbox for easy clicking/tapping on desktop & mobile
      const hitBox = new THREE.Mesh(
        new THREE.CylinderGeometry(cfg.radius * 1.35, cfg.radius * 1.35, cfg.height * 1.25, 16),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitBox.position.y = cfg.height / 2;
      root.add(hitBox);
      this.clickableMeshes.set(hitBox, { type: 'vessel', id: cfg.id });

      // Pre-allocate gas bubbles, steam puffs, and alkali sparks
      const bubbles: THREE.Mesh[] = [];
      const bubbleMat = new THREE.MeshBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.75,
      });
      for (let b = 0; b < 22; b++) {
        const bm = new THREE.Mesh(new THREE.SphereGeometry(0.007, 8, 8), bubbleMat);
        bm.visible = false;
        bm.userData = {
          rx: (Math.random() - 0.5) * cfg.radius * 1.3,
          rz: (Math.random() - 0.5) * cfg.radius * 1.3,
          phase: Math.random(),
          speed: 0.6 + Math.random() * 0.9,
        };
        root.add(bm);
        bubbles.push(bm);
      }

      const steamPuffs: THREE.Mesh[] = [];
      for (let s = 0; s < 10; s++) {
        const sm = new THREE.Mesh(
          new THREE.SphereGeometry(0.028, 10, 10),
          new THREE.MeshBasicMaterial({ color: '#f1f5f9', transparent: true, opacity: 0.25 })
        );
        sm.visible = false;
        sm.userData = {
          phase: s / 10,
          driftX: (Math.random() - 0.5) * 0.08,
        };
        root.add(sm);
        steamPuffs.push(sm);
      }

      const sparks: THREE.Mesh[] = [];
      for (let k = 0; k < 14; k++) {
        const sp = new THREE.Mesh(
          new THREE.SphereGeometry(0.01, 6, 6),
          new THREE.MeshBasicMaterial({ color: '#f59e0b' })
        );
        sp.visible = false;
        sp.userData = {
          angle: (k / 14) * Math.PI * 2,
          phase: Math.random(),
        };
        root.add(sp);
        sparks.push(sp);
      }

      this.scene.add(root);
      this.vesselGroups.push({
        id: cfg.id,
        root,
        glassMesh,
        liquidMesh,
        meniscusMesh,
        precipitateMesh,
        solidMesh,
        selectionRing,
        labelSprite,
        basePosition: basePos,
        bubbles,
        steamPuffs,
        sparks,
      });
    });
  }

  private buildPouringProps(): void {
    this.pourBottleGroup = new THREE.Group();
    this.pourBottleBodyMat = new THREE.MeshPhysicalMaterial({
      color: '#38bdf8',
      transparent: true,
      opacity: 0.72,
      roughness: 0.15,
    });
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.065, 0.18, 20),
      this.pourBottleBodyMat
    );
    this.pourBottleGroup.add(body);

    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.032, 0.06, 16),
      this.pourBottleBodyMat
    );
    neck.position.y = 0.11;
    this.pourBottleGroup.add(neck);
    this.pourBottleGroup.visible = false;
    this.scene.add(this.pourBottleGroup);

    this.pourStreamMat = new THREE.MeshBasicMaterial({
      color: '#38bdf8',
      transparent: true,
      opacity: 0.75,
    });
    this.pourStreamMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.012, 0.26, 12),
      this.pourStreamMat
    );
    this.pourStreamMesh.visible = false;
    this.scene.add(this.pourStreamMesh);
  }

  public triggerPourAnimation(
    targetVesselId: string,
    colorHex: string,
    sourceVesselId?: string
  ): void {
    const targetIdx = this.vesselGroups.findIndex((v) => v.id === targetVesselId);
    if (targetIdx === -1) return;
    const srcIdx = sourceVesselId
      ? this.vesselGroups.findIndex((v) => v.id === sourceVesselId)
      : -1;

    this.pourAnim = {
      active: true,
      progress: 0,
      targetIndex: targetIdx,
      sourceIndex: srcIdx >= 0 ? srcIdx : null,
      colorHex,
    };
  }

  public setSelectedVessel(vesselId: string): void {
    this.selectedVesselId = vesselId;
    this.vesselGroups.forEach((vg) => {
      vg.selectionRing.visible = vg.id === vesselId;
    });
  }

  public setCameraMode(mode: CameraMode): void {
    this.cameraMode = mode;
    if (mode === 'WORKBENCH_FOCUS') {
      this.orbit.enabled = true;
      this.camTransitionTargetPos.set(0, 1.56, 1.92);
      this.camTransitionLookAt.set(0, 1.12, 0);
      this.isTransitioningCamera = true;
    } else if (mode === 'ORBIT_OVERVIEW') {
      this.orbit.enabled = true;
      this.camTransitionTargetPos.set(4.1, 3.25, 4.35);
      this.camTransitionLookAt.set(0, 1.1, -0.6);
      this.isTransitioningCamera = true;
    } else {
      // ROOM_WALK Spatial Mode
      this.orbit.enabled = false;
      this.isTransitioningCamera = false;
      this.camera.position.copy(this.playerPos);
      this.updateWalkCameraRotation();
    }
  }

  public setMobileMove(forward: number, strafe: number): void {
    this.mobileMove = { forward, strafe };
  }

  private updateWalkCameraRotation(): void {
    const euler = new THREE.Euler(this.playerPitch, this.playerYaw, 0, 'YXZ');
    this.camera.quaternion.setFromEuler(euler);
  }

  public syncVessels(vessels: VesselState[]): void {
    vessels.forEach((vState) => {
      const vg = this.vesselGroups.find((g) => g.id === vState.id);
      if (!vg) return;

      const maxH = vState.id === 'vessel-3' ? 0.27 : 0.29;
      const vis = vState.visual;

      // Update Liquid Cylinder & Meniscus
      if (vis.fillRatio > 0.008) {
        const liqH = Math.max(0.018, vis.fillRatio * maxH);
        vg.liquidMesh.visible = true;
        vg.liquidMesh.scale.set(1, liqH, 1);
        vg.liquidMesh.position.y = 0.012 + liqH / 2;
        const liqMat = vg.liquidMesh.material as THREE.MeshPhysicalMaterial;
        liqMat.color.set(vis.liquidColorHex);
        liqMat.opacity = vis.liquidOpacity;

        vg.meniscusMesh.visible = true;
        vg.meniscusMesh.position.y = 0.012 + liqH;
        (vg.meniscusMesh.material as THREE.MeshBasicMaterial).color.set(vis.liquidColorHex);
      } else {
        vg.liquidMesh.visible = false;
        vg.meniscusMesh.visible = false;
      }

      // Update Precipitate Layer
      if (vis.precipitateHeightRatio > 0.002) {
        const pptH = vis.precipitateHeightRatio * maxH;
        vg.precipitateMesh.visible = true;
        vg.precipitateMesh.scale.set(1, pptH, 1);
        vg.precipitateMesh.position.y = 0.012 + pptH / 2;
        (vg.precipitateMesh.material as THREE.MeshStandardMaterial).color.set(
          vis.precipitateColorHex
        );
      } else {
        vg.precipitateMesh.visible = false;
      }

      // Update Solid Reactant Chunk
      if (vis.solidChunkColorHex && vis.solidChunkScale > 0.02) {
        vg.solidMesh.visible = true;
        vg.solidMesh.scale.setScalar(vis.solidChunkScale);
        (vg.solidMesh.material as THREE.MeshStandardMaterial).color.set(vis.solidChunkColorHex);
        // Sodium floats & skitters on the liquid surface!
        if (vis.isSparking && vis.fillRatio > 0.02) {
          const surfaceY = 0.012 + vis.fillRatio * maxH;
          const t = performance.now() * 0.012;
          vg.solidMesh.position.set(
            Math.sin(t) * 0.055,
            surfaceY,
            Math.cos(t * 1.3) * 0.055
          );
        } else {
          vg.solidMesh.position.set(0, 0.032, 0);
        }
      } else {
        vg.solidMesh.visible = false;
      }

      // Bunsen Burner Flame for heatable vessel
      if (vState.isHeatable) {
        this.flameOuter.visible = vState.burnerOn;
        this.flameCore.visible = vState.burnerOn;
        this.burnerLight.intensity = vState.burnerOn ? 0.6 + vState.burnerLevel * 0.45 : 0;
        const fScale = 0.75 + vState.burnerLevel * 0.25;
        this.flameOuter.scale.set(fScale, fScale, fScale);
        this.flameCore.scale.set(fScale, fScale, fScale);
      }

      vg.root.userData.bubbleRate = vis.bubbleRate;
      vg.root.userData.steamRate = vis.steamRate;
      vg.root.userData.fillRatio = vis.fillRatio;
      vg.root.userData.isSparking = vis.isSparking;
      vg.root.userData.maxH = maxH;
    });
  }

  private attachEvents(): void {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);

    const dom = this.renderer.domElement;
    dom.addEventListener('pointerdown', this.handlePointerDown);
    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', this.handlePointerUp);
  }

  private handleResize = (): void => {
    if (!this.container) return;
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private handleKeyDown = (e: KeyboardEvent): void => {
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    this.keysPressed.add(e.code);
  };

  private handleKeyUp = (e: KeyboardEvent): void => {
    this.keysPressed.delete(e.code);
  };

  private handlePointerDown = (e: PointerEvent): void => {
    this.pointerDownPos = { x: e.clientX, y: e.clientY };
    if (this.cameraMode === 'ROOM_WALK') {
      this.isDraggingLook = true;
      this.prevPointer = { x: e.clientX, y: e.clientY };
    }
  };

  private handlePointerMove = (e: PointerEvent): void => {
    if (this.cameraMode === 'ROOM_WALK' && this.isDraggingLook) {
      const dx = e.clientX - this.prevPointer.x;
      const dy = e.clientY - this.prevPointer.y;
      this.prevPointer = { x: e.clientX, y: e.clientY };
      this.playerYaw -= dx * 0.0042;
      this.playerPitch = Math.max(
        -1.15,
        Math.min(1.05, this.playerPitch - dy * 0.0038)
      );
      this.updateWalkCameraRotation();
    }
  };

  private handlePointerUp = (e: PointerEvent): void => {
    this.isDraggingLook = false;
    const distMoved = Math.hypot(
      e.clientX - this.pointerDownPos.x,
      e.clientY - this.pointerDownPos.y
    );
    if (distMoved > 6) return; // Was a camera drag, not a click

    const rect = this.renderer.domElement.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      return;
    }

    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const candidates = Array.from(this.clickableMeshes.keys());
    const hits = this.raycaster.intersectObjects(candidates, false);
    if (hits.length > 0) {
      const info = this.clickableMeshes.get(hits[0].object);
      if (info?.type === 'vessel') {
        this.setSelectedVessel(info.id);
        this.callbacks.onSelectVessel(info.id);
      } else if (info?.type === 'reagent') {
        this.callbacks.onSelectReagentFrom3D(info.id);
      }
    }
  };

  private updateParticlesAndProps(dt: number, nowSec: number): void {
    // Flicker Bunsen flame
    if (this.flameOuter.visible) {
      const flicker = 1 + Math.sin(nowSec * 28) * 0.07 + Math.cos(nowSec * 43) * 0.04;
      this.flameOuter.scale.y *= flicker;
      this.flameOuter.scale.y = Math.min(1.6, Math.max(0.7, this.flameOuter.scale.y));
    }

    // Update Pouring Animation
    if (this.pourAnim.active) {
      this.pourAnim.progress += dt * 1.45;
      const p = this.pourAnim.progress;
      const targetVg = this.vesselGroups[this.pourAnim.targetIndex];

      if (p >= 1.0) {
        this.pourAnim.active = false;
        this.pourBottleGroup.visible = false;
        this.pourStreamMesh.visible = false;
        this.vesselGroups.forEach((vg) => {
          vg.root.position.copy(vg.basePosition);
          vg.root.rotation.set(0, 0, 0);
        });
      } else if (targetVg) {
        const tx = targetVg.basePosition.x;
        const ty = targetVg.basePosition.y;

        if (this.pourAnim.sourceIndex !== null) {
          // Vessel-to-Vessel pouring!
          const srcVg = this.vesselGroups[this.pourAnim.sourceIndex];
          const arc = Math.sin(p * Math.PI);
          srcVg.root.position.set(
            THREE.MathUtils.lerp(srcVg.basePosition.x, tx - 0.17, arc),
            THREE.MathUtils.lerp(srcVg.basePosition.y, ty + 0.34, arc),
            0
          );
          srcVg.root.rotation.z = -arc * 1.05;
          this.pourBottleGroup.visible = false;
        } else {
          // Pouring from Reagent Bottle
          this.pourBottleGroup.visible = true;
          this.pourBottleBodyMat.color.set(this.pourAnim.colorHex);
          const arc = Math.sin(p * Math.PI);
          this.pourBottleGroup.position.set(tx + 0.16, ty + 0.42, 0);
          this.pourBottleGroup.rotation.z = arc * 1.15;
        }

        // Liquid stream visible in middle of pour
        if (p > 0.2 && p < 0.85) {
          this.pourStreamMesh.visible = true;
          this.pourStreamMat.color.set(this.pourAnim.colorHex);
          this.pourStreamMesh.position.set(tx, ty + 0.24, 0);
        } else {
          this.pourStreamMesh.visible = false;
        }
      }
    }

    // Update bubbles, steam, sparks per vessel
    this.vesselGroups.forEach((vg) => {
      const bubbleRate = vg.root.userData.bubbleRate || 0;
      const steamRate = vg.root.userData.steamRate || 0;
      const fillRatio = vg.root.userData.fillRatio || 0;
      const isSparking = vg.root.userData.isSparking || false;
      const maxH = vg.root.userData.maxH || 0.28;
      const liqHeight = Math.max(0.03, fillRatio * maxH);

      const activeBubbleCount = Math.floor(bubbleRate * vg.bubbles.length);
      vg.bubbles.forEach((bm, idx) => {
        if (idx < activeBubbleCount && fillRatio > 0.02) {
          bm.visible = true;
          bm.userData.phase = (bm.userData.phase + dt * bm.userData.speed) % 1;
          bm.position.set(
            bm.userData.rx,
            0.018 + bm.userData.phase * (liqHeight - 0.015),
            bm.userData.rz
          );
        } else {
          bm.visible = false;
        }
      });

      const activeSteamCount = Math.floor(steamRate * vg.steamPuffs.length);
      vg.steamPuffs.forEach((sm, idx) => {
        if (idx < activeSteamCount) {
          sm.visible = true;
          sm.userData.phase = (sm.userData.phase + dt * 0.55) % 1;
          const p = sm.userData.phase;
          sm.position.set(
            sm.userData.driftX * p * 3,
            maxH + 0.02 + p * 0.28,
            0
          );
          sm.scale.setScalar(0.6 + p * 1.3);
          (sm.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.32;
        } else {
          sm.visible = false;
        }
      });

      vg.sparks.forEach((sp) => {
        if (isSparking && fillRatio > 0.02) {
          sp.visible = true;
          sp.userData.phase = (sp.userData.phase + dt * 2.6) % 1;
          const p = sp.userData.phase;
          const r = 0.02 + p * 0.14;
          sp.position.set(
            Math.cos(sp.userData.angle + nowSec * 4) * r,
            0.02 + liqHeight + Math.sin(p * Math.PI) * 0.16,
            Math.sin(sp.userData.angle + nowSec * 4) * r
          );
        } else {
          sp.visible = false;
        }
      });
    });
  }

  private updateSpatialWalk(dt: number): void {
    if (this.cameraMode !== 'ROOM_WALK') return;

    let moveForward = this.mobileMove.forward;
    let moveStrafe = this.mobileMove.strafe;

    if (this.keysPressed.has('KeyW') || this.keysPressed.has('ArrowUp')) moveForward += 1;
    if (this.keysPressed.has('KeyS') || this.keysPressed.has('ArrowDown')) moveForward -= 1;
    if (this.keysPressed.has('KeyA') || this.keysPressed.has('ArrowLeft')) moveStrafe -= 1;
    if (this.keysPressed.has('KeyD') || this.keysPressed.has('ArrowRight')) moveStrafe += 1;

    if (Math.abs(moveForward) > 0.01 || Math.abs(moveStrafe) > 0.01) {
      const speed = 2.85 * dt;
      const forwardDir = new THREE.Vector3(-Math.sin(this.playerYaw), 0, -Math.cos(this.playerYaw));
      const rightDir = new THREE.Vector3(Math.cos(this.playerYaw), 0, -Math.sin(this.playerYaw));

      const nextPos = this.playerPos
        .clone()
        .addScaledVector(forwardDir, moveForward * speed)
        .addScaledVector(rightDir, moveStrafe * speed);

      // Room walls collision clamp
      nextPos.x = Math.max(-5.1, Math.min(5.1, nextPos.x));
      nextPos.z = Math.max(-3.55, Math.min(4.4, nextPos.z));

      // Central workbench collision box (-1.55..1.55, -0.85..0.85)
      if (Math.abs(nextPos.x) < 1.58 && Math.abs(nextPos.z) < 0.92) {
        if (Math.abs(this.playerPos.z) >= 0.92) {
          nextPos.z = Math.sign(this.playerPos.z) * 0.92;
        } else {
          nextPos.x = Math.sign(this.playerPos.x) * 1.58;
        }
      }

      this.playerPos.copy(nextPos);
      this.camera.position.copy(this.playerPos);
    }

    const distToBench = Math.hypot(this.playerPos.x, this.playerPos.z);
    const isNear = distToBench < 2.85;
    if (isNear !== this.wasNearBench) {
      this.wasNearBench = isNear;
      this.callbacks.onNearWorkbenchChange(isNear);
    }
  }

  private animate = (): void => {
    this.animFrameId = requestAnimationFrame(this.animate);
    const now = performance.now();
    const dt = Math.min(0.08, (now - this.lastTime) / 1000);
    this.lastTime = now;

    if (this.cameraMode !== 'ROOM_WALK') {
      if (this.isTransitioningCamera) {
        this.camera.position.lerp(this.camTransitionTargetPos, 0.1);
        this.orbit.target.lerp(this.camTransitionLookAt, 0.1);
        if (this.camera.position.distanceTo(this.camTransitionTargetPos) < 0.03) {
          this.isTransitioningCamera = false;
        }
      }
      this.orbit.update();
    } else {
      this.updateSpatialWalk(dt);
    }

    this.updateParticlesAndProps(dt, now / 1000);
    this.renderer.render(this.scene, this.camera);
  };

  public dispose(): void {
    cancelAnimationFrame(this.animFrameId);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    this.renderer.domElement.removeEventListener('pointerdown', this.handlePointerDown);
    this.orbit.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
