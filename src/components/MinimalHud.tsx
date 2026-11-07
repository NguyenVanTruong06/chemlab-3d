import {
  AlertOctagon,
  ArrowRightLeft,
  Backpack,
  Compass,
  Eye,
  Flame,
  Footprints,
  RotateCcw,
  ShieldCheck,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { SHELF_CHEMICALS, SPECIES_NAMES } from '../engine/ChemistryEngine';
import type {
  AppMode,
  CameraMode,
  ChemicalDef,
  FireEmergencyState,
  GuidedLesson,
  HotbarItem,
  StationId,
  VesselState,
} from '../types/chemistry';

interface MinimalHudProps {
  appMode: AppMode;
  cameraMode: CameraMode;
  currentStation: StationId;
  distanceToFire: number;
  vessels: VesselState[];
  selectedVesselId: string;
  hotbar: HotbarItem[];
  activeSlotIndex: number;
  activeLesson: GuidedLesson;
  completedSteps: Record<string, boolean>;
  fireEmergency: FireEmergencyState;
  isSpraying: boolean;
  soundMuted: boolean;
  toastMessage: string | null;
  onExitToHub: () => void;
  onFinishPracticeGoQuiz: () => void;
  onOpenBackpack: () => void;
  onOpenCabinet: () => void;
  onSetCameraMode: (mode: CameraMode) => void;
  onWalkToStation: (station: Exclude<StationId, null>) => void;
  onSelectHotbarSlot: (idx: number) => void;
  onSelectVessel: (vesselId: string) => void;
  onDispenseHeldReagent: (chem: ChemicalDef, amount: number) => void;
  onPourBetweenVessels: (srcId: string, dstId: string) => void;
  onToggleBurner: (vesselId: string, on: boolean, level: 1 | 2 | 3) => void;
  onGrabExtinguisher: () => void;
  onRefillWaterAtSink: () => void;
  onRinseAllAtSink: () => void;
  onStartSpray: () => void;
  onStopSpray: () => void;
  onResetAfterBurnDown: () => void;
  onDismissExtinguishedBanner: () => void;
  onToggleMute: () => void;
  onMobileMove: (forward: number, strafe: number) => void;
}

export function MinimalHud({
  appMode,
  cameraMode,
  currentStation,
  distanceToFire,
  vessels,
  selectedVesselId,
  hotbar,
  activeSlotIndex,
  activeLesson,
  completedSteps,
  fireEmergency,
  isSpraying,
  soundMuted,
  toastMessage,
  onExitToHub,
  onFinishPracticeGoQuiz,
  onOpenBackpack,
  onOpenCabinet,
  onSetCameraMode,
  onWalkToStation,
  onSelectHotbarSlot,
  onSelectVessel,
  onDispenseHeldReagent,
  onPourBetweenVessels,
  onToggleBurner,
  onGrabExtinguisher,
  onRefillWaterAtSink,
  onRinseAllAtSink,
  onStartSpray,
  onStopSpray,
  onResetAfterBurnDown,
  onDismissExtinguishedBanner,
  onToggleMute,
  onMobileMove,
}: MinimalHudProps) {
  const activeVessel = vessels.find((v) => v.id === selectedVesselId) || vessels[0];
  const heatableVessel = vessels.find((v) => v.isHeatable)!;
  const activeItem = hotbar[activeSlotIndex] ?? null;
  const activeChem =
    activeItem?.type === 'reagent'
      ? SHELF_CHEMICALS.find((c) => c.formula === activeItem.formula) || null
      : null;

  const ownsExtinguisher = hotbar.some((item) => item?.type === 'extinguisher');
  const holdingExtinguisher = activeItem?.type === 'extinguisher';

  const nextIncompleteStep = activeLesson.steps.find((s) => !completedSteps[s.id]);
  const doneCount = activeLesson.steps.filter((s) => completedSteps[s.id]).length;

  const nonWaterSpecies = Object.entries(activeVessel.moles).filter(
    ([sp, m]) => sp !== 'H2O' && m > 1e-4
  );

  const showWorkbenchBar =
    !fireEmergency.burnedDown &&
    !fireEmergency.active &&
    (currentStation === 'WORKBENCH' || cameraMode === 'WORKBENCH_FOCUS');

  const dispenseOptions = activeChem
    ? activeChem.stateType === 'solid'
      ? [
          { label: '+0.10g (Nhỏ)', val: 0.1 },
          { label: '+0.25g', val: 0.25 },
          { label: '+0.65g (Mẩu lớn!)', val: 0.65, warn: activeChem.isHazardous },
        ]
      : activeChem.stateType === 'indicator'
      ? [
          { label: '+0.5ml (1 giọt)', val: 0.5 },
          { label: '+1.5ml', val: 1.5 },
        ]
      : [
          { label: '+1 ml (Giọt)', val: 1 },
          { label: '+15 ml', val: 15 },
          { label: '+50 ml', val: 50 },
        ]
    : [];

  return (
    <div className="minimal-hud-layer">
      {/* 1. TOP-LEFT: Exit to Outer Hub + Compact Backpack Button + 1-Line Objective */}
      <div className="hud-top-left">
        <button
          id="btn-exit-to-hub"
          type="button"
          className="hud-hub-exit-btn"
          onClick={onExitToHub}
          title="Rời phòng Lab về Sảnh Lộ Trình Học Tập"
        >
          ← Sảnh Lộ Trình
        </button>

        <button
          id="btn-open-backpack"
          type="button"
          className="hud-backpack-btn"
          onClick={onOpenBackpack}
        >
          <Backpack size={18} />
          <span>Balo / Yêu cầu [B]</span>
          {appMode === 'CURRICULUM' && (
            <span className="hud-step-badge">
              {doneCount}/{activeLesson.steps.length}
            </span>
          )}
        </button>

        <button
          id="btn-mute-audio"
          type="button"
          className="hud-icon-pill"
          onClick={onToggleMute}
          title={soundMuted ? 'Bật âm thanh phòng Lab' : 'Tắt âm thanh'}
        >
          {soundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {appMode === 'CURRICULUM' && !fireEmergency.active && (
          nextIncompleteStep ? (
            <div className="hud-objective-chip" onClick={onOpenBackpack}>
              <span className="obj-dot" />
              <span className="obj-text">{nextIncompleteStep.instruction}</span>
            </div>
          ) : (
            <button
              id="btn-go-quiz-stage"
              type="button"
              className="hud-finish-stage-cta"
              onClick={onFinishPracticeGoQuiz}
            >
              🎉 Đã xong Thực hành! Bấm sang Bước 3: Kiểm tra & Nhận Sao →
            </button>
          )
        )}
      </div>

      {/* 2. TOP-RIGHT: Camera Toggle + Quick Physical Walk Buttons */}
      <div className="hud-top-right">
        <div className="hud-cam-group">
          <button
            id="hud-cam-walk"
            type="button"
            className={`hud-cam-pill ${cameraMode === 'ROOM_WALK' ? 'active' : ''}`}
            onClick={() => onSetCameraMode('ROOM_WALK')}
            title="Góc nhìn thực tế đi bộ trong phòng (WASD)"
          >
            <Footprints size={14} /> Đi bộ
          </button>
          <button
            id="hud-cam-bench"
            type="button"
            className={`hud-cam-pill ${cameraMode === 'WORKBENCH_FOCUS' ? 'active' : ''}`}
            onClick={() => onSetCameraMode('WORKBENCH_FOCUS')}
            title="Nhìn cận cảnh Bàn Thí Nghiệm [Phím V]"
          >
            <Eye size={14} /> Cận cảnh Bàn [V]
          </button>
          <button
            id="hud-cam-360"
            type="button"
            className={`hud-cam-pill ${cameraMode === 'ORBIT_OVERVIEW' ? 'active' : ''}`}
            onClick={() => onSetCameraMode('ORBIT_OVERVIEW')}
            title="Góc nhìn toàn cảnh căn phòng"
          >
            <Compass size={14} /> 360°
          </button>
        </div>

        {/* Quick Physical Walk Bar (Walks player smoothly across the room!) */}
        <div className="hud-quick-walk-row">
          <button
            type="button"
            className={`walk-chip ${currentStation === 'REAGENT_CABINET' ? 'here' : ''}`}
            onClick={() => onWalkToStation('REAGENT_CABINET')}
          >
            🧪 Tới Tủ Hóa Chất
          </button>
          <button
            type="button"
            className={`walk-chip ${currentStation === 'WORKBENCH' ? 'here' : ''}`}
            onClick={() => onWalkToStation('WORKBENCH')}
          >
            🔬 Tới Bàn Lab
          </button>
          <button
            type="button"
            className={`walk-chip ${currentStation === 'SINK' ? 'here' : ''}`}
            onClick={() => onWalkToStation('SINK')}
          >
            🚰 Tới Bồn Rửa
          </button>
          <button
            type="button"
            className={`walk-chip emergency ${
              currentStation === 'EXTINGUISHER_MOUNT' ? 'here' : ''
            } ${fireEmergency.active && !ownsExtinguisher ? 'pulse-red' : ''}`}
            onClick={() => onWalkToStation('EXTINGUISHER_MOUNT')}
          >
            🚒 Chỗ Bình Cứu Hỏa
          </button>
        </div>
      </div>

      {/* 3. SUBTLE TOAST FEEDBACK */}
      {toastMessage && !fireEmergency.active && (
        <div className="hud-toast-pill">{toastMessage}</div>
      )}

      {/* 4. EMERGENCY FIRE COUNTDOWN HUD (25s Survival!) */}
      {fireEmergency.active && !fireEmergency.burnedDown && (
        <div className="fire-emergency-hud" role="alert">
          <div className="fire-hud-header">
            <AlertOctagon size={22} className="blink-icon" />
            <div className="fire-hud-titles">
              <strong>🔥 BÁO ĐỘNG CHÁY NỔ: {fireEmergency.causeTitle}</strong>
              <span>
                Đám cháy đang lan rộng! Nếu không dập tắt trong{' '}
                <b className="mono">{fireEmergency.timeLeftSec.toFixed(1)}s</b> phòng Lab sẽ cháy rụi!
              </span>
            </div>
            <div className="fire-timer-badge mono">
              {fireEmergency.timeLeftSec.toFixed(1)}s
            </div>
          </div>

          <div className="fire-progress-track">
            <div
              className="fire-progress-fill"
              style={{ width: `${Math.min(100, fireEmergency.intensity)}%` }}
            />
          </div>

          <div className="fire-action-guidance">
            {!ownsExtinguisher ? (
              <button
                id="btn-sprint-extinguisher"
                type="button"
                className="fire-urgent-btn"
                onClick={() => onWalkToStation('EXTINGUISHER_MOUNT')}
              >
                🏃 Chạy ngay sang Tường Phải lấy Bình Chữa Cháy CO₂! (Hoặc dùng WASD)
              </button>
            ) : !holdingExtinguisher ? (
              <button
                type="button"
                className="fire-urgent-btn"
                onClick={() => {
                  const idx = hotbar.findIndex((i) => i?.type === 'extinguisher');
                  if (idx >= 0) onSelectHotbarSlot(idx);
                }}
              >
                🚒 Bấm chọn Bình Chữa Cháy CO₂ trên Thanh Đồ để cầm lên tay!
              </button>
            ) : distanceToFire > 3.3 && cameraMode === 'ROOM_WALK' ? (
              <button
                type="button"
                className="fire-urgent-btn"
                onClick={() => onWalkToStation('WORKBENCH')}
              >
                🏃 Bạn đang đứng quá xa ({distanceToFire.toFixed(1)}m) — Chạy lại gần Bàn Thí Nghiệm để xịt!
              </button>
            ) : (
              <button
                id="btn-spray-co2"
                type="button"
                className={`spray-co2-trigger-btn ${isSpraying ? 'spraying' : ''}`}
                onPointerDown={onStartSpray}
                onPointerUp={onStopSpray}
                onPointerLeave={onStopSpray}
              >
                ❄️ {isSpraying ? 'ĐANG XỊT TUYẾT LẠNH CO₂ DẬP LỬA...' : 'GIỮ NÚT NÀY (HOẶC PHÍM SPACE) ĐỂ XỊT BÌNH CỨU HỎA CO₂!'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 5. FIRE EXTINGUISHED SUCCESS DEBRIEF */}
      {fireEmergency.extinguishedSuccess && (
        <div className="debrief-banner success">
          <ShieldCheck size={26} />
          <div className="debrief-body">
            <strong>🚒 ĐÃ DẬP TẮT ĐÁM CHÁY KỊP THỜI!</strong>
            <p>{fireEmergency.chemicalExplanation}</p>
          </div>
          <button
            type="button"
            className="debrief-action-btn"
            onClick={onDismissExtinguishedBanner}
          >
            Dọn mảnh vỡ & Tiếp tục
          </button>
        </div>
      )}

      {/* 6. GAME OVER: LAB BURNED DOWN OVERLAY */}
      {fireEmergency.burnedDown && (
        <div className="burned-down-overlay" role="alertdialog">
          <div className="burned-down-card">
            <div className="burned-badge">💥 THÍ NGHIỆM THẤT BẠI — HẾT THỜI GIAN CỨU HỎA</div>
            <h2>Phòng Thí Nghiệm Đã Bị Cháy Rụi!</h2>
            <p className="burned-cause">
              <strong>Sự cố khởi phát:</strong> {fireEmergency.causeTitle}
            </p>
            <div className="burned-lesson-box">
              <strong>📖 Bài học An toàn Hóa học rút ra:</strong>
              <p>{fireEmergency.chemicalExplanation}</p>
            </div>
            <button
              id="btn-restore-burned-lab"
              type="button"
              className="restore-lab-cta"
              onClick={onResetAfterBurnDown}
            >
              <RotateCcw size={17} /> Khôi phục lại Phòng Lab & Thực hành an toàn
            </button>
          </div>
        </div>
      )}

      {/* 7. CONTEXTUAL PROXIMITY INTERACTION PROMPTS (Cabinet, Sink, Extinguisher) */}
      {!fireEmergency.burnedDown && currentStation === 'REAGENT_CABINET' && (
        <div className="station-context-prompt">
          <button
            id="btn-interact-cabinet"
            type="button"
            className="station-interact-btn"
            onClick={onOpenCabinet}
          >
            🧪 Mở Tủ Hóa Chất lấy dung dịch vào Balo [Phím F]
          </button>
        </div>
      )}

      {!fireEmergency.burnedDown && currentStation === 'SINK' && (
        <div className="station-context-prompt dual">
          <button
            id="btn-sink-water"
            type="button"
            className="station-interact-btn"
            onClick={onRefillWaterAtSink}
          >
            🚰 Lấy Nước Cất H₂O vào tay [Phím F]
          </button>
          <button
            id="btn-sink-rinse"
            type="button"
            className="station-interact-btn secondary"
            onClick={onRinseAllAtSink}
          >
            🧼 Rửa sạch & Thay mới toàn bộ cốc vỡ/bẩn [Phím R]
          </button>
        </div>
      )}

      {!fireEmergency.burnedDown &&
        currentStation === 'EXTINGUISHER_MOUNT' &&
        !ownsExtinguisher && (
          <div className="station-context-prompt">
            <button
              id="btn-grab-extinguisher"
              type="button"
              className="station-interact-btn danger"
              onClick={onGrabExtinguisher}
            >
              🚒 Giật chốt lấy BÌNH CHỮA CHÁY CO₂ cầm tay! [Phím F]
            </button>
          </div>
        )}

      {/* 8. COMPACT CONTEXTUAL WORKBENCH BAR (Only when at Workbench & No Fire!) */}
      {showWorkbenchBar && (
        <div className="compact-workbench-dock">
          {/* Row 1: Compact Vessel Tabs + Live Sensor Readout */}
          <div className="cw-top-row">
            <div className="cw-vessel-tabs">
              {vessels.map((v) => (
                <button
                  key={v.id}
                  id={`cw-select-${v.id}`}
                  type="button"
                  className={`cw-vtab ${v.id === activeVessel.id ? 'active' : ''} ${
                    v.visual.isBroken ? 'broken' : ''
                  }`}
                  onClick={() => onSelectVessel(v.id)}
                >
                  {v.visual.isBroken ? `💥 ${v.shortName} (Vỡ)` : v.shortName}
                </button>
              ))}
            </div>

            <div className="cw-telemetry-strip mono">
              <span>{activeVessel.volumeMl.toFixed(0)}ml</span>
              <span>•</span>
              <span className={activeVessel.temperatureC >= 80 ? 'hot' : ''}>
                {activeVessel.temperatureC.toFixed(1)}°C
              </span>
              <span>•</span>
              <span>pH {activeVessel.pH.toFixed(1)}</span>
              {nonWaterSpecies.length > 0 && (
                <>
                  <span>•</span>
                  <span className="cw-species-summary">
                    {nonWaterSpecies
                      .slice(0, 2)
                      .map(([sp, m]) => `${SPECIES_NAMES[sp]?.split(' ')[0] || sp}: ${m.toFixed(3)}mol`)
                      .join(', ')}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Latest Equation Readout (1 compact line if any) */}
          {activeVessel.activeEquations[0] && (
            <div className="cw-equation-line mono">{activeVessel.activeEquations[0]}</div>
          )}

          {/* Row 2: Contextual Pouring / Burner Controls */}
          <div className="cw-actions-row">
            {activeChem ? (
              <div className="cw-dispense-group">
                <span className="cw-held-label">
                  Đang cầm <strong>{activeChem.displayFormula}</strong> → {activeVessel.shortName}:
                </span>
                {dispenseOptions.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    className={`cw-pour-btn ${opt.warn ? 'warn' : ''}`}
                    onClick={() => onDispenseHeldReagent(activeChem, opt.val)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            ) : holdingExtinguisher ? (
              <span className="cw-empty-hand-msg">
                🚒 Đang cầm Bình Chữa Cháy CO₂ (Chọn ô hóa chất bên dưới để pha chế).
              </span>
            ) : (
              <span className="cw-empty-hand-msg">
                Ô tay đang trống — Hãy đi tới <strong>Tủ Hóa Chất</strong> để lấy dung dịch!
              </span>
            )}

            <div className="cw-right-tools">
              {/* Pour active vessel into next vessel */}
              {activeVessel.volumeMl >= 2 && (
                <button
                  type="button"
                  className="cw-tool-btn"
                  title="Rót 25 ml từ bình đang chọn sang bình kế tiếp"
                  onClick={() => {
                    const others = vessels.filter((v) => v.id !== activeVessel.id);
                    if (others[0]) onPourBetweenVessels(activeVessel.id, others[0].id);
                  }}
                >
                  <ArrowRightLeft size={13} /> Rót sang{' '}
                  {vessels.find((v) => v.id !== activeVessel.id)?.shortName}
                </button>
              )}

              {/* Bunsen Burner Compact Control */}
              <button
                id="cw-btn-burner"
                type="button"
                className={`cw-tool-btn burner ${heatableVessel.burnerOn ? 'on' : ''}`}
                onClick={() =>
                  onToggleBurner(
                    heatableVessel.id,
                    !heatableVessel.burnerOn,
                    heatableVessel.burnerLevel
                  )
                }
              >
                <Flame size={13} />
                {heatableVessel.burnerOn ? 'Tắt Đèn Cồn' : 'Bật Đèn Cồn'}
              </button>

              {heatableVessel.burnerOn && (
                <select
                  aria-label="Mức lửa đèn cồn"
                  className="cw-flame-select"
                  value={heatableVessel.burnerLevel}
                  onChange={(e) =>
                    onToggleBurner(
                      heatableVessel.id,
                      true,
                      Number(e.target.value) as 1 | 2 | 3
                    )
                  }
                >
                  <option value={1}>Lửa Nhỏ (95°C)</option>
                  <option value={2}>Lửa Vừa (175°C)</option>
                  <option value={3}>Lửa Cực Đại (275°C)</option>
                </select>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 9. TOUCH WALK D-PAD (Bottom-Left in ROOM_WALK Mode) */}
      {cameraMode === 'ROOM_WALK' && !fireEmergency.burnedDown && (
        <div className="hud-touch-dpad" aria-label="Phím di chuyển trong phòng">
          <button
            type="button"
            className="dpad-key"
            onPointerDown={() => onMobileMove(1, 0)}
            onPointerUp={() => onMobileMove(0, 0)}
            onPointerLeave={() => onMobileMove(0, 0)}
          >
            ▲
          </button>
          <div className="dpad-row">
            <button
              type="button"
              className="dpad-key"
              onPointerDown={() => onMobileMove(0, -1)}
              onPointerUp={() => onMobileMove(0, 0)}
              onPointerLeave={() => onMobileMove(0, 0)}
            >
              ◀
            </button>
            <button
              type="button"
              className="dpad-key"
              onPointerDown={() => onMobileMove(-1, 0)}
              onPointerUp={() => onMobileMove(0, 0)}
              onPointerLeave={() => onMobileMove(0, 0)}
            >
              ▼
            </button>
            <button
              type="button"
              className="dpad-key"
              onPointerDown={() => onMobileMove(0, 1)}
              onPointerUp={() => onMobileMove(0, 0)}
              onPointerLeave={() => onMobileMove(0, 0)}
            >
              ▶
            </button>
          </div>
        </div>
      )}

      {/* 10. BOTTOM 6-SLOT INVENTORY HOTBAR (Game-style Held Items!) */}
      {!fireEmergency.burnedDown && (
        <div className="hud-hotbar" role="toolbar" aria-label="Thanh dụng cụ cầm tay 6 ô">
          {hotbar.map((slot, idx) => {
            const selected = idx === activeSlotIndex;
            const chem =
              slot?.type === 'reagent'
                ? SHELF_CHEMICALS.find((c) => c.formula === slot.formula)
                : null;
            return (
              <button
                key={idx}
                id={`hotbar-slot-${idx + 1}`}
                type="button"
                className={`hotbar-slot ${selected ? 'selected' : ''} ${
                  slot?.type === 'extinguisher' ? 'extinguisher-slot' : ''
                }`}
                onClick={() => onSelectHotbarSlot(idx)}
              >
                <span className="slot-key-num">{idx + 1}</span>
                {!slot && <span className="slot-empty-dot">+</span>}
                {slot?.type === 'extinguisher' && (
                  <>
                    <span className="slot-emoji">🚒</span>
                    <span className="slot-label">Bình CO₂</span>
                  </>
                )}
                {chem && (
                  <>
                    <span
                      className="slot-bottle-dot"
                      style={{ backgroundColor: chem.colorHex }}
                    />
                    <span className="slot-label">{chem.formula.replace('_dac', ' đặc')}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
