const { sql } = require('../config/db');
const {
    normalizeSectionSkillType,
    SQL_SKILL_TYPE_FROM_TYPE_ID,
} = require('../utils/sectionSkillType');



const getAllListQuestionBankByMentorId = async (mentorId) => {
    try {
        const request = new sql.Request();
        request.input('mentorId', sql.Int, Number(mentorId));
        const result = await request.query(`
            SELECT
                c.CourseId,
                qb.BankId,
                c.CourseName,
                c.Description AS CourseDescription,
                COUNT(DISTINCT CASE WHEN q.IsActive = 1 THEN q.QuestionId END) AS TotalQuestion,
                COUNT(DISTINCT CASE
                    WHEN q.IsActive = 1
                     AND ISNULL(qs.IsUseForTest, 1) = 1
                     AND ISNULL(q.IsUseForTest, 1) = 1
                    THEN q.QuestionId
                END) AS TotalQuestionIsPublic,
                COUNT(DISTINCT CASE
                    WHEN q.IsActive = 1
                     AND (
                        ISNULL(qs.IsUseForTest, 1) = 0
                        OR ISNULL(q.IsUseForTest, 1) = 0
                     )
                    THEN q.QuestionId
                END) AS TotalDraftQuestion,
                COUNT(DISTINCT CASE WHEN q.IsActive = 1 THEN qp.PathId END) AS PathHasQuestion,
                (
                    SELECT COUNT(*)
                    FROM dbo.Paths p
                    WHERE p.CourseId = c.CourseId
                ) AS TotalPath,
                qb.UpdatedAt,
                c.IsPublished,
                c.Thumbnail
            FROM dbo.Question_Bank qb
            INNER JOIN dbo.Courses c ON c.CourseId = qb.CourseId
            LEFT JOIN dbo.Questions_Path qp ON qp.BankId = qb.BankId
            LEFT JOIN dbo.Question_Sections qs ON qs.Question_Path_Id = qp.Question_Path_Id
            LEFT JOIN dbo.Questions q ON q.SectionId = qs.SectionId
            WHERE qb.InstructorId = @mentorId
            GROUP BY
                c.CourseId,
                qb.BankId,
                c.CourseName,
                c.Description,
                qb.UpdatedAt,
                c.IsPublished,
                c.Thumbnail
            ORDER BY qb.UpdatedAt DESC, c.CourseId DESC
        `);
        return result.recordset;
    } catch (error) {
        console.error(error.message);
        return [];
    }

};



const getSectionsByPath = async (courseId, pathId) => {
    const request = new sql.Request();
    request.input('courseId', sql.Int, Number(courseId));
    request.input('pathId', sql.Int, Number(pathId));
    const result = await request.query(`
        SELECT
            qp.Question_Path_Id AS QuestionPathId,
            qs.SectionId,
            qs.SectionName,
            qs.Title,
            qs.TypeId,
            ${SQL_SKILL_TYPE_FROM_TYPE_ID} AS SkillType,
            qs.[Order] AS SectionOrder,
            qs.SourceUrl,
            qs.IsUseForTest,
            COUNT(q.QuestionId) AS QuestionCount

        FROM dbo.Questions_Path qp
        INNER JOIN dbo.Question_Bank qb
            ON qb.BankId = qp.BankId
        INNER JOIN dbo.Question_Sections qs
            ON qs.Question_Path_Id = qp.Question_Path_Id
        INNER JOIN dbo.Section_Type st
            ON st.TypeId = qs.TypeId
        LEFT JOIN dbo.Questions q
            ON q.SectionId = qs.SectionId
           AND q.IsActive = 1
        WHERE qp.PathId = @pathId
          AND qb.CourseId = @courseId
        GROUP BY
            qp.Question_Path_Id,
            qs.SectionId,
            qs.SectionName,
            qs.Title,
            qs.TypeId,
            qs.[Order],
            qs.SourceUrl,
            qs.IsUseForTest
        ORDER BY qs.[Order], qs.SectionId
    `);
    return result.recordset;
};



