export type ChemicalStateType = 'liquid' | 'aqueous' | 'solid' | 'indicator';

export type ChemicalCategory =
  | 'Axit vô cơ'
  | 'Bazơ kiềm'
  | 'Muối'
  | 'Kim loại'
  | 'Kim loại kiềm'
  | 'Muối oxi hóa'
  | 'Chỉ thị màu'
  | 'Dung môi';

export interface ChemicalDef {
  id: string;
  formula: string;
  displayFormula: string;
  nameVi: string;
  category: ChemicalCategory;
  stateType: ChemicalStateType;
  defaultMolarity?: number; // mol/L for aqueous solutions
  molarMass: number; // g/mol
  colorHex: string; // 6-char hex
  opacity: number; // 0.0 - 1.0
  safetyNote: string;
  isHazardous?: boolean;
}

export interface ReactionLogEntry {
  id: string;
  timestamp: string;
  vesselName: string;
  equation: string;
  phenomenon: string;
  type: 'info' | 'reaction' | 'thermal' | 'hazard';
}

export interface VesselVisualState {
  liquidColorHex: string;
  liquidOpacity: number;
  fillRatio: number; // 0..1
  precipitateColorHex: string;
  precipitateHeightRatio: number; // 0..0.35
  solidChunkColorHex: string | null;
  solidChunkScale: number; // 0..1
  bubbleRate: number; // 0..1 intensity of gas evolution
  steamRate: number; // 0..1 steam/smoke intensity
  isSparking: boolean; // Alkali metal fire/sparks
  hasHazardExplosion: boolean;
}

export interface VesselState {
  id: string;
  name: string;
  subtitle: string;
  capacityMl: number;
  isHeatable: boolean;
  burnerOn: boolean;
  burnerLevel: 1 | 2 | 3; // 1: Nhỏ, 2: Vừa, 3: Mạnh
  temperatureC: number;
  volumeMl: number; // Liquid volume in mL
  pH: number;
  moles: Record<string, number>; // formula -> moles currently inside vessel
  recentGas: Record<string, number>; // gas evolved in recent tick (for UI readout)
  totalGasEvolved: Record<string, number>; // cumulative moles of gas evolved (H2, CO2, O2)
  activeEquations: string[];
  visual: VesselVisualState;
}

export type CameraMode = 'ROOM_WALK' | 'WORKBENCH_FOCUS' | 'ORBIT_OVERVIEW';

export type AppMode = 'SANDBOX' | 'CURRICULUM';

export interface LessonQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonTaskStep {
  id: string;
  instruction: string;
  hint: string;
  checkCondition: (vessels: VesselState[]) => boolean;
}

export interface GuidedLesson {
  id: string;
  grade: 'Lớp 8' | 'Lớp 9';
  title: string;
  summary: string;
  theoryPoints: string[];
  safetyWarning: string;
  recommendedReagents: string[];
  steps: LessonTaskStep[];
  quiz: LessonQuizQuestion[];
}
