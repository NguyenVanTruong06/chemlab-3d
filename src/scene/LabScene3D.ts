import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { CameraMode, HotbarItem, StationId, VesselState } from '../types/chemistry';
import { SHELF_CHEMICALS } from '../engine/ChemistryEngine';

interface VesselMeshGroup {
  id: string;
  root: THREE.Group;
  intactGroup: THREE.Group;
  brokenGroup: THREE.Group;
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
  progress: number;
  targetIndex: number;
  sourceIndex: number | null;
  colorHex: string;
}

interface AutoWalkTarget {
  pos: THREE.Vector3;
  yaw: number;
  station: StationId;
}

export interface LabSceneCallbacks {
  onSelectVessel: (vesselId: string) => void;
  onStationProximityChange: (station: StationId, distanceToFire: number) => void;
  onInteractStation3D: (station: StationId, reagentFormula?: string) => void;
}

const STATION_WAYPOINTS: Record<Exclude<StationId, null>, { pos: [number, number, number]; yaw: number }> = {
  WORKBENCH: { pos: [0, 1.65, 2.05], yaw: 0 },
  REAGENT_CABINET: { pos: [-3.35, 1.65, -2.25], yaw: 0 },
  SINK: { pos: [3.65, 1.65, 1.2], yaw: -Math.PI / 2 },
  EXTINGUISHER_MOUNT: { pos: [3.85, 1.65, -2.0], yaw: -Math.PI / 2 },
};

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
  private clickableMeshes: Map<
    THREE.Object3D,
    { type: 'vessel' | 'station' | 'reagent'; id: string; station?: StationId }
  > = new Map();

  // Bunsen burner
  private flameOuter!: THREE.Mesh;
  private flameCore!: THREE.Mesh;
  private burnerLight!: THREE.PointLight;

  // Wall Fire Extinguisher & First-Person Held Props
  private wallExtinguisherCylinder!: THREE.Group;
  private extinguisherBeaconLight!: THREE.PointLight;
  private handGroup!: THREE.Group;
  private handBottleGroup!: THREE.Group;
  private handBottleMat!: THREE.MeshPhysicalMaterial;
  private handExtinguisherGroup!: THREE.Group;
  private sprayParticles: THREE.Mesh[] = [];
  private isSpraying = false;

  // Workbench Fire & Explosion FX
  private fireGroup!: THREE.Group;
  private fireTongues: THREE.Mesh[] = [];
  private smokeBillows: THREE.Mesh[] = [];
  private emergencyStrobeLight!: THREE.PointLight;
  private explosionDebris: THREE.Mesh[] = [];
  private explosionActiveTime = 0;
  private fireIntensity = 0; // 0..100
  private cameraShake = 0;

  // Pouring props
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

  // Spatial Walk & Camera State
  private cameraMode: CameraMode = 'ROOM_WALK';
  private isTransitioningCamera = false;
  private camTransitionTargetPos = new THREE.Vector3();
  private camTransitionLookAt = new THREE.Vector3();

  private playerPos = new THREE.Vector3(0, 1.65, 2.55);
  private playerYaw = 0;
  private playerPitch = -0.14;
  private autoWalkTarget: AutoWalkTarget | null = null;
  private keysPressed: Set<string> = new Set();
  private mobileMove = { forward: 0, strafe: 0 };
  private isDraggingLook = false;
  private prevPointer = { x: 0, y: 0 };
  private pointerDownPos = { x: 0, y: 0 };
  private lastStation: StationId = 'WORKBENCH';
  private lastReportedFireDist = -1;

  private selectedVesselId = 'vessel-1';
  private animFrameId = 0;
  private lastTime = performance.now();

  constructor(container: HTMLElement, callbacks: LabSceneCallbacks) {
    this.container = container;
    this.callbacks = callbacks;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#dce7f2');
    this.scene.fog = new THREE.Fog('#dce7f2', 11, 25);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(56, width / height, 0.06, 50);
    this.camera.position.copy(this.playerPos);
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.06;
    container.appendChild(this.renderer.domElement);

    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbit.enableDamping = true;
    this.orbit.dampingFactor = 0.08;
    this.orbit.target.set(0, 1.08, 0);
    this.orbit.minDistance = 0.85;
    this.orbit.maxDistance = 9.0;
    this.orbit.maxPolarAngle = Math.PI / 2 - 0.04;

    this.setupLights();
    this.buildRoomArchitecture();
    this.buildLabFurnitureAndStations();
    this.buildWorkbenchAndVessels();
    this.buildFireAndExplosionSystems();
    this.buildFirstPersonHandProps();
    this.buildPouringProps();
    this.attachEvents();

    this.setCameraMode('ROOM_WALK');
    this.animate();
  }

  private setupLights(): void {
    const hemi = new THREE.HemisphereLight('#f8fafc', '#cbd5e1', 0.95);
    hemi.position.set(0, 4.2, 0);
    this.scene.add(hemi);

    const sunLight = new THREE.DirectionalLight('#fffbeb', 1.3);
    sunLight.position.set(-5.5, 5.5, 3.5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(2048, 2048);
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 20;
    sunLight.shadow.camera.left = -6.5;
    sunLight.shadow.camera.right = 6.5;
    sunLight.shadow.camera.top = 6.5;
    sunLight.shadow.camera.bottom = -6.5;
    sunLight.shadow.bias = -0.0005;
    this.scene.add(sunLight);

    const benchSpot = new THREE.PointLight('#f0f9ff', 0.85, 8);
    benchSpot.position.set(0, 3.4, 0.6);
    this.scene.add(benchSpot);

    this.burnerLight = new THREE.PointLight('#38bdf8', 0, 2.4);
    this.burnerLight.position.set(0.68, 1.12, 0);
    this.scene.add(this.burnerLight);

    this.emergencyStrobeLight = new THREE.PointLight('#ef4444', 0, 16);
    this.emergencyStrobeLight.position.set(0, 3.8, 0);
    this.scene.add(this.emergencyStrobeLight);

    this.extinguisherBeaconLight = new THREE.PointLight('#ef4444', 0, 4.5);
    this.extinguisherBeaconLight.position.set(5.1, 2.1, -2.0);
    this.scene.add(this.extinguisherBeaconLight);
  }

  private createTileFloorTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = '#edf2f7';
    ctx.fillRect(4, 4, 120, 120);
    ctx.fillRect(132, 132, 120, 120);
    ctx.fillStyle = '#e6edf5';
    ctx.fillRect(132, 4, 120, 120);
    ctx.fillRect(4, 132, 120, 120);

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

  private createPosterTexture(
    title: string,
    subtitle: string,
    type: 'periodic' | 'safety'
  ): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 400;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 640, 400);
    ctx.strokeStyle = type === 'periodic' ? '#0284c7' : '#dc2626';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, 630, 390);

    ctx.fillStyle = type === 'periodic' ? '#0369a1' : '#b91c1c';
    ctx.fillRect(10, 10, 620, 64);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 23px sans-serif';
    ctx.fillText(title, 24, 45);
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#fef2f2';
    ctx.fillText(subtitle, 24, 65);

    if (type === 'periodic') {
      const cols = ['#ef4444', '#f59e0b', '#0ea5e9', '#10b981', '#eab308', '#14b8a6'];
      const symbols = [
        'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
        'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
        'Fe', 'Cu', 'Zn', 'Ag', 'Ba', 'Au',
      ];
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
        '1. CẤM rót nước vào H₂SO₄ đặc 98% (Gây nổ bắn axit!).',
        '2. CẤM thả mẩu lớn Natri (≥ 0.5g) vào nước/axit.',
        '3. CẤM bật đèn cồn dưới bình đang thoát nhiều khí H₂.',
        '4. CẤM đun bình rỗng cạn khô vượt 255°C.',
        '5. KHI CHÁY: Chạy ngay tới Tường Phải lấy Bình CO₂ xịt lửa!',
      ];
      ctx.font = 'bold 18px sans-serif';
      rules.forEach((line, i) => {
        ctx.fillStyle = i === 4 ? '#b91c1c' : '#1e293b';
        ctx.fillText(line, 24, 122 + i * 54);
      });
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  private createTextSprite(
    text: string,
    bgHex = '#0f172a',
    borderHex = '#38bdf8',
    scaleW = 0.65
  ): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 420;
    canvas.height = 84;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = bgHex;
    ctx.beginPath();
    ctx.roundRect(8, 8, 404, 68, 16);
    ctx.fill();
    ctx.strokeStyle = borderHex;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 23px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 210, 42);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(scaleW, scaleW * 0.2, 1);
    return sprite;
  }

  private buildRoomArchitecture(): void {
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 10),
      new THREE.MeshStandardMaterial({
        map: this.createTileFloorTexture(),
        roughness: 0.45,
        metalness: 0.05,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const ceilMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 10),
      new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.9 })
    );
    ceilMesh.rotation.x = Math.PI / 2;
    ceilMesh.position.y = 4.2;
    this.scene.add(ceilMesh);

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

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(12, 4.2, 0.2), wallUpperMat);
    backWall.position.set(0, 2.1, -4.6);
    backWall.receiveShadow = true;
    this.scene.add(backWall);

    const backWainscot = new THREE.Mesh(new THREE.BoxGeometry(12, 1.15, 0.23), wainscotMat);
    backWainscot.position.set(0, 0.575, -4.6);
    this.scene.add(backWainscot);

    const frontWall = new THREE.Mesh(new THREE.BoxGeometry(12, 4.2, 0.2), wallUpperMat);
    frontWall.position.set(0, 2.1, 5.0);
    this.scene.add(frontWall);

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

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.2, 10), wallUpperMat);
    rightWall.position.set(5.8, 2.1, 0);
    this.scene.add(rightWall);

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

    const safetyPoster = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 1.4),
      new THREE.MeshBasicMaterial({
        map: this.createPosterTexture(
          'CẢNH BÁO CHÁY NỔ & AN TOÀN LAB',
          'Đọc kỹ trước khi lấy H₂SO₄ đặc hoặc Kim loại kiềm Na!',
          'safety'
        ),
      })
    );
    safetyPoster.rotation.y = -Math.PI / 2;
    safetyPoster.position.set(5.68, 2.55, 1.2);
    this.scene.add(safetyPoster);
  }

  private buildLabFurnitureAndStations(): void {
    const woodMat = new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.65 });
    const cabinetMat = new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.5 });
    const darkTopMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.35 });
    const steelMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', roughness: 0.3, metalness: 0.75 });

    // STATION 1: REAGENT CABINET (-3.4, 0, -4.05)
    const shelfGroup = new THREE.Group();
    shelfGroup.position.set(-3.4, 0, -4.05);

    const shelfBack = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.45, 0.1), cabinetMat);
    shelfBack.position.set(0, 1.22, -0.2);
    shelfBack.castShadow = true;
    shelfGroup.add(shelfBack);
    this.clickableMeshes.set(shelfBack, {
      type: 'station',
      id: 'REAGENT_CABINET',
      station: 'REAGENT_CABINET',
    });

    [-1.2, 1.2].forEach((sx) => {
      const side = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.45, 0.48), cabinetMat);
      side.position.set(sx, 1.22, 0);
      shelfGroup.add(side);
    });

    [0.1, 0.85, 1.45, 2.05, 2.45].forEach((sy) => {
      const plank = new THREE.Mesh(new THREE.BoxGeometry(2.44, 0.05, 0.46), woodMat);
      plank.position.set(0, sy, 0);
      plank.receiveShadow = true;
      shelfGroup.add(plank);
    });

    const shelfBanner = this.createTextSprite(
      '🧪 TỦ HÓA CHẤT [Đi tới / Phím F]',
      '#0369a1',
      '#38bdf8',
      1.45
    );
    shelfBanner.position.set(0, 2.68, 0.15);
    shelfGroup.add(shelfBanner);

    SHELF_CHEMICALS.forEach((chem, idx) => {
      const row = Math.floor(idx / 5);
      const col = idx % 5;
      const bx = -0.9 + col * 0.45;
      const by = 2.08 - row * 0.6;

      const bottleGroup = new THREE.Group();
      bottleGroup.position.set(bx, by, 0.06);

      const bottleMat = new THREE.MeshPhysicalMaterial({
        color: chem.colorHex,
        transparent: true,
        opacity: Math.max(0.58, chem.opacity),
        roughness: 0.15,
        transmission: 0.3,
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

      this.clickableMeshes.set(body, {
        type: 'reagent',
        id: chem.formula,
        station: 'REAGENT_CABINET',
      });
      shelfGroup.add(bottleGroup);
    });
    this.scene.add(shelfGroup);

    // STATION 2: WALL-MOUNTED RED CO2 FIRE EXTINGUISHER (Right Wall: 5.55, 0, -2.0)
    const fireStation = new THREE.Group();
    fireStation.position.set(5.58, 0, -2.0);

    // Bright Red Safety Backboard on Wall
    const redBoard = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 1.25, 0.78),
      new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.4 })
    );
    redBoard.position.set(0.08, 1.35, 0);
    fireStation.add(redBoard);

    const whiteBorder = new THREE.Mesh(
      new THREE.BoxGeometry(0.07, 1.12, 0.66),
      new THREE.MeshStandardMaterial({ color: '#fef2f2', roughness: 0.5 })
    );
    whiteBorder.position.set(0.07, 1.35, 0);
    fireStation.add(whiteBorder);

    // Bracket Hook
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.22), steelMat);
    bracket.position.set(-0.02, 1.38, 0);
    fireStation.add(bracket);

    // Removable 3D Red CO2 Extinguisher Cylinder!
    this.wallExtinguisherCylinder = new THREE.Group();
    this.wallExtinguisherCylinder.position.set(-0.08, 1.22, 0);

    const extTank = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.56, 20),
      new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.25, metalness: 0.25 })
    );
    extTank.castShadow = true;
    this.wallExtinguisherCylinder.add(extTank);

    const extDome = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 18, 12),
      new THREE.MeshStandardMaterial({ color: '#b91c1c', roughness: 0.25, metalness: 0.25 })
    );
    extDome.position.y = 0.28;
    this.wallExtinguisherCylinder.add(extDome);

    const valve = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.035, 0.1, 12),
      new THREE.MeshStandardMaterial({ color: '#eab308', metalness: 0.8, roughness: 0.2 })
    );
    valve.position.y = 0.41;
    this.wallExtinguisherCylinder.add(valve);

    const horn = new THREE.Mesh(
      new THREE.ConeGeometry(0.055, 0.24, 14),
      new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.5 })
    );
    horn.position.set(-0.08, 0.22, 0.08);
    horn.rotation.z = Math.PI / 4;
    this.wallExtinguisherCylinder.add(horn);

    fireStation.add(this.wallExtinguisherCylinder);

    // Hitbox for clicking Fire Extinguisher Station
    const extHit = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 1.5, 0.9),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    extHit.position.set(-0.1, 1.35, 0);
    fireStation.add(extHit);
    this.clickableMeshes.set(extHit, {
      type: 'station',
      id: 'EXTINGUISHER_MOUNT',
      station: 'EXTINGUISHER_MOUNT',
    });

    const fireLabel = this.createTextSprite(
      '🚒 BÌNH CỨU HỎA CO₂ [Click / Phím F]',
      '#991b1b',
      '#fca5a5',
      1.45
    );
    fireLabel.position.set(-0.2, 2.22, 0);
    fireStation.add(fireLabel);
    this.scene.add(fireStation);

    // STATION 3: SINK & EMERGENCY WASH STATION (Right Wall: 5.15, 0, 1.2)
    const sinkGroup = new THREE.Group();
    sinkGroup.position.set(5.15, 0, 1.2);
    const sinkCabinet = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 1.5), cabinetMat);
    sinkCabinet.position.y = 0.45;
    sinkCabinet.castShadow = true;
    sinkGroup.add(sinkCabinet);

    const sinkCounter = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.06, 1.56), darkTopMat);
    sinkCounter.position.y = 0.93;
    sinkGroup.add(sinkCounter);

    const waterBasin = new THREE.Mesh(
      new THREE.BoxGeometry(0.62, 0.03, 0.95),
      new THREE.MeshStandardMaterial({ color: '#38bdf8', roughness: 0.15 })
    );
    waterBasin.position.y = 0.955;
    sinkGroup.add(waterBasin);

    const faucet = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.024, 10, 20, Math.PI), steelMat);
    faucet.position.set(0.12, 1.14, 0);
    faucet.rotation.y = Math.PI / 2;
    sinkGroup.add(faucet);

    const sinkLabel = this.createTextSprite(
      '🚰 BỒN RỬA & LẤY NƯỚC [Phím F]',
      '#0f766e',
      '#5eead4',
      1.3
    );
    sinkLabel.position.set(-0.15, 1.68, 0);
    sinkGroup.add(sinkLabel);

    const sinkHit = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 1.5, 1.65),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    sinkHit.position.y = 0.75;
    sinkGroup.add(sinkHit);
    this.clickableMeshes.set(sinkHit, { type: 'station', id: 'SINK', station: 'SINK' });
    this.scene.add(sinkGroup);

    // Fume Hood at Back-Right (3.2, 0, -4.0)
    const hoodGroup = new THREE.Group();
    hoodGroup.position.set(3.2, 0, -4.0);
    const hoodBase = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.9, 0.9), cabinetMat);
    hoodBase.position.y = 0.45;
    hoodGroup.add(hoodBase);
    const hoodChamber = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 1.45, 0.86),
      new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.4 })
    );
    hoodChamber.position.set(0, 1.62, -0.02);
    hoodGroup.add(hoodChamber);
    const sashGlass = new THREE.Mesh(
      new THREE.BoxGeometry(1.82, 0.9, 0.03),
      new THREE.MeshPhysicalMaterial({ color: '#bae6fd', transparent: true, opacity: 0.3 })
    );
    sashGlass.position.set(0, 1.52, 0.42);
    hoodGroup.add(sashGlass);
    const duct = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.8, 16), steelMat);
    duct.position.set(0, 3.25, -0.1);
    hoodGroup.add(duct);
    this.scene.add(hoodGroup);
  }

  private buildWorkbenchAndVessels(): void {
    const darkTopMat = new THREE.MeshStandardMaterial({
      color: '#0f172a',
      roughness: 0.32,
      metalness: 0.12,
    });
    const benchBodyMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.5 });
    const woodTrimMat = new THREE.MeshStandardMaterial({ color: '#d97706', roughness: 0.55 });
    const steelMat = new THREE.MeshStandardMaterial({
      color: '#94a3b8',
      roughness: 0.28,
      metalness: 0.78,
    });

    const benchGroup = new THREE.Group();
    const counterTop = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 1.25), darkTopMat);
    counterTop.position.set(0, 0.92, 0);
    counterTop.castShadow = true;
    counterTop.receiveShadow = true;
    benchGroup.add(counterTop);
    this.clickableMeshes.set(counterTop, {
      type: 'station',
      id: 'WORKBENCH',
      station: 'WORKBENCH',
    });

    const cabinet = new THREE.Mesh(new THREE.BoxGeometry(2.42, 0.88, 1.08), benchBodyMat);
    cabinet.position.set(0, 0.44, 0);
    cabinet.castShadow = true;
    cabinet.receiveShadow = true;
    benchGroup.add(cabinet);

    const trim = new THREE.Mesh(new THREE.BoxGeometry(2.46, 0.06, 1.12), woodTrimMat);
    trim.position.set(0, 0.85, 0);
    benchGroup.add(trim);

    const tray = new THREE.Mesh(
      new THREE.BoxGeometry(1.95, 0.015, 0.72),
      new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.6 })
    );
    tray.position.set(0, 0.968, 0);
    benchGroup.add(tray);

    // Bunsen Burner + Tripod at x = +0.68
    const burnerX = 0.68;
    const burnerBase = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 0.03, 24), steelMat);
    burnerBase.position.set(burnerX, 0.99, 0);
    benchGroup.add(burnerBase);

    const burnerTube = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.028, 0.14, 16), steelMat);
    burnerTube.position.set(burnerX, 1.06, 0);
    benchGroup.add(burnerTube);

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
      leg.position.set(burnerX + Math.cos(angle) * 0.145, 1.09, Math.sin(angle) * 0.145);
      benchGroup.add(leg);
    }

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

    const vesselConfigs = [
      { id: 'vessel-1', label: 'Cốc A', x: -0.68, y: 0.98, radius: 0.135, height: 0.32 },
      { id: 'vessel-2', label: 'Cốc B', x: 0.0, y: 0.98, radius: 0.135, height: 0.32 },
      { id: 'vessel-3', label: 'Bình Nhiệt C', x: 0.68, y: 1.225, radius: 0.125, height: 0.3 },
    ];

    vesselConfigs.forEach((cfg) => {
      const root = new THREE.Group();
      const basePos = new THREE.Vector3(cfg.x, cfg.y, 0);
      root.position.copy(basePos);

      // Intact Glass Group
      const intactGroup = new THREE.Group();
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: '#f8fafc',
        transparent: true,
        opacity: 0.28,
        roughness: 0.06,
        clearcoat: 1.0,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const glassMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(cfg.radius, cfg.radius, cfg.height, 36, 1, true),
        glassMat
      );
      glassMesh.position.y = cfg.height / 2;
      intactGroup.add(glassMesh);

      const glassBottom = new THREE.Mesh(
        new THREE.CylinderGeometry(cfg.radius, cfg.radius, 0.012, 32),
        glassMat
      );
      glassBottom.position.y = 0.006;
      intactGroup.add(glassBottom);

      const glassRim = new THREE.Mesh(
        new THREE.TorusGeometry(cfg.radius, 0.007, 10, 36),
        new THREE.MeshPhysicalMaterial({ color: '#e2e8f0', transparent: true, opacity: 0.55 })
      );
      glassRim.rotation.x = Math.PI / 2;
      glassRim.position.y = cfg.height;
      intactGroup.add(glassRim);
      root.add(intactGroup);

      // Broken / Shattered Glass & Scorch Soot Group!
      const brokenGroup = new THREE.Group();
      brokenGroup.visible = false;
      const scorchDisc = new THREE.Mesh(
        new THREE.CircleGeometry(cfg.radius * 1.45, 24),
        new THREE.MeshBasicMaterial({ color: '#18181b', side: THREE.DoubleSide })
      );
      scorchDisc.rotation.x = -Math.PI / 2;
      scorchDisc.position.y = 0.004;
      brokenGroup.add(scorchDisc);

      const shardMat = new THREE.MeshPhysicalMaterial({
        color: '#cbd5e1',
        transparent: true,
        opacity: 0.7,
        roughness: 0.15,
      });
      for (let s = 0; s < 9; s++) {
        const ang = (s / 9) * Math.PI * 2;
        const shard = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.09, 4), shardMat);
        shard.position.set(
          Math.cos(ang) * (cfg.radius * 0.85),
          0.035,
          Math.sin(ang) * (cfg.radius * 0.85)
        );
        shard.rotation.set((Math.random() - 0.5) * 0.8, ang, (Math.random() - 0.5) * 0.8);
        brokenGroup.add(shard);
      }
      root.add(brokenGroup);

      const liquidMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(cfg.radius * 0.93, cfg.radius * 0.93, 1.0, 32),
        new THREE.MeshPhysicalMaterial({
          color: '#dbeafe',
          transparent: true,
          opacity: 0.3,
          roughness: 0.12,
        })
      );
      liquidMesh.visible = false;
      root.add(liquidMesh);

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

      const precipitateMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(cfg.radius * 0.91, cfg.radius * 0.91, 1.0, 28),
        new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.85 })
      );
      precipitateMesh.visible = false;
      root.add(precipitateMesh);

      const solidMesh = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.036, 1),
        new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.35, metalness: 0.45 })
      );
      solidMesh.position.set(0, 0.035, 0);
      solidMesh.visible = false;
      root.add(solidMesh);

      const selectionRing = new THREE.Mesh(
        new THREE.RingGeometry(cfg.radius + 0.022, cfg.radius + 0.048, 36),
        new THREE.MeshBasicMaterial({
          color: '#0ea5e9',
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.92,
        })
      );
      selectionRing.rotation.x = -Math.PI / 2;
      selectionRing.position.y = 0.005;
      selectionRing.visible = cfg.id === this.selectedVesselId;
      root.add(selectionRing);

      const labelSprite = this.createTextSprite(cfg.label, '#0f172a', '#38bdf8', 0.5);
      labelSprite.position.set(0, cfg.height + 0.12, 0);
      root.add(labelSprite);

      const hitBox = new THREE.Mesh(
        new THREE.CylinderGeometry(cfg.radius * 1.4, cfg.radius * 1.4, cfg.height * 1.3, 16),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitBox.position.y = cfg.height / 2;
      root.add(hitBox);
      this.clickableMeshes.set(hitBox, { type: 'vessel', id: cfg.id, station: 'WORKBENCH' });

      const bubbles: THREE.Mesh[] = [];
      const bubbleMat = new THREE.MeshBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.75,
      });
      for (let b = 0; b < 20; b++) {
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
      for (let s = 0; s < 8; s++) {
        const sm = new THREE.Mesh(
          new THREE.SphereGeometry(0.028, 10, 10),
          new THREE.MeshBasicMaterial({ color: '#f1f5f9', transparent: true, opacity: 0.25 })
        );
        sm.visible = false;
        sm.userData = { phase: s / 8, driftX: (Math.random() - 0.5) * 0.08 };
        root.add(sm);
        steamPuffs.push(sm);
      }

      const sparks: THREE.Mesh[] = [];
      for (let k = 0; k < 12; k++) {
        const sp = new THREE.Mesh(
          new THREE.SphereGeometry(0.01, 6, 6),
          new THREE.MeshBasicMaterial({ color: '#f59e0b' })
        );
        sp.visible = false;
        sp.userData = { angle: (k / 12) * Math.PI * 2, phase: Math.random() };
        root.add(sp);
        sparks.push(sp);
      }

      this.scene.add(root);
      this.vesselGroups.push({
        id: cfg.id,
        root,
        intactGroup,
        brokenGroup,
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

  private buildFireAndExplosionSystems(): void {
    this.fireGroup = new THREE.Group();
    this.fireGroup.position.set(0, 0.98, 0);
    this.fireGroup.visible = false;

    for (let i = 0; i < 16; i++) {
      const isCore = i % 2 === 0;
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(isCore ? 0.09 : 0.15, isCore ? 0.36 : 0.56, 12),
        new THREE.MeshBasicMaterial({
          color: isCore ? '#fde047' : '#ea580c',
          transparent: true,
          opacity: isCore ? 0.92 : 0.78,
        })
      );
      cone.userData = {
        ox: (Math.random() - 0.5) * 1.85,
        oz: (Math.random() - 0.5) * 0.75,
        phase: Math.random() * Math.PI * 2,
        speed: 9 + Math.random() * 8,
      };
      cone.position.set(cone.userData.ox, 0.22, cone.userData.oz);
      this.fireGroup.add(cone);
      this.fireTongues.push(cone);
    }

    for (let s = 0; s < 16; s++) {
      const puff = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 10, 10),
        new THREE.MeshBasicMaterial({ color: '#27272a', transparent: true, opacity: 0.45 })
      );
      puff.userData = {
        ox: (Math.random() - 0.5) * 1.5,
        oz: (Math.random() - 0.5) * 0.6,
        phase: s / 16,
      };
      this.fireGroup.add(puff);
      this.smokeBillows.push(puff);
    }
    this.scene.add(this.fireGroup);

    // Explosion Shards & Fireball Burst Pool
    for (let d = 0; d < 26; d++) {
      const isEmber = d % 2 === 0;
      const mesh = new THREE.Mesh(
        isEmber ? new THREE.SphereGeometry(0.032, 8, 8) : new THREE.TetrahedronGeometry(0.045),
        new THREE.MeshBasicMaterial({ color: isEmber ? '#f97316' : '#e2e8f0' })
      );
      mesh.visible = false;
      mesh.userData = { vx: 0, vy: 0, vz: 0 };
      this.scene.add(mesh);
      this.explosionDebris.push(mesh);
    }
  }

  private buildFirstPersonHandProps(): void {
    this.handGroup = new THREE.Group();
    this.camera.add(this.handGroup);

    // 1. Held Reagent Bottle in right hand
    this.handBottleGroup = new THREE.Group();
    this.handBottleGroup.position.set(0.28, -0.24, -0.48);
    this.handBottleGroup.rotation.set(0.12, -0.25, 0.08);
    this.handBottleMat = new THREE.MeshPhysicalMaterial({
      color: '#dbeafe',
      transparent: true,
      opacity: 0.72,
      roughness: 0.15,
    });
    const bBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.05, 0.14, 18),
      this.handBottleMat
    );
    this.handBottleGroup.add(bBody);
    const bCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.035, 14),
      new THREE.MeshStandardMaterial({ color: '#0f172a' })
    );
    bCap.position.y = 0.085;
    this.handBottleGroup.add(bCap);
    this.handGroup.add(this.handBottleGroup);

    // 2. Held Red CO2 Fire Extinguisher + Spray Particles!
    this.handExtinguisherGroup = new THREE.Group();
    this.handExtinguisherGroup.position.set(0.3, -0.28, -0.52);
    this.handExtinguisherGroup.rotation.set(0.18, -0.2, 0);
    this.handExtinguisherGroup.visible = false;

    const tank = new THREE.Mesh(
      new THREE.CylinderGeometry(0.068, 0.068, 0.34, 18),
      new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.25, metalness: 0.3 })
    );
    this.handExtinguisherGroup.add(tank);

    const nozzle = new THREE.Mesh(
      new THREE.ConeGeometry(0.042, 0.18, 14),
      new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.5 })
    );
    nozzle.position.set(-0.04, 0.14, -0.14);
    nozzle.rotation.x = -Math.PI / 2.3;
    this.handExtinguisherGroup.add(nozzle);
    this.handGroup.add(this.handExtinguisherGroup);

    // CO2 White Frost Spray Stream attached to camera view
    const frostMat = new THREE.MeshBasicMaterial({
      color: '#f8fafc',
      transparent: true,
      opacity: 0.72,
    });
    for (let i = 0; i < 34; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), frostMat);
      p.visible = false;
      p.userData = {
        phase: i / 34,
        spreadX: (Math.random() - 0.5) * 0.45,
        spreadY: (Math.random() - 0.5) * 0.35,
      };
      this.camera.add(p);
      this.sprayParticles.push(p);
    }
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

  public walkToStation(station: Exclude<StationId, null>): void {
    const wp = STATION_WAYPOINTS[station];
    if (!wp) return;
    if (this.cameraMode !== 'ROOM_WALK') {
      this.setCameraMode('ROOM_WALK');
    }
    this.autoWalkTarget = {
      pos: new THREE.Vector3(wp.pos[0], wp.pos[1], wp.pos[2]),
      yaw: wp.yaw,
      station,
    };
  }

  public triggerExplosion(vesselId: string): void {
    const vg = this.vesselGroups.find((v) => v.id === vesselId) || this.vesselGroups[0];
    const origin = vg.basePosition;
    this.explosionActiveTime = 1.3;
    this.cameraShake = 0.42;

    this.explosionDebris.forEach((mesh) => {
      mesh.visible = true;
      mesh.position.set(origin.x, origin.y + 0.16, origin.z);
      const angle = Math.random() * Math.PI * 2;
      const spd = 1.4 + Math.random() * 3.2;
      mesh.userData.vx = Math.cos(angle) * spd;
      mesh.userData.vy = 1.8 + Math.random() * 3.0;
      mesh.userData.vz = Math.sin(angle) * spd;
    });
  }

  public syncFireEmergency(intensity: number, burnedDown: boolean): void {
    this.fireIntensity = intensity;
    this.fireGroup.visible = intensity > 0.5 || burnedDown;
    if (burnedDown) {
      this.scene.background = new THREE.Color('#271717');
      this.scene.fog = new THREE.Fog('#271717', 4, 16);
    } else if (intensity > 0.5) {
      this.scene.background = new THREE.Color('#cbd5e1');
      this.scene.fog = new THREE.Fog('#94a3b8', 6, 20);
    } else {
      this.scene.background = new THREE.Color('#dce7f2');
      this.scene.fog = new THREE.Fog('#dce7f2', 11, 25);
    }
  }

  public syncHeldItem(
    activeItem: HotbarItem,
    ownsExtinguisher: boolean,
    spraying: boolean
  ): void {
    this.wallExtinguisherCylinder.visible = !ownsExtinguisher;
    this.isSpraying = spraying && activeItem?.type === 'extinguisher';

    const showHand = this.cameraMode === 'ROOM_WALK';
    this.handGroup.visible = showHand;

    if (activeItem?.type === 'extinguisher') {
      this.handExtinguisherGroup.visible = true;
      this.handBottleGroup.visible = false;
    } else if (activeItem?.type === 'reagent') {
      this.handExtinguisherGroup.visible = false;
      this.handBottleGroup.visible = true;
      const chem = SHELF_CHEMICALS.find((c) => c.formula === activeItem.formula);
      if (chem) {
        this.handBottleMat.color.set(chem.colorHex);
      }
    } else {
      this.handExtinguisherGroup.visible = false;
      this.handBottleGroup.visible = false;
    }
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
      this.camTransitionTargetPos.set(0, 1.54, 1.85);
      this.camTransitionLookAt.set(0, 1.12, 0);
      this.isTransitioningCamera = true;
      this.handGroup.visible = false;
    } else if (mode === 'ORBIT_OVERVIEW') {
      this.orbit.enabled = true;
      this.camTransitionTargetPos.set(4.2, 3.3, 4.4);
      this.camTransitionLookAt.set(0, 1.1, -0.5);
      this.isTransitioningCamera = true;
      this.handGroup.visible = false;
    } else {
      this.orbit.enabled = false;
      this.isTransitioningCamera = false;
      this.camera.position.copy(this.playerPos);
      this.updateWalkCameraRotation();
      this.handGroup.visible = true;
    }
  }

  public setMobileMove(forward: number, strafe: number): void {
    if (Math.abs(forward) > 0 || Math.abs(strafe) > 0) {
      this.autoWalkTarget = null;
    }
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

      vg.intactGroup.visible = !vis.isBroken;
      vg.brokenGroup.visible = vis.isBroken;

      if (!vis.isBroken && vis.fillRatio > 0.008) {
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

      if (!vis.isBroken && vis.precipitateHeightRatio > 0.002) {
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

      if (!vis.isBroken && vis.solidChunkColorHex && vis.solidChunkScale > 0.02) {
        vg.solidMesh.visible = true;
        vg.solidMesh.scale.setScalar(vis.solidChunkScale);
        (vg.solidMesh.material as THREE.MeshStandardMaterial).color.set(vis.solidChunkColorHex);
        if (vis.isSparking && vis.fillRatio > 0.02) {
          const surfaceY = 0.012 + vis.fillRatio * maxH;
          const t = performance.now() * 0.012;
          vg.solidMesh.position.set(Math.sin(t) * 0.055, surfaceY, Math.cos(t * 1.3) * 0.055);
        } else {
          vg.solidMesh.position.set(0, 0.032, 0);
        }
      } else {
        vg.solidMesh.visible = false;
      }

      if (vState.isHeatable) {
        this.flameOuter.visible = vState.burnerOn && !vis.isBroken;
        this.flameCore.visible = vState.burnerOn && !vis.isBroken;
        this.burnerLight.intensity =
          vState.burnerOn && !vis.isBroken ? 0.6 + vState.burnerLevel * 0.45 : 0;
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
    if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      this.autoWalkTarget = null;
    }
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
      this.playerPitch = Math.max(-1.15, Math.min(1.05, this.playerPitch - dy * 0.0038));
      this.updateWalkCameraRotation();
    }
  };

  private handlePointerUp = (e: PointerEvent): void => {
    this.isDraggingLook = false;
    const distMoved = Math.hypot(
      e.clientX - this.pointerDownPos.x,
      e.clientY - this.pointerDownPos.y
    );
    if (distMoved > 7) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const candidates = Array.from(this.clickableMeshes.keys());
    const hits = this.raycaster.intersectObjects(candidates, false);
    if (hits.length > 0) {
      const info = this.clickableMeshes.get(hits[0].object);
      if (!info) return;

      if (info.type === 'vessel') {
        this.setSelectedVessel(info.id);
        this.callbacks.onSelectVessel(info.id);
        if (this.lastStation !== 'WORKBENCH') {
          this.walkToStation('WORKBENCH');
        }
      } else if (info.type === 'reagent') {
        if (this.lastStation === 'REAGENT_CABINET') {
          this.callbacks.onInteractStation3D('REAGENT_CABINET', info.id);
        } else {
          this.walkToStation('REAGENT_CABINET');
        }
      } else if (info.type === 'station' && info.station) {
        if (this.lastStation === info.station) {
          this.callbacks.onInteractStation3D(info.station);
        } else {
          this.walkToStation(info.station);
        }
      }
    }
  };

  private updateParticlesAndFire(dt: number, nowSec: number): void {
    // Explosion Debris Physics
    if (this.explosionActiveTime > 0) {
      this.explosionActiveTime -= dt;
      this.explosionDebris.forEach((mesh) => {
        mesh.position.x += mesh.userData.vx * dt;
        mesh.position.y += mesh.userData.vy * dt;
        mesh.position.z += mesh.userData.vz * dt;
        mesh.userData.vy -= 9.8 * dt;
        mesh.rotation.x += 6 * dt;
        mesh.rotation.y += 5 * dt;
        if (mesh.position.y < 0.02) {
          mesh.position.y = 0.02;
          mesh.userData.vx *= 0.6;
          mesh.userData.vz *= 0.6;
        }
      });
      if (this.explosionActiveTime <= 0) {
        this.explosionDebris.forEach((m) => (m.visible = false));
      }
    }

    // Workbench Fire Flames + Emergency Strobe + Beacon
    if (this.fireGroup.visible) {
      const ratio = Math.max(0.15, this.fireIntensity / 100);
      this.emergencyStrobeLight.intensity = 1.5 + Math.sin(nowSec * 12) * 1.3;
      this.extinguisherBeaconLight.intensity =
        this.wallExtinguisherCylinder.visible ? 1.8 + Math.cos(nowSec * 14) * 1.4 : 0;

      this.fireTongues.forEach((cone, idx) => {
        const activeCount = Math.ceil(ratio * this.fireTongues.length);
        cone.visible = idx < activeCount;
        if (cone.visible) {
          const flk = 0.75 + Math.sin(nowSec * cone.userData.speed + cone.userData.phase) * 0.32;
          const s = (0.5 + ratio * 0.95) * flk;
          cone.scale.set(s, s * 1.25, s);
          cone.position.x = cone.userData.ox * (0.35 + ratio * 0.75);
          cone.position.y = 0.16 * s;
        }
      });

      this.smokeBillows.forEach((puff) => {
        puff.userData.phase = (puff.userData.phase + dt * 0.55) % 1;
        const p = puff.userData.phase;
        puff.position.set(
          puff.userData.ox * ratio,
          0.35 + p * 2.1,
          puff.userData.oz * ratio
        );
        puff.scale.setScalar((0.6 + p * 2.2) * (0.4 + ratio * 0.7));
        (puff.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.48;
      });
    } else {
      this.emergencyStrobeLight.intensity = 0;
      this.extinguisherBeaconLight.intensity = 0;
    }

    // CO2 Fire Extinguisher Frost Spray Particles
    this.sprayParticles.forEach((sp) => {
      if (this.isSpraying) {
        sp.visible = true;
        sp.userData.phase = (sp.userData.phase + dt * 2.8) % 1;
        const p = sp.userData.phase;
        sp.position.set(
          0.22 + sp.userData.spreadX * p * 1.8,
          -0.16 + sp.userData.spreadY * p * 1.6,
          -0.65 - p * 2.6
        );
        sp.scale.setScalar(0.5 + p * 2.8);
        (sp.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.78;
      } else {
        sp.visible = false;
      }
    });

    // Pouring Stream Animation
    if (this.pourAnim.active) {
      this.pourAnim.progress += dt * 1.5;
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
          this.pourBottleGroup.visible = true;
          this.pourBottleBodyMat.color.set(this.pourAnim.colorHex);
          const arc = Math.sin(p * Math.PI);
          this.pourBottleGroup.position.set(tx + 0.16, ty + 0.42, 0);
          this.pourBottleGroup.rotation.z = arc * 1.15;
        }
        this.pourStreamMesh.visible = p > 0.2 && p < 0.85;
        if (this.pourStreamMesh.visible) {
          this.pourStreamMat.color.set(this.pourAnim.colorHex);
          this.pourStreamMesh.position.set(tx, ty + 0.24, 0);
        }
      }
    }

    // Vessel Bubbles, Steam & Sparks
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
          sm.position.set(sm.userData.driftX * p * 3, maxH + 0.02 + p * 0.28, 0);
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

  private applyCollision(nextPos: THREE.Vector3): void {
    nextPos.x = Math.max(-5.1, Math.min(5.05, nextPos.x));
    nextPos.z = Math.max(-3.45, Math.min(4.4, nextPos.z));

    // Central Workbench Collision Box (-1.58..1.58, -0.92..0.92)
    if (Math.abs(nextPos.x) < 1.58 && Math.abs(nextPos.z) < 0.92) {
      if (Math.abs(this.playerPos.z) >= 0.92) {
        nextPos.z = Math.sign(this.playerPos.z) * 0.92;
      } else {
        nextPos.x = Math.sign(this.playerPos.x) * 1.58;
      }
    }
  }

  private evaluateStationProximity(): void {
    const distBench = Math.hypot(this.playerPos.x, this.playerPos.z);
    const distCabinet = Math.hypot(this.playerPos.x - -3.4, this.playerPos.z - -3.8);
    const distSink = Math.hypot(this.playerPos.x - 5.1, this.playerPos.z - 1.2);
    const distExt = Math.hypot(this.playerPos.x - 5.4, this.playerPos.z - -2.0);

    let detected: StationId = null;
    if (distExt < 2.25) detected = 'EXTINGUISHER_MOUNT';
    else if (distCabinet < 2.45) detected = 'REAGENT_CABINET';
    else if (distSink < 2.15) detected = 'SINK';
    else if (distBench < 2.85) detected = 'WORKBENCH';

    const roundedFireDist = Math.round(distBench * 10) / 10;
    if (detected !== this.lastStation || Math.abs(roundedFireDist - this.lastReportedFireDist) >= 0.25) {
      this.lastStation = detected;
      this.lastReportedFireDist = roundedFireDist;
      this.callbacks.onStationProximityChange(detected, distBench);
    }
  }

  private updateSpatialWalk(dt: number, nowSec: number): void {
    if (this.cameraMode !== 'ROOM_WALK') return;

    // 1. Auto-Walk smoothly across the room if user clicked a station or tapped Quick-Walk!
    if (this.autoWalkTarget) {
      const toTarget = this.autoWalkTarget.pos.clone().sub(this.playerPos);
      toTarget.y = 0;
      const dist = toTarget.length();

      if (dist < 0.12) {
        this.playerPos.copy(this.autoWalkTarget.pos);
        this.playerYaw = this.autoWalkTarget.yaw;
        this.playerPitch = -0.14;
        this.updateWalkCameraRotation();
        this.autoWalkTarget = null;
      } else {
        const step = Math.min(dist, 3.8 * dt);
        toTarget.normalize();
        const nextPos = this.playerPos.clone().addScaledVector(toTarget, step);
        this.applyCollision(nextPos);
        this.playerPos.copy(nextPos);

        // Smoothly rotate yaw toward walk direction, then station yaw when close
        const moveYaw = Math.atan2(-toTarget.x, -toTarget.z);
        const desiredYaw = dist < 0.8 ? this.autoWalkTarget.yaw : moveYaw;
        let diff = desiredYaw - this.playerYaw;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        this.playerYaw += diff * Math.min(1, 7 * dt);
        this.updateWalkCameraRotation();
      }
      this.camera.position.copy(this.playerPos);
      this.evaluateStationProximity();
      return;
    }

    // 2. Manual WASD / Arrow / Touch D-Pad Walk
    let moveForward = this.mobileMove.forward;
    let moveStrafe = this.mobileMove.strafe;

    if (this.keysPressed.has('KeyW') || this.keysPressed.has('ArrowUp')) moveForward += 1;
    if (this.keysPressed.has('KeyS') || this.keysPressed.has('ArrowDown')) moveForward -= 1;
    if (this.keysPressed.has('KeyA') || this.keysPressed.has('ArrowLeft')) moveStrafe -= 1;
    if (this.keysPressed.has('KeyD') || this.keysPressed.has('ArrowRight')) moveStrafe += 1;

    if (Math.abs(moveForward) > 0.01 || Math.abs(moveStrafe) > 0.01) {
      const speed = 3.2 * dt;
      const forwardDir = new THREE.Vector3(-Math.sin(this.playerYaw), 0, -Math.cos(this.playerYaw));
      const rightDir = new THREE.Vector3(Math.cos(this.playerYaw), 0, -Math.sin(this.playerYaw));

      const nextPos = this.playerPos
        .clone()
        .addScaledVector(forwardDir, moveForward * speed)
        .addScaledVector(rightDir, moveStrafe * speed);

      this.applyCollision(nextPos);
      this.playerPos.copy(nextPos);
      // Subtle head-bob while walking for realism!
      const bob = Math.sin(nowSec * 11) * 0.022;
      this.camera.position.set(this.playerPos.x, this.playerPos.y + bob, this.playerPos.z);
    } else {
      this.camera.position.copy(this.playerPos);
    }

    this.evaluateStationProximity();
  }

  private animate = (): void => {
    this.animFrameId = requestAnimationFrame(this.animate);
    const now = performance.now();
    const dt = Math.min(0.08, (now - this.lastTime) / 1000);
    this.lastTime = now;
    const nowSec = now / 1000;

    if (this.cameraMode !== 'ROOM_WALK') {
      if (this.isTransitioningCamera) {
        this.camera.position.lerp(this.camTransitionTargetPos, 0.12);
        this.orbit.target.lerp(this.camTransitionLookAt, 0.12);
        if (this.camera.position.distanceTo(this.camTransitionTargetPos) < 0.03) {
          this.isTransitioningCamera = false;
        }
      }
      this.orbit.update();
    } else {
      this.updateSpatialWalk(dt, nowSec);
    }

    // Apply Explosion Trauma Camera Shake!
    if (this.cameraShake > 0.005) {
      this.camera.position.x += (Math.random() - 0.5) * this.cameraShake;
      this.camera.position.y += (Math.random() - 0.5) * this.cameraShake;
      this.cameraShake = Math.max(0, this.cameraShake - dt * 0.75);
    }

    this.updateParticlesAndFire(dt, nowSec);
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
