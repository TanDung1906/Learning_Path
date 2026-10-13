/**
 * =============================================================================
 * useQuestionBankEditorUi — Hook quản lý UI state editor question bank (local)
 * =============================================================================
 *
 * MỤC ĐÍCH: Quản lý state UI cục bộ cho editor (không gọi API).
 * Dùng trong DetailPage legacy hoặc demo mode.
 *
 * LUỒNG:
 *   1. Khởi tạo sections mặc định (3 kỹ năng)
 *   2. User chọn skill/section → cập nhật activeSkill, activeSectionId
 *   3. User sửa section → handleSectionChange cập nhật mảng sections
 */
import { useEffect, useMemo, useState } from 'react';
import {
  TEST_SKILL_LISTENING,
  createQuestionBankSkillSections,
  getSectionBaiNumber,
  getSectionsBySkill,
  scrollToQuestionBankItem,
  createQuestionBankSection,
} from '@/features/mentor/utils/mentorTestContentUtils';

export default function useQuestionBankEditorUi({ resetKey } = {}) {
  // sections: mảng tất cả section (state trung tâm của editor local)
  const [sections, setSections] = useState(() => createQuestionBankSkillSections());
  // sectionErrors: lỗi validate theo tempId
  const [sectionErrors, setSectionErrors] = useState({});
  // activeSkill: kỹ năng đang chọn (LISTENING | READING | VOCABULARY)
  const [activeSkill, setActiveSkill] = useState(TEST_SKILL_LISTENING);
  // activeSectionId: tempId section đang được chỉnh sửa
  const [activeSectionId, setActiveSectionId] = useState('');

  // useEffect: RESET editor khi resetKey thay đổi (đổi chương)
  useEffect(() => {
    if (resetKey == null || resetKey === '') return;

    setSectionErrors({});
    setActiveSkill(TEST_SKILL_LISTENING);
    setActiveSectionId('');
  }, [resetKey]);

  // Danh sách section thuộc kỹ năng đang chọn
  const skillSections = useMemo(
    () => getSectionsBySkill(sections, activeSkill),
    [sections, activeSkill],
  );

  // Section đang active
  const activeSection = useMemo(() => {
    if (activeSectionId) {
      const found = sections.find((section) => section.tempId === activeSectionId);
      if (found?.SkillType === activeSkill) return found;
    }
    return skillSections[0] ?? null;
  }, [sections, activeSkill, activeSectionId, skillSections]);

  const activeSectionIndex = useMemo(() => {
    if (!activeSection) return 0;
    return getSectionBaiNumber(activeSection, sections) - 1;
  }, [activeSection, sections]);

  // Tự chọn section đầu tiên nếu chưa có activeSection
  useEffect(() => {
    if (!activeSection && skillSections[0]) {
      setActiveSectionId(skillSections[0].tempId);
    }
  }, [activeSection, skillSections]);

  // Handler: cập nhật nội dung một section trong mảng
  const handleSectionChange = (tempId, nextSection) => {
    setSections((prev) => prev.map((s) => (s.tempId === tempId ? nextSection : s)));
    if (sectionErrors[tempId]) {
      setSectionErrors((prev) => ({ ...prev, [tempId]: undefined }));
    }
  };

  // Handler: chọn kỹ năng — tạo section mới nếu kỹ năng chưa có section nào
  const handleSkillSelect = (skill) => {
    setActiveSkill(skill);
    const existing = getSectionsBySkill(sections, skill);
    if (existing[0]) {
      setActiveSectionId(existing[0].tempId);
      return;
    }

    const newSection = createQuestionBankSection(skill);
    setSections((prev) => [...prev, newSection]);
    setActiveSectionId(newSection.tempId);
  };

  // Handler: chọn section theo tempId
  const handleSectionSelect = (tempId) => {
    if (!tempId) return;
    const section = sections.find((item) => item.tempId === tempId);
    if (!section) return;
    setActiveSkill(section.SkillType);
    setActiveSectionId(tempId);
  };

  // Handler: thêm bài/nhóm mới cho kỹ năng hiện tại
  const handleAddBai = () => {
    const newSection = createQuestionBankSection(activeSkill);
    setSections((prev) => [...prev, newSection]);
    setActiveSectionId(newSection.tempId);
  };

  // Handler: điều hướng từ mục lục (outline) → scroll tới skill/section/câu hỏi
  const handleOutlineNavigate = (target) => {
    if (target.sectionTempId) {
      const section = sections.find((item) => item.tempId === target.sectionTempId);
      if (section) {
        setActiveSkill(section.SkillType);
        setActiveSectionId(target.sectionTempId);
      }
    } else if (target.skill) {
      handleSkillSelect(target.skill);
    }
    scrollToQuestionBankItem(target);
  };

  return {
    sections,
    setSections,
    sectionErrors,
    setSectionErrors,
    activeSkill,
    setActiveSkill,
    activeSectionId,
    setActiveSectionId,
    skillSections,
    activeSection,
    activeSectionIndex,
    handleSectionChange,
    handleSkillSelect,
    handleSectionSelect,
    handleAddBai,
    handleOutlineNavigate,
  };
}
