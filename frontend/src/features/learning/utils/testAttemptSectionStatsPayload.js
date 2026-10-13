import { SKILL_TO_TYPE_ID } from '@/features/mentor/utils/mentorTestContentUtils';
import { getSectionQuestionGroups } from '@/features/learning/utils/courseTestPaperUtils';

function normalizeQuestionId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function resolvePathId(group, skillSection, defaultPathId) {
  const candidates = [group?.pathId, skillSection?.pathId, defaultPathId];
  for (const candidate of candidates) {
    const parsed = Number(candidate);
    if (Number.isInteger(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return null;
}

function resolveSectionId(group, index = 0) {
  const raw = group?.sectionId ?? group?.groupId ?? `section_${index}`;
  const parsed = Number(String(raw).replace(/^section_/, ''));
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

/** Snapshot section/chương/câu hỏi gửi lên backend khi nộp bài. */
export function buildPaperSectionsPayload(paper, defaultPathId = null) {
  const rows = [];

  (paper?.sections ?? []).forEach((skillSection) => {
    const groups = getSectionQuestionGroups(skillSection);

    groups.forEach((group, index) => {
      const pathId = resolvePathId(group, skillSection, defaultPathId);
      const sectionId = resolveSectionId(group, index);
      if (!pathId || !sectionId) return;

      const questionIds = (group.questions ?? [])
        .map((question) => normalizeQuestionId(question.tempId ?? question.QuestionId))
        .filter((id) => id != null);

      rows.push({
        pathId,
        sectionId,
        skillType: skillSection.skillType,
        typeId: SKILL_TO_TYPE_ID[skillSection.skillType] ?? null,
        sectionTitle: group.displayName ?? skillSection.displayName ?? null,
        questionIds,
      });
    });
  });

  return rows;
}
