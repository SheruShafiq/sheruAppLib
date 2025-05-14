import './globals.css';
import type { Metadata } from 'next';
import { AppLayout } from './client-layout';
import React from 'react';

export const metadata: Metadata = {
  title: 'Sheru\'s Project',
  description: 'Created by Sheru',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
