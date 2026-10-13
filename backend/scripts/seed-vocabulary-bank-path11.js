/**
 * Seed ngân hàng câu hỏi Từ vựng / Ngữ pháp cho course 1, path 11.
 * Chạy: node backend/scripts/seed-vocabulary-bank-path11.js
 */
const API_BASE = (process.env.API_URL || 'http://localhost:5000').replace(/\/+$/, '');
const COURSE_ID = 1;
const PATH_ID = 11;
const USER_ID = 2;

function makeChoice(text, order, isTrue) {
  return {
    table: 'Question_Choices',
    clientRef: `choice-${order}-${Math.random().toString(36).slice(2, 7)}`,
    data: { Title: text, Order: order, IsTrue: isTrue },
  };
}

function makeQuestion(text, options, correctIndex, order) {
  return {
    table: 'Questions',
    clientRef: `question-${order}-${Math.random().toString(36).slice(2, 7)}`,
    Order: order,
    data: { Title: text, IsActive: true, IsUseForTest: true },
    choicesInsert: options.map((opt, index) => makeChoice(opt, index + 1, index === correctIndex)),
  };
}

function buildSectionPayload({ displayName, sectionTitle, questions }) {
  return {
    context: {
      courseId: COURSE_ID,
      pathId: PATH_ID,
      questionPathId: null,
      sectionOrder: 1,
      sectionId: null,
      skillType: 'VOCABULARY',
    },
    summary: {
      sectionInsert: 1,
      sectionUpdate: 0,
      sectionSourceUpdate: 0,
      questionsInsert: questions.length,
      questionsUpdate: 0,
      questionsDelete: 0,
      choicesInsert: 0,
      choicesUpdate: 0,
      choicesDelete: 0,
    },
    sectionInsert: {
      table: 'Question_Sections',
      data: {
        SectionName: displayName,
        Title: sectionTitle,
        SkillType: 'VOCABULARY',
        TypeId: 3,
        IsUseForTest: true,
        SourceUrl: null,
      },
      questions,
    },
    sectionUpdate: null,
    sectionSourceUpdate: null,
    questionsInsert: [],
    questionsUpdate: [],
    questionsDelete: [],
  };
}

const VOCABULARY_SECTION = buildSectionPayload({
  displayName: 'Từ vựng thương mại',
  sectionTitle: 'Từ vựng thương mại',
  questions: [
    makeQuestion(
      'What is the best meaning of "deadline" in a business context?',
      ['The final date to finish a task', 'A line drawn on the floor', 'A type of online meeting', 'A company holiday'],
      0,
      1,
    ),
    makeQuestion(
      'Choose the word closest in meaning to "postpone".',
      ['Delay', 'Confirm', 'Cancel permanently', 'Accelerate'],
      0,
      2,
    ),
    makeQuestion(
      'An "agenda" in a meeting is ___.',
      ['A list of topics to discuss', 'A summary of last month sales', 'A room booking code', 'An employee ID card'],
      0,
      3,
    ),
    makeQuestion(
      'Which word means "to discuss terms before reaching an agreement"?',
      ['Negotiate', 'Navigate', 'Nominate', 'Notify'],
      0,
      4,
    ),
    makeQuestion(
      '"Invoice" refers to ___.',
      ['A bill requesting payment for goods or services', 'A personal diary', 'A job interview', 'A training certificate'],
      0,
      5,
    ),
  ],
});

const GRAMMAR_SECTION = buildSectionPayload({
  displayName: 'Ngữ pháp giao tiếp công sở',
  sectionTitle: 'Ngữ pháp giao tiếp công sở',
  questions: [
    makeQuestion(
      'Choose the correct phrase: "I look forward ___ hearing from you."',
      ['to', 'for', 'at', 'on'],
      0,
      1,
    ),
    makeQuestion(
      'Which sentence is grammatically correct?',
      ['Would you mind closing the window?', 'Would you mind close the window?', 'Would you mind to close the window?', 'Would you mind closed the window?'],
      0,
      2,
    ),
    makeQuestion(
      'We ___ the contract yesterday.',
      ['signed', 'sign', 'signing', 'have sign'],
      0,
      3,
    ),
    makeQuestion(
      'She has worked here ___ 2020.',
      ['since', 'for', 'from', 'during'],
      0,
      4,
    ),
    makeQuestion(
      'If I ___ you, I would accept the offer.',
      ['were', 'am', 'was', 'be'],
      0,
      5,
    ),
  ],
});

async function createSection(payload, label) {
  const response = await fetch(
    `${API_BASE}/api/question-bank/courses/${COURSE_ID}/paths/${PATH_ID}/sections`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': String(USER_ID),
      },
      body: JSON.stringify(payload),
    },
  );

  const body = await response.json();
  if (!response.ok || body.success === false) {
    throw new Error(body.message || `Failed to create ${label}`);
  }

  console.log(`✅ ${label}: sectionId=${body.data?.sectionId}, questions=${payload.sectionInsert.questions.length}`);
  return body.data;
}

async function main() {
  console.log(`Seeding VOCABULARY question bank for course ${COURSE_ID}, path ${PATH_ID}...`);

  const ensureRes = await fetch(
    `${API_BASE}/api/question-bank/courses/${COURSE_ID}/paths/${PATH_ID}/question-path/ensure`,
    {
      method: 'POST',
      headers: { 'x-user-id': String(USER_ID) },
    },
  );
  const ensureBody = await ensureRes.json();
  if (!ensureRes.ok || ensureBody.success === false) {
    throw new Error(ensureBody.message || 'Cannot ensure question path');
  }
  console.log(`Questions_Path: ${ensureBody.data?.questionPathId}`);

  await createSection(VOCABULARY_SECTION, 'Từ vựng thương mại');
  await createSection(GRAMMAR_SECTION, 'Ngữ pháp giao tiếp công sở');

  const verifyRes = await fetch(
    `${API_BASE}/api/question-bank/courses/${COURSE_ID}/paths/${PATH_ID}/sections`,
    { headers: { 'x-user-id': String(USER_ID) } },
  );
  const verifyBody = await verifyRes.json();
  const sections = verifyBody.data?.sections ?? [];
  console.log(`\nDone. ${sections.length} section(s) in chapter ${PATH_ID}:`);
  sections.forEach((section) => {
    console.log(`  - [${section.skillType}] ${section.displayName ?? section.sectionName}: ${section.questionCount} câu`);
  });
}

main().catch((error) => {
  console.error('❌', error.message);
  process.exit(1);
});
