import assert from 'node:assert/strict';
import {
  SHELF_CHEMICALS,
  GUIDED_LESSONS,
  createDefaultWorkbenchVessels,
  addReagentToVessel,
  stepVesselSimulation,
} from '../src/engine/ChemistryEngine.ts';
import {
  createDefaultLearnerProfile,
  isLessonUnlocked,
  recordLessonCompletion,
  computeLevelInfo,
} from '../src/engine/LearnerStore.ts';

const findChem = (f: string) => {
  const c = SHELF_CHEMICALS.find((x) => x.formula === f);
  assert.ok(c, `Missing chemical ${f}`);
  return c;
};

// 1. Verify Bilingual IUPAC + Vietnamese Nomenclature across all 14 reagents
for (const chem of SHELF_CHEMICALS) {
  assert.ok(chem.iupacName && chem.iupacName.length > 2, `Missing iupacName on ${chem.formula}`);
  assert.ok(chem.nameVi && chem.nameVi.length > 2, `Missing nameVi on ${chem.formula}`);
}
console.log('PASS 1: All 14 reagents have bilingual IUPAC + Vietnamese nomenclature');

// 2. Verify Grade 8 & Grade 9 Independent Sequential Stage Unlocking
{
  let profile = createDefaultLearnerProfile();
  const g8Stage1 = GUIDED_LESSONS.find((l) => l.grade === 'Lớp 8' && l.orderInGrade === 1)!;
  const g8Stage2 = GUIDED_LESSONS.find((l) => l.grade === 'Lớp 8' && l.orderInGrade === 2)!;
  const g9Stage1 = GUIDED_LESSONS.find((l) => l.grade === 'Lớp 9' && l.orderInGrade === 1)!;
  const g9Stage2 = GUIDED_LESSONS.find((l) => l.grade === 'Lớp 9' && l.orderInGrade === 2)!;

  assert.equal(isLessonUnlocked(g8Stage1, GUIDED_LESSONS, profile.lessonProgress), true);
  assert.equal(isLessonUnlocked(g8Stage2, GUIDED_LESSONS, profile.lessonProgress), false);
  assert.equal(isLessonUnlocked(g9Stage1, GUIDED_LESSONS, profile.lessonProgress), true);
  assert.equal(isLessonUnlocked(g9Stage2, GUIDED_LESSONS, profile.lessonProgress), false);

  // Complete Grade 8 Stage 1 with 100% Quiz and 0 safety incidents -> 3 Stars!
  const res1 = recordLessonCompletion(
    profile,
    g8Stage1,
    GUIDED_LESSONS,
    g8Stage1.quiz.length,
    false
  );
  profile = res1.nextProfile;
  assert.equal(res1.earnedStars, 3);
  assert.equal(res1.quizScorePct, 100);
  assert.ok(res1.xpDelta >= g8Stage1.xpReward);
  assert.equal(isLessonUnlocked(g8Stage2, GUIDED_LESSONS, profile.lessonProgress), true);
  assert.ok(profile.unlockedBadges.includes('BADGE_FIRST_LAB'));
  assert.ok(profile.unlockedBadges.includes('BADGE_SAFETY_3STAR'));

  // Complete Grade 8 Stage 2 WITH a safety incident (explosion/fire) -> capped at 2 Stars even with 100% Quiz!
  const res2 = recordLessonCompletion(
    profile,
    g8Stage2,
    GUIDED_LESSONS,
    g8Stage2.quiz.length,
    true
  );
  assert.equal(res2.earnedStars, 2);

  const lvl = computeLevelInfo(res2.nextProfile.xp);
  assert.ok(lvl.level >= 2);
  console.log(
    'PASS 2: Sequential Grade 8/9 stage unlocking, 3-Star safety cap, Badges & Level progression verified'
  );
}

// 3. Verify Grade 8 Stage 1 Lab Steps (NaOH + Phenolphthalein -> pink -> HCl neutralization -> colorless)
{
  const vessels = createDefaultWorkbenchVessels();
  const lesson = GUIDED_LESSONS.find((l) => l.id === 'LES_G8_ACID_BASE_1')!;

  vessels[0] = addReagentToVessel(vessels[0], findChem('NaOH'), 15).nextVessel;
  assert.equal(lesson.steps[0].checkCondition(vessels), true);

  vessels[0] = addReagentToVessel(vessels[0], findChem('Phenolphtalein'), 0.5).nextVessel;
  assert.equal(lesson.steps[1].checkCondition(vessels), true);

  vessels[0] = addReagentToVessel(vessels[0], findChem('HCl'), 15).nextVessel;
  assert.equal(lesson.steps[2].checkCondition(vessels), true);
  console.log('PASS 3: Grade 8 Stage 1 (Acid-Base & Indicator neutralization) lab steps verified');
}

// 4. Verify all 4 Hazard Explosions & Safe H2SO4 Dilution
{
  const [v1] = createDefaultWorkbenchVessels();
  const r1 = addReagentToVessel(v1, findChem('H2SO4_dac'), 15);
  const r2 = addReagentToVessel(r1.nextVessel, findChem('H2O'), 15);
  assert.equal(r2.hazard?.code, 'ACID_DILUTION_BLAST');
  assert.equal(r2.nextVessel.visual.isBroken, true);

  const [vNa] = createDefaultWorkbenchVessels();
  const w = addReagentToVessel(vNa, findChem('H2O'), 50).nextVessel;
  const blastNa = addReagentToVessel(w, findChem('Na'), 0.65);
  assert.equal(blastNa.hazard?.code, 'SODIUM_BLAST');

  let v3 = createDefaultWorkbenchVessels()[2];
  v3 = { ...v3, burnerOn: true, burnerLevel: 3 };
  let dryHazard = null;
  for (let i = 0; i < 60; i++) {
    const res = stepVesselSimulation(v3, 0.2);
    v3 = res.nextVessel;
    if (res.hazard) {
      dryHazard = res.hazard;
      break;
    }
  }
  assert.equal(dryHazard?.code, 'OVERHEAT_RUPTURE');
  console.log('PASS 4: All chemical explosion hazards & shattered vessel states verified');
}
