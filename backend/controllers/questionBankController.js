const questionBankModel = require('../Models/questionBankModel');
const questionBankSaveService = require('../services/questionBankSaveService');
const questionBankSaveModel = require('../Models/questionBankSaveModel');
const { normalizeSectionSkillType } = require('../utils/sectionSkillType');

function normalizeSkillType(rawName, typeId = null) {
    return normalizeSectionSkillType(rawName, typeId);
}



function groupQuestionsWithChoices(rows = []) {

    const questionMap = new Map();



    rows.forEach((row) => {

        if (!questionMap.has(row.QuestionId)) {

            questionMap.set(row.QuestionId, {

                questionId: row.QuestionId,

                sectionId: row.SectionId,

                title: row.Title,

                typeId: row.TypeId,

                skillType: normalizeSkillType(row.SkillType, row.TypeId),

                sourceUrl: row.SourceUrl ?? null,

                order: row.QuestionOrder,

                isActive: Boolean(row.IsActive),
                isUseForTest: row.IsUseForTest == null ? true : Boolean(row.IsUseForTest),

                choices: [],

            });

        }



        if (row.ChoiceId != null) {

            questionMap.get(row.QuestionId).choices.push({

                choiceId: row.ChoiceId,

                title: row.ChoiceTitle,

                order: row.ChoiceOrder,

                isTrue: Boolean(row.IsTrue),

            });

        }

    });



    return Array.from(questionMap.values()).sort((a, b) => a.order - b.order);

}



const getAllBankOfMentor = async (req, res) => {

    try {
        const userId = Number(req.query.userId);
        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'userId không hợp lệ',
            });
        }
        const listQuestionBanks = await questionBankModel.getAllListQuestionBankByMentorId(userId);
        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách Question Bank thành công',
            questionBanks: listQuestionBanks,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: 'Lỗi questionBankController hàm getAllBankOfMentor',
            questionBanks: [],
        });
    }
};



const getChapterSections = async (req, res) => {

    try {

        const courseId = Number(req.params.courseId);

        const pathId = Number(req.params.pathId);



        if (!Number.isInteger(courseId) || courseId <= 0) {

            return res.status(400).json({ success: false, message: 'courseId không hợp lệ' });

        }

        if (!Number.isInteger(pathId) || pathId <= 0) {

            return res.status(400).json({ success: false, message: 'pathId không hợp lệ' });

        }



        const rows = await questionBankModel.getSectionsByPath(courseId, pathId);

        const questionPathId = rows[0]?.QuestionPathId
            ?? await questionBankSaveModel.findQuestionPathId(courseId, pathId);



        const sections = rows.map((row) => ({

            sectionId: row.SectionId,

            sectionName: row.SectionName,

            displayName: row.Title ?? row.SectionName,

            typeId: row.TypeId,

            skillType: normalizeSkillType(row.SkillType, row.TypeId),

            order: row.SectionOrder,

            questionCount: Number(row.QuestionCount) || 0,

            sourceUrl: row.SourceUrl ?? null,

            isUseForTest: row.IsUseForTest == null ? true : Boolean(row.IsUseForTest),

        }));



        return res.status(200).json({

            success: true,

            message: 'Lấy danh sách section thành công',

            data: {

                courseId,

                pathId,

                questionPathId,

                sections,

            },

        });

    } catch (error) {

        console.error('getChapterSections error:', error.message);

        return res.status(500).json({

            success: false,

            message: 'Lỗi khi lấy danh sách section',

            data: { sections: [] },

        });

    }

};