const getQuestionsBySection = async (sectionId) => {
    const request = new sql.Request();
    request.input('sectionId', sql.Int, Number(sectionId));
    const result = await request.query(`
        SELECT
            q.QuestionId,
            q.SectionId,
            q.Title,
            qs.TypeId,
            ${SQL_SKILL_TYPE_FROM_TYPE_ID} AS SkillType,
            qs.SourceUrl AS SourceUrl,
            q.[Order] AS QuestionOrder,
            q.IsActive,
            q.IsUseForTest,
            qc.ChoiceId,
            qc.Title AS ChoiceTitle,
            qc.[Order] AS ChoiceOrder,
            qc.IsTrue

        FROM dbo.Questions q
        INNER JOIN dbo.Question_Sections qs
            ON qs.SectionId = q.SectionId
        INNER JOIN dbo.Section_Type st
            ON st.TypeId = qs.TypeId
        LEFT JOIN dbo.Question_Choices qc
            ON qc.QuestionId = q.QuestionId
        WHERE q.SectionId = @sectionId
          AND q.IsActive = 1
        ORDER BY q.[Order], q.QuestionId, qc.[Order], qc.ChoiceId
    `);
    return result.recordset;
};



const sectionBelongsToCoursePath = async (sectionId, courseId, pathId) => {
    const request = new sql.Request();
    request.input('sectionId', sql.Int, Number(sectionId));
    request.input('courseId', sql.Int, Number(courseId));
    request.input('pathId', sql.Int, Number(pathId));
    const result = await request.query(`
        SELECT TOP 1 qs.SectionId
        FROM dbo.Question_Sections qs
        INNER JOIN dbo.Questions_Path qp
            ON qp.Question_Path_Id = qs.Question_Path_Id
        INNER JOIN dbo.Question_Bank qb
            ON qb.BankId = qp.BankId
        WHERE qs.SectionId = @sectionId
          AND qp.PathId = @pathId
          AND qb.CourseId = @courseId
    `);
    return result.recordset.length > 0;
};

// get information question bank by it's id
const getQuestionBankByIdModel = async (bankId) => {
    const request = new sql.Request();
    request.input("bankId", sql.Int, Number(bankId));
    const result = await request.query(`
        SELECT TOP (1000) [BankId]
      ,[InstructorId]
      ,[CourseId]
      ,[CourseName]
      ,[CourseDescription]
      ,[BankDescription]
      ,[CreatedAt]
      ,[UpdatedAt]
      ,[IsPublished]
  FROM [LearningPath_Base].[dbo].[Question_Bank]
Where BankId = @bankId
        `);
    return result.recordset
}

// get question bank paths by bank's id
const getQuestionBankPathsByBankIdModel = async (bankId) => {
    const request = new sql.Request();
    request.input('bankId', sql.Int, Number(bankId));
    const result = await request.query(
        `
  SELECT [Question_Path_Id]
      ,[BankId]
      ,[PathId]
  FROM [LearningPath_Base].[dbo].[Questions_Path]
  Where BankId = @bankId
        `
    )

    return result.recordset
}

const updateQuestionUseForTestById = async (questionId, isUseForTest) => {
    const request = new sql.Request();
    request.input('questionId', sql.Int, Number(questionId));
    request.input('isUseForTest', sql.Bit, isUseForTest ? 1 : 0);
    const result = await request.query(`
        UPDATE dbo.Questions
        SET IsUseForTest = @isUseForTest
        WHERE QuestionId = @questionId
          AND IsActive = 1
    `);
    return Number(result.rowsAffected?.[0] || 0) > 0;
};

const ACTIVE_QUESTION_WHERE = `
    q.IsActive = 1
    AND ISNULL(q.IsUseForTest, 1) = 1
    AND ISNULL(qs.IsUseForTest, 1) = 1
    AND LTRIM(RTRIM(ISNULL(q.Title, ''))) <> ''
`;

