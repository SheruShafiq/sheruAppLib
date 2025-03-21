import { Typography, Box, Button } from "@mui/material";
import React from "react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";

function PostPreview({
  title,
  resource,
  description,
  upvotes,
  downvotes,
  offlineReports,
  category,
  commentsCount,
}) {
  return (
    <Box>
      <Typography>{title}</Typography>
      <Typography>{resource}</Typography>
      <Typography>{description}</Typography>
      <Button startIcon={<EmojiEmotionsIcon />}>{upvotes}</Button>
      <Button startIcon={<SentimentVeryDissatisfiedIcon />}>{downvotes}</Button>
      <Button startIcon={<ErrorOutlinedIcon />}>{offlineReports}</Button>
      <Button>{category}</Button>
      <Button startIcon={<MessageOutlinedIcon />}>{commentsCount}</Button>
    </Box>
  );
}

export default PostPreview;