const getSectionQuestions = async (req, res) => {

    try {
        const sectionId = Number(req.params.sectionId);
        const courseId = Number(req.query.courseId);
        const pathId = Number(req.query.pathId);

        if (!Number.isInteger(sectionId) || sectionId <= 0) {
            return res.status(400).json({ success: false, message: 'sectionId không hợp lệ' });
        }

        if (Number.isInteger(courseId) && courseId > 0 && Number.isInteger(pathId) && pathId > 0) {
            const allowed = await questionBankModel.sectionBelongsToCoursePath(sectionId, courseId, pathId);
            if (!allowed) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy section' });
            }
        }

        const rows = await questionBankModel.getQuestionsBySection(sectionId);
        const questions = groupQuestionsWithChoices(rows);

        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách câu hỏi thành công',
            data: {
                sectionId,
                questions,
            },
        });
    } catch (error) {
        console.error('getSectionQuestions error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy câu hỏi của section',
            data: { questions: [] },
        });
    }
};


// Get question Bank By Id 
const getQuestionBankByIdController = async (req, res) => {
    try {
        const bankId = Number(req.params.bankId)
        if (!bankId) {
            return res.status(400).json(
                {
                    success: false,
                    message: 'Server không nhận được bankId',
                    data: {}
                }
            )
        }

        const result = await questionBankModel.getQuestionBankByIdModel(Number(bankId))
        if (result.length === 0) {
            return res.status(404).json(
                {
                    success: false,
                    message: `Không tìm thấy BankId = ${bankId} trong Database`,
                    data: {}
                }
            )
        }
        //==========SUCCESS=============
        return res.status(200).json(
            {
                success: true,
                message: 'Lấy thông tin Question Bank by Id thành công',
                data: result[0]
            }
        )
    } catch (error) {
        console.error(error.message);
        return res.status(500).json(
            {
                success: false,
                message: `Lỗi server khi lấy thông tin của Question Bank Id=${bankId}`,
                data: {}
            }
        )
    }
}

// Route getQuestionBankPathsByBankId
const getQuestionBankPathsByBankIdController = async (req, res) => {
    try {
        const bankId = Number(req.params.bankId)
        if (!bankId) {
            return res.status(400).json(
                {
                    success: false,
                    message: 'Server không nhận được bankId',
                    data: {}
                }
            )
        }

        const result = await questionBankModel.getQuestionBankPathsByBankIdModel(Number(bankId))
        if (result.length === 0) {
            return res.status(404).json(
                {
                    success: false,
                    message: `Không tìm thấy BankId = ${bankId} trong Database`,
                    data: {}
                }
            )
        }
        //==========SUCCESS=============
        return res.status(200).json(
            {
                success: true,
                message: 'Lấy thông tin Question Bank by Id thành công',
                data: result[0]
            }
        )
    } catch (error) {
        console.error(error.message);
        return res.status(500).json(
            {
                success: false,
                message: `Lỗi server khi lấy thông tin của Question Bank Id=${bankId}`,
                data: {}
            }
        )
    }
}


const ensureQuestionPath = async (req, res) => {
    try {
        const courseId = Number(req.params.courseId);
        const pathId = Number(req.params.pathId);

        if (!Number.isInteger(courseId) || courseId <= 0) {
            return res.status(400).json({ success: false, message: 'courseId không hợp lệ' });
        }
        if (!Number.isInteger(pathId) || pathId <= 0) {
            return res.status(400).json({ success: false, message: 'pathId không hợp lệ' });
        }

        const existing = await questionBankSaveModel.findQuestionPathId(courseId, pathId);
        const questionPathId = existing
            ?? await questionBankSaveModel.ensureQuestionPathForCourseChapter(courseId, pathId);

        return res.status(existing ? 200 : 201).json({
            success: true,
            message: existing
                ? 'Questions_Path đã tồn tại'
                : 'Đã tạo Questions_Path cho chương',
            data: {
                courseId,
                pathId,
                questionPathId,
                created: !existing,
            },
        });
    } catch (error) {
        console.error('ensureQuestionPath error:', error.message);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Không thể kiểm tra Questions_Path',
        });
    }
};