const getChapterQuestionPathId = async (courseId, pathId) => {
    const request = new sql.Request();
    request.input('courseId', sql.Int, Number(courseId));
    request.input('pathId', sql.Int, Number(pathId));
    const result = await request.query(`
        SELECT TOP 1 qp.Question_Path_Id AS QuestionPathId
        FROM dbo.Questions_Path qp
        INNER JOIN dbo.Question_Bank qb
            ON qb.BankId = qp.BankId
        WHERE qp.PathId = @pathId
          AND qb.CourseId = @courseId
        ORDER BY qp.Question_Path_Id
    `);
    return result.recordset[0]?.QuestionPathId ?? null;
};

const getActiveQuestionCountsByPath = async (courseId, pathId = null) => {
    const request = new sql.Request();
    request.input('courseId', sql.Int, Number(courseId));
    let pathFilter = '';
    if (pathId != null) {
        request.input('pathId', sql.Int, Number(pathId));
        pathFilter = 'AND qp.PathId = @pathId';
    }

    const result = await request.query(`
        SELECT
            qp.PathId,
            qs.TypeId,
            ${SQL_SKILL_TYPE_FROM_TYPE_ID} AS SkillType,
            COUNT(*) AS ActiveCount
        FROM dbo.Questions q
        INNER JOIN dbo.Question_Sections qs
            ON qs.SectionId = q.SectionId
        INNER JOIN dbo.Questions_Path qp
            ON qp.Question_Path_Id = qs.Question_Path_Id
        INNER JOIN dbo.Question_Bank qb
            ON qb.BankId = qp.BankId
        INNER JOIN dbo.Section_Type st
            ON st.TypeId = qs.TypeId
        WHERE qb.CourseId = @courseId
          ${pathFilter}
          AND ${ACTIVE_QUESTION_WHERE}
        GROUP BY qp.PathId, qs.TypeId
    `);

    return result.recordset;
};

const mapSectionGroupRow = (row) => {
    const sectionTitle = String(row.Title ?? row.SectionName ?? '').trim() || 'Section';
    return {
        sectionTempId: `section_${row.SectionId}`,
        sectionTitle,
        availableCount: Number(row.ActiveCount) || 0,
        isUseForTest: row.IsUseForTest == null ? true : Boolean(row.IsUseForTest),
    };
};

const splitListeningReadingGroups = (rows = []) => {
    const groups = {
        LISTENING: [],
        READING: [],
    };

    rows.forEach((row) => {
        const skill = normalizeSectionSkillType(row.SkillType, row.TypeId);
        if (!groups[skill]) return;
        groups[skill].push(mapSectionGroupRow(row));
    });

    return groups;
};

const getActiveListeningReadingSectionCounts = async (courseId, pathId = null) => {
    const request = new sql.Request();
    request.input('courseId', sql.Int, Number(courseId));
    let pathFilter = '';
    if (pathId != null) {
        request.input('pathId', sql.Int, Number(pathId));
        pathFilter = 'AND qp.PathId = @pathId';
    }

    const result = await request.query(`
        SELECT
            qp.PathId,
            qs.TypeId,
            ${SQL_SKILL_TYPE_FROM_TYPE_ID} AS SkillType,
            qs.SectionId,
            qs.SectionName,
            qs.Title,
            qs.[Order] AS SectionOrder,
            qs.IsUseForTest,
            COUNT(
                CASE
                    WHEN q.QuestionId IS NOT NULL
                     AND q.IsActive = 1
                     AND ISNULL(q.IsUseForTest, 1) = 1
                     AND ISNULL(qs.IsUseForTest, 1) = 1
                     AND LTRIM(RTRIM(ISNULL(q.Title, ''))) <> ''
                    THEN 1
                END
            ) AS ActiveCount
        FROM dbo.Question_Sections qs
        INNER JOIN dbo.Questions_Path qp
            ON qp.Question_Path_Id = qs.Question_Path_Id
        INNER JOIN dbo.Question_Bank qb
            ON qb.BankId = qp.BankId
        INNER JOIN dbo.Section_Type st
            ON st.TypeId = qs.TypeId
        LEFT JOIN dbo.Questions q
            ON q.SectionId = qs.SectionId
        WHERE qb.CourseId = @courseId
          ${pathFilter}
          AND qs.TypeId IN (1, 2)
        GROUP BY
            qp.PathId,
            qs.TypeId,
            qs.SectionId,
            qs.SectionName,
            qs.Title,
            qs.[Order],
            qs.IsUseForTest
        ORDER BY qp.PathId, qs.TypeId, qs.[Order], qs.SectionId
    `);

    return result.recordset;
};

