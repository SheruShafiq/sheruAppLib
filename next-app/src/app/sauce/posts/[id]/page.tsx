import { Suspense } from "react";
import ClientPage from "./client-page";

export default function PostDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientPage postId={params.id} />
    </Suspense>
  );
}
