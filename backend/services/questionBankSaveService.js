const { sql } = require('../config/db');
const questionBankSaveModel = require('../Models/questionBankSaveModel');
const questionBankModel = require('../Models/questionBankModel');
const { mapSkillTypeToTypeId } = require('../utils/sectionSkillType');

const SECTION_SET_COLUMN_MAP = {
  SectionName: 'SectionName',
  Title: 'Title',
  SourceUrl: 'SourceUrl',
  Order: 'Order',
  IsUseForTest: 'IsUseForTest',
};

const CHOICE_SET_COLUMN_MAP = {
  Title: 'Title',
  Order: 'Order',
  IsTrue: 'IsTrue',
};

const QUESTION_SET_COLUMN_MAP = {
  Title: 'Title',
  IsActive: 'IsActive',
  IsUseForTest: 'IsUseForTest',
};

function normalizeSourceUrl(value) {
  const trimmed = String(value ?? '').trim();
  return trimmed || null;
}

function buildSectionInsertRow(data = {}, questionPathId, typeId) {
  const sectionName = String(data.SectionName ?? '').trim() || 'Section';
  const hasTitle = data.Title !== undefined && data.Title !== null;
  const title = hasTitle ? String(data.Title) : sectionName;

  return {
    Question_Path_Id: questionPathId,
    SectionName: sectionName,
    Title: title,
    TypeId: typeId,
    Order: Number(data.Order) || 1,
    SourceUrl: normalizeSourceUrl(data.SourceUrl),
    IsUseForTest: data.IsUseForTest !== false ? 1 : 0,
  };
}

async function insertSectionRow(transaction, row) {
  const request = new sql.Request(transaction);
  request.input('questionPathId', sql.Int, row.Question_Path_Id);
  request.input('sectionName', sql.NVarChar(200), row.SectionName);
  request.input('title', sql.NVarChar(200), row.Title);
  request.input('typeId', sql.Int, row.TypeId);
  request.input('order', sql.Int, row.Order);
  request.input('sourceUrl', sql.NVarChar(sql.MAX), row.SourceUrl);
  request.input('isUseForTest', sql.Bit, row.IsUseForTest !== false ? 1 : 0);

  const result = await request.query(`
    INSERT INTO dbo.Question_Sections (
      Question_Path_Id, SectionName, Title, TypeId, [Order], SourceUrl, IsUseForTest
    )
    OUTPUT INSERTED.SectionId
    VALUES (
      @questionPathId, @sectionName, @title, @typeId, @order, @sourceUrl, @isUseForTest
    )
  `);
  return result.recordset[0].SectionId;
}

async function updateSectionRow(transaction, sectionId, set = {}) {
  const sanitizedSet = { ...set };
  delete sanitizedSet.sourceUrl;

  const entries = Object.entries(sanitizedSet).filter(([key]) => SECTION_SET_COLUMN_MAP[key]);
  if (entries.length === 0) return;

  const request = new sql.Request(transaction);
  request.input('sectionId', sql.Int, sectionId);

  const assignments = entries.map(([key, value], index) => {
    const column = SECTION_SET_COLUMN_MAP[key];
    const param = `p${index}`;

    if (column === 'Order') {
      request.input(param, sql.Int, Number(value) || 1);
    } else if (column === 'SourceUrl') {
      request.input(param, sql.NVarChar(sql.MAX), normalizeSourceUrl(value));
    } else if (column === 'IsUseForTest') {
      request.input(param, sql.Bit, value ? 1 : 0);
    } else {
      request.input(param, sql.NVarChar(200), value ?? null);
    }

    return `[${column}] = @${param}`;
  });

  await request.query(`
    UPDATE dbo.Question_Sections
    SET ${assignments.join(', ')}
    WHERE SectionId = @sectionId
  `);
}

async function updateSectionSourceUrlRow(transaction, sectionId, sourceUrl) {
  const request = new sql.Request(transaction);
  request.input('sectionId', sql.Int, Number(sectionId));
  request.input('sourceUrl', sql.NVarChar(sql.MAX), normalizeSourceUrl(sourceUrl));
  await request.query(`
    UPDATE dbo.Question_Sections
    SET SourceUrl = @sourceUrl
    WHERE SectionId = @sectionId
  `);
}

