"use client";

import React from "react";
import { Stack, Box, Skeleton } from "@mui/material";

interface PostPreviewSkeletonLoaderProps {
  pageVariant?: boolean;
}

function PostPreviewSkeletonLoader({
  pageVariant,
}: PostPreviewSkeletonLoaderProps) {
  return (
    <Box
      sx={{
        padding: "16px",
        marginBottom: "8px",
        borderRadius: "8px",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Stack direction="row" gap={2} alignItems="flex-start">
        <Stack alignItems="center" spacing={1}>
          <Skeleton
            animation="wave"
            variant="circular"
            width={40}
            height={40}
          />
          <Skeleton animation="wave" variant="text" width={20} height={20} />
          <Skeleton
            animation="wave"
            variant="circular"
            width={40}
            height={40}
          />
        </Stack>

        <Stack spacing={1} flex={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Skeleton
                animation="wave"
                variant="rounded"
                width={80}
                height={24}
              />
              <Skeleton
                animation="wave"
                variant="text"
                width={120}
                height={20}
              />
            </Stack>
          </Stack>

          <Skeleton animation="wave" variant="text" width="80%" height={28} />
          <Skeleton animation="wave" variant="text" width="100%" height={20} />
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
          <Skeleton animation="wave" variant="text" width="60%" height={20} />

          <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton
              animation="wave"
              variant="rounded"
              width={100}
              height={32}
            />
            <Skeleton
              animation="wave"
              variant="rounded"
              width={80}
              height={32}
            />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

export default PostPreviewSkeletonLoader;
