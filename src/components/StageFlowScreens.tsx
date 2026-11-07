import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FlaskConical,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { SHELF_CHEMICALS } from '../engine/ChemistryEngine';
import type { BadgeDef, GuidedLesson, ReactionLogEntry } from '../types/chemistry';

interface StageFlowScreensProps {
  mode: 'THEORY_STAGE' | 'QUIZ_RESULT_STAGE';
  lesson: GuidedLesson;
  hadSafetyIncidentInLab: boolean;
  labLogs: ReactionLogEntry[];
  onBackToHub: () => void;
  onProceedTo3DLab: () => void;
  onRetry3DLab: () => void;
  onSubmitQuizAndFinish: (correctCount: number) => {
    earnedStars: 1 | 2 | 3;
    quizScorePct: number;
    xpDelta: number;
    newlyUnlockedBadges: BadgeDef[];
  };
}

export function StageFlowScreens({
  mode,
  lesson,
  hadSafetyIncidentInLab,
  labLogs,
  onBackToHub,
  onProceedTo3DLab,
  onRetry3DLab,
  onSubmitQuizAndFinish,
}: StageFlowScreensProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedResult, setSubmittedResult] = useState<{
    earnedStars: 1 | 2 | 3;
    quizScorePct: number;
    xpDelta: number;
    newlyUnlockedBadges: BadgeDef[];
  } | null>(null);

  const allAnswered = lesson.quiz.every((q) => selectedAnswers[q.id] !== undefined);

  const handleGradeQuiz = () => {
    let correct = 0;
    for (const q of lesson.quiz) {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct += 1;
      }
    }
    const res = onSubmitQuizAndFinish(correct);
    setSubmittedResult(res);
  };

  if (mode === 'THEORY_STAGE') {
    return (
      <div className="stage-flow-shell">
        <header className="stage-flow-topbar">
          <button
            id="btn-theory-back-hub"
            type="button"
            className="stage-back-btn"
            onClick={onBackToHub}
          >
            <ArrowLeft size={16} />
            <span>Quay về Sảnh Lộ Trình</span>
          </button>

          <div className="stage-stepper" aria-label="Tiến trình 3 bước của Chặng">
            <span className="step-pill active">1. Lý thuyết & An toàn</span>
            <span className="step-arrow">→</span>
            <span className="step-pill">2. Thực hành Phòng Lab 3D</span>
            <span className="step-arrow">→</span>
            <span className="step-pill">3. Kiểm tra & Chấm Sao</span>
          </div>

          <span className="stage-grade-pill">{lesson.grade}</span>
        </header>

        <main className="stage-flow-card">
          <div className="theory-hero">
            <span className="theory-chapter">{lesson.chapterTitle}</span>
            <h1>{lesson.title}</h1>
            <p>{lesson.summary}</p>
          </div>

          {/* Key Chemical Equations */}
          <section className="theory-block">
            <h2>
              <BookOpen size={18} /> Phương Trình Hóa Học Trọng Tâm
            </h2>
            <div className="equation-cards-row">
              {lesson.keyEquations.map((eq, idx) => (
                <div key={idx} className="equation-banner mono">
                  {eq}
                </div>
              ))}
            </div>
          </section>

          {/* Core Theory Bullet Points */}
          <section className="theory-block">
            <h2>Kiến Thức Cốt Lõi (GDPT 2018 • IUPAC + Tiếng Việt)</h2>
            <div className="theory-points-grid">
              {lesson.theoryPoints.map((pt, idx) => (
                <div key={idx} className="theory-point-item">
                  <span className="tp-index">0{idx + 1}</span>
                  <p>{pt}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Bilingual Chemical Cards Needed for This Lab */}
          <section className="theory-block">
            <h2>
              <FlaskConical size={18} /> Hóa Chất Cần Lấy Tại Tủ Hóa Chất 3D [Phím F]
            </h2>
            <div className="theory-reagents-grid">
              {lesson.recommendedReagents.map((formula) => {
                const chem = SHELF_CHEMICALS.find((c) => c.formula === formula);
                if (!chem) return null;
                return (
                  <div key={formula} className="theory-reagent-card">
                    <div className="tr-head">
                      <span
                        className="tr-swatch"
                        style={{ backgroundColor: chem.colorHex }}
                      />
                      <strong className="mono">{chem.displayFormula}</strong>
                      <span className="tr-cat">{chem.category}</span>
                    </div>
                    <div className="tr-bilingual">
                      <span className="iupac">{chem.iupacName}</span> •{' '}
                      <span>{chem.nameVi}</span>
                    </div>
                    <p>{chem.safetyNote}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Lab Steps Preview & Safety Rule */}
          <section className="theory-block">
            <h2>Nhiệm Vụ Bạn Sẽ Thực Hiện Trong Phòng Lab 3D</h2>
            <ol className="theory-task-preview">
              {lesson.steps.map((st, idx) => (
                <li key={st.id}>
                  <strong>Bước {idx + 1}:</strong> {st.instruction}
                </li>
              ))}
            </ol>

            <div className="theory-safety-callout">
              <ShieldAlert size={22} />
              <div>
                <strong>Quy tắc An toàn Phòng Thí nghiệm (Tính vào điểm 3 Sao):</strong>
                <p>{lesson.safetyWarning}</p>
              </div>
            </div>
          </section>

          <footer className="stage-flow-footer">
            <button type="button" className="bp-secondary-btn" onClick={onBackToHub}>
              Để sau
            </button>
            <button
              id="btn-enter-lab-from-theory"
              type="button"
              className="enter-lab-primary-cta"
              onClick={onProceedTo3DLab}
            >
              <span>Đã nắm vững Lý thuyết — Bước vào Phòng Lab 3D</span>
              <ArrowRight size={18} />
            </button>
          </footer>
        </main>
      </div>
    );
  }

  // ======================== CHẶNG 3: KIỂM TRA & TỔNG KẾT ĐIỂM / SAO ========================
  return (
    <div className="stage-flow-shell">
      <header className="stage-flow-topbar">
        <button
          id="btn-quiz-back-hub"
          type="button"
          className="stage-back-btn"
          onClick={onBackToHub}
        >
          <ArrowLeft size={16} />
          <span>Quay về Sảnh Lộ Trình</span>
        </button>

        <div className="stage-stepper" aria-label="Tiến trình 3 bước của Chặng">
          <span className="step-pill done">✓ 1. Lý thuyết</span>
          <span className="step-arrow">→</span>
          <span className="step-pill done">✓ 2. Đã xong Thực hành 3D</span>
          <span className="step-arrow">→</span>
          <span className="step-pill active">3. Kiểm tra & Chấm Sao</span>
        </div>

        <span className="stage-grade-pill">{lesson.grade}</span>
      </header>

      <main className="stage-flow-card">
        <div className="theory-hero">
          <span className="theory-chapter">HOÀN TẤT THỰC HÀNH • KIỂM TRA ĐÁNH GIÁ</span>
          <h1>{lesson.title}</h1>
          <p>
            Trả lời {lesson.quiz.length} câu hỏi gắn liền với hiện tượng bạn vừa tự tay thực hiện trong Phòng Lab 3D để nhận Sao và điểm XP!
          </p>
        </div>

        {/* Lab Safety Report Summary */}
        <div
          className={`lab-safety-audit-banner ${
            hadSafetyIncidentInLab ? 'incident' : 'clean'
          }`}
        >
          {hadSafetyIncidentInLab ? (
            <>
              <ShieldAlert size={22} />
              <div>
                <strong>Ghi nhận Sự cố An toàn trong ca thực hành vừa rồi:</strong>
                <p>
                  Bạn đã để xảy ra nổ/cháy bàn thí nghiệm trong lượt thực hành này (tối đa đạt 2 Sao). Bạn có thể thực hành lại không để xảy ra sự cố để lấy trọn vẹn 3 Sao!
                </p>
              </div>
            </>
          ) : (
            <>
              <ShieldCheck size={22} />
              <div>
                <strong>Thao tác An toàn Tuyệt đối (0 Sự cố Cháy Nổ):</strong>
                <p>
                  Bạn đã hoàn thành đầy đủ các bước thực hành đúng quy trình an toàn! Trả lời đúng 100% câu hỏi bên dưới để nhận tuyệt đối 3 Sao ⭐.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Quiz Questions */}
        <section className="theory-block">
          <h2>
            <ClipboardCheck size={18} /> Câu Hỏi Kiểm Tra Hiểu Biết Thực Hành
          </h2>
          <div className="stage-quiz-list">
            {lesson.quiz.map((q, idx) => {
              const picked = selectedAnswers[q.id];
              return (
                <div key={q.id} className="stage-quiz-card">
                  <p className="sq-question">
                    <strong>Câu {idx + 1}:</strong> {q.question}
                  </p>
                  <div className="sq-options">
                    {q.options.map((opt, oi) => {
                      let cls = 'sq-opt-btn';
                      if (submittedResult) {
                        if (oi === q.correctIndex) cls += ' correct';
                        else if (oi === picked) cls += ' wrong';
                      } else if (oi === picked) {
                        cls += ' selected';
                      }
                      return (
                        <button
                          key={oi}
                          id={`quiz-${q.id}-opt-${oi}`}
                          type="button"
                          disabled={!!submittedResult}
                          className={cls}
                          onClick={() =>
                            setSelectedAnswers((prev) => ({ ...prev, [q.id]: oi }))
                          }
                        >
                          <span className="sq-letter">
                            {String.fromCharCode(65 + oi)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                  {submittedResult && (
                    <div className="sq-explanation">
                      <CheckCircle2 size={15} />
                      <span>{q.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Lab Reaction Log Recap */}
        {labLogs.length > 0 && (
          <section className="theory-block">
            <h2>Nhật Ký Hiện Tượng Vừa Ghi Nhận Từ Phòng Lab 3D</h2>
            <div className="recap-log-strip">
              {labLogs.slice(0, 4).map((entry) => (
                <div key={entry.id} className="recap-log-item">
                  <span className="mono">{entry.timestamp}</span> •{' '}
                  <strong>{entry.vesselName}</strong>:{' '}
                  <span className="mono">{entry.equation}</span> — {entry.phenomenon}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Final Score & Stars Summary Card after Submitting Quiz */}
        {submittedResult && (
          <section className="quiz-final-reward-card" role="status">
            <div className="reward-stars-row">
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  size={34}
                  className={
                    s <= submittedResult.earnedStars ? 'star-filled big' : 'star-empty big'
                  }
                />
              ))}
            </div>

            <h3>
              Chúc mừng hoàn thành Chặng {lesson.orderInGrade} ({lesson.grade})!
            </h3>
            <p>
              Điểm Kiểm tra: <strong>{submittedResult.quizScorePct}%</strong> • Điểm thưởng nhận thêm:{' '}
              <strong className="mono">+{submittedResult.xpDelta} XP</strong>
            </p>

            {submittedResult.newlyUnlockedBadges.length > 0 && (
              <div className="new-badges-callout">
                <Award size={18} />
                <span>
                  Mở khóa Huy hiệu mới:{' '}
                  {submittedResult.newlyUnlockedBadges
                    .map((b) => `${b.iconEmoji} ${b.title}`)
                    .join(', ')}
                </span>
              </div>
            )}
          </section>
        )}

        <footer className="stage-flow-footer">
          <button
            type="button"
            className="bp-secondary-btn"
            onClick={onRetry3DLab}
          >
            <RotateCcw size={15} />
            <span>Thực hành lại trong Phòng Lab 3D</span>
          </button>

          {!submittedResult ? (
            <button
              id="btn-submit-stage-quiz"
              type="button"
              disabled={!allAnswered}
              className="enter-lab-primary-cta"
              onClick={handleGradeQuiz}
            >
              <span>Nộp Bài Kiểm Tra & Nhận Sao</span>
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              id="btn-finish-return-hub"
              type="button"
              className="enter-lab-primary-cta"
              onClick={onBackToHub}
            >
              <span>Hoàn tất & Về Sảnh Lộ Trình Mở Chặng Mới</span>
              <ArrowRight size={18} />
            </button>
          )}
        </footer>
      </main>
    </div>
  );
}
