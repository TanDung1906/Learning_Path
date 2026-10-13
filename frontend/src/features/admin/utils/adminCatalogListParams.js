import { ADMIN_CATALOG_LIST_PAGE_SIZE } from '@/features/admin/data/adminCatalogConstants';

export function createCatalogListParams(defaults) {
  return {
    PAGE_SIZE: ADMIN_CATALOG_LIST_PAGE_SIZE,
    DEFAULTS: defaults,

    parse(searchParams) {
      const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1);
      return {
        q: searchParams.get('q') ?? defaults.q,
        status: searchParams.get('status') ?? defaults.status,
        sort: searchParams.get('sort') ?? defaults.sort,
        page: Number.isFinite(page) ? page : 1,
      };
    },

    build(nextState, currentSearchParams) {
      const params = new URLSearchParams(currentSearchParams);
      const setOrDelete = (key, value, defaultValue) => {
        if (value == null || value === '' || value === defaultValue) params.delete(key);
        else params.set(key, String(value));
      };
      setOrDelete('q', nextState.q, defaults.q);
      setOrDelete('status', nextState.status, defaults.status);
      setOrDelete('sort', nextState.sort, defaults.sort);
      setOrDelete('page', nextState.page, defaults.page);
      return params;
    },

    reset(currentSearchParams) {
      const params = new URLSearchParams(currentSearchParams);
      ['q', 'status', 'sort', 'page'].forEach((key) => params.delete(key));
      return params;
    },

    hasActiveFilters(query = {}) {
      return (
        Boolean(query.q?.trim()) ||
        query.status !== defaults.status ||
        query.sort !== defaults.sort
      );
    },

    buildActiveChips(filters, statusOptions = []) {
      const chips = [];
      if (filters.q) {
        chips.push({ key: `q:${filters.q}`, type: 'q', value: filters.q, label: `"${filters.q}"` });
      }
      if (filters.status && filters.status !== defaults.status) {
        chips.push({
          key: `status:${filters.status}`,
          type: 'status',
          value: filters.status,
          label: statusOptions.find((o) => o.value === filters.status)?.label ?? filters.status,
        });
      }
      return chips;
    },

    paginate(items = [], page = 1, pageSize = ADMIN_CATALOG_LIST_PAGE_SIZE) {
      const total = items.length;
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      const safePage = Math.min(Math.max(1, page), totalPages);
      const start = (safePage - 1) * pageSize;
      return { items: items.slice(start, start + pageSize), page: safePage, totalPages, total };
    },
  };
}