const createSectionSave = async (req, res) => {
    try {
        const courseId = Number(req.params.courseId);
        const pathId = Number(req.params.pathId);
        const payload = req.body ?? {};

        if (!Number.isInteger(courseId) || courseId <= 0) {
            return res.status(400).json({ success: false, message: 'courseId không hợp lệ' });
        }
        if (!Number.isInteger(pathId) || pathId <= 0) {
            return res.status(400).json({ success: false, message: 'pathId không hợp lệ' });
        }

        payload.context = {
            ...(payload.context ?? {}),
            courseId,
            pathId,
            sectionId: null,
        };

        const result = await questionBankSaveService.saveQuestionBankSectionPayload(payload, {
            requireExistingSection: false,
        });

        return res.status(201).json({
            success: true,
            message: 'Đã tạo section thành công',
            data: {
                sectionId: result.sectionId,
                questionPathId: result.questionPathId,
                questionIdMap: result.questionIdMap,
                choiceIdMap: result.choiceIdMap ?? [],
                sourceUrl: result.sourceUrl ?? null,
                sectionOrder: result.sectionOrder ?? null,
            },
        });
    } catch (error) {
        console.error('createSectionSave error:', error.message);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Lỗi khi tạo section',
        });
    }
};

const updateSectionSave = async (req, res) => {
    try {
        const sectionId = Number(req.params.sectionId);
        const payload = req.body ?? {};

        if (!Number.isInteger(sectionId) || sectionId <= 0) {
            return res.status(400).json({ success: false, message: 'sectionId không hợp lệ' });
        }

        payload.context = {
            ...(payload.context ?? {}),
            sectionId,
        };

        const result = await questionBankSaveService.saveQuestionBankSectionPayload(payload, {
            requireExistingSection: true,
        });

        return res.status(200).json({
            success: true,
            message: 'Đã cập nhật section thành công',
            data: {
                sectionId: result.sectionId,
                questionPathId: result.questionPathId,
                questionIdMap: result.questionIdMap,
                sourceUrl: result.sourceUrl ?? null,
            },
        });
    } catch (error) {
        console.error('updateSectionSave error:', error.message);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Lỗi khi cập nhật section',
        });
    }
};

const patchSectionSourceUrl = async (req, res) => {
    try {
        const sectionId = Number(req.params.sectionId);
        const courseId = Number(req.body?.courseId ?? req.query.courseId);
        const pathId = Number(req.body?.pathId ?? req.query.pathId);
        const sourceUrl = req.body?.sourceUrl ?? null;

        if (!Number.isInteger(sectionId) || sectionId <= 0) {
            return res.status(400).json({ success: false, message: 'sectionId không hợp lệ' });
        }
        if (!Number.isInteger(courseId) || courseId <= 0) {
            return res.status(400).json({ success: false, message: 'courseId không hợp lệ' });
        }
        if (!Number.isInteger(pathId) || pathId <= 0) {
            return res.status(400).json({ success: false, message: 'pathId không hợp lệ' });
        }

        const result = await questionBankSaveService.updateSectionSourceUrl(sectionId, sourceUrl, {
            courseId,
            pathId,
        });

        return res.status(200).json({
            success: true,
            message: 'Đã cập nhật URL đề bài',
            data: {
                sectionId: result.sectionId,
                sourceUrl: result.sourceUrl,
            },
        });
    } catch (error) {
        console.error('patchSectionSourceUrl error:', error.message);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Lỗi khi cập nhật URL section',
        });
    }
};

const patchQuestionUseForTest = async (req, res) => {
    try {
        const questionId = Number(req.params.questionId);
        const isUseForTest = req.body?.isUseForTest;

        if (!Number.isInteger(questionId) || questionId <= 0) {
            return res.status(400).json({ success: false, message: 'questionId không hợp lệ' });
        }
        if (typeof isUseForTest !== 'boolean') {
            return res.status(400).json({ success: false, message: 'isUseForTest phải là boolean' });
        }

        const updated = await questionBankModel.updateQuestionUseForTestById(questionId, isUseForTest);
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy question để cập nhật',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Đã cập nhật trạng thái dùng trong bài kiểm tra',
            data: {
                questionId,
                isUseForTest,
            },
        });
    } catch (error) {
        console.error('patchQuestionUseForTest error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật trạng thái question',
        });
    }
};

