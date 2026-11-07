import type {
  ChemicalDef,
  GuidedLesson,
  HazardTriggerInfo,
  ReactionLogEntry,
  VesselState,
  VesselVisualState,
} from '../types/chemistry';

export const SHELF_CHEMICALS: ChemicalDef[] = [
  {
    id: 'CHEM_12',
    formula: 'H2O',
    displayFormula: 'H₂O',
    iupacName: 'Water (Distilled)',
    nameVi: 'Nước cất',
    category: 'Dung môi',
    stateType: 'liquid',
    molarMass: 18.0,
    colorHex: '#dbeafe',
    opacity: 0.22,
    safetyNote: 'Dung môi tiêu chuẩn. LƯU Ý: Tuyệt đối KHÔNG rót nước vào H₂SO₄ đặc!',
  },
  {
    id: 'CHEM_01',
    formula: 'HCl',
    displayFormula: 'HCl 1.0M',
    iupacName: 'Hydrochloric acid',
    nameVi: 'Axit clohiđric',
    category: 'Axit vô cơ',
    stateType: 'aqueous',
    defaultMolarity: 1.0,
    molarMass: 36.5,
    colorHex: '#e0f2fe',
    opacity: 0.26,
    safetyNote: 'Ăn mòn mạnh; sinh khí Hydrogen (H₂) dễ cháy khi tác dụng với kim loại.',
  },
  {
    id: 'CHEM_02',
    formula: 'H2SO4',
    displayFormula: 'H₂SO₄ loãng 1M',
    iupacName: 'Sulfuric acid (dilute)',
    nameVi: 'Axit sunfuric loãng',
    category: 'Axit vô cơ',
    stateType: 'aqueous',
    defaultMolarity: 1.0,
    molarMass: 98.0,
    colorHex: '#e0f2fe',
    opacity: 0.28,
    safetyNote: 'Acid mạnh, dùng nhận biết muối Barium tạo kết tủa trắng BaSO₄.',
  },
  {
    id: 'CHEM_14',
    formula: 'H2SO4_dac',
    displayFormula: 'H₂SO₄ ĐẶC 98%',
    iupacName: 'Sulfuric acid (conc. 98%)',
    nameVi: 'Axit sunfuric đặc (98%)',
    category: 'Axit đặc nguy hiểm',
    stateType: 'aqueous',
    defaultMolarity: 18.0,
    molarMass: 98.0,
    colorHex: '#fef3c7',
    opacity: 0.42,
    safetyNote:
      'CỰC KỲ NGUY HIỂM: Rót nước vào H₂SO₄ đặc sẽ gây sôi bắn nổ vỡ cốc và bốc cháy! Phải rót từ từ acid vào nước.',
    isHazardous: true,
  },
  {
    id: 'CHEM_03',
    formula: 'NaOH',
    displayFormula: 'NaOH 1.0M',
    iupacName: 'Sodium hydroxide',
    nameVi: 'Natri hiđroxit',
    category: 'Bazơ kiềm',
    stateType: 'aqueous',
    defaultMolarity: 1.0,
    molarMass: 40.0,
    colorHex: '#f1f5f9',
    opacity: 0.25,
    safetyNote: 'Base kiềm ăn mòn da; hòa tan kết tủa keo trắng Al(OH)₃ khi dùng dư.',
  },
  {
    id: 'CHEM_04',
    formula: 'BaCl2',
    displayFormula: 'BaCl₂ 0.5M',
    iupacName: 'Barium chloride',
    nameVi: 'Bari clorua',
    category: 'Muối',
    stateType: 'aqueous',
    defaultMolarity: 0.5,
    molarMass: 208.2,
    colorHex: '#f8fafc',
    opacity: 0.25,
    safetyNote: 'Độc nếu nuốt; thuốc thử nhận biết gốc Sulfate (=SO₄).',
  },
  {
    id: 'CHEM_05',
    formula: 'CuSO4',
    displayFormula: 'CuSO₄ 0.5M',
    iupacName: 'Copper(II) sulfate',
    nameVi: 'Đồng(II) sunfat',
    category: 'Muối',
    stateType: 'aqueous',
    defaultMolarity: 0.5,
    molarMass: 159.6,
    colorHex: '#0284c7',
    opacity: 0.72,
    safetyNote: 'Dung dịch xanh lam đặc trưng; tạo kết tủa xanh Cu(OH)₂ với kiềm.',
  },
  {
    id: 'CHEM_13',
    formula: 'AlCl3',
    displayFormula: 'AlCl₃ 0.5M',
    iupacName: 'Aluminium chloride',
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
    iupacName: 'Phenolphthalein indicator',
    nameVi: 'Phenolphtalein (pha cồn)',
    category: 'Chỉ thị màu',
    stateType: 'indicator',
    molarMass: 318.3,
    colorHex: '#fdf2f8',
    opacity: 0.2,
    safetyNote: 'Hóa hồng khi pH ≥ 8.3. Dung môi cồn dễ bắt lửa nếu đun khô quá nhiệt!',
  },
  {
    id: 'CHEM_11',
    formula: 'QuyTim',
    displayFormula: 'Quỳ tím (dd)',
    iupacName: 'Litmus solution',
    nameVi: 'Dung dịch Quỳ tím',
    category: 'Chỉ thị màu',
    stateType: 'indicator',
    molarMass: 300.0,
    colorHex: '#6366f1',
    opacity: 0.6,
    safetyNote: 'Hóa đỏ trong Acid (pH < 5), hóa xanh dương trong Base (pH > 8.3).',
  },
  {
    id: 'CHEM_06',
    formula: 'Al',
    displayFormula: 'Al (Lá nhôm)',
    iupacName: 'Aluminium',
    nameVi: 'Nhôm kim loại',
    category: 'Kim loại',
    stateType: 'solid',
    molarMass: 27.0,
    colorHex: '#cbd5e1',
    opacity: 1.0,
    safetyNote: 'Tan sủi bọt H₂ trong acid/kiềm. Không bật lửa trực tiếp khi khí H₂ thoát mạnh!',
  },
  {
    id: 'CHEM_08',
    formula: 'CaCO3',
    displayFormula: 'CaCO₃ (Đá vôi)',
    iupacName: 'Calcium carbonate',
    nameVi: 'Canxi cacbonat',
    category: 'Muối',
    stateType: 'solid',
    molarMass: 100.1,
    colorHex: '#f8fafc',
    opacity: 1.0,
    safetyNote: 'Chất rắn trắng không tan trong nước, sủi bọt khí Carbon dioxide (CO₂) khi gặp acid.',
  },
  {
    id: 'CHEM_09',
    formula: 'KMnO4',
    displayFormula: 'KMnO₄ (Tinh thể)',
    iupacName: 'Potassium permanganate',
    nameVi: 'Kali pemanganat',
    category: 'Muối oxi hóa',
    stateType: 'solid',
    molarMass: 158.0,
    colorHex: '#be185d',
    opacity: 1.0,
    safetyNote: 'Chất oxi hóa mạnh; nhiệt phân ở t° ≥ 200°C giải phóng khí Oxygen (O₂).',
  },
  {
    id: 'CHEM_07',
    formula: 'Na',
    displayFormula: 'Na (Kim loại kiềm)',
    iupacName: 'Sodium',
    nameVi: 'Natri kim loại',
    category: 'Kim loại kiềm',
    stateType: 'solid',
    molarMass: 23.0,
    colorHex: '#e2e8f0',
    opacity: 1.0,
    safetyNote:
      'NGUY HIỂM CHÁY NỔ: Chỉ được lấy mẩu nhỏ (0.1g)! Thả mẩu lớn (≥ 0.5g) vào nước sẽ NỔ VỠ CỐC & GÂY CHÁY!',
    isHazardous: true,
  },
];

export const SPECIES_NAMES: Record<string, string> = {
  H2O: 'Nước (H₂O)',
  HCl: 'Axit HCl',
  H2SO4: 'Axit H₂SO₄ loãng',
  H2SO4_dac: 'H₂SO₄ đặc 98%',
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
  shortName: string,
  subtitle: string,
  capacityMl: number,
  isHeatable: boolean
): VesselState {
  const base: VesselState = {
    id,
    name,
    shortName,
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
      isBroken: false,
    },
  };
  return recomputeDerivedProperties(base);
}

