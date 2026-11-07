import { useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Flame,
  Lock,
  Play,
  Sparkles,
  Star,
  Trophy,
  UserCheck,
} from 'lucide-react';
import { SHELF_CHEMICALS } from '../engine/ChemistryEngine';
import {
  BADGE_CATALOG,
  computeLevelInfo,
  computeTotalStars,
  DAILY_QUESTS,
  isLessonUnlocked,
  PEER_LEADERBOARD_SEED,
} from '../engine/LearnerStore';
import type { GuidedLesson, LearnerProfile } from '../types/chemistry';

interface OuterHubScreenProps {
  profile: LearnerProfile;
  lessons: GuidedLesson[];
  onUpdateProfileMeta: (
    displayName: string,
    schoolOrClass: string,
    avatarEmoji: string
  ) => void;
  onSelectGrade: (grade: 'Lớp 8' | 'Lớp 9') => void;
  onStartLessonStage: (lessonId: string) => void;
  onEnterSandboxLab: () => void;
}

const AVATAR_OPTIONS = ['🧑‍🔬', '👩‍🔬', '🧬', '⚗️', '🚀', '🦉'];

export function OuterHubScreen({
  profile,
  lessons,
  onUpdateProfileMeta,
  onSelectGrade,
  onStartLessonStage,
  onEnterSandboxLab,
}: OuterHubScreenProps) {
  const [editingProfile, setEditingProfile] = useState(false);
  const [draftName, setDraftName] = useState(profile.displayName);
  const [draftSchool, setDraftSchool] = useState(profile.schoolOrClass);
  const [draftAvatar, setDraftAvatar] = useState(profile.avatarEmoji);
  const [sideTab, setSideTab] = useState<'quests' | 'codex' | 'leaderboard'>('quests');

  const levelInfo = computeLevelInfo(profile.xp);
  const totalStars = computeTotalStars(profile);
  const maxPossibleStars = lessons.length * 3;

  const gradeLessons = lessons
    .filter((l) => l.grade === profile.gradePreference)
    .sort((a, b) => a.orderInGrade - b.orderInGrade);

  const leaderboardList = [
    ...PEER_LEADERBOARD_SEED,
    {
      id: profile.studentId,
      displayName: `${profile.displayName} (Bạn)`,
      schoolOrClass: profile.schoolOrClass,
      avatarEmoji: profile.avatarEmoji,
      xp: profile.xp,
      streakDays: profile.streakDays,
      totalStars,
      isCurrentUser: true,
    },
  ].sort((a, b) => b.xp - a.xp);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfileMeta(
      draftName.trim() || 'Nhà Hóa Học Trẻ',
      draftSchool.trim() || 'THCS Khoa Học Tự Nhiên',
      draftAvatar
    );
    setEditingProfile(false);
  };

  return (
    <div className="outer-hub-shell">
      {/* Top Bar: Brand + Learner Account / Streak / XP / Sandbox Quick Entry */}
      <header className="hub-topbar">
        <div className="hub-brand">
          <div className="hub-logo-badge" aria-hidden="true">
            ⚗️
          </div>
          <div>
            <h1>ChemLab 3D • Học Tập & Thực Hành KHTN</h1>
            <p>Chương trình GDPT 2018 (Danh pháp Quốc tế IUPAC + Tiếng Việt)</p>
          </div>
        </div>

        <div className="hub-stats-bar">
          <div className="stat-pill streak" title="Chuỗi ngày học liên tiếp">
            <Flame size={17} />
            <span>
              <strong>{profile.streakDays}</strong> ngày Streak
            </span>
          </div>

          <div className="stat-pill stars" title="Tổng số Sao an toàn & kiến thức đạt được">
            <Star size={17} />
            <span>
              <strong>
                {totalStars}/{maxPossibleStars}
              </strong>{' '}
              Sao
            </span>
          </div>

          <div className="stat-pill xp" title={levelInfo.title}>
            <Trophy size={16} />
            <span>
              Cấp {levelInfo.level} • <strong>{profile.xp} XP</strong>
            </span>
          </div>

          <button
            id="btn-hub-edit-profile"
            type="button"
            className="hub-profile-chip"
            onClick={() => {
              setDraftName(profile.displayName);
              setDraftSchool(profile.schoolOrClass);
              setDraftAvatar(profile.avatarEmoji);
              setEditingProfile(true);
            }}
          >
            <span className="avatar-emj">{profile.avatarEmoji}</span>
            <div className="profile-chip-text">
              <strong>{profile.displayName}</strong>
              <small>{profile.schoolOrClass}</small>
            </div>
          </button>
        </div>
      </header>

      {/* Main Two-Column Hub Layout */}
      <main className="hub-main-grid">
        {/* Left / Center Column: Grade Selector + Sequential Stage Map + Unlimited Sandbox Card */}
        <section className="hub-roadmap-column" aria-label="Bản đồ lộ trình học tập">
          {/* Hero Banner: Unlimited 3D Sandbox Lab vs Guided Curriculum */}
          <div className="hub-sandbox-banner">
            <div className="sandbox-banner-info">
              <span className="sandbox-kicker">PHÒNG THÍ NGHIỆM MỞ • KHÔNG GIỚI HẠN</span>
              <h2>Phòng Thí Nghiệm Tự Do 3D (Sandbox Lab)</h2>
              <p>
                Tự do đi lại trong phòng Lab 3D, mở Tủ Hóa Chất lấy đủ 14 dung dịch/kim loại, thử nghiệm các phản ứng nguy hiểm (nổ Natri, đổ nước vào H₂SO₄ đặc) và thực hành dập lửa bằng Bình CO₂ mà không bị trừ Sao bài học!
              </p>
            </div>
            <button
              id="btn-enter-sandbox-3d"
              type="button"
              className="enter-sandbox-cta"
              onClick={onEnterSandboxLab}
            >
              <Sparkles size={18} />
              <span>Vào Phòng Lab Tự Do 3D</span>
            </button>
          </div>

          {/* Grade Track Switcher (Lớp 8 vs Lớp 9 Independent Tracks) */}
          <div className="hub-grade-header">
            <div>
              <h2>Lộ Trình Chặng Học Theo Khối Lớp</h2>
              <p>
                Hoàn thành từng Chặng (1. Lý thuyết → 2. Phòng Lab 3D → 3. Kiểm tra) để mở khóa Chặng kế tiếp trong khối.
              </p>
            </div>

            <div className="grade-tabs" role="tablist">
              {(['Lớp 8', 'Lớp 9'] as const).map((g) => (
                <button
                  key={g}
                  id={`tab-grade-${g === 'Lớp 8' ? '8' : '9'}`}
                  type="button"
                  role="tab"
                  aria-selected={profile.gradePreference === g}
                  className={`grade-tab-btn ${profile.gradePreference === g ? 'active' : ''}`}
                  onClick={() => onSelectGrade(g)}
                >
                  <BookOpen size={16} />
                  <span>Chương trình KHTN {g}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sequential Stage Nodes */}
          <div className="stage-nodes-list">
            {gradeLessons.map((lesson) => {
              const unlocked = isLessonUnlocked(lesson, lessons, profile.lessonProgress);
              const rec = profile.lessonProgress[lesson.id];
              const stars = rec?.bestStars || 0;

              return (
                <article
                  key={lesson.id}
                  className={`stage-node-card ${unlocked ? 'unlocked' : 'locked'} ${
                    rec?.completed ? 'completed' : ''
                  }`}
                >
                  <div className="stage-number-badge">
                    {rec?.completed ? (
                      <CheckCircle2 size={24} className="done-icon" />
                    ) : unlocked ? (
                      <span className="stage-num">{lesson.orderInGrade}</span>
                    ) : (
                      <Lock size={20} />
                    )}
                  </div>

                  <div className="stage-node-body">
                    <div className="stage-meta-top">
                      <span className="stage-chapter-tag">{lesson.chapterTitle}</span>
                      <span className="stage-xp-tag mono">+{lesson.xpReward} XP</span>
                    </div>

                    <h3>{lesson.title}</h3>
                    <p className="stage-summary">{lesson.summary}</p>

                    <div className="stage-reagent-chips">
                      {lesson.recommendedReagents.map((formula) => {
                        const chem = SHELF_CHEMICALS.find((c) => c.formula === formula);
                        return (
                          <span key={formula} className="reagent-mini-chip">
                            <strong>{chem?.displayFormula || formula}</strong>
                            {chem ? ` • ${chem.iupacName} (${chem.nameVi})` : ''}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="stage-node-right">
                    <div className="stage-stars-row" aria-label={`Đạt ${stars} trên 3 sao`}>
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          size={18}
                          className={s <= stars ? 'star-filled' : 'star-empty'}
                        />
                      ))}
                    </div>

                    {rec?.completed && (
                      <span className="stage-best-score">
                        Điểm Quiz cao nhất: <strong>{rec.bestQuizScorePct}%</strong>
                      </span>
                    )}

                    <button
                      id={`btn-start-lesson-${lesson.id}`}
                      type="button"
                      disabled={!unlocked}
                      className={`stage-start-btn ${rec?.completed ? 'replay' : ''}`}
                      onClick={() => onStartLessonStage(lesson.id)}
                    >
                      {unlocked ? (
                        <>
                          <Play size={15} />
                          <span>{rec?.completed ? 'Học lại nâng Sao' : 'Bắt đầu Chặng'}</span>
                        </>
                      ) : (
                        <>
                          <Lock size={15} />
                          <span>Hoàn thành Chặng {lesson.orderInGrade - 1} trước</span>
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Right Column: Level Progress, Daily Quests, Badges & Chemical Codex, Leaderboard */}
        <aside className="hub-side-panel" aria-label="Bảng thành tích và nhiệm vụ">
          {/* Learner Level Progress Card */}
          <div className="level-progress-card">
            <div className="level-card-header">
              <div>
                <span className="level-kicker">DANH HIỆU KHOA HỌC HIỆN TẠI</span>
                <h3>
                  Cấp {levelInfo.level} — {levelInfo.title}
                </h3>
              </div>
              <span className="mono level-xp-fraction">
                {levelInfo.currentLevelXp}/{levelInfo.nextLevelXp} XP
              </span>
            </div>
            <div className="level-bar-track">
              <div
                className="level-bar-fill"
                style={{ width: `${levelInfo.progressPct}%` }}
              />
            </div>
          </div>

          {/* Side Navigation Tabs */}
          <div className="hub-side-tabs">
            <button
              type="button"
              className={sideTab === 'quests' ? 'active' : ''}
              onClick={() => setSideTab('quests')}
            >
              🔥 Nhiệm vụ & Huy hiệu
            </button>
            <button
              type="button"
              className={sideTab === 'codex' ? 'active' : ''}
              onClick={() => setSideTab('codex')}
            >
              🧪 Sổ tay IUPAC ({profile.unlockedReagents.length}/{SHELF_CHEMICALS.length})
            </button>
            <button
              type="button"
              className={sideTab === 'leaderboard' ? 'active' : ''}
              onClick={() => setSideTab('leaderboard')}
            >
              🏆 Bảng xếp hạng
            </button>
          </div>

          {/* Tab 1: Daily Quests + Badges */}
          {sideTab === 'quests' && (
            <div className="side-tab-content">
              <div className="side-block">
                <h4>Nhiệm Vụ Hàng Ngày (Tự động cộng XP)</h4>
                <div className="quest-list">
                  {DAILY_QUESTS.map((dq) => {
                    const current = Math.min(
                      dq.targetCount,
                      profile.dailyQuestProgress[dq.id] || 0
                    );
                    const done = !!profile.dailyQuestClaimed[dq.id] || current >= dq.targetCount;
                    return (
                      <div key={dq.id} className={`quest-item ${done ? 'done' : ''}`}>
                        <div className="quest-top">
                          <span>{dq.title}</span>
                          <strong className="mono">+{dq.xpReward} XP</strong>
                        </div>
                        <div className="quest-progress-row">
                          <div className="quest-bar">
                            <div
                              className="quest-bar-fill"
                              style={{ width: `${(current / dq.targetCount) * 100}%` }}
                            />
                          </div>
                          <span className="mono">
                            {current}/{dq.targetCount}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="side-block">
                <h4>
                  Bộ Sưu Tập Huy Hiệu ({profile.unlockedBadges.length}/{BADGE_CATALOG.length})
                </h4>
                <div className="badge-grid">
                  {BADGE_CATALOG.map((b) => {
                    const earned = profile.unlockedBadges.includes(b.id);
                    return (
                      <div
                        key={b.id}
                        className={`badge-card ${earned ? 'earned' : 'locked'}`}
                      >
                        <span className="badge-emj">{b.iconEmoji}</span>
                        <div>
                          <div className="badge-title-row">
                            <strong>{b.title}</strong>
                            <span className="mono">+{b.xpBonus} XP</span>
                          </div>
                          <p>{b.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Bilingual IUPAC + Vietnamese Chemical Codex */}
          {sideTab === 'codex' && (
            <div className="side-tab-content">
              <p className="side-hint">
                Mỗi khi bạn lấy hóa chất từ Tủ 3D hoặc hoàn thành bài học, hóa chất đó sẽ được mở khóa vào Sổ tay song ngữ Quốc tế (IUPAC) – Tiếng Việt:
              </p>
              <div className="codex-list">
                {SHELF_CHEMICALS.map((chem) => {
                  const unlocked = profile.unlockedReagents.includes(chem.formula);
                  return (
                    <div
                      key={chem.id}
                      className={`codex-item ${unlocked ? 'unlocked' : 'locked'}`}
                    >
                      <span
                        className="codex-swatch"
                        style={{ backgroundColor: chem.colorHex }}
                      />
                      <div className="codex-info">
                        <div className="codex-top">
                          <strong className="mono">{chem.displayFormula}</strong>
                          <span className="codex-cat">{chem.category}</span>
                        </div>
                        <div className="codex-names">
                          <span className="iupac">{chem.iupacName}</span> •{' '}
                          <span>{chem.nameVi}</span>
                        </div>
                      </div>
                      {unlocked ? (
                        <Award size={16} className="codex-ok" />
                      ) : (
                        <Lock size={15} className="codex-lock" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Leaderboard */}
          {sideTab === 'leaderboard' && (
            <div className="side-tab-content">
              <p className="side-hint">
                Bảng xếp hạng Học sinh tích cực theo tổng điểm kinh nghiệm (XP) và Chuỗi ngày học:
              </p>
              <div className="leaderboard-list">
                {leaderboardList.map((row, idx) => (
                  <div
                    key={row.id}
                    className={`lb-row ${row.isCurrentUser ? 'me' : ''}`}
                  >
                    <span className="lb-rank mono">#{idx + 1}</span>
                    <span className="lb-avatar">{row.avatarEmoji}</span>
                    <div className="lb-user">
                      <strong>{row.displayName}</strong>
                      <small>{row.schoolOrClass}</small>
                    </div>
                    <div className="lb-metrics mono">
                      <span className="lb-xp">{row.xp} XP</span>
                      <small>
                        🔥 {row.streakDays}d • ⭐ {row.totalStars}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </main>

      {/* Quick Learner Profile Modal (Browser Profile + Cloud Sync Ready) */}
      {editingProfile && (
        <div className="modal-backdrop" onClick={() => setEditingProfile(false)}>
          <div
            className="profile-modal-card"
            role="dialog"
            aria-label="Hồ sơ học sinh"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="profile-modal-header">
              <UserCheck size={20} className="accent-icon" />
              <div>
                <h3>Hồ Sơ Học Sinh (Lưu Tự Động Trên Trình Duyệt)</h3>
                <span>Mã định danh đồng bộ Cloud: {profile.studentId}</span>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="profile-form">
              <label className="pf-label">
                Chọn biểu tượng đại diện:
                <div className="avatar-picker-row">
                  {AVATAR_OPTIONS.map((emj) => (
                    <button
                      key={emj}
                      type="button"
                      className={`avatar-pick-btn ${draftAvatar === emj ? 'selected' : ''}`}
                      onClick={() => setDraftAvatar(emj)}
                    >
                      {emj}
                    </button>
                  ))}
                </div>
              </label>

              <label className="pf-label">
                Họ và tên học sinh:
                <input
                  type="text"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="Nhập tên của bạn..."
                  maxLength={40}
                />
              </label>

              <label className="pf-label">
                Lớp / Trường THCS:
                <input
                  type="text"
                  value={draftSchool}
                  onChange={(e) => setDraftSchool(e.target.value)}
                  placeholder="VD: Lớp 9A1 • THCS Chu Văn An"
                  maxLength={60}
                />
              </label>

              <div className="pf-actions">
                <button
                  type="button"
                  className="bp-secondary-btn"
                  onClick={() => setEditingProfile(false)}
                >
                  Đóng
                </button>
                <button type="submit" className="done-cabinet-btn">
                  Lưu Hồ Sơ Học Tập
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
