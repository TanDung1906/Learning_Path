import { createTheme, alpha } from "@mui/material/styles";

/** Bo góc surface — khớp CourseCard (MuiCard) */
export const SURFACE_RADIUS = 8;

/** iOS 18 — minimal modern, ocean palette (flat, no gradient) */
export const ios18 = {
  radius: {
    xs: 4,
    sm: 6,
    md: SURFACE_RADIUS,
    lg: 10,
    xl: 12,
    pill: 9999,
    card: SURFACE_RADIUS,
  },
  blur: 24,
  glass: {
    background: "rgba(255, 255, 255, 0.82)",
    backdropFilter: "blur(24px) saturate(140%)",
    WebkitBackdropFilter: "blur(24px) saturate(140%)",
    border: "1px solid rgba(8, 145, 178, 0.1)",
  },
  shadow: {
    sm: "0 1px 2px rgba(8, 145, 178, 0.04)",
    md: "0 4px 16px rgba(8, 145, 178, 0.06)",
    lg: "0 8px 32px rgba(8, 145, 178, 0.08)",
  },
  transition: "cubic-bezier(0.25, 0.1, 0.25, 1)",
};

const OCEAN = "#0891B2";
const OCEAN_DARK = "#0E7490";
const OCEAN_LIGHT = "#22D3EE";
const SKY = "#38BDF8";

const theme = createTheme({
  palette: {
    primary: { main: OCEAN, light: OCEAN_LIGHT, dark: OCEAN_DARK },
    secondary: { main: SKY, light: "#7DD3FC", dark: "#0284C7" },
    accent: { main: "#EA580C", light: "#FB923C", dark: "#C2410C" },
    background: { default: "#F8FAFC", paper: "#FFFFFF" },
    text: { primary: "#0F172A", secondary: "#64748B" },
    success: { main: "#059669" },
    error: { main: "#DC2626" },
    divider: alpha(OCEAN, 0.1),
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
    h4: { fontWeight: 600, letterSpacing: "-0.02em" },
    h5: { fontWeight: 600, letterSpacing: "-0.02em" },
    h6: { fontWeight: 600, letterSpacing: "-0.01em" },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.5 },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: "0" },
  },
  shape: { borderRadius: SURFACE_RADIUS },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F8FAFC",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: ios18.radius.pill,
          padding: "10px 20px",
          boxShadow: "none",
          transition: `background-color 0.2s ${ios18.transition}, color 0.2s ${ios18.transition}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: SURFACE_RADIUS,
          boxShadow: ios18.shadow.sm,
          border: `1px solid ${alpha(OCEAN, 0.08)}`,
          backgroundImage: "none",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: SURFACE_RADIUS,
          boxShadow: ios18.shadow.lg,
          border: `1px solid ${alpha(OCEAN, 0.08)}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: SURFACE_RADIUS,
          backgroundImage: "none",
        },
      },
    },
    MuiMenuList: {
      styleOverrides: {
        root: { paddingTop: 4, paddingBottom: 4 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: 40,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500, borderRadius: ios18.radius.xs },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined" },
    },
  },
});

theme.ios18 = ios18;

/** Viền + bóng khớp Card trên HomePage */
export const surfaceCardSx = (theme) => ({
  border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
  boxShadow: theme.ios18.shadow.sm,
});

export default theme;