export function createDefaultWorkbenchVessels(): VesselState[] {
  return [
    createInitialVessel(
      'vessel-1',
      'Cốc A (Beaker 250ml)',
      'Cốc A',
      'Bình pha chế chính',
      250,
      false
    ),
    createInitialVessel(
      'vessel-2',
      'Cốc B (Beaker 250ml)',
      'Cốc B',
      'Bình trung gian / pha loãng',
      250,
      false
    ),
    createInitialVessel(
      'vessel-3',
      'Bình Nhiệt C (Đèn Cồn)',
      'Bình Nhiệt C',
      'Đặt trên kiềng Đèn Cồn (tới 270°C)',
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
  const hPlus =
    getMol(moles, 'HCl') +
    2 * getMol(moles, 'H2SO4') +
    2 * getMol(moles, 'H2SO4_dac');
  const ohMinus = getMol(moles, 'NaOH');
  const netAcid = hPlus - ohMinus;

  if (netAcid > 1e-5) {
    const concH = netAcid / volL;
    return Math.max(0.0, Math.min(6.9, -Math.log10(concH)));
  }
  if (netAcid < -1e-5) {
    const concOH = -netAcid / volL;
    const pOH = -Math.log10(concOH);
    return Math.max(7.1, Math.min(14.0, 14.0 - pOH));
  }

  const acidicSalt =
    getMol(moles, 'CuSO4') + getMol(moles, 'AlCl3') + getMol(moles, 'CuCl2');
  const basicSalt = getMol(moles, 'NaAlO2') + getMol(moles, 'K2MnO4');
  if (basicSalt > acidicSalt + 1e-4) return 9.8;
  if (acidicSalt > basicSalt + 1e-4) return 5.1;
  return 7.0;
}

export function recomputeDerivedProperties(vessel: VesselState): VesselState {
  const pH = computePH(vessel.moles, vessel.volumeMl);
  const volL = Math.max(0.01, vessel.volumeMl / 1000);

  let rgb: [number, number, number] = [219, 234, 254];
  let opacity = 0.24;

  // Concentrated H2SO4 oily pale amber tint
  if (getMol(vessel.moles, 'H2SO4_dac') > 0.01) {
    rgb = mixRgb(rgb, [253, 230, 138], 0.55);
    opacity = 0.44;
  }

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

  const kmno4Dissolved =
    vessel.volumeMl > 2 ? Math.min(getMol(vessel.moles, 'KMnO4'), 0.02 * volL * 10) / volL : 0;
  if (kmno4Dissolved > 0.001) {
    const w = Math.min(0.95, kmno4Dissolved * 8);
    rgb = mixRgb(rgb, [190, 24, 93], w);
    opacity = Math.max(opacity, 0.5 + w * 0.42);
  }

  const k2mno4Conc = getMol(vessel.moles, 'K2MnO4') / volL;
  if (k2mno4Conc > 0.002) {
    const w = Math.min(0.85, k2mno4Conc * 3.5);
    rgb = mixRgb(rgb, [5, 150, 105], w);
    opacity = Math.max(opacity, 0.45 + w * 0.35);
  }

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

  const pptColors: Record<string, [number, number, number]> = {
    BaSO4: [248, 250, 252],
    'Al(OH)3': [226, 232, 240],
    'Cu(OH)2': [14, 165, 233],
    CuO: [24, 24, 27],
    MnO2: [39, 39, 42],
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

  const fillRatio = vessel.visual.isBroken
    ? 0
    : Math.min(1, vessel.volumeMl / vessel.capacityMl);

  const visual: VesselVisualState = {
    liquidColorHex: rgbToHex(rgb[0], rgb[1], rgb[2]),
    liquidOpacity: opacity,
    fillRatio,
    precipitateColorHex: pptHex,
    precipitateHeightRatio: vessel.visual.isBroken ? 0 : pptRatio,
    solidChunkColorHex: vessel.visual.isBroken ? null : solidColor,
    solidChunkScale:
      !vessel.visual.isBroken && totalSolidMoles > EPS
        ? Math.min(1, 0.3 + totalSolidMoles * 8)
        : 0,
    bubbleRate: vessel.visual.isBroken ? 0 : bubbleRate,
    steamRate,
    isSparking: vessel.visual.isSparking,
    isBroken: vessel.visual.isBroken,
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
  amount: number
): {
  nextVessel: VesselState;
  log: ReactionLogEntry;
  hazard: HazardTriggerInfo | null;
} {
  if (vessel.visual.isBroken) {
    const now = new Date().toLocaleTimeString('vi-VN', { hour12: false });
    return {
      nextVessel: vessel,
      log: {
        id: `${Date.now()}-broken`,
        timestamp: now,
        vesselName: vessel.name,
        equation: 'Bình đã bị nứt vỡ!',
        phenomenon: 'Hãy ra Bồn Rửa hoặc bấm Thay Bình Mới trước khi pha tiếp.',
        type: 'hazard',
      },
      hazard: null,
    };
  }

  const nextMoles = { ...vessel.moles };
  let nextVolume = vessel.volumeMl;
  let nextTemp = vessel.temperatureC;
  let logText = '';
  let directHazard: HazardTriggerInfo | null = null;
  let brokeVessel = false;

  // CHECK CRITICAL RULE: Pouring Water / Dilute Aqueous INTO Concentrated H2SO4!
  const existingConcAcid = getMol(nextMoles, 'H2SO4_dac');
  const isAddingWaterBased =
    chem.formula !== 'H2SO4_dac' &&
    (chem.stateType === 'liquid' || chem.stateType === 'aqueous');

  if (existingConcAcid >= 0.05 && isAddingWaterBased && amount >= 5) {
    directHazard = {
      code: 'ACID_DILUTION_BLAST',
      title: 'NỔ SÔI AXIT ĐẶC — Rót Nước Vào H₂SO₄ Đặc 98%!',
      chemicalExplanation:
        'SAI QUY TẮC AN TOÀN NGHIÊM TRỌNG: Nước nhẹ hơn H₂SO₄ đặc nên nổi lên trên và sôi bùng tức thời do nhiệt hydrat hóa cực lớn, làm nổ vỡ cốc thủy tinh, bắn axit đặc gây bỏng nặng và bốc cháy bàn thí nghiệm! Quy tắc chuẩn: Phải rót từ từ từng tia nhỏ axit đặc vào cốc đã có sẵn nhiều nước.',
      exploded: true,
    };
    brokeVessel = true;
    nextVolume = 0;
    nextTemp = 195;
  }

  // CHECK SAFE DILUTION: Pouring H2SO4_dac into plentiful water -> converts safely to H2SO4 + heat!
  if (!brokeVessel) {
    if (chem.formula === 'H2SO4_dac') {
      const addMl = Math.min(amount, vessel.capacityMl - vessel.volumeMl);
      const actualMl = Math.max(0, addMl);
      const addedMol = 18.0 * (actualMl / 1000);
      nextVolume += actualMl;

      if (vessel.volumeMl >= 15 && existingConcAcid < 0.02) {
        // Safely diluted into H2SO4!
        addMol(nextMoles, 'H2SO4', addedMol);
        nextTemp += Math.min(62, (addedMol * 42000) / Math.max(25, nextVolume));
        logText = `Đã rót từ từ +${actualMl.toFixed(0)} ml H₂SO₄ đặc vào nước: pha loãng an toàn, dung dịch nóng lên ${nextTemp.toFixed(0)}°C.`;
      } else {
        // Vessel now holds raw concentrated H2SO4!
        addMol(nextMoles, 'H2SO4_dac', addedMol);
        logText = `⚠️ Bình đang chứa +${actualMl.toFixed(0)} ml H₂SO₄ ĐẶC 98% nguyên chất! Tuyệt đối không đổ nước trực tiếp vào bình này!`;
      }
    } else if (chem.stateType === 'liquid') {
      const addMl = Math.min(amount, vessel.capacityMl - vessel.volumeMl);
      nextVolume += Math.max(0, addMl);
      addMol(nextMoles, 'H2O', Math.max(0, addMl) / 18.0);
      logText = `Đã rót +${addMl.toFixed(0)} ml ${chem.nameVi}`;
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
      logText = `Đã nhỏ ${actualMl.toFixed(1)} ml chỉ thị ${chem.nameVi}`;
    } else {
      const addedMol = amount / chem.molarMass;
      addMol(nextMoles, chem.formula, addedMol);
      logText = `Đã thả +${amount.toFixed(2)} g ${chem.displayFormula} (${addedMol.toFixed(4)} mol)`;
    }
  }

  let updated: VesselState = {
    ...vessel,
    volumeMl: brokeVessel ? 0 : nextVolume,
    temperatureC: nextTemp,
    moles: brokeVessel ? {} : nextMoles,
    visual: {
      ...vessel.visual,
      isBroken: brokeVessel,
    },
  };

  const sim = stepVesselSimulation(updated, 0.06);
  updated = sim.nextVessel;
  const finalHazard = directHazard || sim.hazard;

  const now = new Date().toLocaleTimeString('vi-VN', { hour12: false });
  const log: ReactionLogEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: now,
    vesselName: vessel.shortName,
    equation:
      finalHazard?.title ||
      sim.triggeredEquations[0] ||
      `${chem.displayFormula} → ${vessel.shortName}`,
    phenomenon: finalHazard?.chemicalExplanation || sim.phenomena[0] || logText,
    type: finalHazard ? 'hazard' : sim.triggeredEquations.length > 0 ? 'reaction' : 'info',
  };

  return { nextVessel: updated, log, hazard: finalHazard };
}

export function pourBetweenVessels(
  source: VesselState,
  target: VesselState,
  pourMl: number
): {
  nextSource: VesselState;
  nextTarget: VesselState;
  log: ReactionLogEntry | null;
  hazard: HazardTriggerInfo | null;
} {
  if (source.visual.isBroken || target.visual.isBroken) {
    return { nextSource: source, nextTarget: target, log: null, hazard: null };
  }

  const totalSourceMoles = Object.values(source.moles).reduce((a, b) => a + b, 0);
  if (source.volumeMl <= 0.2 && totalSourceMoles <= EPS) {
    return { nextSource: source, nextTarget: target, log: null, hazard: null };
  }

  const availableSpace = Math.max(0, target.capacityMl - target.volumeMl);
  const actualLiquidPour =
    source.volumeMl > 0.2 ? Math.min(pourMl, source.volumeMl, availableSpace) : 0;
  const fraction =
    source.volumeMl > 0.2 ? actualLiquidPour / source.volumeMl : Math.min(1, pourMl / 50);

  if (fraction <= 0.001) {
    return { nextSource: source, nextTarget: target, log: null, hazard: null };
  }

  // Check if pouring dilute/water vessel onto concentrated H2SO4 in target!
  const targetConcAcid = getMol(target.moles, 'H2SO4_dac');
  const sourceIsWatery =
    source.volumeMl >= 5 && getMol(source.moles, 'H2SO4_dac') < 0.01;

  if (targetConcAcid >= 0.05 && sourceIsWatery) {
    const srcMoles = { ...source.moles };
    for (const [sp, m] of Object.entries(source.moles)) {
      addMol(srcMoles, sp, -m * fraction);
    }
    const nextSource = recomputeDerivedProperties({
      ...source,
      volumeMl: Math.max(0, source.volumeMl - actualLiquidPour),
      moles: srcMoles,
    });
    const nextTarget = recomputeDerivedProperties({
      ...target,
      volumeMl: 0,
      temperatureC: 190,
      moles: {},
      visual: { ...target.visual, isBroken: true },
    });
    const hazard: HazardTriggerInfo = {
      code: 'ACID_DILUTION_BLAST',
      title: 'NỔ VỠ CỐC — Đổ Nước Sang Cốc Chứa H₂SO₄ Đặc!',
      chemicalExplanation:
        'Bạn vừa rót dung dịch nước từ ' +
        source.shortName +
        ' sang ' +
        target.shortName +
        ' đang chứa H₂SO₄ đặc 98%! Sôi bắn mãnh liệt làm vỡ cốc và bén lửa cháy bàn!',
      exploded: true,
    };
    return {
      nextSource,
      nextTarget,
      log: {
        id: `${Date.now()}-pour-blast`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour12: false }),
        vesselName: `${source.shortName} → ${target.shortName}`,
        equation: hazard.title,
        phenomenon: hazard.chemicalExplanation,
        type: 'hazard',
      },
      hazard,
    };
  }

  const srcMoles = { ...source.moles };
  const dstMoles = { ...target.moles };

  for (const [sp, m] of Object.entries(source.moles)) {
    const moved = m * fraction;
    addMol(srcMoles, sp, -moved);
    if (sp === 'H2SO4_dac' && target.volumeMl >= 15 && targetConcAcid < 0.01) {
      addMol(dstMoles, 'H2SO4', moved);
    } else {
      addMol(dstMoles, sp, moved);
    }
  }

  const newTargetVol = target.volumeMl + actualLiquidPour;
  const dilutionHeat =
    getMol(source.moles, 'H2SO4_dac') > 0.02 && target.volumeMl >= 15 ? 35 : 0;
  const mixedTemp =
    newTargetVol > 0.5
      ? (target.volumeMl * target.temperatureC + actualLiquidPour * source.temperatureC) /
          newTargetVol +
        dilutionHeat
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
    0.06
  );

  const now = new Date().toLocaleTimeString('vi-VN', { hour12: false });
  const log: ReactionLogEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: now,
    vesselName: `${source.shortName} → ${target.shortName}`,
    equation:
      simTarget.triggeredEquations[0] ||
      `Rót ${actualLiquidPour.toFixed(0)} ml (${source.shortName} → ${target.shortName})`,
    phenomenon:
      simTarget.phenomena[0] ||
      `Đã rót ${actualLiquidPour.toFixed(0)} ml sang ${target.shortName}.`,
    type: simTarget.hazard
      ? 'hazard'
      : simTarget.triggeredEquations.length > 0
      ? 'reaction'
      : 'info',
  };

  return {
    nextSource,
    nextTarget: simTarget.nextVessel,
    log,
    hazard: simTarget.hazard,
  };
}

