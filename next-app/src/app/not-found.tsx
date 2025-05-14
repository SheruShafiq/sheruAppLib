'use client';

import { Stack, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Stack
      height="100vh"
      width="100%"
      justifyContent="center"
      alignItems="center"
      gap={4}
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="h3">Page Not Found</Typography>
      <Link href="/" passHref>
        <Button variant="contained" color="primary">
          Go Home
        </Button>
      </Link>
    </Stack>
  );
}
