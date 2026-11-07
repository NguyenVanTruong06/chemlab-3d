import type {
  BadgeDef,
  DailyQuestDef,
  GuidedLesson,
  LearnerProfile,
  LessonProgressRecord,
} from '../types/chemistry';

const STORAGE_KEY = 'chemlab3d_learner_profile_v1';

export const BADGE_CATALOG: BadgeDef[] = [
  {
    id: 'BADGE_FIRST_LAB',
    title: 'Tân Binh Phòng Lab',
    description: 'Hoàn thành bài thực hành Hóa học 3D đầu tiên trên lộ trình.',
    iconEmoji: '🥽',
    xpBonus: 50,
  },
  {
    id: 'BADGE_SAFETY_3STAR',
    title: 'Chuẩn Mực An Toàn 3 Sao',
    description: 'Đạt tuyệt đối 3 Sao (Làm đúng quy trình + 0 tai nạn + 100% Quiz).',
    iconEmoji: '🛡️',
    xpBonus: 80,
  },
  {
    id: 'BADGE_FIREFIGHTER',
    title: 'Chuyên Gia Cứu Hỏa CO₂',
    description: 'Dập tắt kịp thời một vụ cháy bàn thí nghiệm trong vòng 25 giây!',
    iconEmoji: '🚒',
    xpBonus: 90,
  },
  {
    id: 'BADGE_COLLECTOR_8',
    title: 'Nhà Sưu Tập Hóa Chất',
    description: 'Mở khóa và trực tiếp thao tác với từ 8 hóa chất trở lên trong Sổ tay.',
    iconEmoji: '🧪',
    xpBonus: 70,
  },
  {
    id: 'BADGE_GRADE_MASTER',
    title: 'Thủ Khoa Khối THCS',
    description: 'Hoàn thành trọn vẹn cả 3 Chặng của một Khối lớp (Lớp 8 hoặc Lớp 9).',
    iconEmoji: '👑',
    xpBonus: 150,
  },
];

export const DAILY_QUESTS: DailyQuestDef[] = [
  {
    id: 'DQ_COMPLETE_STAGE',
    title: 'Hoàn thành 1 Chặng bài học bất kỳ (Lý thuyết → Lab → Quiz)',
    targetCount: 1,
    xpReward: 60,
  },
  {
    id: 'DQ_UNLOCK_REAGENTS',
    title: 'Thao tác pha chế ít nhất 3 lượt hóa chất trong Phòng Lab 3D',
    targetCount: 3,
    xpReward: 45,
  },
  {
    id: 'DQ_PERFECT_STAR',
    title: 'Đạt 3 Sao tuyệt đối ở 1 bài học (Không để xảy ra nổ/cháy)',
    targetCount: 1,
    xpReward: 75,
  },
];

export interface LeaderboardEntry {
  id: string;
  displayName: string;
  schoolOrClass: string;
  avatarEmoji: string;
  xp: number;
  streakDays: number;
  totalStars: number;
  isCurrentUser?: boolean;
}

export const PEER_LEADERBOARD_SEED: LeaderboardEntry[] = [
  {
    id: 'peer-1',
    displayName: 'Trần Minh Anh',
    schoolOrClass: 'Lớp 9A1 • THCS Chu Văn An',
    avatarEmoji: '👩‍🔬',
    xp: 680,
    streakDays: 7,
    totalStars: 14,
  },
  {
    id: 'peer-2',
    displayName: 'Lê Hoàng Nam',
    schoolOrClass: 'Lớp 9A2 • THCS Nguyễn Du',
    avatarEmoji: '🧑‍🔬',
    xp: 520,
    streakDays: 5,
    totalStars: 11,
  },
  {
    id: 'peer-3',
    displayName: 'Phạm Bảo Ngọc',
    schoolOrClass: 'Lớp 8B1 • THCS Lê Quý Đôn',
    avatarEmoji: '🧬',
    xp: 390,
    streakDays: 4,
    totalStars: 9,
  },
  {
    id: 'peer-4',
    displayName: 'Vũ Đức Khang',
    schoolOrClass: 'Lớp 8A3 • THCS Trưng Vương',
    avatarEmoji: '⚗️',
    xp: 210,
    streakDays: 2,
    totalStars: 5,
  },
];