async function softDeleteQuestions(transaction, deletes = []) {
  for (const item of deletes) {
    const questionId = Number(item.questionId);
    const sectionId = Number(item.sectionId);
    if (!questionId || !sectionId) continue;

    const belongs = await questionBankSaveModel.questionBelongsToSection(
      questionId,
      sectionId,
      transaction,
    );
    if (!belongs) continue;

    const request = new sql.Request(transaction);
    request.input('questionId', sql.Int, questionId);
    request.input('sectionId', sql.Int, sectionId);
    await request.query(`
      UPDATE dbo.Questions
      SET IsActive = 0
      WHERE QuestionId = @questionId AND SectionId = @sectionId
    `);
  }
}

async function insertQuestionRow(transaction, { sectionId, order, data }) {
  const request = new sql.Request(transaction);
  request.input('sectionId', sql.Int, sectionId);
  request.input('title', sql.NVarChar(sql.MAX), String(data.Title ?? '').trim() || 'Câu hỏi');
  request.input('isActive', sql.Bit, data.IsActive !== false ? 1 : 0);
  request.input('isUseForTest', sql.Bit, data.IsUseForTest !== false ? 1 : 0);
  request.input('order', sql.Int, Number(order) || 1);

  const result = await request.query(`
    INSERT INTO dbo.Questions (
      SectionId, Title, IsActive, IsUseForTest, [Order]
    )
    OUTPUT INSERTED.QuestionId
    VALUES (
      @sectionId, @title, @isActive, @isUseForTest, @order
    )
  `);
  return result.recordset[0].QuestionId;
}

async function insertChoiceRow(transaction, questionId, data = {}) {
  const title = String(data.Title ?? '').trim();
  if (!title) return null;

  const request = new sql.Request(transaction);
  request.input('questionId', sql.Int, Number(questionId));
  request.input('title', sql.NVarChar(250), title);
  request.input('order', sql.Int, Number(data.Order) || 1);
  request.input('isTrue', sql.Bit, data.IsTrue ? 1 : 0);
  const result = await request.query(`
    INSERT INTO dbo.Question_Choices (QuestionId, Title, [Order], IsTrue)
    OUTPUT INSERTED.ChoiceId
    VALUES (@questionId, @title, @order, @isTrue)
  `);
  return result.recordset[0]?.ChoiceId ?? null;
}

async function insertChoices(transaction, questionId, choices = []) {
  const choiceIdMap = [];
  for (const choice of choices) {
    const data = choice.data ?? choice;
    const choiceId = await insertChoiceRow(transaction, questionId, data);
    if (choiceId && choice.clientRef) {
      choiceIdMap.push({ clientRef: choice.clientRef, choiceId });
    }
  }
  return choiceIdMap;
}

async function updateChoiceRow(transaction, choiceId, questionId, set = {}) {
  const parsedChoiceId = Number(choiceId);
  const parsedQuestionId = Number(questionId);
  if (!parsedChoiceId || !parsedQuestionId) return false;

  const belongs = await questionBankSaveModel.choiceBelongsToQuestion(
    parsedChoiceId,
    parsedQuestionId,
    transaction,
  );
  if (!belongs) return false;

  const entries = Object.entries(set).filter(([key]) => CHOICE_SET_COLUMN_MAP[key]);
  if (entries.length === 0) return true;

  const request = new sql.Request(transaction);
  request.input('choiceId', sql.Int, parsedChoiceId);
  request.input('questionId', sql.Int, parsedQuestionId);

  const assignments = entries.map(([key, value], index) => {
    const column = CHOICE_SET_COLUMN_MAP[key];
    const param = `c${index}`;

    if (column === 'Order') {
      request.input(param, sql.Int, Number(value) || 1);
    } else if (column === 'IsTrue') {
      request.input(param, sql.Bit, value ? 1 : 0);
    } else {
      request.input(param, sql.NVarChar(250), String(value ?? '').trim());
    }

    return `[${column}] = @${param}`;
  });

  await request.query(`
    UPDATE dbo.Question_Choices
    SET ${assignments.join(', ')}
    WHERE ChoiceId = @choiceId AND QuestionId = @questionId
  `);
  return true;
}

