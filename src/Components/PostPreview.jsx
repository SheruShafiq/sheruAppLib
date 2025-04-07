import { Typography, Box, Button, Link } from "@mui/material";
import React from "react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
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
  deteCreated,
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
  const formatDateRedditStyle = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds || 1} second${
        diffInSeconds === 1 ? "" : "s"
      } ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes || 1} minute${minutes === 1 ? "" : "s"} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours || 1} hour${hours === 1 ? "" : "s"} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days || 1} day${days === 1 ? "" : "s"} ago`;
    } else if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks || 1} week${weeks === 1 ? "" : "s"} ago`;
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months || 1} month${months === 1 ? "" : "s"} ago`;
    } else {
      const years = Math.floor(diffInSeconds / 31536000);
      return `${years || 1} year${years === 1 ? "" : "s"} ago`;
    }
  };

  const convertedDate = new Date(deteCreated);
  const formattedDate = formatDateRedditStyle(convertedDate);

  return (
    <Stack gap={1}>
      <Stack flexDirection={"row"} alignItems={"center"} gap={1}>
        <Link href={`posts/${id}`}>{title}</Link>
        <Chip size="small" label={formattedDate} variant="outlined" />{" "}
      </Stack>
      <Box>
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
    </Stack>
  );
}

export default PostPreview;
