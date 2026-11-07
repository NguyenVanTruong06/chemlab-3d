import type {
  ChemicalDef,
  GuidedLesson,
  ReactionLogEntry,
  VesselState,
  VesselVisualState,
} from '../types/chemistry';

export const SHELF_CHEMICALS: ChemicalDef[] = [
  {
    id: 'CHEM_12',
    formula: 'H2O',
    displayFormula: 'H₂O',
    nameVi: 'Nước cất',
    category: 'Dung môi',
    stateType: 'liquid',
    molarMass: 18.0,
    colorHex: '#dbeafe',
    opacity: 0.22,
    safetyNote: 'Dung môi tiêu chuẩn, an toàn.',
  },
  {
    id: 'CHEM_01',
    formula: 'HCl',
    displayFormula: 'HCl 1.0M',
    nameVi: 'Axit clohiđric',
    category: 'Axit vô cơ',
    stateType: 'aqueous',
    defaultMolarity: 1.0,
    molarMass: 36.5,
    colorHex: '#e0f2fe',
    opacity: 0.26,
    safetyNote: 'Ăn mòn mạnh, tránh tiếp xúc trực tiếp với da và mắt.',
  },
  {
    id: 'CHEM_02',
    formula: 'H2SO4',
    displayFormula: 'H₂SO₄ 1.0M',
    nameVi: 'Axit sunfuric loãng',
    category: 'Axit vô cơ',
    stateType: 'aqueous',
    defaultMolarity: 1.0,
    molarMass: 98.0,
    colorHex: '#e0f2fe',
    opacity: 0.28,
    safetyNote: 'Axit mạnh, dùng nhận biết muối Bari tạo kết tủa trắng.',
  },
  {
    id: 'CHEM_03',
    formula: 'NaOH',
    displayFormula: 'NaOH 1.0M',
    nameVi: 'Natri hiđroxit',
    category: 'Bazơ kiềm',
    stateType: 'aqueous',
    defaultMolarity: 1.0,
    molarMass: 40.0,
    colorHex: '#f1f5f9',
    opacity: 0.25,
    safetyNote: 'Kiềm ăn mòn da, làm trơn nhờn tay; hòa tan kết tủa Al(OH)₃ khi dùng dư.',
  },
  {
    id: 'CHEM_04',
    formula: 'BaCl2',
    displayFormula: 'BaCl₂ 0.5M',
    nameVi: 'Bari clorua',
    category: 'Muối',
    stateType: 'aqueous',
    defaultMolarity: 0.5,
    molarMass: 208.2,
    colorHex: '#f8fafc',
    opacity: 0.25,
    safetyNote: 'Muối độc nếu nuốt; thuốc thử nhận biết gốc sunfat (=SO₄).',
  },
  {
    id: 'CHEM_05',
    formula: 'CuSO4',
    displayFormula: 'CuSO₄ 0.5M',
    nameVi: 'Đồng(II) sunfat',
    category: 'Muối',
    stateType: 'aqueous',
    defaultMolarity: 0.5,
    molarMass: 159.6,
    colorHex: '#0284c7',
    opacity: 0.72,
    safetyNote: 'Dung dịch màu xanh lam đặc trưng; tạo kết tủa Cu(OH)₂ với kiềm.',
  },
  {
    id: 'CHEM_13',
    formula: 'AlCl3',
    displayFormula: 'AlCl₃ 0.5M',
    nameVi: 'Nhôm clorua',
    category: 'Muối',
    stateType: 'aqueous',
    defaultMolarity: 0.5,
    molarMass: 133.3,
    colorHex: '#f1f5f9',
    opacity: 0.27,
    safetyNote: 'Tạo kết tủa keo trắng Al(OH)₃ với NaOH vừa đủ và tan khi NaOH dư.',
  },
  {
    id: 'CHEM_10',
    formula: 'Phenolphtalein',
    displayFormula: 'Phenolphtalein',
    nameVi: 'Chỉ thị Phenolphtalein',
    category: 'Chỉ thị màu',
    stateType: 'indicator',
    molarMass: 318.3,
    colorHex: '#fdf2f8',
    opacity: 0.2,
    safetyNote: 'Không màu ở pH < 8.2, chuyển hồng cánh sen rõ rệt khi pH ≥ 8.3.',
  },
  {
    id: 'CHEM_11',
    formula: 'QuyTim',
    displayFormula: 'Quỳ tím (dd)',
    nameVi: 'Dung dịch Quỳ tím',
    category: 'Chỉ thị màu',
    stateType: 'indicator',
    molarMass: 300.0,
    colorHex: '#6366f1',
    opacity: 0.6,
    safetyNote: 'Hóa đỏ trong môi trường Axit (pH < 5), hóa xanh dương trong Bazơ (pH > 8.3).',
  },
  {
    id: 'CHEM_06',
    formula: 'Al',
    displayFormula: 'Al (Lá nhôm)',
    nameVi: 'Nhôm kim loại',
    category: 'Kim loại',
    stateType: 'solid',
    molarMass: 27.0,
    colorHex: '#cbd5e1',
    opacity: 1.0,
    safetyNote: 'Kim loại lưỡng tính: tan và sủi bọt khí H₂ trong cả axit HCl và kiềm NaOH.',
  },
  {
    id: 'CHEM_08',
    formula: 'CaCO3',
    displayFormula: 'CaCO₃ (Đá vôi)',
    nameVi: 'Canxi cacbonat',
    category: 'Muối',
    stateType: 'solid',
    molarMass: 100.1,
    colorHex: '#f8fafc',
    opacity: 1.0,
    safetyNote: 'Chất rắn trắng không tan trong nước, sủi bọt khí CO₂ mạnh khi gặp axit.',
  },
  {
    id: 'CHEM_09',
    formula: 'KMnO4',
    displayFormula: 'KMnO₄ (Tinh thể)',
    nameVi: 'Kali pemanganat',
    category: 'Muối oxi hóa',
    stateType: 'solid',
    molarMass: 158.0,
    colorHex: '#be185d',
    opacity: 1.0,
    safetyNote: 'Chất oxi hóa mạnh; nhiệt phân ở t° ≥ 200°C giải phóng khí O₂.',
  },
  {
    id: 'CHEM_07',
    formula: 'Na',
    displayFormula: 'Na (Kim loại kiềm)',
    nameVi: 'Natri kim loại',
    category: 'Kim loại kiềm',
    stateType: 'solid',
    molarMass: 23.0,
    colorHex: '#e2e8f0',
    opacity: 1.0,
    safetyNote: 'NGUY HIỂM CAO: Phản ứng mãnh liệt với nước sinh H₂ và tỏa nhiệt gây cháy nổ!',
    isHazardous: true,
  },
];

export const SPECIES_NAMES: Record<string, string> = {
  H2O: 'Nước (H₂O)',
  HCl: 'Axit HCl',
  H2SO4: 'Axit H₂SO₄',
  NaOH: 'Kiềm NaOH',
  BaCl2: 'Muối BaCl₂',
  CuSO4: 'Muối CuSO₄',
  CuCl2: 'Muối CuCl₂',
  AlCl3: 'Muối AlCl₃',
  NaCl: 'Muối NaCl',
  Na2SO4: 'Muối Na₂SO₄',
  NaAlO2: 'Natri aluminat (NaAlO₂)',
  CaCl2: 'Muối CaCl₂',
  K2MnO4: 'Kali manganat (K₂MnO₄)',
  BaSO4: 'Kết tủa trắng BaSO₄↓',
  'Cu(OH)2': 'Kết tủa xanh Cu(OH)₂↓',
  CuO: 'Chất rắn đen CuO↓',
  'Al(OH)3': 'Kết tủa keo trắng Al(OH)₃↓',
  Al: 'Kim loại Nhôm (Al)',
  Na: 'Kim loại Natri (Na)',
  CaCO3: 'Đá vôi CaCO₃(r)',
  KMnO4: 'Tinh thể KMnO₄',
  MnO2: 'Mangan đioxit MnO₂(đen)',
  Phenolphtalein: 'Chỉ thị Phenolphtalein',
  QuyTim: 'Chỉ thị Quỳ tím',
};

