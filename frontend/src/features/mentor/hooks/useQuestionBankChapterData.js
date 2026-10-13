/**
 * =============================================================================
 * useQuestionBankChapterData — Hook tải dữ liệu section/câu hỏi theo chương
 * =============================================================================
 *
 * MỤC ĐÍCH: Tách logic fetch API sections + questions ra khỏi page component.
 *
 * LUỒNG:
 *   1. Khi courseId/chapterId đổi → gọi fetchChapterSections
 *   2. Map API → editor format → setSections + chọn section đầu tiên
 *   3. loadSectionQuestions: lazy-load câu hỏi khi user chọn section (nếu cần)
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from '@/shared/ui/Toast';
import {
  fetchChapterSections,
  fetchSectionQuestions,
} from '@/features/mentor/services/questionBankService';
import {
  mapApiSectionToEditorSection,
  mergeQuestionsIntoSection,
} from '@/features/mentor/utils/questionBankApiMappers';
import {
  TEST_SKILL_LISTENING,
  createQuestionBankSkillSections,
  getSectionsBySkill,
} from '@/features/mentor/utils/mentorTestContentUtils';

export default function useQuestionBankChapterData({
  courseId,
  chapterId,
  setSections,
  setActiveSkill,
  setActiveSectionId,
}) {
  // sectionsLoading: true khi đang tải danh sách section
  const [sectionsLoading, setSectionsLoading] = useState(false);
  // questionsLoading: true khi đang tải câu hỏi của một section
  const [questionsLoading, setQuestionsLoading] = useState(false);
  // loadedSectionIdsRef: cache SectionId đã tải câu hỏi (tránh gọi API trùng)
  const loadedSectionIdsRef = useRef(new Set());
  // loadingSectionIdsRef: SectionId đang trong quá trình tải (tránh double fetch)
  const loadingSectionIdsRef = useRef(new Set());

  // Reset cache khi đổi khóa học hoặc chương
  useEffect(() => {
    loadedSectionIdsRef.current = new Set();
    loadingSectionIdsRef.current = new Set();
  }, [courseId, chapterId]);

  // useEffect: TẢI DANH SÁCH SECTION khi courseId/chapterId thay đổi
  useEffect(() => {
    if (!courseId || !chapterId) {
      setSections(createQuestionBankSkillSections());
      return undefined;
    }

    let cancelled = false;

    const loadSections = async () => {
      setSectionsLoading(true);
      try {
        const result = await fetchChapterSections(courseId, chapterId);
        if (cancelled) return;

        if (!result.ok) {
          toast.error(result.message ?? 'Không tải được danh sách section.');
          setSections(createQuestionBankSkillSections());
          return;
        }

        const mappedSections = (result.sections ?? []).map(mapApiSectionToEditorSection);
        setSections(mappedSections.length > 0 ? mappedSections : createQuestionBankSkillSections());

        // Tự chọn section Listening đầu tiên
        const firstListening = getSectionsBySkill(mappedSections, TEST_SKILL_LISTENING)[0]
          ?? mappedSections[0]
          ?? getSectionsBySkill(createQuestionBankSkillSections(), TEST_SKILL_LISTENING)[0];

        if (firstListening) {
          setActiveSkill(firstListening.SkillType);
          setActiveSectionId(firstListening.tempId);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          toast.error('Không tải được danh sách section.');
          setSections(createQuestionBankSkillSections());
        }
      } finally {
        if (!cancelled) setSectionsLoading(false);
      }
    };

    loadSections();

    return () => {
      cancelled = true;
    };
  }, [courseId, chapterId, setSections, setActiveSkill, setActiveSectionId]);

  // Handler: lazy-load câu hỏi cho một section cụ thể
  // Trigger: khi user chọn section chưa có questionsLoaded
  const loadSectionQuestions = useCallback(
    async (sectionTempId, currentSections = []) => {
      const section = currentSections.find((item) => item.tempId === sectionTempId);
      if (!section?.SectionId) return section;
      if (section.questionsLoaded || loadedSectionIdsRef.current.has(section.SectionId)) {
        return section;
      }
      if (loadingSectionIdsRef.current.has(section.SectionId)) {
        return section;
      }

      loadingSectionIdsRef.current.add(section.SectionId);
      setQuestionsLoading(true);
      setSections((prev) =>
        prev.map((item) =>
          item.tempId === sectionTempId ? { ...item, questionsLoading: true } : item,
        ),
      );

      try {
        const result = await fetchSectionQuestions(section.SectionId, { courseId, pathId: chapterId });
        if (!result.ok) {
          toast.error(result.message ?? 'Không tải được câu hỏi.');
          setSections((prev) =>
            prev.map((item) =>
              item.tempId === sectionTempId ? { ...item, questionsLoading: false } : item,
            ),
          );
          return section;
        }

        loadedSectionIdsRef.current.add(section.SectionId);

        setSections((prev) =>
          prev.map((item) =>
            item.tempId === sectionTempId
              ? mergeQuestionsIntoSection(item, result.questions ?? [])
              : item,
          ),
        );

        return mergeQuestionsIntoSection(section, result.questions ?? []);
      } catch (error) {
        console.error(error);
        toast.error('Không tải được câu hỏi.');
        setSections((prev) =>
          prev.map((item) =>
            item.tempId === sectionTempId ? { ...item, questionsLoading: false } : item,
          ),
        );
        return section;
      } finally {
        loadingSectionIdsRef.current.delete(section.SectionId);
        setQuestionsLoading(false);
      }
    },
    [chapterId, courseId, setSections],
  );

  return {
    sectionsLoading,
    questionsLoading,
    loadSectionQuestions,
  };
}
