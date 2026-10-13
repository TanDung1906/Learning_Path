/**
 * Expand question bank course 1: pad existing sections to 10 questions,
 * add 2 new sections per skill per chapter (10 questions each).
 * Run: node backend/scripts/seed-question-bank-course1-expand.js
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const SQL_SERVER = process.env.DB_SERVER || 'HungHoang23\\SQLEXPRESS';
const DB_NAME = process.env.DB_NAME || 'LearningPath_Base';
const COURSE_ID = 1;

function esc(value) {
  return String(value ?? '').replace(/'/g, "''");
}

function makeMcq(text, options, correctIndex) {
  return { text, options, correctIndex };
}

function buildPaddingQuestions(skill, theme, startOrder, count) {
  const items = [];
  for (let i = 0; i < count; i += 1) {
    const n = startOrder + i;
    if (skill === 'LISTENING') {
      items.push(makeMcq(
        `[${theme}] Listening extra Q${n}: What is the main point?`,
        ['The schedule was confirmed', 'They cancelled everything', 'Nobody attended', 'The topic was sports'],
        0,
      ));
    } else if (skill === 'READING') {
      items.push(makeMcq(
        `[${theme}] Reading extra Q${n}: According to the passage, what should you do?`,
        ['Follow the written instructions', 'Ignore the deadline', 'Skip the meeting', 'Delete the document'],
        0,
      ));
    } else {
      items.push(makeMcq(
        `[${theme}] Vocabulary/Grammar extra Q${n}: Choose the best answer.`,
        ['Correct business expression', 'Wrong collocation', 'Informal slang only', 'Unrelated phrase'],
        0,
      ));
    }
  }
  return items;
}

const CHAPTERS = [
  {
    pathId: 1,
    theme: 'Email & Meetings',
    newSections: [
      { typeId: 1, name: 'Nghe - Lịch họp tuần', title: 'Nghe - Lịch họp tuần' },
      { typeId: 1, name: 'Nghe - Xác nhận địa điểm', title: 'Nghe - Xác nhận địa điểm' },
      { typeId: 2, name: 'Đọc - Nội quy phòng họp', title: 'Đọc - Nội quy phòng họp' },
      { typeId: 2, name: 'Đọc - Thông báo thay đổi lịch', title: 'Đọc - Thông báo thay đổi lịch' },
      { typeId: 3, name: 'Từ vựng - Họp trực tuyến', title: 'Từ vựng - Họp trực tuyến' },
      { typeId: 3, name: 'Ngữ pháp - Email trang trọng', title: 'Ngữ pháp - Email trang trọng' },
    ],
  },
  {
    pathId: 2,
    theme: 'Presentations',
    newSections: [
      { typeId: 1, name: 'Nghe - Giới thiệu diễn giả', title: 'Nghe - Giới thiệu diễn giả' },
      { typeId: 1, name: 'Nghe - Tóm tắt kết luận', title: 'Nghe - Tóm tắt kết luận' },
      { typeId: 2, name: 'Đọc - Hướng dẫn thuyết trình', title: 'Đọc - Hướng dẫn thuyết trình' },
      { typeId: 2, name: 'Đọc - Mẫu slide báo cáo', title: 'Đọc - Mẫu slide báo cáo' },
      { typeId: 3, name: 'Từ vựng - Visual aids', title: 'Từ vựng - Visual aids' },
      { typeId: 3, name: 'Ngữ pháp - Thì trong thuyết trình', title: 'Ngữ pháp - Thì trong thuyết trình' },
    ],
  },
  {
    pathId: 12,
    theme: 'Business Communication',
    newSections: [
      { typeId: 1, name: 'Nghe - Chăm sóc khách hàng', title: 'Nghe - Chăm sóc khách hàng' },
      { typeId: 1, name: 'Nghe - Xử lý khiếu nại', title: 'Nghe - Xử lý khiếu nại' },
      { typeId: 2, name: 'Đọc - Chính sách bảo mật', title: 'Đọc - Chính sách bảo mật' },
      { typeId: 2, name: 'Đọc - Báo giá dịch vụ', title: 'Đọc - Báo giá dịch vụ' },
      { typeId: 3, name: 'Từ vựng - Hợp đồng thương mại', title: 'Từ vựng - Hợp đồng thương mại' },
      { typeId: 3, name: 'Ngữ pháp - Điều kiện trong hợp đồng', title: 'Ngữ pháp - Điều kiện trong hợp đồng' },
    ],
  },
];

// Existing sections to pad (SectionId, skill, theme, currentCount)
const EXISTING_PAD = [
  { sectionId: 23, skill: 'LISTENING', theme: 'Email & Meetings', current: 5 },
  { sectionId: 24, skill: 'LISTENING', theme: 'Email & Meetings', current: 5 },
  { sectionId: 25, skill: 'READING', theme: 'Email & Meetings', current: 5 },
  { sectionId: 26, skill: 'READING', theme: 'Email & Meetings', current: 5 },
  { sectionId: 27, skill: 'VOCABULARY', theme: 'Email & Meetings', current: 6 },
  { sectionId: 28, skill: 'VOCABULARY', theme: 'Email & Meetings', current: 6 },
  { sectionId: 29, skill: 'LISTENING', theme: 'Presentations', current: 5 },
  { sectionId: 30, skill: 'LISTENING', theme: 'Presentations', current: 5 },
  { sectionId: 31, skill: 'READING', theme: 'Presentations', current: 5 },
  { sectionId: 32, skill: 'READING', theme: 'Presentations', current: 5 },
  { sectionId: 33, skill: 'VOCABULARY', theme: 'Presentations', current: 6 },
  { sectionId: 34, skill: 'VOCABULARY', theme: 'Presentations', current: 6 },
  { sectionId: 35, skill: 'LISTENING', theme: 'Business Communication', current: 5 },
  { sectionId: 36, skill: 'LISTENING', theme: 'Business Communication', current: 5 },
  { sectionId: 37, skill: 'READING', theme: 'Business Communication', current: 5 },
  { sectionId: 38, skill: 'READING', theme: 'Business Communication', current: 5 },
  { sectionId: 39, skill: 'VOCABULARY', theme: 'Business Communication', current: 6 },
  { sectionId: 40, skill: 'VOCABULARY', theme: 'Business Communication', current: 6 },
];

const TARGET_PER_SECTION = 10;

function sqlInsertQuestion(sectionVar, order, item, tag) {
  const lines = [];
  const qVar = `@Q_${tag}_${order}`;
  lines.push(`DECLARE ${qVar} INT;`);
  lines.push(`INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])`);
  lines.push(`VALUES (${sectionVar}, N'${esc(item.text)}', 1, 1, ${order});`);
  lines.push(`SET ${qVar} = SCOPE_IDENTITY();`);
  item.options.forEach((opt, idx) => {
    const isTrue = idx === item.correctIndex ? 1 : 0;
    lines.push(`INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)`);
    lines.push(`VALUES (${qVar}, N'${esc(opt)}', ${idx + 1}, ${isTrue});`);
  });
  return lines;
}

function buildSql() {
  const lines = [];
  lines.push(`DECLARE @BankId INT = (SELECT TOP 1 BankId FROM dbo.Question_Bank WHERE CourseId = ${COURSE_ID});`);

  // Pad existing sections to 10 questions
  for (const entry of EXISTING_PAD) {
    const need = TARGET_PER_SECTION - entry.current;
    if (need <= 0) continue;
    const sectionVar = entry.sectionId;
    const questions = buildPaddingQuestions(entry.skill, entry.theme, entry.current + 1, need);
    questions.forEach((item, idx) => {
      lines.push(...sqlInsertQuestion(sectionVar, entry.current + 1 + idx, item, `pad${entry.sectionId}`));
    });
  }

  // New sections per chapter
  for (const chapter of CHAPTERS) {
    lines.push(`DECLARE @QP_${chapter.pathId} INT;`);
    lines.push(`SELECT @QP_${chapter.pathId} = qp.Question_Path_Id`);
    lines.push(`FROM dbo.Questions_Path qp WHERE qp.BankId = @BankId AND qp.PathId = ${chapter.pathId};`);

    let nextOrder = 7; // existing max order is 6
    chapter.newSections.forEach((section, sIdx) => {
      const sVar = `@S_${chapter.pathId}_${nextOrder}`;
      lines.push(`DECLARE ${sVar} INT;`);
      lines.push(`INSERT INTO dbo.Question_Sections (`);
      lines.push(`  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest`);
      lines.push(`) VALUES (`);
      lines.push(`  @QP_${chapter.pathId}, N'${esc(section.name)}', N'${esc(section.title)}', ${section.typeId}, ${nextOrder}, NULL, 1`);
      lines.push(`);`);
      lines.push(`SET ${sVar} = SCOPE_IDENTITY();`);

      const skill = section.typeId === 1 ? 'LISTENING' : section.typeId === 2 ? 'READING' : 'VOCABULARY';
      const questions = buildPaddingQuestions(skill, chapter.theme, 1, TARGET_PER_SECTION);
      questions.forEach((item, qIdx) => {
        lines.push(...sqlInsertQuestion(sVar, qIdx + 1, item, `new${chapter.pathId}_${nextOrder}`));
      });

      nextOrder += 1;
    });
  }

  return lines.join('\n');
}

function runSqlBatch(sqlText) {
  const tmpFile = path.join(os.tmpdir(), `seed-qb-expand-${Date.now()}.sql`);
  const script = `SET NOCOUNT ON;\nSET XACT_ABORT ON;\nSET QUOTED_IDENTIFIER ON;\nBEGIN TRANSACTION;\n${sqlText}\nCOMMIT TRANSACTION;\n`;
  fs.writeFileSync(tmpFile, `\uFEFF${script}`, 'utf8');
  try {
    execSync(`sqlcmd -S "${SQL_SERVER}" -E -d "${DB_NAME}" -i "${tmpFile}" -f 65001`, {
      stdio: 'inherit',
      encoding: 'utf8',
    });
  } finally {
    fs.unlinkSync(tmpFile);
  }
}

function printSummary() {
  const summaryFile = path.join(os.tmpdir(), `seed-qb-summary-${Date.now()}.sql`);
  const query = `SET NOCOUNT ON;
SELECT p.PathId, p.[Order] AS Ch, qs.TypeId,
  CASE qs.TypeId WHEN 1 THEN 'LISTENING' WHEN 2 THEN 'READING' ELSE 'VOCABULARY' END AS Skill,
  COUNT(DISTINCT qs.SectionId) AS Sections,
  COUNT(DISTINCT q.QuestionId) AS Questions
FROM dbo.Paths p
INNER JOIN dbo.Questions_Path qp ON qp.PathId = p.PathId
INNER JOIN dbo.Question_Bank qb ON qb.BankId = qp.BankId AND qb.CourseId = ${COURSE_ID}
INNER JOIN dbo.Question_Sections qs ON qs.Question_Path_Id = qp.Question_Path_Id
LEFT JOIN dbo.Questions q ON q.SectionId = qs.SectionId AND q.IsActive = 1
WHERE p.CourseId = ${COURSE_ID}
GROUP BY p.PathId, p.[Order], qs.TypeId
ORDER BY p.[Order], qs.TypeId;
SELECT COUNT(DISTINCT qs.SectionId) AS TotalSections,
  COUNT(DISTINCT q.QuestionId) AS TotalQuestions
FROM dbo.Question_Bank qb
INNER JOIN dbo.Questions_Path qp ON qp.BankId = qb.BankId
INNER JOIN dbo.Question_Sections qs ON qs.Question_Path_Id = qp.Question_Path_Id
INNER JOIN dbo.Questions q ON q.SectionId = qs.SectionId AND q.IsActive = 1
WHERE qb.CourseId = ${COURSE_ID};`;
  fs.writeFileSync(summaryFile, `\uFEFF${query}`, 'utf8');
  execSync(`sqlcmd -S "${SQL_SERVER}" -E -d "${DB_NAME}" -i "${summaryFile}" -f 65001`, { encoding: 'utf8' });
  fs.unlinkSync(summaryFile);
}

function main() {
  console.log('Expanding question bank for course 1...');
  const sqlText = buildSql();
  const outFile = path.join(__dirname, 'seed-question-bank-course1-expand.generated.sql');
  fs.writeFileSync(outFile, `\uFEFF${sqlText}`, 'utf8');
  runSqlBatch(sqlText);
  console.log('\nSummary:');
  printSummary();
  console.log(`\nSQL saved: ${outFile}`);
}

main();