export function stepVesselSimulation(
  vessel: VesselState,
  dt: number
): {
  nextVessel: VesselState;
  triggeredEquations: string[];
  phenomena: string[];
  hazard: HazardTriggerInfo | null;
} {
  if (vessel.visual.isBroken) {
    return {
      nextVessel: vessel,
      triggeredEquations: [],
      phenomena: [],
      hazard: null,
    };
  }

  const moles = { ...vessel.moles };
  let temp = vessel.temperatureC;
  let volMl = vessel.volumeMl;
  const recentGas: Record<string, number> = {};
  const totalGas = { ...vessel.totalGasEvolved };
  const equations: string[] = [];
  const phenomena: string[] = [];
  let isSparking = false;
  let isBroken = false;
  let hazard: HazardTriggerInfo | null = null;

  const recordEq = (eq: string, phenom?: string) => {
    if (!equations.includes(eq)) equations.push(eq);
    if (phenom && !phenomena.includes(phenom)) phenomena.push(phenom);
  };

  const emitGas = (gasFormula: string, molAmount: number) => {
    if (molAmount <= EPS) return;
    recentGas[gasFormula] = (recentGas[gasFormula] || 0) + molAmount;
    totalGas[gasFormula] = (totalGas[gasFormula] || 0) + molAmount;
  };

  // --- 1. THERMAL HEATING & OVERHEAT CHECK ---
  if (vessel.isHeatable && vessel.burnerOn) {
    const targetMaxTemp = vessel.burnerLevel === 1 ? 95 : vessel.burnerLevel === 2 ? 175 : 275;
    const heatRate = vessel.burnerLevel === 1 ? 7.0 : vessel.burnerLevel === 2 ? 15.0 : 28.0;
    if (temp < targetMaxTemp) {
      temp = Math.min(targetMaxTemp, temp + heatRate * dt);
    }
    if (volMl > 1.5 && temp > 100.5) {
      const evapMl = Math.min(volMl - 0.5, 2.2 * vessel.burnerLevel * dt);
      volMl -= evapMl;
      addMol(moles, 'H2O', -evapMl / 18.0);
      temp = 100.0 + (temp - 100.0) * 0.35;
    }

    // WRONG ACTION #4: Overheating empty glass or alcohol indicator past 255°C!
    const hasThermalSolid =
      getMol(moles, 'KMnO4') > EPS ||
      getMol(moles, 'Cu(OH)2') > EPS ||
      getMol(moles, 'CuO') > EPS ||
      getMol(moles, 'MnO2') > EPS;

    if (temp >= 255 && volMl < 2.0 && !hasThermalSolid) {
      isBroken = true;
      volMl = 0;
      hazard = {
        code: 'OVERHEAT_RUPTURE',
        title: 'NỨT VỠ BÌNH THỦY TINH & BẮT LỬA CỒN!',
        chemicalExplanation:
          'Bạn đã đun ngọn lửa đèn cồn cực đại dưới bình rỗng/cạn dung dịch vượt 255°C! Thủy tinh giãn nở nhiệt đột ngột gây nổ vỡ bình và làm ngọn lửa đèn cồn lan ra bàn thí nghiệm!',
        exploded: true,
      };
    }
  } else {
    temp += (25.0 - temp) * Math.min(1, 0.14 * dt);
  }

  const heatCapacityFactor = Math.max(25, volMl);

  // --- 2. INSTANT AQUEOUS EQUILIBRIA ---
  if (!isBroken && volMl > 0.5) {
    const nNeut1 = Math.min(getMol(moles, 'HCl'), getMol(moles, 'NaOH'));
    if (nNeut1 > EPS) {
      addMol(moles, 'HCl', -nNeut1);
      addMol(moles, 'NaOH', -nNeut1);
      addMol(moles, 'NaCl', nNeut1);
      addMol(moles, 'H2O', nNeut1);
      temp += (nNeut1 * 13500) / heatCapacityFactor;
      recordEq('HCl + NaOH → NaCl + H₂O', 'Trung hòa axit - bazơ tỏa nhiệt nhẹ.');
    }

    const nNeut2 = Math.min(getMol(moles, 'H2SO4'), getMol(moles, 'NaOH') / 2);
    if (nNeut2 > EPS) {
      addMol(moles, 'H2SO4', -nNeut2);
      addMol(moles, 'NaOH', -2 * nNeut2);
      addMol(moles, 'Na2SO4', nNeut2);
      addMol(moles, 'H2O', 2 * nNeut2);
      temp += (nNeut2 * 27000) / heatCapacityFactor;
      recordEq('H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O', 'Trung hòa H₂SO₄ bằng NaOH.');
    }

    const nBa1 = Math.min(getMol(moles, 'BaCl2'), getMol(moles, 'H2SO4'));
    if (nBa1 > EPS) {
      addMol(moles, 'BaCl2', -nBa1);
      addMol(moles, 'H2SO4', -nBa1);
      addMol(moles, 'BaSO4', nBa1);
      addMol(moles, 'HCl', 2 * nBa1);
      recordEq('BaCl₂ + H₂SO₄ → BaSO₄↓ (trắng) + 2HCl', 'Tạo kết tủa trắng bền BaSO₄.');
    }

    const nBa2 = Math.min(getMol(moles, 'BaCl2'), getMol(moles, 'Na2SO4'));
    if (nBa2 > EPS) {
      addMol(moles, 'BaCl2', -nBa2);
      addMol(moles, 'Na2SO4', -nBa2);
      addMol(moles, 'BaSO4', nBa2);
      addMol(moles, 'NaCl', 2 * nBa2);
      recordEq('BaCl₂ + Na₂SO₄ → BaSO₄↓ (trắng) + 2NaCl', 'Tạo kết tủa trắng BaSO₄.');
    }

    const nBa3 = Math.min(getMol(moles, 'BaCl2'), getMol(moles, 'CuSO4'));
    if (nBa3 > EPS) {
      addMol(moles, 'BaCl2', -nBa3);
      addMol(moles, 'CuSO4', -nBa3);
      addMol(moles, 'BaSO4', nBa3);
      addMol(moles, 'CuCl2', nBa3);
      recordEq('BaCl₂ + CuSO₄ → BaSO₄↓ + CuCl₂', 'Tạo kết tủa trắng BaSO₄.');
    }

    const nCuPpt = Math.min(getMol(moles, 'CuSO4'), getMol(moles, 'NaOH') / 2);
    if (nCuPpt > EPS) {
      addMol(moles, 'CuSO4', -nCuPpt);
      addMol(moles, 'NaOH', -2 * nCuPpt);
      addMol(moles, 'Cu(OH)2', nCuPpt);
      addMol(moles, 'Na2SO4', nCuPpt);
      recordEq('CuSO₄ + 2NaOH → Cu(OH)₂↓ (xanh lam) + Na₂SO₄', 'Tạo kết tủa xanh lam Cu(OH)₂.');
    }

    const nCuDiss1 = Math.min(getMol(moles, 'Cu(OH)2'), getMol(moles, 'HCl') / 2);
    if (nCuDiss1 > EPS) {
      addMol(moles, 'Cu(OH)2', -nCuDiss1);
      addMol(moles, 'HCl', -2 * nCuDiss1);
      addMol(moles, 'CuCl2', nCuDiss1);
      addMol(moles, 'H2O', 2 * nCuDiss1);
      recordEq('Cu(OH)₂ + 2HCl → CuCl₂ + 2H₂O', 'Kết tủa xanh tan trong axit HCl.');
    }

    // Amphoteric Al(OH)3
    const nAlPpt = Math.min(getMol(moles, 'AlCl3'), getMol(moles, 'NaOH') / 3);
    if (nAlPpt > EPS) {
      addMol(moles, 'AlCl3', -nAlPpt);
      addMol(moles, 'NaOH', -3 * nAlPpt);
      addMol(moles, 'Al(OH)3', nAlPpt);
      addMol(moles, 'NaCl', 3 * nAlPpt);
      recordEq('AlCl₃ + 3NaOH → Al(OH)₃↓ (keo trắng) + 3NaCl', 'Tạo kết tủa keo trắng Al(OH)₃.');
    }

    const nAlExcessBase = Math.min(getMol(moles, 'Al(OH)3'), getMol(moles, 'NaOH'));
    if (nAlExcessBase > EPS) {
      addMol(moles, 'Al(OH)3', -nAlExcessBase);
      addMol(moles, 'NaOH', -nAlExcessBase);
      addMol(moles, 'NaAlO2', nAlExcessBase);
      addMol(moles, 'H2O', 2 * nAlExcessBase);
      recordEq('Al(OH)₃↓ + NaOH (dư) → NaAlO₂ + 2H₂O', 'NaOH dư hòa tan kết tủa keo trắng!');
    }

    const nAlReppt = Math.min(getMol(moles, 'NaAlO2'), getMol(moles, 'HCl'));
    if (nAlReppt > EPS) {
      addMol(moles, 'NaAlO2', -nAlReppt);
      addMol(moles, 'HCl', -nAlReppt);
      addMol(moles, 'Al(OH)3', nAlReppt);
      addMol(moles, 'NaCl', nAlReppt);
      recordEq('NaAlO₂ + HCl + H₂O → Al(OH)₃↓ + NaCl', 'Tái tạo kết tủa keo trắng Al(OH)₃.');
    }

    const nAlDissAcid = Math.min(getMol(moles, 'Al(OH)3'), getMol(moles, 'HCl') / 3);
    if (nAlDissAcid > EPS) {
      addMol(moles, 'Al(OH)3', -nAlDissAcid);
      addMol(moles, 'HCl', -3 * nAlDissAcid);
      addMol(moles, 'AlCl3', nAlDissAcid);
      addMol(moles, 'H2O', 3 * nAlDissAcid);
      recordEq('Al(OH)₃↓ + 3HCl (dư) → AlCl₃ + 3H₂O', 'Axit dư hòa tan kết tủa Al(OH)₃.');
    }
  }

  // --- 3. KINETIC SOLID/GAS & EXPLOSIVE HAZARDS ---
  if (!isBroken) {
    // WRONG ACTION #2: Excess Metallic Sodium in Water/Acid (>= 0.018 mol ~ 0.42g) -> EXPLOSION & FIRE!
    const naMol = getMol(moles, 'Na');
    if (naMol > EPS && volMl > 1.0) {
      isSparking = true;
      const inStrongAcid = getMol(moles, 'HCl') > 0.005 || getMol(moles, 'H2SO4') > 0.005;
      if (naMol >= 0.018 || inStrongAcid) {
        isBroken = true;
        volMl = 0;
        hazard = {
          code: 'SODIUM_BLAST',
          title: inStrongAcid
            ? 'NỔ DỮ DỘI — Thả Kim Loại Kiềm Natri Vào Axit!'
            : 'NỔ KIM LOẠI KIỀM — Thả Mẩu Natri Quá Lớn (≥ 0.5g) Vào Nước!',
          chemicalExplanation:
            'Phản ứng 2Na + 2H₂O → 2NaOH + H₂↑ tỏa nhiệt cực lớn trong tích tắc! Khí Hiđro (H₂) sinh ra trộn với Oxi không khí gặp nhiệt độ cao phát nổ mạnh làm vỡ tung cốc thủy tinh và gây cháy bàn thí nghiệm!',
          exploded: true,
        };
      } else {
        const rateNa = Math.min(naMol, (0.012 + naMol * 0.85) * dt);
        if (rateNa > EPS) {
          addMol(moles, 'Na', -rateNa);
          addMol(moles, 'NaOH', rateNa);
          emitGas('H2', 0.5 * rateNa);
          temp += (rateNa * 165000) / heatCapacityFactor;
          recordEq('2Na + 2H₂O → 2NaOH + H₂↑', 'Mẩu nhỏ Natri chạy trên mặt nước, sủi khí H₂.');
        }
      }
    }

    // Aluminum + HCl -> H2 gas
    const alMol = getMol(moles, 'Al');
    const hclMol = getMol(moles, 'HCl');
    if (!isBroken && alMol > EPS && hclMol > EPS && volMl > 1.0) {
      const tempBoost = 1 + Math.max(0, temp - 25) * 0.04;
      const reactedAl = Math.min(alMol, hclMol / 3, 0.0048 * tempBoost * dt);
      if (reactedAl > EPS) {
        addMol(moles, 'Al', -reactedAl);
        addMol(moles, 'HCl', -3 * reactedAl);
        addMol(moles, 'AlCl3', reactedAl);
        emitGas('H2', 1.5 * reactedAl);
        temp += (reactedAl * 125000) / heatCapacityFactor;
        recordEq('2Al + 6HCl → 2AlCl₃ + 3H₂↑', 'Lá nhôm tan, sủi bọt khí H₂ liên tục.');
      }
    }

    // Aluminum + NaOH -> H2 gas
    const alMol2 = getMol(moles, 'Al');
    const naohMol = getMol(moles, 'NaOH');
    if (!isBroken && alMol2 > EPS && naohMol > EPS && volMl > 1.0) {
      const reactedAl = Math.min(alMol2, naohMol, 0.0038 * dt);
      if (reactedAl > EPS) {
        addMol(moles, 'Al', -reactedAl);
        addMol(moles, 'NaOH', -reactedAl);
        addMol(moles, 'NaAlO2', reactedAl);
        emitGas('H2', 1.5 * reactedAl);
        recordEq('2Al + 2NaOH + 2H₂O → 2NaAlO₂ + 3H₂↑', 'Nhôm tan trong kiềm giải phóng H₂.');
      }
    }

    // WRONG ACTION #3: Open Bunsen Flame under Vigorous H2 Gas Evolution!
    if (
      !isBroken &&
      vessel.isHeatable &&
      vessel.burnerOn &&
      (recentGas['H2'] || 0) > 0.00025 &&
      temp >= 55
    ) {
      isBroken = true;
      volMl = 0;
      hazard = {
        code: 'HYDROGEN_FIRE',
        title: 'NỔ HỖN HỢP KHÍ HIĐRO — Đưa Ngọn Lửa Gần Bình Đang Thoát Khí H₂!',
        chemicalExplanation:
          'Khí Hiđro (H₂) thoát ra mạnh từ miệng bình trộn lẫn với khí O₂ trong không khí tạo hỗn hợp nổ (tỉ lệ 2:1). Ngọn lửa đèn cồn bên dưới đã kích nổ phản ứng 2H₂ + O₂ → 2H₂O gây cháy lan trên mặt bàn!',
        exploded: true,
      };
    }

    // CaCO3 + HCl -> CO2
    const caco3Mol = getMol(moles, 'CaCO3');
    const hclForCarb = getMol(moles, 'HCl');
    if (!isBroken && caco3Mol > EPS && hclForCarb > EPS && volMl > 1.0) {
      const reactedCarb = Math.min(caco3Mol, hclForCarb / 2, 0.0075 * dt);
      if (reactedCarb > EPS) {
        addMol(moles, 'CaCO3', -reactedCarb);
        addMol(moles, 'HCl', -2 * reactedCarb);
        addMol(moles, 'CaCl2', reactedCarb);
        addMol(moles, 'H2O', reactedCarb);
        emitGas('CO2', reactedCarb);
        recordEq('CaCO₃ + 2HCl → CaCl₂ + CO₂↑ + H₂O', 'Đá vôi tan sủi bọt khí CO₂.');
      }
    }

    // Cu(OH)2 thermal decomposition >= 80°C
    const cuoh2Mol = getMol(moles, 'Cu(OH)2');
    if (!isBroken && cuoh2Mol > EPS && temp >= 80.0) {
      const decomposed = Math.min(cuoh2Mol, 0.0028 * (1 + (temp - 80) * 0.12) * dt);
      if (decomposed > EPS) {
        addMol(moles, 'Cu(OH)2', -decomposed);
        addMol(moles, 'CuO', decomposed);
        addMol(moles, 'H2O', decomposed);
        recordEq('Cu(OH)₂ —(t° ≥ 80°C)→ CuO↓ (đen) + H₂O', 'Kết tủa xanh hóa đen CuO.');
      }
    }

    // KMnO4 thermal decomposition >= 200°C
    const kmno4Mol = getMol(moles, 'KMnO4');
    if (!isBroken && kmno4Mol > EPS && temp >= 200.0) {
      const decomposed = Math.min(kmno4Mol, 0.0032 * (1 + (temp - 200) * 0.08) * dt);
      if (decomposed > EPS) {
        addMol(moles, 'KMnO4', -decomposed);
        addMol(moles, 'K2MnO4', 0.5 * decomposed);
        addMol(moles, 'MnO2', 0.5 * decomposed);
        emitGas('O2', 0.5 * decomposed);
        recordEq('2KMnO₄ —(t° ≥ 200°C)→ K₂MnO₄ + MnO₂ + O₂↑', 'Thuốc tím nhiệt phân sinh O₂.');
      }
    }
  }

  const nextState: VesselState = recomputeDerivedProperties({
    ...vessel,
    burnerOn: isBroken ? false : vessel.burnerOn,
    temperatureC: Math.round(temp * 10) / 10,
    volumeMl: isBroken ? 0 : Math.round(volMl * 10) / 10,
    moles: isBroken ? {} : moles,
    recentGas: isBroken ? {} : recentGas,
    totalGasEvolved: totalGas,
    activeEquations: equations.length > 0 ? equations : vessel.activeEquations,
    visual: {
      ...vessel.visual,
      isSparking: isBroken ? false : isSparking,
      isBroken,
    },
  });

  return {
    nextVessel: nextState,
    triggeredEquations: equations,
    phenomena,
    hazard,
  };
}

