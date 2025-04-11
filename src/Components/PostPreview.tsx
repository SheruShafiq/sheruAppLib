import React, { useEffect, useState, useRef } from "react";
import { Typography, Box, Button, Link, Chip, Stack } from "@mui/material";
import InsertEmotionIcon from "@mui/icons-material/InsertEmoticon";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import LinkIcon from "@mui/icons-material/Link";
import { useSnackbar } from "notistack";
import { TextGlitchEffect } from "./TextGlitchEffect";
import { patchVotePost, patchUndoVotePost } from "../APICalls";
import { patchUser } from "../APICalls";
import { errorProps, Post, User, VoteField } from "../../dataTypeDefinitions";

interface PostPreviewProps {
  id: string;
  title: string;
  resource: string;
  description: string;
  upvotes: number;
  downvotes: number;
  reports: number;
  category: number | string;
  commentsCount: number;
  fetchPosts: () => Promise<void> | void;
  isLoggedIn: boolean;
  dateCreated: string;
  upvotedByCurrentUser: boolean;
  downvotedByCurrentUser: boolean;
  reportedByCurrentUser: boolean;
  isPostAuthoredByCurrentUser: boolean;
  pageVariant?: boolean;
  userData: User;
}

const PostPreview: React.FC<PostPreviewProps> = ({
  id,
  title,
  resource,
  description,
  upvotes,
  downvotes,
  reports,
  category,
  commentsCount,
  fetchPosts,
  isLoggedIn,
  dateCreated,
  upvotedByCurrentUser,
  downvotedByCurrentUser,
  reportedByCurrentUser,
  isPostAuthoredByCurrentUser,
  pageVariant,
  userData,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  // Flags to control local state
  const [isVoting, setIsVoting] = useState(false);
  const [voteStatus, setVoteStatus] = useState<"up" | "down" | "none">("none");
  const [reported, setReported] = useState(false);

  const descRef = useRef<HTMLDivElement>(null);
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    if (descRef.current) {
      setIsOverflow(
        descRef.current.scrollHeight > descRef.current.clientHeight
      );
    }
  }, [description]);

  // Synchronize local vote status with props.
  useEffect(() => {
    console.log(upvotedByCurrentUser, downvotedByCurrentUser);
    if (upvotedByCurrentUser) setVoteStatus("up");
    else if (downvotedByCurrentUser) setVoteStatus("down");
    else setVoteStatus("none");
    setReported(reportedByCurrentUser);
  }, [upvotedByCurrentUser, downvotedByCurrentUser, reportedByCurrentUser]);

  // Format date in Reddit style.
  const formatDateRedditStyle = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

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

  const formattedDate = formatDateRedditStyle(new Date(dateCreated));
  const formattedResource =
    resource && resource.length > 20 ? `${resource.slice(0, 20)}...` : resource;

  // A helper that wraps a Promise to help with async/await if needed.
  const wrapApiCall = async <T,>(
    fn: (...args: any[]) => Promise<T>,
    ...args: any[]
  ): Promise<T> => {
    return await fn(...args);
  };

  /*
    Voting logic (using PATCH calls):
      - If the user clicks "upvote" when already upvoted, we call patchUndoVotePost on "upvotes".
      - If switching from downvote to upvote, first undo the downvote, then apply the upvote.
      - Similar logic applies for downvotes.
      - For reporting, we do the equivalent.
    No optimistic UI updates occur; we only refresh the UI (via fetchPosts) once all API calls complete.
  */
  const handleVote = async (type: "upvote" | "downvote" | "report") => {
    if (!isLoggedIn) {
      enqueueSnackbar("Please log in to vote", { variant: "info" });
      return;
    }
    if (isVoting) return;
    setIsVoting(true);

    try {
      if (type === "upvote") {
        if (voteStatus === "up") {
          // Undo upvote.
          await wrapApiCall(patchUndoVotePost, id, "upvotes", upvotes);
          const updatedUser: User = {
            ...userData,
            upvotedPosts: userData.upvotedPosts.filter(
              (pid: string) => pid !== id
            ),
          };
          await wrapApiCall(patchUser, {
            userID: userData.id,
            field: "upvotedPosts",
            newValue: updatedUser.upvotedPosts,
            onSuccess: () => {},
            onError: (err: any) => {
              throw err;
            },
          });
        } else {
          // If currently downvoted, undo the downvote.
          if (voteStatus === "down") {
            await wrapApiCall(patchUndoVotePost, id, "downvotes", downvotes);
            const updatedUser: User = {
              ...userData,
              downVotedPosts: userData.downVotedPosts.filter(
                (pid: string) => pid !== id
              ),
            };
            await wrapApiCall(patchUser, {
              userID: userData.id,
              field: "downVotedPosts",
              newValue: updatedUser.downVotedPosts,
              onSuccess: () => {},
              onError: (err: any) => {
                throw err;
              },
            });
          }
          // Apply upvote.
          await wrapApiCall(patchVotePost, id, "upvotes", upvotes, 1);
          const updatedUser: User = {
            ...userData,
            upvotedPosts: [...userData.upvotedPosts, id],
          };
          await wrapApiCall(patchUser, {
            userID: userData.id,
            field: "upvotedPosts",
            newValue: updatedUser.upvotedPosts,
            onSuccess: () => {},
            onError: (err: any) => {
              throw err;
            },
          });
        }
      } else if (type === "downvote") {
        if (voteStatus === "down") {
          // Undo downvote.
          await wrapApiCall(patchUndoVotePost, id, "downvotes", downvotes);
          const updatedUser: User = {
            ...userData,
            downVotedPosts: userData.downVotedPosts.filter(
              (pid: string) => pid !== id
            ),
          };
          await wrapApiCall(patchUser, {
            userID: userData.id,
            field: "downVotedPosts",
            newValue: updatedUser.downVotedPosts,
            onSuccess: () => {},
            onError: (err: any) => {
              throw err;
            },
          });
        } else {
          // If currently upvoted, undo the upvote.
          if (voteStatus === "up") {
            await wrapApiCall(patchUndoVotePost, id, "upvotes", upvotes);
            const updatedUser: User = {
              ...userData,
              upvotedPosts: userData.upvotedPosts.filter(
                (pid: string) => pid !== id
              ),
            };
            await wrapApiCall(patchUser, {
              userID: userData.id,
              field: "upvotedPosts",
              newValue: updatedUser.upvotedPosts,
              onSuccess: () => {},
              onError: (err: any) => {
                throw err;
              },
            });
          }
          // Apply downvote.
          await wrapApiCall(patchVotePost, id, "downvotes", downvotes, 1);
          const updatedUser: User = {
            ...userData,
            downVotedPosts: [...userData.downVotedPosts, id],
          };
          await wrapApiCall(patchUser, {
            userID: userData.id,
            field: "downVotedPosts",
            newValue: updatedUser.downVotedPosts,
            onSuccess: () => {},
            onError: (err: any) => {
              throw err;
            },
          });
        }
      } else if (type === "report") {
        if (reported) {
          // Undo report.
          await wrapApiCall(patchUndoVotePost, id, "reports", reports);
          const updatedUser: User = {
            ...userData,
            reportedPosts: userData.reportedPosts.filter(
              (pid: string) => pid !== id
            ),
          };
          await wrapApiCall(patchUser, {
            userID: userData.id,
            field: "reportedPosts",
            newValue: updatedUser.reportedPosts,
            onSuccess: () => {},
            onError: (err: any) => {
              throw err;
            },
          });
        } else {
          // Apply report.
          await wrapApiCall(patchVotePost, id, "reports", reports, 1);
          const updatedUser: User = {
            ...userData,
            reportedPosts: [...userData.reportedPosts, id],
          };
          await wrapApiCall(patchUser, {
            userID: userData.id,
            field: "reportedPosts",
            newValue: updatedUser.reportedPosts,
            onSuccess: () => {},
            onError: (err: any) => {
              throw err;
            },
          });
        }
      }

      // After successfully updating votes/reports and user info,
      // trigger a fetch to reload the post data (vote counts, etc.) from the backend.
      await fetchPosts();
    } catch (error: any) {
      const err: errorProps = {
        id: "fetching Paginated Posts Error",
        userFreindlyMessage: "An error occurred while fetching posts.",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        error: error instanceof Error ? error : new Error("Unknown error"),
      };
      enqueueSnackbar({ variant: "error", ...err });
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <Stack
      gap={1}
      width={"100%"}
      className={pageVariant ? "" : "standardBorder"}
      py={2}
      px={pageVariant ? 0 : 2}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        <Link href={`posts/${id}`} target="_blank" rel="noopener">
          <Typography fontSize={16} fontWeight="bold">
            {title}
          </Typography>
        </Link>
        <Chip size="small" label={formattedDate} variant="outlined" />
        {isPostAuthoredByCurrentUser && (
          <Chip
            size="small"
            label="Your Post"
            variant="outlined"
            color="success"
          />
        )}
      </Stack>
      <Box>
        <Stack gap={1}>
          <Link href={resource} target="_blank" rel="noopener">
            <Stack
              gap={1}
              width={"fit-content"}
              px={1}
              flexDirection={"row"}
              sx={{
                backgroundColor: "#ffffff21",
                borderRadius: "5px",
              }}
            >
              <LinkIcon />
              <TextGlitchEffect
                text={formattedResource}
                speed={40}
                letterCase="lowercase"
                className="resourceLink"
                type="alphanumeric"
              />
            </Stack>
          </Link>

          <Box
            sx={{
              position: "relative",
              maxHeight: pageVariant ? "100%" : "100px",
              overflow: "hidden",
            }}
            ref={descRef}
          >
            <Typography>{description}</Typography>
            {isOverflow && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "100px",
                  background: "linear-gradient(transparent, black)",
                }}
              />
            )}
          </Box>
        </Stack>
        <Button
          onClick={() => handleVote("upvote")}
          disabled={isVoting}
          startIcon={
            <InsertEmotionIcon
              color={voteStatus === "up" ? "success" : "inherit"}
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
              color={voteStatus === "down" ? "error" : "inherit"}
            />
          }
        >
          {downvotes}
        </Button>
        <Button
          onClick={() => handleVote("report")}
          disabled={isVoting}
          startIcon={
            <ErrorOutlinedIcon color={reported ? "warning" : "inherit"} />
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
};

export default PostPreview;