export function getTodayYmd(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getYesterdayYmd(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function createDefaultLearnerProfile(): LearnerProfile {
  return {
    version: 1,
    studentId: `local-${Math.random().toString(36).slice(2, 9)}`,
    displayName: 'Nhà Hóa Học Trẻ',
    gradePreference: 'Lớp 8',
    schoolOrClass: 'Lớp 8A • THCS Khoa Học Tự Nhiên',
    avatarEmoji: '🧑‍🔬',
    xp: 100,
    streakDays: 1,
    lastActiveDateYmd: getTodayYmd(),
    lessonProgress: {},
    unlockedReagents: ['H2O'],
    unlockedBadges: [],
    dailyQuestProgress: {
      DQ_COMPLETE_STAGE: 0,
      DQ_UNLOCK_REAGENTS: 0,
      DQ_PERFECT_STAR: 0,
    },
    dailyQuestClaimed: {},
    firesExtinguishedCount: 0,
    reactionsTriggeredCount: 0,
  };
}

export function syncDailyStreak(profile: LearnerProfile): LearnerProfile {
  const today = getTodayYmd();
  if (profile.lastActiveDateYmd === today) {
    return profile;
  }
  const yesterday = getYesterdayYmd();
  const nextStreak =
    profile.lastActiveDateYmd === yesterday ? profile.streakDays + 1 : 1;

  return {
    ...profile,
    streakDays: nextStreak,
    lastActiveDateYmd: today,
    dailyQuestProgress: {
      DQ_COMPLETE_STAGE: 0,
      DQ_UNLOCK_REAGENTS: 0,
      DQ_PERFECT_STAR: 0,
    },
    dailyQuestClaimed: {},
  };
}

export function loadLearnerProfile(): LearnerProfile {
  if (typeof window === 'undefined') return createDefaultLearnerProfile();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const fresh = createDefaultLearnerProfile();
      saveLearnerProfile(fresh);
      return fresh;
    }
    const parsed = JSON.parse(raw) as Partial<LearnerProfile>;
    const merged: LearnerProfile = {
      ...createDefaultLearnerProfile(),
      ...parsed,
      lessonProgress: parsed.lessonProgress || {},
      unlockedReagents: Array.isArray(parsed.unlockedReagents)
        ? parsed.unlockedReagents
        : ['H2O'],
      unlockedBadges: Array.isArray(parsed.unlockedBadges) ? parsed.unlockedBadges : [],
      dailyQuestProgress: {
        DQ_COMPLETE_STAGE: 0,
        DQ_UNLOCK_REAGENTS: 0,
        DQ_PERFECT_STAR: 0,
        ...(parsed.dailyQuestProgress || {}),
      },
      dailyQuestClaimed: parsed.dailyQuestClaimed || {},
    };
    const synced = syncDailyStreak(merged);
    saveLearnerProfile(synced);
    return synced;
  } catch {
    return createDefaultLearnerProfile();
  }
}

export function saveLearnerProfile(profile: LearnerProfile): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore storage quota errors in restricted environments
  }
}

export function computeLevelInfo(xp: number): {
  level: number;
  title: string;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPct: number;
} {
  const step = 200;
  const level = Math.max(1, Math.floor(xp / step) + 1);
  const currentLevelXp = xp % step;
  const progressPct = Math.min(100, Math.round((currentLevelXp / step) * 100));

  const titles = [
    'Thực Tập Sinh Phòng Lab',
    'Kỹ Thuật Viên Pha Chế',
    'Chuyên Viên Phân Tích Ion',
    'Kỹ Sư Hóa Thực Nghiệm',
    'Bậc Thầy Khoa Học Tự Nhiên',
  ];
  const title = titles[Math.min(titles.length - 1, level - 1)];

  return {
    level,
    title,
    currentLevelXp,
    nextLevelXp: step,
    progressPct,
  };
}

export function computeTotalStars(profile: LearnerProfile): number {
  return Object.values(profile.lessonProgress).reduce(
    (sum, rec) => sum + (rec.bestStars || 0),
    0
  );
}

/**
 * Sequential unlocking within each Grade (Lớp 8 or Lớp 9 independently):
 * - Stage 1 (orderInGrade === 1) is always unlocked.
 * - Stage N (orderInGrade > 1) unlocks when Stage N-1 of the same Grade has `completed === true`.
 */
export function isLessonUnlocked(
  lesson: GuidedLesson,
  allLessons: GuidedLesson[],
  progressMap: Record<string, LessonProgressRecord>
): boolean {
  if (lesson.orderInGrade <= 1) return true;
  const prevStage = allLessons.find(
    (l) => l.grade === lesson.grade && l.orderInGrade === lesson.orderInGrade - 1
  );
  if (!prevStage) return true;
  return !!progressMap[prevStage.id]?.completed;
}

/**
 * Evaluates and awards newly earned badges & auto-claims completed daily quests.
 */
