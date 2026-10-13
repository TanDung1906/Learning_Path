import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import AppButton from '@/shared/ui/AppButton';
import AppPagination from '@/shared/ui/AppPagination';
import ConfirmDialog from '@/shared/ui/ConfirmDialog';
import { toast } from '@/shared/ui/Toast';
import AdminNewsToolbar from '@/features/admin/components/AdminNewsToolbar';
import AdminNewsList from '@/features/admin/components/AdminNewsList';
import AdminNewsEditDialog from '@/features/admin/components/AdminNewsEditDialog';
import { clearAdminNewsEditDraft } from '@/features/admin/utils/adminNewsEditStorage';
import {
  deleteNewsArticle,
  getNewsArticles,
} from '@/features/admin/services/adminNewsService';
import {
  ADMIN_NEWS_STATUS_OPTIONS,
} from '@/features/admin/data/adminNewsMock';
import { buildAdminNewsCategoryFilterOptions } from '@/features/admin/utils/adminNewsUtils';
import {
  ADMIN_NEWS_LIST_DEFAULTS,
  ADMIN_NEWS_LIST_PAGE_SIZE,
  buildAdminNewsActiveChips,
  buildAdminNewsListSearchParams,
  hasActiveAdminNewsFilters,
  parseAdminNewsListParams,
  resetAdminNewsListParams,
} from '@/features/admin/utils/adminNewsListParams';
import { TEXT, MUTED } from '@/features/mentor/components/course/mentorCourseCreateStyles';

const PAGE_SIZE = ADMIN_NEWS_LIST_PAGE_SIZE;

export default function AdminNewsManagementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [editArticleId, setEditArticleId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const queryState = useMemo(
    () => parseAdminNewsListParams(searchParams),
    [searchParams],
  );

  const categoryOptions = useMemo(() => buildAdminNewsCategoryFilterOptions(), []);

  const showReset = hasActiveAdminNewsFilters(queryState);
  const isFiltered = showReset || Boolean(queryState.q?.trim());

  const activeFilterChips = useMemo(
    () =>
      buildAdminNewsActiveChips(queryState, {
        categoryOptions,
        statusOptions: ADMIN_NEWS_STATUS_OPTIONS,
      }),
    [queryState, categoryOptions],
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const loadArticles = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const res = await getNewsArticles({
        status: queryState.status !== 'all' ? queryState.status : 'all',
        categoryId: queryState.category !== 'all' ? queryState.category : undefined,
        search: queryState.q || undefined,
        page: queryState.page,
        pageSize: PAGE_SIZE,
        sort: queryState.sort,
      });
      if (res.ok) {
        setArticles(res.articles ?? []);
        setTotal(res.total ?? 0);
      } else {
        setArticles([]);
        setTotal(0);
        setLoadError(true);
      }
    } catch {
      setArticles([]);
      setTotal(0);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [
    queryState.status,
    queryState.category,
    queryState.q,
    queryState.page,
    queryState.sort,
  ]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  useEffect(() => {
    const reopenId = location.state?.reopenEditArticleId;
    if (reopenId == null) return;

    setEditArticleId(reopenId);
    navigate(
      { pathname: location.pathname, search: location.search },
      { replace: true, state: null },
    );
  }, [location.pathname, location.search, location.state, navigate]);

  const updateQuery = (patch) => {
    setSearchParams(
      buildAdminNewsListSearchParams({ ...queryState, ...patch }, searchParams),
      { replace: true },
    );
  };

  const handleCategoryChange = (value) => updateQuery({ category: value, page: 1 });
  const handleStatusChange = (value) => updateQuery({ status: value, page: 1 });
  const handleSortChange = (value) => updateQuery({ sort: value, page: 1 });
  const handlePageChange = (page) => {
    updateQuery({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleReset = () =>
    setSearchParams(resetAdminNewsListParams(searchParams), { replace: true });
  const handleRemoveChip = ({ type }) => {
    const defaults = {
      q: '',
      category: ADMIN_NEWS_LIST_DEFAULTS.category,
      status: ADMIN_NEWS_LIST_DEFAULTS.status,
    };
    if (type in defaults) updateQuery({ [type]: defaults[type], page: 1 });
  };

  const handleCreateClick = () => {
    navigate('/admin/news/create');
  };

  const handleEditClick = (article) => {
    clearAdminNewsEditDraft();
    setEditArticleId(article.id);
  };

  const handleEditDialogClose = () => {
    setEditArticleId(null);
  };

  const handleEditSaved = () => {
    loadArticles();
  };

  const handleDeleteClick = (article) => {
    setDeleteTarget(article);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.id) return;
    setDeleting(true);
    try {
      const res = await deleteNewsArticle(deleteTarget.id);
      if (!res.ok) {
        toast.error(res.message ?? 'Không thể xóa bài viết');
        return;
      }
      toast.success('Đã xóa bài viết');
      setDeleteTarget(null);
      if (editArticleId === deleteTarget.id) {
        setEditArticleId(null);
        clearAdminNewsEditDraft();
      }
      // Nếu xóa hết trang hiện tại, lùi 1 trang
      if (articles.length <= 1 && queryState.page > 1) {
        updateQuery({ page: queryState.page - 1 });
      } else {
        loadArticles();
      }
    } catch {
      toast.error('Không thể xóa bài viết');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1280, mx: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1.5, sm: 2 },
          mb: 2.5,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: { xs: 22, sm: 24 }, fontWeight: 700, color: TEXT, lineHeight: 1.3 }}>
            Quản lý tin tức
          </Typography>
          <Typography sx={{ fontSize: 14, color: MUTED, mt: 0.5, lineHeight: 1.55, maxWidth: 560 }}>
            Quản lý tin tức hiển thị trên trang chủ.
          </Typography>
        </Box>

        <AppButton
          startIcon={<AddRoundedIcon />}
          onClick={handleCreateClick}
          sx={{
            height: 44,
            px: 2.5,
            fontSize: 14,
            fontWeight: 700,
            borderRadius: '999px',
            bgcolor: '#0891B2',
            color: '#fff',
            flexShrink: 0,
            width: { xs: '100%', sm: 'auto' },
            boxShadow: 'none',
            '&:hover': { bgcolor: '#0E7490', boxShadow: 'none' },
          }}
        >
          Thêm tin
        </AppButton>
      </Box>

      <AdminNewsToolbar
        categoryFilter={queryState.category}
        onCategoryChange={handleCategoryChange}
        categoryOptions={categoryOptions}
        statusFilter={queryState.status}
        onStatusChange={handleStatusChange}
        sortBy={queryState.sort}
        onSortChange={handleSortChange}
        showReset={showReset}
        onReset={handleReset}
        totalCount={total}
        activeFilterChips={activeFilterChips}
        onRemoveFilterChip={handleRemoveChip}
      />

      <AdminNewsList
        articles={articles}
        loading={loading}
        error={loadError}
        isFiltered={isFiltered}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onClearFilters={handleReset}
      />

      {totalPages > 1 ? (
        <AppPagination
          page={queryState.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      ) : null}

      <AdminNewsEditDialog
        open={editArticleId != null}
        articleId={editArticleId}
        onClose={handleEditDialogClose}
        onSaved={handleEditSaved}
      />

      <ConfirmDialog
        open={deleteTarget != null}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        destructive
        title="Xóa bài viết?"
        message={`Bài viết "${deleteTarget?.title ?? ''}" sẽ bị xóa vĩnh viễn và không thể khôi phục.`}
        confirmLabel="Xóa bài viết"
        cancelLabel="Hủy"
      />
    </Box>
  );
}
