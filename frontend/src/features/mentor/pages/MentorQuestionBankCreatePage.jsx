/**
 * =============================================================================
 * MentorQuestionBankCreatePage — Redirect route legacy
 * =============================================================================
 *
 * MỤC ĐÍCH: Chuyển hướng route tạo cũ sang workspace manage mới.
 * ROUTE URL: /mentor/question-banks/create (hoặc tương tự)
 * LUỒNG: Giữ nguyên query string → redirect sang /mentor/question-banks/manage
 *
 * Redirect legacy create route → manage workspace.
 */
import { Navigate, useSearchParams } from 'react-router-dom';

export default function MentorQuestionBankCreatePage() {
  const [searchParams] = useSearchParams();
  // Giữ query params khi redirect (ví dụ ?courseId=3)
  const query = searchParams.toString();

  return (
    <Navigate
      to={query ? `/mentor/question-banks/manage?${query}` : '/mentor/question-banks/manage'}
      replace
    />
  );
}