const PRECIPITATE_SPECIES = ['BaSO4', 'Cu(OH)2', 'CuO', 'Al(OH)3', 'MnO2'];
const SOLID_CHUNK_SPECIES = ['Al', 'Na', 'CaCO3', 'KMnO4'];

const EPS = 1e-6;

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
  );
}

function mixRgb(
  base: [number, number, number],
  tint: [number, number, number],
  weight: number
): [number, number, number] {
  const w = Math.max(0, Math.min(1, weight));
  return [
    base[0] * (1 - w) + tint[0] * w,
    base[1] * (1 - w) + tint[1] * w,
    base[2] * (1 - w) + tint[2] * w,
  ];
}

export function createInitialVessel(
  id: string,
  name: string,
  subtitle: string,
  capacityMl: number,
  isHeatable: boolean
): VesselState {
  const base: VesselState = {
    id,
    name,
    subtitle,
    capacityMl,
    isHeatable,
    burnerOn: false,
    burnerLevel: 2,
    temperatureC: 25.0,
    volumeMl: 0,
    pH: 7.0,
    moles: {},
    recentGas: {},
    totalGasEvolved: {},
    activeEquations: [],
    visual: {
      liquidColorHex: '#dbeafe',
      liquidOpacity: 0.22,
      fillRatio: 0,
      precipitateColorHex: '#ffffff',
      precipitateHeightRatio: 0,
      solidChunkColorHex: null,
      solidChunkScale: 0,
      bubbleRate: 0,
      steamRate: 0,
      isSparking: false,
      hasHazardExplosion: false,
    },
  };
  return recomputeDerivedProperties(base);
}

export function createDefaultWorkbenchVessels(): VesselState[] {
  return [
    createInitialVessel(
      'vessel-1',
      'Cốc A (Beaker 250ml)',
      'Bình pha chế & chuẩn độ chính',
      250,
      false
    ),
    createInitialVessel(
      'vessel-2',
      'Cốc B (Beaker 250ml)',
      'Bình thuốc thử trung gian (Có thể rót sang Cốc A / C)',
      250,
      false
    ),
    createInitialVessel(
      'vessel-3',
      'Bình Cầu Nhiệt C (200ml)',
      'Đặt trên kiềng Đèn Cồn — Đun nóng tới 260°C',
      200,
      true
    ),
  ];
}

function getMol(moles: Record<string, number>, key: string): number {
  return moles[key] || 0;
}

function addMol(moles: Record<string, number>, key: string, delta: number): void {
  const next = (moles[key] || 0) + delta;
  if (next <= EPS) {
    delete moles[key];
  } else {
    moles[key] = next;
  }
}

export function computePH(moles: Record<string, number>, volumeMl: number): number {
  if (volumeMl < 0.5) return 7.0;
  const volL = volumeMl / 1000;
  const hPlus = getMol(moles, 'HCl') + 2 * getMol(moles, 'H2SO4');
  const ohMinus = getMol(moles, 'NaOH');
  const netAcid = hPlus - ohMinus;

  if (netAcid > 1e-5) {
    const concH = netAcid / volL;
    return Math.max(0.2, Math.min(6.9, -Math.log10(concH)));
  }
  if (netAcid < -1e-5) {
    const concOH = -netAcid / volL;
    const pOH = -Math.log10(concOH);
    return Math.max(7.1, Math.min(13.9, 14.0 - pOH));
  }

  // Mild salt hydrolysis effects
  const acidicSalt = getMol(moles, 'CuSO4') + getMol(moles, 'AlCl3') + getMol(moles, 'CuCl2');
  const basicSalt = getMol(moles, 'NaAlO2') + getMol(moles, 'K2MnO4');
  if (basicSalt > acidicSalt + 1e-4) return 9.8;
  if (acidicSalt > basicSalt + 1e-4) return 5.1;
  return 7.0;
}

