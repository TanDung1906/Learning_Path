import { useEffect, useState } from "react";
import { Box, IconButton, Input, Typography, alpha } from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

const PRIMARY = "#0891B2";
const TEXT = "#0F172A";
const MUTED = "#64748B";
const ITEM_GAP = "12px";

// Nguong mac dinh: 10 trang dau/cuoi, 2 trang lien ke o giua
const WINDOW_SIZE = 10;
const JUMP_INPUT_SIBLINGS = 2;

const PAGINATION_MODE = {
  ALL_PAGES: "allPages",
  FIRST_WINDOW: "firstWindow",
  JUMP_INPUT_WINDOW: "jumpInputWindow",
  LAST_WINDOW: "lastWindow",
};

function range(start, end) {
  const pages = [];
  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }
  return pages;
}

function compactItems(items) {
  return items.filter((item) => item !== null);
}

/** Hien thi tat ca trang khi totalPages <= 10 */
function buildAllPages(totalPages) {
  return range(1, totalPages);
}

/** Vung dau: 1..10 ... totalPages */
function buildFirstWindow(totalPages) {
  return [
    ...range(1, Math.min(WINDOW_SIZE, totalPages - 1)),
    "ellipsis",
    totalPages,
  ];
}

/** Vung giua: 1 ... p-2 p-1 [page] p+1 p+2 ... totalPages */
function buildJumpInputWindow(page, totalPages) {
  const pagesBeforeCurrent = range(page - JUMP_INPUT_SIBLINGS, page - 1).filter(
    (pageNumber) => pageNumber > 1
  );
  const pagesAfterCurrent = range(page + 1, page + JUMP_INPUT_SIBLINGS).filter(
    (pageNumber) => pageNumber < totalPages
  );

  const showLeadingEllipsis =
    pagesBeforeCurrent.length > 0 || page - JUMP_INPUT_SIBLINGS > 2;
  const showTrailingEllipsis =
    pagesAfterCurrent.length > 0 ||
    page + JUMP_INPUT_SIBLINGS < totalPages - 1;

  return compactItems([
    1,
    showLeadingEllipsis ? "ellipsis" : null,
    ...pagesBeforeCurrent,
    page,
    ...pagesAfterCurrent,
    showTrailingEllipsis ? "ellipsis" : null,
    totalPages,
  ]);
}

/** Vung cuoi: 1 ... (totalPages - 9)..totalPages */
function buildLastWindow(totalPages, lastWindowStartPage) {
  return [1, "ellipsis", ...range(lastWindowStartPage, totalPages)];
}

/**
 * Xac dinh mode + danh sach items hien thi.
 * Khong doi logic so voi phien ban truoc refactor.
 */
function buildPaginationItems(page, totalPages) {
  const shouldShowAllPages = totalPages <= WINDOW_SIZE;
  if (shouldShowAllPages) {
    return {
      mode: PAGINATION_MODE.ALL_PAGES,
      items: buildAllPages(totalPages),
    };
  }

  const lastWindowStartPage = totalPages - WINDOW_SIZE + 1;
  // Chi co vung cuoi rieng khi khong overlap voi vung dau
  const hasDistinctLastWindow = lastWindowStartPage > WINDOW_SIZE + 1;

  const isInFirstWindow = page <= WINDOW_SIZE;
  const isInLastWindow = hasDistinctLastWindow && page >= lastWindowStartPage;

  // Trang cuoi khong vao jump input (tranh hien 2 lan totalPages)
  const shouldUseJumpInput =
    page > WINDOW_SIZE &&
    page < totalPages &&
    (!hasDistinctLastWindow || page < lastWindowStartPage);

  if (shouldUseJumpInput) {
    return {
      mode: PAGINATION_MODE.JUMP_INPUT_WINDOW,
      items: buildJumpInputWindow(page, totalPages),
    };
  }

  if (isInFirstWindow) {
    return {
      mode: PAGINATION_MODE.FIRST_WINDOW,
      items: buildFirstWindow(totalPages),
    };
  }

  // Con lai: vung cuoi (ke ca khi totalPages nho, overlap head/tail)
  return {
    mode: PAGINATION_MODE.LAST_WINDOW,
    items: buildLastWindow(totalPages, lastWindowStartPage),
  };
}