const updateQuestionById = async (req, res) => {
    try {
        const questionId = Number(req.params.questionId);
        const body = req.body ?? {};
        const sectionId = Number(body.sectionId);
        const courseId = Number(body.courseId ?? body.context?.courseId);
        const pathId = Number(body.pathId ?? body.context?.pathId);

        if (!Number.isInteger(questionId) || questionId <= 0) {
            return res.status(400).json({ success: false, message: 'questionId không hợp lệ' });
        }

        const result = await questionBankSaveService.updateQuestionFields(questionId, {
            sectionId,
            set: body.set ?? {},
            order: body.order ?? body.Order ?? null,
            courseId,
            pathId,
        });

        return res.status(200).json({
            success: true,
            message: 'Đã cập nhật question thành công',
            data: result,
        });
    } catch (error) {
        console.error('updateQuestionById error:', error.message);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Lỗi khi cập nhật question',
        });
    }
};

const deactivateQuestionById = async (req, res) => {
    try {
        const questionId = Number(req.params.questionId);
        const sectionId = Number(req.body?.sectionId);
        const courseId = Number(req.body?.courseId ?? req.body?.context?.courseId);
        const pathId = Number(req.body?.pathId ?? req.body?.context?.pathId);

        if (!Number.isInteger(questionId) || questionId <= 0) {
            return res.status(400).json({ success: false, message: 'questionId không hợp lệ' });
        }

        const result = await questionBankSaveService.deactivateQuestion(questionId, sectionId, {
            courseId,
            pathId,
        });

        return res.status(200).json({
            success: true,
            message: 'Đã xóa question thành công',
            data: result,
        });
    } catch (error) {
        console.error('deactivateQuestionById error:', error.message);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Lỗi khi xóa question',
        });
    }
};

const createSectionQuestionById = async (req, res) => {
    try {
        const sectionId = Number(req.params.sectionId);
        const body = req.body ?? {};
        const courseId = Number(body.courseId ?? body.context?.courseId);
        const pathId = Number(body.pathId ?? body.context?.pathId);

        if (!Number.isInteger(sectionId) || sectionId <= 0) {
            return res.status(400).json({ success: false, message: 'sectionId không hợp lệ' });
        }

        const result = await questionBankSaveService.createSectionQuestion(sectionId, {
            data: body.data ?? {},
            order: body.order ?? body.Order ?? 1,
            choices: body.choicesInsert ?? body.choices ?? [],
            courseId,
            pathId,
            clientRef: body.clientRef ?? null,
        });

        return res.status(201).json({
            success: true,
            message: 'Đã tạo question thành công',
            data: result,
        });
    } catch (error) {
        console.error('createSectionQuestionById error:', error.message);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Lỗi khi tạo question',
        });
    }
};

const updateChoiceById = async (req, res) => {
    try {
        const choiceId = Number(req.params.choiceId);
        const body = req.body ?? {};
        const questionId = Number(body.questionId);
        const sectionId = Number(body.sectionId);
        const courseId = Number(body.courseId ?? body.context?.courseId);
        const pathId = Number(body.pathId ?? body.context?.pathId);

        if (!Number.isInteger(choiceId) || choiceId <= 0) {
            return res.status(400).json({ success: false, message: 'choiceId không hợp lệ' });
        }

        const result = await questionBankSaveService.updateChoiceFields(choiceId, {
            questionId,
            sectionId,
            set: body.set ?? {},
            courseId,
            pathId,
        });

        return res.status(200).json({
            success: true,
            message: 'Đã cập nhật choice thành công',
            data: result,
        });
    } catch (error) {
        console.error('updateChoiceById error:', error.message);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Lỗi khi cập nhật choice',
        });
    }
};

