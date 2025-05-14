import { Suspense } from 'react';
import ClientPage from './client-page';

export default function PostPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientPage />
    </Suspense>
  );
}
