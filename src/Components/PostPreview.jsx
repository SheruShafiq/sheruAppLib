import React, { useEffect, useState } from "react";
import { Typography, Box, Button, Link, Chip, Stack } from "@mui/material";
import InsertEmotionIcon from "@mui/icons-material/InsertEmoticon";
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
  deteCreated,
  upvotedByCurrentUser,
  downvotedByCurrentUser,
  reportedByCurrentUser,
}) {
  const { enqueueSnackbar } = useSnackbar();

  // Local state to track the current vote and report status
  const [voteStatus, setVoteStatus] = useState("none"); // "up", "down", or "none"
  const [reported, setReported] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  // Sync local state with props whenever they change
  useEffect(() => {
    if (upvotedByCurrentUser) setVoteStatus("up");
    else if (downvotedByCurrentUser) setVoteStatus("down");
    else setVoteStatus("none");

    setReported(!!reportedByCurrentUser);
  }, [upvotedByCurrentUser, downvotedByCurrentUser, reportedByCurrentUser]);

  // Helper to format the date in Reddit style.
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

  // Handle vote actions using async/await for clarity.
  const handleVote = async (type) => {
    if (!isLoggedIn) {
      enqueueSnackbar("Please log in to vote", { variant: "login" });
      return;
    }
    if (isVoting) return; // Prevent concurrent actions
    setIsVoting(true);

    try {
      if (type === "upvote") {
        if (voteStatus === "up") {
          // If already upvoted, undo it.
          await undoUpVotePost(id, upvotes, () => {
            console.log("success"),
              () => {
                console.log("failure");
              };
          });
          setVoteStatus("none");
        } else {
          // If a downvote exists, undo it first.
          if (voteStatus === "down") {
            await undoDownVotePost(id, downvotes, () => {
              console.log("success"),
                () => {
                  console.log("failure");
                };
            });
          }
          await upVotePost(id, upvotes, () => {
            console.log("success"),
              () => {
                console.log("failure");
              };
          });
          setVoteStatus("up");
        }
      } else if (type === "downvote") {
        if (voteStatus === "down") {
          // If already downvoted, undo it.
          await undoDownVotePost(id, downvotes, () => {
            console.log("success"),
              () => {
                console.log("failure");
              };
          });
          setVoteStatus("none");
        } else {
          // If an upvote exists, undo it first.
          if (voteStatus === "up") {
            await undoUpVotePost(id, upvotes, () => {
              console.log("success"),
                () => {
                  console.log("failure");
                };
            });
          }
          await downVotePost(id, downvotes, () => {
            console.log("success"),
              () => {
                console.log("failure");
              };
          });
          setVoteStatus("down");
        }
      } else if (type === "report") {
        if (reported) {
          // Undo report if already reported.
          await undoReportPost(id, reports, () => {
            console.log("success"),
              () => {
                console.log("failure");
              };
          });
          setReported(false);
        } else {
          await reportPost(id, reports, () => {
            console.log("success"),
              () => {
                console.log("failure");
              };
          });
          setReported(true);
        }
      }
      // Refresh the post data after a successful action.
      fetchPosts();
    } catch (error) {
      enqueueSnackbar(`Network error on: ${type}. ${error}`, {
        variant: "error",
      });
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <Stack gap={1} width={"100%"}>
      <Stack direction="row" alignItems="center" gap={1}>
        <Link href={`posts/${id}`}>
          <Typography fontSize={16} fontWeight="bold">
            {title}
          </Typography>
        </Link>
        <Chip size="small" label={formattedDate} variant="outlined" />
      </Stack>
      <Box>
        <Typography textOverflow={"ellipsis"} overflow={"clip"}>
          {resource}
        </Typography>
        <Typography textOverflow={"ellipsis"} overflow={"clip"}>
          {description}
        </Typography>
        <Button
          onClick={() => handleVote("upvote")}
          disabled={isVoting}
          startIcon={
            <InsertEmotionIcon
              htmlColor={voteStatus === "up" ? "rgb(137 255 137)" : "inherit"}
            />
          }
        >
          {upvotes}
        </Button>
        <Button
          onClick={() => handleVote("downvote")}
          disabled={isVoting}
          startIcon={
            <SentimentVeryDissatisfiedIcon
              htmlColor={voteStatus === "down" ? "rgb(230 109 109)" : "inherit"}
            />
          }
        >
          {downvotes}
        </Button>
        <Button
          onClick={() => handleVote("report")}
          disabled={isVoting}
          startIcon={
            <ErrorOutlinedIcon
              htmlColor={reported ? "rgb(248 190 82)" : "inherit"}
            />
          }
        >
          {reports}
        </Button>
        <Button>{category}</Button>
        <Button startIcon={<MessageOutlinedIcon color="secondary" />}>
          {commentsCount}
        </Button>
      </Box>
    </Stack>
  );
}

export default PostPreview;
