import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { App } from '@src/components';
import { AuthProvider } from '@src/hooks';
import './index.less';

const root = createRoot(document.getElementById('app'));

const theme = createTheme({
  palette: {
    primary: {
      main: '#0458fe',
    },
    secondary: {
      main: '#24314a',
    },
    info: {
      main: '#e1e4f4',
    },
    error: {
      main: '#ff1f55',
    },
    success: {
      main: '#28a745',
    },
    warning: {
      main: '#ffc107',
    },
  },
});

root.render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

// hot module replacement
if (process.env.NODE_ENV === 'development' && module.hot) module.hot.accept();
