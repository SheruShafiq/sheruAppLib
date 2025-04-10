import { IconButton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import { likeComment, undoLikeComment, getCommentByID } from "../APICalls";
import { useSnackbar } from "notistack";
import { useGlitch } from "react-powerglitch";

function CommentBlock({
  dateCreated,
  userName,
  commentContents,
  replies,
  imageURL,
  amIaReply, // can be kept for any other style if needed
  depth = 0,
  likes,
  userData,
  likedByCurrentUser,
  commentID,
}) {
  const [imageUrl, setImageUrl] = useState(imageURL);
  const enqueueSnackbar = useSnackbar();
  const [liked, setLiked] = useState(likedByCurrentUser);
  const [likesCount, setLikesCount] = useState(likes);
  const glitch = useGlitch({
    timing: {
      iterations: 1,
      easing: "ease-in-out",
      duration: 1000,
    },
    glitchTimeSpan: {
      start: 0,
      end: 0.5,
    },
    playMode: "click",
  });
  return (
    <Stack
      sx={{
        borderLeft: depth > 0 ? "1px solid white" : "none",
      }}
      ml={2}
    >
      <Stack
        gap={1}
        width="100%"
        py={1}
        pl={depth * 1}
        sx={{
          borderBottom: "1px solid white",
        }}
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <Avatar
            sx={{
              width: 20,
              height: 20,
            }}
            alt={userName}
            src={imageUrl}
          />
          <Typography fontWeight={600}>{userName}</Typography>
          <Chip
            size="small"
            label={new Date(dateCreated).toLocaleDateString()}
            variant="outlined"
          />
          <IconButton
            ref={glitch.ref}
            size="small"
            sx={{
              width: "fit-content",
            }}
            onClick={() => {
              if (!liked) {
                likeComment(
                  commentID,
                  userData?.id,
                  () => {
                    setLiked(true);
                    getCommentByID(
                      commentID,
                      (comment) => {
                        setLikesCount(comment.likes);
                      },
                      (error) => {
                        enqueueSnackbar(error.message, {
                          variant: "error",
                        });
                      }
                    );
                  },
                  (error) => {
                    enqueueSnackbar(error.message, {
                      variant: "error",
                    });
                  }
                );
              } else {
                undoLikeComment(
                  commentID,
                  userData?.id,
                  () => {
                    setLiked(false);
                    getCommentByID(
                      commentID,
                      (comment) => {
                        setLikesCount(comment.likes);
                      },
                      (error) => {
                        enqueueSnackbar(error.message, {
                          variant: "error",
                        });
                      }
                    );
                  },
                  (error) => {
                    enqueueSnackbar(error.message, {
                      variant: "error",
                    });
                  }
                );
              }
            }}
          >
            <FavoriteOutlinedIcon
              sx={{
                fontSize: 16,
                mr: 0.5,
              }}
              color={liked ? "error" : "primary"}
            />
            <Typography
              fontSize={16}
              sx={{
                color: "white",
              }}
              fontWeight={600}
            >
              {likesCount}
            </Typography>
          </IconButton>
        </Stack>
        <Stack>
          <Typography>{commentContents}</Typography>
        </Stack>
      </Stack>
      {replies && replies.length > 0 && (
        <Stack>
          {replies.map((reply) => (
            <CommentBlock
              key={reply.id}
              dateCreated={reply?.dateCreated}
              userName={reply?.displayName}
              commentContents={reply?.text}
              replies={reply?.replies}
              imageURL={reply?.imageURL}
              amIaReply={true}
              depth={depth + 1}
              likes={reply?.likes}
              userData={userData}
              likedByCurrentUser={userData?.likedComments
                ?.map(Number)
                .includes(Number(reply?.id))}
              commentID={reply?.id}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export default CommentBlock;
