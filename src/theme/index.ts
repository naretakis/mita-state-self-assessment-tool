import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0071bc',
      light: '#4d9fd4',
      dark: '#004c8c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#02bfe7',
      light: '#4dd2ed',
      dark: '#0095b6',
    },
    success: {
      main: '#2e8540',
      light: '#4caf50',
      dark: '#1e5a2c',
    },
    warning: {
      main: '#fdb81e',
      light: '#ffc94d',
      dark: '#c48f00',
    },
    error: {
      main: '#e31c3d',
      light: '#e94d64',
      dark: '#b0142f',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#5c5c5c',
    },
  },
  typography: {
    fontFamily: '"Source Sans Pro", "Helvetica Neue", Helvetica, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        },
      },
    },
  },
});

export default theme;
