import { createTheme } from '@mui/material/styles';
import typography from './Typography';
import { shadows } from './Shadows';
import { BRAND, STATUS, GRADIENTS, RULE_70_30, FONTS } from './brand';

// =============================================================================
// AMIGOS SACCO — MUI THEME
// Every colour here resolves from ./brand.js. Do not introduce literals.
//
// The 70/30 identity rule is expressed structurally, not just in the palette:
//   - primary  = orange, and it owns every action surface (buttons, active nav,
//                links, focus rings, progress) — the ~70% of what the eye lands on
//   - secondary = deep blue, and it owns structure (headings, app bar text,
//                 table heads, authority surfaces) — the ~30%
// =============================================================================

const baselightTheme = createTheme({
  direction: 'ltr',
  palette: {
    primary: {
      main: BRAND.orange,
      light: BRAND.orangeTint,
      dark: BRAND.orangeDark,
      contrastText: '#ffffff',
    },
    secondary: {
      main: BRAND.blue,
      light: BRAND.blueTint,
      dark: BRAND.blueDark,
      contrastText: '#ffffff',
    },
    // Brand tokens exposed on the theme so components can read
    // theme.palette.brand.orange without importing brand.js directly.
    brand: {
      orange: BRAND.orange,
      orangeDark: BRAND.orangeDark,
      orangeTint: BRAND.orangeTint,
      blue: BRAND.blue,
      blueDark: BRAND.blueDark,
      blueTint: BRAND.blueTint,
      gradients: GRADIENTS,
      rule: RULE_70_30,
      fonts: FONTS,
    },
    success: {
      main: STATUS.success,
      light: STATUS.successTint,
      dark: '#16794F',
      contrastText: '#ffffff',
    },
    info: {
      main: STATUS.info,
      light: STATUS.infoTint,
      dark: '#2E55A8',
      contrastText: '#ffffff',
    },
    error: {
      main: STATUS.error,
      light: STATUS.errorTint,
      dark: '#A62F2F',
      contrastText: '#ffffff',
    },
    warning: {
      main: STATUS.warning,
      light: STATUS.warningTint,
      dark: '#B38600',
      contrastText: '#3B2E00',
    },
    purple: {
      A50: BRAND.blueTint,
      A100: BRAND.blue,
      A200: BRAND.blueDark,
    },
    grey: {
      100: BRAND.surfaceSunken,
      200: '#EAEFF4',
      300: '#DFE5EF',
      400: BRAND.inkFaint,
      500: BRAND.inkMuted,
      600: '#2A3547',
    },
    text: {
      primary: BRAND.ink,
      secondary: BRAND.inkMuted,
    },
    background: {
      default: BRAND.surfaceAlt,
      paper: BRAND.surface,
    },
    action: {
      disabledBackground: 'rgba(73,82,88,0.12)',
      hoverOpacity: 0.02,
      hover: BRAND.orangeTint,
    },
    divider: BRAND.line,
  },
  shape: { borderRadius: 8 },
  typography,
  shadows,
  components: {
    // --- Global brand chrome ------------------------------------------------
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: BRAND.surfaceAlt,
        },
        '::selection': {
          background: BRAND.orangeTint,
          color: BRAND.blueDark,
        },
        // Brand scrollbar — orange thumb on a faint blue track.
        '*::-webkit-scrollbar': { width: 10, height: 10 },
        '*::-webkit-scrollbar-track': { background: BRAND.surfaceSunken },
        '*::-webkit-scrollbar-thumb': {
          background: BRAND.orangeTintStrong,
          borderRadius: 8,
          border: `2px solid ${BRAND.surfaceSunken}`,
        },
        '*::-webkit-scrollbar-thumb:hover': { background: BRAND.orange },
      },
    },
    // --- Actions carry the orange ------------------------------------------
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        containedPrimary: {
          background: GRADIENTS.cta,
          '&:hover': { background: BRAND.orangeDark },
        },
        outlinedPrimary: {
          borderColor: BRAND.orangeTintStrong,
          '&:hover': { borderColor: BRAND.orange, background: BRAND.orangeTint },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: { color: BRAND.orangeDark, textDecorationColor: BRAND.orangeTintStrong },
      },
    },
    // --- Structure carries the blue ----------------------------------------
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          border: `1px solid ${BRAND.line}`,
          // Every card wears the 70/30 rule along its top edge. Deliberately
          // no `overflow: hidden` here — that would clip legitimate child
          // content — so the bar is rounded to match the card corners instead.
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            borderRadius: '10px 10px 0 0',
            background: GRADIENTS.brandBar,
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: BRAND.blueTint,
          '& .MuiTableCell-head': {
            color: BRAND.blueDark,
            fontWeight: 700,
            letterSpacing: '0.02em',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: { root: { borderColor: BRAND.line } },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${BRAND.line}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${BRAND.line}`,
          backgroundColor: BRAND.surface,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
        colorPrimary: { backgroundColor: BRAND.orange },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { fontWeight: 600, textTransform: 'none' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: BRAND.orangeTintStrong },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: BRAND.orange,
            borderWidth: 2,
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { backgroundColor: BRAND.orangeTint, borderRadius: 4 },
        bar: { backgroundColor: BRAND.orange },
      },
    },
  },
});

export { baselightTheme };
export default baselightTheme;