export function recomputeDerivedProperties(vessel: VesselState): VesselState {
  const pH = computePH(vessel.moles, vessel.volumeMl);
  const volL = Math.max(0.01, vessel.volumeMl / 1000);

  // 1. Compute Liquid RGB & Opacity
  let rgb: [number, number, number] = [219, 234, 254]; // Clean water tint
  let opacity = 0.24;

  // Copper(II) ions: sky blue (CuSO4) / teal-blue (CuCl2)
  const cuSO4Conc = getMol(vessel.moles, 'CuSO4') / volL;
  const cuCl2Conc = getMol(vessel.moles, 'CuCl2') / volL;
  if (cuSO4Conc > 0.002) {
    const w = Math.min(0.92, cuSO4Conc * 2.2);
    rgb = mixRgb(rgb, [2, 132, 199], w);
    opacity = Math.max(opacity, 0.35 + w * 0.45);
  }
  if (cuCl2Conc > 0.002) {
    const w = Math.min(0.9, cuCl2Conc * 2.2);
    rgb = mixRgb(rgb, [13, 148, 136], w);
    opacity = Math.max(opacity, 0.35 + w * 0.42);
  }

  // Permanganate dissolved in water: deep magenta-crimson (avoiding violet-on-dark trope)
  const kmno4Dissolved =
    vessel.volumeMl > 2 ? Math.min(getMol(vessel.moles, 'KMnO4'), 0.02 * volL * 10) / volL : 0;
  if (kmno4Dissolved > 0.001) {
    const w = Math.min(0.95, kmno4Dissolved * 8);
    rgb = mixRgb(rgb, [190, 24, 93], w);
    opacity = Math.max(opacity, 0.5 + w * 0.42);
  }

  // K2MnO4 green manganate tint
  const k2mno4Conc = getMol(vessel.moles, 'K2MnO4') / volL;
  if (k2mno4Conc > 0.002) {
    const w = Math.min(0.85, k2mno4Conc * 3.5);
    rgb = mixRgb(rgb, [5, 150, 105], w);
    opacity = Math.max(opacity, 0.45 + w * 0.35);
  }

  // Indicators!
  if (getMol(vessel.moles, 'Phenolphtalein') > EPS && vessel.volumeMl > 0.5) {
    if (pH >= 8.2) {
      const pinkStrength = Math.min(0.92, (pH - 8.1) / 2.2);
      rgb = mixRgb(rgb, [236, 72, 153], pinkStrength);
      opacity = Math.max(opacity, 0.42 + pinkStrength * 0.38);
    }
  }

  if (getMol(vessel.moles, 'QuyTim') > EPS && vessel.volumeMl > 0.5) {
    if (pH <= 5.5) {
      const redStrength = Math.min(0.88, (6.0 - pH) / 2.5);
      rgb = mixRgb(rgb, [239, 68, 68], redStrength);
      opacity = Math.max(opacity, 0.48 + redStrength * 0.3);
    } else if (pH >= 8.2) {
      const blueStrength = Math.min(0.88, (pH - 7.8) / 2.5);
      rgb = mixRgb(rgb, [37, 99, 235], blueStrength);
      opacity = Math.max(opacity, 0.48 + blueStrength * 0.3);
    } else {
      rgb = mixRgb(rgb, [99, 102, 241], 0.52);
      opacity = Math.max(opacity, 0.45);
    }
  }

  // 2. Precipitate Layer Calculation
  const pptColors: Record<string, [number, number, number]> = {
    BaSO4: [248, 250, 252], // Dense white
    'Al(OH)3': [226, 232, 240], // Translucent gel white
    'Cu(OH)2': [14, 165, 233], // Sky blue hydroxide
    CuO: [24, 24, 27], // Charcoal black CuO
    MnO2: [39, 39, 42], // Dark MnO2
  };

  let totalPptMoles = 0;
  let pptR = 0;
  let pptG = 0;
  let pptB = 0;
  for (const sp of PRECIPITATE_SPECIES) {
    const m = getMol(vessel.moles, sp);
    if (m > EPS) {
      totalPptMoles += m;
      const c = pptColors[sp];
      pptR += c[0] * m;
      pptG += c[1] * m;
      pptB += c[2] * m;
    }
  }

  const pptHex =
    totalPptMoles > EPS
      ? rgbToHex(pptR / totalPptMoles, pptG / totalPptMoles, pptB / totalPptMoles)
      : '#f8fafc';
  const pptRatio =
    totalPptMoles > EPS ? Math.min(0.28, 0.03 + totalPptMoles * 3.8) : 0;

  // 3. Solid Unreacted Chunk Calculation
  let solidColor: string | null = null;
  let totalSolidMoles = 0;
  const solidHexMap: Record<string, string> = {
    Al: '#cbd5e1',
    Na: '#f1f5f9',
    CaCO3: '#f8fafc',
    KMnO4: '#9d174d',
  };
  for (const sp of SOLID_CHUNK_SPECIES) {
    const m = getMol(vessel.moles, sp);
    if (m > EPS) {
      totalSolidMoles += m;
      if (!solidColor) solidColor = solidHexMap[sp];
    }
  }

  const gasTotalRate = Object.values(vessel.recentGas).reduce((a, b) => a + b, 0);
  const bubbleRate = Math.min(1, gasTotalRate * 260);
  const steamRate =
    vessel.volumeMl > 1 && vessel.temperatureC > 75
      ? Math.min(1, (vessel.temperatureC - 75) / 40)
      : totalPptMoles > 0 && vessel.temperatureC > 120
      ? 0.25
      : 0;

  const fillRatio = Math.min(1, vessel.volumeMl / vessel.capacityMl);

  const visual: VesselVisualState = {
    liquidColorHex: rgbToHex(rgb[0], rgb[1], rgb[2]),
    liquidOpacity: opacity,
    fillRatio,
    precipitateColorHex: pptHex,
    precipitateHeightRatio: pptRatio,
    solidChunkColorHex: solidColor,
    solidChunkScale: totalSolidMoles > EPS ? Math.min(1, 0.3 + totalSolidMoles * 8) : 0,
    bubbleRate,
    steamRate,
    isSparking: vessel.visual.isSparking,
    hasHazardExplosion: vessel.visual.hasHazardExplosion,
  };

  return {
    ...vessel,
    pH: Math.round(pH * 100) / 100,
    visual,
  };
}

export function addReagentToVessel(
  vessel: VesselState,
  chem: ChemicalDef,
  amount: number // mL for liquid/aqueous/indicator, grams for solid
): { nextVessel: VesselState; log: ReactionLogEntry } {
  const nextMoles = { ...vessel.moles };
  let nextVolume = vessel.volumeMl;
  let logText = '';

  if (chem.stateType === 'liquid') {
    const addMl = Math.min(amount, vessel.capacityMl - vessel.volumeMl);
    nextVolume += Math.max(0, addMl);
    addMol(nextMoles, 'H2O', Math.max(0, addMl) / 18.0);
    logText = `Đã rót +${addMl.toFixed(0)} ml ${chem.nameVi} (${chem.displayFormula})`;
  } else if (chem.stateType === 'aqueous') {
    const addMl = Math.min(amount, vessel.capacityMl - vessel.volumeMl);
    const actualMl = Math.max(0, addMl);
    const molarity = chem.defaultMolarity ?? 1.0;
    const addedMol = molarity * (actualMl / 1000);
    nextVolume += actualMl;
    addMol(nextMoles, chem.formula, addedMol);
    addMol(nextMoles, 'H2O', actualMl / 18.0);
    logText = `Đã thêm +${actualMl.toFixed(0)} ml dd ${chem.displayFormula} (${addedMol.toFixed(4)} mol)`;
  } else if (chem.stateType === 'indicator') {
    const addMl = Math.min(amount, vessel.capacityMl - vessel.volumeMl);
    const actualMl = Math.max(0, addMl);
    nextVolume += actualMl;
    addMol(nextMoles, chem.formula, 0.001 * actualMl);
    addMol(nextMoles, 'H2O', actualMl / 18.0);
    logText = `Đã nhỏ ${actualMl.toFixed(1)} ml chất chỉ thị ${chem.nameVi}`;
  } else {
    // Solid in grams
    const addedMol = amount / chem.molarMass;
    addMol(nextMoles, chem.formula, addedMol);
    logText = `Đã thả +${amount.toFixed(2)} g chất rắn ${chem.displayFormula} (${addedMol.toFixed(4)} mol)`;
  }

  let updated: VesselState = {
    ...vessel,
    volumeMl: nextVolume,
    moles: nextMoles,
  };

  // Run an immediate stoichiometric pass so instant ionic reactions reflect right away
  const sim = stepVesselSimulation(updated, 0.05);
  updated = sim.nextVessel;

  const now = new Date().toLocaleTimeString('vi-VN', { hour12: false });
  const log: ReactionLogEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: now,
    vesselName: vessel.name,
    equation: sim.triggeredEquations[0] || `${chem.displayFormula} → ${vessel.name}`,
    phenomenon: sim.phenomena[0] || logText,
    type: sim.hazardTriggered ? 'hazard' : sim.triggeredEquations.length > 0 ? 'reaction' : 'info',
  };

  return { nextVessel: updated, log };
}