async function deleteChoiceRow(transaction, choiceId, questionId) {
  const parsedChoiceId = Number(choiceId);
  const parsedQuestionId = Number(questionId);
  if (!parsedChoiceId || !parsedQuestionId) return false;

  const belongs = await questionBankSaveModel.choiceBelongsToQuestion(
    parsedChoiceId,
    parsedQuestionId,
    transaction,
  );
  if (!belongs) return false;

  const request = new sql.Request(transaction);
  request.input('choiceId', sql.Int, parsedChoiceId);
  request.input('questionId', sql.Int, parsedQuestionId);
  await request.query(`
    DELETE FROM dbo.Question_Choices
    WHERE ChoiceId = @choiceId AND QuestionId = @questionId
  `);
  return true;
}

async function updateQuestionRow(transaction, item) {
  const questionId = Number(item.questionId);
  const sectionId = Number(item.sectionId);
  if (!questionId || !sectionId) return;

  const belongs = await questionBankSaveModel.questionBelongsToSection(
    questionId,
    sectionId,
    transaction,
  );
  if (!belongs) return;

  const set = item.set ?? {};
  const entries = Object.entries(set).filter(([key]) => QUESTION_SET_COLUMN_MAP[key]);
  const request = new sql.Request(transaction);
  request.input('questionId', sql.Int, questionId);
  request.input('sectionId', sql.Int, sectionId);

  const sets = [];
  entries.forEach(([key, value], index) => {
    const column = QUESTION_SET_COLUMN_MAP[key];
    const param = `q${index}`;

    if (column === 'IsActive' || column === 'IsUseForTest') {
      request.input(param, sql.Bit, value ? 1 : 0);
    } else if (column === 'Title') {
      request.input(param, sql.NVarChar(sql.MAX), String(value ?? '').trim());
    }

    sets.push(`[${column}] = @${param}`);
  });

  const questionOrder = item.Order ?? item.order;
  if (questionOrder != null) {
    request.input('questionOrder', sql.Int, Number(questionOrder) || 1);
    sets.push('[Order] = @questionOrder');
  }

  if (sets.length > 0) {
    await request.query(`
      UPDATE dbo.Questions
      SET ${sets.join(', ')}
      WHERE QuestionId = @questionId AND SectionId = @sectionId
    `);
  }
}

async function assertSectionAccess(sectionId, courseId, pathId) {
  const allowed = await questionBankModel.sectionBelongsToCoursePath(sectionId, courseId, pathId);
  if (!allowed) {
    const error = new Error('Không tìm thấy section thuộc course/path này.');
    error.statusCode = 404;
    throw error;
  }
}

async function assertQuestionAccess(questionId, sectionId, courseId, pathId) {
  const parsedQuestionId = Number(questionId);
  const parsedSectionId = Number(sectionId);
  if (!parsedQuestionId || !parsedSectionId) {
    const error = new Error('questionId hoặc sectionId không hợp lệ.');
    error.statusCode = 400;
    throw error;
  }

  await assertSectionAccess(parsedSectionId, courseId, pathId);
  const belongs = await questionBankSaveModel.questionBelongsToSection(parsedQuestionId, parsedSectionId);
  if (!belongs) {
    const error = new Error('Không tìm thấy question thuộc section này.');
    error.statusCode = 404;
    throw error;
  }
}

