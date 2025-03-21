import { Alert, Typography, Box } from "@mui/material";
import React from "react";

function PostPreview({ title, resource, description }) {
  return (
    <Box>
      <Typography>{title}</Typography>
      <Typography>{resource}</Typography>
      <Typography>{description}</Typography>
    </Box>
  );
}

export default PostPreview;
