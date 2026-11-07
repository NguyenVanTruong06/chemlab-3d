import { AlertTriangle, Check, FlaskConical, X } from 'lucide-react';
import { SHELF_CHEMICALS } from '../engine/ChemistryEngine';
import type { HotbarItem } from '../types/chemistry';

interface CabinetModalProps {
  isOpen: boolean;
  hotbar: HotbarItem[];
  recommendedFormulas: string[];
  onPickReagent: (formula: string) => void;
  onClose: () => void;
}

export function CabinetModal({
  isOpen,
  hotbar,
  recommendedFormulas,
  onPickReagent,
  onClose,
}: CabinetModalProps) {
  if (!isOpen) return null;

  const carriedFormulas = new Set(
    hotbar
      .filter((item): item is { type: 'reagent'; formula: string } => item?.type === 'reagent')
      .map((i) => i.formula)
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="cabinet-modal"
        role="dialog"
        aria-label="Tủ Hóa Chất THCS"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-top-bar">
          <div className="modal-brand">
            <FlaskConical size={20} className="accent-icon" />
            <div>
              <h2>Tủ Lưu Trữ Hóa Chất & Kim Loại</h2>
              <span>Bấm vào lọ hóa chất để lấy vào Thanh Dụng Cụ Cầm Tay (Tối đa 6 ô)</span>
            </div>
          </div>
          <button
            id="btn-close-cabinet"
            type="button"
            className="modal-close-btn"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="cabinet-grid-scroll">
          <div className="cabinet-bottles-grid">
            {SHELF_CHEMICALS.map((chem) => {
              const inBag = carriedFormulas.has(chem.formula);
              const isRec = recommendedFormulas.includes(chem.formula);
              return (
                <button
                  key={chem.id}
                  id={`cabinet-pick-${chem.formula}`}
                  type="button"
                  className={`cabinet-bottle-card ${inBag ? 'picked' : ''} ${
                    chem.isHazardous ? 'hazard' : ''
                  }`}
                  onClick={() => onPickReagent(chem.formula)}
                >
                  <div className="cab-card-top">
                    <span
                      className="cab-bottle-swatch"
                      style={{ backgroundColor: chem.colorHex }}
                    />
                    <span className="cab-formula mono">{chem.displayFormula}</span>
                    {inBag && (
                      <span className="in-bag-tag">
                        <Check size={12} /> Đã cầm
                      </span>
                    )}
                    {!inBag && isRec && (
                      <span className="rec-tag">Cần cho bài</span>
                    )}
                  </div>
                  <div className="cab-name">{chem.nameVi}</div>
                  <p className="cab-note">
                    {chem.isHazardous && <AlertTriangle size={12} className="inline-warn" />}{' '}
                    {chem.safetyNote}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="cabinet-footer-bar">
          <span>
            Đang mang: <strong>{hotbar.filter(Boolean).length} / 6 ô</strong>
          </span>
          <button type="button" className="done-cabinet-btn" onClick={onClose}>
            Đóng Tủ & Quay Lại Bàn Thí Nghiệm
          </button>
        </div>
      </div>
    </div>
  );
}
