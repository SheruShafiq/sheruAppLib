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
}) {
  const [imageUrl, setImageUrl] = useState(imageURL);
  return (
    <Stack>
      <Stack gap={1} width="100%" pt={1}>
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
        <Stack pl={2}>
          {replies.map((reply) => (
            <CommentBlock
              key={reply.id}
              dateCreated={reply?.dateCreated}
              userName={reply?.displayName}
              commentContents={reply?.text}
              replies={reply?.replies}
              imageURL={reply?.imageURL}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export default CommentBlock;