const createQuestionChoiceById = async (req, res) => {
    try {
        const questionId = Number(req.params.questionId);
        const body = req.body ?? {};
        const sectionId = Number(body.sectionId);
        const courseId = Number(body.courseId ?? body.context?.courseId);
        const pathId = Number(body.pathId ?? body.context?.pathId);

        if (!Number.isInteger(questionId) || questionId <= 0) {
            return res.status(400).json({ success: false, message: 'questionId không hợp lệ' });
        }

        const result = await questionBankSaveService.createQuestionChoice(null, questionId, {
            sectionId,
            data: body.data ?? {},
            courseId,
            pathId,
            clientRef: body.clientRef ?? null,
        });

        return res.status(201).json({
            success: true,
            message: 'Đã tạo choice thành công',
            data: result,
        });
    } catch (error) {
        console.error('createQuestionChoiceById error:', error.message);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Lỗi khi tạo choice',
        });
    }
};

const deleteChoiceById = async (req, res) => {
    try {
        const choiceId = Number(req.params.choiceId);
        const questionId = Number(req.body?.questionId);
        const sectionId = Number(req.body?.sectionId);
        const courseId = Number(req.body?.courseId ?? req.body?.context?.courseId);
        const pathId = Number(req.body?.pathId ?? req.body?.context?.pathId);

        if (!Number.isInteger(choiceId) || choiceId <= 0) {
            return res.status(400).json({ success: false, message: 'choiceId không hợp lệ' });
        }

        const result = await questionBankSaveService.removeQuestionChoice(choiceId, questionId, {
            sectionId,
            courseId,
            pathId,
        });

        return res.status(200).json({
            success: true,
            message: 'Đã xóa choice thành công',
            data: result,
        });
    } catch (error) {
        console.error('deleteChoiceById error:', error.message);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Lỗi khi xóa choice',
        });
    }
};

const getChapterQuestionBankActiveStatsController = async (req, res) => {
    try {
        const courseId = Number(req.params.courseId);
        const pathId = Number(req.params.pathId);

        if (!Number.isInteger(courseId) || courseId <= 0) {
            return res.status(400).json({ success: false, message: 'courseId không hợp lệ' });
        }
        if (!Number.isInteger(pathId) || pathId <= 0) {
            return res.status(400).json({ success: false, message: 'pathId không hợp lệ' });
        }

        const stats = await questionBankModel.getChapterQuestionBankActiveStats(courseId, pathId);

        return res.status(200).json({
            success: true,
            message: 'Lấy thống kê ngân hàng câu hỏi thành công',
            data: stats,
        });
    } catch (error) {
        console.error('getChapterQuestionBankActiveStatsController error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Không thể lấy thống kê ngân hàng câu hỏi',
        });
    }
};

const getCourseQuestionBankActiveStatsController = async (req, res) => {
    try {
        const courseId = Number(req.params.courseId);

        if (!Number.isInteger(courseId) || courseId <= 0) {
            return res.status(400).json({ success: false, message: 'courseId không hợp lệ' });
        }

        const stats = await questionBankModel.getCourseQuestionBankActiveStats(courseId);

        return res.status(200).json({
            success: true,
            message: 'Lấy thống kê ngân hàng câu hỏi toàn khóa thành công',
            data: stats,
        });
    } catch (error) {
        console.error('getCourseQuestionBankActiveStatsController error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Không thể lấy thống kê ngân hàng câu hỏi toàn khóa',
        });
    }
};

module.exports = {
    getAllBankOfMentor,
    getChapterSections,
    getSectionQuestions,
    getQuestionBankByIdController,
    getQuestionBankPathsByBankIdController,
    ensureQuestionPath,
    createSectionSave,
    updateSectionSave,
    patchSectionSourceUrl,
    patchQuestionUseForTest,
    updateQuestionById,
    deactivateQuestionById,
    createSectionQuestionById,
    updateChoiceById,
    createQuestionChoiceById,
    deleteChoiceById,
    getChapterQuestionBankActiveStatsController,
    getCourseQuestionBankActiveStatsController,
};