const getActiveVocabularySectionCounts = async (courseId, pathId = null) => {
    const request = new sql.Request();
    request.input('courseId', sql.Int, Number(courseId));
    let pathFilter = '';
    if (pathId != null) {
        request.input('pathId', sql.Int, Number(pathId));
        pathFilter = 'AND qp.PathId = @pathId';
    }

    const result = await request.query(`
        SELECT
            qp.PathId,
            qs.TypeId,
            qs.SectionId,
            qs.SectionName,
            qs.Title,
            qs.[Order] AS SectionOrder,
            qs.IsUseForTest,
            COUNT(
                CASE
                    WHEN q.QuestionId IS NOT NULL
                     AND q.IsActive = 1
                     AND ISNULL(q.IsUseForTest, 1) = 1
                     AND ISNULL(qs.IsUseForTest, 1) = 1
                     AND LTRIM(RTRIM(ISNULL(q.Title, ''))) <> ''
                    THEN 1
                END
            ) AS ActiveCount
        FROM dbo.Question_Sections qs
        INNER JOIN dbo.Questions_Path qp
            ON qp.Question_Path_Id = qs.Question_Path_Id
        INNER JOIN dbo.Question_Bank qb
            ON qb.BankId = qp.BankId
        INNER JOIN dbo.Section_Type st
            ON st.TypeId = qs.TypeId
        LEFT JOIN dbo.Questions q
            ON q.SectionId = qs.SectionId
        WHERE qb.CourseId = @courseId
          ${pathFilter}
          AND qs.TypeId = 3
        GROUP BY
            qp.PathId,
            qs.TypeId,
            qs.SectionId,
            qs.SectionName,
            qs.Title,
            qs.[Order],
            qs.IsUseForTest
        ORDER BY qp.PathId, qs.[Order], qs.SectionId
    `);

    return result.recordset;
};

const getChapterQuestionBankActiveStats = async (courseId, pathId) => {
    const questionPathId = await getChapterQuestionPathId(courseId, pathId);
    const [countRows, lrSectionRows, vocabularyRows] = await Promise.all([
        getActiveQuestionCountsByPath(courseId, pathId),
        getActiveListeningReadingSectionCounts(courseId, pathId),
        getActiveVocabularySectionCounts(courseId, pathId),
    ]);

    const questionCountBySkill = {
        LISTENING: 0,
        READING: 0,
        VOCABULARY: 0,
    };

    countRows.forEach((row) => {
        const skill = normalizeSectionSkillType(row.SkillType, row.TypeId);
        if (skill in questionCountBySkill) {
            questionCountBySkill[skill] += Number(row.ActiveCount) || 0;
        }
    });

    const totalActive = Object.values(questionCountBySkill).reduce((sum, count) => sum + count, 0);
    const lrSectionGroups = splitListeningReadingGroups(lrSectionRows);
    const vocabularySectionGroups = vocabularyRows.map(mapSectionGroupRow);

    return {
        questionPathId,
        hasBank: questionPathId != null || totalActive > 0,
        questionCountBySkill,
        listeningSectionGroups: lrSectionGroups.LISTENING,
        readingSectionGroups: lrSectionGroups.READING,
        vocabularySectionGroups,
        totalActive,
    };
};

