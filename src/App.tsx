import { useCallback, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  LabCanvas,
  type ExplosionCommand,
  type PourCommand,
  type WalkCommand,
} from './components/LabCanvas';
import { MinimalHud } from './components/MinimalHud';
import { BackpackModal } from './components/BackpackModal';
import { CabinetModal } from './components/CabinetModal';
import { OuterHubScreen } from './components/OuterHubScreen';
import { StageFlowScreens } from './components/StageFlowScreens';
import {
  addReagentToVessel,
  createDefaultWorkbenchVessels,
  GUIDED_LESSONS,
  pourBetweenVessels,
  SHELF_CHEMICALS,
  stepVesselSimulation,
} from './engine/ChemistryEngine';
import {
  evaluateBadgesAndQuests,
  loadLearnerProfile,
  recordLessonCompletion,
  saveLearnerProfile,
} from './engine/LearnerStore';
import { labAudio } from './engine/SoundEffects';
import type {
  AppMode,
  AppScreen,
  CameraMode,
  ChemicalDef,
  FireEmergencyState,
  HazardTriggerInfo,
  HotbarItem,
  LearnerProfile,
  ReactionLogEntry,
  StationId,
  VesselState,
} from './types/chemistry';
import './App.css';

const INITIAL_FIRE_STATE: FireEmergencyState = {
  active: false,
  intensity: 0,
  timeLeftSec: 25.0,
  maxTimeSec: 25.0,
  causeTitle: '',
  chemicalExplanation: '',
  burnedDown: false,
  extinguishedSuccess: false,
};

const INITIAL_HOTBAR: HotbarItem[] = [
  { type: 'reagent', formula: 'H2O' },
  null,
  null,
  null,
  null,
  null,
];

function evaluateLatchedLessonSteps(
  lessonId: string,
  vessels: VesselState[],
  prevCompleted: Record<string, boolean>
): { next: Record<string, boolean>; newlyFinishedAll: boolean } {
  const lesson = GUIDED_LESSONS.find((l) => l.id === lessonId) || GUIDED_LESSONS[0];
  const wasAllDone = lesson.steps.every((s) => !!prevCompleted[s.id]);
  let changed = false;
  const next = { ...prevCompleted };

  for (let i = 0; i < lesson.steps.length; i++) {
    const step = lesson.steps[i];
    const prevDone = i === 0 ? true : !!next[lesson.steps[i - 1].id];
    if (!next[step.id] && prevDone && step.checkCondition(vessels)) {
      next[step.id] = true;
      changed = true;
    }
  }

  const nowAllDone = lesson.steps.every((s) => !!next[s.id]);
  return {
    next: changed ? next : prevCompleted,
    newlyFinishedAll: !wasAllDone && nowAllDone,
  };
}

