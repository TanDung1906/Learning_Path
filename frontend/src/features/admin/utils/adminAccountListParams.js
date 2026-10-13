export const ADMIN_ACCOUNT_LIST_PAGE_SIZE = 10;

export const ADMIN_ACCOUNT_LIST_DEFAULTS = {
  q: '',
  role: 'all',
  status: 'all',
  sort: 'newest',
  page: 1,
};

export function parseAdminAccountListParams(searchParams) {
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1);
  return {
    q: searchParams.get('q') ?? ADMIN_ACCOUNT_LIST_DEFAULTS.q,
    role: searchParams.get('role') ?? ADMIN_ACCOUNT_LIST_DEFAULTS.role,
    status: searchParams.get('status') ?? ADMIN_ACCOUNT_LIST_DEFAULTS.status,
    sort: searchParams.get('sort') ?? ADMIN_ACCOUNT_LIST_DEFAULTS.sort,
    page: Number.isFinite(page) ? page : 1,
  };
}

export function buildAdminAccountListSearchParams(nextState, currentSearchParams) {
  const params = new URLSearchParams(currentSearchParams);

  const setOrDelete = (key, value, defaultValue) => {
    if (value == null || value === '' || value === defaultValue) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  };

  setOrDelete('q', nextState.q, ADMIN_ACCOUNT_LIST_DEFAULTS.q);
  setOrDelete('role', nextState.role, ADMIN_ACCOUNT_LIST_DEFAULTS.role);
  setOrDelete('status', nextState.status, ADMIN_ACCOUNT_LIST_DEFAULTS.status);
  setOrDelete('sort', nextState.sort, ADMIN_ACCOUNT_LIST_DEFAULTS.sort);
  setOrDelete('page', nextState.page, ADMIN_ACCOUNT_LIST_DEFAULTS.page);

  return params;
}

export function resetAdminAccountListParams(currentSearchParams) {
  const params = new URLSearchParams(currentSearchParams);
  ['q', 'role', 'status', 'sort', 'page'].forEach((key) => params.delete(key));
  return params;
}

export function hasActiveAdminAccountFilters(query = {}) {
  return (
    Boolean(query.q?.trim()) ||
    query.role !== ADMIN_ACCOUNT_LIST_DEFAULTS.role ||
    query.status !== ADMIN_ACCOUNT_LIST_DEFAULTS.status ||
    query.sort !== ADMIN_ACCOUNT_LIST_DEFAULTS.sort
  );
}

export function buildAdminAccountActiveChips(filters, options = {}) {
  const {
    roleOptions = [],
    statusOptions = [],
  } = options;
  const chips = [];

  if (filters.q) {
    chips.push({ key: `q:${filters.q}`, type: 'q', value: filters.q, label: `"${filters.q}"` });
  }
  if (filters.role && filters.role !== ADMIN_ACCOUNT_LIST_DEFAULTS.role) {
    chips.push({
      key: `role:${filters.role}`,
      type: 'role',
      value: filters.role,
      label: roleOptions.find((o) => o.value === filters.role)?.label ?? filters.role,
    });
  }
  if (filters.status && filters.status !== ADMIN_ACCOUNT_LIST_DEFAULTS.status) {
    chips.push({
      key: `status:${filters.status}`,
      type: 'status',
      value: filters.status,
      label: statusOptions.find((o) => o.value === filters.status)?.label ?? filters.status,
    });
  }
  return chips;
}

export function paginateAccounts(accounts = [], page = 1, pageSize = ADMIN_ACCOUNT_LIST_PAGE_SIZE) {
  const total = accounts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: accounts.slice(start, start + pageSize),
    page: safePage,
    totalPages,
    total,
  };
}