export function pourBetweenVessels(
  source: VesselState,
  target: VesselState,
  pourMl: number
): { nextSource: VesselState; nextTarget: VesselState; log: ReactionLogEntry | null } {
  const totalSourceMoles = Object.values(source.moles).reduce((a, b) => a + b, 0);
  if (source.volumeMl <= 0.2 && totalSourceMoles <= EPS) {
    return { nextSource: source, nextTarget: target, log: null };
  }

  const availableSpace = Math.max(0, target.capacityMl - target.volumeMl);
  const actualLiquidPour =
    source.volumeMl > 0.2 ? Math.min(pourMl, source.volumeMl, availableSpace) : 0;
  const fraction =
    source.volumeMl > 0.2
      ? actualLiquidPour / source.volumeMl
      : Math.min(1, pourMl / 50);

  if (fraction <= 0.001) {
    return { nextSource: source, nextTarget: target, log: null };
  }

  const srcMoles = { ...source.moles };
  const dstMoles = { ...target.moles };

  for (const [sp, m] of Object.entries(source.moles)) {
    const moved = m * fraction;
    addMol(srcMoles, sp, -moved);
    addMol(dstMoles, sp, moved);
  }

  const newTargetVol = target.volumeMl + actualLiquidPour;
  const mixedTemp =
    newTargetVol > 0.5
      ? (target.volumeMl * target.temperatureC + actualLiquidPour * source.temperatureC) /
        newTargetVol
      : target.temperatureC;

  const nextSource = recomputeDerivedProperties({
    ...source,
    volumeMl: Math.max(0, source.volumeMl - actualLiquidPour),
    moles: srcMoles,
  });

  const simTarget = stepVesselSimulation(
    {
      ...target,
      volumeMl: newTargetVol,
      temperatureC: mixedTemp,
      moles: dstMoles,
    },
    0.05
  );

  const now = new Date().toLocaleTimeString('vi-VN', { hour12: false });
  const log: ReactionLogEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: now,
    vesselName: `${source.name} → ${target.name}`,
    equation:
      simTarget.triggeredEquations[0] ||
      `Rót ${actualLiquidPour.toFixed(0)} ml từ ${source.name} sang ${target.name}`,
    phenomenon:
      simTarget.phenomena[0] ||
      `Chuyển hỗn hợp dung dịch (${actualLiquidPour.toFixed(0)} ml) sang ${target.name}.`,
    type: simTarget.hazardTriggered
      ? 'hazard'
      : simTarget.triggeredEquations.length > 0
      ? 'reaction'
      : 'info',
  };

  return { nextSource, nextTarget: simTarget.nextVessel, log };
}

