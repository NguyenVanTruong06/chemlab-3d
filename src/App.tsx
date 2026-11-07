import { useCallback, useEffect, useState } from 'react';
import {
  AlertOctagon,
  Compass,
  Eye,
  Footprints,
  GraduationCap,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { LabCanvas, type PourCommand } from './components/LabCanvas';
import { CurriculumPanel } from './components/CurriculumPanel';
import { WorkbenchControls } from './components/WorkbenchControls';
import {
  addReagentToVessel,
  createDefaultWorkbenchVessels,
  createInitialVessel,
  GUIDED_LESSONS,
  pourBetweenVessels,
  SHELF_CHEMICALS,
  stepVesselSimulation,
} from './engine/ChemistryEngine';
import type {
  AppMode,
  CameraMode,
  ChemicalDef,
  ReactionLogEntry,
  VesselState,
} from './types/chemistry';
import './App.css';

function evaluateLatchedLessonSteps(
  lessonId: string,
  vessels: VesselState[],
  prevCompleted: Record<string, boolean>
): Record<string, boolean> {
  const lesson = GUIDED_LESSONS.find((l) => l.id === lessonId) || GUIDED_LESSONS[0];
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
  return changed ? next : prevCompleted;
}

export function App() {
  const [appMode, setAppMode] = useState<AppMode>('CURRICULUM');
  const [cameraMode, setCameraMode] = useState<CameraMode>('WORKBENCH_FOCUS');
  const [vessels, setVessels] = useState<VesselState[]>(() =>
    createDefaultWorkbenchVessels()
  );
  const [selectedVesselId, setSelectedVesselId] = useState<string>('vessel-1');
  const [selectedReagentFormula, setSelectedReagentFormula] = useState<string>('AlCl3');
  const [activeLessonId, setActiveLessonId] = useState<string>(GUIDED_LESSONS[0].id);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [logs, setLogs] = useState<ReactionLogEntry[]>([]);
  const [pourCommand, setPourCommand] = useState<PourCommand | null>(null);
  const [isNearWorkbench, setIsNearWorkbench] = useState<boolean>(true);
  const [mobileMove, setMobileMove] = useState<{ forward: number; strafe: number }>({
    forward: 0,
    strafe: 0,
  });
  const [hazardAlert, setHazardAlert] = useState<string | null>(null);
  const [drawerCollapsed, setDrawerCollapsed] = useState<boolean>(false);

  // Continuous Real-time Chemistry & Thermal Simulation Tick (10 Hz)
  useEffect(() => {
    const timer = window.setInterval(() => {
      setVessels((prevVessels) => {
        const newLogs: ReactionLogEntry[] = [];
        let hazardMsg: string | null = null;

        const nextVessels = prevVessels.map((v) => {
          const res = stepVesselSimulation(v, 0.1);
          if (res.hazardTriggered) {
            hazardMsg =
              'CẢNH BÁO NGUY HIỂM: Bạn đã cho lượng lớn Kim loại Natri (> 0.5g) vào nước! Phản ứng tỏa nhiệt cực mạnh làm khí H₂ bốc cháy gây nổ văng kiềm. Trong thực tế chỉ được lấy mẩu bằng hạt đậu xanh!';
          }
          if (res.triggeredEquations.length > 0) {
            const latestEq = res.triggeredEquations[0];
            if (!v.activeEquations.includes(latestEq)) {
              newLogs.push({
                id: `${Date.now()}-${v.id}-${Math.random().toString(36).slice(2, 6)}`,
                timestamp: new Date().toLocaleTimeString('vi-VN', { hour12: false }),
                vesselName: v.name,
                equation: latestEq,
                phenomenon: res.phenomena[0] || 'Phản ứng đang diễn biến theo thời gian thực.',
                type: res.hazardTriggered ? 'hazard' : 'thermal',
              });
            }
          }
          return res.nextVessel;
        });

        if (hazardMsg) {
          setHazardAlert(hazardMsg);
        }
        if (newLogs.length > 0) {
          setLogs((prev) => [...newLogs, ...prev].slice(0, 25));
        }

        setCompletedSteps((prevSteps) =>
          evaluateLatchedLessonSteps(activeLessonId, nextVessels, prevSteps)
        );

        return nextVessels;
      });
    }, 100);

    return () => window.clearInterval(timer);
  }, [activeLessonId]);

  // Keyboard shortcut [E] to toggle between Room Walk & Workbench Focus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
      if (e.code === 'KeyE') {
        setCameraMode((prev) =>
          prev === 'ROOM_WALK' ? 'WORKBENCH_FOCUS' : 'ROOM_WALK'
        );
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleDispenseReagent = useCallback(
    (chem: ChemicalDef, amount: number) => {
      setVessels((prev) => {
        const next = prev.map((v) => {
          if (v.id !== selectedVesselId) return v;
          const { nextVessel, log } = addReagentToVessel(v, chem, amount);
          setLogs((old) => [log, ...old].slice(0, 25));
          if (log.type === 'hazard') {
            setHazardAlert(
              'CẢNH BÁO NGUY HIỂM: Phản ứng giữa lượng lớn Natri và nước gây nổ nhiệt trong phòng thí nghiệm!'
            );
          }
          return nextVessel;
        });
        setCompletedSteps((prevSteps) =>
          evaluateLatchedLessonSteps(activeLessonId, next, prevSteps)
        );
        return next;
      });

      setPourCommand((prev) => ({
        seq: (prev?.seq || 0) + 1,
        targetVesselId: selectedVesselId,
        colorHex: chem.colorHex,
      }));
    },
    [selectedVesselId, activeLessonId]
  );

  const handlePourVesselToVessel = useCallback(
    (sourceId: string, targetId: string, ml: number) => {
      setVessels((prev) => {
        const src = prev.find((v) => v.id === sourceId);
        const dst = prev.find((v) => v.id === targetId);
        if (!src || !dst) return prev;

        const { nextSource, nextTarget, log } = pourBetweenVessels(src, dst, ml);
        if (log) {
          setLogs((old) => [log, ...old].slice(0, 25));
        }
        setPourCommand((oldCmd) => ({
          seq: (oldCmd?.seq || 0) + 1,
          targetVesselId: targetId,
          sourceVesselId: sourceId,
          colorHex: src.visual.liquidColorHex,
        }));

        const next = prev.map((v) => {
          if (v.id === sourceId) return nextSource;
          if (v.id === targetId) return nextTarget;
          return v;
        });
        setCompletedSteps((prevSteps) =>
          evaluateLatchedLessonSteps(activeLessonId, next, prevSteps)
        );
        return next;
      });
    },
    [activeLessonId]
  );

  const handleToggleBurner = useCallback(
    (vesselId: string, on: boolean, level: 1 | 2 | 3) => {
      setVessels((prev) =>
        prev.map((v) =>
          v.id === vesselId ? { ...v, burnerOn: on, burnerLevel: level } : v
        )
      );
    },
    []
  );

  const handleEmptyVessel = useCallback((vesselId: string) => {
    setVessels((prev) =>
      prev.map((v) => {
        if (v.id !== vesselId) return v;
        return createInitialVessel(
          v.id,
          v.name,
          v.subtitle,
          v.capacityMl,
          v.isHeatable
        );
      })
    );
    setHazardAlert(null);
  }, []);

  const handleResetAllLab = useCallback(() => {
    setVessels(createDefaultWorkbenchVessels());
    setCompletedSteps({});
    setLogs([]);
    setHazardAlert(null);
  }, []);

  const handleSelectReagentFrom3D = useCallback((formula: string) => {
    setSelectedReagentFormula(formula);
    const chem = SHELF_CHEMICALS.find((c) => c.formula === formula);
    if (chem) {
      setLogs((prev) =>
        [
          {
            id: `${Date.now()}-pick`,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour12: false }),
            vesselName: 'Tủ Hóa Chất 3D',
            equation: `Đã lấy lọ ${chem.displayFormula}`,
            phenomenon: `${chem.nameVi} đã sẵn sàng trên tay để rót vào bình thí nghiệm.`,
            type: 'info' as const,
          },
          ...prev,
        ].slice(0, 25)
      );
    }
  }, []);

  return (
    <div className="chemlab-app-shell">
      {/* Top Navigation Header */}
      <header className="top-nav-bar">
        <div className="brand-block">
          <div className="brand-logo-mark" aria-hidden="true">
            ⚗️
          </div>
          <div>
            <h1 className="brand-heading">ChemLab 3D</h1>
            <p className="brand-tagline">Phòng Thí Nghiệm Hóa Học THCS • Thời Gian Thực</p>
          </div>
        </div>

        {/* Mode Switcher: Guided Curriculum vs Unlimited Sandbox */}
        <nav className="mode-switcher" aria-label="Chế độ học tập">
          <button
            id="mode-btn-curriculum"
            type="button"
            className={`mode-btn ${appMode === 'CURRICULUM' ? 'active' : ''}`}
            onClick={() => setAppMode('CURRICULUM')}
          >
            <GraduationCap size={16} />
            <span>Bài Học Lớp 8 - 9</span>
          </button>
          <button
            id="mode-btn-sandbox"
            type="button"
            className={`mode-btn ${appMode === 'SANDBOX' ? 'active' : ''}`}
            onClick={() => setAppMode('SANDBOX')}
          >
            <Sparkles size={16} />
            <span>Phòng Lab Tự Do</span>
          </button>
        </nav>

        {/* 3D Camera Perspective Switcher */}
        <div className="camera-switcher" role="group" aria-label="Góc nhìn không gian 3D">
          <button
            id="cam-btn-workbench"
            type="button"
            className={`cam-btn ${cameraMode === 'WORKBENCH_FOCUS' ? 'active' : ''}`}
            onClick={() => setCameraMode('WORKBENCH_FOCUS')}
            title="Góc nhìn cận cảnh thao tác tại bàn thí nghiệm"
          >
            <Eye size={15} />
            <span>Bàn Lab</span>
          </button>
          <button
            id="cam-btn-walk"
            type="button"
            className={`cam-btn ${cameraMode === 'ROOM_WALK' ? 'active' : ''}`}
            onClick={() => setCameraMode('ROOM_WALK')}
            title="Đi lại tự do trong phòng thí nghiệm bằng WASD hoặc phím điều hướng"
          >
            <Footprints size={15} />
            <span>Đi Lại (WASD)</span>
          </button>
          <button
            id="cam-btn-overview"
            type="button"
            className={`cam-btn ${cameraMode === 'ORBIT_OVERVIEW' ? 'active' : ''}`}
            onClick={() => setCameraMode('ORBIT_OVERVIEW')}
            title="Xoay 360 độ toàn cảnh phòng thí nghiệm"
          >
            <Compass size={15} />
            <span>Toàn Cảnh 360°</span>
          </button>
        </div>

        <div className="header-actions">
          <button
            id="btn-reset-all-lab"
            type="button"
            className="reset-lab-btn"
            onClick={handleResetAllLab}
          >
            <RotateCcw size={15} />
            <span>Làm mới Lab</span>
          </button>
        </div>
      </header>

      {/* Main 3D Workspace + Floating Panels */}
      <main className="workspace-stage">
        <LabCanvas
          vessels={vessels}
          selectedVesselId={selectedVesselId}
          cameraMode={cameraMode}
          pourCommand={pourCommand}
          mobileMove={mobileMove}
          onSelectVessel={setSelectedVesselId}
          onSelectReagentFrom3D={handleSelectReagentFrom3D}
          onNearWorkbenchChange={setIsNearWorkbench}
        />

        {/* Safety Hazard Warning Banner */}
        {hazardAlert && (
          <div className="hazard-modal-banner" role="alert">
            <AlertOctagon size={24} className="hazard-icon" />
            <div className="hazard-text">
              <strong>CẢNH BÁO AN TOÀN HÓA CHẤT!</strong>
              <p>{hazardAlert}</p>
            </div>
            <button
              type="button"
              className="hazard-dismiss-btn"
              onClick={() => setHazardAlert(null)}
            >
              Đã hiểu quy tắc
            </button>
          </div>
        )}

        {/* Spatial Walk Overlay Controls (WASD Guide + Touch D-Pad + Interact Prompt) */}
        {cameraMode === 'ROOM_WALK' && (
          <div className="walk-hud-overlay">
            <div className="walk-instructions-pill">
              <span>
                🚶 <strong>Chế độ Đi lại trong Phòng Lab:</strong> Dùng phím <kbd>W</kbd>
                <kbd>A</kbd>
                <kbd>S</kbd>
                <kbd>D</kbd> để di chuyển • Kéo chuột/chạm để xoay góc nhìn • Click trực tiếp vào Tủ Hóa Chất hoặc Cốc.
              </span>
            </div>

            {isNearWorkbench && (
              <button
                id="btn-enter-workbench"
                type="button"
                className="interact-bench-prompt"
                onClick={() => setCameraMode('WORKBENCH_FOCUS')}
              >
                🔬 Đứng gần Bàn Thí Nghiệm — Bấm hoặc nhấn [E] để thao tác cận cảnh
              </button>
            )}

            {/* Touch / Mobile D-Pad for walking on phones & tablets */}
            <div className="touch-dpad" aria-label="Điều hướng di chuyển trên điện thoại">
              <button
                type="button"
                className="dpad-btn up"
                onPointerDown={() => setMobileMove({ forward: 1, strafe: 0 })}
                onPointerUp={() => setMobileMove({ forward: 0, strafe: 0 })}
                onPointerLeave={() => setMobileMove({ forward: 0, strafe: 0 })}
              >
                ▲
              </button>
              <div className="dpad-mid-row">
                <button
                  type="button"
                  className="dpad-btn left"
                  onPointerDown={() => setMobileMove({ forward: 0, strafe: -1 })}
                  onPointerUp={() => setMobileMove({ forward: 0, strafe: 0 })}
                  onPointerLeave={() => setMobileMove({ forward: 0, strafe: 0 })}
                >
                  ◀
                </button>
                <button
                  type="button"
                  className="dpad-btn down"
                  onPointerDown={() => setMobileMove({ forward: -1, strafe: 0 })}
                  onPointerUp={() => setMobileMove({ forward: 0, strafe: 0 })}
                  onPointerLeave={() => setMobileMove({ forward: 0, strafe: 0 })}
                >
                  ▼
                </button>
                <button
                  type="button"
                  className="dpad-btn right"
                  onPointerDown={() => setMobileMove({ forward: 0, strafe: 1 })}
                  onPointerUp={() => setMobileMove({ forward: 0, strafe: 0 })}
                  onPointerLeave={() => setMobileMove({ forward: 0, strafe: 0 })}
                >
                  ▶
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Drawer Minimize/Expand Button for Fullscreen 3D Viewing */}
        <button
          id="btn-toggle-ui-panels"
          type="button"
          className="toggle-panels-fab"
          onClick={() => setDrawerCollapsed((c) => !c)}
          title={drawerCollapsed ? 'Mở bảng điều khiển thí nghiệm' : 'Thu gọn bảng để xem rộng phòng 3D'}
        >
          {drawerCollapsed ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          <span>{drawerCollapsed ? 'Mở Bảng Thao Tác' : 'Thu gọn UI'}</span>
        </button>

        {/* Left Guided Curriculum Panel */}
        {!drawerCollapsed && appMode === 'CURRICULUM' && (
          <CurriculumPanel
            key={activeLessonId}
            lessons={GUIDED_LESSONS}
            activeLessonId={activeLessonId}
            completedSteps={completedSteps}
            onSelectLesson={(id) => {
              setActiveLessonId(id);
              handleResetAllLab();
            }}
            onResetLabForLesson={handleResetAllLab}
            onQuickSelectReagent={(formula) => setSelectedReagentFormula(formula)}
          />
        )}

        {/* Right Workbench Control & Real-time Telemetry Panel */}
        {!drawerCollapsed && (
          <WorkbenchControls
            vessels={vessels}
            selectedVesselId={selectedVesselId}
            selectedReagentFormula={selectedReagentFormula}
            logs={logs}
            onSelectVessel={setSelectedVesselId}
            onSelectReagent={setSelectedReagentFormula}
            onDispenseReagent={handleDispenseReagent}
            onPourVesselToVessel={handlePourVesselToVessel}
            onToggleBurner={handleToggleBurner}
            onEmptyVessel={handleEmptyVessel}
          />
        )}
      </main>
    </div>
  );
}

export default App;
