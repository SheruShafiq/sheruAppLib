'use client';

import React from 'react';
import { Stack, Typography } from '@mui/material';

export default function BadgeMakerPage() {
  return (
    <Stack
      minHeight="100vh"
      width="100%"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h2">Badge Maker</Typography>
      <Typography>
        This page will contain the badge maker functionality
      </Typography>
    </Stack>
  );
}
