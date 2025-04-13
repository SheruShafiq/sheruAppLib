import {
  Collapse,
  IconButton,
  IconButtonProps,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  alignSelf: "flex-end",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: "rotate(0deg)",
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: "rotate(180deg)",
      },
    },
  ],
}));
function CommentBlock({
  dateCreated,
  userName,
  commentContents,
  replies,
  imageURL,
  amIaReply, // can be kept for any other style if needed
  depth = 0,
}) {
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

  const randomHardcodedGIFURLs = [
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2k5YjRqNGZxa2tnenpzcDc5cDUybWJldTFqejU3ODJwbTg3djB2cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ox91VuRSYDxKkQF3zf/giphy.gif",
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnQzenphZWEwM2xwYnZ4eTQ5ZWRkNGkwYmN5ZnA4c3d1aDAzd3RsZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/NKEt9elQ5cR68/giphy.gif",
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGc0d2M5aHhvbzViYWJ0b2lod3dxajJwNW95dmJjYTB4czR6MG5rcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3dhmyq6EKw2x7eFt4X/giphy.gif",
  ];
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Stack
      sx={{
        borderLeft: depth > 0 ? "1px solid white" : "none",
      }}
      ml={depth > 0 && amIaReply ? 2 : 0}
    >
      <Stack
        gap={1}
        width="100%"
        py={2}
        pt={depth === 0 ? 0 : 2}
        pl={1}
        sx={{
          borderBottom: "1px solid white",
        }}
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
            }}
            alt={userName}
            src={randomHardcodedGIFURLs[depth]}
          />
          <Stack gap={0.5}>
            <Stack alignItems="center" gap={1} direction={"row"}>
              <Typography fontWeight={600}>{userName}</Typography>
              <Chip
                size="small"
                label={new Date(dateCreated).toLocaleDateString()}
                variant="outlined"
              />
            </Stack>
            <span>{commentContents}</span>
          </Stack>
          {replies && replies.length > 0 && (
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          )}
        </Stack>
      </Stack>
      {replies && replies.length > 0 && (
        <Stack direction={"row"} alignItems={"center"} gap={1}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            {replies.map((reply) => (
              <CommentBlock
                key={reply.id}
                dateCreated={reply.dateCreated}
                userName={reply.authorName}
                commentContents={reply.text}
                replies={reply.replies}
                imageURL={reply.imageURL}
                amIaReply={true}
                depth={depth + 1}
              />
            ))}
          </Collapse>
        </Stack>
      )}
    </Stack>
  );
}

export default CommentBlock;