export function stepVesselSimulation(
  vessel: VesselState,
  dt: number
): {
  nextVessel: VesselState;
  triggeredEquations: string[];
  phenomena: string[];
  hazardTriggered: boolean;
} {
  const moles = { ...vessel.moles };
  let temp = vessel.temperatureC;
  let volMl = vessel.volumeMl;
  const recentGas: Record<string, number> = {};
  const totalGas = { ...vessel.totalGasEvolved };
  const equations: string[] = [];
  const phenomena: string[] = [];
  let isSparking = false;
  let hazardTriggered = false;
  let hasExplosion = vessel.visual.hasHazardExplosion;

  const recordEq = (eq: string, phenom?: string) => {
    if (!equations.includes(eq)) equations.push(eq);
    if (phenom && !phenomena.includes(phenom)) phenomena.push(phenom);
  };

  const emitGas = (gasFormula: string, molAmount: number) => {
    if (molAmount <= EPS) return;
    recentGas[gasFormula] = (recentGas[gasFormula] || 0) + molAmount;
    totalGas[gasFormula] = (totalGas[gasFormula] || 0) + molAmount;
  };

  // --- 1. THERMAL HEATING & COOLING ---
  if (vessel.isHeatable && vessel.burnerOn) {
    const targetMaxTemp = vessel.burnerLevel === 1 ? 95 : vessel.burnerLevel === 2 ? 165 : 265;
    const heatRate = vessel.burnerLevel === 1 ? 6.5 : vessel.burnerLevel === 2 ? 13.5 : 24.0;
    if (temp < targetMaxTemp) {
      temp = Math.min(targetMaxTemp, temp + heatRate * dt);
    }
    // Water boiling plateau around 100°C while liquid water remains
    if (volMl > 1.5 && temp > 100.5) {
      const evapMl = Math.min(volMl - 1.0, 1.8 * vessel.burnerLevel * dt);
      volMl -= evapMl;
      addMol(moles, 'H2O', -evapMl / 18.0);
      temp = 100.0 + (temp - 100.0) * 0.35;
    }
  } else {
    // Newtonian cooling toward room temperature 25.0°C
    temp += (25.0 - temp) * Math.min(1, 0.14 * dt);
  }

  const heatCapacityFactor = Math.max(25, volMl); // mL equivalent thermal mass

  // --- 2. INSTANT AQUEOUS IONIC EQUILIBRIA ---
  if (volMl > 0.5) {
    // 2a. Strong Acid + Strong Base Neutralization
    // HCl + NaOH -> NaCl + H2O
    const nNeut1 = Math.min(getMol(moles, 'HCl'), getMol(moles, 'NaOH'));
    if (nNeut1 > EPS) {
      addMol(moles, 'HCl', -nNeut1);
      addMol(moles, 'NaOH', -nNeut1);
      addMol(moles, 'NaCl', nNeut1);
      addMol(moles, 'H2O', nNeut1);
      temp += (nNeut1 * 13500) / heatCapacityFactor;
      recordEq(
        'HCl + NaOH → NaCl + H₂O',
        'Phản ứng trung hòa tỏa nhiệt nhẹ, độ pH dịch chuyển về trung tính.'
      );
    }

    // H2SO4 + 2NaOH -> Na2SO4 + 2H2O
    const nNeut2 = Math.min(getMol(moles, 'H2SO4'), getMol(moles, 'NaOH') / 2);
    if (nNeut2 > EPS) {
      addMol(moles, 'H2SO4', -nNeut2);
      addMol(moles, 'NaOH', -2 * nNeut2);
      addMol(moles, 'Na2SO4', nNeut2);
      addMol(moles, 'H2O', 2 * nNeut2);
      temp += (nNeut2 * 27000) / heatCapacityFactor;
      recordEq(
        'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O',
        'Trung hòa axit sunfuric bằng kiềm NaOH.'
      );
    }

    // 2b. Sulfate Precipitation: BaCl2 + H2SO4 -> BaSO4↓ + 2HCl
    const nBa1 = Math.min(getMol(moles, 'BaCl2'), getMol(moles, 'H2SO4'));
    if (nBa1 > EPS) {
      addMol(moles, 'BaCl2', -nBa1);
      addMol(moles, 'H2SO4', -nBa1);
      addMol(moles, 'BaSO4', nBa1);
      addMol(moles, 'HCl', 2 * nBa1);
      recordEq(
        'BaCl₂ + H₂SO₄ → BaSO₄↓ (trắng) + 2HCl',
        'Xuất hiện ngay kết tủa trắng bền BaSO₄ không tan trong axit dư!'
      );
    }

    // BaCl2 + Na2SO4 -> BaSO4↓ + 2NaCl
    const nBa2 = Math.min(getMol(moles, 'BaCl2'), getMol(moles, 'Na2SO4'));
    if (nBa2 > EPS) {
      addMol(moles, 'BaCl2', -nBa2);
      addMol(moles, 'Na2SO4', -nBa2);
      addMol(moles, 'BaSO4', nBa2);
      addMol(moles, 'NaCl', 2 * nBa2);
      recordEq(
        'BaCl₂ + Na₂SO₄ → BaSO₄↓ (trắng) + 2NaCl',
        'Tạo kết tủa trắng BaSO₄ lắng xuống đáy bình.'
      );
    }

    // BaCl2 + CuSO4 -> BaSO4↓ + CuCl2
    const nBa3 = Math.min(getMol(moles, 'BaCl2'), getMol(moles, 'CuSO4'));
    if (nBa3 > EPS) {
      addMol(moles, 'BaCl2', -nBa3);
      addMol(moles, 'CuSO4', -nBa3);
      addMol(moles, 'BaSO4', nBa3);
      addMol(moles, 'CuCl2', nBa3);
      recordEq(
        'BaCl₂ + CuSO₄ → BaSO₄↓ (trắng) + CuCl₂',
        'Tạo kết tủa trắng BaSO₄ trong dung dịch muối đồng xanh lục lam.'
      );
    }

    // 2c. Copper(II) Hydroxide Precipitation & Acid Dissolution
    // CuSO4 + 2NaOH -> Cu(OH)2↓ + Na2SO4
    const nCuPpt = Math.min(getMol(moles, 'CuSO4'), getMol(moles, 'NaOH') / 2);
    if (nCuPpt > EPS) {
      addMol(moles, 'CuSO4', -nCuPpt);
      addMol(moles, 'NaOH', -2 * nCuPpt);
      addMol(moles, 'Cu(OH)2', nCuPpt);
      addMol(moles, 'Na2SO4', nCuPpt);
      recordEq(
        'CuSO₄ + 2NaOH → Cu(OH)₂↓ (xanh lam) + Na₂SO₄',
        'Xuất hiện kết tủa keo màu xanh lam đặc trưng của Cu(OH)₂!'
      );
    }

    // CuCl2 + 2NaOH -> Cu(OH)2↓ + 2NaCl
    const nCuPpt2 = Math.min(getMol(moles, 'CuCl2'), getMol(moles, 'NaOH') / 2);
    if (nCuPpt2 > EPS) {
      addMol(moles, 'CuCl2', -nCuPpt2);
      addMol(moles, 'NaOH', -2 * nCuPpt2);
      addMol(moles, 'Cu(OH)2', nCuPpt2);
      addMol(moles, 'NaCl', 2 * nCuPpt2);
      recordEq(
        'CuCl₂ + 2NaOH → Cu(OH)₂↓ (xanh lam) + 2NaCl',
        'Tái tạo kết tủa xanh lam Cu(OH)₂.'
      );
    }

    // Acid dissolves Cu(OH)2: Cu(OH)2 + 2HCl -> CuCl2 + 2H2O
    const nCuDiss1 = Math.min(getMol(moles, 'Cu(OH)2'), getMol(moles, 'HCl') / 2);
    if (nCuDiss1 > EPS) {
      addMol(moles, 'Cu(OH)2', -nCuDiss1);
      addMol(moles, 'HCl', -2 * nCuDiss1);
      addMol(moles, 'CuCl2', nCuDiss1);
      addMol(moles, 'H2O', 2 * nCuDiss1);
      recordEq(
        'Cu(OH)₂ + 2HCl → CuCl₂ + 2H₂O',
        'Kết tủa xanh Cu(OH)₂ tan trong axit HCl tạo dung dịch xanh lục lam.'
      );
    }

    // Cu(OH)2 + H2SO4 -> CuSO4 + 2H2O
    const nCuDiss2 = Math.min(getMol(moles, 'Cu(OH)2'), getMol(moles, 'H2SO4'));
    if (nCuDiss2 > EPS) {
      addMol(moles, 'Cu(OH)2', -nCuDiss2);
      addMol(moles, 'H2SO4', -nCuDiss2);
      addMol(moles, 'CuSO4', nCuDiss2);
      addMol(moles, 'H2O', 2 * nCuDiss2);
      recordEq(
        'Cu(OH)₂ + H₂SO₄ → CuSO₄ + 2H₂O',
        'Kết tủa xanh tan trở lại tạo dung dịch CuSO₄ màu xanh lam.'
      );
    }

    // 2d. AMPHOTERIC ALUMINUM HYDROXIDE (Đổ vừa đủ tạo kết tủa keo trắng, đổ dư NaOH kết tủa tan!)
    // Step 1: AlCl3 + 3NaOH -> Al(OH)3↓ + 3NaCl
    const nAlPpt = Math.min(getMol(moles, 'AlCl3'), getMol(moles, 'NaOH') / 3);
    if (nAlPpt > EPS) {
      addMol(moles, 'AlCl3', -nAlPpt);
      addMol(moles, 'NaOH', -3 * nAlPpt);
      addMol(moles, 'Al(OH)3', nAlPpt);
      addMol(moles, 'NaCl', 3 * nAlPpt);
      recordEq(
        'AlCl₃ + 3NaOH → Al(OH)₃↓ (keo trắng) + 3NaCl',
        'Xuất hiện kết tủa keo trắng Al(OH)₃!'
      );
    }

    // Step 2: EXCESS NaOH dissolves Al(OH)3↓ -> NaAlO2 + 2H2O
    const nAlExcessBase = Math.min(getMol(moles, 'Al(OH)3'), getMol(moles, 'NaOH'));
    if (nAlExcessBase > EPS) {
      addMol(moles, 'Al(OH)3', -nAlExcessBase);
      addMol(moles, 'NaOH', -nAlExcessBase);
      addMol(moles, 'NaAlO2', nAlExcessBase);
      addMol(moles, 'H2O', 2 * nAlExcessBase);
      recordEq(
        'Al(OH)₃↓ + NaOH (dư) → NaAlO₂ + 2H₂O',
        'Do nhỏ dư kiềm NaOH, kết tủa keo trắng Al(OH)₃ tan dần thành dung dịch NaAlO₂ trong suốt!'
      );
    }

    // Step 3: Adding HCl to NaAlO2 re-precipitates Al(OH)3↓
    const nAlReppt = Math.min(getMol(moles, 'NaAlO2'), getMol(moles, 'HCl'));
    if (nAlReppt > EPS) {
      addMol(moles, 'NaAlO2', -nAlReppt);
      addMol(moles, 'HCl', -nAlReppt);
      addMol(moles, 'Al(OH)3', nAlReppt);
      addMol(moles, 'NaCl', nAlReppt);
      recordEq(
        'NaAlO₂ + HCl + H₂O → Al(OH)₃↓ (keo trắng) + NaCl',
        'Axit trung hòa muối aluminat làm tái xuất hiện kết tủa keo trắng Al(OH)₃!'
      );
    }

    // Step 4: Excess HCl dissolves Al(OH)3↓ -> AlCl3 + 3H2O
    const nAlDissAcid = Math.min(getMol(moles, 'Al(OH)3'), getMol(moles, 'HCl') / 3);
    if (nAlDissAcid > EPS) {
      addMol(moles, 'Al(OH)3', -nAlDissAcid);
      addMol(moles, 'HCl', -3 * nAlDissAcid);
      addMol(moles, 'AlCl3', nAlDissAcid);
      addMol(moles, 'H2O', 3 * nAlDissAcid);
      recordEq(
        'Al(OH)₃↓ + 3HCl (dư) → AlCl₃ + 3H₂O',
        'Axit HCl dư hòa tan hoàn toàn kết tủa keo trắng Al(OH)₃!'
      );
    }
  }

  // --- 3. TIME-STEPPED KINETIC SOLID/GAS REACTIONS ---
  // 3a. Alkali Metal Sodium + Water: 2Na + 2H2O -> 2NaOH + H2↑ + HUGE HEAT
  const naMol = getMol(moles, 'Na');
  if (naMol > EPS && volMl > 1.0) {
    isSparking = true;
    if (naMol > 0.022 && !hasExplosion) {
      hazardTriggered = true;
      hasExplosion = true;
      recordEq(
        '⚠️ CẢNH BÁO NỔ: 2Na + 2H₂O → 2NaOH + H₂↑ + Q (Nổ nhiệt!)',
        'Lượng Natri vượt mức an toàn (> 0.5g)! Khí H₂ bốc cháy gây nổ văng dung dịch kiềm!'
      );
    }
    const rateNa = Math.min(naMol, (0.012 + naMol * 0.85) * dt);
    if (rateNa > EPS) {
      addMol(moles, 'Na', -rateNa);
      addMol(moles, 'NaOH', rateNa);
      emitGas('H2', 0.5 * rateNa);
      temp += (rateNa * 184000) / heatCapacityFactor;
      recordEq(
        '2Na + 2H₂O → 2NaOH + H₂↑',
        'Mẩu Natri vo tròn chạy nhanh trên mặt nước, sủi khí H₂ mãnh liệt và tỏa nhiệt rất mạnh!'
      );
    }
  }

  // 3b. Aluminum + HCl: 2Al + 6HCl -> 2AlCl3 + 3H2↑
  const alMol = getMol(moles, 'Al');
  const hclMol = getMol(moles, 'HCl');
  if (alMol > EPS && hclMol > EPS && volMl > 1.0) {
    const tempBoost = 1 + Math.max(0, temp - 25) * 0.04;
    const maxAlByAcid = hclMol / 3;
    const reactedAl = Math.min(alMol, maxAlByAcid, 0.0045 * tempBoost * dt);
    if (reactedAl > EPS) {
      addMol(moles, 'Al', -reactedAl);
      addMol(moles, 'HCl', -3 * reactedAl);
      addMol(moles, 'AlCl3', reactedAl);
      emitGas('H2', 1.5 * reactedAl);
      temp += (reactedAl * 125000) / heatCapacityFactor;
      recordEq(
        '2Al + 6HCl → 2AlCl₃ + 3H₂↑',
        'Lá nhôm tan dần, sủi bọt khí H₂ không màu liên tục và làm nóng bình chứa.'
      );
    }
  }

  // 3c. Aluminum + NaOH: 2Al + 2NaOH + 2H2O -> 2NaAlO2 + 3H2↑
  const alMol2 = getMol(moles, 'Al');
  const naohMol = getMol(moles, 'NaOH');
  if (alMol2 > EPS && naohMol > EPS && volMl > 1.0) {
    const tempBoost = 1 + Math.max(0, temp - 25) * 0.035;
    const reactedAl = Math.min(alMol2, naohMol, 0.0035 * tempBoost * dt);
    if (reactedAl > EPS) {
      addMol(moles, 'Al', -reactedAl);
      addMol(moles, 'NaOH', -reactedAl);
      addMol(moles, 'NaAlO2', reactedAl);
      emitGas('H2', 1.5 * reactedAl);
      temp += (reactedAl * 95000) / heatCapacityFactor;
      recordEq(
        '2Al + 2NaOH + 2H₂O → 2NaAlO₂ + 3H₂↑',
        'Nhôm tan trong dung dịch kiềm NaOH, giải phóng bọt khí H₂!'
      );
    }
  }

  // 3d. Limestone CaCO3 + 2HCl -> CaCl2 + CO2↑ + H2O
  const caco3Mol = getMol(moles, 'CaCO3');
  const hclForCarb = getMol(moles, 'HCl');
  if (caco3Mol > EPS && hclForCarb > EPS && volMl > 1.0) {
    const reactedCarb = Math.min(caco3Mol, hclForCarb / 2, 0.0075 * dt);
    if (reactedCarb > EPS) {
      addMol(moles, 'CaCO3', -reactedCarb);
      addMol(moles, 'HCl', -2 * reactedCarb);
      addMol(moles, 'CaCl2', reactedCarb);
      addMol(moles, 'H2O', reactedCarb);
      emitGas('CO2', reactedCarb);
      recordEq(
        'CaCO₃ + 2HCl → CaCl₂ + CO₂↑ + H₂O',
        'Đá vôi tan nhanh, sủi bọt khí CO₂ sôi động khắp lòng dung dịch!'
      );
    }
  }

  // CaCO3 + H2SO4 -> CaSO4 + CO2↑ + H2O
  const caco3Mol2 = getMol(moles, 'CaCO3');
  const h2so4ForCarb = getMol(moles, 'H2SO4');
  if (caco3Mol2 > EPS && h2so4ForCarb > EPS && volMl > 1.0) {
    const reactedCarb = Math.min(caco3Mol2, h2so4ForCarb, 0.005 * dt);
    if (reactedCarb > EPS) {
      addMol(moles, 'CaCO3', -reactedCarb);
      addMol(moles, 'H2SO4', -reactedCarb);
      addMol(moles, 'BaSO4', reactedCarb * 0.5); // white sparingly soluble CaSO4 visual
      emitGas('CO2', reactedCarb);
      recordEq(
        'CaCO₃ + H₂SO₄ → CaSO₄ + CO₂↑ + H₂O',
        'Đá vôi tác dụng axit sunfuric giải phóng khí CO₂.'
      );
    }
  }

  // 3e. Black CuO + 2HCl -> CuCl2 + H2O (faster when warm!)
  const cuoMol = getMol(moles, 'CuO');
  const hclForCuO = getMol(moles, 'HCl');
  if (cuoMol > EPS && hclForCuO > EPS && volMl > 1.0) {
    const warmFactor = temp > 50 ? 2.5 : 0.8;
    const reactedCuO = Math.min(cuoMol, hclForCuO / 2, 0.003 * warmFactor * dt);
    if (reactedCuO > EPS) {
      addMol(moles, 'CuO', -reactedCuO);
      addMol(moles, 'HCl', -2 * reactedCuO);
      addMol(moles, 'CuCl2', reactedCuO);
      addMol(moles, 'H2O', reactedCuO);
      recordEq(
        'CuO (đen) + 2HCl → CuCl₂ (xanh lục lam) + H₂O',
        'Bột CuO màu đen tan dần trong axit tạo dung dịch muối đồng xanh lục lam.'
      );
    }
  }

  // --- 4. THERMAL DECOMPOSITION REACTIONS (Gated by Real-time Temperature!) ---
  // 4a. Cu(OH)2 --(t° >= 80°C)--> CuO (black) + H2O
  const cuoh2Mol = getMol(moles, 'Cu(OH)2');
  if (cuoh2Mol > EPS && temp >= 80.0) {
    const thermalSpeed = 0.0025 * (1 + (temp - 80) * 0.12);
    const decomposed = Math.min(cuoh2Mol, thermalSpeed * dt);
    if (decomposed > EPS) {
      addMol(moles, 'Cu(OH)2', -decomposed);
      addMol(moles, 'CuO', decomposed);
      addMol(moles, 'H2O', decomposed);
      recordEq(
        'Cu(OH)₂ —(t° ≥ 80°C)→ CuO↓ (đen) + H₂O',
        'Đạt ngưỡng nhiệt phân (> 80°C): Kết tủa xanh Cu(OH)₂ chuyển dần sang chất rắn màu đen CuO!'
      );
    }
  }

  // 4b. 2KMnO4 --(t° >= 200°C)--> K2MnO4 + MnO2 + O2↑
  const kmno4Mol = getMol(moles, 'KMnO4');
  if (kmno4Mol > EPS && temp >= 200.0) {
    const thermalSpeed = 0.003 * (1 + (temp - 200) * 0.08);
    const decomposed = Math.min(kmno4Mol, thermalSpeed * dt);
    if (decomposed > EPS) {
      addMol(moles, 'KMnO4', -decomposed);
      addMol(moles, 'K2MnO4', 0.5 * decomposed);
      addMol(moles, 'MnO2', 0.5 * decomposed);
      emitGas('O2', 0.5 * decomposed);
      recordEq(
        '2KMnO₄ —(t° ≥ 200°C)→ K₂MnO₄ + MnO₂ + O₂↑',
        'Nhiệt độ vượt 200°C: Tinh thể thuốc tím nhiệt phân giải phóng khí Oxi (O₂)!'
      );
    }
  }

  const nextState: VesselState = recomputeDerivedProperties({
    ...vessel,
    temperatureC: Math.round(temp * 10) / 10,
    volumeMl: Math.round(volMl * 10) / 10,
    moles,
    recentGas,
    totalGasEvolved: totalGas,
    activeEquations: equations.length > 0 ? equations : vessel.activeEquations,
    visual: {
      ...vessel.visual,
      isSparking,
      hasHazardExplosion: hasExplosion,
    },
  });

  return {
    nextVessel: nextState,
    triggeredEquations: equations,
    phenomena,
    hazardTriggered,
  };
}

