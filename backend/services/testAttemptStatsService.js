const { mapSkillTypeToTypeId } = require('../utils/sectionSkillType');

function normalizeQuestionId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function buildQuestionResultMap(questionResults = []) {
  const map = new Map();
  questionResults.forEach((item) => {
    const questionId = normalizeQuestionId(item?.questionId);
    if (questionId) {
      map.set(questionId, item);
    }
  });
  return map;
}

function countSectionQuestionStats(questionIds = [], questionResultMap = new Map()) {
  let correctCount = 0;
  let wrongCount = 0;

  questionIds.forEach((rawId) => {
    const questionId = normalizeQuestionId(rawId);
    if (!questionId) return;

    const result = questionResultMap.get(questionId);
    if (result?.isCorrect) {
      correctCount += 1;
    } else {
      wrongCount += 1;
    }
  });

  return {
    correctCount,
    wrongCount,
    totalCount: questionIds.length,
  };
}

function normalizePaperSectionEntry(entry = {}) {
  const skillType = String(entry.skillType ?? '').trim().toUpperCase();
  const sectionId = normalizeQuestionId(entry.sectionId);
  if (!skillType || !sectionId) return null;

  const questionIds = (entry.questionIds ?? [])
    .map((id) => normalizeQuestionId(id))
    .filter(Boolean);

  return {
    skillType,
    typeId: Number(entry.typeId) || mapSkillTypeToTypeId(skillType),
    sectionId,
    sectionTitle: String(entry.title ?? entry.sectionTitle ?? '').trim() || null,
    questionIds,
  };
}

function buildAttemptSectionStats(paperSections = [], questionResults = []) {
  const questionResultMap = buildQuestionResultMap(questionResults);
  const rows = [];

  paperSections.forEach((entry) => {
    const normalized = normalizePaperSectionEntry(entry);
    if (!normalized) return;

    const counts = countSectionQuestionStats(normalized.questionIds, questionResultMap);
    rows.push({
      typeId: normalized.typeId,
      skillType: normalized.skillType,
      sectionId: normalized.sectionId,
      sectionTitle: normalized.sectionTitle,
      ...counts,
    });
  });

  const skillsMap = new Map();
  rows.forEach((row) => {
    if (!skillsMap.has(row.skillType)) {
      skillsMap.set(row.skillType, {
        skillType: row.skillType,
        typeId: row.typeId,
        sectionCount: 0,
        sections: [],
        correctCount: 0,
        wrongCount: 0,
        totalCount: 0,
      });
    }

    const skill = skillsMap.get(row.skillType);
    skill.sectionCount += 1;
    skill.sections.push({
      sectionId: String(row.sectionId),
      displayName: row.sectionTitle ?? `Section ${row.sectionId}`,
      correctCount: row.correctCount,
      wrongCount: row.wrongCount,
      totalCount: row.totalCount,
    });
    skill.correctCount += row.correctCount;
    skill.wrongCount += row.wrongCount;
    skill.totalCount += row.totalCount;
  });

  const skills = Array.from(skillsMap.values());

  return {
    skillCount: skills.length,
    skills,
    rows,
    correctCount: skills.reduce((sum, skill) => sum + skill.correctCount, 0),
    wrongCount: skills.reduce((sum, skill) => sum + skill.wrongCount, 0),
    totalCount: skills.reduce((sum, skill) => sum + skill.totalCount, 0),
  };
}

function groupRowsIntoStats(rows = []) {
  const skillsMap = new Map();

  rows.forEach((row) => {
    const skillType = String(row.SkillType ?? row.skillType ?? '').trim().toUpperCase();
    if (!skillType) return;

    if (!skillsMap.has(skillType)) {
      skillsMap.set(skillType, {
        skillType,
        typeId: Number(row.TypeId ?? row.typeId) || mapSkillTypeToTypeId(skillType),
        sectionCount: 0,
        sections: [],
        correctCount: 0,
        wrongCount: 0,
        totalCount: 0,
      });
    }

    const skill = skillsMap.get(skillType);
    const section = {
      sectionId: String(row.SectionId ?? row.sectionId),
      displayName: row.SectionTitle ?? row.sectionTitle ?? `Section ${row.SectionId ?? row.sectionId}`,
      correctCount: Number(row.CorrectCount ?? row.correctCount ?? 0),
      wrongCount: Number(row.WrongCount ?? row.wrongCount ?? 0),
      totalCount: Number(row.TotalCount ?? row.totalCount ?? 0),
    };

    skill.sectionCount += 1;
    skill.sections.push(section);
    skill.correctCount += section.correctCount;
    skill.wrongCount += section.wrongCount;
    skill.totalCount += section.totalCount;
  });

  const skills = Array.from(skillsMap.values());
  return {
    skillCount: skills.length,
    skills,
    correctCount: skills.reduce((sum, skill) => sum + skill.correctCount, 0),
    wrongCount: skills.reduce((sum, skill) => sum + skill.wrongCount, 0),
    totalCount: skills.reduce((sum, skill) => sum + skill.totalCount, 0),
  };
}

module.exports = {
  buildAttemptSectionStats,
  groupRowsIntoStats,
};
