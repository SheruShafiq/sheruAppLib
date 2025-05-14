'use client';

import React from 'react';
import { Stack, Typography } from '@mui/material';

export default function CVPage() {
  return (
    <Stack
      minHeight="100vh"
      width="100%"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h2">CV Page</Typography>
      <Typography>
        This page will display your CV information
      </Typography>
    </Stack>
  );
}
