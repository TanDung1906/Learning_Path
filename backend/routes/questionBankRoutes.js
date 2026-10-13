
const express = require('express');
const questionBankRoutes = express.Router();

const {
    getAllBankOfMentor,
    getChapterSections,
    getSectionQuestions,
    getQuestionBankByIdController,
    getQuestionBankPathsByBankIdController,
    createSectionSave,
    ensureQuestionPath,
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
} = require('../controllers/questionBankController');


const optionalAuth = (req, res, next) => {
    const userId = req.headers['x-user-id'] || req.query.userId;

    if (userId) {
        req.user = {
            userId: Number(userId),
        };
    }

    next();
};
questionBankRoutes.get('/getBankPaths/:bankId', optionalAuth, getQuestionBankPathsByBankIdController)
questionBankRoutes.get('/getBankById/:bankId', optionalAuth, getQuestionBankByIdController);
questionBankRoutes.get('/getAllBankOfMentor', optionalAuth, getAllBankOfMentor);
questionBankRoutes.get('/courses/:courseId/paths/:pathId/sections', optionalAuth, getChapterSections);
questionBankRoutes.get('/courses/:courseId/paths/:pathId/active-stats', optionalAuth, getChapterQuestionBankActiveStatsController);
questionBankRoutes.get('/courses/:courseId/active-stats', optionalAuth, getCourseQuestionBankActiveStatsController);
questionBankRoutes.post('/courses/:courseId/paths/:pathId/question-path/ensure', optionalAuth, ensureQuestionPath);
questionBankRoutes.post('/courses/:courseId/paths/:pathId/sections', optionalAuth, createSectionSave);
questionBankRoutes.get('/sections/:sectionId/questions', optionalAuth, getSectionQuestions);
questionBankRoutes.post('/sections/:sectionId/questions', optionalAuth, createSectionQuestionById);
questionBankRoutes.put('/sections/:sectionId', optionalAuth, updateSectionSave);
questionBankRoutes.patch('/sections/:sectionId/source-url', optionalAuth, patchSectionSourceUrl);
questionBankRoutes.put('/questions/:questionId', optionalAuth, updateQuestionById);
questionBankRoutes.delete('/questions/:questionId', optionalAuth, deactivateQuestionById);
questionBankRoutes.patch('/questions/:questionId/use-for-test', optionalAuth, patchQuestionUseForTest);
questionBankRoutes.put('/choices/:choiceId', optionalAuth, updateChoiceById);
questionBankRoutes.post('/questions/:questionId/choices', optionalAuth, createQuestionChoiceById);
questionBankRoutes.delete('/choices/:choiceId', optionalAuth, deleteChoiceById);

module.exports = questionBankRoutes;