export const GUIDED_LESSONS: GuidedLesson[] = [
  {
    id: 'LES_AMPHOTERIC_9',
    grade: 'Lớp 9',
    title: 'Bài 1: Hiện tượng "Đổ dư kết tủa tan" — AlCl₃ tác dụng với NaOH',
    summary:
      'Thực chứng tính chất lưỡng tính của nhôm hiđroxit Al(OH)₃ thông qua việc điều chỉnh lượng số mol kiềm NaOH nhỏ vào muối nhôm.',
    theoryPoints: [
      'Khi nhỏ từ từ dung dịch NaOH vào dung dịch AlCl₃, ban đầu xuất hiện kết tủa keo trắng Al(OH)₃ tăng dần đến cực đại theo tỉ lệ mol 1 : 3.',
      'Phương trình giai đoạn 1: AlCl₃ + 3NaOH → Al(OH)₃↓ (keo trắng) + 3NaCl.',
      'Nếu tiếp tục nhỏ dư NaOH, kết tủa keo trắng Al(OH)₃ sẽ phản ứng tiếp với NaOH dư và tan dần tạo thành dung dịch Natri aluminat (NaAlO₂) trong suốt: Al(OH)₃ + NaOH → NaAlO₂ + 2H₂O.',
    ],
    safetyWarning: 'Dung dịch NaOH có tính ăn mòn da tay; thao tác nhỏ từ từ để quan sát rõ hai giai đoạn.',
    recommendedReagents: ['AlCl3', 'NaOH', 'HCl'],
    steps: [
      {
        id: 'step-1',
        instruction: 'Rót ít nhất 20 ml dung dịch Nhôm clorua (AlCl₃ 0.5M) vào một cốc bất kỳ.',
        hint: 'Chọn Cốc A trên bàn, bấm chọn hóa chất AlCl₃ 0.5M và nhấn nút +25 ml.',
        checkCondition: (vessels) =>
          vessels.some((v) => (v.moles['AlCl3'] || 0) >= 0.008 || (v.moles['Al(OH)3'] || 0) > 0.002),
      },
      {
        id: 'step-2',
        instruction: 'Nhỏ từ từ dung dịch NaOH 1.0M vào cốc để tạo kết tủa keo trắng Al(OH)₃.',
        hint: 'Chọn NaOH 1.0M rồi bấm +10 ml (lượng vừa phải để kết tủa chưa tan hết).',
        checkCondition: (vessels) => vessels.some((v) => (v.moles['Al(OH)3'] || 0) >= 0.002),
      },
      {
        id: 'step-3',
        instruction: 'Tiếp tục đổ DƯ dung dịch NaOH 1.0M cho đến khi kết tủa keo trắng tan hoàn toàn thành NaAlO₂!',
        hint: 'Bấm thêm +25 ml hoặc +50 ml NaOH 1.0M vào cùng cốc đó cho đến khi đáy cốc hết lớp kết tủa trắng.',
        checkCondition: (vessels) =>
          vessels.some(
            (v) => (v.moles['NaAlO2'] || 0) >= 0.005 && (v.moles['Al(OH)3'] || 0) < 0.0005
          ),
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Khi nhỏ từ từ tới dư dung dịch NaOH vào dung dịch AlCl₃, hiện tượng quan sát được là gì?',
        options: [
          'Chỉ có kết tủa trắng xuất hiện và không tan',
          'Xuất hiện kết tủa keo trắng tăng dần, sau đó kết tủa tan dần đến trong suốt',
          'Có khí không màu thoát ra mạnh mẽ',
          'Dung dịch chuyển sang màu xanh lam',
        ],
        correctIndex: 1,
        explanation:
          'Ban đầu AlCl₃ + 3NaOH → Al(OH)₃↓ + 3NaCl. Khi NaOH dư: Al(OH)₃ + NaOH → NaAlO₂ + 2H₂O làm kết tủa tan hết.',
      },
      {
        id: 'q2',
        question: 'Để thu được lượng kết tủa Al(OH)₃ lớn nhất từ 0.01 mol AlCl₃, cần dùng đúng bao nhiêu mol NaOH?',
        options: ['0.01 mol', '0.02 mol', '0.03 mol', '0.04 mol'],
        correctIndex: 2,
        explanation: 'Theo tỉ lệ phương trình AlCl₃ + 3NaOH → Al(OH)₃↓ + 3NaCl, số mol NaOH vừa đủ gấp 3 lần số mol AlCl₃ = 0.03 mol.',
      },
    ],
  },
  {
    id: 'LES_THERMAL_CU_9',
    grade: 'Lớp 9',
    title: 'Bài 2: Điều chế & Nhiệt phân Đồng(II) hiđroxit trên Đèn Cồn (> 80°C)',
    summary:
      'Kết hợp phản ứng trao đổi tạo kết tủa màu xanh lam và đun nóng thực tế trên đèn cồn để quan sát sự biến đổi màu sắc theo nhiệt độ.',
    theoryPoints: [
      'Bazơ không tan như Cu(OH)₂ được điều chế bằng cách cho muối đồng (CuSO₄) tác dụng với kiềm mạnh (NaOH).',
      'Cu(OH)₂ là chất kết tủa màu xanh lam, kém bền với nhiệt.',
      'Khi đun nóng trên đèn cồn vượt ngưỡng 80°C, Cu(OH)₂ bị nhiệt phân hủy thành Đồng(II) oxit (CuO) màu đen và nước: Cu(OH)₂ —(t°)→ CuO + H₂O.',
    ],
    safetyWarning: 'Chỉ đun nóng tại Bình Cầu Nhiệt C đặt trên kiềng đèn cồn. Chú ý theo dõi nhiệt kế điện tử.',
    recommendedReagents: ['CuSO4', 'NaOH'],
    steps: [
      {
        id: 'cu-1',
        instruction: 'Chọn "Bình Cầu Nhiệt C (200ml)" trên kiềng đèn cồn và cho vào ít nhất 20 ml CuSO₄ 0.5M.',
        hint: 'Click vào Bình thứ 3 bên phải (trên kiềng đèn cồn), chọn CuSO₄ 0.5M và nhấn +25 ml.',
        checkCondition: (vessels) => {
          const v3 = vessels.find((v) => v.isHeatable);
          return !!v3 && ((v3.moles['CuSO4'] || 0) > 0.005 || (v3.moles['Cu(OH)2'] || 0) > 0.002 || (v3.moles['CuO'] || 0) > 0.002);
        },
      },
      {
        id: 'cu-2',
        instruction: 'Thêm dung dịch NaOH 1.0M vào Bình Cầu Nhiệt C để tạo kết tủa xanh lam Cu(OH)₂.',
        hint: 'Chọn NaOH 1.0M và nhấn +25 ml vào Bình Cầu Nhiệt C.',
        checkCondition: (vessels) => {
          const v3 = vessels.find((v) => v.isHeatable);
          return !!v3 && ((v3.moles['Cu(OH)2'] || 0) > 0.003 || (v3.moles['CuO'] || 0) > 0.003);
        },
      },
      {
        id: 'cu-3',
        instruction: 'Bật Đèn Cồn đun Bình Cầu Nhiệt C vượt 80°C cho đến khi kết tủa xanh chuyển thành chất rắn màu đen CuO!',
        hint: 'Bật công tắc "Đèn Cồn: BẬT" (mức lửa Vừa hoặc Mạnh) và đợi nhiệt độ vượt 80°C.',
        checkCondition: (vessels) => {
          const v3 = vessels.find((v) => v.isHeatable);
          return !!v3 && v3.temperatureC >= 80 && (v3.moles['CuO'] || 0) >= 0.003;
        },
      },
    ],
    quiz: [
      {
        id: 'cu-q1',
        question: 'Hiện tượng gì xảy ra khi đun nóng kết tủa Cu(OH)₂ trên ngọn lửa đèn cồn vượt 80°C?',
        options: [
          'Kết tủa tan thành dung dịch không màu',
          'Kết tủa màu xanh lam chuyển dần thành chất rắn màu đen (CuO)',
          'Xuất hiện kết tủa trắng bạc',
          'Không có sự thay đổi nào xảy ra',
        ],
        correctIndex: 1,
        explanation: 'Do phản ứng nhiệt phân: Cu(OH)₂ —(t°)→ CuO (màu đen) + H₂O.',
      },
    ],
  },
  {
    id: 'LES_EXOTHERMIC_8',
    grade: 'Lớp 8',
    title: 'Bài 3: Phản ứng Tỏa nhiệt — Kim loại Nhôm tác dụng với Axit HCl',
    summary:
      'Quan sát dấu hiệu phản ứng hóa học qua sự sủi bọt khí Hiđro (H₂), sự tan dần của kim loại và sự tăng nhiệt độ của dung dịch.',
    theoryPoints: [
      'Kim loại đứng trước Hiđro (như Al, Zn, Fe, Mg) tác dụng với dung dịch axit HCl giải phóng khí Hiđro (H₂) và tạo muối clorua.',
      'Phương trình hóa học: 2Al + 6HCl → 2AlCl₃ + 3H₂↑.',
      'Đây là phản ứng tỏa nhiệt (ΔH < 0), làm nhiệt độ của dung dịch tăng lên rõ rệt ngay cả khi không dùng đèn cồn.',
    ],
    safetyWarning: 'Khí H₂ sinh ra dễ cháy khi trộn với oxi không khí; không đưa ngọn lửa sát miệng cốc đang sủi khí mạnh.',
    recommendedReagents: ['HCl', 'Al'],
    steps: [
      {
        id: 'al-1',
        instruction: 'Rót ít nhất 25 ml dung dịch Axit HCl 1.0M vào một cốc thí nghiệm.',
        hint: 'Chọn Cốc A, chọn HCl 1.0M và nhấn +25 ml hoặc +50 ml.',
        checkCondition: (vessels) =>
          vessels.some((v) => (v.moles['HCl'] || 0) >= 0.015 || (v.totalGasEvolved['H2'] || 0) > 0.002),
      },
      {
        id: 'al-2',
        instruction: 'Thả mẩu Lá Nhôm (Al) vào cốc chứa HCl và quan sát bọt khí H₂ cùng nhiệt kế tăng lên.',
        hint: 'Chọn hóa chất rắn "Al (Lá nhôm)" rồi bấm +0.25 g hoặc +0.50 g.',
        checkCondition: (vessels) =>
          vessels.some((v) => (v.totalGasEvolved['H2'] || 0) >= 0.003 && v.temperatureC > 27.0),
      },
    ],
    quiz: [
      {
        id: 'al-q1',
        question: 'Vì sao nhiệt độ trên nhiệt kế tự động tăng lên khi thả lá nhôm vào dung dịch HCl dù không bật đèn cồn?',
        options: [
          'Do nhôm có nhiệt độ cao sẵn',
          'Do phản ứng giữa Al và HCl là phản ứng tỏa nhiệt ra môi trường dung dịch',
          'Do nước tự sôi ở 25°C',
          'Do sai số của cốc thủy tinh',
        ],
        correctIndex: 1,
        explanation: 'Phản ứng 2Al + 6HCl → 2AlCl₃ + 3H₂ giải phóng năng lượng nhiệt làm dung dịch nóng lên.',
      },
    ],
  },
  {
    id: 'LES_TITRATION_9',
    grade: 'Lớp 9',
    title: 'Bài 4: Chuẩn độ Trung hòa Axit - Bazơ với Chỉ thị Phenolphtalein',
    summary:
      'Sử dụng chất chỉ thị màu để nhận biết môi trường kiềm và xác định chính xác điểm tương đương (pH = 7) khi trung hòa bằng axit.',
    theoryPoints: [
      'Phenolphtalein không màu trong môi trường axit và trung tính, nhưng chuyển sang màu hồng cánh sen khi pH ≥ 8.3 (môi trường kiềm).',
      'Khi nhỏ từ từ từng ml HCl 1.0M vào NaOH 1.0M có sẵn Phenolphtalein, màu hồng sẽ nhạt dần và mất màu hoàn toàn ngay khi số mol HCl ≥ số mol NaOH.',
    ],
    safetyWarning: 'Nhỏ từng giọt (+1 ml) ở giai đoạn cuối để bắt chính xác thời điểm dung dịch vừa mất màu hồng.',
    recommendedReagents: ['NaOH', 'Phenolphtalein', 'HCl'],
    steps: [
      {
        id: 'tit-1',
        instruction: 'Cho 25 ml dung dịch NaOH 1.0M và nhỏ Phenolphtalein vào cùng một cốc để dung dịch hóa hồng.',
        hint: 'Chọn Cốc A → thêm +25 ml NaOH 1.0M → thêm +1 ml Chỉ thị Phenolphtalein.',
        checkCondition: (vessels) =>
          vessels.some(
            (v) =>
              (v.moles['Phenolphtalein'] || 0) > 0 &&
              (v.pH >= 8.5 || (v.moles['NaCl'] || 0) >= 0.02)
          ),
      },
      {
        id: 'tit-2',
        instruction: 'Nhỏ từ từ dung dịch HCl 1.0M vào cốc màu hồng cho đến khi dung dịch vừa mất màu (pH ≤ 7.5)!',
        hint: 'Chọn HCl 1.0M, bấm +10 ml hai lần rồi bấm từng giọt +1 ml cho tới khi pH về khoảng 7.0.',
        checkCondition: (vessels) =>
          vessels.some(
            (v) =>
              (v.moles['Phenolphtalein'] || 0) > 0 &&
              (v.moles['NaCl'] || 0) >= 0.02 &&
              v.pH <= 7.5
          ),
      },
    ],
    quiz: [
      {
        id: 'tit-q1',
        question: 'Tại thời điểm dung dịch NaOH (có Phenolphtalein) vừa mất màu hồng khi nhỏ HCl vào, trong cốc chứa chất tan chính nào?',
        options: ['Chỉ còn NaOH dư', 'Muối trung hòa NaCl', 'Kết tủa trắng AgCl', 'Kim loại Natri'],
        correctIndex: 1,
        explanation: 'Tại điểm tương đương, HCl vừa đủ tác dụng hết với NaOH tạo thành muối ăn NaCl và nước (pH = 7).',
      },
    ],
  },
];
