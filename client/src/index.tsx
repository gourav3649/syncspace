import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './store';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import * as serviceWorker from './serviceWorker';

const premiumDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5B73FF',
      light: '#7B8DFF',
      dark: '#4A62EE',
    },
    secondary: {
      main: '#22C55E', // Success/online
    },
    background: {
      default: '#0F1115', // App background
      paper: '#1D2430', // Elevated surfaces, modals
    },
    text: {
      primary: '#F5F7FB',
      secondary: '#B8C0CC',
    },
    error: { main: '#EF4444' },
    warning: { main: '#F59E0B' },
    success: { main: '#22C55E' },
    info: { main: '#38BDF8' },
  },
  typography: {
    fontFamily: [
      'Inter',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true, disableRipple: true },
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiIconButton: {
      defaultProps: { disableRipple: true },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1D2430',
          backgroundImage: 'none',
          borderRadius: 16,
          boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1D2430',
          backgroundImage: 'none',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.08)',
        },
      },
    },
    MuiMenuItem: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#232C3A',
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
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={premiumDarkTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