export const GUIDED_LESSONS: GuidedLesson[] = [
  // ======================== KHỐI LỚP 8 (KHTN 8 — GDPT 2018) ========================
  {
    id: 'LES_G8_ACID_BASE_1',
    grade: 'Lớp 8',
    orderInGrade: 1,
    chapterTitle: 'Chương 1 • Acid – Base – Thang pH & Chất chỉ thị',
    title: 'Chặng 1: Nhận biết Acid & Base bằng Chỉ thị Màu & Phản ứng Trung hòa',
    summary:
      'Khám phá sự đổi màu của Phenolphthalein (Phenolphtalein) trong môi trường Base (Sodium hydroxide • Natri hiđroxit) và thực hiện phản ứng trung hòa với Hydrochloric acid (Axit clohiđric).',
    keyEquations: [
      'NaOH (pH ≈ 13.5) + Phenolphthalein → Dung dịch hóa hồng cánh sen',
      'NaOH + HCl → NaCl (Sodium chloride • Natri clorua) + H₂O',
    ],
    theoryPoints: [
      'Dung dịch Base (kiềm) như Sodium hydroxide (NaOH • Natri hiđroxit) có pH > 7, làm Phenolphthalein không màu chuyển sang màu hồng đậm và làm Quỳ tím (Litmus) hóa xanh.',
      'Dung dịch Acid như Hydrochloric acid (HCl • Axit clohiđric) có pH < 7, làm Quỳ tím hóa đỏ.',
      'Khi rót đủ HCl vào dung dịch NaOH đang có màu hồng Phenolphthalein, phản ứng trung hòa tạo muối Sodium chloride (NaCl) và nước làm dung dịch mất màu hồng đúng tại vùng pH ≤ 8.2.',
    ],
    safetyWarning:
      'Sodium hydroxide (NaOH) ăn mòn và làm trơn nhờn da tay; Hydrochloric acid (HCl) gây bỏng rát. Không đun khô dung dịch chỉ thị cồn trên ngọn lửa lớn.',
    xpReward: 120,
    recommendedReagents: ['NaOH', 'Phenolphtalein', 'HCl'],
    steps: [
      {
        id: 'g8-1-s1',
        instruction:
          'Đi tới Tủ Hóa Chất [F] lấy NaOH, Phenolphtalein & HCl, sau đó rót ≥ 15 ml NaOH 1.0M vào Cốc A.',
        hint: 'Bấm "Tới Tủ Hóa Chất", nhặt NaOH, Phenolphtalein, HCl vào thanh đồ rồi quay lại Bàn Lab rót +15 ml NaOH vào Cốc A.',
        checkCondition: (vessels) =>
          vessels.some((v) => (v.moles['NaOH'] || 0) >= 0.012 || (v.moles['NaCl'] || 0) >= 0.01),
      },
      {
        id: 'g8-1-s2',
        instruction:
          'Nhỏ chỉ thị Phenolphthalein (+0.5 ml hoặc +1.5 ml) vào Cốc A để quan sát dung dịch hóa màu hồng cánh sen.',
        hint: 'Chọn lọ Phenolphtalein trên thanh công cụ dưới đáy màn hình và bấm "+0.5ml (1 giọt)".',
        checkCondition: (vessels) =>
          vessels.some((v) => (v.moles['Phenolphtalein'] || 0) > 1e-5 && v.pH >= 8.2),
      },
      {
        id: 'g8-1-s3',
        instruction:
          'Rót Hydrochloric acid (HCl 1.0M, +15 ml hoặc +50 ml) vào Cốc A để trung hòa hết NaOH, làm dung dịch mất màu hồng (pH ≤ 7.5).',
        hint: 'Chọn lọ HCl 1.0M và nhấn "+15 ml" (hoặc thêm nữa) cho tới khi màu hồng biến mất hoàn toàn.',
        checkCondition: (vessels) =>
          vessels.some(
            (v) =>
              (v.moles['Phenolphtalein'] || 0) > 1e-5 &&
              (v.moles['NaCl'] || 0) >= 0.012 &&
              v.pH <= 7.5
          ),
      },
    ],
    quiz: [
      {
        id: 'g8-1-q1',
        question:
          'Nhỏ vài giọt Phenolphthalein vào dung dịch Sodium hydroxide (NaOH • Natri hiđroxit), dung dịch chuyển sang màu gì?',
        options: ['Màu xanh lam', 'Màu hồng cánh sen', 'Màu vàng nhạt', 'Không đổi màu'],
        correctIndex: 1,
        explanation:
          'Trong môi trường Base kiềm (pH ≥ 8.3), chỉ thị Phenolphthalein chuyển sang màu hồng đặc trưng.',
      },
      {
        id: 'g8-1-q2',
        question:
          'Vì sao khi nhỏ tiếp Hydrochloric acid (HCl) tới dư vào cốc NaOH có Phenolphthalein thì màu hồng biến mất?',
        options: [
          'Do HCl làm bay hơi chất chỉ thị',
          'Do phản ứng trung hòa NaOH + HCl → NaCl + H₂O làm hết môi trường kiềm (pH giảm về ≤ 7)',
          'Do tạo kết tủa trắng che khuất màu hồng',
          'Do nhiệt độ giảm xuống dưới 0°C',
        ],
        correctIndex: 1,
        explanation:
          'HCl trung hòa hoàn toàn OH⁻ của NaOH tạo muối trung tính Sodium chloride (NaCl) và nước.',
      },
    ],
  },
  {
    id: 'LES_G8_GAS_EXOTHERMIC_2',
    grade: 'Lớp 8',
    orderInGrade: 2,
    chapterTitle: 'Chương 2 • Phản ứng Hóa học & Biến thiên Năng lượng',
    title: 'Chặng 2: Phản ứng Tỏa nhiệt & Giải phóng Khí (H₂, CO₂)',
    summary:
      'Thực chứng dấu hiệu tạo thành chất khí và sự tăng nhiệt độ trong phản ứng giữa Kim loại Aluminium (Nhôm) và muối Calcium carbonate (Đá vôi) với dung dịch Acid.',
    keyEquations: [
      '2Al + 6HCl → 2AlCl₃ (Aluminium chloride) + 3H₂↑ (Tỏa nhiệt)',
      'CaCO₃ (Calcium carbonate) + 2HCl → CaCl₂ + CO₂↑ + H₂O',
    ],
    theoryPoints: [
      'Dấu hiệu nhận biết phản ứng hóa học xảy ra gồm: sủi bọt khí, xuất hiện kết tủa, đổi màu sắc hoặc tỏa nhiệt/thu nhiệt.',
      'Aluminium (Al • Nhôm) tác dụng với Hydrochloric acid (HCl) giải phóng khí Hydrogen (H₂↑) không màu và tỏa nhiều nhiệt làm cốc ấm lên.',
      'Calcium carbonate (CaCO₃ • Canxi cacbonat / Đá vôi) tan trong dung dịch HCl sủi bọt mạnh khí Carbon dioxide (CO₂↑).',
    ],
    safetyWarning:
      'TUYỆT ĐỐI KHÔNG bật Đèn Cồn ngay dưới bình đang thoát mạnh khí Hydrogen (H₂) vì hỗn hợp H₂ + O₂ sẽ phát nổ mạnh!',
    xpReward: 140,
    recommendedReagents: ['HCl', 'Al', 'CaCO3'],
    steps: [
      {
        id: 'g8-2-s1',
        instruction:
          'Lấy HCl, Al (Lá nhôm) và CaCO₃ (Đá vôi) từ Tủ Hóa Chất. Rót ≥ 50 ml HCl 1.0M vào Cốc A.',
        hint: 'Đi tới Tủ Hóa Chất [F] lấy HCl, Al, CaCO₃ rồi rót +50 ml HCl vào Cốc A.',
        checkCondition: (vessels) =>
          vessels.some((v) => (v.moles['HCl'] || 0) >= 0.03 || (v.moles['AlCl3'] || 0) >= 0.004),
      },
      {
        id: 'g8-2-s2',
        instruction:
          'Thả mẩu Aluminium (Al • Lá nhôm +0.25g) vào Cốc A chứa HCl, quan sát bọt khí Hydrogen (H₂) sủi lên và nhiệt độ tăng!',
        hint: 'Cầm lọ Al trên thanh đồ và bấm "+0.25g" vào Cốc A, chờ vài giây để nhôm phản ứng sinh khí H₂.',
        checkCondition: (vessels) =>
          vessels.some(
            (v) => (v.totalGasEvolved['H2'] || 0) >= 0.002 && v.temperatureC >= 28.0
          ),
      },
      {
        id: 'g8-2-s3',
        instruction:
          'Sang Cốc B: Rót ≥ 15 ml HCl 1.0M rồi thả Calcium carbonate (CaCO₃ • Đá vôi +0.25g) để thu khí Carbon dioxide (CO₂↑).',
        hint: 'Chọn Cốc B trên thanh Bàn Lab, rót +15 ml HCl rồi thả +0.25g CaCO₃.',
        checkCondition: (vessels) =>
          vessels.some((v) => (v.totalGasEvolved['CO2'] || 0) >= 0.001),
      },
    ],
    quiz: [
      {
        id: 'g8-2-q1',
        question:
          'Khi thả lá Aluminium (Al • Nhôm) vào dung dịch Hydrochloric acid (HCl), khí nào thoát ra và nhiệt độ dung dịch thay đổi ra sao?',
        options: [
          'Khí Oxygen (O₂), dung dịch lạnh đi',
          'Khí Hydrogen (H₂), dung dịch nóng lên do phản ứng tỏa nhiệt',
          'Khí Carbon dioxide (CO₂), nhiệt độ không đổi',
          'Khí Chlorine (Cl₂), dung dịch đóng băng',
        ],
        correctIndex: 1,
        explanation:
          'Phản ứng 2Al + 6HCl → 2AlCl₃ + 3H₂↑ là phản ứng tỏa nhiệt mạnh (ΔH < 0) và sinh khí Hydrogen.',
      },
      {
        id: 'g8-2-q2',
        question:
          'Vì sao không được châm ngọn lửa đèn cồn trực tiếp ở miệng bình khi khí Hydrogen (H₂) đang thoát ra mạnh?',
        options: [
          'Vì khí H₂ làm tắt ngọn lửa ngay lập tức',
          'Vì H₂ trộn với O₂ không khí tạo hỗn hợp nổ mạnh khi gặp lửa',
          'Vì làm bay màu dung dịch',
          'Vì tạo ra kết tủa đen',
        ],
        correctIndex: 1,
        explanation:
          'Hỗn hợp khí H₂ và O₂ (đặc biệt ở tỉ lệ thể tích 2:1) gây nổ dữ dội khi tiếp xúc nguồn lửa hở.',
      },
    ],
  },
  {
    id: 'LES_G8_PRECIPITATE_3',
    grade: 'Lớp 8',
    orderInGrade: 3,
    chapterTitle: 'Chương 3 • Muối & Phản ứng Trao đổi Ion trong Dung dịch',
    title: 'Chặng 3: Nhận biết Gốc Sulfate (=SO₄) bằng Kết tủa Trắng BaSO₄',
    summary:
      'Thực hiện phản ứng trao đổi giữa Barium chloride (Bari clorua) và Sulfuric acid loãng (Axit sunfuric loãng) tạo kết tủa trắng bền Barium sulfate (BaSO₄↓).',
    keyEquations: [
      'BaCl₂ (Barium chloride) + H₂SO₄ (loãng) → BaSO₄↓ (trắng) + 2HCl',
    ],
    theoryPoints: [
      'Phản ứng trao đổi trong dung dịch các chất điện li chỉ xảy ra khi các ion kết hợp được với nhau tạo thành ít nhất một trong các chất: chất kết tủa (↓), chất khí (↑) hoặc chất điện li yếu (H₂O).',
      'Dung dịch Barium chloride (BaCl₂ • Bari clorua) là thuốc thử đặc trưng để nhận biết gốc Sulfate (=SO₄) vì tạo ngay kết tủa trắng Barium sulfate (BaSO₄↓) không tan trong acid và kiềm.',
    ],
    safetyWarning:
      'Các hợp chất Barium (Ba²⁺) tan trong nước có độc tính nếu nuốt phải. Hãy dùng đúng lọ H₂SO₄ loãng 1M (hoặc pha loãng đúng quy tắc).',
    xpReward: 150,
    recommendedReagents: ['H2SO4', 'BaCl2'],
    steps: [
      {
        id: 'g8-3-s1',
        instruction:
          'Đi tới Tủ Hóa Chất [F] lấy H₂SO₄ loãng 1M và BaCl₂ 0.5M. Rót ≥ 15 ml H₂SO₄ loãng vào Cốc A.',
        hint: 'Nhặt lọ H₂SO₄ loãng 1M và BaCl₂ 0.5M từ Tủ Hóa Chất rồi rót +15 ml H₂SO₄ loãng vào Cốc A.',
        checkCondition: (vessels) =>
          vessels.some((v) => (v.moles['H2SO4'] || 0) >= 0.01 || (v.moles['BaSO4'] || 0) >= 0.005),
      },
      {
        id: 'g8-3-s2',
        instruction:
          'Nhỏ dung dịch Barium chloride (BaCl₂ 0.5M, +15 ml) vào Cốc A để tạo lớp kết tủa trắng Barium sulfate (BaSO₄↓) lắng dưới đáy cốc!',
        hint: 'Chọn lọ BaCl₂ trên thanh đồ và bấm "+15 ml" vào Cốc A.',
        checkCondition: (vessels) =>
          vessels.some((v) => (v.moles['BaSO4'] || 0) >= 0.005),
      },
    ],
    quiz: [
      {
        id: 'g8-3-q1',
        question:
          'Chất kết tủa màu trắng xuất hiện ngay khi nhỏ Barium chloride (BaCl₂) vào Sulfuric acid (H₂SO₄) có công thức và tên IUPAC là gì?',
        options: [
          'BaCO₃ — Barium carbonate',
          'BaSO₄ — Barium sulfate (Bari sunfat)',
          'Ba(OH)₂ — Barium hydroxide',
          'NaCl — Sodium chloride',
        ],
        correctIndex: 1,
        explanation:
          'Ion Ba²⁺ kết hợp với SO₄²⁻ tạo kết tủa trắng Barium sulfate (BaSO₄↓) bền trong môi trường acid.',
      },
      {
        id: 'g8-3-q2',
        question:
          'Điều kiện để phản ứng trao đổi giữa hai dung dịch muối hoặc acid-muối xảy ra là gì?',
        options: [
          'Phải đun sôi trên 200°C',
          'Sản phẩm tạo thành phải có chất kết tủa (↓), chất khí (↑) hoặc nước (H₂O)',
          'Phải có mặt kim loại Natri',
          'Hai dung dịch phải có màu xanh lam',
        ],
        correctIndex: 1,
        explanation:
          'Phản ứng trao đổi ion trong dung dịch chỉ xảy ra khi làm giảm nồng độ ion tự do nhờ tạo kết tủa, chất khí hoặc chất điện li yếu.',
      },
    ],
  },

  // ======================== KHỐI LỚP 9 (KHTN 9 — GDPT 2018) ========================
  {
    id: 'LES_AMPHOTERIC_9',
    grade: 'Lớp 9',
    orderInGrade: 1,
    chapterTitle: 'Chương 1 • Kim loại & Hợp chất Lưỡng tính của Aluminium',
    title: 'Chặng 1: Hiện tượng "Đổ dư kết tủa tan" — AlCl₃ + NaOH',
    summary:
      'Đi tới Tủ Hóa Chất lấy Aluminium chloride (Nhôm clorua • AlCl₃) và Sodium hydroxide (Natri hiđroxit • NaOH), thực hiện phản ứng tạo kết tủa keo trắng Aluminium hydroxide rồi đổ dư kiềm cho kết tủa tan hoàn toàn.',
    keyEquations: [
      'AlCl₃ + 3NaOH (vừa đủ) → Al(OH)₃↓ (keo trắng) + 3NaCl',
      'Al(OH)₃↓ + NaOH (dư) → NaAlO₂ (Sodium aluminate • tan trong suốt) + 2H₂O',
    ],
    theoryPoints: [
      'Giai đoạn 1 (tỉ lệ mol 1:3): Nhỏ từ từ Sodium hydroxide (NaOH) vào dung dịch Aluminium chloride (AlCl₃ • Nhôm clorua) tạo kết tủa keo trắng Aluminium hydroxide — Al(OH)₃↓.',
      'Giai đoạn 2 (nhỏ dư NaOH): Do Al(OH)₃ có tính lưỡng tính, kết tủa keo trắng phản ứng tiếp với NaOH dư tạo muối tan Sodium aluminate (NaAlO₂ • Natri aluminat) làm dung dịch trong suốt trở lại.',
    ],
    safetyWarning:
      'Không lấy nhầm Sodium (Na kim loại) hoặc H₂SO₄ đặc. Đeo găng tay bảo hộ khi thao tác với kiềm mạnh NaOH.',
    xpReward: 160,
    recommendedReagents: ['AlCl3', 'NaOH'],
    steps: [
      {
        id: 'step-1',
        instruction:
          'Đi tới Tủ Hóa Chất lấy AlCl₃ & NaOH, sau đó rót ≥ 20 ml AlCl₃ 0.5M vào Cốc A.',
        hint: 'Đi bộ (WASD hoặc bấm "Tới Tủ Hóa Chất") mở tủ lấy AlCl₃ và NaOH vào thanh đồ bên dưới.',
        checkCondition: (vessels) =>
          vessels.some(
            (v) => (v.moles['AlCl3'] || 0) >= 0.008 || (v.moles['Al(OH)3'] || 0) > 0.002
          ),
      },
      {
        id: 'step-2',
        instruction:
          'Cầm lọ NaOH 1.0M trên thanh đồ, nhỏ vừa phải (+15 ml) vào Cốc A để tạo kết tủa keo trắng Al(OH)₃.',
        hint: 'Chọn ô NaOH dưới đáy màn hình rồi nhấn nút "+15 ml" khi đang chọn Cốc A.',
        checkCondition: (vessels) => vessels.some((v) => (v.moles['Al(OH)3'] || 0) >= 0.002),
      },
      {
        id: 'step-3',
        instruction:
          'Đổ DƯ tiếp NaOH (+50 ml) vào Cốc A cho tới khi lớp kết tủa keo trắng tan hết!',
        hint: 'Nhấn "+50 ml" NaOH để quan sát đáy cốc chuyển về trong suốt (NaAlO₂).',
        checkCondition: (vessels) =>
          vessels.some(
            (v) => (v.moles['NaAlO2'] || 0) >= 0.005 && (v.moles['Al(OH)3'] || 0) < 0.0005
          ),
      },
    ],
    quiz: [
      {
        id: 'q1',
        question:
          'Khi nhỏ từ từ tới dư Sodium hydroxide (NaOH) vào dung dịch Aluminium chloride (AlCl₃), hiện tượng nào xảy ra?',
        options: [
          'Kết tủa trắng bền không tan',
          'Tạo kết tủa keo trắng tăng dần đến cực đại, sau đó tan hết tạo dung dịch trong suốt',
          'Nổ mạnh và bốc cháy',
          'Dung dịch hóa xanh lam',
        ],
        correctIndex: 1,
        explanation:
          'Do Aluminium hydroxide — Al(OH)₃ có tính lưỡng tính, tan trong kiềm dư tạo muối Sodium aluminate (NaAlO₂).',
      },
      {
        id: 'q2',
        question:
          'Nếu sục từ từ khí Carbon dioxide (CO₂) hoặc nhỏ từng giọt HCl vừa đủ vào dung dịch Sodium aluminate (NaAlO₂), hiện tượng gì xảy ra?',
        options: [
          'Tái tạo lại kết tủa keo trắng Al(OH)₃↓',
          'Tạo kết tủa màu đen',
          'Không có phản ứng',
          'Giải phóng khí Hydrogen',
        ],
        correctIndex: 0,
        explanation:
          'Phản ứng NaAlO₂ + HCl + H₂O → Al(OH)₃↓ + NaCl tái tạo lại kết tủa keo trắng.',
      },
    ],
  },
  {
    id: 'LES_THERMAL_CU_9',
    grade: 'Lớp 9',
    orderInGrade: 2,
    chapterTitle: 'Chương 2 • Base Không tan & Phản ứng Nhiệt phân',
    title: 'Chặng 2: Điều chế & Nhiệt phân Copper(II) hydroxide trên Đèn Cồn (> 80°C)',
    summary:
      'Lấy Copper(II) sulfate (Đồng(II) sunfat • CuSO₄) và Sodium hydroxide (NaOH) từ Tủ Hóa Chất, tạo kết tủa xanh lam Cu(OH)₂ trong Bình Nhiệt C và bật đèn cồn đun vượt 80°C.',
    keyEquations: [
      'CuSO₄ + 2NaOH → Cu(OH)₂↓ (Copper(II) hydroxide • xanh lam) + Na₂SO₄',
      'Cu(OH)₂ —(t° ≥ 80°C)→ CuO↓ (Copper(II) oxide • màu đen) + H₂O',
    ],
    theoryPoints: [
      'Tạo kết tủa Base không tan: Copper(II) sulfate (CuSO₄ • Đồng(II) sunfat) tác dụng với NaOH tạo kết tủa màu xanh lam đặc trưng của Copper(II) hydroxide — Cu(OH)₂↓.',
      'Tính kém bền nhiệt: Khi đun nóng trên Đèn Cồn vượt ngưỡng 80°C, kết tủa xanh lam Cu(OH)₂ phân hủy thành chất rắn màu đen Copper(II) oxide (CuO • Đồng(II) oxit) và nước.',
    ],
    safetyWarning:
      'Tắt đèn cồn ngay sau khi kết tủa đã hóa đen hết, không đun cạn khô quá 255°C gây nứt vỡ bình thủy tinh!',
    xpReward: 170,
    recommendedReagents: ['CuSO4', 'NaOH'],
    steps: [
      {
        id: 'cu-1',
        instruction:
          'Lấy CuSO₄ 0.5M từ Tủ Hóa Chất và rót ≥ 15 ml vào Bình Nhiệt C (đặt trên kiềng đèn cồn).',
        hint: 'Click chọn Bình Nhiệt C bên phải bàn, cầm lọ CuSO₄ và bấm +15 ml.',
        checkCondition: (vessels) => {
          const v3 = vessels.find((v) => v.isHeatable);
          return (
            !!v3 &&
            ((v3.moles['CuSO4'] || 0) > 0.005 ||
              (v3.moles['Cu(OH)2'] || 0) > 0.002 ||
              (v3.moles['CuO'] || 0) > 0.002)
          );
        },
      },
      {
        id: 'cu-2',
        instruction:
          'Rót thêm NaOH 1.0M vào Bình Nhiệt C để tạo kết tủa xanh lam Copper(II) hydroxide — Cu(OH)₂.',
        hint: 'Chọn lọ NaOH trên thanh đồ rồi nhấn +15 ml hoặc +50 ml.',
        checkCondition: (vessels) => {
          const v3 = vessels.find((v) => v.isHeatable);
          return (
            !!v3 &&
            ((v3.moles['Cu(OH)2'] || 0) > 0.003 || (v3.moles['CuO'] || 0) > 0.003)
          );
        },
      },
      {
        id: 'cu-3',
        instruction:
          'Bật Đèn Cồn đun Bình Nhiệt C vượt 80°C để kết tủa xanh hóa thành Copper(II) oxide (CuO) màu đen.',
        hint: 'Nhấn nút "🔥 Bật Đèn Cồn" và quan sát nhiệt độ vượt 80°C.',
        checkCondition: (vessels) => {
          const v3 = vessels.find((v) => v.isHeatable);
          return !!v3 && v3.temperatureC >= 80 && (v3.moles['CuO'] || 0) >= 0.003;
        },
      },
    ],
    quiz: [
      {
        id: 'cu-q1',
        question:
          'Chất rắn màu đen thu được sau khi đun nóng kết tủa xanh Copper(II) hydroxide — Cu(OH)₂ trên 80°C là chất gì?',
        options: [
          'CuSO₄ khan',
          'Copper kim loại (Cu)',
          'Copper(II) oxide — Đồng(II) oxit (CuO)',
          'Than hoạt tính',
        ],
        correctIndex: 2,
        explanation:
          'Cu(OH)₂ là base không tan kém bền nhiệt, phân hủy ở > 80°C tạo Copper(II) oxide (CuO) màu đen và hơi nước.',
      },
      {
        id: 'cu-q2',
        question:
          'Trong quá trình đun nóng ống nghiệm hoặc bình thủy tinh trên đèn cồn, thao tác nào sau đây gây nguy hiểm nổ vỡ bình?',
        options: [
          'Đun ở mức lửa vừa khi trong bình còn dung dịch',
          'Đun cạn khô bình thủy tinh rỗng ở mức lửa cực đại vượt 255°C',
          'Tắt đèn cồn ngay khi phản ứng hoàn tất',
          'Giữ khoảng cách an toàn khi quan sát',
        ],
        correctIndex: 1,
        explanation:
          'Đun khô bình thủy tinh ở nhiệt độ quá cao gây giãn nở nhiệt đột ngột làm nứt vỡ bình và cháy lan cồn.',
      },
    ],
  },
  {
    id: 'LES_SAFETY_DILUTION_9',
    grade: 'Lớp 9',
    orderInGrade: 3,
    chapterTitle: 'Chương 3 • Quy tắc An toàn Pha loãng Acid Đặc & Xử lý Cháy nổ',
    title: 'Chặng 3: Quy tắc Vàng Pha loãng Sulfuric Acid Đặc 98% & Phòng Cháy Nổ',
    summary:
      'Thực hành pha loãng đúng chuẩn Sulfuric acid đặc 98% (Axit sunfuric đặc • H₂SO₄) bằng cách rót từ từ acid vào cốc nước. (Nếu làm ngược lại sẽ nổ vỡ cốc và phải chạy đi lấy Bình Chữa Cháy CO₂!).',
    keyEquations: [
      'H₂SO₄ (đặc 98%, 18M) + nH₂O (nhiều nước) → H₂SO₄·nH₂O (Tỏa nhiệt mạnh ΔH ≪ 0)',
    ],
    theoryPoints: [
      'QUY TẮC SỐNG CÒN: Muốn pha loãng Sulfuric acid đặc (H₂SO₄ 98%), ta PHẢI rót từ từ từng tia nhỏ acid đặc vào cốc đã đựng sẵn nhiều nước và khuấy đều; tuyệt đối KHÔNG rót nước vào acid đặc!',
      'Nếu lỡ gây cháy nổ bàn thí nghiệm (do đổ nước vào H₂SO₄ đặc hoặc thả quá nhiều Sodium kim loại vào nước), bạn chỉ có 25 giây để chạy sang tường bên phải giật Bình Chữa Cháy CO₂ và xịt dập lửa!',
    ],
    safetyWarning:
      'Hãy chuẩn bị sẵn tinh thần biết vị trí Giá Treo Bình Chữa Cháy CO₂ màu đỏ ở bức tường bên phải!',
    xpReward: 200,
    recommendedReagents: ['H2O', 'H2SO4_dac', 'BaCl2'],
    steps: [
      {
        id: 'safe-1',
        instruction:
          'Rót trước ít nhất 50 ml Nước cất (Water • H₂O) vào Cốc B để làm môi trường tản nhiệt.',
        hint: 'Cầm H₂O (có sẵn ở ô số 1 hoặc lấy tại Bồn Rửa) rót +50 ml vào Cốc B.',
        checkCondition: (vessels) =>
          vessels.some((v) => v.volumeMl >= 45 && (v.moles['H2SO4_dac'] || 0) === 0),
      },
      {
        id: 'safe-2',
        instruction:
          'Đi ra Tủ Hóa Chất lấy H₂SO₄ ĐẶC 98%, quay lại rót từ từ (+15 ml) vào cốc ĐÃ CÓ NƯỚC để pha loãng an toàn!',
        hint: 'Đảm bảo cốc đã có ≥ 45 ml nước rồi mới bấm +15 ml H₂SO₄ đặc (nhiệt độ tăng nhưng không nổ!).',
        checkCondition: (vessels) =>
          vessels.some((v) => (v.moles['H2SO4'] || 0) >= 0.1 && !v.visual.isBroken),
      },
    ],
    quiz: [
      {
        id: 'safe-q1',
        question:
          'Điều gì xảy ra nếu học sinh rót trực tiếp nước (H₂O) vào cốc đang đựng Sulfuric acid đặc 98% (H₂SO₄ đặc)?',
        options: [
          'Không có hiện tượng gì xảy ra',
          'Nước nhẹ hơn nổi trên mặt acid đặc, sôi bùng mãnh liệt gây nổ bắn acid và cháy nguy hiểm',
          'Dung dịch đóng băng lạnh giá',
          'Tạo kết tủa màu xanh lam',
        ],
        correctIndex: 1,
        explanation:
          'Quá trình hydrat hóa H₂SO₄ đặc tỏa nhiệt cực lớn; nước nhẹ hơn (D = 1 g/cm³ < 1.84 g/cm³) nổi ở trên sôi tức thời làm bắn tung acid đặc.',
      },
      {
        id: 'safe-q2',
        question:
          'Khi xảy ra sự cố cháy hóa chất trên bàn thí nghiệm, quy trình xử lý khẩn cấp nào là đúng nhất?',
        options: [
          'Đứng yên chờ lửa tự tắt',
          'Lập tức lấy Bình chữa cháy khí CO₂ nén lạnh phun bao phủ dập tắt ngọn lửa và ngắt nguồn nhiệt',
          'Đổ thêm cồn hoặc hóa chất dễ cháy vào đám lửa',
          'Cất bình chữa cháy vào tủ khóa kín',
        ],
        correctIndex: 1,
        explanation:
          'Khí tuyết lạnh CO₂ làm ngạt nguồn cung cấp Oxygen và hạ nhiệt vùng cháy nhanh chóng mà không gây phản ứng phụ với kim loại kiềm hay acid đặc.',
      },
    ],
  },
];

