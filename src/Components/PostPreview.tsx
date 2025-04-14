import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Typography,
  Box,
  Button,
  Link,
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
import { TextGlitchEffect } from "./TextGlitchEffect";
import {
  patchVotePost,
  patchUndoVotePost,
  patchUser,
  fetchUserById,
} from "../APICalls";
import { Category, errorProps, User } from "../../dataTypeDefinitions";
import IOSLoader from "./IOSLoader";
import ReadMore from "./ReadMore";
import { useNavigate } from "react-router-dom";
import { GIFs } from "../assets/GIFs";
import { formatDateRedditStyle } from "../globalFunctions";

interface PostPreviewProps {
  id: string;
  title: string;
  resource: string;
  categories: Category[];
  description: string;
  upvotes: number;
  downvotes: number;
  reports: number;
  categoryID: number | string;
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
  authorID: string;
}

type LoadingAction = "upvote" | "downvote" | "report" | null;

const PostPreview: React.FC<PostPreviewProps> = ({
  id,
  title,
  categories,
  resource,
  description,
  upvotes,
  downvotes,
  reports,
  categoryID,
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
  authorID,
}) => {
  const history = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const formattedTitle = title.length > 20 ? `${title.slice(0, 20)}...` : title;
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);
  const [voteStatus, setVoteStatus] = useState<"up" | "down" | "none">("none");
  const [reported, setReported] = useState(false);

  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(downvotes);
  const [localReports, setLocalReports] = useState(reports);
  const [authorData, setAuthorData] = useState<User | null>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    if (descRef.current) {
      setIsOverflow(
        descRef.current.scrollHeight > descRef.current.clientHeight
      );
    }
  }, [description]);

  useEffect(() => {
    if (upvotedByCurrentUser) setVoteStatus("up");
    else if (downvotedByCurrentUser) setVoteStatus("down");
    else setVoteStatus("none");

    setReported(reportedByCurrentUser);

    setLocalUpvotes(upvotes);
    setLocalDownvotes(downvotes);
    setLocalReports(reports);
  }, [
    upvotedByCurrentUser,
    downvotedByCurrentUser,
    reportedByCurrentUser,
    upvotes,
    downvotes,
    reports,
  ]);

  const formattedDate = formatDateRedditStyle(new Date(dateCreated));
  const formattedResource =
    resource && resource.length > 20 ? `${resource.slice(0, 20)}...` : resource;
  /*
    Voting logic using PATCH calls:
    - For upvote and downvote, if the user clicks on the same vote they already made, we undo it.
    - If they switch (for instance from downvote to upvote) we first undo the previous vote then apply the new vote.
    - After a successful API call, we update the local voteStatus and local vote count (using the returned new value)
      so that subsequent calls use the updated counts.
    - Also, we update the user votes using patchUser.
    - Once done, we call fetchPosts() to re-sync with the backend.
  */
  const handleVote = async (type: "upvote" | "downvote" | "report") => {
    if (!isLoggedIn) {
      enqueueSnackbar("Please log in to vote", { variant: "login" });
      return;
    }
    if (loadingAction) return;
    setLoadingAction(type);
    try {
      if (type === "upvote") {
        if (voteStatus === "up") {
          const response = await patchUndoVotePost(id, "upvotes", localUpvotes);
          setLocalUpvotes(response.upvotes);
          setVoteStatus("none");

          await patchUser({
            userID: userData.id!,
            field: "upvotedPosts",
            newValue: userData.upvotedPosts.filter((pid: string) => pid !== id),
            onSuccess: () => {},
            onError: (err: any) => {
              throw err;
            },
          });
        } else {
          if (voteStatus === "down") {
            const undoResponse = await patchUndoVotePost(
              id,
              "downvotes",
              localDownvotes
            );
            setLocalDownvotes(undoResponse.downvotes);
            const updatedUser = userData.downVotedPosts.filter(
              (pid: string) => pid !== id
            );
            await patchUser({
              userID: userData.id!,
              field: "downVotedPosts",
              newValue: updatedUser,
              onSuccess: () => {},
              onError: (err: any) => {
                throw err;
              },
            });
          }

          const response = await patchVotePost(id, "upvotes", localUpvotes, 1);
          setLocalUpvotes(response.upvotes);
          setVoteStatus("up");
          const updatedUser = [...userData.upvotedPosts, id];

          await patchUser({
            userID: userData.id!,
            field: "upvotedPosts",
            newValue: updatedUser,
            onSuccess: () => {},
            onError: (err: any) => {
              throw err;
            },
          });
        }
      } else if (type === "downvote") {
        if (voteStatus === "down") {
          const response = await patchUndoVotePost(
            id,
            "downvotes",
            localDownvotes
          );
          setLocalDownvotes(response.downvotes);
          setVoteStatus("none");
          const updatedUser = userData.downVotedPosts.filter(
            (pid: string) => pid !== id
          );

          await patchUser({
            userID: userData.id!,
            field: "downVotedPosts",
            newValue: updatedUser,
            onSuccess: () => {},
            onError: (err: any) => {
              throw err;
            },
          });
        } else {
          if (voteStatus === "up") {
            const undoResponse = await patchUndoVotePost(
              id,
              "upvotes",
              localUpvotes
            );
            setLocalUpvotes(undoResponse.upvotes);
            const updatedUser = userData.upvotedPosts.filter(
              (pid: string) => pid !== id
            );
            await patchUser({
              userID: userData.id!,
              field: "upvotedPosts",
              newValue: updatedUser,
              onSuccess: () => {},
              onError: (err: any) => {
                throw err;
              },
            });
          }

          const response = await patchVotePost(
            id,
            "downvotes",
            localDownvotes,
            1
          );
          setLocalDownvotes(response.downvotes);
          setVoteStatus("down");
          const updatedUser = {
            downVotedPosts: [...userData.downVotedPosts, id],
          };
          await patchUser({
            userID: userData.id!,
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
          const response = await patchUndoVotePost(id, "reports", localReports);
          setLocalReports(response.reports);
          setReported(false);
          const updatedUser = userData.reportedPosts.filter(
            (pid: string) => pid !== id
          );
          await patchUser({
            userID: userData.id!,
            field: "reportedPosts",
            newValue: updatedUser,
            onSuccess: () => {},
            onError: (err: any) => {
              throw err;
            },
          });
        } else {
          const response = await patchVotePost(id, "reports", localReports, 1);
          setLocalReports(response.reports);
          setReported(true);
          const updatedUser = [...userData.reportedPosts, id];
          await patchUser({
            userID: userData.id!,
            field: "reportedPosts",
            newValue: updatedUser,
            onSuccess: () => {},
            onError: (err: any) => {
              throw err;
            },
          });
        }
      }

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
      setLoadingAction(null);
    }
  };
  const randomGIFIndex = useMemo(
    () => Math.floor(Math.random() * Math.min(GIFs.length, 200)),
    []
  );
  useEffect(() => {
    fetchUserById(
      authorID,
      (userData) => {
        setAuthorData(userData);
      },
      (error: any) => {
        const err: errorProps = {
          id: "fetching author data Error",
          userFreindlyMessage:
            "An error occurred while fetching post's author data.",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
          error: error instanceof Error ? error : new Error("Unknown error"),
        };
        enqueueSnackbar({ variant: "error", ...err });
      }
    );
  }, [authorID]);
  return (
    <Stack
      gap={1}
      width={"100%"}
      className={pageVariant ? "" : "standardBorder"}
      py={1}
      px={pageVariant ? 0 : 2}
    >
      <Stack direction="row" alignItems="center" gap={1} maxWidth={"100%"}>
        {pageVariant ? (
          <Stack gap={1}>
            <Stack direction={"row"} gap={1} alignItems={"center"}>
              <Avatar
                sx={{ width: 14, height: 14 }}
                src={GIFs[randomGIFIndex]}
              />
              <Link href={`/user/${id}`} rel="noopener">
                <Typography fontSize={14} width={"fit-content"}>
                  {authorData?.displayName === userData?.displayName
                    ? "You"
                    : authorData?.displayName}
                </Typography>
              </Link>
              <Chip size="small" label={formattedDate} variant="outlined" />
            </Stack>
            <Typography
              fontSize={24}
              fontWeight="bold"
              sx={{
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              {pageVariant ? title : formattedTitle}
            </Typography>
          </Stack>
        ) : (
          <Link href={`/posts/${id}`} rel="noopener" style={{ flex: 1 }}>
            <Typography
              fontSize={24}
              fontWeight="bold"
              sx={{
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              {pageVariant ? title : formattedTitle}
            </Typography>
          </Link>
        )}
        {!pageVariant && (
          <Chip size="small" label={formattedDate} variant="outlined" />
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
              alignItems={"center"}
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
            <Box py={1}>
              <ReadMore
                text={description}
                maxLength={pageVariant ? 300 : 1000}
              />
            </Box>
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
          disabled={!!loadingAction}
          sx={{ mb: loadingAction === "upvote" ? "-3px" : "0px" }}
          startIcon={
            loadingAction === "upvote" ? (
              <IOSLoader />
            ) : (
              <InsertEmotionIcon
                color={voteStatus === "up" ? "success" : "inherit"}
              />
            )
          }
        >
          {localUpvotes}
        </Button>
        <Button
          onClick={() => handleVote("downvote")}
          disabled={!!loadingAction}
          sx={{ mb: loadingAction === "downvote" ? "-3px" : "0px" }}
          startIcon={
            loadingAction === "downvote" ? (
              <IOSLoader />
            ) : (
              <SentimentVeryDissatisfiedIcon
                color={voteStatus === "down" ? "error" : "inherit"}
              />
            )
          }
        >
          {localDownvotes}
        </Button>
        <Button
          onClick={() => handleVote("report")}
          disabled={!!loadingAction}
          sx={{ mb: loadingAction === "report" ? "-3px" : "0px" }}
          startIcon={
            loadingAction === "report" ? (
              <IOSLoader />
            ) : (
              <ErrorOutlinedIcon color={reported ? "warning" : "inherit"} />
            )
          }
        >
          {localReports}
        </Button>
        <Button>{categories[Number(categoryID) - 1]?.name}</Button>
        <Button
          onClick={() => {
            if (!pageVariant) {
              history(`/posts/${id}`);
            }
          }}
          sx={{
            pointerEvents: pageVariant ? "none" : "auto",
          }}
          startIcon={<MessageOutlinedIcon color="secondary" />}
        >
          {commentsCount}
        </Button>
      </Box>
    </Stack>
  );
};

export default PostPreview;
