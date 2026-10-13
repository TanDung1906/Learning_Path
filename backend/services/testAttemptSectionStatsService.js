const { mapSkillTypeToTypeId } = require('../utils/sectionSkillType');

function normalizeQuestionId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function buildSectionStatsRows(paperSections = [], questionResults = []) {
  const resultMap = new Map(
    (questionResults ?? []).map((item) => [Number(item.questionId), item]),
  );

  return (paperSections ?? [])
    .map((entry) => {
      const pathId = Number(entry.pathId);
      const sectionId = Number(entry.sectionId);
      const skillType = String(entry.skillType ?? '').trim().toUpperCase();
      const typeId = Number(entry.typeId) || mapSkillTypeToTypeId(skillType);
      const questionIds = (entry.questionIds ?? [])
        .map(normalizeQuestionId)
        .filter((id) => id != null);

      if (!Number.isInteger(pathId) || pathId <= 0) return null;
      if (!Number.isInteger(sectionId) || sectionId <= 0) return null;
      if (!skillType) return null;

      let correctCount = 0;
      let wrongCount = 0;

      questionIds.forEach((questionId) => {
        const result = resultMap.get(questionId);
        if (result?.isCorrect) {
          correctCount += 1;
        } else {
          wrongCount += 1;
        }
      });

      return {
        pathId,
        typeId,
        skillType,
        sectionId,
        sectionTitle: entry.sectionTitle ?? entry.title ?? null,
        correctCount,
        wrongCount,
        totalCount: questionIds.length,
      };
    })
    .filter(Boolean);
}

function groupRowsByChapterSkill(rows = []) {
  const chapterMap = new Map();

  rows.forEach((row) => {
    const key = `${row.pathId}:${row.typeId}`;
    if (!chapterMap.has(key)) {
      chapterMap.set(key, {
        pathId: row.pathId,
        typeId: row.typeId,
        skillType: row.skillType,
        correctCount: 0,
        wrongCount: 0,
        totalCount: 0,
        sections: [],
      });
    }

    const chapterSkill = chapterMap.get(key);
    chapterSkill.correctCount += row.correctCount;
    chapterSkill.wrongCount += row.wrongCount;
    chapterSkill.totalCount += row.totalCount;
    chapterSkill.sections.push({
      sectionId: row.sectionId,
      sectionTitle: row.sectionTitle,
      correctCount: row.correctCount,
      wrongCount: row.wrongCount,
      totalCount: row.totalCount,
    });
  });

  return Array.from(chapterMap.values());
}

function buildAttemptSectionStatsSummary(rows = []) {
  const listeningReadingChapters = groupRowsByChapterSkill(
    rows.filter((row) => row.typeId === 1 || row.typeId === 2),
  );
  const vocabularySections = rows
    .filter((row) => row.typeId === 3)
    .map((row) => ({
      pathId: row.pathId,
      sectionId: row.sectionId,
      sectionTitle: row.sectionTitle,
      correctCount: row.correctCount,
      wrongCount: row.wrongCount,
      totalCount: row.totalCount,
    }));

  return {
    sectionRows: rows,
    listeningReadingByChapter: listeningReadingChapters,
    vocabularyBySection: vocabularySections,
    skillCount: new Set(rows.map((row) => row.typeId)).size,
    chapterCount: new Set(rows.map((row) => row.pathId)).size,
    sectionCount: rows.length,
  };
}

module.exports = {
  buildSectionStatsRows,
  buildAttemptSectionStatsSummary,
  groupRowsByChapterSkill,
};
