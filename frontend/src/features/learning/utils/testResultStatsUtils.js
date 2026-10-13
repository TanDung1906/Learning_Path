import {
  SKILL_TO_TYPE_ID,
  TEST_SKILL_LISTENING,
  TEST_SKILL_READING,
  TEST_SKILL_VOCABULARY,
} from '@/features/mentor/utils/mentorTestContentUtils';
import { getSectionQuestionGroups } from '@/features/learning/utils/courseTestPaperUtils';
import { formatChapterLabel, formatChapterCourseNumber } from '@/features/learning/utils/testSectionContextUtils';

const SKILL_DISPLAY_ORDER = [
  TEST_SKILL_LISTENING,
  TEST_SKILL_READING,
  TEST_SKILL_VOCABULARY,
];

function findQuestionResult(questionResults = [], question = {}) {
  const questionId = String(question?.tempId ?? question?.QuestionId ?? '');
  return questionResults.find((item) => String(item.questionId) === questionId) ?? null;
}

function countQuestionStats(questions = [], questionResults = []) {
  let correctCount = 0;
  let wrongCount = 0;

  questions.forEach((question) => {
    const result = findQuestionResult(questionResults, question);
    if (result?.isCorrect) {
      correctCount += 1;
    } else {
      wrongCount += 1;
    }
  });

  return {
    correctCount,
    wrongCount,
    totalCount: questions.length,
  };
}

function resolveSectionId(group = {}, index = 0) {
  return String(group.sectionId ?? group.groupId ?? `section_${index}`);
}

export function buildTestResultStats(paper, questionResults = []) {
  const skillSections = paper?.sections ?? [];

  const skills = skillSections.map((skillSection) => {
    const skillType = skillSection.skillType;
    const typeId = SKILL_TO_TYPE_ID[skillType] ?? null;
    const groups = getSectionQuestionGroups(skillSection);

    const sections = groups.map((group, index) => {
      const questions = group.questions ?? [];
      const counts = countQuestionStats(questions, questionResults);

      return {
        sectionId: resolveSectionId(group, index),
        displayName: group.displayName ?? `Section ${index + 1}`,
        pathId: group.pathId ?? null,
        pathOrder: group.pathOrder ?? null,
        pathName: group.pathName ?? null,
        chapterLabel: formatChapterLabel(group),
        chapterCourseNumber: formatChapterCourseNumber(group),
        ...counts,
      };
    });

    const correctCount = sections.reduce((sum, section) => sum + section.correctCount, 0);
    const wrongCount = sections.reduce((sum, section) => sum + section.wrongCount, 0);

    return {
      skillType,
      typeId,
      sectionCount: sections.length,
      sections,
      correctCount,
      wrongCount,
      totalCount: correctCount + wrongCount,
    };
  });

  return {
    skillCount: skills.length,
    skills,
    correctCount: skills.reduce((sum, skill) => sum + skill.correctCount, 0),
    wrongCount: skills.reduce((sum, skill) => sum + skill.wrongCount, 0),
    totalCount: skills.reduce((sum, skill) => sum + skill.totalCount, 0),
  };
}

function mapPersistedSectionRow(row = {}) {
  const pathId = row.pathId ?? row.PathId ?? null;
  const pathOrder = row.pathOrder ?? row.PathOrder ?? null;
  const pathName = row.pathName ?? row.PathName ?? null;
  const chapterMeta = { pathId, pathOrder, pathName };

  return {
    sectionId: String(row.sectionId ?? row.SectionId ?? ''),
    displayName: row.sectionTitle ?? row.SectionTitle ?? `Section ${row.sectionId ?? ''}`,
    pathId,
    pathOrder: pathOrder != null ? Number(pathOrder) : null,
    pathName,
    chapterLabel: formatChapterLabel(chapterMeta),
    chapterCourseNumber: formatChapterCourseNumber(chapterMeta),
    correctCount: Number(row.correctCount ?? row.CorrectCount ?? 0),
    wrongCount: Number(row.wrongCount ?? row.WrongCount ?? 0),
    totalCount: Number(row.totalCount ?? row.TotalCount ?? 0),
  };
}

export function buildTestResultStatsFromSectionRows(sectionRows = []) {
  const bySkill = new Map();

  sectionRows.forEach((row) => {
    const skillType = String(row.skillType ?? row.SkillType ?? '').trim().toUpperCase();
    if (!skillType) return;
    if (!bySkill.has(skillType)) {
      bySkill.set(skillType, []);
    }
    bySkill.get(skillType).push(mapPersistedSectionRow(row));
  });

  const skills = SKILL_DISPLAY_ORDER
    .filter((skillType) => bySkill.has(skillType))
    .map((skillType) => {
      const sections = bySkill.get(skillType) ?? [];
      const correctCount = sections.reduce((sum, section) => sum + section.correctCount, 0);
      const wrongCount = sections.reduce((sum, section) => sum + section.wrongCount, 0);

      return {
        skillType,
        typeId: SKILL_TO_TYPE_ID[skillType] ?? null,
        sectionCount: sections.length,
        sections,
        correctCount,
        wrongCount,
        totalCount: correctCount + wrongCount,
      };
    });

  return {
    skillCount: skills.length,
    skills,
    correctCount: skills.reduce((sum, skill) => sum + skill.correctCount, 0),
    wrongCount: skills.reduce((sum, skill) => sum + skill.wrongCount, 0),
    totalCount: skills.reduce((sum, skill) => sum + skill.totalCount, 0),
  };
}
