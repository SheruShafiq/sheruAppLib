import { Typography, Box, Button, Link } from "@mui/material";
import React from "react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import { upVotePost, downVotePost, reportPost } from "../APICalls";
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
  isLoggedIn,
}) {
  const { enqueueSnackbar } = useSnackbar();
  return (
    <Box>
      <Link href={`posts/${id}`}>{title}</Link>
      <Typography>{resource}</Typography>
      <Typography>{description}</Typography>
      <Button
        onClick={() => {
          if (!isLoggedIn) {
            enqueueSnackbar("Please log in to vote", { variant: "login" });
            return;
          }
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
          if (!isLoggedIn) {
            enqueueSnackbar("Please log in to vote", { variant: "login" });
            return;
          }
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
          if (!isLoggedIn) {
            enqueueSnackbar("Please log in to vote", { variant: "login" });
            return;
          }
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
