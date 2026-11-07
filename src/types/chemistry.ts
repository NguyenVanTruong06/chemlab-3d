export type ChemicalStateType = 'liquid' | 'aqueous' | 'solid' | 'indicator';

export type ChemicalCategory =
  | 'Axit vô cơ'
  | 'Axit đặc nguy hiểm'
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
  isBroken: boolean; // Shattered/scorched by explosion
}

export interface VesselState {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  capacityMl: number;
  isHeatable: boolean;
  burnerOn: boolean;
  burnerLevel: 1 | 2 | 3; // 1: Nhỏ, 2: Vừa, 3: Mạnh
  temperatureC: number;
  volumeMl: number;
  pH: number;
  moles: Record<string, number>;
  recentGas: Record<string, number>;
  totalGasEvolved: Record<string, number>;
  activeEquations: string[];
  visual: VesselVisualState;
}

export type CameraMode = 'ROOM_WALK' | 'WORKBENCH_FOCUS' | 'ORBIT_OVERVIEW';

export type AppMode = 'SANDBOX' | 'CURRICULUM';

export type StationId =
  | 'WORKBENCH'
  | 'REAGENT_CABINET'
  | 'SINK'
  | 'EXTINGUISHER_MOUNT'
  | null;

export type HotbarItem =
  | { type: 'reagent'; formula: string }
  | { type: 'extinguisher' }
  | null;

export interface HazardTriggerInfo {
  code: 'SODIUM_BLAST' | 'ACID_DILUTION_BLAST' | 'HYDROGEN_FIRE' | 'OVERHEAT_RUPTURE';
  title: string;
  chemicalExplanation: string;
  exploded: boolean;
}

export interface FireEmergencyState {
  active: boolean;
  intensity: number; // 0..100
  timeLeftSec: number; // e.g., 25.0s countdown before lab burns down
  maxTimeSec: number;
  causeTitle: string;
  chemicalExplanation: string;
  burnedDown: boolean;
  extinguishedSuccess: boolean;
}

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
