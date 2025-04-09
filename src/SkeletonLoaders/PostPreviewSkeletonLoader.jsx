import React from "react";
import { Stack, Box, Skeleton } from "@mui/material";

function PostPreviewSkeletonLoader() {
  return (
    <Stack width="100%" p={2} className="standardBorder">
      <Stack direction="row" alignItems="center" gap={1}>
        <Skeleton variant="text" width={120} height={24} />
        <Skeleton variant="text" width={60} height={24} />
      </Stack>
      <Stack gap={1}>
        <Skeleton variant="text" width="50%" />
        <Stack gap={1}>
          <Skeleton
            variant="rounded"
            width="100%"
            height={Math.floor(Math.random() * (100 - 20 + 1))}
          />
          <Stack direction="row" spacing={2}>
            <Skeleton variant="rounded" width={40} height={30} />
            <Skeleton variant="rounded" width={40} height={30} />
            <Skeleton variant="rounded" width={40} height={30} />
            <Skeleton variant="rounded" width={40} height={30} />
            <Skeleton variant="rounded" width={40} height={30} />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default PostPreviewSkeletonLoader;
