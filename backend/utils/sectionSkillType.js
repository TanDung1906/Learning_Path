/**
 * Chuẩn hóa kỹ năng section — khớp dbo.Section_Type.
 * DB hiện lưu Name tiếng Việt: Nghe / Đọc / Từ Vựng/ Ngữ pháp (TypeId 1/2/3).
 */

const TYPE_ID_TO_SKILL = {
  1: 'LISTENING',
  2: 'READING',
  3: 'VOCABULARY',
};

const SKILL_TO_TYPE_ID = {
  LISTENING: 1,
  READING: 2,
  VOCABULARY: 3,
  WRITING: 3,
};

const NAME_TO_SKILL = {
  LISTENING: 'LISTENING',
  READING: 'READING',
  VOCABULARY: 'VOCABULARY',
  WRITING: 'VOCABULARY',
  NGHE: 'LISTENING',
  // Vietnamese "Đọc" uppercases to "ĐỌC"
  'ĐỌC': 'READING',
  DOC: 'READING',
};

function normalizeSectionSkillType(rawName, typeId = null) {
  const parsedTypeId = Number(typeId);
  if (Number.isInteger(parsedTypeId) && TYPE_ID_TO_SKILL[parsedTypeId]) {
    return TYPE_ID_TO_SKILL[parsedTypeId];
  }

  const name = String(rawName ?? '').trim().toUpperCase();
  if (!name) return 'VOCABULARY';

  if (NAME_TO_SKILL[name]) return NAME_TO_SKILL[name];

  // "Từ Vựng/ Ngữ pháp" và biến thể
  if (
    name.includes('VỰNG')
    || name.includes('VOCAB')
    || name.includes('NGỮ PHÁP')
    || name.includes('NGU PHAP')
    || name.includes('WRITING')
  ) {
    return 'VOCABULARY';
  }

  if (name.includes('NGHE') || name.includes('LISTEN')) return 'LISTENING';
  if (name.includes('ĐỌC') || name.includes('DOC') || name.includes('READ')) return 'READING';

  return 'VOCABULARY';
}

function mapSkillTypeToTypeId(skillType) {
  const normalized = normalizeSectionSkillType(skillType);
  return SKILL_TO_TYPE_ID[normalized] ?? SKILL_TO_TYPE_ID.VOCABULARY;
}

/** SQL CASE — trả về mã kỹ năng chuẩn từ TypeId. */
const SQL_SKILL_TYPE_FROM_TYPE_ID = `
  CASE qs.TypeId
    WHEN 1 THEN 'LISTENING'
    WHEN 2 THEN 'READING'
    ELSE 'VOCABULARY'
  END
`.trim();

module.exports = {
  TYPE_ID_TO_SKILL,
  SKILL_TO_TYPE_ID,
  normalizeSectionSkillType,
  mapSkillTypeToTypeId,
  SQL_SKILL_TYPE_FROM_TYPE_ID,
};
