import React from "react";
import { Stack, Box, Skeleton } from "@mui/material";

function PostPreviewSkeletonLoader({ pageVariant }) {
  return (
    <Stack
      width="100%"
      px={pageVariant ? 0 : 2}
      py={2}
      className={pageVariant ? "" : "standardBorder"}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        <Skeleton animation="wave" variant="text" width={120} height={24} />
        <Skeleton animation="wave" variant="text" width={60} height={24} />
      </Stack>
      <Stack gap={1}>
        <Skeleton animation="wave" variant="text" width="50%" />
        <Stack gap={1}>
          <Skeleton
            animation="wave"
            variant="rounded"
            width="100%"
            height={Math.floor(Math.random() * (100 - 20 + 1))}
          />
          <Stack direction="row" spacing={2}>
            <Skeleton
              animation="wave"
              variant="rounded"
              width={40}
              height={30}
            />
            <Skeleton
              animation="wave"
              variant="rounded"
              width={40}
              height={30}
            />
            <Skeleton
              animation="wave"
              variant="rounded"
              width={40}
              height={30}
            />
            <Skeleton
              animation="wave"
              variant="rounded"
              width={40}
              height={30}
            />
            <Skeleton
              animation="wave"
              variant="rounded"
              width={40}
              height={30}
            />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default PostPreviewSkeletonLoader;
