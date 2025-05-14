'use client';

import React from 'react';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/lib/theme';
import { AuthProvider } from '@/components/AuthProvider';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