function NavButton({ disabled, direction, onClick }) {
  const Icon = direction === "prev" ? ChevronLeftRoundedIcon : ChevronRightRoundedIcon;
  const label = direction === "prev" ? "Trang truoc" : "Trang sau";

  return (
    <IconButton
      size="small"
      disabled={disabled}
      aria-label={label}
      onClick={onClick}
      sx={{
        width: 32,
        height: 32,
        borderRadius: "8px",
        color: disabled ? alpha(MUTED, 0.45) : MUTED,
        "&:hover": {
          bgcolor: disabled ? "transparent" : alpha(PRIMARY, 0.08),
          color: disabled ? alpha(MUTED, 0.45) : PRIMARY,
        },
      }}
    >
      <Icon sx={{ fontSize: 20 }} />
    </IconButton>
  );
}

function PageNumberButton({ pageNumber, onClick }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      aria-label={`Trang ${pageNumber}`}
      sx={{
        minWidth: 32,
        height: 32,
        px: 0.75,
        border: "none",
        bgcolor: "transparent",
        color: TEXT,
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1,
        cursor: "pointer",
        fontFamily: "inherit",
        borderRadius: "10px",
        transition: "color 0.2s ease, background-color 0.2s ease",
        "&:hover": {
          color: PRIMARY,
          bgcolor: alpha(PRIMARY, 0.06),
        },
      }}
    >
      {pageNumber}
    </Box>
  );
}

function ActivePageButton({ pageNumber }) {
  return (
    <Box
      component="span"
      aria-current="page"
      aria-label={`Trang hien tai, trang ${pageNumber}`}
      sx={{
        minWidth: 32,
        height: 32,
        px: 0.75,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: PRIMARY,
        color: "#fff",
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1,
        borderRadius: "10px",
      }}
    >
      {pageNumber}
    </Box>
  );
}

function Ellipsis() {
  return (
    <Typography
      component="span"
      sx={{
        color: MUTED,
        fontSize: 14,
        fontWeight: 600,
        lineHeight: "32px",
        px: 0.25,
        userSelect: "none",
      }}
    >
      ...
    </Typography>
  );
}

function CurrentPageInput({ page, totalPages, onSubmit }) {
  const [value, setValue] = useState(String(page));

  useEffect(() => {
    setValue(String(page));
  }, [page]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setValue(String(page));
      return;
    }

    const parsed = Number.parseInt(trimmed, 10);
    if (!Number.isFinite(parsed)) {
      setValue(String(page));
      return;
    }

    let target = parsed;
    if (parsed < 1) target = 1;
    else if (parsed > totalPages) target = totalPages;

    onSubmit(target);
    setValue(String(target));
  };

  return (
    <Input
      value={value}
      onChange={(event) => setValue(event.target.value.replace(/\D/g, ""))}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          handleSubmit();
        }
      }}
      onBlur={() => setValue(String(page))}
      inputProps={{
        "aria-label": `Trang hien tai, trang ${page}`,
        inputMode: "numeric",
      }}
      sx={{
        width: 42,
        minWidth: 36,
        maxWidth: 48,
        fontSize: 14,
        fontWeight: 700,
        color: PRIMARY,
        textAlign: "center",
        "& input": {
          p: 0,
          pb: "2px",
          textAlign: "center",
        },
        "&::before": {
          borderBottom: `2px solid ${alpha(PRIMARY, 0.35)}`,
        },
        "&:hover:not(.Mui-disabled)::before": {
          borderBottom: `2px solid ${alpha(PRIMARY, 0.5)}`,
        },
        "&::after": {
          borderBottom: `2px solid ${PRIMARY}`,
        },
      }}
    />
  );
}

/**
 * Pagination dung chung.
 * Props: page, totalPages, onPageChange
 */
export default function AppPagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const { mode, items } = buildPaginationItems(page, totalPages);
  const useInputForCurrent = mode === PAGINATION_MODE.JUMP_INPUT_WINDOW;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: ITEM_GAP,
        mt: 5,
      }}
    >
      <NavButton disabled={page <= 1} direction="prev" onClick={() => onPageChange(page - 1)} />

      {items.map((item, index) => {
        if (item === "ellipsis") {
          return <Ellipsis key={`ellipsis-${index}`} />;
        }

        if (item === page) {
          if (useInputForCurrent) {
            return (
              <CurrentPageInput
                key={`current-input-${page}`}
                page={page}
                totalPages={totalPages}
                onSubmit={onPageChange}
              />
            );
          }
          return <ActivePageButton key={`current-active-${page}`} pageNumber={page} />;
        }

        return (
          <PageNumberButton
            key={`page-${item}`}
            pageNumber={item}
            onClick={() => onPageChange(item)}
          />
        );
      })}

      <NavButton
        disabled={page >= totalPages}
        direction="next"
        onClick={() => onPageChange(page + 1)}
      />
    </Box>
  );
}