async function updateSectionFields(sectionId, set = {}, { courseId, pathId } = {}) {
  const parsedSectionId = Number(sectionId);
  const parsedCourseId = Number(courseId);
  const parsedPathId = Number(pathId);

  if (!Number.isInteger(parsedSectionId) || parsedSectionId <= 0) {
    const error = new Error('sectionId không hợp lệ.');
    error.statusCode = 400;
    throw error;
  }
  if (!Number.isInteger(parsedCourseId) || parsedCourseId <= 0) {
    const error = new Error('courseId không hợp lệ.');
    error.statusCode = 400;
    throw error;
  }
  if (!Number.isInteger(parsedPathId) || parsedPathId <= 0) {
    const error = new Error('pathId không hợp lệ.');
    error.statusCode = 400;
    throw error;
  }

  await assertSectionAccess(parsedSectionId, parsedCourseId, parsedPathId);

  const transaction = new sql.Transaction();
  await transaction.begin();
  try {
    await updateSectionRow(transaction, parsedSectionId, set);
    await transaction.commit();
    return { sectionId: parsedSectionId };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function updateQuestionFields(
  questionId,
  { sectionId, set = {}, order = null, courseId, pathId } = {},
) {
  await assertQuestionAccess(questionId, sectionId, courseId, pathId);

  const transaction = new sql.Transaction();
  await transaction.begin();
  try {
    await updateQuestionRow(transaction, {
      questionId,
      sectionId,
      set,
      Order: order,
    });
    await transaction.commit();
    return { questionId: Number(questionId), sectionId: Number(sectionId) };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function updateChoiceFields(
  choiceId,
  { questionId, sectionId, set = {}, courseId, pathId } = {},
) {
  await assertQuestionAccess(questionId, sectionId, courseId, pathId);

  const transaction = new sql.Transaction();
  await transaction.begin();
  try {
    const updated = await updateChoiceRow(transaction, choiceId, questionId, set);
    if (!updated) {
      const error = new Error('Không tìm thấy choice để cập nhật.');
      error.statusCode = 404;
      throw error;
    }
    await transaction.commit();
    return { choiceId: Number(choiceId), questionId: Number(questionId) };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function createQuestionChoice(_choiceId, questionId, { sectionId, data = {}, courseId, pathId, clientRef = null } = {}) {
  await assertQuestionAccess(questionId, sectionId, courseId, pathId);

  const transaction = new sql.Transaction();
  await transaction.begin();
  try {
    const newChoiceId = await insertChoiceRow(transaction, questionId, data);
    if (!newChoiceId) {
      const error = new Error('Không thể tạo choice.');
      error.statusCode = 400;
      throw error;
    }
    await transaction.commit();
    return {
      choiceId: newChoiceId,
      questionId: Number(questionId),
      clientRef,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function removeQuestionChoice(choiceId, questionId, { sectionId, courseId, pathId } = {}) {
  await assertQuestionAccess(questionId, sectionId, courseId, pathId);

  const transaction = new sql.Transaction();
  await transaction.begin();
  try {
    const deleted = await deleteChoiceRow(transaction, choiceId, questionId);
    if (!deleted) {
      const error = new Error('Không tìm thấy choice để xóa.');
      error.statusCode = 404;
      throw error;
    }
    await transaction.commit();
    return { choiceId: Number(choiceId), questionId: Number(questionId) };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function createSectionQuestion(
  sectionId,
  { data = {}, order = 1, choices = [], courseId, pathId, clientRef = null } = {},
) {
  const parsedSectionId = Number(sectionId);
  await assertSectionAccess(parsedSectionId, courseId, pathId);

  const transaction = new sql.Transaction();
  await transaction.begin();
  try {
    const questionId = await insertQuestionRow(transaction, {
      sectionId: parsedSectionId,
      order,
      data,
    });
    const choiceIdMap = await insertChoices(transaction, questionId, choices);
    await transaction.commit();
    return {
      sectionId: parsedSectionId,
      questionId,
      clientRef,
      choiceIdMap,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function deactivateQuestion(questionId, sectionId, { courseId, pathId } = {}) {
  await assertQuestionAccess(questionId, sectionId, courseId, pathId);

  const transaction = new sql.Transaction();
  await transaction.begin();
  try {
    await softDeleteQuestions(transaction, [{ questionId, sectionId }]);
    await transaction.commit();
    return { questionId: Number(questionId), sectionId: Number(sectionId) };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function updateExistingSectionPayload(payload) {
  const { context, courseId, pathId } = validateSavePayload(payload);
  const sectionId = Number(context.sectionId);
  if (!sectionId) {
    const error = new Error('Thiếu context.sectionId khi cập nhật section.');
    error.statusCode = 400;
    throw error;
  }

  await assertSectionAccess(sectionId, courseId, pathId);

  let savedSourceUrl = null;
  const transaction = new sql.Transaction();
  await transaction.begin();

  try {
    if (payload.sectionSourceUpdate?.sectionId) {
      savedSourceUrl = normalizeSourceUrl(payload.sectionSourceUpdate.SourceUrl);
      await updateSectionSourceUrlRow(transaction, sectionId, savedSourceUrl);
    }

    if (payload.sectionUpdate?.set) {
      await updateSectionRow(transaction, sectionId, payload.sectionUpdate.set);
    }

    await transaction.commit();
    return {
      sectionId,
      sourceUrl: savedSourceUrl,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

function validateSavePayload(payload) {
  const context = payload?.context ?? {};
  const courseId = Number(context.courseId);
  const pathId = Number(context.pathId);

  if (!Number.isInteger(courseId) || courseId <= 0) {
    const error = new Error('context.courseId không hợp lệ.');
    error.statusCode = 400;
    throw error;
  }
  if (!Number.isInteger(pathId) || pathId <= 0) {
    const error = new Error('context.pathId không hợp lệ.');
    error.statusCode = 400;
    throw error;
  }

  return { context, courseId, pathId };
}

async function saveQuestionBankSectionPayload(payload, { requireExistingSection = false } = {}) {
  if (requireExistingSection) {
    return updateExistingSectionPayload(payload);
  }

  const { context, courseId, pathId } = validateSavePayload(payload);
  let sectionId = context.sectionId != null ? Number(context.sectionId) : null;
  const typeId = mapSkillTypeToTypeId(context.skillType);

  if (sectionId) {
    const error = new Error('Section đã tồn tại, hãy dùng PUT để cập nhật.');
    error.statusCode = 400;
    throw error;
  }

  const questionPathId = await questionBankSaveModel.resolveQuestionPathId({
    courseId,
    pathId,
    questionPathId: context.questionPathId,
  });

  const questionIdMap = [];
  const choiceIdMap = [];
  let savedSourceUrl = null;
  let insertedSectionOrder = null;
  const transaction = new sql.Transaction();
  await transaction.begin();

  try {
    if (payload.sectionInsert?.data) {
      const row = buildSectionInsertRow(payload.sectionInsert.data, questionPathId, typeId);
      row.Order = await questionBankSaveModel.getNextSectionOrder(
        questionPathId,
        typeId,
        transaction,
      );
      insertedSectionOrder = row.Order;
      sectionId = await insertSectionRow(transaction, row);
      savedSourceUrl = row.SourceUrl;

      for (const question of payload.sectionInsert.questions ?? []) {
        const questionId = await insertQuestionRow(transaction, {
          sectionId,
          order: question.Order ?? question.order,
          data: question.data ?? {},
        });
        if (question.clientRef) {
          questionIdMap.push({ clientRef: question.clientRef, questionId });
        }
        const insertedChoices = await insertChoices(transaction, questionId, question.choicesInsert ?? []);
        choiceIdMap.push(...insertedChoices);
      }
    }

    await transaction.commit();
    return {
      sectionId,
      questionPathId,
      questionIdMap,
      choiceIdMap,
      sourceUrl: savedSourceUrl,
      sectionOrder: insertedSectionOrder,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function updateSectionSourceUrl(sectionId, sourceUrl, { courseId, pathId }) {
  const parsedSectionId = Number(sectionId);
  const parsedCourseId = Number(courseId);
  const parsedPathId = Number(pathId);

  if (!Number.isInteger(parsedSectionId) || parsedSectionId <= 0) {
    const error = new Error('sectionId không hợp lệ.');
    error.statusCode = 400;
    throw error;
  }
  if (!Number.isInteger(parsedCourseId) || parsedCourseId <= 0) {
    const error = new Error('courseId không hợp lệ.');
    error.statusCode = 400;
    throw error;
  }
  if (!Number.isInteger(parsedPathId) || parsedPathId <= 0) {
    const error = new Error('pathId không hợp lệ.');
    error.statusCode = 400;
    throw error;
  }

  const allowed = await questionBankModel.sectionBelongsToCoursePath(
    parsedSectionId,
    parsedCourseId,
    parsedPathId,
  );
  if (!allowed) {
    const error = new Error('Không tìm thấy section thuộc course/path này.');
    error.statusCode = 404;
    throw error;
  }

  const normalizedUrl = normalizeSourceUrl(sourceUrl);
  const transaction = new sql.Transaction();
  await transaction.begin();

  try {
    await updateSectionSourceUrlRow(transaction, parsedSectionId, normalizedUrl);
    await transaction.commit();
    return {
      sectionId: parsedSectionId,
      sourceUrl: normalizedUrl,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

module.exports = {
  saveQuestionBankSectionPayload,
  updateExistingSectionPayload,
  updateSectionFields,
  updateSectionSourceUrl,
  updateQuestionFields,
  updateChoiceFields,
  createSectionQuestion,
  createQuestionChoice,
  removeQuestionChoice,
  deactivateQuestion,
};