export function evaluateBadgesAndQuests(
  profile: LearnerProfile,
  allLessons: GuidedLesson[]
): {
  nextProfile: LearnerProfile;
  newlyUnlockedBadges: BadgeDef[];
} {
  let xp = profile.xp;
  const unlockedBadges = new Set(profile.unlockedBadges);
  const newlyUnlockedBadges: BadgeDef[] = [];
  const claimedQuests = { ...profile.dailyQuestClaimed };

  // 1. Auto-claim completed daily quests
  for (const dq of DAILY_QUESTS) {
    const count = profile.dailyQuestProgress[dq.id] || 0;
    if (count >= dq.targetCount && !claimedQuests[dq.id]) {
      claimedQuests[dq.id] = true;
      xp += dq.xpReward;
    }
  }

  // 2. Check Badge conditions
  const completedLessons = Object.values(profile.lessonProgress).filter((r) => r.completed);
  const hasAny3Star = completedLessons.some((r) => r.bestStars === 3);

  const g8Lessons = allLessons.filter((l) => l.grade === 'Lớp 8');
  const g9Lessons = allLessons.filter((l) => l.grade === 'Lớp 9');
  const doneAllG8 =
    g8Lessons.length > 0 && g8Lessons.every((l) => !!profile.lessonProgress[l.id]?.completed);
  const doneAllG9 =
    g9Lessons.length > 0 && g9Lessons.every((l) => !!profile.lessonProgress[l.id]?.completed);

  const badgeChecks: Record<string, boolean> = {
    BADGE_FIRST_LAB: completedLessons.length >= 1,
    BADGE_SAFETY_3STAR: hasAny3Star,
    BADGE_FIREFIGHTER: profile.firesExtinguishedCount >= 1,
    BADGE_COLLECTOR_8: profile.unlockedReagents.length >= 8,
    BADGE_GRADE_MASTER: doneAllG8 || doneAllG9,
  };

  for (const badge of BADGE_CATALOG) {
    if (badgeChecks[badge.id] && !unlockedBadges.has(badge.id)) {
      unlockedBadges.add(badge.id);
      xp += badge.xpBonus;
      newlyUnlockedBadges.push(badge);
    }
  }

  return {
    nextProfile: {
      ...profile,
      xp,
      unlockedBadges: Array.from(unlockedBadges),
      dailyQuestClaimed: claimedQuests,
    },
    newlyUnlockedBadges,
  };
}

/**
 * Records completion of a 3-stage lesson (Theory -> 3D Lab -> Quiz), computing 1..3 Stars & XP.
 */
export function recordLessonCompletion(
  profile: LearnerProfile,
  lesson: GuidedLesson,
  allLessons: GuidedLesson[],
  quizCorrectCount: number,
  hadSafetyIncident: boolean
): {
  nextProfile: LearnerProfile;
  earnedStars: 1 | 2 | 3;
  quizScorePct: number;
  xpDelta: number;
  newlyUnlockedBadges: BadgeDef[];
} {
  const totalQ = Math.max(1, lesson.quiz.length);
  const quizScorePct = Math.round((quizCorrectCount / totalQ) * 100);

  let earnedStars: 1 | 2 | 3 = 1;
  if (quizScorePct === 100 && !hadSafetyIncident) {
    earnedStars = 3;
  } else if (quizScorePct >= 50) {
    earnedStars = 2;
  }

  const starMultiplier = earnedStars === 3 ? 1.0 : earnedStars === 2 ? 0.75 : 0.5;
  const rawEarnedXp = Math.round(lesson.xpReward * starMultiplier);

  const prevRec = profile.lessonProgress[lesson.id];
  const prevBestXp = prevRec?.bestXpEarned || 0;
  // Award improvement XP or a +25 XP practice replay bonus
  const xpGainFromLesson =
    rawEarnedXp > prevBestXp ? rawEarnedXp - prevBestXp : 25;

  const nextRec: LessonProgressRecord = {
    lessonId: lesson.id,
    completed: true,
    bestStars: Math.max(prevRec?.bestStars || 0, earnedStars) as 0 | 1 | 2 | 3,
    bestQuizScorePct: Math.max(prevRec?.bestQuizScorePct || 0, quizScorePct),
    bestXpEarned: Math.max(prevBestXp, rawEarnedXp),
    attempts: (prevRec?.attempts || 0) + 1,
    hadSafetyIncidentLastRun: hadSafetyIncident,
    completedAtIso: new Date().toISOString(),
  };

  const unlockedSet = new Set([
    ...profile.unlockedReagents,
    ...lesson.recommendedReagents,
  ]);

  const nextDailyProgress = {
    ...profile.dailyQuestProgress,
    DQ_COMPLETE_STAGE: (profile.dailyQuestProgress['DQ_COMPLETE_STAGE'] || 0) + 1,
    DQ_PERFECT_STAR:
      (profile.dailyQuestProgress['DQ_PERFECT_STAR'] || 0) + (earnedStars === 3 ? 1 : 0),
  };

  const baseUpdated: LearnerProfile = {
    ...profile,
    xp: profile.xp + xpGainFromLesson,
    lessonProgress: {
      ...profile.lessonProgress,
      [lesson.id]: nextRec,
    },
    unlockedReagents: Array.from(unlockedSet),
    dailyQuestProgress: nextDailyProgress,
  };

  const { nextProfile, newlyUnlockedBadges } = evaluateBadgesAndQuests(
    baseUpdated,
    allLessons
  );
  saveLearnerProfile(nextProfile);

  return {
    nextProfile,
    earnedStars,
    quizScorePct,
    xpDelta: nextProfile.xp - profile.xp,
    newlyUnlockedBadges,
  };
}
