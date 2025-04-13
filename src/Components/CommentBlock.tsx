import { Collapse, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function CommentBlock({
  dateCreated,
  userName,
  commentContents,
  replies,
  depth = 0,
  imageURL,
  amIaReply,
}) {
  const [expanded, setExpanded] = useState(false);

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
  return (
    <Stack
      sx={{
        position: "relative",
        ml: depth > 0 ? 3 : 0,
        pl: 2,
        borderLeft: depth > 0 ? "1px dotted #ccc" : "none",
      }}
    >
      {/* ---- The main comment row ---- */}
      <Stack direction="row" spacing={2} py={1}>
        <Avatar alt={userName} />
        <Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography fontWeight="bold">{userName}</Typography>
            <Chip
              size="small"
              label={new Date(dateCreated).toLocaleDateString()}
              variant="outlined"
            />
          </Stack>
          <Typography variant="body2">{commentContents}</Typography>

          {/* If there are replies, add a toggle button to expand/collapse */}
          {replies.length > 0 && (
            <Stack
              direction="row"
              alignItems="center"
              onClick={handleExpandClick}
              sx={{
                cursor: "pointer",
                mt: 1,
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
                {expanded ? "Hide replies" : `View replies (${replies.length})`}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>

      {/* ---- Replies section ---- */}
      {replies.length > 0 && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {replies.map((reply) => (
            <CommentBlock
              amIaReply={true}
              imageURL={reply.imageURL}
              key={reply.id}
              dateCreated={reply.dateCreated}
              userName={reply.authorName}
              commentContents={reply.text}
              replies={reply.replies}
              depth={depth + 1}
            />
          ))}
        </Collapse>
      )}
    </Stack>
  );
}

export default CommentBlock;
