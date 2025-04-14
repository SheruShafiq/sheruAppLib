import { Button, Collapse, Stack, TextField, Typography } from "@mui/material";
import React, { useState, useEffect, useMemo } from "react";
import { useSnackbar } from "notistack";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GIFs } from "../assets/GIFs";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import { patchVoteComment, patchUndoVoteComment, patchUser } from "../APICalls";
import IOSLoader from "./IOSLoader";
import SendIcon from "@mui/icons-material/Send";
import { formatDateRedditStyle } from "./PostPreview";
import ReadMore from "./ReadMore";

function CommentBlock({
  id,
  dateCreated,
  userName,
  commentContents,
  replies,
  depth = 0,
  imageURL,
  amIaReply,
  isLoggedIn,
  likes,
  likedByCurrentUser,
  dislikes,
  dislikedByCurrentUser,
  userData,
  handleCommentCreate,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);
  const [likingComment, setLikingComment] = useState(false);

  const [voteStatus, setVoteStatus] = useState<"up" | "down" | "none">("none");
  const [localLikes, setLocalLikes] = useState(likes);
  const [localDislikes, setLocalDislikes] = useState(dislikes);
  const [loadingAction, setLoadingAction] = useState<
    "upvote" | "downvote" | null
  >(null);

  useEffect(() => {
    if (likedByCurrentUser) setVoteStatus("up");
    else if (dislikedByCurrentUser) setVoteStatus("down");
    else setVoteStatus("none");
    setLocalLikes(likes);
    setLocalDislikes(dislikes);
  }, [likedByCurrentUser, dislikedByCurrentUser, likes, dislikes]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const gipyAPIKey = import.meta.env.REACT_APP_GIPHY_API_KEY;
  async function fetchImage() {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/random?api_key=${gipyAPIKey}&tag=cyberpunkProfilePicture&rating=g`
    );
    const data = await response.json();
    if (response.ok) {
      return data.data.images.original.url;
    } else {
      return null;
    }
  }
  const [imageUrl, setImageUrl] = useState(imageURL);
  const randomGIFIndex = useMemo(
    () => Math.floor(Math.random() * Math.min(GIFs.length, 200)),
    []
  );

  async function handleCommentVote(type: "upvote" | "downvote") {
    if (!isLoggedIn) {
      enqueueSnackbar("Please log in to vote", { variant: "login" });
      return;
    }
    if (loadingAction) return;
    setLoadingAction(type);
    try {
      if (type === "upvote") {
        if (voteStatus === "up") {
          const response = await patchUndoVoteComment(id, "likes", localLikes);
          setLocalLikes(response.likes);
          setVoteStatus("none");
          await patchUser({
            userID: userData.id,
            field: "likedComments",
            newValue: userData.likedComments.filter(
              (cid: string) => String(cid) !== String(id)
            ),
            onSuccess: () => {},
            onError: (err: any) => {
              throw err;
            },
          });
        } else {
          if (voteStatus === "down") {
            const undoResponse = await patchUndoVoteComment(
              id,
              "dislikes",
              localDislikes
            );
            setLocalDislikes(undoResponse.dislikes);
            await patchUser({
              userID: userData.id,
              field: "dislikedComments",
              newValue: userData.dislikedComments.filter(
                (cid: string) => String(cid) !== String(id)
              ),
              onSuccess: () => {},
              onError: (err: any) => {
                throw err;
              },
            });
          }
          const response = await patchVoteComment(id, "likes", localLikes, 1);
          setLocalLikes(response.likes);
          setVoteStatus("up");
          const updatedLiked = [...userData.likedComments];
          if (!updatedLiked.includes(id)) updatedLiked.push(id);
          await patchUser({
            userID: userData.id,
            field: "likedComments",
            newValue: updatedLiked,
            onSuccess: () => {},
            onError: (err: any) => {
              throw err;
            },
          });
        }
      } else if (type === "downvote") {
        if (voteStatus === "down") {
          const response = await patchUndoVoteComment(
            id,
            "dislikes",
            localDislikes
          );
          setLocalDislikes(response.dislikes);
          setVoteStatus("none");
          await patchUser({
            userID: userData.id,
            field: "dislikedComments",
            newValue: userData.dislikedComments.filter(
              (cid: string) => String(cid) !== String(id)
            ),
            onSuccess: () => {},
            onError: (err: any) => {
              throw err;
            },
          });
        } else {
          if (voteStatus === "up") {
            const undoResponse = await patchUndoVoteComment(
              id,
              "likes",
              localLikes
            );
            setLocalLikes(undoResponse.likes);
            await patchUser({
              userID: userData.id,
              field: "likedComments",
              newValue: userData.likedComments.filter(
                (cid: string) => String(cid) !== String(id)
              ),
              onSuccess: () => {},
              onError: (err: any) => {
                throw err;
              },
            });
          }
          const response = await patchVoteComment(
            id,
            "dislikes",
            localDislikes,
            1
          );
          setLocalDislikes(response.dislikes);
          setVoteStatus("down");
          const updatedDisliked = [...userData.dislikedComments];
          if (!updatedDisliked.includes(id)) updatedDisliked.push(id);
          await patchUser({
            userID: userData.id,
            field: "dislikedComments",
            newValue: updatedDisliked,
            onSuccess: () => {},
            onError: (err: any) => {
              throw err;
            },
          });
        }
      }
    } catch (error: any) {
      enqueueSnackbar("Error updating vote", { variant: "error" });
    } finally {
      setLoadingAction(null);
    }
  }
  const [creatingReply, setCreatingReply] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [openReply, setOpenReply] = useState(false);

  return (
    <Stack
      sx={{
        position: "relative",
        ml: depth > 0 ? "45px" : 0,
        pl: amIaReply ? 2 : 0,
      }}
    >
      {/* ---- The main comment row ---- */}
      <Stack direction="row" spacing={2} py={1}>
        <Avatar src={imageUrl || GIFs[randomGIFIndex]} alt={userName} />
        <Stack gap={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              fontWeight="bold"
              color={
                userData?.displayName === userName ? "secondary" : "primary"
              }
            >
              {userData?.displayName === userName ? "You" : userName}
            </Typography>
            <Chip
              size="small"
              label={formatDateRedditStyle(new Date(dateCreated))}
              variant="outlined"
            />
          </Stack>
          <ReadMore text={commentContents} maxLength={200} />

          {/* If there are replies, add a toggle button to expand/collapse */}
          <Stack direction="row" alignItems="center">
            {replies.length > 0 && (
              <Stack
                direction="row"
                alignItems="center"
                onClick={handleExpandClick}
                sx={{
                  cursor: "pointer",
                  width: "fit-content",
                  p: 0.5,
                  borderRadius: 1,
                }}
                spacing={0.5}
                className="secondaryButtonHoverStyles"
              >
                <ExpandMoreIcon
                  sx={{
                    transition: "transform 0.2s",
                    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                    color: "secondary.main",
                  }}
                />
                <Typography variant="body2" color="secondary">
                  {expanded
                    ? "Hide replies"
                    : `View replies (${replies.length})`}
                </Typography>
              </Stack>
            )}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleCommentVote("upvote");
              }}
              sx={{ mb: loadingAction === "upvote" ? "-3px" : "0px" }}
              disabled={!!loadingAction}
              startIcon={
                loadingAction === "upvote" ? (
                  <IOSLoader />
                ) : (
                  <FavoriteIcon
                    color={voteStatus === "up" ? "secondary" : "inherit"}
                  />
                )
              }
            >
              {localLikes}
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleCommentVote("downvote");
              }}
              sx={{ mb: loadingAction === "downvote" ? "-3px" : "0px" }}
              disabled={!!loadingAction}
              startIcon={
                loadingAction === "downvote" ? (
                  <IOSLoader />
                ) : (
                  <HeartBrokenIcon
                    color={voteStatus === "down" ? "warning" : "inherit"}
                  />
                )
              }
            >
              {localDislikes}
            </Button>
            <Button
              size="small"
              onClick={() => {
                setOpenReply(!openReply);
                setCreatingReply(false);
              }}
            >
              {openReply ? "Cancel" : "Reply"}
            </Button>
          </Stack>
          <Collapse in={openReply} timeout="auto" unmountOnExit>
            <Stack gap={2} width={"100%"}>
              <TextField
                label={
                  !isLoggedIn ? "You need to login to comment" : "Add a comment"
                }
                multiline
                disabled={!isLoggedIn}
                variant="standard"
                onChange={(e) => {
                  setNewComment(e.target.value);
                }}
                fullWidth
              />
              <Button
                onClick={() => {
                  handleCommentCreate({
                    reply: id,
                    replies: replies,
                    comment: newComment,
                  });
                  setOpenReply(false);
                }}
                disabled={!isLoggedIn || creatingReply || newComment.length < 1}
                color="secondary"
                className="secondaryButtonHoverStyles"
                sx={{ mb: creatingReply ? "-3px" : "0px" }}
                variant="outlined"
                size="small"
              >
                {creatingReply ? <IOSLoader /> : <SendIcon />}
              </Button>
            </Stack>
          </Collapse>
        </Stack>
      </Stack>

      {/* ---- Replies section ---- */}
      {replies.length > 0 && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {replies.map((reply) => (
            <CommentBlock
              handleCommentCreate={handleCommentCreate}
              id={reply.id}
              amIaReply={true}
              imageURL={reply.imageURL}
              key={reply.id}
              dateCreated={reply.dateCreated}
              userName={reply.authorName}
              commentContents={reply.text}
              replies={reply.replies}
              depth={depth + 1}
              isLoggedIn={isLoggedIn}
              likes={reply.likes}
              likedByCurrentUser={
                userData?.dislikedComments
                  .map(String)
                  .includes(String(reply.id)) || false
              }
              dislikes={reply.dislikes}
              dislikedByCurrentUser={
                userData?.likedComments
                  .map(String)
                  .includes(String(reply.id)) || false
              }
              userData={userData}
            />
          ))}
        </Collapse>
      )}
    </Stack>
  );
}

export default CommentBlock;
