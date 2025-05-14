"use client";

import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Divider,
  Avatar,
} from "@mui/material";
import InsertEmotionIcon from "@mui/icons-material/InsertEmoticon";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import LinkIcon from "@mui/icons-material/Link";
import { useSnackbar } from "notistack";
import Link from "next/link";
import { patchVotePost, patchUndoVotePost, patchUser } from "@/lib/api";
import { Category, User, Post } from "@/lib/definitions";
import ReadMore from "./ReadMore";
import { useRouter } from "next/navigation";

// Helper function to format date like Reddit style
const formatDateRedditStyle = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffSeconds = Math.floor(diffTime / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffMonths / 12);

  if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffMonths < 12) return `${diffMonths} months ago`;
  return `${diffYears} years ago`;
};

interface PostPreviewProps {
  post: Post;
  isLoggedIn: boolean;
  userData?: User;
  refreshUserData?: (id: string) => void;
  refreshPost?: (id: string) => void;
  categories: Category[];
  previewMode?: boolean;
}

function PostPreview({
  post,
  isLoggedIn,
  userData,
  refreshPost,
  refreshUserData,
  categories,
  previewMode = false,
}: PostPreviewProps) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [loadingUpvote, setLoadingUpvote] = useState(false);
  const [loadingDownvote, setLoadingDownvote] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);

  const category = categories?.find(
    (cat) => cat.id === parseInt(post.categoryID)
  );

  const isUpvoted = userData?.upvotedPosts?.includes(post.id || "");
  const isDownvoted = userData?.downVotedPosts?.includes(post.id || "");

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!isLoggedIn || !userData) {
      enqueueSnackbar({
        variant: "warning",
        message: "You must be logged in to vote",
      });
      return;
    }

    try {
      const loading =
        voteType === "upvote" ? setLoadingUpvote : setLoadingDownvote;
      loading(true);

      // Check if already voted
      const isCurrentlyVoted = voteType === "upvote" ? isUpvoted : isDownvoted;
      const oppositeVoteField =
        voteType === "upvote" ? "downVotedPosts" : "upvotedPosts";
      const isOppositeVoted = voteType === "upvote" ? isDownvoted : isUpvoted;

      // If already voted the same way, undo the vote
      if (isCurrentlyVoted) {
        await patchUndoVotePost(
          post.id!,
          voteType,
          userData.id!,
          () => {
            if (refreshPost) refreshPost(post.id!);
            if (refreshUserData) refreshUserData(userData.id!);
            enqueueSnackbar({
              variant: "success",
              message: `${voteType} removed`,
            });
          },
          (error) => {
            enqueueSnackbar({
              variant: "error",
              message: `Failed to remove ${voteType}`,
            });
          }
        );
      } else {
        // If voted the opposite way, first undo that vote
        if (isOppositeVoted) {
          await patchUndoVotePost(
            post.id!,
            voteType === "upvote" ? "downvote" : "upvote",
            userData.id!,
            () => {},
            (error) => {}
          );
        }

        // Then apply the new vote
        await patchVotePost(
          post.id!,
          voteType,
          userData.id!,
          () => {
            if (refreshPost) refreshPost(post.id!);
            if (refreshUserData) refreshUserData(userData.id!);
            enqueueSnackbar({
              variant: "success",
              message: `Post ${voteType}d successfully!`,
            });
          },
          (error) => {
            enqueueSnackbar({
              variant: "error",
              message: `Failed to ${voteType} post`,
            });
          }
        );
      }
    } finally {
      const loading =
        voteType === "upvote" ? setLoadingUpvote : setLoadingDownvote;
      loading(false);
    }
  };

  const handleReport = () => {
    if (!isLoggedIn || !userData) {
      enqueueSnackbar({
        variant: "warning",
        message: "You must be logged in to report",
      });
      return;
    }

    setLoadingReport(true);

    // Check if already reported
    const hasReported = userData.reportedPosts?.includes(post.id || "");

    if (hasReported) {
      enqueueSnackbar({
        variant: "warning",
        message: "You've already reported this post",
      });
      setLoadingReport(false);
      return;
    }

    // Add post ID to user's reported posts
    patchUser(
      userData.id!,
      { reportedPosts: [...(userData.reportedPosts || []), post.id] },
      () => {
        if (refreshUserData) refreshUserData(userData.id!);
        enqueueSnackbar({
          variant: "success",
          message: "Post reported successfully",
        });
      },
      (error) => {
        enqueueSnackbar({ variant: "error", message: "Failed to report post" });
      }
    ).finally(() => setLoadingReport(false));
  };

  return (
    <Box
      sx={{
        padding: "16px",
        marginBottom: "8px",
        borderRadius: "8px",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderColor: "rgba(255, 255, 255, 0.2)",
        },
      }}
    >
      <Stack direction="row" gap={2} alignItems="flex-start">
        <Stack alignItems="center" spacing={1}>
          <Button
            onClick={() => handleVote("upvote")}
            disabled={loadingUpvote || loadingDownvote || !isLoggedIn}
            sx={{
              minWidth: "40px",
              color: isUpvoted ? "success.main" : "text.primary",
            }}
          >
            {loadingUpvote ? (
              <CircularProgress size={20} />
            ) : (
              <InsertEmotionIcon />
            )}
          </Button>
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              color: isUpvoted
                ? "success.main"
                : isDownvoted
                  ? "error.main"
                  : "text.primary",
            }}
          >
            {post.upvotes - post.downvotes}
          </Typography>
          <Button
            onClick={() => handleVote("downvote")}
            disabled={loadingUpvote || loadingDownvote || !isLoggedIn}
            sx={{
              minWidth: "40px",
              color: isDownvoted ? "error.main" : "text.primary",
            }}
          >
            {loadingDownvote ? (
              <CircularProgress size={20} />
            ) : (
              <SentimentVeryDissatisfiedIcon />
            )}
          </Button>
        </Stack>

        <Divider orientation="vertical" flexItem />

        <Stack spacing={1} flex={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                size="small"
                label={category?.name || "Unknown"}
                color="primary"
                variant="outlined"
                sx={{ borderRadius: "4px" }}
              />
              <Typography variant="caption" color="text.secondary">
                Posted {formatDateRedditStyle(post.dateCreated)} by{" "}
                {post.authorID}
              </Typography>
            </Stack>
          </Stack>

          <Link
            href={`/sauce/posts/${post.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
            onClick={(e) => {
              // Handle click if in preview mode
              if (previewMode) {
                e.preventDefault();
              }
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "1.1rem",
                fontWeight: "bold",
                "&:hover": {
                  color: "primary.main",
                  cursor: "pointer",
                },
              }}
            >
              {post.title}
            </Typography>
          </Link>

          <ReadMore>
            <Typography variant="body2">{post.description}</Typography>
          </ReadMore>

          {post.resource && (
            <Link
              href={post.resource}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <LinkIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography
                variant="body2"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "300px",
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              >
                {post.resource}
              </Typography>
            </Link>
          )}

          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              size="small"
              startIcon={<MessageOutlinedIcon />}
              onClick={() => router.push(`/sauce/posts/${post.id}`)}
              sx={{ color: "text.secondary" }}
            >
              {post.comments?.length || 0} Comments
            </Button>
            <Button
              size="small"
              startIcon={
                loadingReport ? (
                  <CircularProgress size={16} />
                ) : (
                  <ErrorOutlinedIcon />
                )
              }
              onClick={handleReport}
              disabled={loadingReport || !isLoggedIn}
              sx={{ color: "text.secondary" }}
            >
              Report
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

export default PostPreview;
