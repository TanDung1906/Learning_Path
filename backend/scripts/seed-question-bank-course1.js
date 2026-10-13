/**
 * Seed full question bank for course 1 (all chapters, all skills).
 * Uses sqlcmd + Windows auth (HungHoang23\SQLEXPRESS).
 * Run: node backend/scripts/seed-question-bank-course1.js
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const COURSE_ID = 1;
const SQL_SERVER = process.env.DB_SERVER || 'HungHoang23\\SQLEXPRESS';
const DB_NAME = process.env.DB_NAME || 'LearningPath_Base';

const CHAPTERS = [
  {
    pathId: 1,
    listening: [
      {
        name: 'Nghe - Email công việc',
        title: 'Nghe - Email công việc',
        questions: [
          ['What does the speaker want the listener to do?', ['Reply by Friday', 'Cancel the meeting', 'Book a flight', 'Send an invoice'], 0],
          ['When is the meeting scheduled?', ['Monday at 9 AM', 'Tuesday at 2 PM', 'Wednesday at 10 AM', 'Friday at 4 PM'], 2],
          ['Who sent the email?', ['The project manager', 'The HR director', 'A client', 'The IT team'], 0],
          ['What attachment is mentioned?', ['Project timeline', 'Salary slip', 'Flight ticket', 'Menu'], 0],
          ['The tone of the email is best described as ___.', ['Professional and polite', 'Angry', 'Casual and informal', 'Humorous'], 0],
        ],
      },
      {
        name: 'Nghe - Họp nhóm',
        title: 'Nghe - Họp nhóm',
        questions: [
          ['What is the main topic of the meeting?', ['Q2 budget review', 'Office relocation', 'Holiday schedule', 'New hiring'], 0],
          ['How many people will attend?', ['Five', 'Eight', 'Ten', 'Twelve'], 1],
          ['Where will they meet?', ['Conference Room B', 'Cafeteria', 'Online only', 'Reception'], 0],
          ['What should participants prepare?', ['Sales figures', 'Lunch orders', 'Passports', 'Uniforms'], 0],
          ['The meeting will end at ___.', ['11:30 AM', '9:00 AM', '1:00 PM', '5:00 PM'], 0],
        ],
      },
    ],
    reading: [
      {
        name: 'Đọc - Thư mời họp',
        title: 'Đọc - Thư mời họp',
        questions: [
          ['The meeting invitation is for ___.', ['a quarterly review', 'a birthday party', 'a product launch only', 'a training exam'], 0],
          ['Attendees are asked to confirm by ___.', ['email', 'phone call only', 'fax', 'postal mail'], 0],
          ['The dress code is ___.', ['business casual', 'sportswear', 'uniform required', 'not mentioned'], 0],
          ['Parking is available ___.', ['behind the building', 'not available', 'only for managers', 'on the roof'], 0],
          ['Lunch will be ___.', ['provided', 'not provided', 'paid separately only', 'cancelled'], 0],
        ],
      },
      {
        name: 'Đọc - Email follow-up',
        title: 'Đọc - Email follow-up',
        questions: [
          ['The writer follows up about ___.', ['a delayed report', 'a wedding invitation', 'a gym membership', 'a movie ticket'], 0],
          ['The deadline was originally ___.', ['last Monday', 'next year', 'yesterday evening', 'two months ago'], 0],
          ['The reader should contact ___.', ['Sarah in Finance', 'the security guard', 'the cafeteria', 'no one'], 0],
          ['The email suggests a call if ___.', ['there are issues', 'the weather is bad', 'it is lunchtime', 'the office is closed'], 0],
          ['The closing phrase is ___.', ['Best regards', 'See you never', 'No reply needed', 'Over and out'], 0],
        ],
      },
    ],
    vocabulary: [
      {
        name: 'Từ vựng Email & Meetings',
        title: 'Từ vựng Email & Meetings',
        questions: [
          ['"Agenda" means ___.', ['a list of meeting topics', 'a type of chair', 'an email address', 'a lunch menu'], 0],
          ['Choose the synonym of "postpone".', ['delay', 'confirm', 'attend', 'approve'], 0],
          ['"Attendee" refers to ___.', ['a person who joins a meeting', 'a meeting room', 'a calendar app', 'a printer'], 0],
          ['"Minutes" in a meeting context are ___.', ['written notes of what was discussed', '60 seconds', 'small coins', 'coffee breaks'], 0],
          ['"RSVP" means you should ___.', ['respond to an invitation', 'bring food only', 'leave early', 'ignore the invite'], 0],
          ['"Follow up" means ___.', ['contact again about a previous matter', 'run before others', 'close a file', 'delete an email'], 0],
        ],
      },
      {
        name: 'Ngữ pháp Email & Meetings',
        title: 'Ngữ pháp Email & Meetings',
        questions: [
          ['I look forward ___ hearing from you.', ['to', 'for', 'at', 'on'], 0],
          ['We ___ the meeting yesterday.', ['had', 'have', 'having', 'has'], 0],
          ['Could you please ___ me the report?', ['send', 'sending', 'sent', 'sends'], 0],
          ['She has worked here ___ 2020.', ['since', 'for', 'during', 'by'], 0],
          ['The presentation ___ by Tom tomorrow.', ['will be given', 'gives', 'gave', 'giving'], 0],
          ['Would you mind ___ the door?', ['closing', 'close', 'to close', 'closed'], 0],
        ],
      },
    ],
  },
  {
    pathId: 2,
    listening: [
      {
        name: 'Nghe - Mở đầu thuyết trình',
        title: 'Nghe - Mở đầu thuyết trình',
        questions: [
          ['What is the presentation about?', ['Market trends', 'Cooking recipes', 'Sports results', 'Weather forecast'], 0],
          ['How long will the talk last?', ['20 minutes', '2 hours', '5 minutes', 'All day'], 0],
          ['The speaker asks the audience to ___.', ['hold questions until the end', 'leave immediately', 'turn off the lights', 'sing a song'], 0],
          ['Which slide is shown first?', ['Title slide', 'Conclusion', 'References', 'Blank page'], 0],
          ['The speaker works in ___.', ['the marketing department', 'the kitchen', 'the garage', 'the library'], 0],
        ],
      },
      {
        name: 'Nghe - Q&A sau thuyết trình',
        title: 'Nghe - Q&A sau thuyết trình',
        questions: [
          ['The first question is about ___.', ['pricing strategy', 'holiday plans', 'office plants', 'parking fees'], 0],
          ['The speaker does not know the answer to ___.', ['the exact launch date', 'their own name', 'the company name', 'the room number'], 0],
          ['Audience members should raise ___.', ['their hand', 'their voice only', 'the table', 'the projector'], 0],
          ['The Q&A session lasts ___.', ['10 minutes', '2 seconds', '3 hours', 'all week'], 0],
          ['Slides are available ___.', ['after the session by email', 'never', 'only on paper', 'only in person at HQ'], 0],
        ],
      },
    ],
    reading: [
      {
        name: 'Đọc - Cấu trúc slide',
        title: 'Đọc - Cấu trúc slide',
        questions: [
          ['A good presentation should start with ___.', ['a clear objective', 'a long joke', 'personal gossip', 'silent slides'], 0],
          ['Bullet points should be ___.', ['short and clear', 'as long as possible', 'written in red only', 'avoided always'], 0],
          ['The conclusion should ___.', ['summarize key points', 'introduce new topics', 'ignore the audience', 'repeat the title only'], 0],
          ['Charts are used to ___.', ['show data visually', 'decorate the room', 'replace the speaker', 'hide information'], 0],
          ['Font size should be ___.', ['readable from the back', 'tiny', 'invisible', 'random'], 0],
        ],
      },
      {
        name: 'Đọc - Feedback thuyết trình',
        title: 'Đọc - Feedback thuyết trình',
        questions: [
          ['The reviewer praises the ___.', ['clear structure', 'lack of preparation', 'excessive length', 'poor visuals'], 0],
          ['One suggestion is to ___.', ['speak more slowly', 'remove all slides', 'avoid eye contact', 'skip the introduction'], 0],
          ['The presenter should practice ___.', ['more before the next talk', 'less', 'only at night', 'never again'], 0],
          ['Body language was described as ___.', ['confident', 'nervous throughout', 'absent', 'distracting only'], 0],
          ['Overall rating was ___.', ['positive', 'failed', 'not given', 'cancelled'], 0],
        ],
      },
    ],
    vocabulary: [
      {
        name: 'Từ vựng Presentations',
        title: 'Từ vựng Presentations',
        questions: [
          ['"Slide deck" means ___.', ['a set of presentation slides', 'a wooden box', 'a type of shoe', 'a computer virus'], 0],
          ['"Key takeaway" refers to ___.', ['the main point to remember', 'a stolen item', 'a keyboard shortcut', 'a lunch break'], 0],
          ['"Audience" means ___.', ['people listening to a talk', 'a type of microphone', 'a projector brand', 'a meeting room'], 0],
          ['"Handout" is ___.', ['printed material given to listeners', 'a wave goodbye', 'a type of vote', 'an online chat'], 0],
          ['"Q&A" stands for ___.', ['Question and Answer', 'Quick and Angry', 'Quality Assurance only', 'Quiet Area'], 0],
          ['"Outline" means ___.', ['a summary plan of the talk', 'the outer edge of a circle', 'a final grade', 'a type of font'], 0],
        ],
      },
      {
        name: 'Ngữ pháp Presentations',
        title: 'Ngữ pháp Presentations',
        questions: [
          ['Today, I ___ going to talk about sales.', ['am', 'is', 'are', 'be'], 0],
          ['The data ___ shown on the next slide.', ['will be', 'was being', 'has', 'have'], 0],
          ['If I ___ more time, I would add more examples.', ['had', 'have', 'has', 'having'], 0],
          ['She suggested ___ the introduction shorter.', ['making', 'make', 'to make', 'made'], 0],
          ['There ___ many questions after the talk.', ['were', 'was', 'is', 'be'], 0],
          ['We have finished, ___ we?', ['haven\'t', 'hasn\'t', 'don\'t', 'doesn\'t'], 0],
        ],
      },
    ],
  },
  {
    pathId: 12,
    listening: [
      {
        name: 'Nghe - Gọi điện khách hàng',
        title: 'Nghe - Gọi điện khách hàng',
        questions: [
          ['The caller wants to ___.', ['schedule a product demo', 'order pizza', 'book a vacation', 'report a fire'], 0],
          ['The best time to call back is ___.', ['tomorrow afternoon', 'never', 'last week', 'midnight'], 0],
          ['The customer company is in ___.', ['the healthcare sector', 'professional sports', 'fashion design only', 'agriculture only'], 0],
          ['The agent promises to ___.', ['send a calendar invite', 'ignore the request', 'delete the account', 'close the branch'], 0],
          ['The call ends with ___.', ['thanks and goodbye', 'an argument', 'silence only', 'a song'], 0],
        ],
      },
      {
        name: 'Nghe - Đàm phán hợp đồng',
        title: 'Nghe - Đàm phán hợp đồng',
        questions: [
          ['Both sides disagree about ___.', ['payment terms', 'the weather', 'office color', 'lunch menu'], 0],
          ['The contract length discussed is ___.', ['12 months', '12 days', '12 hours', '12 weeks only'], 0],
          ['They agree to meet ___.', ['next Tuesday', 'last year', 'never', 'without notice'], 0],
          ['Legal review will take ___.', ['about a week', 'one minute', 'ten years', 'no time'], 0],
          ['The negotiation tone is ___.', ['professional', 'hostile throughout', 'silent', 'comedic only'], 0],
        ],
      },
    ],
    reading: [
      {
        name: 'Đọc - Điều khoản hợp đồng',
        title: 'Đọc - Điều khoản hợp đồng',
        questions: [
          ['Payment is due within ___.', ['30 days', '30 minutes', '30 years', '30 seconds'], 0],
          ['Either party may terminate with ___.', ['30 days notice', 'no notice ever', 'a verbal shout', 'a lottery'], 0],
          ['Confidential information must be ___.', ['protected', 'posted online', 'sold', 'ignored'], 0],
          ['Disputes will be resolved through ___.', ['arbitration', 'social media polls', 'coin toss only', 'public debate'], 0],
          ['The contract starts on ___.', ['the signing date', 'a random date', 'never', 'yesterday only'], 0],
        ],
      },
      {
        name: 'Đọc - Báo cáo kinh doanh',
        title: 'Đọc - Báo cáo kinh doanh',
        questions: [
          ['Revenue increased by ___.', ['15%', '1500%', '0.1%', 'none'], 0],
          ['The main growth driver was ___.', ['new markets', 'office plants', 'shorter lunches', 'fewer employees'], 0],
          ['Costs were controlled by ___.', ['better budgeting', 'ignoring invoices', 'closing all branches', 'removing all staff'], 0],
          ['The CEO recommends ___.', ['continued investment', 'shutting down', 'no changes ever', 'random cuts'], 0],
          ['Next quarter focus is on ___.', ['customer retention', 'holiday parties only', 'renaming products', 'deleting data'], 0],
        ],
      },
    ],
    vocabulary: [
      {
        name: 'Từ vựng Business Communication',
        title: 'Từ vựng Business Communication',
        questions: [
          ['"Negotiate" means ___.', ['discuss to reach agreement', 'run quickly', 'write poetry', 'cancel a trip'], 0],
          ['"Invoice" is ___.', ['a bill for payment', 'a meeting room', 'a job title', 'a type of chair'], 0],
          ['"Stakeholder" refers to ___.', ['someone with interest in a project', 'a kitchen tool', 'a fence post', 'a sports referee'], 0],
          ['"Deadline" means ___.', ['the final date to complete something', 'a line on the floor', 'a lunch break', 'a holiday'], 0],
          ['"Proposal" is ___.', ['a formal plan or offer', 'a type of dessert', 'an email signature', 'a printer error'], 0],
          ['"Compliance" means ___.', ['following rules and regulations', 'ignoring policies', 'celebrating only', 'running away'], 0],
        ],
      },
      {
        name: 'Ngữ pháp Business Communication',
        title: 'Ngữ pháp Business Communication',
        questions: [
          ['The report ___ submitted last Friday.', ['was', 'were', 'be', 'being'], 0],
          ['We need to ___ the contract carefully.', ['review', 'reviewing', 'reviewed', 'reviews'], 0],
          ['Neither the manager nor the staff ___ present.', ['was', 'were', 'are', 'be'], 0],
          ['By next month, we ___ the project.', ['will have completed', 'complete', 'completed', 'completing'], 0],
          ['He asked whether we ___ the terms.', ['accepted', 'accept', 'accepting', 'accepts'], 0],
          ['The client insisted on ___ a discount.', ['getting', 'get', 'got', 'gets'], 0],
        ],
      },
    ],
  },
];

function esc(value) {
  return String(value ?? '').replace(/'/g, "''");
}

function runSqlBatch(sqlText) {
  const tmpFile = path.join(os.tmpdir(), `seed-qb-course1-${Date.now()}.sql`);
  const script = `SET NOCOUNT ON;\nSET XACT_ABORT ON;\nSET QUOTED_IDENTIFIER ON;\nBEGIN TRANSACTION;\n${sqlText}\nCOMMIT TRANSACTION;\n`;
  // UTF-8 BOM — sqlcmd trên Windows cần BOM để giữ tiếng Việt trong N'...'
  fs.writeFileSync(tmpFile, `\uFEFF${script}`, 'utf8');
  try {
    execSync(`sqlcmd -S "${SQL_SERVER}" -E -d "${DB_NAME}" -i "${tmpFile}" -f 65001`, {
      stdio: 'pipe',
      encoding: 'utf8',
    });
  } finally {
    fs.unlinkSync(tmpFile);
  }
}

function buildSeedSql() {
  const lines = [];
  lines.push(`DECLARE @BankId INT;`);
  lines.push(`SELECT @BankId = BankId FROM dbo.Question_Bank WHERE CourseId = ${COURSE_ID};`);
  lines.push(`IF @BankId IS NULL`);
  lines.push(`BEGIN`);
  lines.push(`  INSERT INTO dbo.Question_Bank (`);
  lines.push(`    InstructorId, CourseId, CourseName, CourseDescription, BankDescription, CreatedAt, UpdatedAt, IsPublished`);
  lines.push(`  )`);
  lines.push(`  SELECT`);
  lines.push(`    c.InstructorId, c.CourseId, c.CourseName, c.Description,`);
  lines.push(`    N'Question bank seed for course 1', GETDATE(), GETDATE(), ISNULL(c.IsPublished, 1)`);
  lines.push(`  FROM dbo.Courses c WHERE c.CourseId = ${COURSE_ID};`);
  lines.push(`  SET @BankId = SCOPE_IDENTITY();`);
  lines.push(`END;`);

  for (const chapter of CHAPTERS) {
    lines.push(`DECLARE @QP_${chapter.pathId} INT;`);
    lines.push(`SELECT @QP_${chapter.pathId} = qp.Question_Path_Id`);
    lines.push(`FROM dbo.Questions_Path qp WHERE qp.BankId = @BankId AND qp.PathId = ${chapter.pathId};`);
    lines.push(`IF @QP_${chapter.pathId} IS NULL`);
    lines.push(`BEGIN`);
    lines.push(`  INSERT INTO dbo.Questions_Path (BankId, PathId, IsActive) VALUES (@BankId, ${chapter.pathId}, 1);`);
    lines.push(`  SET @QP_${chapter.pathId} = SCOPE_IDENTITY();`);
    lines.push(`END;`);

    let sectionOrder = 1;
    const groups = [
      { typeId: 1, sections: chapter.listening },
      { typeId: 2, sections: chapter.reading },
      { typeId: 3, sections: chapter.vocabulary },
    ];

    for (const group of groups) {
      for (const section of group.sections) {
        lines.push(`DECLARE @S_${chapter.pathId}_${sectionOrder} INT;`);
        lines.push(`INSERT INTO dbo.Question_Sections (`);
        lines.push(`  Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest`);
        lines.push(`) VALUES (`);
        lines.push(`  @QP_${chapter.pathId}, N'${esc(section.name)}', N'${esc(section.title)}', ${group.typeId}, ${sectionOrder}, NULL, 1`);
        lines.push(`);`);
        lines.push(`SET @S_${chapter.pathId}_${sectionOrder} = SCOPE_IDENTITY();`);

        section.questions.forEach((item, qIndex) => {
          const [text, options, correctIndex] = item;
          const qOrder = qIndex + 1;
          lines.push(`DECLARE @Q_${chapter.pathId}_${sectionOrder}_${qOrder} INT;`);
          lines.push(`INSERT INTO dbo.Questions (SectionId, Title, IsActive, IsUseForTest, [Order])`);
          lines.push(`VALUES (@S_${chapter.pathId}_${sectionOrder}, N'${esc(text)}', 1, 1, ${qOrder});`);
          lines.push(`SET @Q_${chapter.pathId}_${sectionOrder}_${qOrder} = SCOPE_IDENTITY();`);
          options.forEach((opt, optIndex) => {
            const isTrue = optIndex === correctIndex ? 1 : 0;
            lines.push(`INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)`);
            lines.push(`VALUES (@Q_${chapter.pathId}_${sectionOrder}_${qOrder}, N'${esc(opt)}', ${optIndex + 1}, ${isTrue});`);
          });
        });

        sectionOrder += 1;
      }
    }
  }

  return lines.join('\n');
}

function printSummary() {
  const query = `
SET NOCOUNT ON;
SELECT
  p.PathId,
  p.[Order] AS PathOrder,
  qs.TypeId,
  COUNT(DISTINCT qs.SectionId) AS SectionCount,
  COUNT(DISTINCT q.QuestionId) AS QuestionCount
FROM dbo.Paths p
LEFT JOIN dbo.Questions_Path qp ON qp.PathId = p.PathId
LEFT JOIN dbo.Question_Bank qb ON qb.BankId = qp.BankId AND qb.CourseId = ${COURSE_ID}
LEFT JOIN dbo.Question_Sections qs ON qs.Question_Path_Id = qp.Question_Path_Id
LEFT JOIN dbo.Questions q ON q.SectionId = qs.SectionId AND q.IsActive = 1
WHERE p.CourseId = ${COURSE_ID}
GROUP BY p.PathId, p.[Order], qs.TypeId
ORDER BY p.[Order], qs.TypeId;
SELECT
  COUNT(DISTINCT qs.SectionId) AS TotalSections,
  COUNT(DISTINCT q.QuestionId) AS TotalQuestions,
  COUNT(DISTINCT qc.ChoiceId) AS TotalChoices
FROM dbo.Question_Bank qb
INNER JOIN dbo.Questions_Path qp ON qp.BankId = qb.BankId
INNER JOIN dbo.Question_Sections qs ON qs.Question_Path_Id = qp.Question_Path_Id
INNER JOIN dbo.Questions q ON q.SectionId = qs.SectionId AND q.IsActive = 1
INNER JOIN dbo.Question_Choices qc ON qc.QuestionId = q.QuestionId
WHERE qb.CourseId = ${COURSE_ID};
`;
  const out = execSync(`sqlcmd -S "${SQL_SERVER}" -E -d "${DB_NAME}" -Q "${query.replace(/"/g, '\\"')}"`, {
    encoding: 'utf8',
  });
  console.log(out);
}

function main() {
  console.log(`Seeding full question bank for course ${COURSE_ID} on ${SQL_SERVER}/${DB_NAME}...`);
  const sqlText = buildSeedSql();
  const outFile = path.join(__dirname, 'seed-question-bank-course1.generated.sql');
  fs.writeFileSync(outFile, `\uFEFF${sqlText}`, 'utf8');
  runSqlBatch(sqlText);
  console.log('Seed completed. Summary:');
  printSummary();
  console.log(`SQL saved to ${outFile}`);
}

main();
