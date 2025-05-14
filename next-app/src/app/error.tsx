'use client';

import { useEffect } from 'react';
import { Stack, Typography, Button } from '@mui/material';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Stack
      height="100vh"
      width="100%"
      justifyContent="center"
      alignItems="center"
      gap={4}
    >
      <Typography variant="h2">Something went wrong!</Typography>
      <Button
        onClick={reset}
        variant="contained"
        color="primary"
      >
        Try again
      </Button>
    </Stack>
  );
}
