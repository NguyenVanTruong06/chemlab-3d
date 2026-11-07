import {
  AlertTriangle,
  ArrowRightLeft,
  Beaker,
  Droplets,
  Flame,
  Gauge,
  Scale,
  Thermometer,
  Trash2,
} from 'lucide-react';
import { SHELF_CHEMICALS, SPECIES_NAMES } from '../engine/ChemistryEngine';
import type { ChemicalDef, ReactionLogEntry, VesselState } from '../types/chemistry';

interface WorkbenchControlsProps {
  vessels: VesselState[];
  selectedVesselId: string;
  selectedReagentFormula: string;
  logs: ReactionLogEntry[];
  onSelectVessel: (vesselId: string) => void;
  onSelectReagent: (formula: string) => void;
  onDispenseReagent: (chem: ChemicalDef, amount: number) => void;
  onPourVesselToVessel: (sourceId: string, targetId: string, ml: number) => void;
  onToggleBurner: (vesselId: string, on: boolean, level: 1 | 2 | 3) => void;
  onEmptyVessel: (vesselId: string) => void;
}

export function WorkbenchControls({
  vessels,
  selectedVesselId,
  selectedReagentFormula,
  logs,
  onSelectVessel,
  onSelectReagent,
  onDispenseReagent,
  onPourVesselToVessel,
  onToggleBurner,
  onEmptyVessel,
}: WorkbenchControlsProps) {
  const activeVessel = vessels.find((v) => v.id === selectedVesselId) || vessels[0];
  const activeChem =
    SHELF_CHEMICALS.find((c) => c.formula === selectedReagentFormula) || SHELF_CHEMICALS[0];
  const heatableVessel = vessels.find((v) => v.isHeatable)!;

  const isSolid = activeChem.stateType === 'solid';
  const isIndicator = activeChem.stateType === 'indicator';

  const dispensePresets = isSolid
    ? [
        { label: '+0.10 g (Nhỏ)', val: 0.1 },
        { label: '+0.25 g (Vừa)', val: 0.25 },
        { label: '+0.65 g (Lớn)', val: 0.65 },
      ]
    : isIndicator
    ? [
        { label: '+0.5 ml (1 giọt)', val: 0.5 },
        { label: '+1.0 ml (2 giọt)', val: 1.0 },
        { label: '+2.0 ml', val: 2.0 },
      ]
    : [
        { label: '+1 ml (Nhỏ giọt)', val: 1 },
        { label: '+10 ml', val: 10 },
        { label: '+25 ml', val: 25 },
        { label: '+50 ml', val: 50 },
      ];

  const otherVessels = vessels.filter((v) => v.id !== activeVessel.id);

  // Extract non-water species for the live molar table
  const speciesEntries = Object.entries(activeVessel.moles).filter(
    ([sp, mol]) => sp !== 'H2O' && mol > 1e-5
  );

  const pHBadgeClass =
    activeVessel.pH < 5.5
      ? 'ph-acid'
      : activeVessel.pH > 8.2
      ? 'ph-base'
      : 'ph-neutral';

  return (
    <section className="workbench-panel" aria-label="Bảng thao tác bàn thí nghiệm">
      {/* 1. Vessel Selector Strip */}
      <div className="vessel-selector-row">
        {vessels.map((v) => {
          const isSelected = v.id === activeVessel.id;
          return (
            <button
              key={v.id}
              id={`btn-select-${v.id}`}
              type="button"
              className={`vessel-pill-btn ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectVessel(v.id)}
            >
              <div className="vessel-pill-top">
                <Beaker size={14} />
                <span className="vessel-pill-name">{v.name}</span>
              </div>
              <div className="vessel-pill-metrics">
                <span>{v.volumeMl.toFixed(0)} ml</span>
                <span>•</span>
                <span>pH {v.pH.toFixed(1)}</span>
                <span>•</span>
                <span className={v.temperatureC > 45 ? 'hot-temp' : ''}>
                  {v.temperatureC.toFixed(0)}°C
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. Live Telemetry Readout of Active Vessel */}
      <div className="telemetry-card">
        <div className="telemetry-header">
          <div>
            <h3 className="telemetry-vessel-title">{activeVessel.name}</h3>
            <span className="telemetry-subtitle">{activeVessel.subtitle}</span>
          </div>
          <button
            id="btn-rinse-vessel"
            type="button"
            className="rinse-btn"
            onClick={() => onEmptyVessel(activeVessel.id)}
            title="Đổ bỏ & tráng rửa sạch bình này"
          >
            <Trash2 size={14} />
            <span>Rửa bình</span>
          </button>
        </div>

        <div className="telemetry-gauges">
          <div className="gauge-box">
            <span className="gauge-label">
              <Droplets size={13} /> Thể tích (V)
            </span>
            <strong className="gauge-val mono">
              {activeVessel.volumeMl.toFixed(1)} / {activeVessel.capacityMl} ml
            </strong>
          </div>
          <div className="gauge-box">
            <span className="gauge-label">
              <Thermometer size={13} /> Nhiệt độ (T)
            </span>
            <strong
              className={`gauge-val mono ${
                activeVessel.temperatureC >= 80 ? 'temp-high' : ''
              }`}
            >
              {activeVessel.temperatureC.toFixed(1)} °C
            </strong>
          </div>
          <div className="gauge-box">
            <span className="gauge-label">
              <Gauge size={13} /> Độ pH
            </span>
            <strong className={`gauge-val mono ${pHBadgeClass}`}>
              {activeVessel.pH.toFixed(2)}
            </strong>
          </div>
        </div>

        {/* Active Chemical Equations Banner */}
        {activeVessel.activeEquations.length > 0 && (
          <div className="equation-box">
            <span className="eq-caption">Phương trình phản ứng vừa xảy ra:</span>
            {activeVessel.activeEquations.map((eq, i) => (
              <div key={i} className="eq-formula mono">
                {eq}
              </div>
            ))}
          </div>
        )}

        {/* Real-time Molarity & Species Composition */}
        <div className="species-composition">
          <div className="species-header">
            <span>Trạng thái Lượng chất trong bình (Real-time Mol & C_M):</span>
          </div>
          {speciesEntries.length === 0 ? (
            <p className="empty-vessel-hint">
              {activeVessel.volumeMl > 0.5
                ? 'Chỉ chứa nước cất tinh khiết (H₂O).'
                : 'Bình đang trống — Hãy chọn hóa chất bên dưới để thêm vào.'}
            </p>
          ) : (
            <div className="species-grid">
              {speciesEntries.map(([sp, mol]) => {
                const isPpt = ['BaSO4', 'Cu(OH)2', 'CuO', 'Al(OH)3', 'MnO2'].includes(sp);
                const isSolidSp = ['Al', 'Na', 'CaCO3', 'KMnO4'].includes(sp);
                const concM =
                  !isPpt && !isSolidSp && activeVessel.volumeMl > 0.5
                    ? mol / (activeVessel.volumeMl / 1000)
                    : null;
                return (
                  <div key={sp} className="species-item">
                    <span className="sp-name">{SPECIES_NAMES[sp] || sp}</span>
                    <span className="sp-mol mono">
                      {mol.toFixed(4)} mol
                      {concM !== null ? ` (${concM.toFixed(2)}M)` : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 3. Reagent Shelf & Precision Dispenser */}
      <div className="reagent-dispenser-card">
        <div className="dispenser-header">
          <span className="section-kicker">
            <Scale size={14} /> Kệ Hóa Chất THCS (13 chất chuẩn)
          </span>
          <span className="category-badge">{activeChem.category}</span>
        </div>

        <div className="reagent-grid">
          {SHELF_CHEMICALS.map((chem) => {
            const active = chem.formula === activeChem.formula;
            return (
              <button
                key={chem.id}
                id={`reagent-${chem.formula}`}
                type="button"
                className={`reagent-tile ${active ? 'active' : ''} ${
                  chem.isHazardous ? 'hazard' : ''
                }`}
                onClick={() => onSelectReagent(chem.formula)}
              >
                <span
                  className="reagent-swatch"
                  style={{ backgroundColor: chem.colorHex }}
                />
                <span className="reagent-formula">{chem.displayFormula}</span>
              </button>
            );
          })}
        </div>

        <div className="selected-chem-detail">
          <div className="chem-detail-title">
            <strong>{activeChem.nameVi}</strong>
            <span className="mono">M = {activeChem.molarMass} g/mol</span>
          </div>
          <p className="chem-safety-note">
            {activeChem.isHazardous && <AlertTriangle size={13} className="inline-warn" />}{' '}
            {activeChem.safetyNote}
          </p>
        </div>

        <div className="dispense-buttons-row">
          {dispensePresets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="dispense-action-btn"
              onClick={() => onDispenseReagent(activeChem, preset.val)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Pour Between Vessels & Bunsen Burner Thermal Station */}
      <div className="lab-tools-grid">
        <div className="tool-subcard">
          <div className="tool-subcard-title">
            <ArrowRightLeft size={15} />
            <span>Rót từ {activeVessel.name.split(' ')[0]} sang bình khác</span>
          </div>
          <div className="pour-targets-col">
            {otherVessels.map((target) => (
              <button
                key={target.id}
                type="button"
                className="pour-btn"
                disabled={activeVessel.volumeMl < 1}
                onClick={() => onPourVesselToVessel(activeVessel.id, target.id, 25)}
              >
                Rót 25 ml → {target.name.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="tool-subcard burner-card">
          <div className="tool-subcard-title">
            <Flame size={15} className={heatableVessel.burnerOn ? 'flame-active' : ''} />
            <span>Đèn Cồn (Đun Bình Nhiệt C)</span>
          </div>
          <div className="burner-controls">
            <button
              id="btn-toggle-burner"
              type="button"
              className={`burner-toggle-btn ${heatableVessel.burnerOn ? 'on' : ''}`}
              onClick={() =>
                onToggleBurner(
                  heatableVessel.id,
                  !heatableVessel.burnerOn,
                  heatableVessel.burnerLevel
                )
              }
            >
              {heatableVessel.burnerOn ? '🔥 Đang Đun (Tắt)' : 'Bật Đèn Cồn'}
            </button>
            <div className="burner-levels">
              {([1, 2, 3] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  className={`lvl-btn ${heatableVessel.burnerLevel === lvl ? 'active' : ''}`}
                  onClick={() =>
                    onToggleBurner(heatableVessel.id, heatableVessel.burnerOn, lvl)
                  }
                >
                  {lvl === 1 ? 'Nhỏ (~95°)' : lvl === 2 ? 'Vừa (~165°)' : 'Mạnh (260°)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Compact Reaction Log */}
      <div className="reaction-log-card">
        <div className="log-header">Nhật ký Hiện tượng & Phản ứng (Thời gian thực)</div>
        <div className="log-list">
          {logs.length === 0 ? (
            <div className="log-empty">Chưa có thao tác nào được thực hiện.</div>
          ) : (
            logs.slice(0, 6).map((entry) => (
              <div key={entry.id} className={`log-item ${entry.type}`}>
                <div className="log-meta">
                  <span className="mono">{entry.timestamp}</span> •{' '}
                  <strong>{entry.vesselName}</strong>
                </div>
                <div className="log-eq mono">{entry.equation}</div>
                <div className="log-phenom">{entry.phenomenon}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
