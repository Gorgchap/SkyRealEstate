import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { App } from '@src/components';
import { AuthProvider } from '@src/hooks';

const root = createRoot(document.getElementById('app'));

const theme = createTheme({
  palette: {
    primary: {
      main: '#0458fe'
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
