import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './store';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import * as serviceWorker from './serviceWorker';

const professionalTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4A154B', // Slack-like indigo
      light: '#611f69',
      dark: '#350d36',
    },
    secondary: {
      main: '#36C5F0', // Slack-like baby blue
    },
    background: {
      default: '#F4F5F7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1D1C1D',
      secondary: '#616061',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '8px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          },
        },
      },
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={professionalTheme}>
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
