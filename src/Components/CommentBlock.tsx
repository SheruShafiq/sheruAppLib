import { Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";

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
  // useEffect(() => {
  //   if (!imageUrl) {
  //     fetchImage().then((url) => {
  //       setImageUrl(url);
  //     });
  //   }
  // }, [imageURL]);
  return (
    <Stack
      sx={{
        borderLeft: depth > 0 ? "1px solid white" : "none",
      }}
      ml={depth > 0 ? 2 : 0}
    >
      <Stack
        gap={1}
        width="100%"
        pt={2}
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
        </Stack>
        <p>{commentContents}</p>
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
              depth={depth + 1} // increment depth for nested replies
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export default CommentBlock;