const getCourseQuestionBankActiveStats = async (courseId) => {
    const request = new sql.Request();
    request.input('courseId', sql.Int, Number(courseId));
    const pathsResult = await request.query(`
        SELECT
            p.PathId,
            p.PathName,
            p.[Order] AS PathOrder,
            qp.Question_Path_Id AS QuestionPathId
        FROM dbo.Paths p
        LEFT JOIN dbo.Question_Bank qb
            ON qb.CourseId = @courseId
        LEFT JOIN dbo.Questions_Path qp
            ON qp.BankId = qb.BankId
           AND qp.PathId = p.PathId
        WHERE p.CourseId = @courseId
        ORDER BY p.[Order], p.PathId
    `);

    const [countRows, lrSectionRows, vocabularyRows] = await Promise.all([
        getActiveQuestionCountsByPath(courseId),
        getActiveListeningReadingSectionCounts(courseId),
        getActiveVocabularySectionCounts(courseId),
    ]);
    const countsByPath = new Map();

    countRows.forEach((row) => {
        const pathKey = String(row.PathId);
        if (!countsByPath.has(pathKey)) {
            countsByPath.set(pathKey, {
                LISTENING: 0,
                READING: 0,
                VOCABULARY: 0,
            });
        }
        const bucket = countsByPath.get(pathKey);
        const skill = normalizeSectionSkillType(row.SkillType, row.TypeId);
        if (skill in bucket) {
            bucket[skill] += Number(row.ActiveCount) || 0;
        }
    });

    const lrGroupsByPath = new Map();
    lrSectionRows.forEach((row) => {
        const pathKey = String(row.PathId);
        if (!lrGroupsByPath.has(pathKey)) {
            lrGroupsByPath.set(pathKey, { LISTENING: [], READING: [] });
        }
        const skill = normalizeSectionSkillType(row.SkillType, row.TypeId);
        const bucket = lrGroupsByPath.get(pathKey);
        if (bucket[skill]) {
            bucket[skill].push(mapSectionGroupRow(row));
        }
    });

    const vocabularyGroupsByPath = new Map();
    vocabularyRows.forEach((row) => {
        const pathKey = String(row.PathId);
        if (!vocabularyGroupsByPath.has(pathKey)) {
            vocabularyGroupsByPath.set(pathKey, []);
        }
        vocabularyGroupsByPath.get(pathKey).push(mapSectionGroupRow(row));
    });

    const chapters = pathsResult.recordset.map((row) => {
        const pathKey = String(row.PathId);
        const questionCountBySkill = countsByPath.get(pathKey) ?? {
            LISTENING: 0,
            READING: 0,
            VOCABULARY: 0,
        };
        const totalActive = Object.values(questionCountBySkill).reduce((sum, count) => sum + count, 0);
        const hasBank = row.QuestionPathId != null || totalActive > 0;
        const lrGroups = lrGroupsByPath.get(pathKey) ?? { LISTENING: [], READING: [] };

        return {
            PathId: row.PathId,
            PathName: row.PathName,
            Order: row.PathOrder,
            hasBank,
            questionCountBySkill,
            listeningSectionGroups: lrGroups.LISTENING,
            readingSectionGroups: lrGroups.READING,
            vocabularySectionGroups: vocabularyGroupsByPath.get(pathKey) ?? [],
            totalActive,
        };
    });

    const bankCount = chapters.filter((chapter) => chapter.hasBank).length;
    const aggregatedSkill = {
        LISTENING: 0,
        READING: 0,
        VOCABULARY: 0,
    };

    chapters.forEach((chapter) => {
        Object.keys(aggregatedSkill).forEach((skill) => {
            aggregatedSkill[skill] += chapter.questionCountBySkill?.[skill] ?? 0;
        });
    });

    const totalActive = Object.values(aggregatedSkill).reduce((sum, count) => sum + count, 0);

    return {
        hasBank: bankCount > 0,
        bankCount,
        chapters,
        questionCountBySkill: aggregatedSkill,
        totalActive,
    };
};

module.exports = {
    getAllListQuestionBankByMentorId,
    getSectionsByPath,
    getQuestionsBySection,
    sectionBelongsToCoursePath,
    getQuestionBankByIdModel,
    getQuestionBankPathsByBankIdModel,
    updateQuestionUseForTestById,
    getChapterQuestionBankActiveStats,
    getCourseQuestionBankActiveStats,
};

