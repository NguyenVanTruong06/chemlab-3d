import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  FlaskConical,
  HelpCircle,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import type { GuidedLesson } from '../types/chemistry';

interface CurriculumPanelProps {
  lessons: GuidedLesson[];
  activeLessonId: string;
  completedSteps: Record<string, boolean>;
  onSelectLesson: (lessonId: string) => void;
  onResetLabForLesson: () => void;
  onQuickSelectReagent: (formula: string) => void;
}

type LessonTab = 'theory' | 'practice' | 'quiz';

export function CurriculumPanel({
  lessons,
  activeLessonId,
  completedSteps,
  onSelectLesson,
  onResetLabForLesson,
  onQuickSelectReagent,
}: CurriculumPanelProps) {
  const lesson = lessons.find((l) => l.id === activeLessonId) || lessons[0];
  const [activeTab, setActiveTab] = useState<LessonTab>('practice');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const celebratedRef = useRef<boolean>(false);

  const doneCount = lesson.steps.filter((s) => completedSteps[s.id]).length;
  const allStepsDone = doneCount === lesson.steps.length && lesson.steps.length > 0;

  useEffect(() => {
    if (allStepsDone && !celebratedRef.current) {
      celebratedRef.current = true;
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.65 },
      });
    } else if (!allStepsDone) {
      celebratedRef.current = false;
    }
  }, [allStepsDone]);

  const handleRestartLesson = () => {
    setSelectedAnswers({});
    celebratedRef.current = false;
    onResetLabForLesson();
  };

  return (
    <aside className="curriculum-panel" aria-label="Lộ trình bài học THCS">
      <div className="panel-section-header">
        <div>
          <span className="grade-tag">{lesson.grade} • KHTN Hóa học</span>
          <h2 className="panel-title">Lộ Trình Học & Thực Hành</h2>
        </div>
        <button
          id="btn-restart-lesson"
          type="button"
          className="icon-action-btn"
          onClick={handleRestartLesson}
          title="Làm mới bàn thí nghiệm & bắt đầu lại bài học"
        >
          <RotateCcw size={15} />
          <span>Làm lại</span>
        </button>
      </div>

      <div className="lesson-selector-wrap">
        <label htmlFor="select-guided-lesson" className="field-label">
          Chọn chuyên đề thực hành:
        </label>
        <select
          id="select-guided-lesson"
          className="lesson-select"
          value={lesson.id}
          onChange={(e) => onSelectLesson(e.target.value)}
        >
          {lessons.map((item) => (
            <option key={item.id} value={item.id}>
              [{item.grade}] {item.title}
            </option>
          ))}
        </select>
      </div>

      <div className="lesson-tabs" role="tablist">
        <button
          id="tab-lesson-theory"
          type="button"
          role="tab"
          aria-selected={activeTab === 'theory'}
          className={`lesson-tab-btn ${activeTab === 'theory' ? 'active' : ''}`}
          onClick={() => setActiveTab('theory')}
        >
          <BookOpen size={15} />
          <span>1. Lý thuyết</span>
        </button>
        <button
          id="tab-lesson-practice"
          type="button"
          role="tab"
          aria-selected={activeTab === 'practice'}
          className={`lesson-tab-btn ${activeTab === 'practice' ? 'active' : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          <FlaskConical size={15} />
          <span>
            2. Thực hành ({doneCount}/{lesson.steps.length})
          </span>
        </button>
        <button
          id="tab-lesson-quiz"
          type="button"
          role="tab"
          aria-selected={activeTab === 'quiz'}
          className={`lesson-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          <ClipboardCheck size={15} />
          <span>3. Kiểm tra</span>
        </button>
      </div>

      <div className="lesson-body-scroll">
        {activeTab === 'theory' && (
          <div className="theory-content">
            <p className="lesson-summary-text">{lesson.summary}</p>
            <div className="theory-list">
              {lesson.theoryPoints.map((pt, idx) => (
                <div key={idx} className="theory-point-item">
                  <span className="theory-bullet">{idx + 1}</span>
                  <p>{pt}</p>
                </div>
              ))}
            </div>
            <div className="safety-callout">
              <ShieldAlert size={18} />
              <div>
                <strong>Lưu ý an toàn phòng Lab:</strong>
                <p>{lesson.safetyWarning}</p>
              </div>
            </div>
            <button
              id="btn-go-practice"
              type="button"
              className="primary-cta-btn"
              onClick={() => setActiveTab('practice')}
            >
              Bước vào Thực hành ngay →
            </button>
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="practice-content">
            <div className="reagent-shortcuts">
              <span className="shortcut-caption">Hóa chất cần dùng (Bấm để lấy nhanh):</span>
              <div className="shortcut-chips">
                {lesson.recommendedReagents.map((formula) => (
                  <button
                    key={formula}
                    type="button"
                    className="reagent-chip-btn"
                    onClick={() => onQuickSelectReagent(formula)}
                  >
                    {formula}
                  </button>
                ))}
              </div>
            </div>

            <div className="steps-checklist">
              {lesson.steps.map((st, idx) => {
                const isDone = !!completedSteps[st.id];
                return (
                  <div
                    key={st.id}
                    className={`step-card ${isDone ? 'completed' : ''}`}
                  >
                    <div className="step-status-icon">
                      {isDone ? (
                        <CheckCircle2 size={20} className="icon-done" />
                      ) : (
                        <Circle size={20} className="icon-pending" />
                      )}
                    </div>
                    <div className="step-info">
                      <div className="step-title-row">
                        <span className="step-num">Bước {idx + 1}</span>
                        {isDone && <span className="done-label">Đã hoàn thành</span>}
                      </div>
                      <p className="step-instruction">{st.instruction}</p>
                      <p className="step-hint">
                        <HelpCircle size={13} /> {st.hint}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {allStepsDone && (
              <div className="completion-banner">
                <strong>🎉 Xuất sắc! Bạn đã hoàn thành trọn vẹn thí nghiệm!</strong>
                <p>Hãy chuyển sang phần Kiểm tra để củng cố bản chất hóa học vừa quan sát.</p>
                <button
                  id="btn-go-quiz"
                  type="button"
                  className="primary-cta-btn"
                  onClick={() => setActiveTab('quiz')}
                >
                  Làm bài Kiểm tra nhanh →
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="quiz-content">
            {lesson.quiz.map((q, qIdx) => {
              const picked = selectedAnswers[q.id];
              const hasAnswered = picked !== undefined;
              const isCorrect = picked === q.correctIndex;
              return (
                <div key={q.id} className="quiz-card">
                  <p className="quiz-question">
                    <strong>Câu {qIdx + 1}:</strong> {q.question}
                  </p>
                  <div className="quiz-options">
                    {q.options.map((opt, optIdx) => {
                      let stateClass = '';
                      if (hasAnswered) {
                        if (optIdx === q.correctIndex) stateClass = 'correct';
                        else if (optIdx === picked) stateClass = 'wrong';
                      }
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          className={`quiz-opt-btn ${stateClass}`}
                          onClick={() =>
                            setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                          }
                        >
                          <span className="opt-letter">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                  {hasAnswered && (
                    <div className={`quiz-feedback ${isCorrect ? 'ok' : 'err'}`}>
                      <strong>{isCorrect ? 'Chính xác!' : 'Chưa đúng — Xem giải thích:'}</strong>{' '}
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
