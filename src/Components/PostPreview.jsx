import { Typography, Box, Button, Link } from "@mui/material";
import React from "react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import {
  upVotePost,
  downVotePost,
  reportPost,
  undoUpVotePost,
  undoDownVotePost,
  undoReportPost,
} from "../APICalls";
import { useSnackbar } from "notistack";

function PostPreview({
  title,
  resource,
  description,
  upvotes,
  downvotes,
  reports,
  category,
  commentsCount,
  id,
  fetchPosts,
  isLoggedIn,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const [voted, setVoted] = React.useState({
    upvote: false,
    downvote: false,
    report: false,
  });

  const handleVote = (voteType) => {
    if (!isLoggedIn) {
      enqueueSnackbar("Please log in to vote", { variant: "login" });
      return;
    }

    const voteActions = {
      upvote: {
        vote: upVotePost,
        undo: undoUpVotePost,
        count: upvotes,
      },
      downvote: {
        vote: downVotePost,
        undo: undoDownVotePost,
        count: downvotes,
      },
      report: {
        vote: reportPost,
        undo: undoReportPost,
        count: reports,
      },
    };

    const { vote, undo, count } = voteActions[voteType];

    if (voted[voteType]) {
      undo(
        id,
        count,
        (data) => {
          setVoted((prev) => ({ ...prev, [voteType]: false }));
          fetchPosts();
        },
        (error) => {
          enqueueSnackbar(
            `Network error, couldn't undo ${voteType}. Try again later.`,
            { variant: "error" }
          );
        }
      );
    } else {
      vote(
        id,
        count,
        (data) => {
          setVoted((prev) => ({ ...prev, [voteType]: true }));
          fetchPosts();
        },
        (error) => {
          enqueueSnackbar(
            `Network error, couldn't ${voteType}. Try again later.`,
            { variant: "error" }
          );
        }
      );
    }
  };

  return (
    <Box>
      <Link href={`posts/${id}`}>{title}</Link>
      <Typography>{resource}</Typography>
      <Typography>{description}</Typography>
      <Button
        onClick={() => handleVote("upvote")}
        startIcon={<EmojiEmotionsIcon />}
      >
        {upvotes}
      </Button>
      <Button
        onClick={() => handleVote("downvote")}
        startIcon={<SentimentVeryDissatisfiedIcon />}
      >
        {downvotes}
      </Button>
      <Button
        onClick={() => handleVote("report")}
        startIcon={<ErrorOutlinedIcon />}
      >
        {reports}
      </Button>
      <Button>{category}</Button>
      <Button startIcon={<MessageOutlinedIcon />}>{commentsCount}</Button>
    </Box>
  );
}

export default PostPreview;