export function App() {
  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile>(() =>
    loadLearnerProfile()
  );
  const [appScreen, setAppScreen] = useState<AppScreen>('OUTER_HUB');
  const [appMode, setAppMode] = useState<AppMode>('CURRICULUM');
  const [cameraMode, setCameraMode] = useState<CameraMode>('ROOM_WALK');
  const [currentStation, setCurrentStation] = useState<StationId>('WORKBENCH');
  const [distanceToFire, setDistanceToFire] = useState<number>(2.55);

  const [vessels, setVessels] = useState<VesselState[]>(() =>
    createDefaultWorkbenchVessels()
  );
  const [selectedVesselId, setSelectedVesselId] = useState<string>('vessel-1');

  const [hotbar, setHotbar] = useState<HotbarItem[]>(INITIAL_HOTBAR);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(0);

  const [activeLessonId, setActiveLessonId] = useState<string>(GUIDED_LESSONS[0].id);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [hadSafetyIncidentInRun, setHadSafetyIncidentInRun] = useState<boolean>(false);
  const [logs, setLogs] = useState<ReactionLogEntry[]>([]);

  const [backpackOpen, setBackpackOpen] = useState<boolean>(false);
  const [cabinetOpen, setCabinetOpen] = useState<boolean>(false);

  const [fireEmergency, setFireEmergency] = useState<FireEmergencyState>(INITIAL_FIRE_STATE);
  const [isSpraying, setIsSpraying] = useState<boolean>(false);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(
    '🎒 Bấm [B] mở Balo xem yêu cầu • Đi bộ WASD ra Tủ Hóa Chất lấy dung dịch!'
  );

  const [pourCommand, setPourCommand] = useState<PourCommand | null>(null);
  const [explosionCommand, setExplosionCommand] = useState<ExplosionCommand | null>(null);
  const [walkCommand, setWalkCommand] = useState<WalkCommand | null>(null);
  const [mobileMove, setMobileMove] = useState<{ forward: number; strafe: number }>({
    forward: 0,
    strafe: 0,
  });

  const toastTimerRef = useRef<number | null>(null);
  const tickCountRef = useRef<number>(0);

  const showToast = useCallback((msg: string, durationMs = 3400) => {
    setToastMessage(msg);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, durationMs);
  }, []);

  const latestRef = useRef({
    appScreen,
    appMode,
    cameraMode,
    currentStation,
    distanceToFire,
    vessels,
    selectedVesselId,
    hotbar,
    activeSlotIndex,
    activeLessonId,
    completedSteps,
    fireEmergency,
    isSpraying,
    learnerProfile,
  });

  useEffect(() => {
    latestRef.current = {
      appScreen,
      appMode,
      cameraMode,
      currentStation,
      distanceToFire,
      vessels,
      selectedVesselId,
      hotbar,
      activeSlotIndex,
      activeLessonId,
      completedSteps,
      fireEmergency,
      isSpraying,
      learnerProfile,
    };
  });

  const triggerHazardEmergency = useCallback(
    (hazard: HazardTriggerInfo, vesselId: string) => {
      labAudio.playExplosion();
      setBackpackOpen(false);
      setCabinetOpen(false);
      setHadSafetyIncidentInRun(true);
      setExplosionCommand((prev) => ({
        seq: (prev?.seq || 0) + 1,
        vesselId,
      }));
      setFireEmergency((prev) => ({
        active: true,
        intensity: prev.active ? Math.min(100, prev.intensity + 35) : 65,
        timeLeftSec: prev.active ? Math.min(prev.timeLeftSec, 25.0) : 25.0,
        maxTimeSec: 25.0,
        causeTitle: hazard.title,
        chemicalExplanation: hazard.chemicalExplanation,
        burnedDown: false,
        extinguishedSuccess: false,
      }));
    },
    []
  );

  // Real-time 10Hz Chemistry Kinetics + 25-Second Fire Emergency Loop (Only when inside 3D Lab!)
  useEffect(() => {
    const timer = window.setInterval(() => {
      const snap = latestRef.current;
      if (snap.appScreen !== 'LAB_3D' || snap.fireEmergency.burnedDown) return;

      tickCountRef.current += 1;
      const tick = tickCountRef.current;

      // 1. Step Chemistry & Thermal Kinetics across all 3 vessels
      const newLogs: ReactionLogEntry[] = [];
      let detectedHazard: { hazard: HazardTriggerInfo; vesselId: string } | null = null;

      const nextVessels = snap.vessels.map((v) => {
        const res = stepVesselSimulation(v, 0.1);
        if (res.hazard && !detectedHazard) {
          detectedHazard = { hazard: res.hazard, vesselId: v.id };
          newLogs.push({
            id: `${Date.now()}-${v.id}-haz`,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour12: false }),
            vesselName: v.shortName,
            equation: res.hazard.title,
            phenomenon: res.hazard.chemicalExplanation,
            type: 'hazard',
          });
        } else if (res.triggeredEquations.length > 0) {
          const latestEq = res.triggeredEquations[0];
          if (!v.activeEquations.includes(latestEq)) {
            newLogs.push({
              id: `${Date.now()}-${v.id}-${Math.random().toString(36).slice(2, 6)}`,
              timestamp: new Date().toLocaleTimeString('vi-VN', { hour12: false }),
              vesselName: v.shortName,
              equation: latestEq,
              phenomenon: res.phenomena[0] || 'Phản ứng đang diễn biến theo thời gian thực.',
              type: 'thermal',
            });
          }
        }
        return res.nextVessel;
      });

      setVessels(nextVessels);

      if (newLogs.length > 0) {
        setLogs((prev) => [...newLogs, ...prev].slice(0, 30));
      }

      if (snap.appMode === 'CURRICULUM') {
        const evalRes = evaluateLatchedLessonSteps(
          snap.activeLessonId,
          nextVessels,
          snap.completedSteps
        );
        if (evalRes.next !== snap.completedSteps) {
          setCompletedSteps(evalRes.next);
        }
        if (evalRes.newlyFinishedAll) {
          labAudio.playSuccess();
          confetti({ particleCount: 55, spread: 65, origin: { y: 0.72 } });
          showToast(
            '🎉 Đã hoàn thành các bước thực hành! Bấm nút màu xanh góc trái trên để sang Bước 3: Kiểm tra & Nhận Sao!',
            5000
          );
        }
      }

      if (detectedHazard) {
        const found: { hazard: HazardTriggerInfo; vesselId: string } = detectedHazard;
        triggerHazardEmergency(found.hazard, found.vesselId);
        return;
      }

      // 2. Step Active Fire Countdown & CO2 Extinguishing Mechanics
      if (snap.fireEmergency.active && !snap.fireEmergency.burnedDown) {
        if (tick % 12 === 0) {
          labAudio.playAlarmBeep();
        }

        const activeItem = snap.hotbar[snap.activeSlotIndex];
        const inSprayRange =
          snap.cameraMode !== 'ROOM_WALK' || snap.distanceToFire <= 3.3;
        const effectivelySpraying =
          snap.isSpraying && activeItem?.type === 'extinguisher' && inSprayRange;

        if (effectivelySpraying) {
          if (tick % 2 === 0) {
            labAudio.playExtinguisherSpray();
          }
          const nextIntensity = Math.max(0, snap.fireEmergency.intensity - 4.8);
          if (nextIntensity <= 0) {
            setIsSpraying(false);
            setFireEmergency((prev) => ({
              ...prev,
              active: false,
              intensity: 0,
              extinguishedSuccess: true,
            }));
            labAudio.playSuccess();
            confetti({ particleCount: 75, spread: 70, origin: { y: 0.62 } });

            // Award Firefighter progress & check badge unlock!
            setLearnerProfile((prevProf) => {
              const bumped: LearnerProfile = {
                ...prevProf,
                firesExtinguishedCount: prevProf.firesExtinguishedCount + 1,
              };
              const { nextProfile } = evaluateBadgesAndQuests(bumped, GUIDED_LESSONS);
              saveLearnerProfile(nextProfile);
              return nextProfile;
            });

            setLogs((prev) =>
              [
                {
                  id: `${Date.now()}-extinguished`,
                  timestamp: new Date().toLocaleTimeString('vi-VN', { hour12: false }),
                  vesselName: 'An toàn Phòng Lab',
                  equation: '🚒 Đã dập tắt đám cháy bằng khí tuyết lạnh CO₂!',
                  phenomenon:
                    'Khí CO₂ nén lạnh làm ngạt oxy và hạ nhiệt đám cháy hóa chất kịp thời trước khi cháy lan toàn phòng.',
                  type: 'info' as const,
                },
                ...prev,
              ].slice(0, 30)
            );
          } else {
            setFireEmergency((prev) => ({
              ...prev,
              intensity: nextIntensity,
              timeLeftSec: Math.max(0.1, Math.round((prev.timeLeftSec - 0.02) * 10) / 10),
            }));
          }
        } else {
          const nextTime = Math.max(
            0,
            Math.round((snap.fireEmergency.timeLeftSec - 0.1) * 10) / 10
          );
          const nextIntensity = Math.min(100, snap.fireEmergency.intensity + 0.35);

          if (nextTime <= 0) {
            setIsSpraying(false);
            labAudio.playExplosion();
            setFireEmergency((prev) => ({
              ...prev,
              intensity: 100,
              timeLeftSec: 0,
              burnedDown: true,
            }));
          } else {
            setFireEmergency((prev) => ({
              ...prev,
              intensity: nextIntensity,
              timeLeftSec: nextTime,
            }));
          }
        }
      }
    }, 100);

    return () => window.clearInterval(timer);
  }, [showToast, triggerHazardEmergency]);

  const handleWalkToStation = useCallback(
    (station: Exclude<StationId, null>) => {
      if (cameraMode !== 'ROOM_WALK') {
        setCameraMode('ROOM_WALK');
      }
      setWalkCommand((prev) => ({
        seq: (prev?.seq || 0) + 1,
        station,
      }));
    },
    [cameraMode]
  );

  const handlePickReagent = useCallback(
    (formula: string) => {
      const snap = latestRef.current;
      const chem = SHELF_CHEMICALS.find((c) => c.formula === formula);
      if (!chem) return;

      // Unlock reagent in Learner Codex!
      setLearnerProfile((prevProf) => {
        if (prevProf.unlockedReagents.includes(formula)) return prevProf;
        const updated: LearnerProfile = {
          ...prevProf,
          unlockedReagents: [...prevProf.unlockedReagents, formula],
        };
        const { nextProfile } = evaluateBadgesAndQuests(updated, GUIDED_LESSONS);
        saveLearnerProfile(nextProfile);
        return nextProfile;
      });

      const existingIdx = snap.hotbar.findIndex(
        (item) => item?.type === 'reagent' && item.formula === formula
      );
      if (existingIdx >= 0) {
        setActiveSlotIndex(existingIdx);
        labAudio.playClink();
        showToast(
          `🧪 Đang cầm sẵn lọ ${chem.displayFormula} (${chem.iupacName}) — Ô #${existingIdx + 1}`
        );
        return;
      }

      const emptyIdx = snap.hotbar.findIndex((item) => item === null);
      let targetIdx = emptyIdx;
      if (targetIdx === -1) {
        const currentSlot = snap.hotbar[snap.activeSlotIndex];
        if (currentSlot?.type !== 'extinguisher') {
          targetIdx = snap.activeSlotIndex;
        } else {
          const nonExtIdx = snap.hotbar.findIndex((i) => i?.type !== 'extinguisher');
          targetIdx = nonExtIdx >= 0 ? nonExtIdx : 0;
        }
      }

      const nextHotbar = [...snap.hotbar];
      nextHotbar[targetIdx] = { type: 'reagent', formula };
      setHotbar(nextHotbar);
      setActiveSlotIndex(targetIdx);
      labAudio.playClink();
      showToast(
        `🧪 Đã lấy ${chem.displayFormula} • ${chem.iupacName} vào Ô #${targetIdx + 1}`
      );
    },
    [showToast]
  );

  const handleGrabExtinguisher = useCallback(() => {
    const snap = latestRef.current;
    const existingIdx = snap.hotbar.findIndex((item) => item?.type === 'extinguisher');
    if (existingIdx >= 0) {
      setActiveSlotIndex(existingIdx);
      labAudio.playClink();
      showToast('🚒 Đã cầm Bình Chữa Cháy CO₂ trên tay!');
      return;
    }

    const emptyIdx = snap.hotbar.findIndex((item) => item === null);
    const targetIdx = emptyIdx >= 0 ? emptyIdx : snap.activeSlotIndex;
    const nextHotbar = [...snap.hotbar];
    nextHotbar[targetIdx] = { type: 'extinguisher' };
    setHotbar(nextHotbar);
    setActiveSlotIndex(targetIdx);
    labAudio.playClink();
    showToast(
      '🚒 Đã giật chốt Bình Chữa Cháy CO₂! Quay lại gần Bàn Lab và giữ SPACE để xịt!',
      4200
    );
  }, [showToast]);

  const handleRefillWaterAtSink = useCallback(() => {
    handlePickReagent('H2O');
  }, [handlePickReagent]);

  const handleRinseAllAtSink = useCallback(() => {
    labAudio.playPour();
    setVessels(createDefaultWorkbenchVessels());
    showToast('🧼 Đã tráng rửa sạch & thay mới toàn bộ cốc thủy tinh!');
  }, [showToast]);

  const handleDispenseHeldReagent = useCallback(
    (chem: ChemicalDef, amount: number) => {
      const snap = latestRef.current;
      const targetVessel = snap.vessels.find((v) => v.id === snap.selectedVesselId);
      if (!targetVessel) return;

      if (targetVessel.visual.isBroken) {
        showToast('⚠️ Cốc này đã bị nứt vỡ! Hãy đi tới Bồn Rửa [Phím R] để thay cốc mới.');
        return;
      }

      labAudio.playPour();
      const { nextVessel, log, hazard } = addReagentToVessel(targetVessel, chem, amount);
      const nextVessels = snap.vessels.map((v) =>
        v.id === targetVessel.id ? nextVessel : v
      );

      setVessels(nextVessels);
      setLogs((old) => [log, ...old].slice(0, 30));

      // Increment daily dispense quest & unlock reagent in profile
      setLearnerProfile((prevProf) => {
        const unlocked = prevProf.unlockedReagents.includes(chem.formula)
          ? prevProf.unlockedReagents
          : [...prevProf.unlockedReagents, chem.formula];
        const updated: LearnerProfile = {
          ...prevProf,
          unlockedReagents: unlocked,
          reactionsTriggeredCount: prevProf.reactionsTriggeredCount + 1,
          dailyQuestProgress: {
            ...prevProf.dailyQuestProgress,
            DQ_UNLOCK_REAGENTS:
              (prevProf.dailyQuestProgress['DQ_UNLOCK_REAGENTS'] || 0) + 1,
          },
        };
        const { nextProfile } = evaluateBadgesAndQuests(updated, GUIDED_LESSONS);
        saveLearnerProfile(nextProfile);
        return nextProfile;
      });

      setPourCommand((prev) => ({
        seq: (prev?.seq || 0) + 1,
        targetVesselId: targetVessel.id,
        colorHex: chem.colorHex,
      }));

      if (snap.appMode === 'CURRICULUM') {
        const evalRes = evaluateLatchedLessonSteps(
          snap.activeLessonId,
          nextVessels,
          snap.completedSteps
        );
        if (evalRes.next !== snap.completedSteps) {
          setCompletedSteps(evalRes.next);
        }
        if (evalRes.newlyFinishedAll) {
          labAudio.playSuccess();
          confetti({ particleCount: 55, spread: 65, origin: { y: 0.72 } });
          showToast(
            '🎉 Đã hoàn thành thực hành! Bấm nút màu xanh góc trái trên để sang Bước 3: Kiểm tra & Nhận Sao!',
            5000
          );
        }
      }

      if (hazard) {
        triggerHazardEmergency(hazard, targetVessel.id);
      }
    },
    [showToast, triggerHazardEmergency]
  );

  const handlePourBetweenVessels = useCallback(
    (sourceId: string, targetId: string) => {
      const snap = latestRef.current;
      const src = snap.vessels.find((v) => v.id === sourceId);
      const dst = snap.vessels.find((v) => v.id === targetId);
      if (!src || !dst) return;

      if (src.visual.isBroken || dst.visual.isBroken) {
        showToast('⚠️ Không thể rót qua lại khi cốc đã bị nứt vỡ!');
        return;
      }

      labAudio.playPour();
      const { nextSource, nextTarget, log, hazard } = pourBetweenVessels(src, dst, 25);
      const nextVessels = snap.vessels.map((v) => {
        if (v.id === sourceId) return nextSource;
        if (v.id === targetId) return nextTarget;
        return v;
      });

      setVessels(nextVessels);
      if (log) {
        setLogs((old) => [log, ...old].slice(0, 30));
      }

      setPourCommand((oldCmd) => ({
        seq: (oldCmd?.seq || 0) + 1,
        targetVesselId: targetId,
        sourceVesselId: sourceId,
        colorHex: src.visual.liquidColorHex,
      }));

      if (snap.appMode === 'CURRICULUM') {
        const evalRes = evaluateLatchedLessonSteps(
          snap.activeLessonId,
          nextVessels,
          snap.completedSteps
        );
        if (evalRes.next !== snap.completedSteps) {
          setCompletedSteps(evalRes.next);
        }
      }

      if (hazard) {
        triggerHazardEmergency(hazard, targetId);
      }
    },
    [showToast, triggerHazardEmergency]
  );

  const handleToggleBurner = useCallback(
    (vesselId: string, on: boolean, level: 1 | 2 | 3) => {
      labAudio.playClink();
      setVessels((prev) =>
        prev.map((v) =>
          v.id === vesselId ? { ...v, burnerOn: on, burnerLevel: level } : v
        )
      );
    },
    []
  );

  const handleResetAllLab = useCallback(() => {
    setVessels(createDefaultWorkbenchVessels());
    setCompletedSteps({});
    setFireEmergency(INITIAL_FIRE_STATE);
    setIsSpraying(false);
    showToast('🔄 Đã làm mới bàn thí nghiệm sẵn sàng thực hành!');
  }, [showToast]);

  const handleDismissExtinguishedBanner = useCallback(() => {
    const freshDefaults = createDefaultWorkbenchVessels();
    setVessels((prev) =>
      prev.map((v, idx) => (v.visual.isBroken ? freshDefaults[idx] : v))
    );
    setFireEmergency(INITIAL_FIRE_STATE);
    showToast('🧹 Đã thu dọn mảnh vỡ và thay cốc thủy tinh mới!');
  }, [showToast]);

  const handleInteractStation3D = useCallback(
    (station: StationId, reagentFormula?: string) => {
      if (station === 'REAGENT_CABINET') {
        if (reagentFormula) {
          handlePickReagent(reagentFormula);
        } else {
          setBackpackOpen(false);
          setCabinetOpen(true);
        }
      } else if (station === 'EXTINGUISHER_MOUNT') {
        handleGrabExtinguisher();
      } else if (station === 'SINK') {
        handleRefillWaterAtSink();
      }
    },
    [handleGrabExtinguisher, handlePickReagent, handleRefillWaterAtSink]
  );

  const handleStationProximityChange = useCallback(
    (station: StationId, distFire: number) => {
      setCurrentStation(station);
      setDistanceToFire(distFire);
      if (station !== 'REAGENT_CABINET') {
        setCabinetOpen(false);
      }
    },
    []
  );

  // Global Game-Style Keyboard Shortcuts inside 3D Lab: [B], [Esc], [V], [F], [R], [1..6], [Space]
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const snap = latestRef.current;
      if (snap.appScreen !== 'LAB_3D') return;

      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;

      if (e.code === 'Escape') {
        setBackpackOpen(false);
        setCabinetOpen(false);
        return;
      }

      if (snap.fireEmergency.burnedDown) return;

      if (e.code === 'KeyB') {
        e.preventDefault();
        setCabinetOpen(false);
        setBackpackOpen((open) => !open);
        return;
      }

      if (e.code === 'KeyV') {
        e.preventDefault();
        setCameraMode((prev) =>
          prev === 'ROOM_WALK' ? 'WORKBENCH_FOCUS' : 'ROOM_WALK'
        );
        return;
      }

      if (e.code.startsWith('Digit')) {
        const num = Number(e.code.replace('Digit', ''));
        if (num >= 1 && num <= 6) {
          setActiveSlotIndex(num - 1);
          labAudio.playClink();
          return;
        }
      }

      if (e.code === 'KeyF') {
        e.preventDefault();
        if (snap.currentStation === 'REAGENT_CABINET') {
          setBackpackOpen(false);
          setCabinetOpen((open) => !open);
        } else if (snap.currentStation === 'EXTINGUISHER_MOUNT') {
          handleGrabExtinguisher();
        } else if (snap.currentStation === 'SINK') {
          handleRefillWaterAtSink();
        }
        return;
      }

      if (e.code === 'KeyR' && snap.currentStation === 'SINK') {
        e.preventDefault();
        handleRinseAllAtSink();
        return;
      }

      if (e.code === 'Space') {
        const held = snap.hotbar[snap.activeSlotIndex];
        if (held?.type === 'extinguisher') {
          e.preventDefault();
          setIsSpraying(true);
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpraying(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [handleGrabExtinguisher, handleRefillWaterAtSink, handleRinseAllAtSink]);

  const activeLesson =
    GUIDED_LESSONS.find((l) => l.id === activeLessonId) || GUIDED_LESSONS[0];
  const activeHeldItem = hotbar[activeSlotIndex] ?? null;
  const ownsExtinguisher = hotbar.some((item) => item?.type === 'extinguisher');

  // ---------- SCREEN 1: OUTER LEARNING HUB ----------
  if (appScreen === 'OUTER_HUB') {
    return (
      <OuterHubScreen
        profile={learnerProfile}
        lessons={GUIDED_LESSONS}
        onUpdateProfileMeta={(displayName, schoolOrClass, avatarEmoji) => {
          setLearnerProfile((prev) => {
            const next = { ...prev, displayName, schoolOrClass, avatarEmoji };
            saveLearnerProfile(next);
            return next;
          });
        }}
        onSelectGrade={(grade) => {
          setLearnerProfile((prev) => {
            const next = { ...prev, gradePreference: grade };
            saveLearnerProfile(next);
            return next;
          });
        }}
        onStartLessonStage={(lessonId) => {
          setActiveLessonId(lessonId);
          setAppMode('CURRICULUM');
          setVessels(createDefaultWorkbenchVessels());
          setCompletedSteps({});
          setHadSafetyIncidentInRun(false);
          setLogs([]);
          setFireEmergency(INITIAL_FIRE_STATE);
          setAppScreen('THEORY_STAGE');
        }}
        onEnterSandboxLab={() => {
          setAppMode('SANDBOX');
          setVessels(createDefaultWorkbenchVessels());
          setCompletedSteps({});
          setHadSafetyIncidentInRun(false);
          setLogs([]);
          setFireEmergency(INITIAL_FIRE_STATE);
          setBackpackOpen(false);
          setCabinetOpen(false);
          setAppScreen('LAB_3D');
          showToast(
            '🧪 Đã vào Phòng Lab Tự Do 3D! Mở Balo [B] xem hướng dẫn thử nổ hoặc ra Tủ [F] lấy hóa chất.'
          );
        }}
      />
    );
  }

  // ---------- SCREEN 2 & 4: STAGE 1 (THEORY) & STAGE 3 (QUIZ & STAR EVALUATION) ----------
  if (appScreen === 'THEORY_STAGE' || appScreen === 'QUIZ_RESULT_STAGE') {
    return (
      <StageFlowScreens
        key={`${activeLesson.id}-${appScreen}`}
        mode={appScreen}
        lesson={activeLesson}
        hadSafetyIncidentInLab={hadSafetyIncidentInRun}
        labLogs={logs}
        onBackToHub={() => setAppScreen('OUTER_HUB')}
        onProceedTo3DLab={() => {
          setVessels(createDefaultWorkbenchVessels());
          setCompletedSteps({});
          setHadSafetyIncidentInRun(false);
          setFireEmergency(INITIAL_FIRE_STATE);
          setBackpackOpen(false);
          setCabinetOpen(false);
          setAppScreen('LAB_3D');
          showToast(
            `🔬 Chặng Thực hành: ${activeLesson.title} — Hãy đi tới Tủ Hóa Chất [F] lấy ${activeLesson.recommendedReagents.join(', ')}!`
          );
        }}
        onRetry3DLab={() => {
          setVessels(createDefaultWorkbenchVessels());
          setCompletedSteps({});
          setHadSafetyIncidentInRun(false);
          setFireEmergency(INITIAL_FIRE_STATE);
          setAppScreen('LAB_3D');
        }}
        onSubmitQuizAndFinish={(correctCount) => {
          const res = recordLessonCompletion(
            learnerProfile,
            activeLesson,
            GUIDED_LESSONS,
            correctCount,
            hadSafetyIncidentInRun
          );
          setLearnerProfile(res.nextProfile);
          labAudio.playSuccess();
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.65 } });
          return {
            earnedStars: res.earnedStars,
            quizScorePct: res.quizScorePct,
            xpDelta: res.xpDelta,
            newlyUnlockedBadges: res.newlyUnlockedBadges,
          };
        }}
      />
    );
  }

  // ---------- SCREEN 3: STAGE 2 (3D IMMERSIVE LAB) ----------
  return (
    <div className="chemlab-fullscreen-stage">
      <LabCanvas
        vessels={vessels}
        selectedVesselId={selectedVesselId}
        cameraMode={cameraMode}
        activeHeldItem={activeHeldItem}
        ownsExtinguisher={ownsExtinguisher}
        isSprayingExtinguisher={isSpraying}
        fireIntensity={fireEmergency.intensity}
        burnedDown={fireEmergency.burnedDown}
        pourCommand={pourCommand}
        explosionCommand={explosionCommand}
        walkCommand={walkCommand}
        mobileMove={mobileMove}
        onSelectVessel={setSelectedVesselId}
        onStationProximityChange={handleStationProximityChange}
        onInteractStation3D={handleInteractStation3D}
      />

      <MinimalHud
        appMode={appMode}
        cameraMode={cameraMode}
        currentStation={currentStation}
        distanceToFire={distanceToFire}
        vessels={vessels}
        selectedVesselId={selectedVesselId}
        hotbar={hotbar}
        activeSlotIndex={activeSlotIndex}
        activeLesson={activeLesson}
        completedSteps={completedSteps}
        fireEmergency={fireEmergency}
        isSpraying={isSpraying}
        soundMuted={soundMuted}
        toastMessage={toastMessage}
        onExitToHub={() => {
          setFireEmergency(INITIAL_FIRE_STATE);
          setIsSpraying(false);
          setAppScreen('OUTER_HUB');
        }}
        onFinishPracticeGoQuiz={() => {
          setFireEmergency(INITIAL_FIRE_STATE);
          setIsSpraying(false);
          setBackpackOpen(false);
          setCabinetOpen(false);
          setAppScreen('QUIZ_RESULT_STAGE');
        }}
        onOpenBackpack={() => {
          setCabinetOpen(false);
          setBackpackOpen(true);
        }}
        onOpenCabinet={() => {
          setBackpackOpen(false);
          setCabinetOpen(true);
        }}
        onSetCameraMode={setCameraMode}
        onWalkToStation={handleWalkToStation}
        onSelectHotbarSlot={(idx) => {
          labAudio.playClink();
          setActiveSlotIndex(idx);
        }}
        onSelectVessel={setSelectedVesselId}
        onDispenseHeldReagent={handleDispenseHeldReagent}
        onPourBetweenVessels={handlePourBetweenVessels}
        onToggleBurner={handleToggleBurner}
        onGrabExtinguisher={handleGrabExtinguisher}
        onRefillWaterAtSink={handleRefillWaterAtSink}
        onRinseAllAtSink={handleRinseAllAtSink}
        onStartSpray={() => setIsSpraying(true)}
        onStopSpray={() => setIsSpraying(false)}
        onResetAfterBurnDown={handleResetAllLab}
        onDismissExtinguishedBanner={handleDismissExtinguishedBanner}
        onToggleMute={() => {
          const nextMuted = !soundMuted;
          labAudio.muted = nextMuted;
          setSoundMuted(nextMuted);
        }}
        onMobileMove={(forward, strafe) => setMobileMove({ forward, strafe })}
      />

      <BackpackModal
        isOpen={backpackOpen}
        appMode={appMode}
        lessons={GUIDED_LESSONS}
        activeLessonId={activeLessonId}
        completedSteps={completedSteps}
        hotbar={hotbar}
        logs={logs}
        onClose={() => setBackpackOpen(false)}
        onChangeAppMode={(mode) => {
          setAppMode(mode);
          showToast(
            mode === 'SANDBOX'
              ? '🧪 Chế độ Phòng Tự Do: Thoải mái thử nghiệm mọi phản ứng & cháy nổ!'
              : '📘 Chế độ Theo Bài Học: Thực hành theo từng bước hướng dẫn.'
          );
        }}
        onSelectLesson={(id) => {
          setActiveLessonId(id);
          setVessels(createDefaultWorkbenchVessels());
          setCompletedSteps({});
          setHadSafetyIncidentInRun(false);
          setFireEmergency(INITIAL_FIRE_STATE);
        }}
        onResetLab={handleResetAllLab}
        onRemoveHotbarSlot={(idx) => {
          setHotbar((prev) => {
            const copy = [...prev];
            copy[idx] = null;
            return copy;
          });
        }}
        onWalkToCabinet={() => handleWalkToStation('REAGENT_CABINET')}
      />

      <CabinetModal
        isOpen={cabinetOpen}
        hotbar={hotbar}
        recommendedFormulas={
          appMode === 'CURRICULUM' ? activeLesson.recommendedReagents : []
        }
        onPickReagent={handlePickReagent}
        onClose={() => setCabinetOpen(false)}
      />
    </div>
  );
}

export default App;
