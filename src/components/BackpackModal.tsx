import { useState } from 'react';
import {
  Backpack,
  BookOpen,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Flame,
  FlaskConical,
  HelpCircle,
  RotateCcw,
  ScrollText,
  ShieldAlert,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { SHELF_CHEMICALS } from '../engine/ChemistryEngine';
import type {
  AppMode,
  GuidedLesson,
  HotbarItem,
  ReactionLogEntry,
} from '../types/chemistry';

interface BackpackModalProps {
  isOpen: boolean;
  appMode: AppMode;
  lessons: GuidedLesson[];
  activeLessonId: string;
  completedSteps: Record<string, boolean>;
  hotbar: HotbarItem[];
  logs: ReactionLogEntry[];
  onClose: () => void;
  onChangeAppMode: (mode: AppMode) => void;
  onSelectLesson: (lessonId: string) => void;
  onResetLab: () => void;
  onRemoveHotbarSlot: (index: number) => void;
  onWalkToCabinet: () => void;
}

type BackpackTab = 'tasks' | 'inventory' | 'journal';

export function BackpackModal({
  isOpen,
  appMode,
  lessons,
  activeLessonId,
  completedSteps,
  hotbar,
  logs,
  onClose,
  onChangeAppMode,
  onSelectLesson,
  onResetLab,
  onRemoveHotbarSlot,
  onWalkToCabinet,
}: BackpackModalProps) {
  const [tab, setTab] = useState<BackpackTab>('tasks');
  const [subTab, setSubTab] = useState<'practice' | 'theory' | 'quiz'>('practice');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  if (!isOpen) return null;

  const lesson = lessons.find((l) => l.id === activeLessonId) || lessons[0];
  const doneCount = lesson.steps.filter((s) => completedSteps[s.id]).length;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="backpack-modal"
        role="dialog"
        aria-label="Balo và Sổ tay Thí nghiệm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-top-bar">
          <div className="modal-brand">
            <Backpack size={20} className="accent-icon" />
            <div>
              <h2>Balo & Sổ Tay Thí Nghiệm</h2>
              <span>Phím tắt mở/đóng nhanh: [B] hoặc [Esc]</span>
            </div>
          </div>

          <div className="modal-mode-pills">
            <button
              type="button"
              className={`pill-switch ${appMode === 'CURRICULUM' ? 'active' : ''}`}
              onClick={() => onChangeAppMode('CURRICULUM')}
            >
              <BookOpen size={14} /> Theo Bài Học
            </button>
            <button
              type="button"
              className={`pill-switch ${appMode === 'SANDBOX' ? 'active' : ''}`}
              onClick={() => onChangeAppMode('SANDBOX')}
            >
              <Sparkles size={14} /> Phòng Tự Do
            </button>
          </div>

          <button
            id="btn-close-backpack"
            type="button"
            className="modal-close-btn"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Primary Backpack Navigation Tabs */}
        <div className="backpack-nav-tabs">
          <button
            type="button"
            className={`bp-tab ${tab === 'tasks' ? 'active' : ''}`}
            onClick={() => setTab('tasks')}
          >
            <FlaskConical size={15} />
            <span>
              {appMode === 'CURRICULUM'
                ? `Yêu cầu Bài học (${doneCount}/${lesson.steps.length})`
                : 'Hướng dẫn Sandbox & Thử Nổ'}
            </span>
          </button>
          <button
            type="button"
            className={`bp-tab ${tab === 'inventory' ? 'active' : ''}`}
            onClick={() => setTab('inventory')}
          >
            <Backpack size={15} />
            <span>Túi Đồ Đang Cầm ({hotbar.filter(Boolean).length}/6)</span>
          </button>
          <button
            type="button"
            className={`bp-tab ${tab === 'journal' ? 'active' : ''}`}
            onClick={() => setTab('journal')}
          >
            <ScrollText size={15} />
            <span>Nhật Ký Phản Ứng ({logs.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="backpack-body">
          {tab === 'tasks' && appMode === 'CURRICULUM' && (
            <div className="bp-section">
              <div className="bp-lesson-bar">
                <select
                  className="bp-select"
                  value={lesson.id}
                  onChange={(e) => {
                    setSelectedAnswers({});
                    onSelectLesson(e.target.value);
                  }}
                >
                  {lessons.map((item) => (
                    <option key={item.id} value={item.id}>
                      [{item.grade}] {item.title}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="bp-secondary-btn"
                  onClick={() => {
                    setSelectedAnswers({});
                    onResetLab();
                  }}
                >
                  <RotateCcw size={14} /> Làm lại bài
                </button>
              </div>

              <div className="bp-subtabs">
                <button
                  type="button"
                  className={subTab === 'practice' ? 'active' : ''}
                  onClick={() => setSubTab('practice')}
                >
                  1. Các bước Thực hành
                </button>
                <button
                  type="button"
                  className={subTab === 'theory' ? 'active' : ''}
                  onClick={() => setSubTab('theory')}
                >
                  2. Kiến thức Lý thuyết
                </button>
                <button
                  type="button"
                  className={subTab === 'quiz' ? 'active' : ''}
                  onClick={() => setSubTab('quiz')}
                >
                  3. Kiểm tra ({lesson.quiz.length} câu)
                </button>
              </div>

              {subTab === 'practice' && (
                <div className="bp-steps-wrap">
                  <div className="needed-reagents-banner">
                    <span>Hóa chất cần ra Tủ lấy cho bài này: </span>
                    <strong>{lesson.recommendedReagents.join(', ')}</strong>
                    <button
                      type="button"
                      className="go-cabinet-inline-btn"
                      onClick={() => {
                        onClose();
                        onWalkToCabinet();
                      }}
                    >
                      🚶 Đi tới Tủ Hóa Chất ngay →
                    </button>
                  </div>

                  {lesson.steps.map((st, idx) => {
                    const done = !!completedSteps[st.id];
                    return (
                      <div key={st.id} className={`bp-step-row ${done ? 'done' : ''}`}>
                        {done ? (
                          <CheckCircle2 size={20} className="ok-ico" />
                        ) : (
                          <Circle size={20} className="muted-ico" />
                        )}
                        <div>
                          <div className="bp-step-kicker">
                            Bước {idx + 1} {done && '• Đã hoàn thành'}
                          </div>
                          <p className="bp-step-main">{st.instruction}</p>
                          <p className="bp-step-hint">
                            <HelpCircle size={13} /> {st.hint}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {subTab === 'theory' && (
                <div className="bp-theory-wrap">
                  <p className="bp-lead">{lesson.summary}</p>
                  {lesson.theoryPoints.map((pt, i) => (
                    <div key={i} className="bp-theory-card">
                      <strong>Điểm cốt lõi {i + 1}:</strong> {pt}
                    </div>
                  ))}
                  <div className="bp-warn-box">
                    <ShieldAlert size={18} />
                    <span>{lesson.safetyWarning}</span>
                  </div>
                </div>
              )}

              {subTab === 'quiz' && (
                <div className="bp-quiz-wrap">
                  {lesson.quiz.map((q, idx) => {
                    const picked = selectedAnswers[q.id];
                    return (
                      <div key={q.id} className="bp-quiz-card">
                        <p className="bp-q-title">
                          <ClipboardCheck size={15} /> Câu {idx + 1}: {q.question}
                        </p>
                        <div className="bp-q-opts">
                          {q.options.map((opt, oi) => {
                            let cls = 'bp-opt';
                            if (picked !== undefined) {
                              if (oi === q.correctIndex) cls += ' correct';
                              else if (oi === picked) cls += ' wrong';
                            }
                            return (
                              <button
                                key={oi}
                                type="button"
                                className={cls}
                                onClick={() =>
                                  setSelectedAnswers((p) => ({ ...p, [q.id]: oi }))
                                }
                              >
                                <strong>{String.fromCharCode(65 + oi)}.</strong> {opt}
                              </button>
                            );
                          })}
                        </div>
                        {picked !== undefined && (
                          <p className="bp-q-exp">{q.explanation}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {tab === 'tasks' && appMode === 'SANDBOX' && (
            <div className="bp-section">
              <p className="bp-lead">
                Chào mừng tới <strong>Phòng Thí Nghiệm Tự Do (Sandbox)</strong>! Bạn có toàn quyền đi lại trong phòng, mở Tủ Hóa Chất lấy bất kỳ dung dịch/kim loại nào và thử nghiệm cả những phản ứng nguy hiểm bị cấm làm ở trường.
              </p>
              <div className="hazard-guide-grid">
                <div className="hazard-demo-card">
                  <h4>
                    <Flame size={15} /> Thử nghiệm Sai Quy Tắc 1: Nổ Kim Loại Kiềm
                  </h4>
                  <p>
                    Ra Tủ Hóa Chất lấy <strong>Na (Kim loại kiềm)</strong>. Đổ nước vào cốc rồi thả mẩu lớn <strong>+0.65 g Na</strong> → Nổ tung cốc & bốc cháy bàn thí nghiệm!
                  </p>
                </div>
                <div className="hazard-demo-card">
                  <h4>
                    <Flame size={15} /> Thử nghiệm Sai Quy Tắc 2: Đổ Nước Vào Axit Đặc
                  </h4>
                  <p>
                    Lấy <strong>H₂SO₄ ĐẶC 98%</strong> rót vào cốc trống trước (+15 ml), sau đó lấy <strong>H₂O</strong> đổ thẳng vào → Sôi nổ bắn axit & gây hỏa hoạn!
                  </p>
                </div>
                <div className="hazard-demo-card">
                  <h4>
                    <Flame size={15} /> Thử nghiệm Sai Quy Tắc 3: Nổ Khí Hiđro Trên Đèn Cồn
                  </h4>
                  <p>
                    Cho <strong>HCl + Lá Nhôm (Al)</strong> vào <strong>Bình Nhiệt C</strong> cho sủi bọt khí H₂ mạnh, rồi bật <strong>Đèn Cồn</strong> ngay bên dưới → Kích nổ khí H₂!
                  </p>
                </div>
                <div className="hazard-demo-card">
                  <h4>🚒 Cách Cứu Hỏa Khi Phòng Lab Cháy (25 Giây!)</h4>
                  <p>
                    Khi còi báo cháy hú vang, hãy chạy nhanh sang <strong>Bức Tường Bên Phải</strong>, giật lấy <strong>Bình Chữa Cháy CO₂ [Phím F]</strong>, quay lại gần bàn và giữ nút <strong>XỊT CO₂</strong>!
                  </p>
                </div>
              </div>
            </div>
          )}

          {tab === 'inventory' && (
            <div className="bp-section">
              <p className="bp-lead">
                Các lọ hóa chất và thiết bị bạn đang mang theo trên người (tối đa 6 ô trên thanh công cụ dưới đáy màn hình):
              </p>
              <div className="bp-inventory-grid">
                {hotbar.map((slot, idx) => {
                  if (!slot) {
                    return (
                      <div key={idx} className="bp-inv-card empty">
                        <span className="slot-idx">Ô #{idx + 1}</span>
                        <p>Đang trống — Đi tới Tủ Hóa Chất để lấy thêm</p>
                      </div>
                    );
                  }
                  if (slot.type === 'extinguisher') {
                    return (
                      <div key={idx} className="bp-inv-card ext">
                        <span className="slot-idx">Ô #{idx + 1}</span>
                        <strong>🚒 Bình Chữa Cháy CO₂</strong>
                        <p>Dùng để phun tuyết lạnh CO₂ dập tắt đám cháy hóa chất.</p>
                        <button
                          type="button"
                          className="remove-slot-btn"
                          onClick={() => onRemoveHotbarSlot(idx)}
                        >
                          <Trash2 size={13} /> Cất lại lên giá tường
                        </button>
                      </div>
                    );
                  }
                  const chem = SHELF_CHEMICALS.find((c) => c.formula === slot.formula);
                  return (
                    <div key={idx} className="bp-inv-card">
                      <span className="slot-idx">Ô #{idx + 1}</span>
                      <strong>{chem?.displayFormula || slot.formula}</strong>
                      <p>{chem?.nameVi}</p>
                      <button
                        type="button"
                        className="remove-slot-btn"
                        onClick={() => onRemoveHotbarSlot(idx)}
                      >
                        <Trash2 size={13} /> Cất bớt khỏi Balo
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'journal' && (
            <div className="bp-section">
              {logs.length === 0 ? (
                <p className="bp-lead">Chưa có ghi chép hiện tượng nào trong phiên này.</p>
              ) : (
                <div className="bp-log-list">
                  {logs.map((entry) => (
                    <div key={entry.id} className={`bp-log-row ${entry.type}`}>
                      <div className="bp-log-top">
                        <span className="mono">{entry.timestamp}</span> •{' '}
                        <strong>{entry.vesselName}</strong>
                      </div>
                      <div className="bp-log-eq mono">{entry.equation}</div>
                      <div className="bp-log-desc">{entry.phenomenon}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
