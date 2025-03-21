import { Typography, Box, Button } from "@mui/material";
import React from "react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import {
  fetchPostById,
  upVotePost,
  downVotePost,
  reportPost,
} from "../APICalls";
import { useSnackbar } from "notistack";

function PostPreview({
  title,
  resource,
  description,
  upvotes,
  downvotes,
  offlineReports,
  category,
  commentsCount,
  id,
  fetchPosts,
}) {
  const { enqueueSnackbar } = useSnackbar();
  return (
    <Box>
      <Typography>{title}</Typography>
      <Typography>{resource}</Typography>
      <Typography>{description}</Typography>
      <Button
        onClick={() => {
          upVotePost(
            id,
            upvotes,
            () => {
              fetchPosts();
            },
            () => {
              enqueueSnackbar(
                "Network error, couldn't upvote. Try again later.",
                { variant: "error" }
              );
            }
          );
        }}
        startIcon={<EmojiEmotionsIcon />}
      >
        {upvotes}
      </Button>
      <Button
        onClick={() => {
          downVotePost(
            id,
            downvotes,
            () => {
              fetchPosts();
            },
            () => {
              enqueueSnackbar(
                "Network error, couldn't downvote. Try again later.",
                { variant: "error" }
              );
            }
          );
        }}
        startIcon={<SentimentVeryDissatisfiedIcon />}
      >
        {downvotes}
      </Button>
      <Button
        onClick={() => {
          reportPost(
            id,
            offlineReports,
            () => {
              fetchPosts();
            },
            () => {
              enqueueSnackbar(
                "Network error, couldn't report. Try again later.",
                { variant: "error" }
              );
            }
          );
        }}
        startIcon={<ErrorOutlinedIcon />}
      >
        {offlineReports}
      </Button>
      <Button>{category}</Button>
      <Button startIcon={<MessageOutlinedIcon />}>{commentsCount}</Button>
    </Box>
  );
}

export default PostPreview;
