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
      {pageVariant && (
        <Stack gap={1}>
          <Stack direction={"row"} gap={1} alignItems={"center"}>
            <Skeleton
              animation="wave"
              variant="circular"
              width={14}
              height={14}
            ></Skeleton>
            <Skeleton animation="wave" variant="text" width={120} height={24} />
          </Stack>
          <Skeleton animation="wave" variant="text" width={300} height={30} />
        </Stack>
      )}
      <Stack gap={1}>
        <Skeleton animation="wave" variant="text" width="100%" />
        <Stack gap={1}>
          <Skeleton
            animation="wave"
            variant="rounded"
            width="100%"
            height={Math.floor(Math.random() * (100 - 20 + 1)) + 20}
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
